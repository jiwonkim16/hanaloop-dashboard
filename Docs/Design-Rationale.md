# 디자인 근거: UI 결정사항 및 디자인 시스템

## 개요

이 문서는 HanaLoop 탄소 배출량 대시보드의 주요 디자인 결정사항, UI 선택, 디자인 시스템 근거를 설명합니다. 모든 결정은 대상 사용자(경영진 및 관리자), 사용성 요구사항, 기술적 제약을 고려하여 이루어졌습니다.

## 색상 시스템 및 테마

### 다크 우선 디자인 결정

**선택**: 기본 인터페이스 테마로 다크 모드

```css
/* app/globals.css */
:root {
  --background: oklch(0.08 0 0);        /* 깊은 다크 배경 */
  --foreground: oklch(0.98 0 0);        /* 높은 대비 흰색 텍스트 */
  --card: oklch(0.12 0 0);              /* 미묘한 카드 입체감 */
  --primary: oklch(0.7 0.15 264);       /* 블루 액센트 색상 */
}
```

**근거**:
1. **경영진 선호**: 다크 인터페이스는 더 프리미엄하고 전문적으로 인식
2. **데이터 시각화**: 다크 배경이 컬러풀한 차트와 메트릭을 더 돋보이게 함
3. **눈의 피로 감소**: 장시간 대시보드를 보는 경영진에게 중요
4. **현대적 미학**: 현대 비즈니스 애플리케이션 디자인 트렌드와 일치

### 색상 팔레트 전략

**주요 색상**:
- **Primary Blue** (`oklch(0.7 0.15 264)`): 신뢰, 안정성, 기업 정체성
- **Chart Green** (`oklch(0.65 0.2 142)`): 환경 테마, 긍정적 메트릭
- **Warning Orange** (`oklch(0.75 0.18 70)`): 중요한 데이터 주의 환기
- **Destructive Red** (`oklch(0.6 0.2 25)`): 경고, 부정적 트렌드

**디자인 결정 근거**:
- **OKLCH 색상 공간**: HSL보다 지각적으로 균일하며 일관된 밝기 보장
- **높은 대비**: 접근성을 위한 WCAG AA 기준 충족
- **의미론적 의미**: 환경/비즈니스 맥락에서 명확한 의미를 가진 색상

## 타이포그래피 계층

### 폰트 선택

**Primary**: Geist Sans
**Monospace**: Geist Mono

```typescript
// app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
```

**근거**:
1. **전문적 외관**: Geist Sans는 깔끔하고 현대적인 모습 제공
2. **가독성**: 다양한 크기에서 화면 읽기에 최적화
3. **데이터 표시**: Geist Mono는 숫자 데이터의 일관된 정렬 보장
4. **브랜드 일관성**: 현대 SaaS 애플리케이션 표준과 일치

### 계층 구조

```css
h1: text-xl font-semibold     /* 페이지 제목 */
h2: text-lg font-medium      /* 섹션 헤더 */
h3: text-sm font-medium      /* 카드 제목 */
body: text-sm                /* 기본 콘텐츠 */
caption: text-xs             /* 지원 정보 */
```

**디자인 결정**:
- **미묘한 계층**: 바쁜 경영진을 압도하지 않는 적은 수의 폰트 크기
- **크기보다 무게**: 가독성을 유지하면서 font-weight 변화로 계층 생성
- **일관된 간격**: 인터페이스 전반에 걸친 예측 가능한 수직 리듬

## 레이아웃 및 공간 디자인

### 대시보드 레이아웃 구조

```typescript
// components/layout/dashboard-layout.tsx
<div className="flex h-screen bg-background">
  <Sidebar />                    {/* 고정 너비 네비게이션 */}
  <main className="flex-1">      {/* 유연한 콘텐츠 영역 */}
    <Header />                   {/* 고정 높이 헤더 */}
    <Content />                  {/* 스크롤 가능한 메인 콘텐츠 */}
  </main>
</div>
```

**레이아웃 근거**:
1. **사이드바 네비게이션**: 빠른 컨텍스트 전환을 위한 모든 섹션의 지속적 접근
2. **전체 높이 디자인**: 데이터 시각화를 위한 화면 공간 최대화
3. **유연한 콘텐츠 영역**: 다양한 화면 크기와 데이터 볼륨에 적응
4. **고정 헤더**: 일관된 브랜딩과 작업이 항상 보임

### 그리드 시스템

