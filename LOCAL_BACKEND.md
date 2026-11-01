# Backend cục bộ

Dùng tài khoản thử chung qua Cá nhân. Session HTTP-only hết hạn sau 24 giờ; logout thu hồi session. Tất cả phiên thuộc cùng một tài khoản thử, không phải hệ thống nhiều người dùng.

API /api/local lưu booking/session ở .local-data/store.json (gitignore). Một tiến trình Node, hàng đợi ghi và thay file để hạn chế ghi đè. Không triển khai dạng nhiều instance hoặc serverless. Không nhập dữ liệu sức khỏe; ghi chú không được lưu ở backend; liên hệ tên/phone/email được lưu cùng yêu cầu khi có dữ liệu.

Giá tính lại từ lịch bán tại server. Client gửi khóa chống booking trùng; thanh toán thành công không ghi cọc lại khi retry. Leisure đặt cọc 30%; Premium chờ phương án, cọc30%; Tournament chờ báo giá, cọc50%. Chặn thanh toán trước khi xem và chấp thuận phương án/báo giá. Premium/Tournament có phương án theo nguyên lịch và giá đã chọn, theo phương án gọn được người dùng duyệt; chưa có màn vận hành riêng. Khách xem rồi chấp thuận mới mở thanh toán.

Chỉ có bộ điều khiển kết quả thanh toán nội bộ, chưa có cổng thanh toán sandbox. Không thu tiền. Không có email/SMS, auth nhà cung cấp, loyalty bên ngoài.

Ace Club hiển thị booking và ledger cục bộ. Tích điểm tour = floor(tổng booking × 2 / 100.000), giữ cách tính điểm dự kiến đã dùng. Không ghi điểm từ cọc; chỉ ghi khi thanh toán đủ và có sự kiện hoàn thành. Không thay tier. Hoàn/hủy điểm và hạn điểm chưa thuộc lượt triển khai này.

PAR-Q hiện theo quy trình tự khai hoàn tất tại nguồn chính thức; app lưu trạng thái tối thiểu và đồng thuận theo từng người, không thu câu trả lời hoặc hồ sơ sức khỏe. Lịch chưa có dữ liệu tương ứng hiển thị chờ cập nhật, không thay bằng lịch Đà Nẵng.

Kiểm thử: node scripts/check-local-api.cjs. Dùng thư mục tạm, không sửa dữ liệu app. Kiểm tra auth/origin/validation/giá/cọc/idempotency/retry/persistence/logout. Chưa thay thế QA trình duyệt.

## Quy tắc đã duyệt ngày 30/10/2026

Điểm tour chỉ ghi nhận sau khi thanh toán đủ và hoàn thành hành trình. FEI +20 một lần mỗi hành trình. Share +10 một lần mỗi thẻ sau khi chia sẻ thành công; copy link không tính. Đã nối backend cho các sự kiện hoàn thành/FEI/share gắn booking. Không suy ra hoàn thành tour từ thanh toán cọc. Ledger và booking được ghi cùng một lần trong hàng đợi, khóa duy nhất theo booking + loại thưởng. Không cộng lại khi gửi trùng, đồng thời, reload hoặc thử lại.

## Thao tác kiểm tra Ace Points

Trong Hành trình: đã cọc → Sắp đi, trả đủ chưa tự kết thúc. Bắt đầu/kết thúc chỉ nằm tại /test-controls; sau sự kiện bắt đầu mới là Đang đi, sau kết thúc và đủ tiền mới ghi điểm tour. Sau hoàn thành có FEI rating 1–5, gửi lần đầu nhận +20 bất kể mức đánh giá; gửi lại không thay bản đánh giá đầu hoặc cộng điểm.

Mở thẻ thành tích từ booking đã hoàn thành: dữ liệu của booking, native share thành công mới gọi backend +10. Không hỗ trợ native share thì cho copy link thủ công, không thưởng. Lỗi/hủy share không thưởng. Chia sẻ xong nhưng ghi điểm lỗi có nút thử ghi nhận lại trong phiên thẻ; reload trước khi retry có thể cần chia sẻ lại, backend vẫn chống trùng. Thẻ có ID cố định theo booking; thẻ mẫu không được ghi điểm. Link thẻ cần đăng nhập tài khoản cục bộ, không phải link công khai.

