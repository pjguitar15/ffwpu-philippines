"use client"
 
import { useRouter } from "next/router"
import Head from "next/head"
 
type OGNewsAutoProps = {
  title: string
  subtitle?: string
  image: string
  url: string
  description?: string
  type?: string
  publishedTime?: string
  author?: string
}

export default function OGNewsAuto({
  title,
  subtitle,
  image,
  url,
  description,
  type = "article",
  publishedTime,
  author
}: OGNewsAutoProps) {
  // Generate a description from subtitle or fallback
  const finalDescription = description || subtitle || "Read more on FFWPU Philippines website"
  
  return (
    <Head>
      {/* Essential Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Facebook specific */}
      <meta property="fb:app_id" content="your-fb-app-id" /> {/* You'll need to replace this with your actual FB App ID */}
      
      {/* Optional but recommended for articles */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Image dimensions if you know them */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Head>
  )
}