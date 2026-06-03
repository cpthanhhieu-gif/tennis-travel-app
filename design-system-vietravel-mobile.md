# Design System — travel.com.vn (Vietravel)
> **Phạm vi:** UI Mobile (≤ 640px)  
> **Nguồn:** https://travel.com.vn  
> **Ngày trích xuất:** 28/05/2026  
> **Framework:** Next.js · CSS Modules (BEM) · Tailwind (một phần)

---

## 1. Tổng quan

| Thuộc tính | Giá trị |
|---|---|
| Font chính | **Mulish** (fallback: Mulish Fallback → Arial) |
| Font phụ | **Nunito** (một số section) |
| Icon font | **icomoon** (custom icon set) |
| Base font size (HTML) | **10px** (quy ước 62.5% → 1rem = 10px) |
| Body font size | **16px (1.6rem)** |
| Layout | Flexbox + CSS Grid |
| Mobile breakpoint chính | **≤ 640px** |
| Header height | **56px** (fixed) |

---

## 2. Color Tokens (Màu sắc)

### 2.1 Brand Colors

| Token | Hex | Mô tả |
|---|---|---|
| **Brand Primary** | `#0046C1` | Màu chính — button, link active, icon active |
| **Brand Secondary (CTA)** | `#ED1D24` | CTA button, giá, badge hot |
| **Brand Light Blue** | `#0391FF` | Button xác nhận, trạng thái đã chọn form |
| **Brand Tint** | `#D9EEFF` | Background tab active, badge brand-01 |
| **Brand Tint Light** | `#F1F9FF` | Background section nhẹ |
| **Brand Dark** | `#003DA8` | Hover của Brand Primary |

### 2.2 Neutral Colors

| Token | Hex | Mô tả |
|---|---|---|
| **Neutral 100** | `#191919` | Text đậm nhất, nền tab active |
| **Neutral 90** | `#000E1A` | Body text mặc định |
| **Neutral 50** | `#4D4D4D` | Text nav, placeholder có nội dung |
| **Neutral 40** | `#636363` | Text placeholder, icon mờ |
| **Neutral 30** | `#999999` | Placeholder rỗng, text disabled |
| **Neutral 10** | `#DDDDDD` | Border, divider, handle bar |
| **Neutral 05** | `#E5E5E5` | Border card nhẹ |
| **Neutral 03** | `#F7F7F7` | Background neutral, nền search |
| **Neutral 01** | `#FFFFFF` | Background card, component |

### 2.3 Semantic / Status Colors

| Token | Hex | Dùng cho |
|---|---|---|
| **Error** | `#ED1D24` | Lỗi, giá khuyến mãi |
| **Error Dark** | `#D40E00` | Badge hot-deal text |
| **Error Light** | `#FFE5E3` | Badge error background |
| **Success** | `#007C19` | Text trạng thái thành công |
| **Success Light** | `#DEFFE5` | Badge success background |
| **Warning** | `#FF6F34` | Cảnh báo, badge cam |
| **Yellow Accent** | `#FFDA00` | Rating star background |
| **Yellow Light** | `#FFF8DA` | Badge extra-yellow background |
| **Yellow Dark** | `#995C00` | Text trên yellow badge |
| **Purple** | `#8400E4` | Badge special |
| **Purple Light** | `#F7ECFF` | Badge default background |

### 2.4 Overlay

| Token | Giá trị | Dùng cho |
|---|---|---|
| Overlay Light | `rgba(0,0,0,0.3)` | Overlay ảnh nhẹ |
| Overlay Medium | `rgba(0,0,0,0.4)` | Modal backdrop |
| Overlay Dark | `rgba(0,0,0,0.65)` | Review score trên ảnh |
| White Transparent | `rgba(255,255,255,0.3)` | Tab search inactive |

---

## 3. Typography

> **Base:** HTML font-size = 10px → 1rem = 10px

### 3.1 Font Family

```css
font-family: 'Mulish', 'Mulish Fallback', Arial, sans-serif;
```

### 3.2 Type Scale (Mobile)

