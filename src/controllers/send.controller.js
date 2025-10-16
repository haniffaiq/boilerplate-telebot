import { validateSend } from "../schemas/send.schema.js";
import { sendUnified } from "../services/send.service.js";
import { HttpError } from "../utils/httpError.js";

export async function sendController(req, res) {
  const check = validateSend(req.body || {});
  if (!check.ok) throw new HttpError(400, "bad_request", check.message);

  const { kind, result } = await sendUnified(check.data);
  return res.status(200).json({ ok: true, type: kind, message_id: result.message_id });
}
