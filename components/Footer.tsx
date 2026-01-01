import { BookOpen, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 1. Brand & Mission */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="bg-blue-900/50 p-2 rounded-lg text-blue-400 group-hover:bg-blue-900 transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold text-white">
                Socratic Tutor
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Don't just get the answer. Learn the concept. An AI-powered tutor
              that uses the Socratic method to guide your learning journey.
            </p>
          </div>

          {/* 2. Platform Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-400 transition-colors"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="hover:text-blue-400 transition-colors"
                >
                  Upload PDF
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Resources (Portfolio fluff) */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Model Architecture
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  LoRA Config
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Connect (Crucial for Portfolio) */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">
              Built By
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Built with Next.js, LangChain & Llama-3.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Socratic Tutor. Open Source
            Project.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