| Tên | rem | px | Weight | Dùng cho |
|---|---|---|---|---|
| Display / Hero | 3.2rem | 32px | 700 | Hero banner |
| H1 | 3.2rem | 32px | 700 | Trang heading chính |
| H2 Dialog | 2.4rem | 24px | 700 | Dialog heading |
| H3 | 2.2rem | 22px | 700 | Sub-heading trang |
| H5 Mobile | 1.7rem | 17px | 700 | Section heading mobile |
| Body Large | 1.6rem | 16px | 500–600 | Nội dung chính, input |
| Body Default | 1.4rem | 14px | 500–600 | Mô tả, label, nav |
| Caption / Small | 1.2rem | 12px | 600–800 | Badge, tag, caption |
| Price Regular | 1.9rem | 19px | 800 | Giá trong card |
| Price Large | 2.4rem | 24px | 800 | Giá nổi bật |
| Price XL | 2.6rem | 26px | 800 | Tổng tiền |

### 3.3 Font Weight

| Token | Giá trị | Dùng cho |
|---|---|---|
| Regular | 400–500 | Body text, placeholder |
| Medium | 550–600 | Label, sub-text, nav link |
| SemiBold | 650 | Button text |
| Bold | 700 | Heading, CTA text |
| ExtraBold | 800 | Giá, badge, số nổi bật |

---

## 4. Spacing Scale

| Token | rem | px | Dùng cho |
|---|---|---|---|
| space-1 | 0.4rem | 4px | Gap icon-text tối thiểu |
| space-2 | 0.8rem | 8px | Gap nhỏ, padding icon button |
| space-3 | 1.0rem | 10px | Padding card content |
| space-4 | 1.2rem | 12px | Padding button, form item |
| space-6 | 1.6rem | 16px | Padding layout, form gap |
| space-8 | 2.0rem | 20px | Padding section, margin |
| space-10 | 2.4rem | 24px | Gap lớn |
| space-12 | 3.2rem | 32px | Padding page, section gap |
| space-16 | 4.0rem | 40px | Spacing lớn |

---

## 5. Border Radius

| Token | rem | px | Dùng cho |
|---|---|---|---|
| radius-xs | 0.4rem | 4px | Input nhỏ |
| radius-sm | 0.5rem | 5px | Card filter, tag nhỏ |
| radius-md | 0.8rem | 8px | Card large |
| radius-lg | 1.2rem | 12px | Card combo bottom |
| radius-xl | 1.6rem | 16px | Tab tháng, discount badge |
| radius-2xl | 2.0rem | 20px | Tour card small |
| radius-3xl | 2.4rem | 24px | Tab search nav |
| radius-full | 4rem | 40px+ | Button pill, FAB |
| radius-circle | 50% | — | Avatar, icon button tròn |

---

## 6. Shadows (Elevation)

| Token | CSS value | Dùng cho |
|---|---|---|
| elevation-1 | `rgba(0,0,0,0.08) 0px 2px 8px` | Card chính |
| elevation-2 | `rgba(23,23,23,0.12) 0px 0px 10px` | Floating element |
| elevation-3 | `rgba(23,23,23,0.12) 4px 4px 12px` | News card |
| elevation-dialog | `rgba(0,0,0,0.2) 0px 0px 10px` | Dialog, modal |
| elevation-dropdown | `rgba(99,99,99,0.2) 0px 2px 8px` | Calendar, dropdown |
| elevation-drawer | `rgba(0,0,0,0.15) 2px 0px 8px` | Side drawer |
| elevation-price | `rgba(255,77,79,0.3) 0px 2px 8px` | Discount badge |

---

## 7. Components

### 7.1 Buttons

**Base (Pill style)**

```css
border-radius: 4rem;
padding: 1.2rem;
font-size: 1.4rem;
font-weight: 600;
```

**Variants**

| Variant | Background | Text | Class |
|---|---|---|---|
| Primary Blue | `#0046C1` | `#FFFFFF` | `.brand06Btn` |
| Confirm Blue | `#0391FF` | `#FFFFFF` | `.brand04Btn` |
| Secondary Red | `#ED1D24` | `#FFFFFF` | `.dangerFillBgBtn` |
| Outline Danger | transparent | `#ED1D24` | `.dangerOutlineBtn` |
| Neutral | `#F7F7F7` | `#636363` | `.neutral02FillBtn` |
| Ghost Primary | transparent | `#0046C1` | `.btn-onlyText-primary` |
| Ghost Danger | transparent | `#ED1D24` | `.btn-onlyText-secondary` |
| Cancel | `#FFFFFF` | `#999999` | `.bottomSheet_cancelAction-01` |

