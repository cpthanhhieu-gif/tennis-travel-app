import { cookies } from "next/headers";
import { DESIGN_THEME_COOKIE, resolveDesignTheme } from "@/lib/design-theme";
import Button from "@/components/ui/Button";
import DesignCatalogue from "@/components/features/DesignCatalogue";

export default async function DesignPreview() {
  const theme = resolveDesignTheme((await cookies()).get(DESIGN_THEME_COOKIE)?.value);
  return <main className="vt-catalog">
    <h1>So sánh bộ giao diện</h1>
    <p>Đang xem: <strong>{theme === "classic" ? "Classic · bộ hiện tại" : "Next · bộ mới"}</strong>.</p>
    <p>Next được dựng từ ảnh Vietravel bạn cung cấp: xanh–đỏ, nền sáng, card mềm và biểu mẫu rõ ràng. Lựa chọn áp dụng trên trình duyệt này trong 30 ngày cho cả app và quản lý.</p>
    <form action="/api/design-theme" method="post" className="admin-actions">
      <Button name="theme" value="classic" variant={theme === "classic" ? "primary" : "secondary"}>Dùng Classic</Button>
      <Button name="theme" value="next" variant={theme === "next" ? "primary" : "secondary"}>Thử Next</Button>
      <Button name="theme" value="default" variant="neutral">Theo mặc định sản phẩm</Button>
    </form>
    <DesignCatalogue/>
    <nav className="admin-actions" aria-label="Kiểm tra các màn hình">
      <a className="ds-link" href="/">Mở app</a><a className="ds-link" href="/operations">Mở quản lý vận hành</a><a className="ds-link" href="/demo">Mở quản lý demo</a>
    </nav>
    <p>Quay lại /design-preview bất cứ lúc nào để chuyển về Classic.</p>
  </main>;
}
