# 📁 Cấu trúc Frontend Architecture

## Tổng quan

Cấu trúc này được thiết kế theo chuẩn **production-ready**, đảm bảo:
- ✅ **Type Safety**: TypeScript strict mode
- ✅ **Scalability**: Dễ mở rộng và maintain
- ✅ **Clean Architecture**: Separation of concerns
- ✅ **Reusability**: Components và logic có thể tái sử dụng

---

## 📂 Cấu trúc Folders

```
src/
├── app/                    # NextJS App Router (Pages & Layouts)
│   ├── (auth)/            # Auth routes group
│   ├── (public)/          # Public routes group
│   └── dashboard/         # Protected routes
│
├── components/            # React Components
│   ├── ui/               # Reusable UI components (Button, Card, Input...)
│   └── features/         # Feature-specific components (CourseCard, LessonList...)
│
├── lib/                   # Core Logic Layer
│   ├── api/              # API calls với full typing
│   │   ├── client.ts     # Axios wrapper type-safe
│   │   ├── auth.ts       # Auth API functions
│   │   ├── courses.ts    # Courses API functions
│   │   └── index.ts      # Barrel export
│   │
│   ├── auth/             # Authentication logic
│   │   ├── AuthProvider.tsx  # React Context cho auth
│   │   └── index.ts
│   │
│   ├── types/            # TypeScript definitions
│   │   ├── api.ts        # API response types
│   │   ├── user.ts       # User & Auth types
│   │   ├── course.ts     # Course, Lesson, Enrollment types
│   │   └── index.ts      # Barrel export
│   │
│   └── utils/            # Utility functions
│       ├── helpers.ts    # Helper functions (format, validate...)
│       └── index.ts
│
├── hooks/                 # Custom React Hooks
│   └── index.ts          # Export useAuth, useCourses...
│
├── config/               # Configuration constants
│   ├── constants.ts      # App constants (routes, roles...)
│   └── index.ts
│
└── utils/                # Legacy (sẽ migrate sang lib/utils)
    └── api.ts            # ⚠️ DEPRECATED: Dùng lib/api thay thế
```

---

## 🎯 Quy tắc sử dụng

### 1. **Import Types**
```typescript
// ✅ ĐÚNG: Import từ barrel export
import { User, Course, ApiResponse } from '@/lib/types';

// ❌ SAI: Import trực tiếp
import { User } from '@/lib/types/user';
```

### 2. **API Calls**
```typescript
// ✅ ĐÚNG: Dùng lib/api
import { getCourses, login } from '@/lib/api';

const { data, error } = await getCourses();
if (error) {
  // Handle error
}

// ❌ SAI: Dùng utils/api cũ
import api from '@/utils/api';
const res = await api.get('/courses'); // Không type-safe
```

### 3. **Authentication**
```typescript
// ✅ ĐÚNG: Dùng useAuth hook
'use client';
import { useAuth } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <LoginPrompt />;
  return <div>Hello {user?.fullName}</div>;
}

// ❌ SAI: Dùng localStorage trực tiếp
const user = JSON.parse(localStorage.getItem('user_info')); // Không type-safe
```

### 4. **Components**
```typescript
// ✅ ĐÚNG: Dùng UI components
import { Button, Card } from '@/components/ui';

<Button variant="primary" size="lg">Đăng ký ngay</Button>

// ❌ SAI: Hardcode styles mỗi lần
<button className="bg-blue-600 text-white px-6 py-3...">Đăng ký ngay</button>
```

### 5. **Server Components**
```typescript
// ✅ ĐÚNG: Fetch data ở Server Component
import { getCourses } from '@/lib/api';

export default async function CoursesPage() {
  const { data: courses } = await getCourses();
  return <CoursesList courses={courses} />;
}

// ❌ SAI: Fetch trong Client Component với useEffect
'use client';
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetchCourses(); // ❌ Anti-pattern
  }, []);
}
```

---

## 🔧 Migration Plan

### Các file cần migrate:
1. **utils/api.ts** → Thay bằng **lib/api/client.ts**
2. **components/Header.tsx** → Dùng **useAuth** thay window events
3. **app/page.tsx** → Convert sang **Server Component**
4. **app/login/page.tsx** → Dùng **lib/api/auth**

### Checklist:
- [ ] Update tất cả imports sang `@/lib/api`
- [ ] Replace localStorage access bằng `useAuth`
- [ ] Convert public pages sang Server Components
- [ ] Add error boundaries
- [ ] Add loading skeletons

---

## 📚 Tài liệu tham khảo

- **Types**: Xem chi tiết trong `lib/types/`
- **API Functions**: Xem `lib/api/`
- **Components**: Xem `components/ui/`
- **Constants**: Xem `config/constants.ts`

---

**Created**: December 28, 2025  
**Version**: 1.0.0  
**Status**: ✅ Architecture Setup Complete
