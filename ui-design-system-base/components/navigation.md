# Navigation Components

## Top Navigation / Header
| Property | Default Value | Brand Value |
|---|---|---|
| Height | 60px | **56px** (`h-14`) |
| Background | bg-page | **trắng** (`bg-white`) |
| Shadow | shadow-sm | **shadow-card** |
| Padding H | page-margin | **16px mobile / 24px desktop** (`px-4 md:px-6`) |
| Z-index | z-sticky (200) | **z-[200]** |

## Bottom Tab Bar (Mobile)
| Property | Default Value | Brand Value |
|---|---|---|
| Height | 60px + safe-area-inset-bottom | **64px + safe-area-inset-bottom** (`h-16`) |
| Background | bg-page | **trắng** (`bg-white`) |
| Border top | 1px neutral-200 | **1px #DDDDDD** (`border-t border-[#DDDDDD]`) |
| Icon size | 24px | **24px** (`size={24}`) |
| Label size | text-xs | **12px font-medium** (`text-xs font-medium`) |
| Active color | primary-500 | **xanh Vietravel** (`text-[#0046C1]`) |
| Inactive color | neutral-400 | **#999999** (`text-[#999999]`) |
| Tab min width | 44px (touch target) | **44px** (`min-w-[44px] min-h-[44px]`) |
| Z-index | — | **z-[200]** |

## Breadcrumb
| Property | Default Value | Brand Value |
|---|---|---|
| Separator | "/" hoặc ChevronRight icon | **ChevronRight** `size={14}` màu `#999999` |
| Active item | neutral-800, font-medium | **#000E1A · font-medium** |
| Inactive item | neutral-500 | **#636363** |
| Hover | primary-500, underline | **#0046C1 · underline** |

## Tabs
| Variant | Description | Brand Value |
|---|---|---|
| underline | Border-bottom 2px primary active | **border-b-2 border-[#0046C1] · text-[#0046C1]** |
| pills | Background primary-50, radius-full active | **bg-[#D9EEFF] · text-[#0046C1] · rounded-full** |
| outline | Border primary active | **border border-[#0046C1] · text-[#0046C1] · rounded-lg** |

### Tab States
| State | Style |
|---|---|
| default | `text-[#636363]` |
| hover | `text-[#000E1A] cursor-pointer` |
| active | `text-[#0046C1]` + indicator |
| disabled | `text-[#999999] cursor-not-allowed opacity-50` |
