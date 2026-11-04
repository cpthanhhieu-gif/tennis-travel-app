# Gợi ý Ace bằng quy tắc dữ liệu sản phẩm

## Nguồn dữ liệu

- `tourPackages[].discovery`: mục tiêu chính, quy mô tối thiểu, khả năng hỗ trợ người mới; đi cùng các quyền lợi hiện có của sản phẩm.
- `tours[].departureSchedules`: giá theo lịch, không lấy giá gói ghi riêng làm giá booking.
- `packageCapacity`, `companionRate`, `coupleTotal`: giới hạn quy mô và giá cơ bản theo đúng cơ cấu người chơi/người đi cùng.
- `tours[].ntrpRange`: khoảng trình độ tham khảo của từng tour, không xem là xác nhận của HLV.

## Thứ tự xét

1. Có lịch/giá hợp lệ và quy mô trong giới hạn. Tournament từ 8 khách; chưa rõ số khách thì không tự mặc định một đoàn 8 người.
2. Ưu tiên lựa chọn trong ngân sách mỗi người. Nếu mọi gói đều vượt, hiển thị lựa chọn hợp lệ có giá thấp nhất và nói rõ chưa có gói đáp ứng ngân sách.
3. So mục tiêu chính, mục tiêu từng nhóm và nhu cầu của người mới. Điểm chỉ dùng để sắp xếp nội bộ, không hiển thị thành phần trăm phù hợp.
4. Nêu quyền lợi có thật, chênh lệch ngân sách, nhu cầu chưa đáp ứng và thông tin cần đơn vị tổ chức xác nhận. Không cam kết thực đơn, ghép nhóm, đối tác hay phụ thu chưa chốt.

Gói khách đang quan tâm không được vượt qua các điều kiện mới. Thay đổi ngân sách hoặc quy mô sẽ so sánh lại tất cả các gói. Đối chiếu trên thẻ dùng giá lịch đang chọn và nhu cầu hiện tại; lịch sử lời tư vấn vẫn được giữ.

## Tình huống trình diễn

- 1 người mới, ưu tiên học, 7 triệu/người: Leisure & Learning.
- 8 người trung cấp, muốn thi đấu, 15 triệu/người: Tournament Travel.
- 2 người (1 chơi/1 đi cùng), nghỉ dưỡng, 30 triệu/người: Premium; giảm còn 7 triệu/người chuyển sang Leisure và nêu phần nghỉ dưỡng chưa tương đương.
- 20 khách muốn Premium: gói Premium bị loại do tối đa 16 khách, Ace đưa lựa chọn hợp lệ và lý do đánh đổi.
- Ngân sách thấp hơn mọi gói: không tuyên bố có lựa chọn đã đáp ứng giá.

Kiểm tra: `node tests/ace-recommendation.cjs`; cùng các bộ kiểm tra hội thoại, nhóm, sửa nhanh, nhận diện câu tự nhiên và booking hiện có. Có kiểm tra đổi trực tiếp giá lịch trong dữ liệu để xác nhận kết quả thay đổi theo nguồn thật.