Backend nhận sự kiện chia sẻ thành công từ client; đây không phải xác minh đăng bài qua API mạng xã hội. Không tự đăng hoặc gửi tới người khác. Không thêm tích hợp loyalty bên ngoài.

Kiểm thử API: 13,8 triệu → 276 điểm tour +20 FEI +10 share =306; không điểm khi mới cọc/trả đủ mà chưa hoàn thành; rating1 vẫn +20; duplicate/concurrent/reload giữ đúng 3 dòng ledger. Chặn FEI/share trước hoàn thành; hủy share không ghi điểm.

## Nhánh Premium và Tournament — cập nhật 30/10/2026

Tournament: gói/ngày/quy mô đoàn → liên hệ đại diện → review/gửi yêu cầu (3 bước), không quiz NTRP đại diện. Thông tin thành viên bổ sung sau, chưa thu hộ PAR-Q hoặc tự nhận hợp đồng.

Premium: giữ NTRP cá nhân; gửi yêu cầu → Xem phương án → Chấp thuận → cọc30% → phần còn lại. Tournament: gửi yêu cầu → Xem báo giá đoàn → Chấp thuận báo giá → cọc50% → phần còn lại. Hai nhánh dùng lịch/giá gói đã chọn, không có giá thương lượng, phụ thu hoặc hợp đồng điện tử. Mốc đủ D-15 hiển thị, chưa tự tính deadline/vận hành.

Phương án có ID cố định, ngày tạo, tổng và cọc. Chấp thuận cần đúng ID; gọi lại không hạ trạng thái đã thanh toán. Booking cũ đang chờ có thể dùng cùng luồng. Thanh toán thất bại/hủy cho thử lại và chống thu trùng; không thay quy tắc Ace Points.

## Chuẩn bị → Tour Live → Hoàn thành

- Trạng thái phân nhóm: Chờ xử lý (chưa đủ cọc), Sắp đi (đã cọc), Đang đi (startedAt), Đã hoàn thành (completedAt). Booking cũ có completedAt tiếp tục thuộc đã hoàn thành, không xóa điểm/lịch sử.
- Hành trình chỉ dẫn /in-tour?booking=ID khi chuyến đang đi. Không ID, sai ID, chưa đăng nhập, chưa bắt đầu hoặc đã kết thúc đều có phản hồi và đường về phù hợp.
- Tour Live dùng tên khách, tour, ngày, điểm đến và mã chuyến từ booking; chưa có lịch chi tiết thì hiển thị chờ cập nhật, không dùng danangItinerary hoặc tỷ số mẫu thay thế.
- Khách không có nút tự bắt đầu/kết thúc. Trang điều khiển thử nghiệm riêng: /test-controls. Không gắn trong navigation khách. Bắt đầu cần đã cọc; kết thúc cần đã bắt đầu và thanh toán đủ; không được mở lại chuyến hoàn thành; retry không cộng trùng.
- Đây là tài khoản thử chung. Marker source=test-controls phân luồng thao tác, không phải cơ chế phân quyền vận hành/role bảo mật. Chưa tích hợp hệ thống điều hành thật. Bộ điều khiển cho phép chủ động kiểm tra chuyến tương lai; ngày khởi hành không tự kết thúc chuyến hoặc tự cộng điểm.

## Phân vai ba màn — 31/10/2026

/pre-tour dùng JourneyDashboard: danh sách/nhóm trạng thái, báo giá/phương án, thanh toán, checklist, Tour Live, FEI và thẻ thành tích. Không logout hoặc khối quyền lợi/ledger.

/gamification dùng AceClubDashboard: số dư, hạng theo thresholds hiện có trong mock-data, quyền lợi theo hạng, ledger và link thẻ/hành trình. Không form thanh toán/FEI hoặc thao tác trạng thái chuyến.

