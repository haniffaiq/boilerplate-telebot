import { z } from "zod";

export const SendSchema = z.object({
  chat_id: z.union([z.string(), z.number()]),
  message: z.string().min(1).max(4096),
  image: z.string().optional(),
  parse_mode: z.enum(["HTML", "MarkdownV2"]).optional(),
  disable_notification: z.boolean().optional()
});

export function validateSend(body) {
  const res = SendSchema.safeParse(body);
  if (!res.success) {
    const msg = res.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    return { ok: false, message: msg };
  }
  return { ok: true, data: res.data };
}
