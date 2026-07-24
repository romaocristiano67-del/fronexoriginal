import { z } from 'zod';

// ============================================================
// /api/chat
// ============================================================
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'A mensagem não pode ser vazia')
    .max(2000, 'A mensagem é muito longa (máx. 2000 caracteres)'),
  // obrigatório apenas para visitantes não autenticados
  sessionId: z.string().uuid('sessionId inválido').optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// ============================================================
// /api/mentor
// ============================================================
export const mentorRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  mentorKey: z.enum(['financas', 'marketing_tiktok', 'burocracia'], {
    errorMap: () => ({ message: 'mentorKey deve ser: financas | marketing_tiktok | burocracia' }),
  }),
  sessionId: z.string().uuid().optional(),
});

export type MentorRequest = z.infer<typeof mentorRequestSchema>;

// ============================================================
// /api/calculate-price
// ============================================================
export const calculatePriceSchema = z.object({
  serviceType: z.enum(
    ['website', 'ecommerce', 'app_mobile', 'sistema_gestao', 'identidade_visual'],
    { errorMap: () => ({ message: 'serviceType inválido' }) }
  ),
  answers: z.object({
    numPages: z.number().int().min(1).max(200).optional(),
    needsPayment: z.boolean().optional(),
    needsAdminPanel: z.boolean().optional(),
    needsMultiLanguage: z.boolean().optional(),
    deadlineDays: z.number().int().min(1).max(365).optional(),
    integrations: z.array(z.string().max(60)).max(20).optional(),
    designComplexity: z.enum(['baixa', 'media', 'alta']).optional(),
  }),
  clientName: z.string().min(2).max(120).optional(),
  clientPhone: z.string().min(9).max(20).optional(),
  sessionId: z.string().uuid().optional(),
});

export type CalculatePriceRequest = z.infer<typeof calculatePriceSchema>;
