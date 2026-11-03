import { NextResponse } from "next/server";
import { DESIGN_THEME_COOKIE } from "@/lib/design-theme";

export async function POST(request: Request) {
  const data = await request.formData();
  const theme = data.get("theme");
  if (theme !== "classic" && theme !== "next" && theme !== "default") {
    return NextResponse.json({ error: "Bộ giao diện không hợp lệ." }, { status: 400 });
  }
  const response = NextResponse.redirect(new URL("/design-preview", request.url), 303);
  if (theme === "default") response.cookies.delete(DESIGN_THEME_COOKIE);
  else response.cookies.set(DESIGN_THEME_COOKIE, theme, {
    httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:",
    path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
