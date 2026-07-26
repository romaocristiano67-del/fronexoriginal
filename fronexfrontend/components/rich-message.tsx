"use client";

import type { ReactNode } from "react";

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; lang: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

function normalizeSource(source: string) {
  return source.replace(/\r\n/g, "\n").trim();
}

function isTableSeparator(line: string) {
  const cells = line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

  return (
    cells.length >= 2 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell) || /^:?-{3,}\s*$/.test(cell))
  );
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdown(source: string) {
  const lines = normalizeSource(source).split("\n");
  const badges: string[] = [];
  const blocks: MarkdownBlock[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const badgeMatch = trimmed.match(/^::badge\[(.+)\]$/i);
    if (badgeMatch) {
      badges.push(badgeMatch[1].trim());
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", lang, text: codeLines.join("\n") });
      continue;
    }

    const tableCandidate = lines[index + 1]?.trim() ?? "";
    if (trimmed.includes("|") && tableCandidate && isTableSeparator(tableCandidate)) {
      const tableRows: string[][] = [];
      const headers = splitTableRow(trimmed);
      index += 2;
      while (index < lines.length && lines[index].includes("|")) {
        tableRows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", headers, rows: tableRows });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^\s*(?:[-*•])\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*(?:[-*•])\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\s*(?:[-*•])\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    const paragraphLines: string[] = [trimmed];
    index += 1;
    while (index < lines.length) {
      const lookahead = lines[index].trim();
      if (
        !lookahead ||
        lookahead.startsWith("```") ||
        lookahead.startsWith(">") ||
        /^\s*(?:[-*•])\s+/.test(lookahead) ||
        /^\s*\d+\.\s+/.test(lookahead) ||
        lookahead.match(/^(#{1,3})\s+(.+)$/) ||
        lookahead.match(/^::badge\[(.+)\]$/i)
      ) {
        break;
      }

      paragraphLines.push(lookahead);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return { badges, blocks };
}

function toneForBadge(label: string) {
  const lower = label.toLowerCase();
  if (/(recomendado|conclu[ií]do|ok|ativo|act[íi]vo|seguro|sucesso)/.test(lower)) {
    return "border-emerald-400/30 bg-emerald-500/15 text-emerald-200";
  }
  if (/(alerta|aten[cç][aã]o|pendente|risco|rever|bloqueado)/.test(lower)) {
    return "border-amber-400/30 bg-amber-500/15 text-amber-100";
  }
  if (/(erro|falha|inv[aá]lido|negado|off-topic|off topic)/.test(lower)) {
    return "border-rose-400/30 bg-rose-500/15 text-rose-100";
  }
  return "border-border bg-canvas/60 text-ink";
}

function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return tokens.map((token, index) => {
    if (!token) return null;

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={`${token}-${index}`}
          className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[0.92em] text-ink"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={`${token}-${index}`} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`${token}-${index}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline decoration-accent/20 underline-offset-4 transition-colors hover:text-accent-soft"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={`${token}-${index}`}>{token}</span>;
  });
}

function renderBlock(block: MarkdownBlock, index: number) {
  if (block.type === "heading") {
    const sizeClass =
      block.level === 1
        ? "text-2xl md:text-3xl"
        : block.level === 2
          ? "text-xl md:text-2xl"
          : "text-lg md:text-xl";

    return (
      <p key={`${block.type}-${index}`} className={`font-display font-semibold leading-tight ${sizeClass}`}>
        {renderInline(block.text)}
      </p>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote
        key={`${block.type}-${index}`}
        className="border-l-2 border-accent/60 bg-canvas/50 px-4 py-3 text-sm leading-6 text-ink-muted"
      >
        {renderInline(block.text)}
      </blockquote>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag
        key={`${block.type}-${index}`}
        className={`space-y-2 text-sm leading-6 text-ink-muted ${block.ordered ? "list-decimal pl-5" : "list-disc pl-5"}`}
      >
        {block.items.map((item, itemIndex) => (
          <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "code") {
    return (
      <div
        key={`${block.type}-${index}`}
        className="overflow-hidden rounded-xl border border-border bg-surface"
      >
        {block.lang ? (
          <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {block.lang}
          </div>
        ) : null}
        <pre className="overflow-x-auto px-3 py-3 text-[12px] leading-6 text-ink">
          <code className="whitespace-pre">{block.text}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "table") {
    const columns = block.headers.length;

    return (
      <div key={`${block.type}-${index}`} className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-canvas/60">
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th
                  key={`${header}-${headerIndex}`}
                  className="whitespace-nowrap border-b border-border px-3 py-2 font-semibold text-ink"
                >
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-b border-border last:border-b-0">
                {Array.from({ length: columns }).map((_, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="align-top px-3 py-2 text-ink-muted">
                    {renderInline(row[cellIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p key={`${block.type}-${index}`} className="text-sm leading-7 text-ink-muted">
      {renderInline(block.text)}
    </p>
  );
}

export default function RichMessage({ content }: { content: string }) {
  const { badges, blocks } = parseMarkdown(content);

  return (
    <div className="space-y-3">
      {badges.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneForBadge(badge)}`}
            >
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">{blocks.map((block, index) => renderBlock(block, index))}</div>
    </div>
  );
}
