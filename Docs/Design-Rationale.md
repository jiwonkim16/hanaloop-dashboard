# 디자인 근거: UI 결정사항 및 디자인 시스템

## 개요

이 문서는 HanaLoop 탄소 배출량 대시보드의 주요 디자인 결정사항, UI 선택, 디자인 시스템 근거를 설명합니다. 모든 결정은 대상 사용자(경영진 및 관리자), 사용성 요구사항, 기술적 제약을 고려하여 이루어졌습니다.

## 색상 시스템 및 테마

### 다크 우선 디자인 결정

**선택**: 기본 인터페이스 테마로 다크 모드

```css
/* app/globals.css */
:root {
  --background: oklch(0.08 0 0); /* 깊은 다크 배경 */
  --foreground: oklch(0.98 0 0); /* 높은 대비 흰색 텍스트 */
  --card: oklch(0.12 0 0); /* 미묘한 카드 입체감 */
  --primary: oklch(0.7 0.15 264); /* 블루 액센트 색상 */
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

## 레이아웃 및 공간 디자인

### 대시보드 레이아웃 구조

```typescript
// components/layout/dashboard-layout.tsx
<div className="flex h-screen bg-background">
  <Sidebar /> {/* 고정 너비 네비게이션 */}
  <main className="flex-1">
    {/* 유연한 콘텐츠 영역 */}
    <Header /> {/* 고정 높이 헤더 */}
    <Content /> {/* 스크롤 가능한 메인 콘텐츠 */}
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
--chart-1: oklch(0.7 0.15 264); /* Primary blue */
--chart-2: oklch(0.65 0.2 142); /* Environmental green */
--chart-3: oklch(0.75 0.18 70); /* Warning orange */
--chart-4: oklch(0.6 0.25 304); /* Purple accent */
--chart-5: oklch(0.68 0.22 16); /* Red accent */
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
{
  Array.from({ length: 4 }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.1 }}
    >
      <Skeleton className="h-32" />
    </motion.div>
  ));
}
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
{
  /* 데스크톱 사이드바 */
}
<div className="hidden md:block">
  <Sidebar />
</div>;

{
  /* 모바일 네비게이션 */
}
<MobileNav />;
```

**모바일 디자인 결정**:

1. **접을 수 있는 네비게이션**: Sheet 기반 모바일 네비게이션으로 화면 공간 절약
2. **터치 친화적**: 모든 인터랙티브 요소에 최소 44px 터치 타겟
3. **읽기 가능한 텍스트**: 모바일에서 16px 최소 폰트 크기 유지
4. **스와이프 제스처**: 자연스러운 모바일 인터랙션 패턴 지원

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

이 디자인 시스템은 사용자 요구와 비즈니스 요구사항에 따라 진화할 수 있는 유연성을 유지하면서 명확성, 전문성, 사용성을 우선시합니다.
