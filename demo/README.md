# Bốn kịch bản demo — phạm vi bước 1

Các file JSON là đặc tả bối cảnh, chưa phải seed chạy được và chưa được app đọc. Không thay đổi dữ liệu local hiện tại.

- personal.json: Cá nhân, bắt đầu khám phá Leisure, không booking/NTRP/điểm.
- couple.json: Premium, một người chơi + một người đi cùng, chưa gửi yêu cầu.
- club.json: một yêu cầu báo giá Tournament, 16 thành viên, một tài khoản đại diện.
- returning.json: một chuyến hoàn thành, đã trả đủ; điểm tour khớp ledger, chưa làm FEI/chia sẻ.

Mỗi file có problem, goal, entryPath/entryIntent, initialData, steps, completionSignals, mustRemainForUser và operatorEvents. entryPath là đích dự kiến; chưa đảm bảo app đã hỗ trợ query hoặc tự mở đúng booking.

## Quy tắc cho bước triển khai dữ liệu

1. Danh mục tour/lịch/giá/quy tắc dùng nguồn chung. Chọn mã lịch hợp lệ tại thời điểm seed; ngày của chuyến Sau tour phải ở quá khứ. Không tự bịa trạng thái tồn chỗ.
2. Mã tài khoản/booking/người tham gia/ledger mang vùng kịch bản riêng; liên kết cùng kịch bản.
3. Dữ liệu gốc bất biến; tiến độ chạy lưu riêng. Chuyển kịch bản không trộn dữ liệu hoặc bản nháp.
4. Không tự gửi booking, chấp thuận, trả tiền, ghi đồng thuận, FEI hay chia sẻ thay người thử.
5. Trạng thái chuẩn bị mẫu CLB chỉ nạp bằng sự kiện vận hành ở giai đoạn phù hợp; không giả là đại diện khai thay.
6. Cọc và điều kiện xác nhận cần đối chiếu ma trận nghiệp vụ khi seed, không chốt công thức mới trong đặc tả này.

## Kiểm tra bước 1

Đủ bốn ID duy nhất, mỗi kịch bản có mục tiêu, đầu vào, các bước và dấu hiệu hoàn thành; automaticActions đều rỗng. Chưa tạo CRM, API chuyển kịch bản hoặc nạp dữ liệu thực thi.

## Bước 2 — Vùng dữ liệu chạy

Đã có nền lưu trữ, chưa có màn CRM. Các JSON vẫn là đặc tả; lib/demo-store.ts tạo seed chạy được từ danh mục tour và quy tắc dùng chung.

- Dữ liệu cũ: .local-data/store.json, vẫn là mặc định khi chưa chọn kịch bản.
- Mỗi kịch bản: .local-data/scenarios/<id>/original.json (gốc bất biến) và store.json (tiến độ).
- Tài khoản, session, NTRP, orders (gồm participant/preparation/payment/itinerary updates/notices/surveys/publication), ledger được lưu trọn trong vùng riêng.
- Thành viên dùng cơ chế ID p1…p16/c1 hiện có, không tạo thêm tài khoản đăng nhập.
- Booking draft và Home filters dùng khóa trình duyệt theo kịch bản. Reset đổi revision riêng của kịch bản để bản nháp cũ không được khôi phục. Khóa cũ giữ nguyên. Bản nháp hiện vẫn dùng sessionStorage, không đồng bộ thiết bị.
- API POST /api/local có action demoSelect/demoReset với scenario personal/couple/club/returning. demoSelect legacy quay về dữ liệu cũ. Chỉ gọi cùng origin. Chuyển/reset cần điều hướng tải mới toàn trang khi nối CRM để loại state React cũ; không chỉ đổi cookie trên màn đang mở.
- Thẻ public đọc vùng đang kích hoạt. Link demo không được xem là link công khai xuyên kịch bản; chia sẻ thật ngoài ngữ cảnh demo chưa thuộc bước này.
- Seed Sau tour dùng lịch danh mục hiện có (hiện là lịch mẫu tương lai) với trạng thái hoàn thành mô phỏng; cần chốt đồng hồ demo/lịch lịch sử ở bước hoàn thiện kịch bản, không sửa danh mục chung để giả ngày quá khứ.

Kiểm tra: scripts/verify-scenario-isolation.mjs kiểm tra A/B/A, reset riêng, số booking/thành viên/NTRP, điểm nhất quán và so sánh nguyên byte file legacy trước/sau. Script dùng cookie jar riêng, không chuyển kịch bản trên trình duyệt người dùng. Không có dữ liệu thật hoặc thanh toán thật.

## Bước 4 — Vận hành mô phỏng

Trong /demo, chỉ thẻ kịch bản đang kích hoạt hiện thao tác vận hành theo booking. Gửi phương án/báo giá dùng quy tắc offer hiện có; yêu cầu bổ sung chặn khi đã chấp thuận/trả tiền; đổi sân chọn buổi court/clinic/competition đầu tiên, chỉ cho phép sau cọc và trước hoàn thành. Sự kiện đổi sân lưu before/after và thông báo, gửi lặp cùng sự kiện không tạo thêm thông báo.

API demoOperate kiểm tra scenario trùng cookie đang chọn và booking thuộc vùng đó. Không hỗ trợ kịch bản legacy. Thanh toán vẫn mô phỏng và không được thao tác vận hành tự động thực hiện.

Chuyển kịch bản điều hướng toàn trang, đóng toàn bộ popup/state tạm; bản nháp của mỗi kịch bản giữ riêng. Tab app đang mở kiểm tra cookie khi focus và định kỳ 1,5 giây, tải lại khi kịch bản hoặc revision đổi. Đây là demo local dùng chung cookie theo trình duyệt, không hỗ trợ chạy hai kịch bản độc lập đồng thời trong hai tab.

Kiểm tra scripts/verify-demo-operations.mjs đã chạy: chặn scenario sai, booking sai; yêu cầu bổ sung; chặn gửi offer trước bổ sung; bổ sung rồi nhận offer; chặn đổi sân khi chưa cọc; dữ liệu personal và legacy nguyên byte. Sau kiểm tra CLB ở trạng thái có báo giá, chưa trả tiền. Chưa kiểm thử nhánh đổi sân thành công sau cọc trong lượt này.

Kiểm tra bổ sung đã qua: chấp thuận + cọc mô phỏng CLB, đổi sân thành công, lưu thông báo before/after, gửi lại không trùng thông báo. CLB hiện ở trạng thái đã cọc và có đổi sân; có thể Đặt lại trong /demo. Không có giao dịch thật.
