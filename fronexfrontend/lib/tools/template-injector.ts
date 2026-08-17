import path from "path";
import { readFileSync, existsSync } from "fs";

export function getTemplateWrapper() {
  const candidates = [
    path.resolve(process.cwd(), "..", "temples servicos"),
    path.resolve(process.cwd(), "..", "..", "temples servicos"),
    path.resolve(process.cwd(), "temples servicos"),
  ];

  const dir = candidates.find((candidate) => existsSync(candidate));
  let styles = "";
  if (dir) {
    const htmlPath = path.join(dir, "temple.html");
    if (existsSync(htmlPath)) {
      const html = readFileSync(htmlPath, "utf8");
      const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
      if (styleMatch) {
        styles = styleMatch[1].trim();
      }
    }
  }

  // Fallback se não encontrar o temple.html ou não conseguir extrair o CSS
  if (!styles) {
    styles = `
      :root {
        --red: #CC1A1A; --gold: #D4AF37;
        --black: #0D0D0D; --white: #FAFAF8;
        --font: 'Sora', sans-serif; --serif: 'Instrument Serif', serif;
      }
      body { font-family: var(--font); color: var(--black); background: var(--white); }
      .doc-capa { text-align: center; margin-bottom: 40px; }
      .doc-brasao { width: 80px; margin: 0 auto 20px; }
      .doc-brasao img { max-width: 100%; }
      .doc-escola { font-weight: bold; font-size: 1.2em; text-transform: uppercase; margin-bottom: 10px; }
      .doc-divisoria { height: 2px; background: var(--red); width: 50px; margin: 20px auto; }
      .doc-disciplina { font-size: 0.9em; color: #555; }
      .doc-tema { font-family: var(--serif); font-size: 2em; font-weight: bold; margin: 20px 0; color: var(--black); }
      .doc-autores { margin-top: 30px; font-size: 0.9em; }
      .doc-section { margin-top: 30px; }
      .doc-section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
      .doc-text { line-height: 1.6; text-align: justify; margin-bottom: 15px; }
    `;
  }

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <style>
    ${styles}
    :root {
      --red: #CC1A1A;
      --gold: #D4AF37;
      --black: #0D0D0D;
      --white: #FAFAF8;
      --muted: #5f6473;
      --panel: #f8f5f1;
      --shadow: 0 20px 50px rgba(0,0,0,0.12);
    }

    * { box-sizing: border-box; }
    body { background: #f3f4f6; padding: 20px; display: flex; justify-content: center; min-height: 100vh; margin: 0; font-family: 'Sora', sans-serif; }
    #doc-content {
      width: 100%;
      max-width: 220mm;
      background: white;
      box-shadow: var(--shadow);
      color: var(--black);
    }
    .doc-page {
      width: 100%;
      min-height: 297mm;
      padding: 26mm 18mm;
      background: white;
      position: relative;
      page-break-after: always;
      break-after: page;
    }
    .doc-page:last-child { page-break-after: auto; }
    .doc-capa {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 18mm 10mm 12mm;
      background: linear-gradient(135deg, rgba(204,26,26,0.08), rgba(212,175,55,0.08));
    }
    .doc-brasao { width: 86px; margin: 0 auto 18px; }
    .doc-brasao img { max-width: 100%; border-radius: 12px; }
    .doc-escola { font-weight: 700; font-size: 1.2em; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
    .doc-disciplina { font-size: 0.9em; color: var(--muted); }
    .doc-tema { font-family: 'Instrument Serif', serif; font-size: 2.3em; font-weight: 700; margin: 18px 0; color: var(--black); }
    .doc-autores { margin-top: 26px; font-size: 0.9em; }
    .doc-section { margin-top: 28px; }
    .doc-section-title { font-weight: 700; border-bottom: 2px solid rgba(0,0,0,0.12); padding-bottom: 8px; margin-bottom: 14px; color: var(--black); }
    .doc-text { line-height: 1.7; text-align: justify; margin-bottom: 14px; color: rgba(0,0,0,0.8); }
    .doc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .doc-card { background: var(--panel); border-radius: 18px; padding: 18px; border: 1px solid rgba(0,0,0,0.05); }
    .doc-photo {
      width: 100%;
      max-height: 220px;
      object-fit: cover;
      border-radius: 16px;
      margin: 14px 0;
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }
    .doc-cta {
      display: inline-block;
      background: var(--red);
      color: white;
      padding: 10px 18px;
      border-radius: 999px;
      font-weight: 600;
      text-decoration: none;
      margin-top: 10px;
    }
    .doc-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(212,175,55,0.12);
      color: #7d5d00;
      border: 1px solid rgba(212,175,55,0.35);
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    [contenteditable="true"] {
      transition: background 0.2s, outline 0.2s;
    }
    [contenteditable="true"]:hover {
      outline: 1px dashed rgba(0,0,0,0.25);
      background: rgba(0,0,0,0.02);
      cursor: text;
    }
    [contenteditable="true"]:focus {
      outline: 2px solid var(--red);
      background: rgba(0,0,0,0.02);
    }

    @media print {
      body { background: white; padding: 0; display: block; }
      #doc-content { max-width: none; box-shadow: none; }
      .doc-page { box-shadow: none; min-height: auto; margin: 0; }
      @page { margin: 1.7cm; }
    }
  </style>
</head>
<body>
  <div id="doc-content">
    <!--INJECT_CONTENT-->
  </div>
  <script>
    document.querySelectorAll('.doc-text, .doc-tema, .doc-escola, .doc-disciplina, .doc-autores, .doc-section-title, .doc-card, .doc-badge, p, h1, h2, h3, h4, li').forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });
  </script>
</body>
</html>`;
}
