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
  mentorKey: z.enum(['financas', 'marketing_tiktok', 'burocracia']),
  sessionId: z.string().uuid().optional(),
});

export type MentorRequest = z.infer<typeof mentorRequestSchema>;

// ============================================================
// /api/calculate-price
// ============================================================
export const calculatePriceSchema = z.object({
  serviceType: z.enum(['web', 'apps', 'social', 'ai-video', 'video-edit', 'design']),
  answers: z.record(z.string(), z.unknown()),
  clientName: z.string().min(2).max(120).optional(),
  clientPhone: z.string().min(9).max(20).optional(),
  sessionId: z.string().uuid().optional(),
});

export type CalculatePriceRequest = z.infer<typeof calculatePriceSchema>;

// ============================================================
// /api/innovate — Criar e Inovar
// ============================================================
export const innovateRequestSchema = z.object({
  idea: z
    .string()
    .min(1, 'A ideia não pode ser vazia')
    .max(2000, 'A ideia é muito longa (máx. 2000 caracteres)'),
  sessionId: z.string().uuid('sessionId inválido').optional(),
});

export type InnovateRequest = z.infer<typeof innovateRequestSchema>;
