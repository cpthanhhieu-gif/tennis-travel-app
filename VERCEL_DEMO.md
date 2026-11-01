# Demo trên Vercel

## Kết nối dữ liệu

1. Trong Vercel, mở Storage → Create Database → Neon (Postgres).
2. Chọn gói phù hợp và vùng gần người thử; kết nối database vào dự án tennis-travel-app.
3. Trong Settings → Environment Variables, kiểm tra DATABASE_URL đã có cho môi trường Production. Không dùng NEXT_PUBLIC_DATABASE_URL.
4. Thêm DEMO_ADMIN_PASSWORD: mật khẩu riêng ít nhất 16 ký tự, chỉ phía server. Không đưa vào Git hoặc gửi trong link khách.
5. Deploy nhánh update/tennis-travel-experience-v2.12. Nếu sửa biến sau deploy, triển khai lại.
6. Mở /demo: app tự tạo bảng tennis_demo_documents khi kết nối lần đầu. Tài khoản database cần quyền CREATE TABLE, SELECT, INSERT, UPDATE.

## Trình diễn trên hai thiết bị

1. Máy điều khiển: mở /demo, đăng nhập mật khẩu quản trị.
2. Chọn / khởi tạo kịch bản cần dùng trong Quản lý kịch bản.
3. Ở đầu trang, chọn cùng kịch bản trong Link dành cho khách. Sao chép link và mở trên điện thoại; bấm Tham gia, rồi đăng nhập tài khoản thử tại Cá nhân.
4. Mỗi phiên chia sẻ một hồ sơ và tiến độ thử nghiệm cho mỗi kịch bản. Đây là mô hình demo có chủ đích, chưa phải tài khoản khách hàng thật.
5. Máy điều khiển: Demo → Trạng thái chuyến đi. Xác nhận thanh toán mô phỏng, Bắt đầu chuyến, Kết thúc chuyến; công cụ vận hành dùng chung dữ liệu phiên này.
6. Màn Hành trình và Tour Live của khách tải lại mỗi 5 giây khi tab đang mở. Sau khi reset kịch bản, khách cần đăng nhập lại tài khoản thử.
7. Muốn trình diễn độc lập: tạo phiên mới bằng mật khẩu quản trị, gửi link phiên mới. Dữ liệu phiên cũ được giữ riêng. Không chia sẻ link phiên cho người ngoài buổi demo.

## Phạm vi và triển khai

- Dữ liệu dùng PostgreSQL dạng JSONB; giao dịch và khóa database ngăn mất cập nhật / ghi điểm trùng giữa nhiều máy chủ Vercel. Khóa chung phù hợp lượng truy cập demo nhỏ.
- Khi VERCEL hoặc DATABASE_URL có giá trị, không ghi tệp trên máy chủ; thiếu DATABASE_URL sẽ từ chối kết nối. Chạy trên máy không có hai biến này giữ chế độ tệp .local-data.
- Quyền quản trị dùng cookie HttpOnly có chữ ký, gắn với phiên và hết hạn sau 24 giờ. Máy chủ kiểm tra các thao tác vận hành, không tin trường source từ trình duyệt.
- Link khách là mã tham gia riêng. Các người tham gia cùng phiên/kịch bản dùng chung dữ liệu thử; dùng dữ liệu giả, không nhập hồ sơ thật.
- Thanh toán hiện là mô phỏng do quản trị xác nhận; chưa kết nối cổng thanh toán.
- Bản này không tự tải dữ liệu .local-data hiện có lên cloud. Khởi tạo kịch bản mới trên Vercel.
- Chưa có tài khoản database trong workspace: phải kiểm tra kết nối thật, cập nhật hai thiết bị và lưu sau redeploy trên Vercel trước khi nghiệm thu cloud.

## Kiểm tra

- node scripts/check-demo-access.cjs (kiểm tra quyền API với kho dữ liệu thay thế trong bộ nhớ; không kiểm tra kết nối PostgreSQL thật)
- node scripts/check-demo-auth.cjs
- node scripts/check-group-request.cjs
- node scripts/check-premium-request.cjs
- node scripts/check-operations.cjs
- npx tsc --noEmit -p tsconfig.cloud-check.json
- npm run build
