# Hộp thư tư vấn Ace

- Trong cửa sổ Ace, chọn “Nhờ tư vấn viên hỗ trợ” để chuyển câu hỏi gần nhất cùng ngữ cảnh, không cần nhập lại. Phản hồi nằm trong cùng dòng chat. Chỉ báo gửi thành công sau khi máy chủ lưu hội thoại.
- Quản trị viên vào `/operations`, đăng nhập quản trị hiện có rồi mở Hộp thư tư vấn. Lọc Mới / Đang xử lý / Đã trả lời, xem ngữ cảnh và gửi phản hồi.
- Hộp thư quản trị cập nhật mỗi 15 giây. Hội thoại khách cập nhật mỗi 10 giây khi cửa sổ chat mở; khi đóng rồi mở lại sẽ tải phản hồi. Khách không cần đăng nhập.
- Mã truy cập ngẫu nhiên 256 bit lưu trong trình duyệt giúp khách nhận lại hội thoại sau khi tải lại/chuyển trang. Máy chủ chỉ dùng mã băm để tra cứu. Không đưa mã vào URL. Mất dữ liệu trình duyệt sẽ mất quyền truy cập hội thoại cũ; liên hệ khách cung cấp vẫn có trong hộp thư.
- Hộp thư dùng chung cho đội quản trị của ứng dụng, không bị mất khi đổi/reset kịch bản demo. Khách chỉ đọc hội thoại của mình. API quản trị kiểm tra quyền đăng nhập hiện có ở máy chủ.
- Dùng kho dữ liệu hiện có. Bản Vercel cần `DATABASE_URL` và `DEMO_ADMIN_PASSWORD` như trang vận hành. Không cần khóa AI hoặc nhà cung cấp email. Chưa gửi thông báo email/Zalo/Telegram.
- Giới hạn hiện tại: 500 hội thoại, 100 tin/hội thoại, 2.000 ký tự/tin, 8 lượt gửi/phút/IP. Chưa có lưu trữ/xóa hội thoại trên giao diện.
- Câu hỏi và phản hồi lưu ở máy chủ ứng dụng, không gửi sang OpenAI qua luồng tư vấn viên.

Kiểm tra: `node tests/support-inbox.cjs`, các kiểm tra Ace hiện có và `npm run build`.
