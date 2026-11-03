# Design system dùng chung — app và quản lý

## Nguồn đang chạy

`app/design-system/tokens.css` là nguồn giá trị thiết kế của ứng dụng. `app/globals.css` nhập file này và ánh xạ sang Tailwind v4 (`@theme`) cùng các lớp `ds-*`, `ui-*`, trang operations và demo administration. `tailwind.config.ts` là cấu hình cũ; không dùng nó để thay theme của bản hiện tại.

Các bản trong `../home-concepts` là tài liệu/prototype lịch sử, không phải nguồn runtime.

## Thay đổi nhận diện

1. Đổi nhóm `--ds-primary`, `primary-hover`, `primary-pressed`, `ink`, `muted`, `canvas`, `surface`, `border`, `input-border`, `accent` trong tokens.css. Giữ đủ tương phản giữa chữ, nền và trạng thái focus.
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
