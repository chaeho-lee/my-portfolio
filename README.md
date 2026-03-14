# 채호의 포트폴리오

보안과 개발의 경계를 지키는 개발자 이채호의 포트폴리오 웹사이트입니다.

## 기능

- 🎨 반응형 디자인
- 🌙 다크/라이트 모드 토글
- ✨ 스크롤 애니메이션
- 🤖 OpenAI Assistant API 챗봇
- 📱 모바일 친화적 UI

## 챗봇 설정

챗봇 기능을 사용하려면 다음 환경 변수를 설정해야 합니다:

1. `.env.local` 파일을 프로젝트 루트에 생성
2. 다음 내용을 추가:

\`\`\`env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_ASSISTANT_ID=asst-your-assistant-id-here
\`\`\`

### OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 계정 생성
2. API 키 생성 후 `OPENAI_API_KEY`에 설정

### Assistant 생성

1. [OpenAI Assistants](https://platform.openai.com/assistants)에서 새 Assistant 생성
2. 다음과 같은 지시사항 설정:

\`\`\`
당신은 이채호의 포트폴리오 웹사이트 챗봇입니다. 
방문자들에게 이채호에 대한 정보를 친근하고 전문적으로 안내해주세요.

이채호는:
- 보안과 사용자 경험을 함께 고려하는 프론트엔드 개발자
- HTML5/CSS3/JavaScript, React.js/Next.js, Tailwind CSS 기술 보유
- 프론트엔드 보안, XSS/CSRF 방지, 인증 플로우에 관심
- 웹 접근성과 백엔드 연동을 학습 중
- 이메일: cogh207@gmail.com
- 블로그: vegetable-hoppang.tistory.com
- GitHub: github.com/chaeho-dev

항상 한국어로 답변하고, 친근하면서도 전문적인 톤을 유지해주세요.
\`\`\`

3. Assistant ID를 복사하여 `OPENAI_ASSISTANT_ID`에 설정

## 실행

\`\`\`bash
npm install
npm run dev
\`\`\`

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI Assistant API
- **Icons**: Lucide React
- **Deployment**: Vercel (권장)

## 라이선스

MIT License
\`\`\`

마지막으로 메인 페이지에 환경 상태 표시를 추가합니다:

```typescriptreact file="app/page.tsx"
[v0-no-op-code-block-prefix]import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { EnvStatus } from "@/components/env-status"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <Chatbot />
      <EnvStatus />
    </main>
  )
}
