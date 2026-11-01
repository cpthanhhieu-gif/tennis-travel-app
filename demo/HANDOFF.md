# Bàn giao kiểm thử demo — 31/10/2026

Mở http://localhost:8081/demo. Các kịch bản đã được khởi tạo nên dùng Tiếp tục. Đặt lại khôi phục riêng kịch bản, có hộp xác nhận. Bắt đầu chỉ dùng khi chưa khởi tạo.

## Kết quả kiểm tra qua API

Đã chạy scripts/verify-demo-handoff.mjs: cá nhân tạo booking/cọc; cặp đôi 1+1 nhận/chấp thuận phương án/cọc; A→B→A; đọc lại giữ state; booking khác vùng 404; reset A không đổi B; CLB bổ sung→báo giá→cọc→đổi sân không trùng thông báo; sau tour FEI/share +30 không cộng trùng. Điểm tổng khớp ledger. File legacy giữ nguyên byte. Kết quả máy lưu QA_HANDOFF_RESULTS.json.

## Kiểm tra trình duyệt

Màn quản lý ở 1365×900 và 390×844. Chọn Cặp đôi mở đúng Premium, nhãn demo đúng; tải lại vẫn giữ kịch bản. Booking nạp một người chơi + một người đi cùng, tổng 52,8 triệu theo danh mục. Link Tour Live của booking CLB khi đang ở Cặp đôi hiện Không tìm thấy hành trình, không hiển thị dữ liệu CLB. Nhãn mobile và đường quay về quản lý đã xem trực quan.

## Sửa trong lần kiểm thử

NTRP mẫu Cặp đôi từ 3.0 (không nằm trong tập giá trị API Booking chấp nhận) thành 3.5. Cập nhật định nghĩa, seed và hai file gốc/tiến độ Cặp đôi. Cá nhân mới có mặc định một người chơi thay vì hai.

## Trạng thái bàn giao

Bốn vùng server đã về dữ liệu gốc sau chạy kiểm thử. Cặp đôi vừa mở bước chọn gói trên trình duyệt nên có bản nháp mới 1+1, chưa gửi booking. Có thể Đặt lại để xóa bản nháp bằng revision.

## Giới hạn

Các luồng nghiệp vụ kiểm tra qua API, không phải toàn bộ thao tác bằng tay từng field. Chưa nghiệm thu toàn bộ consent/PAR-Q/check-in trong lượt này. Thẻ chia sẻ ngoài cookie demo chưa phải link công khai độc lập. Lịch Sau tour vẫn dùng lịch danh mục tương lai và trạng thái hoàn thành mô phỏng. App dùng chung cookie giữa các tab, không hỗ trợ hai kịch bản độc lập đồng thời. Tiếp tục nhớ đường dẫn trong session trình duyệt, không đồng bộ giữa thiết bị.
