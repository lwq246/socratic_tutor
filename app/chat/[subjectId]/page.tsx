import ChatInterface from "@/components/ChatInterface";
import { BookOpen } from "lucide-react";

// 1. Define params as a Promise
interface PageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

// 2. Make the component async
export default async function ChatPage({ params }: PageProps) {
  // 3. Await the params before using them
  const resolvedParams = await params;
  const subjectName = decodeURIComponent(resolvedParams.subjectId);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 h-[calc(100vh-80px)]">
        {/* Header / Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <BookOpen size={16} />
          <span>Library</span>
          <span>/</span>
          <span className="font-semibold text-blue-600 truncate">
            {subjectName}
          </span>
        </div>

        {/* The Chat UI */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <ChatInterface subjectId={subjectName} />
        </div>
      </div>
    </div>
  );
}
