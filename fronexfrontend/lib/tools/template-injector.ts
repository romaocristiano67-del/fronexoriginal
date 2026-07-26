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
    /* Estilos específicos para o editor/impressão */
    body { background: #f3f4f6; padding: 20px; display: flex; justify-content: center; min-height: 100vh; margin: 0; }
    #doc-content { 
      background: white; 
      padding: 60px 80px; 
      width: 100%; 
      max-width: 210mm; /* A4 width */
      min-height: 297mm; /* A4 height */
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
      color: #000;
    }
    
    [contenteditable="true"] {
      transition: background 0.2s, outline 0.2s;
    }
    [contenteditable="true"]:hover { 
      outline: 1px dashed #ccc; 
      background: rgba(0,0,0,0.02);
      cursor: text;
    }
    [contenteditable="true"]:focus { 
      outline: 2px solid var(--red); 
      background: rgba(0,0,0,0.02);
    }

    @media print {
      body { background: white; padding: 0; display: block; }
      #doc-content { padding: 0; max-width: none; min-height: auto; box-shadow: none; }
      @page { margin: 2cm; }
    }
  </style>
</head>
<body>
  <div id="doc-content">
    <!--INJECT_CONTENT-->
  </div>
  <script>
    // Tornar blocos de texto editáveis
    document.querySelectorAll('.doc-text, .doc-tema, .doc-escola, .doc-disciplina, .doc-autores, .doc-section-title, p, h1, h2, h3, h4').forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });
  </script>
</body>
</html>`;
}
