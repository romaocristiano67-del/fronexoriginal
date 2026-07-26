import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { html, title = "Documento" } = body;

    if (!html) {
      return NextResponse.json(
        { error: "Nenhum HTML fornecido" },
        { status: 400 }
      );
    }

    // Exportar como HTML com extensão .docx (compatível com Word e Pages)
    const htmlWithBOM = '\ufeff' + html;
    const docxBlob = new Uint8Array([...new TextEncoder().encode(htmlWithBOM)]);

    const response = new NextResponse(docxBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/msword",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          title
        )}.docx"`,
      },
    });

    return response;
  } catch (error: any) {
    console.error("DOCX Export Error:", error);
    return NextResponse.json(
      { error: "Erro ao exportar documento para DOCX." },
      { status: 500 }
    );
  }
}
