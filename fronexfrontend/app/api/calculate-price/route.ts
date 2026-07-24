import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { calculatePriceSchema } from '@/lib/validations/schemas';
import { buildApiWhatsAppLink, calculateFinalPrice } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json({ error: 'Corpo da requisição inválido (JSON esperado)' }, { status: 400 });
    }

    const parsed = calculatePriceSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { serviceType, answers, clientName, clientPhone, sessionId } = parsed.data;

    let pricing;
    try {
      pricing = calculateFinalPrice(serviceType, answers);
    } catch (pricingError) {
      console.error('[api/calculate-price] erro ao calcular preço:', pricingError);
      return NextResponse.json({ error: 'Não foi possível calcular o preço para este serviço' }, { status: 400 });
    }

    const whatsappLink = buildApiWhatsAppLink({
      serviceType,
      finalPrice: pricing.finalPrice,
      clientName,
    });

    // associa ao usuário autenticado, se houver; caso contrário, ao sessionId (opcional)
    const supabaseServer = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    const admin = createSupabaseAdminClient();

    const { data: inquiry, error: insertError } = await admin
      .from('service_inquiries')
      .insert({
        user_id: user?.id ?? null,
        session_id: !user?.id ? sessionId ?? null : null,
        service_type: serviceType,
        answers,
        complexity_score: pricing.complexityScore,
        base_price: pricing.basePrice,
        final_price: pricing.finalPrice,
        whatsapp_link: whatsappLink,
        client_name: clientName ?? null,
        client_phone: clientPhone ?? null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      // não bloqueia a resposta ao cliente — o orçamento ainda é retornado,
      // apenas não fica registado no histórico
      console.error('[api/calculate-price] erro ao salvar orçamento:', insertError);
    }

    return NextResponse.json({
      inquiryId: inquiry?.id ?? null,
      serviceType,
      basePrice: pricing.basePrice,
      complexityScore: pricing.complexityScore,
      finalPrice: pricing.finalPrice,
      currency: 'AOA',
      whatsappLink,
    });
  } catch (err) {
    console.error('[api/calculate-price] erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
