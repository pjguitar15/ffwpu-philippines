import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            Member Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The member profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/profile"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to My Profile
          </Link>
          
          <div>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}