/profile dùng ProfileDashboard: đăng nhập/logout, sửa tên/phone/email hồ sơ lưu cục bộ; không ghi đè liên hệ từng booking. NTRP có hồ sơ riêng từ quiz được lưu theo tài khoản thử, không lấy trình độ đại diện thay cho đoàn. Không tích hợp loyalty/auth mới, không thay thresholds/scoring. Cả ba dùng chung hook truy cập dữ liệu, không dùng chung nội dung màn hình.

## Hồ sơ xuyên luồng — 31/10/2026

Quiz lưu NTRP bằng công thức hiện có, server kiểm tra đủ5câu và tự tính kết quả. Booking mới chọn dùng lại hoặc làm lại, chưa tự đặt thời hạn hết hiệu lực. Cá nhân hiển thị mức và ngày đánh giá. Liên hệ hồ sơ chỉ điền khi khách bấm chọn. Booking lưu riêng liên hệ và NTRP tại thời điểm gửi; cập nhật hồ sơ sau đó không đổi booking cũ. Tournament không lưu NTRP của đại diện thay cho đoàn.

Đổi gói theo gợi ý mở chọn lịch trống, bắt chọn ngày và xem tổng giá rồi mới áp dụng; không tự chọn ngày đầu. Không lưu thêm sức khỏe hoặc thay scoring/giá/tier.

## Lịch hoạt động đa dạng theo quyền lợi — 31/10/2026

Dữ liệu kế hoạch theo v2.12 mục5.1/5.2: Leisure2ngày có2buổi sân+1clinic+1cooking; Tournament3ngày có4buổi sân round-robin/playoff+city tour ngắn, không tự thêm spa/private dining; Premium4ngày có3buổi sân+Ace Cup+5bữa FEI+spa. Các bữa ăn thường tách khỏi5bữa FEI, hoạt động tuỳ chọn tách khỏi quyền lợi bao gồm. Không gán tên NCC đã ký, điểm FEI đạt sẵn, kết quả thi đấu hoặc API live.

Hai lịch khởi hành mỗi gói có biến thể: Leisure món cooking/tản bộ; Tournament chiến thuật/city tour; Premium cooking và trải nghiệm tự chọn. Ngày thực tế theo mã chuyến; ID hoạt động ổn định theo gói/ngày/nội dung. Các dấu checklist cũ được đọc lại qua alias khi nội dung tương ứng, không gán trạng thái cũ sang hoạt động khác nghĩa. Không tự cộng điểm từ checklist.

## Đợt2 — Việc tiếp theo và xử lý yêu cầu (31/10/2026)

Bám v2.12 trang54: Leisure lịch cố định, Premium ≤24giờ, Tournament báo giá ≤1ngày làm việc. Bổ sung trạng thái UX cần thêm thông tin/không đáp ứng cho yêu cầu chưa cọc; lý do mẫu về giờ đến, thông tin CLB, lịch sân/HLV. Không thay SLA, giá, điểm; không xử lý hoàn tiền, không tự suy ra đáp ứng nguồn cung thật.

Mỗi booking có việc tiếp theo và lịch sử từ các sự kiện thực sự được lưu (gửi, bổ sung, phương án, chấp thuận, thanh toán). Booking cũ chưa có history không được bịa mốc quá khứ. Chặn phương án/thanh toán khi còn thiếu thông tin hoặc không đáp ứng. Form bổ sung giữ draft trong phiên khi lỗi; 401 cho đăng nhập tại chỗ.

/test-controls có nút thêm4tình huống; gọi lại không nhân bản hoặc ghi đè. Khách xem lý do, bổ sung và đi tiếp qua phương án; không đáp ứng dẫn tới chọn lịch/gói khác, không tự tạo booking hay thu tiền. Hoạt động nhóm, sân/HLV và thông báo đổi lịch thuộc đợt1/3 chưa triển khai trong lượt này.

## Đợt3 — Diễn biến trong chuyến (31/10/2026)

Trạng thái từng hoạt động: sắp tới/đang diễn ra/hoàn tất/đổi lịch/hủy; nguồn cập nhật /test-controls, không suy ra từ checklist hoặc đồng hồ vì có chuyến tương lai được thử trước ngày. Chỉ một hoạt động đang diễn ra, không sửa chuyến đã hoàn thành. Không thay điểm/giá/quyền lợi.

