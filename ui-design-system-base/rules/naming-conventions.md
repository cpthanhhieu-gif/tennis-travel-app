# Naming Conventions

## Token Naming Pattern
```
{category}-{variant}-{scale}

Ví dụ:
color-primary-500
color-semantic-error
space-4
radius-md
shadow-lg
duration-fast
z-modal
```

## Component Naming
| Loại | Convention | Ví dụ |
|---|---|---|
| Component file | PascalCase | `Button.tsx`, `CardHeader.tsx` |
| Component name | PascalCase | `export function Button()` |
| Props | camelCase | `isLoading`, `onClick`, `borderRadius` |
| Variants prop | lowercase string | `variant="filled"` |
| Size prop | lowercase string | `size="md"` |
| Boolean prop | is/has prefix | `isDisabled`, `hasError` |

## File Naming
| Loại | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase.tsx | `Button.tsx` |
| Hook | camelCase với use prefix | `useDisclosure.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Page | kebab-case | `booking-detail.tsx` |
| Style module | ComponentName.module.css | `Button.module.css` |
| Index barrel | index.ts | `components/index.ts` |

## CSS / Tailwind
- Dùng Tailwind utility classes, không viết CSS mới nếu có utility sẵn
- Nếu phải viết CSS: BEM convention — `.block__element--modifier`
- Không dùng inline style trừ dynamic values (ví dụ: width từ JS)

## Props Ordering (trong JSX)
```
1. key (nếu có)
2. ref (nếu có)
3. variant, size, color
4. layout props (width, height)
5. event handlers (onClick, onChange)
6. accessibility (aria-*, role)
7. className (cuối cùng)
```
