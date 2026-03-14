"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      aria-label="메인 소개"
    >
      {/* 배경 - 그리드 패턴 + 애니메이션 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors" />
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* 프로필 이미지 */}
          <div className="mb-8">
            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden ring-4 ring-blue-200 dark:ring-blue-800/50 shadow-xl transition-transform duration-300 hover:scale-105">
              <Image
                src="/placeholder-user.jpg"
                alt="이채호 프로필"
                width={144}
                height={144}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors tracking-tight text-balance">
            안녕하세요,
            <br />
            <span className="text-blue-600 dark:text-blue-400">보안과 개발의 경계를 지키는</span>
            <br />
            개발자 <span className="text-indigo-600 dark:text-indigo-400">이채호</span>입니다.
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors">
            사용자가 안심하고 사용할 수 있는 신뢰성 있는 웹 환경을 만드는 것이 저의 개발 철학입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={scrollToAbout}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 transition-transform hover:scale-105 hover:shadow-lg active:scale-100"
            >
              더 알아보기
            </Button>
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              variant="outline"
              size="lg"
              className="border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 transition-transform hover:scale-105 hover:shadow-lg active:scale-100"
            >
              연락하기
            </Button>
          </div>

          {/* 동적 요소 - 스크롤 다운 애니메이션 */}
          <div className="animate-bounce">
            <ChevronDown
              size={32}
              className="text-gray-400 dark:text-gray-500 mx-auto cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={scrollToAbout}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
