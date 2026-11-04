# Nhập văn bản trong Ace

- Nội dung khớp lựa chọn/kịch bản được xử lý tại bước hiện tại: nút gợi ý, tên gói, câu trả lời NTRP, hình thức đi, mục tiêu, ngân sách và yêu cầu ăn uống phù hợp ngữ cảnh.
- Nhận dạng có giới hạn rõ ràng: không phân biệt dấu/hoa thường cho lựa chọn, một số cách nói thông dụng; ngân sách hỗ trợ số tiền và triệu/tr. Không dùng từ khóa “tour” để coi mọi câu hỏi là trong kịch bản.
- Câu hỏi ngoài kịch bản (hủy/hoàn tiền, nhu cầu chưa hỗ trợ, câu hỏi phát sinh…) tự gửi đến hộp thư tư vấn cùng nhu cầu/gói/ngày và ngữ cảnh. Không gọi AI hoặc cần khóa AI cho luồng này.
- Giữ nguyên câu khách gõ trong lịch sử, chỉ dùng lựa chọn chuẩn hóa để chạy kịch bản.
- Chỉ thêm dòng “Đã gửi câu hỏi đến nhân viên tư vấn” khi máy chủ lưu thành công. Lỗi sẽ có nút thử gửi lại; không báo đã gửi. Mã tin nhắn giữ cơ chế tránh gửi trùng hiện có.
- Câu trả lời từ nhân viên xuất hiện trong cùng dòng chat. Khách có thể nhập câu khớp kịch bản để tiếp tục hoặc bấm Quay lại Ace; tiến độ câu hỏi không bị đặt lại. Biểu mẫu nhóm đang mở được giữ khi ẩn sang chế độ tư vấn viên.
- Header dùng nền trắng, chữ tối và nút viền theo kiểu dashboard; bỏ shape/cloud xanh.

Kiểm tra: `node tests/ace-script.cjs` và các bộ kiểm tra Ace, group, continuity, support, booking, AI endpoint, exploration; build ứng dụng.

Sau thông báo chuyển tư vấn viên và sau câu trả lời của nhân viên, Ace hiển thị tối đa 3 tag tiếp tục theo tiến độ hiện tại. Tag có thể tiếp tục câu hỏi đang dở, sửa nhu cầu nhóm hoặc mở lựa chọn tour; bấm tag đưa khách về luồng Ace và giữ nhu cầu đã có.
