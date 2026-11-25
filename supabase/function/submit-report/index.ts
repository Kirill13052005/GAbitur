// submit-report: єдина точка прийому скарг про корупцію та зворотного зв'язку.
// Що робить:
//  - перевіряє origin, метод, розмір і схему даних;
//  - обмежує частоту запитів (за знеособленим ключем, IP не зберігається);
//  - пише в БД від імені service_role;
//  - НЕ зберігає IP, user-agent, заголовки та не логує текст скарг.
import { adminClient, allowRequest, corsHeaders, json, originAllowed, readJson } from "../_shared/common.ts";

type Body = {
  type?: unknown;
  text?: unknown;
  university?: unknown;
  contact?: unknown;
  website?: unknown; // honeypot: у реальних користувачів завжди порожнє
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  if (!originAllowed(req)) return json(req, { error: "forbidden" }, 403);

  // 5 звернень на 10 хвилин з одного (знеособленого) джерела
  if (!(await allowRequest(req, "report", 5, 600))) {
    return json(req, { error: "too_many_requests" }, 429);
  }

  const raw = (await readJson(req, 20_000)) as Body | null;
  if (!raw || typeof raw !== "object") return json(req, { error: "bad_request" }, 400);

  // Honeypot: боту повертаємо «успіх», але нічого не зберігаємо
  if (str(raw.website) !== "") return json(req, { ok: true });

  const type = str(raw.type);
  const text = str(raw.text);
  const db = adminClient();

  if (type === "corruption") {
    const university = str(raw.university).slice(0, 200);
    if (text.length < 10 || text.length > 5000) {
      return json(req, { error: "invalid_text_length", min: 10, max: 5000 }, 400);
    }
    // Контакт для скарг свідомо ігнорується: повна анонімність
    const { error } = await db.from("corruption_reports").insert({
      university: university || null,
      description: text,
    });
    if (error) {
      console.error("insert_report_error", error.code);
      return json(req, { error: "server_error" }, 500);
    }
    return json(req, { ok: true });
  }

  if (type === "feedback") {
    const contact = str(raw.contact).slice(0, 200);
    if (text.length < 1 || text.length > 3000) {
      return json(req, { error: "invalid_text_length", min: 1, max: 3000 }, 400);
    }
    const { error } = await db.from("feedback_messages").insert({
      message: text,
      contact: contact || null,
    });
    if (error) {
      console.error("insert_feedback_error", error.code);
      return json(req, { error: "server_error" }, 500);
    }
    return json(req, { ok: true });
  }

  return json(req, { error: "invalid_type" }, 400);
});