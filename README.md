# HanaLoop 탄소 배출량 대시보드

탄소 배출량 데이터를 추적하고 관리하는 현대적이고 반응형 웹 대시보드입니다. 경영진과 관리자가 회사의 배출량을 시각화하고, 탄소세를 계산하며, Net Zero 목표를 위한 데이터 기반 의사결정을 내릴 수 있도록 구축되었습니다.

## URL :

## 🌟 주요 기능

- **실시간 배출량 추적**: 애니메이션 카운터를 통한 CO2 배출량 실시간 모니터링
- **다중 회사 대시보드**: 여러 회사와 국가의 배출량 추적
- **탄소세 계산기**: 국가별 세율을 기반으로 한 자동 계산
- **환경 영향도**: 더 나은 이해를 위해 배출량을 나무 등가물로 변환
- **반응형 디자인**: 데스크톱과 모바일 기기에 최적화
- **인터랙티브 차트**: react-chart를 사용한 풍부한 데이터 시각화
- **로딩 상태**: 스켈레톤 컴포넌트를 통한 실제적인 로딩 시뮬레이션

## 🚀 기술 스택

- **프레임워크**: Next.js 14 with App Router and Turbopack
- **UI 컴포넌트**: Radix UI / Shadcn UI with custom design system
- **스타일링**: Tailwind CSS v4 with animations
- **차트**: react-chart for data visualization
- **애니메이션**: Framer Motion for smooth transitions
- **타이포그래피**: Geist Sans and Mono fonts
- **코드 품질**: Biome for linting and formatting
- **런타임**: Bun for package management

## 📊 데이터 모델

### 회사 (Company)

```typescript
interface Company {
  id: string;
  name: string;
  country: string; // 국가 코드
  emissions: GhgEmission[];
}
```

### 탄소 배출량 (GHG Emission)

```typescript
interface GhgEmission {
  yearMonth: string; // "2025-01", "2025-02"
  source: string; // "electricity", "natural_gas", "lpg"
  emissions: number; // CO2 등가물 톤 단위
}
```

### 국가 (Country)

```typescript
interface Country {
  code: string; // "US", "DE", "KR"
  name: string;
  carbonTaxRate: number; // CO2 톤당 USD
}
```

## 🛠️ 설치 및 설정

### 사전 요구사항

- Node.js 18+, Bun
- Git

### 설치 방법

1. 저장소 복제:

```bash
git clone <repository-url>
cd hanaloop-dashboard
```

2. 의존성 설치:

```bash
bun install
```

3. 개발 서버 시작:

```bash
bun dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 🧪 테스트 및 실행

### 개발 명령어

```bash
# Turbopack으로 개발 서버 시작
bun run dev

# 프로덕션 빌드
bun run build

# 프로덕션 서버 시작
bun start

# 린터 실행 (확인만)
bun run lint

# 코드 포맷팅
bun run format
```

### API 시뮬레이션

대시보드는 실제 환경을 시뮬레이션하는 모의 API를 포함합니다:

- **네트워크 지연시간**: 200-800ms 응답 시간
- **실패율**: 쓰기 작업에 대해 15% 실패 확률
- **실제적인 데이터**: 다양한 배출 패턴을 가진 다국적 회사

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 대시보드 개요
│   ├── companies/         # 회사 관리
│   ├── calculator/        # 탄소세 계산기
│   ├── emissions/         # 배출량 추적
│   ├── trees/             # 환경 영향도 시각화
│   └── settings/          # 애플리케이션 설정
├── components/
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── dashboard/         # 대시보드 전용 컴포넌트
│   ├── charts/            # 데이터 시각화
│   ├── navigation/        # 네비게이션 컴포넌트
│   └── calculator/        # 계산기 컴포넌트
├── lib/
│   ├── types.ts          # TypeScript 정의
│   ├── api.ts            # 모의 API 함수
│   ├── data.ts           # 샘플 데이터
│   └── utils.ts          # 유틸리티 함수
└── Docs/                  # 프로젝트 문서
```

## 🎯 주요 페이지

- **대시보드** (`/`): 주요 메트릭과 차트가 있는 개요
- **회사** (`/companies`): 회사 목록 및 세부 정보
- **배출량** (`/emissions`): 상세한 배출량 추적
- **계산기** (`/calculator`): 탄소세 계산
- **나무** (`/trees`): 환경 영향 시각화

## 🔧 개발 참고사항

- 코드 품질 및 개발자 경험 향상을 위해 ESLint/Prettier 대신 Biome 사용
- 실제적인 UX 테스트를 위한 시뮬레이션된 네트워크 지연시간 구현
- 모든 애니메이션은 Framer Motion으로 구동
- 모바일 우선 접근법을 사용한 반응형 디자인
- 기본적으로 다크 모드 활성화

## 📱 브라우저 지원

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성
3. 변경사항 적용
4. `bun run lint` 및 `bun run format` 실행
5. 풀 리퀘스트 제출
