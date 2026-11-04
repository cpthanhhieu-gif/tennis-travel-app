# Ace: câu tự nhiên không dùng AI

Dữ liệu đều là câu giả lập do nhóm xây dựng, không phải tin nhắn khách hàng hoặc dữ liệu huấn luyện mô hình.

## Dữ liệu được đưa vào sản phẩm

- `lib/ace-language-data.ts`: 156 câu mẫu theo ý định, được bộ nhận diện sử dụng trực tiếp. Hỗ trợ chuẩn hóa dấu, chữ hoa/thường, một số cách viết tắt và từ đệm.
- `lib/ace-natural.ts`: ghép các mệnh đề đã hiểu, đọc số khách/ngân sách, giữ nguyên nhu cầu trước đó và chỉ hỏi phần còn thiếu. Không tự suy ra vai trò từ “đi với vợ”, không tự chia ngân sách tổng, không gán NTRP qua một câu chung.
- Ba câu nhiều thông tin có trong mục “Thử kể kế hoạch bằng lời của bạn” ở đầu cửa sổ Ace. Chọn câu để điền ô nhập rồi sửa hoặc gửi.

## Kiểm tra

Chạy `node tests/ace-natural.cjs`: kiểm tra 312 lượt từ câu mẫu và biến thể không dấu/chữ hoa; 67 trường hợp bổ sung trong `tests/fixtures/ace-natural-cases.json`; ba câu trình diễn và chuỗi sửa nhu cầu.

Có ca nhận đúng, ca hỏi rõ, ca chuyển tư vấn viên; kiểm tra không làm mất thông tin khi gặp câu mâu thuẫn hoặc chỉ hiểu một phần. Đây là độ bao phủ của bộ kiểm tra giả lập, không phải số đo độ chính xác trên khách hàng thực.

## Giới hạn

Chỉ xử lý những cách diễn đạt và mẫu cấu trúc đã hỗ trợ. Câu ngoài phạm vi vẫn đi tới tư vấn viên. Yêu cầu hủy/hoàn tiền/đổi lịch không được diễn giải thành thay đổi nhu cầu khám phá. Khi đang khai nhóm hoặc đánh giá NTRP, giữ luồng hiện tại và không tự ghi đè câu trả lời có cấu trúc.

Muốn mở rộng: thêm ví dụ vào đúng ý định, thêm ca kiểm tra hiểu nhầm độc lập, rồi chạy bộ kiểm tra cũ. Các ví dụ sau chuẩn hóa trùng nhau nhưng khác ý định sẽ bị từ chối.
