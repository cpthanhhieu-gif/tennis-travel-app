# Khám phá tự do và kịch bản mẫu

## Cách thử

1. Trong dashboard → Kịch bản khách hàng, mở “Khám phá tự do cùng Ace”. Có thể mở từ trang Khám phá của app mà không đăng nhập hoặc chọn kịch bản.
2. Ace hỏi rõ Đi một mình / Hai người cùng chơi / Một người chơi và một người đi cùng / Nhóm / CLB. Hai người không tự động được chuyển sang Premium; mục tiêu chuyến đi vẫn quyết định gợi ý.
3. Chọn gói từ Ace, hoặc xem trang tour rồi tiếp tục booking. Nguồn Ace và mã cuộc tư vấn được giữ ở cả hai đường dẫn.
4. Trong booking, kiểm tra phần Thông tin từ cuộc tư vấn rồi xác nhận. Booking từ Ace không lấy số khách mẫu của Cá nhân/Cặp đôi. Bản nháp và thông tin khách đã sửa ưu tiên hơn giá trị mặc định hoặc URL cũ.
5. Khách được chọn gói, đánh giá NTRP và nhập thông tin trước khi đăng nhập. Chỉ yêu cầu đăng nhập khi gửi/lưu booking; không tháo và tạo lại form sau đăng nhập.
6. Dashboard có nút đổi nguồn booking Kịch bản / Khám phá tự do. Mỗi booking ghi nguồn Tư vấn Ace, Khám phá tự do, Kịch bản hoặc Đặt trực tiếp.

## Nguyên tắc dữ liệu

- Kịch bản tiếp tục dùng dữ liệu mẫu và đồng bộ phiên như trước. Khi chọn kịch bản từ dashboard hoặc tham gia link QR kịch bản, chế độ tự do được tắt.
- Khám phá tự do dùng `explore/store` riêng trong cùng phòng demo, không seed profile hoặc booking của kịch bản. Đồng bộ không ép về kịch bản người trình diễn đang chọn.
- Nếu chưa có phòng demo, hành động mở khám phá tạo phòng riêng ngẫu nhiên, không cấp quyền quản trị hoặc tự đăng nhập khách. Quyền quản trị vẫn qua mật khẩu hiện có.
- Dữ liệu bản nháp của kịch bản, khám phá và từng cuộc tư vấn Ace được tách. Bản nháp thường cũ được đọc chuyển tiếp khi phù hợp.
- Chuyển nguồn dữ liệu ở dashboard không đặt lại hoặc xóa booking. Luồng tư vấn viên vẫn dùng hộp thư chung của bản demo.
- NTRP khách chưa đăng nhập tính ở trình duyệt; lưu hồ sơ lên máy chủ khi có phiên hợp lệ. Kết quả tự đánh giá không phải xác nhận trình độ của HLV.

## Kiểm tra

`node tests/booking-entry.cjs`
`node tests/demo-explore.cjs`
Cùng các bộ kiểm tra Ace, continuity, AI và hộp thư; `npm run build`.

Kiểm tra trực quan và thử trên Vercel vẫn cần thực hiện sau triển khai.
