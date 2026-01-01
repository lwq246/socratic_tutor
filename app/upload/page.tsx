"use client";
import { AlertCircle, CheckCircle, Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setStatus("uploading");
      setMessage("Reading PDF and generating embeddings...");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/ingest", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        setStatus("success");
        setMessage("Book ingested successfully! Redirecting...");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Failed to process file. Please try again.");
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: status === "uploading" || status === "success",
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add Knowledge</h1>
            <p className="text-gray-600 mt-2">
              Upload a textbook or paper to start a Socratic session.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Drag & Drop Zone */}
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }
                ${status !== "idle" ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center gap-4">
                <div
                  className={`p-4 rounded-full ${
                    isDragActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive
                      ? "Drop the PDF here"
                      : "Click or drag PDF here"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Max file size: 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {status !== "idle" && (
              <div
                className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                  status === "uploading"
                    ? "bg-blue-50 text-blue-700"
                    : status === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status === "uploading" && <Loader2 className="animate-spin" />}
                {status === "success" && <CheckCircle />}
                {status === "error" && <AlertCircle />}

                <span className="font-medium">{message}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
