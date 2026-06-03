# Accessibility Rules (WCAG 2.1 AA — Bắt buộc)

## Color Contrast (không được thấp hơn)
| Loại | Tỷ lệ tối thiểu |
|---|---|
| Text thường (< 18px) | 4.5:1 |
| Text lớn (≥ 18px regular hoặc ≥ 14px bold) | 3:1 |
| UI components (button border, input border) | 3:1 |
| Decorative / disabled | Không yêu cầu |

## Touch Targets
- Minimum: **44×44px** (iOS HIG) / 48×48dp (Material)
- Nếu visual nhỏ hơn: dùng padding ẩn để đạt kích thước

## Focus Indicators
- Bắt buộc visible trên mọi interactive element
- Style tối thiểu: outline 2px primary-500, offset 2px
- Không dùng `outline: none` mà không thay thế

## Keyboard Navigation
- Mọi interactive element accessible bằng Tab
- Tab order theo luồng đọc tự nhiên (trái → phải, trên → dưới)
- ESC đóng modal/dropdown
- Enter/Space activate button/checkbox

## ARIA
- Icon-only button: bắt buộc `aria-label`
- Images: bắt buộc `alt` (decorative: `alt=""`)
- Form input: bắt buộc `<label>` hoặc `aria-label`
- Loading: `aria-busy="true"`
- Modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Live region: `aria-live="polite"` cho toast/notification

## Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
