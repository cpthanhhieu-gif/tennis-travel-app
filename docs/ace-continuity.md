# Liền mạch tư vấn → tour → booking → tư vấn viên

## Khách hàng

- Ace lưu lịch sử, nhu cầu, tiến độ câu hỏi, gói/ngày đang quan tâm và chế độ trò chuyện trong localStorage theo phạm vi kịch bản demo hiện có. Chuyển trang, tải lại và mở lại Ace vẫn giữ ngữ cảnh.
- Nút “Bắt đầu lại” bắt đầu cuộc trò chuyện mới, xóa nhu cầu/đích tư vấn đang mở trên trình duyệt và đổi mã tư vấn viên. Hội thoại đã gửi vẫn có trong hộp thư quản trị; booking đã xác nhận không bị xóa.
- Thẻ tour ghi nhớ gói/ngày trước khi chuyển trang. Booking từ Ace có phần “Thông tin từ cuộc tư vấn”. Khách kiểm tra rồi xác nhận áp dụng; số khách chỉ thay đổi khi khách chủ động chọn và nhập số chính xác. Không suy ra số khách từ khoảng 5–10 / 10–20.
- Nhu cầu được bổ sung vào ghi chú, giữ ghi chú riêng đã nhập. Kết quả NTRP chỉ tái sử dụng khi đã hoàn tất bộ câu hỏi và chưa có kết quả/đánh giá đang nhập trong booking. Không ghi đè liên hệ, ngày đã chọn hay yêu cầu đoàn/Premium đã có.
- Nếu đã có danh sách người tham gia, số khách được chỉnh tại bước chọn gói thay vì đổi qua phần tư vấn.
- Ghi chú tiếp tục lưu trong bản nháp booking, được xem lại ở bước xác nhận, lưu khi gửi booking và xuất hiện ở phần vận hành.
- “Nhờ tư vấn viên hỗ trợ” chuyển câu hỏi gần nhất cùng nhu cầu, gói/ngày và trao đổi gần đây. Không phải nhập lại câu hỏi. Có thể để lại liên hệ tùy chọn ngay trong Ace.
- Sau khi gửi thành công, cùng ô nhập gửi trực tiếp cho tư vấn viên. Chọn “Quay lại Ace” để tiếp tục kịch bản/AI. Tin Bạn / Ace / Tư vấn viên hiển thị trong một dòng hội thoại; tư vấn viên không có ô chat riêng nữa.
- Khóa AI chưa cấu hình không ảnh hưởng gửi/nhận với tư vấn viên. Tin nhắn tư vấn có mã để tránh tạo trùng khi mất kết nối rồi thử lại.

## Quản trị

Hộp thư tư vấn tách phần Nhu cầu đã ghi nhận, Gói & ngày đang quan tâm và Nội dung trao đổi trước khi chuyển. Nhân viên trả lời trong cùng hội thoại; khách nhận cập nhật trong Ace mỗi 10 giây khi app đang mở.

## Kiểm tra

`node tests/ace-continuity.cjs`
`node tests/support-inbox.cjs`
`node tests/ace-conversation.cjs`
`node tests/ace-ai.cjs`
`npm run build`

Chưa cấu hình khóa AI nên không xác minh câu trả lời AI thật. Kiểm tra giao diện và luồng trọn vẹn trên bản demo sau khi triển khai.
