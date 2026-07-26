"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Printer, Download, Type, Palette } from "lucide-react";


interface DocumentEditorProps {
  htmlContent: string;
  templateWrapper: string;
  onClose: () => void;
  title?: string;
}

export function DocumentEditor({
  htmlContent,
  templateWrapper,
  onClose,
  title = "Documento Gerado",
}: DocumentEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [accentColor, setAccentColor] = useState("#CC1A1A");

  const colors = [
    { name: "Fronex Red", value: "#CC1A1A" },
    { name: "Gold", value: "#D4AF37" },
    { name: "Navy Blue", value: "#000080" },
    { name: "Forest Green", value: "#228B22" },
    { name: "Black", value: "#0D0D0D" },
  ];

  // Injetar o conteúdo no wrapper
  const fullHtml = templateWrapper.replace("<!--INJECT_CONTENT-->", htmlContent);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Quando a iframe carregar, podemos modificar variáveis CSS se necessário
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.documentElement.style.setProperty("--red", accentColor);
      }
    }
  }, [accentColor]);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleExportDocx = () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    
    // Obter o HTML final com as edições do utilizador
    const doc = iframeRef.current.contentDocument;
    const finalHtml = doc.documentElement.outerHTML;
    
    // Exportar como HTML com extensão .docx (compatível com Word e Pages)
    const blob = new Blob(['\ufeff', finalHtml], {
      type: "application/msword"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-neutral-900/80 backdrop-blur-sm p-2 sm:p-4 md:p-8">
      <div className="flex w-full h-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex-col md:flex-row">
        
        {/* Barra Lateral (Painel de Estilos) */}
        <div className="w-full md:w-64 bg-neutral-50 border-r p-4 flex flex-col sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <h2 className="font-semibold text-base text-neutral-800 sm:text-lg">Editor Visual</h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-neutral-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 flex-1 sm:space-y-6">
            <div>
              <h3 className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-2 sm:text-sm sm:mb-3">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" /> Cor de Acento
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    title={c.name}
                    onClick={() => setAccentColor(c.value)}
                    className={`w-7 h-7 rounded-full border-2 sm:w-8 sm:h-8 ${
                      accentColor === c.value ? "border-neutral-800 scale-110" : "border-transparent"
                    } transition-all`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t sm:pt-4">
              <h3 className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-2 sm:text-sm sm:mb-3">
                <Type className="w-3 h-3 sm:w-4 sm:h-4" /> Instruções
              </h3>
              <p className="text-[11px] text-neutral-600 leading-relaxed sm:text-xs">
                Clique em qualquer texto do documento para editar. Exporte para PDF ou Word quando pronto.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t sm:space-y-3 sm:pt-6">
            <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-black text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:px-4">
              <Printer className="w-3 h-3 sm:w-4 sm:h-4" /> Exportar PDF
            </button>
            <button onClick={handleExportDocx} className="w-full flex items-center justify-center gap-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:px-4">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" /> Exportar Word
            </button>
            <button onClick={onClose} className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:mt-4 sm:px-4">
              Sair do Editor
            </button>
          </div>
        </div>

        {/* Área Principal (Iframe) */}
        <div className="flex-1 bg-neutral-200 overflow-hidden flex flex-col relative min-h-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-neutral-800/80 backdrop-blur text-white text-[10px] px-3 py-1 rounded-full z-10 pointer-events-none opacity-50 sm:top-4 sm:text-xs sm:px-4 sm:py-1.5">
            Pré-visualização A4
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={fullHtml}
            className="w-full h-full border-0 bg-transparent"
            title="Visualização do Documento"
            onLoad={(e) => {
              const doc = (e.target as HTMLIFrameElement).contentDocument;
              if (doc) {
                doc.documentElement.style.setProperty("--red", accentColor);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