Tour Live hiển thị hiện tại/tiếp theo, bỏ hoạt động đã hoàn tất/hủy khỏi danh sách tiếp theo. Dời giờ trong ngày/đổi địa điểm/hủy sinh thông báo có trước–sau/lý do/thời gian/đã xem. Xác nhận chỉ áp dụng thông báo đúng booking, lưu bền; gửi lại nội dung không tạo trùng. Bấm Cập nhật trong Tour Live để lấy thay đổi mới, chưa push/polling. Checklist cá nhân giữ nguyên và độc lập với trạng thái vận hành.

Điều khiển có mẫu dời giờ do mưa/đổi sân/hủy, cần bấm cập nhật để áp dụng. Chưa triển khai phân nhóm hoặc gán HLV (đợt1); chưa có API đối tác hoặc tự giải quyết bồi hoàn do hủy hoạt động.

## Đợt1 — Nhóm tập, sân và HLV (31/10/2026)

Fixture mỗi gói có2nhóm với khoảng NTRP, HLV, sân và danh sách tập luyện; tối đa6người/HLV theo định hướng v2.12. Các tên HLV/thành viên là dữ liệu do app tạo, chưa là cam kết đối tác. Khách FIT được hiển thị cùng nhóm theo booking, đại diện GIT xem một nhóm của đoàn và không dùng điểm đại diện làm trình độ cả đoàn.

Nhóm chỉ được gán thủ công ở /test-controls. FIT chưa có NTRP chờ đánh giá; không tự gán theo khoảng điểm, không tạo thuật toán ghép nhóm. Các buổi sân/clinic/Ace Cup hiện HLV/sân của nhóm; địa điểm đã đổi ở đợt3 được ưu tiên theo từng buổi.

Khách gửi yêu cầu điều chỉnh, nhóm hiện tại giữ nguyên đến khi điều phối chấp thuận hoặc phản hồi giữ nhóm. Yêu cầu có ID, chống gửi trùng khi đang chờ và chống xử lý nhầm yêu cầu cũ. Không thay điểm, giá, tier, trạng thái chuyến hoặc thu dữ liệu sức khỏe.


## Pilot feedback, preparation and referral — 31/10/2026

- FEI five criteria 0–100 per meal/participant; schema fei-pilot-v1 uses equal-weight arithmetic mean as a provisional, disclosed method. Legacy 1–5 ratings remain separate. A meal opens after its operational completion or trip completion. NPS 0–10 opens after trip completion. Duplicate identical submissions are idempotent; changed submissions are rejected. No overwrite or automatic migration of legacy responses.
- /pilot aggregates completed local trips, gives participant response denominators, criterion means, NPS formula, referral booking/deposit/completion counts and JSON export. These are local demo records, not a certified pilot result. Participant slots have no separate verified identity under the existing shared account.
- Preparation is per participant slot. PAR-Q+ is completed at the official external source https://eparmedx.com/; raw medical responses are not collected. The app records self-declaration status, not clinical clearance. Operational, marketing and photo consents are independent and versioned; choices can be withdrawn. Changed choices revoke existing check-in passes.
- QR passes expire after 24 hours and require deposit, operational consent and the player's completed declaration. The /check-in desk confirms idempotently. It explicitly uses the existing test-controls source marker, not production staff authorization. It does not start/end the tour or grant points.
- Owner can explicitly create/revoke a 30-day public card with a chosen alias. /s/[token] is readable without login and includes only alias, tour, completion date and expiry. No booking IDs, contacts, NTRP, loyalty balance, survey or preparation fields are exposed. Referrals carry through product detail to booking; server verifies an active token and records source, without automatic referral reward or new-customer verification. Self-referral contact matches are rejected. Previously accepted bookings retain attribution on retry after token revocation.
- localhost links are local previews. External recipients and phone QR use need an accessible host/base URL. No public deployment, messaging, medical partner API, production identity or staffing integration was added.
- Verification: npm build; scripts/check-local-api.cjs on isolated temporary data; UI inspection of FEI fields, NPS, preparation choices, share controls and pilot report. Native external sharing and real camera scan remain device checks.
