import { ArrowRight, BookOpen, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero Section: Modern Grid Design */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-white">
        {/* 1. The Grid Background */}
        <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        {/* 2. The Blue Glow Effect (Behind Text) */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-sm text-blue-800 backdrop-blur-sm">
            <span className="mr-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
              New
            </span>
            Powered by Llama-3 & LoRA
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Don't Just Memorize.
            <span className="block text-blue-600 relative">
              Understand.
              {/* Optional: Underline decoration */}
              <svg
                className="absolute w-full h-3 -bottom-2 left-0 text-blue-200 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 sm:text-2xl leading-relaxed">
            Upload your textbooks and let our AI tutor guide you to the answers
            using the
            <strong> Socratic Method</strong>. Stop getting spoon-fed; start
            thinking critically.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Learning <ArrowRight size={20} />
            </Link>
            <Link
              href="/upload"
              className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Upload PDF
            </Link>
          </div>
        </div>

        {/* Fade to white at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Smarter Way to Study
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Most AI bots just give you the answer. We help you build the
              neural pathways to find it yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1: The Socratic Method */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Brain size={32} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                The Socratic Method
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our fine-tuned LoRA model refuses to give direct answers.
                Instead, it asks guiding questions that lead you to the
                solution, reinforcing long-term memory.
              </p>
            </div>

            {/* Feature 2: Custom Knowledge Base */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <BookOpen size={32} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Your Own Library
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your specific lecture notes, textbooks, or research
                papers. The AI tutors you strictly based on the material you
                provide.
              </p>
            </div>

            {/* Feature 3: Adaptive Learning */}
            <div className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <Sparkles size={32} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Adaptive Learning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Struggling with a concept? The AI breaks it down into simpler
                pieces. Breezing through? It challenges you with deeper
                questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
