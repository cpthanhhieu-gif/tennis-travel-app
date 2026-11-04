# Bật câu hỏi tự do cho Ace

Các hành trình bấm chọn tiếp tục hoạt động mà không cần khóa AI. Câu hỏi nhập tự do gọi `/api/chat`, nhận lịch sử tối đa 24 tin nhắn, nhu cầu đã ghi nhận và danh mục/lịch trình từ dữ liệu chung trên máy chủ.

## Cấu hình trên Vercel

1. Tạo API key trong tài khoản OpenAI có quyền sử dụng API và ngân sách sử dụng phù hợp. Không dán khóa trong chat, mã nguồn hoặc GitHub.
2. Trong dự án Vercel, mở Settings → Environment Variables. Thêm `OPENAI_API_KEY` là khóa bí mật, áp dụng cho môi trường Preview / Production cần dùng.
3. Có thể thêm `OPENAI_CHAT_MODEL`; mặc định là `gpt-4.1-mini` (Responses API, Structured Outputs). Nếu đổi model, chọn model hỗ trợ cả hai khả năng.
4. Redeploy bản mới để nhận biến môi trường. Thử câu “Nhóm mình 8 người, muốn học kỹ thuật, có 2 người ăn chay, ngân sách 7 triệu/người”. Tiếp tục hỏi “Nếu muốn thi đấu thì sao?” để kiểm tra lịch sử và thay đổi nhu cầu.

Chạy local: thêm hai biến trên vào `.env.local` rồi khởi động lại app. File `.env*` được Git bỏ qua. Không dùng biến `NEXT_PUBLIC_*` cho khóa.

## Hành vi khi lỗi

- Chưa có khóa: API trả `AI_NOT_CONFIGURED`, giao diện giải thích chưa bật câu hỏi tự do và cho phép tiếp tục bấm chọn.
- Mất kết nối / hết thời gian / lỗi nhà cung cấp: thông báo và nút thử lại câu hỏi; không giả câu trả lời AI hoặc xác nhận đã liên hệ tư vấn viên.
- Làm mới hoặc rời trang: hủy yêu cầu đang chạy để câu trả lời cũ không xuất hiện trong cuộc trò chuyện mới.
- Khóa chỉ tồn tại phía máy chủ. Request dùng `store: false`; ứng dụng không ghi lịch sử chat hay khóa vào log. Nhà cung cấp vẫn có chính sách xử lý dữ liệu riêng.
- Chỉ dữ liệu sản phẩm công khai được gửi cùng lịch sử chat và nhu cầu khách nhập; không đọc hồ sơ/booking từ database.
- Chống gửi quá nhanh: tối đa 15 yêu cầu/phút/IP trong mỗi tiến trình. Đây là giới hạn tạm thời, không phải hạn mức toàn cục giữa các instance Vercel. Đặt ngân sách phía tài khoản nhà cung cấp; cần rate limiter dùng chung nếu mở rộng lượng truy cập.

## Kiểm tra

`node tests/ace-conversation.cjs`
`node tests/ace-ai.cjs`
`npm run build`

Kiểm tra API tự động sử dụng nhà cung cấp giả lập, không tốn lượt gọi AI. Cần cấu hình khóa để kiểm tra chất lượng câu trả lời AI thật.

Tài liệu chính thức: https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses
