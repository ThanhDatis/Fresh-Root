# 📁 Cấu Trúc Thư Mục — FreshRoot

---

## Tổng quan (Root Level)

```
freshroot/
├── frontend/                           # Next.js App
├── auth-service/                       # Microservice: Xác thực
├── product-service/                    # Microservice: Sản phẩm & danh mục
├── order-service/                      # Microservice: Đơn hàng
├── ai-service/                         # Microservice: AI Chatbot
├── docker-compose.yml
└── .env.example
```

---

## Frontend (Next.js App Router)

```
frontend/
├── public/                             # Static assets (favicon, robots.txt,...)
│
├── src/
│   ├── app/                            # Next.js App Router — File-based routing
│   │   ├── layout.tsx                  # Root layout
|   |   ├── error.tsx                   # error cho /app
|   |   ├── loading.tsx                 # loading cho /app
|   |   ├── not-found.tsx               # not-found cho /app
│   │   ├── (storefront)/               # Route group: Storefront
│   │   │   ├── layout.tsx              # Storefront layout (Navbar, Footer)
│   │   │   ├── page.tsx                # Home page
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── _hooks/
│   │   │   │   │   └── useProductsPage.ts
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── _hooks/
│   │   │   │           └── useProductDetailPage.ts
│   │   │   ├── cart/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useCartPage.ts
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useCheckoutPage.ts
│   │   │   └── profile/
│   │   │       ├── page.tsx
│   │   │       └── _hooks/
│   │   │           └── useProfilePage.ts
│   │   │
│   │   ├── (admin)/                    # Route group: Admin Dashboard
│   │   │   ├── layout.tsx              # Admin layout (Sidebar, Header)
│   │   │   ├── loading.tsx             # loading cho admin
│   │   │   ├── error.tsx               # error cho admin
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useDashboardPage.ts
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useAdminProductsPage.ts
|   |   |   ├── categories/
│   │   |   |   ├── page.tsx
│   │   |   |   └── _hooks/
│   │   |   |   |    └── useCategoriesPage.ts
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useOrdersPage.ts
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _hooks/
│   │   │   │       └── useCustomersPage.ts
|   |   |   ├── analytics/              
│   │   |   |   ├── page.tsx
│   │   |   |   └── _hooks/
│   │   |   |       └── useAnalyticsPage.ts
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   |   |   └── _hooks/
│   │   |   |       └── useSetting.ts
│   │   │
│   │   └── (auth)/                     # Route group: Auth
│   │       ├── layout.tsx              # Layout riêng cho login/register
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                         # MUI-based primitives & custom base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── ...
│   │   │
│   │   ├── shared/                     # Shared UI dùng chung toàn app
│   │   │   ├── LoadingButton.tsx
│   │   │   ├── ToastMessage.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── PageTitle.tsx
│   │   │
│   │   ├── layout/                     # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminHeader.tsx
│   │   │
│   │   ├── storefront/                 # Components riêng cho Storefront
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── AIChatbot.tsx
│   │   │
│   │   └── admin/                      # Components riêng cho Admin
│   │       ├── MetricCard.tsx
│   │       ├── RevenueChart.tsx
│   │       ├── OrderTable.tsx
│   │       └── ProductForm.tsx
|   |       |__ CategoryForm.tsx
|   |       |__ AnalyticsChart.tsx
│   │
│   ├── services/                       # Toàn bộ API calls — không gọi axios trong component
│   │   ├── axiosInstances.ts           # Khởi tạo axios instance, interceptor token
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── user.service.ts
│   │   └── ai.service.ts
│   │
│   ├── stores/                         # Zustand global state
│   │   ├── authStore.ts                # user, token, isAuthenticated
│   │   ├── cartStore.ts                # items, total, actions
│   │   └── uiStore.ts                  # sidebar, notifications, modals
│   │
│   ├── hooks/                          # Custom hooks dùng chung nhiều page
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/                          # TypeScript types & interfaces
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── api.types.ts                # ApiResponse<T>, Pagination<T>
│   │
│   ├── constants/                      # Hằng số dùng xuyên suốt app
│   │   ├── routes.ts                   # Path strings: '/products', '/admin/dashboard'
│   │   └── app.constants.ts
│   │
│   ├── lib/                            # Utilities phức tạp / third-party wrappers
│   │   ├── axios.ts                    # Axios config nâng cao
│   │   └── validators.ts               # Zod schemas cho forms
│   │
│   └── utils/                          # Pure helper functions
│       ├── currency.ts                 # formatVND()
│       ├── dateTime.ts                 # formatDate()
│       └── string.ts                   # slugify(), truncate()
│
├── proxy.ts                            # Middleware chặn/redirect trước khi vào root, phân quyền Admin
├── next.config.ts
├── tsconfig.json
├── eslint.config.js
├── .env.example
└── package.json
```

---

## Backend (Microservices — cùng cấp với frontend/)

```
auth-service/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── index.ts
├── Dockerfile
├── package.json
└── .env.example

product-service/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── index.ts
├── Dockerfile
└── package.json

order-service/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── index.ts
├── Dockerfile
└── package.json

ai-service/
├── src/
│   ├── controllers/
│   ├── routes/
│   └── index.ts
├── Dockerfile
└── package.json
```

---

## Giải thích cấu trúc thư mục

### public/

Chứa các file tĩnh được serve trực tiếp mà không qua Next.js bundler — favicon, robots.txt, og-image. Không import vào code JS/TS.

---

### src/app/

Thư mục routing chính của Next.js App Router. Mỗi folder bên trong tương ứng một URL segment.

| Khái niệm                              | Ý nghĩa                                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `(storefront)/`, `(admin)/`, `(auth)/` | Route groups — dùng ngoặc `()` để nhóm các route có chung layout mà **không** ảnh hưởng đến URL |
| `layout.tsx`                           | Layout bao ngoài, dùng chung cho tất cả các trang trong cùng nhóm                               |
| `page.tsx`                             | Nội dung chính của một trang — đây là file Next.js render ra UI                                 |
| `_hooks/`                              | Hook xử lý logic riêng của trang đó. Prefix `_` để Next.js **không nhận nhầm** là route segment |
| `[slug]/`                              | Dynamic route — `slug` là tham số động, ví dụ `/products/fresh-avocado`                         |

> **Quy tắc:** `page.tsx` chỉ render UI và import từ `components/`. Toàn bộ logic (gọi API, xử lý state) đặt trong `_hooks/use[PageName]Page.ts`.

---

### src/components/

Toàn bộ UI components, chia theo mức độ tái sử dụng:

| Sub-folder    | Chứa gì                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ui/`         | Base components xây trên MUI — Button, Input, Card, Badge, Dialog,... Không chứa business logic, chỉ nhận props và render |
| `shared/`     | Shared components dùng chung toàn app — LoadingButton, EmptyState, Breadcrumb, ToastMessage                               |
| `layout/`     | Các thành phần khung trang — Navbar, Footer, AdminSidebar, AdminHeader                                                    |
| `storefront/` | Components chỉ dùng cho phần Storefront — ProductCard, CartItem, CheckoutForm, AIChatbot                                  |
| `admin/`      | Components chỉ dùng cho Admin Dashboard — MetricCard, OrderTable, RevenueChart, ProductForm                               |

> **Quy tắc:** Components trong `components/` **không được** gọi API hay chứa business logic. Chỉ nhận props từ page, render UI và emit events lên trên.

---

### src/services/

Tập trung toàn bộ HTTP calls vào một chỗ. **Không gọi axios trực tiếp trong component hay store.**

- `axiosInstances.ts` — khởi tạo axios instance với `baseURL` riêng cho từng microservice, cấu hình interceptor tự động gắn Bearer token vào header
- Mỗi `*.service.ts` — nhóm các API function theo domain, ví dụ `product.service.ts` chứa `getProducts()`, `getProductBySlug()`, `createProduct()`,...

---

### src/stores/

Zustand global state, tách theo domain để tránh re-render thừa:

| Store          | Giữ gì                                                            |
| -------------- | ----------------------------------------------------------------- |
| `authStore.ts` | `user`, `token`, `isAuthenticated`                                |
| `cartStore.ts` | `items`, `totalPrice`, `addItem()`, `removeItem()`, `clearCart()` |
| `uiStore.ts`   | `isSidebarOpen`, `notifications`, `activeModal`                   |

> **Quy tắc:** Store chỉ giữ state thực sự cần share giữa nhiều component. State cục bộ của một trang thì để trong `_hooks/` của trang đó.

---

### src/hooks/

Chỉ chứa custom hooks dùng chung ở **nhiều nơi**. Hook dùng riêng cho một trang thì đặt cạnh trang đó trong `_hooks/`.

Ví dụ hooks xứng đáng ở đây: `useAuth.ts`, `useCart.ts`, `useDebounce.ts`.

---

### src/types/

TypeScript interfaces và types, tách riêng theo domain. **Không viết type inline trong component** — luôn import từ đây để tái sử dụng và dễ maintain.

| File               | Chứa gì                                                      |
| ------------------ | ------------------------------------------------------------ |
| `auth.types.ts`    | `User`, `LoginPayload`, `AuthResponse`                       |
| `product.types.ts` | `Product`, `Category`, `ProductFilter`                       |
| `order.types.ts`   | `Order`, `OrderItem`, `OrderStatus`                          |
| `api.types.ts`     | `ApiResponse<T>`, `Pagination<T>` — generic types dùng chung |

---

### src/constants/

Hằng số không thay đổi trong suốt vòng đời app:

- `routes.ts` — centralize path strings, tránh hardcode `/admin/dashboard` rải khắp code. Khi cần đổi URL chỉ sửa một chỗ
- `app.constants.ts` — các giá trị cố định như số sản phẩm mỗi trang, thời gian timeout,...

### src/lib/

Wrappers phức tạp cho third-party hoặc browser APIs. Khác với `utils/` ở chỗ có thể có state hoặc phụ thuộc external:

- `axios.ts` — cấu hình nâng cao, retry logic, error handling tập trung
- `validators.ts` — Zod schemas cho các form (checkout, đăng ký, thêm sản phẩm)

> **Phân biệt `lib/` vs `utils/`:** `lib/` chứa logic phức tạp, có thể có side effects. `utils/` chứa pure functions — nhận input, trả output, không có side effects.

### src/utils/

Pure helper functions — không có side effects, dễ test:

| File          | Chứa gì                                   |
| ------------- | ----------------------------------------- |
| `currency.ts` | `formatVND()`, `formatUSD()`              |
| `dateTime.ts` | `formatDate()`, `getRelativeTime()`       |
| `string.ts`   | `slugify()`, `truncate()`, `capitalize()` |

### .env.example

File mẫu commit lên git để cả team biết cần set biến môi trường nào. File `.env` thật **không bao giờ commit**.

```
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:3002
NEXT_PUBLIC_ORDER_API_URL=http://localhost:3003
NEXT_PUBLIC_AI_API_URL=http://localhost:3004
```
