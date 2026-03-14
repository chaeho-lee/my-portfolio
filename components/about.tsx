"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"

const About = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("about")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              About Me
            </h2>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 transition-colors">
                  안녕하세요. 저는{" "}
                  <strong className="text-blue-600 dark:text-blue-400">
                    보안과 사용자 경험(UX)을 함께 고려하는 프론트엔드 개발자 이채호
                  </strong>
                  입니다.
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 transition-colors">
                  단순히 동작하는 코드보다는, 사용자가 안심하고 사용할 수 있는 신뢰성 있는 웹 환경을 만드는 것이 저의
                  개발 철학입니다.
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    "보안은 기능을 방해하지 않습니다. 오히려 기능을 완성합니다."
                  </strong>
                  라는 철학을 가지고 클라이언트 측 보안에도 신경 쓰고 있습니다.
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 transition-colors">
                  사람과 기술의 접점을 연결하는 개발자가 되고자 UI/UX, 접근성, 인증 처리, XSS/CSRF 방지 등 프론트엔드
                  보안 요소에 지속적인 관심을 가지고 학습하고 있습니다.
                </p>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                  앞으로도{" "}
                  <strong className="text-blue-600 dark:text-blue-400">안전하고 따뜻한 웹 경험을 만드는 개발자</strong>
                  로 성장하고 싶습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
