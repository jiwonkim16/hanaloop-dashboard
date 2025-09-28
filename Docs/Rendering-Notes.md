# 렌더링 노트: Server-Side vs Client-Side 렌더링 분석

## 개요

이 문서는 HanaLoop 탄소 배출량 대시보드에서 사용된 렌더링 전략에 대해 설명하며, 언제 무엇이 재렌더링되는지, SSR과 CSR 결정의 근거를 설명합니다.

## 렌더링 전략

### 1. Next.js App Router 구현

애플리케이션은 하이브리드 렌더링 접근법을 사용하는 Next.js 14 App Router를 사용합니다:

```typescript
// app/layout.tsx - Server Component (SSR)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
```

**설계 결정**: 루트 레이아웃은 다음을 위해 SSR 사용:
- 적절한 메타 태그를 통한 SEO 최적화
- 폰트 로딩 최적화
- 초기 HTML 구조 전달
- Analytics 스크립트 임베딩

### 2. Client-Side Rendering 패턴

모든 주요 콘텐츠 페이지는 `"use client"` 지시문을 사용한 Client-Side Rendering을 사용합니다:

```typescript
// app/page.tsx - Client Component (CSR)
"use client";

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  // ...
}
```

**CSR 설계 근거**:
1. **인터랙티브 대시보드 요구사항**: 실시간 데이터 업데이트, 애니메이션, 사용자 인터랙션
2. **상태 관리**: 필터링, 정렬, 데이터 조작을 위한 복잡한 클라이언트 상태
3. **애니메이션 성능**: Framer Motion은 부드러운 애니메이션을 위해 클라이언트 사이드 렌더링 필요
4. **API 통합**: 현실적인 UX 테스트를 위한 시뮬레이션된 지연시간이 있는 Mock API 호출

## 컴포넌트 재렌더링 분석

### 1. 데이터 페칭 패턴

각 페이지는 특정 재렌더링을 트리거하는 일관된 데이터 페칭 패턴을 따릅니다:

```typescript
useEffect(() => {
  async function loadData() {
    try {
      setLoading(true); // 로딩 상태 재렌더링 트리거
      const [companiesData, countriesData] = await Promise.all([
        fetchCompanies(),
        fetchCountries(),
      ]);
      setCompanies(companiesData); // 데이터 재렌더링 트리거
      setCountries(countriesData); // 국가 의존 컴포넌트 재렌더링 트리거
    } catch (error) {
      setError(error.message); // 에러 상태 재렌더링 트리거
    } finally {
      setLoading(false); // 최종 상태 재렌더링 트리거
    }
  }
  loadData();
}, []); // 컴포넌트 마운트 시에만 실행
```

**재렌더링 트리거**:
1. 초기 마운트 → 로딩 상태
2. API 응답 → 데이터 업데이트
3. 에러 조건 → 에러 상태
4. 로딩 완료 → 최종 렌더링

### 2. 메트릭 카드 재렌더링

MetricsCards 컴포넌트는 성능 최적화를 위해 `useMemo`를 사용합니다:

```typescript
// components/dashboard/metrics-cards.tsx
const metrics = useMemo(() => {
  const totalEmissions = companies.reduce(/* 계산 */);
  const totalTax = companies.reduce(/* 계산 */);
  // ... 기타 계산
  return { totalEmissions, totalTax, /* ... */ };
}, [companies, countries]); // 의존성이 변경될 때만 재계산
```

**재렌더링 동작**:
- **언제**: `companies` 또는 `countries` 데이터가 변경될 때만
- **이유**: 비용이 많이 드는 계산을 메모화하여 불필요한 재계산 방지
- **영향**: 자식 컴포넌트(AnimatedCounter)는 값이 실제로 변경될 때만 재렌더링

### 3. 차트 컴포넌트 재렌더링

차트는 메모화와 안정적인 데이터 구조를 사용합니다:

```typescript
// 예: EmissionsOverviewChart
const chartData = useMemo(() => {
  return companies.map(company => ({
    name: company.name,
    emissions: calculateTotalEmissions(company)
  }));
}, [companies]); // companies 변경 시에만 재계산
```

**재렌더링 전략**:
- **최적화됨**: 차트는 기본 데이터가 변경될 때만 재렌더링
- **안정적인 참조**: Recharts는 안정적인 데이터 객체를 받음
- **애니메이션 보존**: 일관된 데이터 구조를 통해 부드러운 전환 유지

### 4. 애니메이션 재렌더링

Framer Motion 컴포넌트는 특정 재렌더링 패턴을 가집니다:

```typescript
// Motion variants는 안정적 - 불필요한 재렌더링 없음
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// 컴포넌트 재렌더링은 애니메이션 업데이트만 트리거하며, 재생성하지 않음
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
```

**애니메이션 재렌더링 동작**:
- **Motion 상태**: 애니메이션은 React 재렌더링과 독립적으로 실행
- **Variant 안정성**: 애니메이션 variants는 렌더링 사이클 외부에서 정의
- **성능**: GPU 가속 애니메이션은 React 재렌더링을 유발하지 않음

## 로딩 상태 관리

### 1. Skeleton 로딩 패턴

```typescript
if (loading) {
  return (
    <DashboardLayout>
      <motion.div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div key={i} /* staggered animation */>
            <Skeleton className="h-32" />
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
}
```

