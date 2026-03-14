"use client"

import { useEffect, useState } from "react"
import { Code, Shield, Wrench, BookOpen } from "lucide-react"

const Skills = () => {
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

    const element = document.getElementById("skills")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const skillCategories = [
    {
      title: "Frontend",
      icon: <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      skills: ["HTML5 / CSS3 / JavaScript", "React.js / Next.js 14", "Tailwind CSS"],
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Security & UX",
      icon: <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />,
      skills: ["프론트엔드 보안 기본 원칙", "XSS / CSRF 등 클라이언트 공격 대응", "인증 플로우 이해 (OAuth 등)"],
      color: "from-green-500 to-green-600",
    },
    {
      title: "Tools",
      icon: <Wrench className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      skills: ["VS Code / Git / GitHub", "Qradar, Arcsight (보안 시스템 운영)", "Notion, Trello (업무 정리)"],
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Studying",
      icon: <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
      skills: ["웹 접근성 (Accessibility)", "웹 보안 심화", "백엔드 연동 (API 통신, 서버 이해)"],
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Code className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Skills
            </h2>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              아래는 제가 다룰 수 있는 기술과 현재 학습 중인 분야입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, index) => (
              <div
                key={category.title}
                className={`group bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/5 transition-all duration-300 transform hover:-translate-y-2 hover:ring-2 hover:ring-blue-500/10 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 mx-auto transition-transform duration-300 group-hover:scale-110`}
                >
                  {category.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4 transition-colors">
                  {category.title}
                </h3>

                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <li
                      key={skillIndex}
                      className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors hover:text-gray-900 dark:hover:text-white"
                    >
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
