# Next · Vietravel reference v1

Nguồn: 19 ảnh JPG người dùng cung cấp ngày 03/11/2026. Đây là bộ thiết kế tái dựng và mở rộng cho Tennis Travel, không phải tài liệu chính thức của Vietravel.

## Mức độ xác định

- Quan sát từ ảnh: liên kết/lựa chọn xanh; CTA đặt dịch vụ đỏ; nền xanh rất nhạt; card trắng có bóng; nút/ô nhập bo mềm; chip pill; tab gạch chân; stepper tròn; bottom sheet có nền tối; thanh tóm tắt đặt chỗ.
- Giá trị chuẩn hóa do triển khai lựa chọn: xanh #1046C8, CTA #DC1306, canvas #F4F7FF, chữ #191919; cỡ control 44px, input 48px; radius 12/16/24px; spacing 4/8/12/16/24/32px. Đây là giá trị ước lượng để tạo hệ thống nhất quán, chưa phải phép đo hay token gốc.
- Font thay thế: Segoe UI, Arial, sans-serif. Chưa xác định font gốc từ ảnh.
- Mở rộng cho sản phẩm: màu success/warning/error, hover/pressed/focus, switch, loading/empty/error, bảng quản lý và desktop responsive. Không trình bày các phần này như thành phần chính thức của Vietravel.

## Sử dụng

`next.css` được nhập sau `globals.css` trong root layout để các quy tắc theme có thứ tự ổn định. Token và các override cho giao diện hiện hữu đều scope bằng `:root[data-design-theme="next"]`. Các lớp `vt-*` chỉ dùng cho component mới và catalogue.

- Button chính: xanh cho tác vụ thường/quản lý; `.ds-cta` đỏ cho CTA của luồng khách; trong `.admin-demo` CTA giữ xanh. Màu đỏ CTA mua hàng tách khỏi `--ds-danger` dùng lỗi.
- Các class hiện hữu của catalog, booking, journey, profile, passport, dialog và quản lý dùng token Next; giữ route, handler và quy tắc nghiệp vụ.
- `Notice`, `Toggle`, `NumberStepper` trong `components/ui/DesignControls.tsx` là component dùng lại. Toggle là controlled switch; stepper kiểm soát min/max và có nhãn tăng/giảm. Sử dụng SectionTabs/Modal hiện có để giữ keyboard/focus behavior.
- Catalogue `/design-preview`: có mẫu tương tác và bảng dữ liệu minh họa; không gọi API nghiệp vụ hoặc tạo giao dịch.
- Bảng/form quản lý dùng nền sáng, chữ tối, màu trạng thái kèm nhãn; mobile cho phép bảng cuộn trong vùng riêng.

## Bảo toàn Classic

Next không sử dụng xanh lá: màu nền Classic `#E7EFDC` được ánh xạ qua `--ds-subtle` sang xanh dương nhạt `#D9F1FF`. Success, badge hoàn thành, biểu đồ và các utility green hiện có cũng dùng thang xanh dương trong Next; giữ nguyên nhãn và dấu check để phân biệt ý nghĩa. Quy tắc này áp dụng cho màu UI, không đổi màu ảnh chụp du lịch.

Giữ nguyên `classic.css`. `DEFAULT_DESIGN_THEME` đã chuyển sang `next` theo yêu cầu người dùng; chọn Classic tại `/design-preview` để khôi phục riêng trên trình duyệt. Chưa thay toàn bộ cấu trúc bố cục, ảnh, icon hoặc mọi cỡ chữ riêng lẻ của màn cũ. Những thay đổi cấu trúc sau này phải được scope hoặc có nhánh Classic riêng.
