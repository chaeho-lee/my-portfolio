"use client"

import { useEffect, useState } from "react"
import { Mail, BookOpen, Github, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const Contact = () => {
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

    const element = document.getElementById("contact")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "cogh207@gmail.com",
      link: "mailto:cogh207@gmail.com",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Blog",
      value: "vegetable-hoppang.tistory.com",
      link: "https://vegetable-hoppang.tistory.com/",
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      value: "github.com/chaeho-dev",
      link: "https://github.com/chaeho-dev",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Location",
      value: "서울특별시, 대한민국",
      link: null,
    },
  ]

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 transition-colors border-t border-blue-100 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Contact
            </h2>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg transition-colors">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors">
                  포트폴리오를 방문해 주셔서 감사합니다. 저는 보안과 사용자 경험을 함께 고민하는 프론트엔드 개발자
                  이채호입니다.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 transition-colors">
                  언제든지 편하게 연락주세요 😊
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.label}
                    className={`flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 transition-colors">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white transition-colors">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  이메일 또는 GitHub을 통해 프로젝트 협업이나 제안도 환영합니다!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 transition-transform hover:scale-105 active:scale-95"
                    onClick={() => window.open("mailto:cogh207@gmail.com", "_blank")}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    이메일 보내기
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 transition-transform hover:scale-105 active:scale-95"
                    onClick={() => window.open("https://github.com/chaeho-dev", "_blank")}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub 방문
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
