# Daily Calorie Tracker

### 프로젝트 소개
데일리 칼로리 트래커입니다.  
음식 이름과 탄수화물, 단백질, 지방을 입력하면 음식 카드가 생성되고, 저장된 데이터를 기준으로 총 칼로리와 영양소 차트를 원하는 버전(일간/주간/월간)으로 확인할 수 있습니다.
[데일리 칼로리 트레커](https://daily-calorie-tracker-liart.vercel.app/)

---

# Tech Stack

---

# Version History

## V1 - Vanilla JS MVP (완료)

### 설명
[자세한 설명 보기](./docs/v1.md)

Vanilla JavaScript 기반으로 구현한 MVP 버전

기간: 26.3.11 ~ 26.3.15

### 주요 기능
- 음식 추가
- 음식 수정
- 음식 삭제
- 총 칼로리 계산
- Chart.js 기반 영양소 차트

---

## V2 - React + TypeScript + Tailwind + Supabase (완료)

### 설명
[자세한 설명 보기](./docs/v2.md)

### 목표
(구조 개선 중심의 리팩토링)
Vanilla JS로 구현한 UI 구조를 React 기반 컴포넌트 구조로 리팩토링하고, 유지보수와 기능 확장이 쉬운 프론트엔드 구조로 개선하는 것을 목표로 했습니다.

### 개선 포인트

- 컴포넌트 기반 UI 구조로 변경
- 페이지와 기능 단위의 코드 분리
- 상태 관리 구조 개선
- API 요청 로직 분리
- TypeScript를 통한 타입 안정성 확보
- Tailwind CSS 기반 스타일링 적용
- 반복되는 UI 및 로직의 재사용성 개선
- React Router를 활용한 페이지 이동 구조 적용
- 로그인 상태에 따른 접근 제어 처리

---

## V3 - Spring Boot + Mybatis + Supabase (예정)

### 설명

### 목표

localStorage 기반 데이터 구조를 서버 기반 구조로 확장

### 구현 예정 기능

- REST API 기반 데이터 관리
- 사용자 데이터 관리
- MySQL 기반 데이터 영속성
- 기간별 칼로리 기록 관리
