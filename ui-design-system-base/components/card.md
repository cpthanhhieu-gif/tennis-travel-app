# Card Component
> Source: shadcn/ui Card component

## Anatomy (cấu trúc bắt buộc theo thứ tự)
```
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
    <CardAction />        ← optional, top-right corner
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

## Sizes
| Size | Padding | Gap nội bộ | Brand Value |
|---|---|---|---|
| default | 24px (p-6) | 16px | ← FILL |
| sm | 16px (p-4) | 12px | ← FILL |

## Visual Variants
| Variant | Background | Border | Shadow | Brand Value |
|---|---|---|---|---|
| default | `--card` | 1px `--border` | shadow-xs | ← FILL |
| elevated | `--card` | none | shadow-md | ← FILL |
| outlined | `--card` | 1px `--border` | none | ← FILL |
| ghost | transparent | none | none | ← FILL |

## States (interactive card)
| State | Visual Rule | Brand Value |
|---|---|---|
| default | Theo variant spec | ← FILL |
| hover | shadow lên 1 level, translateY(-2px), duration-normal | ← FILL |
| active | shadow xuống 1 level, scale(0.99) | ← FILL |
| disabled | opacity-disabled, no hover | ← FILL |

## Section Rules
| Sub-component | Padding mặc định |
|---|---|
| CardHeader | px-6 py-6, pb-0 nếu có CardContent |
| CardContent | px-6 py-6 |
| CardFooter | px-6 pb-6, flex items-center |
| CardAction | margin-left auto (top-right alignment) |

## Rules
- Border radius: `radius-lg` token
- `overflow: hidden` nếu có media (image) bên trong
- Không nest Card quá 2 cấp
- CardTitle dùng `<h3>` mặc định (có thể đổi qua `asChild`)