**반응형 그리드 전략**:
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-4  /* 메트릭 카드 */
grid-cols-1 lg:grid-cols-2                 /* 차트 그리드 */
```

**디자인 결정**:
- **모바일 우선**: 가독성을 위한 작은 화면에서 단일 열
- **점진적 향상**: 효율성을 위한 큰 화면에서 더 많은 열
- **콘텐츠 인식**: 표시되는 콘텐츠 유형에 따라 그리드 적응

## 컴포넌트 디자인 결정

### 카드 기반 아키텍처

**시각적 패턴**:
```typescript
<Card className="relative overflow-hidden">
  <CardHeader>
    <CardTitle>메트릭 이름</CardTitle>
    <Icon />
  </CardHeader>
  <CardContent>
    <AnimatedCounter value={data} />
    <TrendIndicator />
  </CardContent>
</Card>
```

**근거**:
1. **정보 계층**: 다양한 데이터 포인트의 명확한 분리
2. **시각적 스캔**: 주요 메트릭을 한눈에 쉽게 스캔
3. **모듈식 디자인**: 모든 대시보드 섹션에서 일관된 패턴
4. **반응형 동작**: 카드가 우아하게 스택되고 크기 조정

### 애니메이션 전략

**모션 디자인 원칙**:

```typescript
// 순차적 등장 애니메이션
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// 미묘한 호버 인터랙션
whileHover={{ scale: 1.02, y: -5 }}
```

**애니메이션 근거**:
1. **점진적 공개**: 순차적 애니메이션이 사용자 주의를 안내
2. **피드백**: 호버 상태가 즉각적인 시각적 피드백 제공
3. **성능**: 부드러운 60fps 애니메이션을 위한 GPU 가속 변환
4. **절제**: 산만하지 않으면서 향상시키는 미묘한 움직임

### 데이터 시각화 디자인

**차트 색상 전략**:
```css
--chart-1: oklch(0.7 0.15 264);   /* Primary blue */
--chart-2: oklch(0.65 0.2 142);   /* Environmental green */
--chart-3: oklch(0.75 0.18 70);   /* Warning orange */
--chart-4: oklch(0.6 0.25 304);   /* Purple accent */
--chart-5: oklch(0.68 0.22 16);   /* Red accent */
```

**차트 디자인 결정**:
1. **의미론적 색상**: 긍정적 환경 영향에는 녹색, 우려에는 빨간색
2. **접근성**: 다크 배경에 대한 충분한 대비
3. **구별성**: 색맹 사용자도 쉽게 구별할 수 있는 색상
4. **전문적 팔레트**: 지나치게 밝거나 장난스러운 색상 피함

## 인터랙티브 디자인 패턴

### 로딩 상태

**Skeleton 디자인**:
```typescript
{Array.from({ length: 4 }).map((_, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.1 }}
  >
    <Skeleton className="h-32" />
  </motion.div>
))}
```

**로딩 상태 근거**:
1. **체감 성능**: 애니메이션 스켈레톤이 빈 화면보다 빠르게 느껴짐
2. **레이아웃 보존**: 콘텐츠 로드 시 레이아웃 시프트 방지
3. **점진적 로딩**: 순차적 등장이 최종 콘텐츠 구조와 일치
4. **사용자 기대**: 현대 사용자는 스켈레톤 로딩 패턴을 기대

### 호버 및 포커스 상태

**인터랙션 피드백**:
```css
hover:scale-[1.02]                /* 호버 시 미묘한 스케일 */
hover:text-foreground             /* 호버 시 색상 전환 */
focus:ring-2 focus:ring-ring      /* 명확한 포커스 표시 */
```

**인터랙션 디자인 근거**:
1. **즉각적 피드백**: 사용자가 인터랙티브 요소임을 알 수 있음
2. **접근성**: 키보드 네비게이션을 위한 명확한 포커스 표시
3. **미묘한 향상**: 호버 효과가 산만하지 않으면서 향상
4. **일관성**: 모든 컴포넌트에서 동일한 인터랙션 패턴

## 모바일 및 반응형 디자인

### 모바일 우선 전략

**반응형 네비게이션**:
```typescript
{/* 데스크톱 사이드바 */}
<div className="hidden md:block">
  <Sidebar />
</div>