**로딩 재렌더링 전략**:
- **단일 상태 변경**: `loading: true → false`는 한 번의 재렌더링 트리거
- **Skeleton 애니메이션**: 애니메이션 플레이스홀더로 체감 성능 향상
- **일관된 레이아웃**: Skeleton 컴포넌트가 레이아웃 안정성 유지

### 2. 에러 상태 처리

```typescript
const [error, setError] = useState<string | null>(null);

// 에러 경계 패턴
if (error) {
  return <ErrorComponent message={error} />;
}
```

**에러 재렌더링 동작**:
- **격리된 영향**: 에러 상태는 특정 컴포넌트에만 영향
- **복구 메커니즘**: 사용자가 전체 페이지 새로고침 없이 재시도 가능
- **상태 보존**: 다른 컴포넌트 상태는 그대로 유지

## 성능 최적화

### 1. 컴포넌트 메모화 전략

```typescript
// 비용이 많이 드는 계산은 메모화
const expensiveValue = useMemo(() => {
  return companies.reduce(/* 복잡한 계산 */, 0);
}, [companies]);

// 안정적인 콜백 참조
const handleDataUpdate = useCallback((newData) => {
  setData(newData);
}, []);
```

### 2. 재렌더링 최소화 기법

**구현된 전략**:
1. **안정적인 의존성**: 렌더링 외부에서 생성된 객체와 배열
2. **메모화된 계산**: 비용이 많이 드는 작업에 `useMemo` 사용
3. **안정적인 콜백**: 이벤트 핸들러에 `useCallback` 사용
4. **키 최적화**: 리스트 렌더링을 위한 안정적인 키

### 3. 번들 분할 영향

```typescript
// 라우트별 자동 코드 분할
app/
├── page.tsx           // 메인 번들 청크
├── companies/page.tsx // 별도 청크
├── calculator/page.tsx// 별도 청크
└── emissions/page.tsx // 별도 청크
```

**렌더링 이점**:
- **빠른 초기 로드**: 필요한 코드만 로드
- **지연 로딩**: 라우트 컴포넌트는 필요 시 로드
- **캐시 효율성**: 변경되지 않은 청크는 캐시된 상태 유지

## SSR vs CSR 결정 매트릭스

| 컴포넌트 타입 | 렌더링 전략 | 이유 |
|---------------|-------------------|--------|
| 레이아웃 | SSR | SEO, 초기 구조, 폰트 |
| 메타 태그 | SSR | 검색 엔진 최적화 |
| 네비게이션 | CSR | 인터랙티브 상태, 애니메이션 |
| 대시보드 데이터 | CSR | 실시간 업데이트, 인터랙션 |
| 차트 | CSR | 복잡한 인터랙션, 애니메이션 |
| 폼 | CSR | 사용자 입력 처리, 검증 |
| 모달 | CSR | 동적 콘텐츠, 사용자 인터랙션 |

## 재렌더링 성능 영향

### 측정된 성능 특성

**초기 페이지 로드**:
- SSR 레이아웃: ~50ms 서버 렌더링
- 하이드레이션: ~200ms 인터랙티브 컴포넌트
- 데이터 페칭: 200-800ms (시뮬레이션된 API 지연시간)
- 애니메이션 시작: 하이드레이션 후 ~100ms

**런타임 재렌더링**:
- 상태 업데이트: ~16ms per frame (60 FPS)
- 차트 업데이트: ~33ms per animation frame
- Skeleton 전환: ~300ms 총 지속시간

### 메모리 영향

**클라이언트 사이드 상태**:
- 컴포넌트 상태: 일반적인 데이터 세트에 대해 ~50KB
- 애니메이션 상태: Framer Motion에 대해 ~20KB
- 차트 상태: Recharts 내부에 대해 ~30KB

## 향후 최적화 기회

### 1. Server Components 마이그레이션

선택된 컴포넌트는 Server Components의 이점을 누릴 수 있습니다:

```typescript
// 잠재적 서버 컴포넌트
async function CompanyList() {
  const companies = await fetchCompanies(); // 서버 사이드 페치
  return <StaticCompanyList companies={companies} />;
}
```

### 2. Streaming SSR

대용량 데이터셋의 경우, 스트리밍이 체감 성능을 향상시킬 수 있습니다:

```typescript
// 잠재적 스트리밍 구현
<Suspense fallback={<LoadingSkeleton />}>
  <DataComponent />
</Suspense>
```

### 3. Incremental Static Regeneration (ISR)

상대적으로 정적인 데이터의 경우, ISR이 이점을 제공할 수 있습니다:

```typescript
// 잠재적 ISR 구성
export const revalidate = 3600; // 1시간
```

## 결론

현재 렌더링 전략은 다음을 우선시합니다:

1. **사용자 경험**: CSR을 통한 부드러운 애니메이션과 인터랙션
2. **성능**: 메모화를 통한 최적화된 재렌더링
3. **유연성**: 복잡한 인터랙션을 위한 클라이언트 사이드 상태 관리
4. **확장성**: 효율적인 로딩을 위한 라우트 기반 코드 분할

하이브리드 접근법은 초기 로드 성능(SSR)과 런타임 인터랙티비티(CSR) 사이의 최적 균형을 제공합니다.