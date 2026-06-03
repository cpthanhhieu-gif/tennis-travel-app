# Layout Rules

## Spacing Discipline
- Chỉ dùng giá trị từ spacing scale. Không hardcode px lẻ.
- Spacing giữa 2 elements liền nhau: tối thiểu space-2 (8px)
- Spacing giữa 2 tap targets liền nhau: tối thiểu space-2 (8px)

## 8px Grid
- Mọi element căn theo lưới 8px
- Exception cho 4px: icon padding, badge padding

## Z-index Layers (nghiêm ngặt — không được tùy tiện tăng)
| Layer | Value | Dùng cho |
|---|---|---|
| base | 0 | Nội dung thường |
| raised | 10 | Card hover |
| dropdown | 100 | Dropdown, select, tooltip |
| sticky | 200 | Header, bottom nav |
| modal | 300 | Modal, dialog, drawer |
| toast | 400 | Toast, snackbar |
| tooltip | 500 | Tooltip (trên cùng) |

## Responsive — Mobile First
```
✅ ĐÚNG: class="w-full sm:w-1/2 lg:w-1/3"
❌ SAI:  class="w-1/3 sm:w-full"
```

## Safe Areas (Mobile)
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

## Container
- Luôn có `max-width` và `margin: 0 auto`
- Không để content chạm sát mép màn hình (luôn có page-margin)
