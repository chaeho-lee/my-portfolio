import Link from "next/link"
import { Github, BookOpen, Mail } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 dark:text-gray-500 transition-colors">
            © 2025 이채호. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/chaeho-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://vegetable-hoppang.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="블로그"
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:cogh207@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="이메일"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
