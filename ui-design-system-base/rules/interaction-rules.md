# Interaction & Animation Rules

## Transition Standards (bắt buộc có duration + easing)
| Loại | Duration | Easing | Dùng cho |
|---|---|---|---|
| Micro | 150ms | ease-out | Hover, focus, color change |
| Short | 250ms | ease-in-out | Dropdown expand, accordion |
| Medium | 300ms | ease-in-out | Modal open/close, drawer |
| Long | 400ms | ease-in-out | Page transition |
| Expressive | 500–1000ms | ease-out | XP bar, counter, celebration |

## Easing Rules
- **Enter / Open**: `ease-out` (bắt đầu nhanh, kết thúc chậm — cảm giác mượt mà)
- **Exit / Close**: `ease-in` (bắt đầu chậm, kết thúc nhanh — cảm giác dứt khoát)
- **Movement**: `ease-in-out` (tự nhiên cho chuyển vị trí)

## Hover States
- Chỉ apply trên desktop (`@media (hover: hover)`)
- Không apply trên touch device

## Gesture (Mobile)
| Gesture | Action | Notes |
|---|---|---|
| Swipe down | Đóng bottom sheet | threshold 30% chiều cao |
| Pull to refresh | Refresh list | threshold 60px |
| Swipe left/right | Delete item / Navigate | Chỉ khi có visual hint |
| Long press | Context menu | Feedback haptic nếu có |
| Pinch | Zoom ảnh | Chỉ trên image viewer |

## Feedback Timing
| Response time | Action |
|---|---|
| < 100ms | Không cần indicator — cảm giác instant |
| 100ms – 300ms | Không cần indicator — chấp nhận được |
| > 300ms | Hiển thị loading indicator |
| > 1000ms | Hiển thị progress + cho phép cancel |

## Animation — Không được dùng khi
- Nội dung thông tin quan trọng (bảng giá, điều khoản)
- Animation loop > 5 giây
- Flashing > 3 lần/giây (nguy cơ epilepsy — vi phạm WCAG)