{/* 모바일 네비게이션 */}
<MobileNav />
```

**모바일 디자인 결정**:
1. **접을 수 있는 네비게이션**: Sheet 기반 모바일 네비게이션으로 화면 공간 절약
2. **터치 친화적**: 모든 인터랙티브 요소에 최소 44px 터치 타겟
3. **읽기 가능한 텍스트**: 모바일에서 16px 최소 폰트 크기 유지
4. **스와이프 제스처**: 자연스러운 모바일 인터랙션 패턴 지원

### 중단점 전략

```css
sm: 640px   /* 작은 태블릿 */
md: 768px   /* 데스크톱 전환 */
lg: 1024px  /* 큰 데스크톱 */
xl: 1280px  /* 특대 화면 */
```

**중단점 근거**:
- **md (768px)**: 사이드바 가시성을 위한 주요 모바일/데스크톱 중단점
- **lg (1024px)**: 차트 레이아웃이 단일에서 다중 열로 변경
- **콘텐츠 우선**: 기기 크기가 아닌 콘텐츠 요구에 따라 선택된 중단점

## 접근성 고려사항

### 색상 및 대비

**WCAG 준수**:
- **AA 표준**: 일반 텍스트에 최소 4.5:1 대비율
- **AAA 표준**: 중요한 UI 요소에 7:1 대비율
- **색상 독립성**: 색상만으로 정보 전달하지 않음

### 키보드 네비게이션

**포커스 관리**:
```css
focus:ring-2 focus:ring-ring focus:ring-offset-2
```

**접근성 기능**:
1. **Skip Links**: 네비게이션 우회를 허용하는 사용자
2. **포커스 표시**: 명확한 시각적 포커스 상태
3. **의미론적 HTML**: 적절한 헤딩 계층과 랜드마크
4. **스크린 리더 지원**: 필요한 곳에 ARIA 레이블과 설명

## 성능 기반 디자인

### 최적화 결정

**이미지 전략**:
- **무거운 이미지 없음**: CSS 기반 그래픽과 SVG 아이콘에 집중
- **아이콘 시스템**: 일관되고 가벼운 아이코노그래피를 위한 Lucide React
- **최소 애셋**: 디자인 선택을 통한 번들 크기 감소

**애니메이션 성능**:
```typescript
// GPU 가속 속성만 사용
transform: translateY() scale()  // ✓ GPU 가속
top: 50px                       // ✗ CPU 바운드, 리플로우 유발
```

**성능 디자인 결정**:
1. **변환 기반 애니메이션**: GPU 가속 속성 사용
2. **효율적 렌더링**: 레이아웃/페인트를 트리거하는 애니메이션 피함
3. **움직임 감소**: 움직임 감소에 대한 사용자 선호도 존중
4. **지연 로딩**: 대용량 데이터셋을 위한 점진적 콘텐츠 로딩

## 디자인 시스템 일관성

### 컴포넌트 Variants

**버튼 시스템**:
```typescript
variants: {
  variant: {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4"
  }
}
```

**시스템 이점**:
1. **일관성**: 모든 컴포넌트에서 동일한 시각적 언어
2. **유지보수성**: 중앙화된 스타일링으로 중복 감소
3. **확장성**: 기존 패턴을 따라 새로운 컴포넌트 쉽게 추가
4. **개발자 경험**: 컴포넌트 사용을 위한 예측 가능한 API

## 데이터 기반 디자인 결정

### 메트릭 표시

**애니메이션 카운터**:
```typescript
<AnimatedCounter value={metrics.totalEmissions} duration={1.5} />
```

**데이터 시각화 근거**:
1. **참여도**: 애니메이션 숫자가 주요 메트릭에 주의 끌기
2. **진행**: 애니메이션 지속시간이 메트릭의 중요도 반영
3. **명확성**: 빠른 이해를 위한 크고 굵은 숫자
4. **맥락**: 지원 텍스트가 필요한 맥락 제공

### 차트 디자인

**Recharts 구성**:
```typescript
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={chartData}>
    <Line dataKey="emissions" stroke="var(--color-chart-2)" strokeWidth={2} />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
  </LineChart>
</ResponsiveContainer>
```

**차트 디자인 근거**:
1. **반응형**: 차트가 컨테이너 크기에 자동으로 적응
2. **인터랙티브**: 툴팁이 호버 시 상세 정보 제공
3. **일관성**: 모든 차트가 동일한 색상 팔레트와 스타일링 사용
4. **접근성**: 충분한 대비와 명확한 데이터 레이블

## 향후 디자인 고려사항

### 확장성

**디자인 시스템 진화**:
- **컴포넌트 라이브러리**: 공유 라이브러리로 추출 준비
- **테마 시스템**: 다중 브랜드 테마 지원
- **국제화**: 다양한 언어에 대해 잘 확장되는 타이포그래피
- **데이터 밀도**: 증가된 데이터 볼륨에 적응하는 레이아웃

### 향상 기회

**고급 기능**:
1. **커스텀 테마**: 사용자가 색상 스키마 커스터마이징 허용
2. **레이아웃 옵션**: 다양한 사용자 역할을 위한 다른 대시보드 레이아웃
3. **고급 인터랙션**: 상세 분석을 위한 드릴다운 기능
4. **내보내기 기능**: 인쇄 친화적이고 내보내기 최적화된 레이아웃

이 디자인 시스템은 사용자 요구와 비즈니스 요구사항에 따라 진화할 수 있는 유연성을 유지하면서 명확성, 전문성, 사용성을 우선시합니다.