**Disabled State**

```css
background-color: #F7F7F7;
color: #636363;
```

---

### 7.2 Badges / Tags

**Base**

```css
border-radius: 20px;
padding: 4px 1.2rem 5px;
font-size: 1.2rem;
font-weight: 800;
```

**Variants**

| Variant | BG | Text | Class |
|---|---|---|---|
| Brand-01 | `#D9EEFF` | `#0046C1` | `.badge_badgeBg-brand-01` |
| Hot Deal | `#FFFFFF` | `#D40E00` | `.badge_badgeBg-hot-deal` |
| Error | `#FFE5E3` | `#D40E00` | `.badge_badgeBg-support-err` |
| Success | `#DEFFE5` | `#007C19` | `.badge_badgeBg-success-green` |
| Extra Yellow | `#FFF8DA` | `#995C00` | `.badge_badgeBg-extra-yellow` |
| Default/Purple | `#F7ECFF` | `#8400E4` | `.badge_badgeBg-default` |
| Cart Notification | `#F97316` | `#FFFFFF` | `.header_cart-badge` |

---

### 7.3 Cards

**Card Large**

```css
background-color: #FFFFFF;
border-radius: 8px;
border: 1px solid rgba(0,0,0,0.05);
box-shadow: rgba(0,0,0,0.08) 0px 2px 8px;
overflow: hidden;
width: 100%;
```

**Card Filter Mobile (Tour/Hotel list)**

```css
border-radius: 0.5rem;
border: 1px solid rgb(229,229,229);
width: 100%;
/* Thumbnail: border-radius 0.5rem 0.5rem 0 0 */
/* Content: background #FFFFFF, padding 1rem */
```

**Tour Card Small (Vertical slider)**

```css
border-radius: 2rem;
overflow: hidden;
```

---

### 7.4 Navigation (Mobile Header)

```css
position: fixed;
top: 0;
height: 56px;
background-color: #FFFFFF;
z-index: 15;
width: 100%;
```

---

### 7.5 Search & Tab Navigation

**Search Input Container**

```css
background-color: #F7F7F7;
border-radius: 40px;
padding: 12px;
```

**Tab Nav Item — Default**

```css
background-color: rgba(255,255,255,0.3);
border-radius: 2.4rem 2.4rem 0 0;
padding: 0.8rem;
```

**Tab Nav Item — Active**

```css
/* Outer */ background-color: #FFFFFF;
/* Inner */ background-color: #D9EEFF; color: #0046C1; font-weight: 700;
```

**Filter Tab (Product section)**

```css
/* Default */ background: #F7F7F7; color: #636363; border-radius: 4rem;
             padding: 1.2rem 1.6rem; border: 1px solid #DDDDDD;
/* Active */  background: #191919; color: #F7F7F7;
```

---

### 7.6 Form / Input

```css
/* Text input */
background-color: #F7F7F7;
border: none;
font-size: 1.6rem;

/* Label rỗng */ color: #999999; font-weight: 500;
/* Label có giá trị */ color: #0391FF; font-weight: 700;
```

---

### 7.7 Bottom Sheet (Mobile Modal)

```css
background-color: #FFFFFF;
max-height: 90dvh;
border-radius: 1.6rem 1.6rem 0 0;
overflow: hidden;

/* Handle bar */
background-color: #DDDDDD;
border-radius: 8px;
height: 0.4rem;
```

---

### 7.8 Price Display

```css
/* Giá khuyến mãi */
color: #ED1D24;
font-size: 2.4rem;
font-weight: 800;

/* Giá gốc strikethrough */
color: #5D5D5D;
font-size: 1.4rem;
text-decoration: line-through;

/* Label "Giá từ:" */
color: #636363;
font-size: 1.4rem;
font-weight: 600;
```

---

## 8. Breakpoints & Layout Mobile

| Tên | Media Query |
|---|---|
| Mobile XS | `max-width: 320px` |
| Mobile S | `max-width: 375px` |
| Mobile M | `max-width: 430px` |
| Mobile L | `max-width: 480px` |
| **Mobile XL (chính)** | `max-width: 640px` |
| Tablet | `max-width: 768px` |
