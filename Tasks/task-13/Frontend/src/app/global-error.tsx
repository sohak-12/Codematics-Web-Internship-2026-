"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05050a] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-gray-400">{error.message}</p>
          <button onClick={reset} className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
