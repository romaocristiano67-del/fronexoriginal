import { NextResponse } from "next/server";
import HTMLToDOCX from "html-to-docx";

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

    const docxBuffer = await HTMLToDOCX(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    const response = new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
