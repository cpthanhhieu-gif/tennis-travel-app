# Cá nhân hóa nhu cầu nhóm trong Ace

## Luồng khám phá

Chọn Gợi ý gói tour → Nhóm 5–10 hoặc CLB 10–20. Những nhãn này chỉ là điểm vào; phải xác nhận quy mô thực tế trong biểu mẫu.

1. Tổng số khách, người đi cùng không chơi; số người chơi được tính bằng phần còn lại.
2. Chia các nhóm người chơi theo số lượng, trình độ và mục tiêu. Tổng các nhóm phải bằng số người chơi. Không yêu cầu tên từng người; không tự gán NTRP cho cả nhóm.
3. Ăn uống được đếm trên toàn bộ khách, độc lập với nhóm trình độ. Một người có thể vừa ăn chay vừa không lactose; không cộng các yêu cầu này vào tổng khách. Yêu cầu riêng/dị ứng có ghi chú để chuyển cho tư vấn viên xác nhận.

Hồ sơ xác nhận tối đa 20 khách, 8 nhóm người chơi, 6 loại yêu cầu ăn uống. Gói cụ thể vẫn có giới hạn quy mô riêng; hồ sơ không làm tăng sức chứa hoặc tự mở thêm quyền lợi.

## Gợi ý

Ace đọc tên, giá, highlights và sức chứa từ danh mục sản phẩm. Kết quả có hồ sơ nhóm, đề xuất theo ưu tiên, nội dung phù hợp, phần chưa đáp ứng/cần xác nhận và lựa chọn thay thế.

- Thuần học: ưu tiên Leisure & Learning, đối chiếu nội dung huấn luyện cơ bản.
- Thuần thi đấu: ưu tiên Tournament Travel, kiểm tra quy mô đoàn và trình độ.
- Hỗn hợp: theo ưu tiên chung (hoặc số người của từng mục tiêu khi cân bằng), nêu rõ không có gói đã xác nhận đáp ứng toàn bộ; cung cấp lựa chọn cho mục tiêu còn lại.
- Ngân sách, người mới chơi, trình độ chưa rõ, người đi cùng, sức chứa và ăn uống đều có thể tạo phần cần xác nhận. Không tuyên bố thực đơn đã đáp ứng hoặc đã bố trí clinic riêng.

## Sửa trực tiếp

Chọn “Sửa nhu cầu nhóm” hoặc “Sửa bản tóm tắt nhu cầu nhóm”. Biểu mẫu mở toàn bộ các trường đã xác nhận; sửa và cập nhật để tạo gợi ý mới. Không phải trả lời lại các câu hỏi trước. Thông tin đang sửa chưa thay hồ sơ xác nhận cho đến khi lưu.

Hồ sơ đi cùng lịch sử chat trong trình duyệt, được chuyển vào hộp thư tư vấn và ghi chú booking qua bước xác nhận hiện có. Cấu hình booking khách đã nhập vẫn được giữ.

## Tình huống nghiệm thu

- 8 người mới, cùng muốn học → đề xuất học kỹ thuật.
- 8 người trung cấp, cùng muốn thi đấu → đề xuất thi đấu.
- 8 khách: 3 người mới muốn học, 5 người trung cấp muốn thi đấu, 2 người ăn chay → giữ tổng 8, nêu phần cần chia nhóm/xác nhận và thực đơn chay; có phương án thay thế.
- Cùng nhóm hỗn hợp, đổi ưu tiên sang học → đề xuất và giải thích đổi tương ứng.
- 8 người ăn chay và 8 người không lactose trong cùng đoàn 8 người → hợp lệ vì có thể trùng người.
- Tổng nhóm không khớp hoặc một yêu cầu ăn uống vượt tổng khách → chặn xác nhận và chỉ rõ lỗi.
- Ngân sách thấp hơn toàn bộ danh mục hoặc quy mô vượt sức chứa gói → nêu rõ chưa có phương án đáp ứng điều kiện đó.

Kiểm tra: `node tests/ace-group.cjs` cùng các bộ kiểm tra Ace, AI, continuity, hộp thư, booking entry, demo explore; `npm run build`.

Tính năng biểu mẫu và gợi ý theo dữ liệu chạy được khi chưa có khóa AI. Nhận diện nhóm qua câu hỏi tự do vẫn cần bật kết nối AI; phản hồi có hồ sơ nhóm được kiểm tra cấu trúc/tổng số trước khi áp dụng.
