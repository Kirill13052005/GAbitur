// Спільні утиліти для Edge Functions «Абітурієнт+»
import { createClient } from "npm:@supabase/supabase-js@2";

// Дозволені origin-и: секрет ALLOWED_ORIGINS через кому, напр.
// "https://abituriyent-plus.vercel.app,http://localhost:3000"
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ??
  "http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

// Origin, якщо він є, має бути в списку дозволених (додатковий захист до CORS)
export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  return !origin || ALLOWED.includes(origin);
}

// Клієнт із service_role. Ключ додається платформою автоматично.
export function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

// IP береться ЛИШЕ для ліміту запитів. У базу не пишеться ніколи:
// ключ = HMAC(секрет + дата, IP), тобто знеособлений і змінюється щодоби.
function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function anonKey(req: Request, scope: string): Promise<string> {
  const secret = Deno.env.get("RATE_LIMIT_SALT") ?? "dev-only-change-me";
  const day = new Date().toISOString().slice(0, 10);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${secret}:${day}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(clientIp(req)));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${scope}:${hex.slice(0, 32)}`;
}

// true = запит дозволено
export async function allowRequest(
  req: Request,
  scope: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const { data, error } = await adminClient().rpc("check_rate_limit", {
    p_key: await anonKey(req, scope),
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("rate_limit_error", error.code); // без тіла запиту
    return false; // у разі збою ліміту краще відмовити, ніж пропустити спам
  }
  return data === true;
}

// Безпечне читання JSON із обмеженням розміру
export async function readJson(req: Request, maxBytes: number): Promise<unknown | null> {
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}