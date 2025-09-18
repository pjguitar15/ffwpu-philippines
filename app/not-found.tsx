import { Suspense } from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Suspense>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 text-center px-4">
        <div className="max-w-lg w-full">
          <h1 className="text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4 drop-shadow">404</h1>
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Page Not Found</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400 text-lg">
            Sorry, the page you are looking for does not exist or has been moved.<br />
            If you believe this is an error, please contact the site administrator.
          </p>
          <Link href="/" className="inline-block px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-all">
            Go to Homepage
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
