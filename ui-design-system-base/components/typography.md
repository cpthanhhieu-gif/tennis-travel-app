# Typography Component

## Heading Scale
| Role | Default Size | Weight | Line Height | Brand Value | Tailwind |
|---|---|---|---|---|---|
| H1 | 2.125rem/34px | 700 | 1.3 | **36px · weight 700 · line-height 1.2** | `text-4xl font-bold` |
| H2 | 1.625rem/26px | 700 | 1.35 | **28px · weight 700 · line-height 1.25** | `text-3xl font-bold` |
| H3 | 1.375rem/22px | 600 | 1.4 | **22px · weight 600 · line-height 1.3** | `text-2xl font-semibold` |
| H4 | 1.125rem/18px | 600 | 1.45 | **18px · weight 600 · line-height 1.35** | `text-lg font-semibold` |
| H5 | 1rem/16px | 600 | 1.5 | **16px · weight 600 · line-height 1.4** | `text-base font-semibold` |
| H6 | 0.875rem/14px | 600 | 1.5 | **14px · weight 600 · line-height 1.4** | `text-sm font-semibold` |

## Body Text
| Role | Default Size | Weight | Line Height | Brand Value | Tailwind |
|---|---|---|---|---|---|
| body-xl | 1.25rem/20px | 400 | 1.65 | **20px · weight 400 · line-height 1.6** | `text-xl font-normal` |
| body-lg | 1.125rem/18px | 400 | 1.6 | **18px · weight 400 · line-height 1.6** | `text-lg font-normal` |
| body-md | 1rem/16px | 400 | 1.55 | **16px · weight 400 · line-height 1.6** | `text-base font-normal` |
| body-sm | 0.875rem/14px | 400 | 1.45 | **14px · weight 400 · line-height 1.5** | `text-sm font-normal` |
| body-xs | 0.75rem/12px | 400 | 1.4 | **12px · weight 500 · line-height 1.4** | `text-xs font-medium` |

## Supporting Text
| Role | Default Size | Weight | Use case |
|---|---|---|---|
| label | 0.875rem/14px | 500 | Form label, tab label |
| caption | 0.75rem/12px | 400 | Image caption, helper |
| overline | 0.75rem/12px | 600, uppercase, letter-spacing 0.05em | Section category |
| code | font-mono, 0.875rem/14px | 400 | Inline code |

## Usage Rules
- Không dùng H1 quá 1 lần trên 1 trang
- Max line length body text: 65–75 ký tự (~680px)
- Truncation 1 dòng: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`
- Truncation nhiều dòng: `-webkit-line-clamp: N`
