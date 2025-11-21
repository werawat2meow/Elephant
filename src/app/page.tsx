export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Your New Project
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a fresh Next.js project with Tailwind CSS ready to use.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to Build
          </h2>
          <p className="text-gray-600">
            Start by editing <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/app/page.tsx</code>
          </p>
        </div>
      </div>
    </main>
  )
}