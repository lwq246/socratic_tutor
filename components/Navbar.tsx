import { BookOpen, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Socratic<span className="text-blue-600">Tutor</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Library
          </Link>

          <Link
            href="/upload"
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
          >
            <UploadCloud size={16} />
            <span>Upload PDF</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
