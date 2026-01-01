import { connectToDatabase } from "@/libs/mongodb";
import { BookOpen, Library, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
// 1. Server-Side Data Fetching
// This runs on the server every time the page loads.
async function getBooks() {
  const { db } = await connectToDatabase();

  const collection = db.collection("knowledge_base");

  // Try getting sources from both possible locations
  let books = await collection.distinct("metadata.source");

  // If empty, try the root 'source' field
  if (!books || books.length === 0) {
    books = await collection.distinct("source");
  }

  return books || [];
}

// 2. The Page Component
export const dynamic = "force-dynamic"; // Force dynamic rendering since we need database access

export default async function DashboardPage() {
  const books = await getBooks();

  // Helper to generate a consistent color based on the string
  const getColor = (str: string) => {
    const colors = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-pink-400",
      "from-emerald-500 to-teal-400",
      "from-orange-500 to-amber-400",
      "from-indigo-500 to-blue-400",
    ];
    const index = str.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Library className="text-blue-600" />
              Your Library
            </h1>
            <p className="text-gray-600 mt-2">
              Select a text to begin your Socratic learning session.
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Upload New PDF
          </Link>
        </div>

        {/* Grid Section */}
        {books.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No books found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto mb-8">
              It looks like you haven't uploaded any knowledge yet. Upload a PDF
              to start tutoring.
            </p>
            <Link
              href="/upload"
              className="text-blue-600 font-semibold hover:underline"
            >
              Go to Upload Page &rarr;
            </Link>
          </div>
        ) : (
          // BOOK GRID
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((bookName: string, i: number) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                {/* Card Header / Gradient Cover */}
                <div
                  className={`h-32 bg-gradient-to-r ${getColor(
                    bookName
                  )} p-6 flex items-start justify-between relative`}
                >
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-white">
                    <BookOpen size={24} />
                  </div>
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3
                    className="text-lg font-bold text-gray-900 line-clamp-2 mb-2"
                    title={bookName}
                  >
                    {bookName.replace(".pdf", "").replace(/_/g, " ")}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-8">
                    PDF Document
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/chat/${encodeURIComponent(bookName)}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900"
                    >
                      <MessageCircle size={18} />
                      Start Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
