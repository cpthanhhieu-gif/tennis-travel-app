# Design system dùng chung — app và quản lý

## Nguồn đang chạy

`app/design-system/tokens.css` là nguồn giá trị thiết kế của ứng dụng. `app/globals.css` nhập file này và ánh xạ sang Tailwind v4 (`@theme`) cùng các lớp `ds-*`, `ui-*`, trang operations và demo administration. `tailwind.config.ts` là cấu hình cũ; không dùng nó để thay theme của bản hiện tại.

Các bản trong `../home-concepts` là tài liệu/prototype lịch sử, không phải nguồn runtime.

## Thay đổi nhận diện

1. Với bộ mới, chỉ sửa `app/design-system/next.css` trong selector `:root[data-design-theme="next"]`; giữ nguyên `classic.css`. Đổi nhóm `--ds-primary`, `primary-hover`, `primary-pressed`, `ink`, `muted`, `canvas`, `surface`, `border`, `input-border`, `accent` trong next.css. Giữ đủ tương phản giữa chữ, nền và trạng thái focus.
2. Đổi `--ds-font`, `--ds-radius-control`, `--ds-radius-card`, `--ds-radius-dialog`, `--ds-space-*` để thay nền tảng hình thức. Root vẫn 10px để tương thích kích thước rem của sản phẩm.
3. Dùng Button, Input, Card, Badge, Modal trong `components/ui` khi xây màn mới. Với các form nghiệp vụ hiện có, dùng lớp ds-cta/ds-link và quy tắc form chung trong globals.css.
4. Không ghi thêm mã màu trực tiếp trong component. Dùng `var(--ds-...)` trong CSS, SVG và Tailwind arbitrary values, ví dụ `bg-[var(--ds-primary)]`.
5. Chạy `npm run build`. Kiểm tra Home, Detail, Booking, Journey, Ace Club, Profile, Operations, Demo và dialog ở 320/390/768/1440px; kiểm tra focus, loading, disabled, error và nội dung dài.

## Quy ước

- Primary: hành động chính; accent: điểm nhấn; danger/success/warning: trạng thái có nhãn chữ.
- Control 44px tối thiểu, ô nhập 48px, chữ ô nhập 16px.
- Control radius 4px, card 8px, dialog 12px. Hình tròn và chip có chủ đích giữ hình dạng riêng.
- `--ds-palette-*` lưu các sắc độ chuyên biệt đang tồn tại (biểu đồ, loyalty, minh họa). Chúng cũng ở nguồn tập trung nhưng cần xem xét theo vai trò khi đổi nhận diện; không thay toàn bộ bằng cùng một màu.
- Khoảng cách nội dung chung được nối vào scale 4/8/12/16/24/32px. Kích thước ảnh, bố cục đặc thù, breakpoint và các giá trị rem cũ vẫn thuộc từng component; thay cấu trúc bố cục cần sửa component tương ứng.

## Phạm vi kiểm chứng

Đợt chuẩn hóa này tập trung nền tảng và thành phần UI; không sửa quy tắc đặt tour, tính giá, thanh toán hay quyền quản lý. Build thành công không thay thế kiểm tra trực quan và thao tác trên toàn bộ trạng thái có dữ liệu. Không coi đây là chứng nhận WCAG toàn sản phẩm.


## Hai bộ giao diện và khôi phục

- Classic: `app/design-system/classic.css`, bản giữ nguyên của tokens trước khi tách theme (commit gốc `7445b57`). Không chỉnh bộ này khi triển khai Next.
- Next: `app/design-system/next.css`, chỉ chứa override được scope dưới `:root[data-design-theme="next"]`. Chưa có thông số mới nên đang kế thừa Classic.
- Vào `/design-preview` để chọn bộ cho trình duyệt hiện tại. Cookie dùng chung cho mọi đường dẫn, tồn tại 30 ngày; chuyển bộ không đụng dữ liệu nghiệp vụ. Cookie bị chặn thì lựa chọn không được ghi nhớ.
- Chọn “Dùng Classic” để quay lại ngay. “Theo mặc định sản phẩm” xóa lựa chọn cá nhân.
- Mặc định toàn sản phẩm nằm ở `DEFAULT_DESIGN_THEME` trong `lib/design-theme.ts`, hiện là `classic`. Sau khi duyệt Next, đổi sang `next` và triển khai. Đổi về `classic` rồi triển khai để rollback mặc định. Cookie preview cá nhân vẫn có ưu tiên; dùng nút “Theo mặc định sản phẩm” khi kiểm tra rollout.
- Theme được xác định phía server trước khi trả HTML, tránh nháy màu khi tải. Vì layout đọc cookie, các trang dùng layout được render theo request thay vì xuất HTML tĩnh; cân nhắc tác động cache khi triển khai.

## Quy trình nhận bộ thiết kế mới

1. Nhận Figma/tài liệu, bảng màu, font (và file/quyền sử dụng), typography, spacing, radius, shadow, icon, component variants và trạng thái; kèm mẫu app và bảng/form quản lý nếu có.
2. Map các token mới vào Next; những phần chưa có thông số kế thừa Classic và được ghi rõ để duyệt.
3. Với thay đổi bố cục hoặc cấu trúc component, giữ nhánh render Classic và Next riêng tại component cần đổi; không sửa chung khiến Classic mất giao diện cũ. CSS mới luôn có scope theme.
4. So sánh hai bộ trên các luồng và kích thước màn hình trong checklist. Chỉ đổi mặc định khi người dùng chốt.
5. Giữ Classic trong source sau rollout. Trường hợp cần khôi phục chính xác toàn mã nguồn cũ, mốc Git `7445b57` là bản trước cơ chế theme; rollback giao diện bằng theme chỉ bao phủ các thay đổi đã được scope đúng.
