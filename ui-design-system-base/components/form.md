# Form Components
> Source: shadcn/ui Input, Select, Checkbox, Form components

## Input / TextInput

### Anatomy
```
<Field>
  <Label />              ← bắt buộc (hoặc aria-label)
  <Description />        ← optional
  <InputGroup>           ← optional, nếu có icon/button
    <Input />
  </InputGroup>
  <FieldError />         ← hiện khi có lỗi
</Field>
```

### States (data attributes — shadcn/ui convention)
| State | Attribute | Visual |
|---|---|---|
| default | — | border `--input`, bg `--background` |
| focus | `:focus-visible` | `ring-2 ring-ring ring-offset-2` |
| filled | — | giữ nguyên default |
| invalid/error | `aria-invalid="true"` / `data-invalid` | border `--destructive` |
| disabled | `disabled` / `data-disabled` | opacity-50, cursor-not-allowed |
| required | `required` | Label có dấu `*` màu destructive |

### Sizes
| Size | Height | Padding H | Font Size | Brand Value |
|---|---|---|---|---|
| sm | 32px | 12px | text-sm | ← FILL |
| default | 36px | 12px | text-sm | ← FILL |
| lg | 40px | 16px | text-base | ← FILL |

### InputGroup (icon / button kết hợp)
- `leftSection`: icon bên trái, padding-left tự động tăng
- `rightSection`: icon bên phải (search, clear, password toggle)
- Icon size: 16px (sm), 20px (default), 20px (lg)

## Select / Dropdown
- Trigger: giống Input style + ChevronDown icon bên phải
- Option list: bg `--popover`, shadow-md, radius-md, z-dropdown (100)
- Option hover: bg `--accent`
- Option selected: bg `--accent`, font-medium, checkmark icon bên phải

## Checkbox & Radio
- Size: 16×16px visual, min touch target 44×44px
- Border: 1px `--border`
- Checked: bg `--primary`, checkmark white
- States: unchecked / checked / indeterminate (checkbox only) / disabled

## Label & Helper Text
| Element | Style | Position |
|---|---|---|
| Label | text-sm font-medium `--foreground` | Trên input |
| Description | text-sm `--muted-foreground` | Dưới label |
| Error message | text-sm `--destructive` | Dưới input, thay description |
| Required `*` | `--destructive` | Sau label text |

## Form Layout Rules
- Gap giữa các Field: space-4 (16px) mặc định
- Label luôn ở trên input (không float label)
- Error message hiện ngay dưới input liên quan, không hiện tổng ở trên form
- Validate on blur (không validate khi đang gõ)
