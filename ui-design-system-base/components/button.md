# Button Component
> Source: shadcn/ui Button component

## Variants
| Variant | Background | Text | Border | Hover | Brand Value |
|---|---|---|---|---|---|
| default (filled) | primary | primary-foreground | none | primary/90 | **bg-[#0046C1] text-white hover:bg-[#003DA8]** |
| secondary | secondary | secondary-foreground | none | secondary/80 | **bg-[#ED1D24] text-white hover:bg-[#C41920]** |
| outline | transparent | foreground | 1px border | accent bg | **border border-[#0046C1] text-[#0046C1] hover:bg-[#D9EEFF]** |
| ghost | transparent | foreground | none | accent bg | **text-[#0046C1] hover:bg-[#D9EEFF]** |
| destructive | destructive | white | none | destructive/90 | **bg-[#ED1D24] text-white hover:bg-[#C41920]** |
| link | transparent | primary | none | underline | **text-[#0046C1] hover:underline** |

## Sizes
| Size | Height | Padding H | Font Size | Gap icon-text | Brand Value |
|---|---|---|---|---|---|
| xs | 28px | 12px | text-xs | 4px | **h-7 px-3 text-xs gap-1** |
| sm | 32px | 12px | text-sm | 6px | **h-8 px-3 text-sm gap-1.5** |
| default | 36px | 16px | text-sm | 8px | **h-9 px-4 text-sm gap-2** |
| lg | 40px | 24px | text-base | 8px | **h-10 px-6 text-base gap-2** |

## Icon-only Sizes
| Size | Dimension | Brand Value |
|---|---|---|
| icon-xs | 28×28px | **h-7 w-7** |
| icon-sm | 32×32px | **h-8 w-8** |
| icon | 36×36px | **h-9 w-9** |
| icon-lg | 40×40px | **h-10 w-10** |

## States (bắt buộc implement đủ)
| State | Visual Rule |
|---|---|
| default | Theo variant spec |
| hover | opacity 90% hoặc tối hơn 1 shade, `transition duration-fast ease-out` |
| active/pressed | scale(0.98), tối hơn 2 shade |
| focus | `ring-2 ring-ring ring-offset-2` (dùng `--ring` token) |
| disabled | `opacity-50 cursor-not-allowed pointer-events-none` |
| loading | disabled + `<Spinner>` ở giữa, text ẩn hoặc giữ nguyên |

## Rules
- Min touch target: **44×44px** — dùng padding ẩn nếu visual nhỏ hơn
- Border radius: dùng `--radius` token của dự án
- Icon library: **Lucide React** — size = `1em` (tự scale theo font-size button)
- Không nest button trong button
- `asChild` prop: cho phép render thành `<a>`, `<Link>` giữ nguyên style button
