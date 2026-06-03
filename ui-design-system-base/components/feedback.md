# Feedback Components
> Source: shadcn/ui + chuẩn quốc tế

## Toast / Sonner
| Property | Default Value | Brand Value |
|---|---|---|
| Position | bottom-right (desktop), bottom-center (mobile) | ← FILL |
| Duration | 4000ms | ← FILL |
| Max visible | 3 toasts stack | ← FILL |
| Width | 356px | ← FILL |
| Border radius | radius-md | ← FILL |
| Shadow | shadow-lg | ← FILL |
| Z-index | z-toast (400) | ← FILL |

### Toast Variants
| Variant | Icon | Color token | Brand Value |
|---|---|---|---|
| default | — | foreground/background | ← FILL |
| success | CheckCircle | success | ← FILL |
| error | XCircle | destructive | ← FILL |
| warning | AlertTriangle | warning | ← FILL |
| info | Info | info | ← FILL |
| loading | Spinner | muted-foreground | ← FILL |

## Dialog / Modal
| Property | Default Value | Brand Value |
|---|---|---|
| Max width | 500px (sm), 700px (lg) | ← FILL |
| Padding | 24px (p-6) | ← FILL |
| Border radius | radius-lg | ← FILL |
| Backdrop | rgba(0,0,0,0.4) | ← FILL |
| Z-index | z-modal (300) | ← FILL |
| Close button | top-right, 44×44px | ← FILL |
| Open animation | fade + scale 0.95→1, duration-slow | ← FILL |
| Close animation | fade + scale 1→0.95, duration-fast | ← FILL |

## Loading States
| Type | Use case | Implementation |
|---|---|---|
| Spinner | Action xử lý < 3s | SVG animated, primary color, 24px default |
| Skeleton | Loading list/card content | Pulsing neutral-200 blocks, match layout shape |
| Progress bar | Upload, multi-step task | primary fill, height 4px, radius-full |
| Overlay | Block toàn màn hình | Spinner + backdrop rgba(0,0,0,0.4) |

## Empty State
| Element | Default Style | Brand Value |
|---|---|---|
| Illustration | 160×160px, muted color | ← FILL |
| Title | H4 (text-lg font-semibold) | ← FILL |
| Description | text-sm muted-foreground, max-w-xs, text-center | ← FILL |
| CTA | Button default variant, optional | ← FILL |

## Error States
| Type | Heading | Sub-text | Action |
|---|---|---|---|
| 404 | "Không tìm thấy trang" | "Trang này không tồn tại hoặc đã bị xóa" | Về trang chủ |
| 500 | "Có lỗi xảy ra" | "Vui lòng thử lại sau" | Thử lại |
| No connection | "Mất kết nối mạng" | "Kiểm tra lại kết nối của bạn" | Thử lại |
| Empty search | "Không có kết quả" | "Thử từ khóa khác" | — |

## Alert / Inline Notification
| Variant | Border-left color | Background | Icon |
|---|---|---|---|
| default | border | muted | Info |
| success | success | success/10 | CheckCircle |
| warning | warning | warning/10 | AlertTriangle |
| destructive | destructive | destructive/10 | XCircle |
