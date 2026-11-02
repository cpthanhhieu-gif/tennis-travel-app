# Passport điện tử & sau chuyến
## Sử dụng
- Cá nhân → Tennis Passport (/passport): xem dấu theo năm khởi hành, điểm đến và kỷ niệm.
- Hành trình → booking hoàn thành → Sau chuyến: xem tổng kết, ghi chú, đánh giá FEI/NPS, mở thẻ chia sẻ và chọn gói muốn tìm hiểu tiếp.
- Điều phối (/operations) → booking hoàn thành cũ → Đối soát Passport: kiểm tra dữ liệu rồi cấp dấu. Không tự cấp lại cho tất cả lịch sử.

## Điều kiện dữ liệu
Dấu được cấp phía server cùng lần ghi nhận hoàn thành: có ngày bắt đầu/kết thúc hợp lệ theo thứ tự, tổng tiền dương và thanh toán đủ, lịch khởi hành khớp dữ liệu tour. Chỉ quản trị Demo được xác nhận hoàn thành hoặc cấp dấu cho chuyến cũ. Dấu giữ nguyên khi gửi lặp; không cộng thêm điểm. Dấu ghi nhận hành trình, không chứng nhận thắng giải hay tham gia mùa Ace Cup chính thức.

Phiên demo có thể mô phỏng tour tương lai. Đây là Passport theo booking trong tài khoản thử chung, chưa phải hồ sơ cá nhân được xác minh của từng thành viên. Triển khai khách thật cần tài khoản và đối soát vận hành thực tế.

## Nội dung và quyền riêng tư
Ghi chú tối đa 500 ký tự và gói muốn tìm hiểu được lưu theo booking, có thể xoá bằng cách lưu nội dung trống. Không tạo booking, không gửi tin, không coi lựa chọn là đồng thuận tiếp thị. Các trường này không được đưa vào thẻ công khai. Không có album ảnh khách thật; UI dùng khung ảnh chờ bổ sung. Tích luỹ theo năm khởi hành, không tự suy ra danh hiệu/mùa giải.

## Kiểm tra
- node scripts/check-passport.cjs: điều kiện cấp dấu, quyền gọi complete, chống trùng dấu/điểm, lưu/đọc ghi chú, kiểm tra dữ liệu cũ và cấp dấu sau đối soát.
- node scripts/check-demo-access.cjs: người dùng thường không thể tự gọi verifyPassport.
- TypeScript và build.
Chưa thay thế kiểm tra trực quan trên điện thoại và cơ sở dữ liệu Vercel thật.
