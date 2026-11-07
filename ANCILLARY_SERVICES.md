# Dịch vụ mua thêm theo tour

Danh mục vận hành nằm tại `lib/ancillary-catalog.ts`; API `/api/local` trả danh mục này trong `serviceCatalog`. Khi tạo booking, máy chủ nhận `booking.serviceSelections` dạng `[{ id, quantity }]`, tự tra giá và lưu `serviceLines`, `serviceSubtotal`, `coreTotal` và `total`. Không nhận giá do trình duyệt gửi lên.

Giá từ v2.12 là giá thiết kế trong hồ sơ sản phẩm, chưa phải giá hợp đồng nhà cung cấp. Giá ngoài hồ sơ được gắn `provisional` và máy chủ vẫn tính theo giá niêm yết dự toán để không cần bước hỏi báo giá thủ công trong prototype. Dịch vụ `inactive` bị máy chủ từ chối.

| Tour | Dịch vụ | Giá/đơn vị | Giới hạn tính giá | Đổi/hủy và trạng thái |
|---|---|---:|---|---|
| SBU1 Đà Lạt | Phụ thu phòng đơn | 1.200.000đ/phòng/tour | Tối đa 1 phòng/khách | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%; cần khớp hợp đồng phòng. Giá v2.12. |
| SBU2 Đà Nẵng | Phụ thu phòng đơn | 2.400.000đ/phòng/tour | Tối đa 1 phòng/khách | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%; cần khớp hợp đồng phòng. Giá v2.12. |
| SBU3 Phú Quốc | Phụ thu phòng đơn | 9.000.000đ/phòng/tour | Tối đa 1 phòng/khách | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%; cần khớp hợp đồng phòng. Giá v2.12. |
| SBU3 | HLV đại sứ 1:1 | 1.500.000đ/giờ | Tối đa 2 giờ/khách | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%; đổi lịch tùy giờ HLV. Giá v2.12. |
| SBU3 | Spa recovery bổ sung | 900.000đ/lần | Tối đa 1 lần/khách, ngoài lần đã gồm trong tour | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%; đổi lịch tùy giờ spa. Giá v2.12. |
| SBU3 | Ace Lab 30 phút + video phân tích | 800.000đ/người chơi/buổi | Tối đa 1 buổi/người chơi | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%. Giá gộp v2.12. |
| SBU3 | Pickleball | 400.000đ/người/buổi | Tối đa 1 buổi/khách theo lịch hiện tại | Đề xuất: trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ/không đến thu 100%. Giá v2.12. |
| SBU3 | Deluxe Sea View | +1.200.000đ/phòng/3 đêm | Tối đa 1 hạng nâng cấp/phòng/khách | Tính tự động theo giá dự toán; mốc tham khảo công khai 2026, phụ thuộc resort/hạng phòng gốc. `provisional`. |
| SBU3 | Junior Suite Garden | +4.500.000đ/phòng/3 đêm | Tối đa 1 hạng nâng cấp/phòng/khách | Tính tự động theo giá dự toán; mốc tham khảo công khai 2026, phụ thuộc resort/hạng phòng gốc. `provisional`. |
| Tất cả | Ace Check | 4.900.000đ/người | Tối đa 1 lần/khách | Tính tự động theo dự toán; không phải báo giá cơ sở y tế, phạm vi khám và đối tác cần chốt. `provisional`. |
| SBU3 | VinWonders người lớn | 1.050.000đ/vé | Chưa mở bán | Giá tham khảo 2026; vé ngày cố định có thể không đổi/hoàn. Chưa khớp lịch tự do 14:00–16:00. |
| SBU3 | Snorkeling người lớn | 900.000đ/người | Chưa mở bán | Giá tham khảo 2026; chuyến khoảng 6 giờ, chưa khớp lịch tour. |

## Quy tắc tính

- Giá trị tiền là VND; số lượng phải là số nguyên dương, không trùng mã dịch vụ và không vượt giới hạn theo số khách.
- Chỉ dịch vụ áp dụng cho package đang đặt mới được chấp nhận. Giá tour, phụ thu người đi cùng và dịch vụ được cộng phía máy chủ.
- Thay đổi danh sách dịch vụ trên cùng khóa booking sẽ bị coi là thông tin booking đã thay đổi; không âm thầm giữ giá cũ.
- Khi nhân viên lập báo giá tour SBU2/SBU3, phí dịch vụ đã chọn được cộng thêm vào giá tour trước khi tính đặt cọc.
- Dịch vụ đã gồm trong gói không được bán lại: spa recovery cơ bản, buổi HLV đại sứ cơ bản, vé máy bay/di chuyển và các quyền lợi chính của từng tour.
- Mốc 72/24 giờ và phí 50/100% là điều kiện sản phẩm đề xuất cho các dịch vụ có giá nội bộ, chưa phải cam kết của nhà cung cấp. Cần đưa vào thỏa thuận nhà cung cấp trước khi mở bán thực tế. Dịch vụ `inactive` chưa có điều kiện đủ căn cứ nên chưa được đặt hoặc tính tiền.

## Chưa đưa vào tính tiền

Hành lý máy bay không có giá chung vì phụ thuộc hãng, chặng, hạng vé và hành lý đã gồm trong vé. VinWonders và snorkeling đang bị API khóa do ngày tour 2027 chưa có giá xác nhận và lịch hoạt động chưa khớp.

Giá tham khảo ngoài v2.12 được đối chiếu với [Vinpearl Phú Quốc](https://vinpearl.com/vi/cap-nhat-gia-phong-vinpearl-phu-quoc-moi-nhat), [bảng giá dịch vụ y học thể thao Vinmec](https://www.vinmec.com/vie/chan-thuong-chinh-hinh-y-hoc-the-thao/), [bảng giá CPET Vinmec](https://www.vinmec.com/static/uploads/251104_VMEC_Bang_gia_VMTC_SN_f3efa29081.pdf), [VinWonders Phú Quốc](https://vinwonders.com/vi/wonderpedia/vinwonders-phu-quoc/?lang=vi) và [Into the Blue Phú Quốc](https://intothebluephuquoc.com/). Đây là mốc giá tham khảo 2026, không phải giá hợp đồng hoặc cam kết áp dụng cho tour 2027.

## Phương án tắt/khôi phục

- Cờ máy chủ `ANCILLARY_PRICING_ENABLED=false` ẩn catalog và từ chối dịch vụ mới; bỏ cờ hoặc đặt `true` để bật lại sau khi sửa.
- Booking không chọn dịch vụ giữ nguyên phép tính giá cũ. Booking đã lưu dịch vụ giữ nguyên dòng giá để không làm thay đổi đơn đã tạo; tắt cờ không xóa dữ liệu.
- Nếu lỗi chỉ nằm ở một dịch vụ, chuyển mục đó sang `inactive` trong catalog; không tắt toàn bộ giá dịch vụ.
- Các thay đổi code nằm trong catalog riêng và phần nối ngắn ở API. Khôi phục thủ công chỉ các file của tính năng này; không dùng lệnh hoàn tác toàn repo vì có thay đổi `tsconfig.json` tồn tại ngoài phạm vi này.
