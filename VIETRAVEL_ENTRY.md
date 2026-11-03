# Home Vietravel → Travel Ace

- Điểm bắt đầu: `/vietravel`. Đây là bản mô phỏng Home Vietravel trong dự án hiện tại; chưa tích hợp vào app Vietravel thật.
- Icon Travel Ace, banner và chip Du lịch & tennis mở `/?entry=vietravel`, tức module hiện có. Không di chuyển route, không thay đổi cookie đăng nhập hoặc bộ thiết kế đã chọn.
- Link “Vietravel” kèm mũi tên nằm đầu module. Back của Detail/Booking vẫn giữ đích riêng như trước; thanh điều hướng khách chỉ có bốn mục Travel Ace.
- Home không dùng PageWrapper nên không có thanh điều hướng Travel Ace hoặc chatbot chồng lên điều hướng Vietravel. Thanh điều hướng Vietravel chỉ thuộc Home.
- Home dùng bảng xanh–đỏ riêng theo DS-Next, không phụ thuộc lựa chọn Classic/Next trong module. Không tự đổi lựa chọn theme của người dùng.
- Tìm kiếm trên Home lọc danh sách dịch vụ theo tên, hỗ trợ tiếng Việt có/không dấu; không giả lập tìm toàn bộ kho tour Vietravel.
- Dịch vụ ngoài Travel Ace và các mục nav chưa có luồng hiển thị thông báo minh họa, có link mở Travel Ace. Không lấy đăng nhập module thay cho đăng nhập Vietravel hoặc giả dữ liệu vé/khách sạn.
- Home responsive 320px trở lên: grid dịch vụ bốn cột trên mobile, tám cột desktop, CTA rõ ràng, target ít nhất 44px, focus bàn phím, safe area cho nav.
- Hình tennis được dựng bằng CSS; icon Lucide. Wordmark Vietravel là chữ tái hiện, không phải file logo thương hiệu gốc. Có thể thay bằng asset được cung cấp sau.
- Root `/` vẫn là module. Đường dẫn demo, vận hành, tour, booking và chia sẻ được giữ nguyên. Chỉ cân nhắc đổi trang mặc định khi duyệt luồng mới.

Kiểm tra khi duyệt: `/vietravel` → icon Travel Ace → chọn gói → booking → Back về chi tiết; “Vietravel” trở lại Home; thử tìm “travel”, “ve may bay”, xóa tìm kiếm, không có kết quả và đóng thông báo bằng Escape. Kiểm tra mobile/desktop và không có hai thanh điều hướng đồng thời.
