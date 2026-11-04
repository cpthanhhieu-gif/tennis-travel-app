# Dashboard quản trị demo

Mở `/demo` hoặc `/operations`. Hai đường dẫn dùng chung không gian quản trị, cùng đăng nhập quản trị hiện có.

- Tổng quan: số câu hỏi mới, chuyến đang chuẩn bị/diễn ra/hoàn thành; hộp thư cần xử lý và booking gần đây. Các số liệu lấy từ API hiện có, không thêm số liệu minh họa.
- Hộp thư tư vấn: câu hỏi qua Ace, ngữ cảnh, liên hệ, trạng thái và trả lời khách. Dữ liệu tư vấn thuộc toàn bản demo.
- Booking & chuyến đi: giữ các chức năng xử lý phương án, thanh toán mô phỏng, sân/HLV, hoạt động và sau tour. Dữ liệu thuộc kịch bản đang mở.
- Check-in: dùng lại bàn check-in.
- Báo cáo pilot: dùng lại báo cáo FEI/NPS của kịch bản.
- Kịch bản khách hàng: quản lý bắt đầu, tiếp tục, đặt lại kịch bản.
- Phiên demo: chọn bối cảnh và kết nối điện thoại bằng QR; đăng xuất quản trị.

Menu sidebar trên desktop, menu cuộn ngang trên điện thoại. URL hash giữ mục khi tải lại, ví dụ `/demo#inbox` hoặc `/operations#bookings`. Điều hướng Back/Forward của trình duyệt cập nhật mục tương ứng.

Các route `/check-in`, `/pilot` và `/test-controls` cũ vẫn còn. Dashboard có đường quay lại ứng dụng khách. Trang quản trị không dùng bố cục điều hướng khách, nên không bị phủ bởi chatbot hoặc thanh điều hướng khách.

Kiểm tra: TypeScript, build và ba bộ kiểm tra Ace / AI / hộp thư. Chưa xác minh trực quan trên trình duyệt do quyền mở bản xem thử không được cấp.
