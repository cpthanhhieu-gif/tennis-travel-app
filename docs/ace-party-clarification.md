# Nhận diện người đi cùng và hỏi lại

Bộ ngữ pháp `lib/ace-party-language.ts` đọc câu đầy đủ theo cấu trúc người nói + mong muốn/dự định + hình thức tham gia. Không chỉ bổ sung riêng câu “tôi muốn đi một mình” vào danh sách mẫu.

- Khẳng định rõ: ghi nhận số khách; 1 người được hiểu là 1 người chơi theo luồng hiện có.
- Đi với vợ/chồng/bạn gái/bạn trai: ghi nhận 2 người nhưng hỏi vai trò, không mặc định cả hai đều chơi.
- Phủ định, giả định hoặc mâu thuẫn: giữ nguyên nhu cầu đã lưu và hỏi rõ, chưa tự thay số khách.
- Câu gần đúng có đề xuất xác nhận: chỉ áp dụng khi khách xác nhận; trả lời Không sẽ loại đề xuất, không ghi nhận nó.
- Hỏi chưa rõ lần hai: đưa các lựa chọn và nút nhờ tư vấn viên. Không tự gửi các câu còn mơ hồ về số khách sang nhân viên.
- Yêu cầu thật sự ngoài phạm vi như hủy/hoàn tiền/xuất hóa đơn vẫn dùng luồng hỗ trợ hiện có.

Câu hỏi đang chờ được lưu cùng phiên chat, nên sau tải lại vẫn hiểu lời xác nhận. Nhập số khách lúc đang làm NTRP giữ nguyên câu trả lời quiz. Sửa nhóm có nhiều trình độ vẫn dùng bản tóm tắt nhóm; không ghi đè các cohort bằng một câu khai đơn giản.

Kiểm tra `node tests/ace-party-language.cjs` gồm các cấu trúc mới ngoài danh sách câu mẫu, nhiều bước hội thoại, không dấu, từ đệm, phủ định, giả định, mâu thuẫn, xác nhận/từ chối và khôi phục câu hỏi sau tải lại. Đây là kiểm tra quy tắc, không phải năng lực hiểu ngôn ngữ tự do bằng AI.
