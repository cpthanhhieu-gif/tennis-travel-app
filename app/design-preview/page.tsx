import { cookies } from "next/headers";
import { DESIGN_THEME_COOKIE, resolveDesignTheme } from "@/lib/design-theme";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default async function DesignPreview() {
  const theme = resolveDesignTheme((await cookies()).get(DESIGN_THEME_COOKIE)?.value);
  return <main className="ds-container ds-section">
    <h1>So sánh bộ giao diện</h1>
    <p>Đang xem: <strong>{theme === "classic" ? "Classic · bộ hiện tại" : "Next · bộ mới"}</strong>.</p>
    <p>Next đang chờ thông số thiết kế nên hiện hiển thị giống Classic. Lựa chọn chỉ áp dụng trên trình duyệt này trong 30 ngày, cho cả app và trang quản lý.</p>
    <form action="/api/design-theme" method="post" className="admin-actions">
      <Button name="theme" value="classic" variant={theme === "classic" ? "primary" : "secondary"}>Dùng Classic</Button>
      <Button name="theme" value="next" variant={theme === "next" ? "primary" : "secondary"}>Thử Next</Button>
      <Button name="theme" value="default" variant="neutral">Theo mặc định sản phẩm</Button>
    </form>
    <section className="ds-section"><h2>Thành phần dùng chung</h2>
      <div className="admin-actions"><Button>Nút chính</Button><Button variant="secondary">Nút phụ</Button><Button disabled>Chưa khả dụng</Button><Button loading>Đang xử lý</Button></div>
      <Card><h3>Thẻ nội dung</h3><p>Kiểm tra chữ, nền, đường viền và bo góc.</p>
        <Input label="Tên khách (mẫu)" placeholder="Nhập tên" hint="Dữ liệu mẫu, không lưu." />
        <Input label="Email (mẫu lỗi)" defaultValue="email" error="Vui lòng nhập email hợp lệ." />
      </Card>
    </section>
    <nav className="admin-actions" aria-label="Kiểm tra các màn hình">
      <a className="ds-link" href="/">Mở app</a><a className="ds-link" href="/operations">Mở quản lý vận hành</a><a className="ds-link" href="/demo">Mở quản lý demo</a>
    </nav>
    <p>Quay lại /design-preview bất cứ lúc nào để chuyển về Classic.</p>
  </main>;
}
