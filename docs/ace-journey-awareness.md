# Ace theo hành trình khách

Ace chỉ đọc booking từ `/api/local` của phiên hiện tại; không tạo booking, xác nhận tiền, bắt đầu hoặc kết thúc tour thay điều hành.

- Chưa có booking: hỏi nhu cầu nếu chưa có hội thoại; nếu đã có hội thoại thì giữ nguyên bước đang làm và thông tin đã lưu.
- Yêu cầu chưa đủ cọc: xem tiến độ, phương án hoặc phần cần bổ sung. Không gọi đây là chuyến đã xác nhận.
- Đủ cọc: mở đúng chuyến, lịch, chuẩn bị/check-in và phần thanh toán còn lại.
- Đang đi: mở Tour Live; FEI chỉ cho bữa đã được ghi nhận hoàn tất. Không mở NPS sớm.
- Hoàn thành: dẫn đến NPS và các phản hồi FEI đủ điều kiện. Khi các phản hồi đã đủ, chuyển sang xem lại tổng kết.

Khách có nhiều booking được chọn chuyến. Mặc định ưu tiên chuyến đang đi, chuyến đã nhận cọc gần nhất, yêu cầu đang chờ, rồi chuyến đã hoàn thành còn phản hồi. Link có booking hợp lệ được ưu tiên đúng chuyến đó.

Các nút đến `/pre-tour?booking=...&tab=...`; màn hình Hành trình mở đúng trang danh sách, booking và mục tương ứng, chỉ đối chiếu với danh sách của tài khoản hiện tại. Tour Live giữ đường dẫn riêng hiện có.

Lời nhắc trạng thái được nhận diện bằng khóa booking + công việc đang chờ, lưu cùng lịch sử chat. Mở/đóng hay tải lại không lặp cùng lời nhắc. Khi đổi trạng thái hoặc phương án, có lời nhắc mới; không xóa nhu cầu hay câu trả lời NTRP. Khi đang nhắn tư vấn viên hoặc chủ động tìm chuyến mới, không chen lời nhắc vào cuộc trao đổi.

Dữ liệu theo cơ chế cập nhật hiện có mỗi 5 giây. Khi chưa đọc được dữ liệu, không tự kết luận khách chưa có booking; có nút thử lại. Không có thông báo gửi ra ngoài ứng dụng.

Kiểm tra: `node tests/ace-journey.cjs`, gồm phân giai đoạn, điều kiện FEI/NPS, nhiều booking, link đúng quyền/trang và lưu chống lặp lời nhắc.
