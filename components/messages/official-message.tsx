import Image from 'next/image';


export interface OfficialMessageProps {
  name: string;
  title: string;
  organization: string;
  date: string;
  image: string;
  message: string[];
  about: string;
  position?: string;
}

export function OfficialMessage({ name, title, organization, date, image, message, about, position }: OfficialMessageProps) {
  return (
    <main className='min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-100 flex flex-col'>
      {/* Header Section */}
      <section className='w-full py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white text-center'>
        <div className='max-w-3xl mx-auto'>
          <div className='mb-4 text-xs font-semibold tracking-wide uppercase opacity-80'>
            STATEMENTS & MESSAGES
          </div>
          <h1 className='text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight'>
            Message from the {position || title}
          </h1>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-2'>
            <span className='font-medium'>{organization}</span>
            <span className='hidden md:block opacity-70'>|</span>
            <span className='font-medium'>{date}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='flex-1 w-full bg-white py-12 px-4 flex justify-center'>
        <div className='max-w-3xl w-full mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-8 mb-8'>
            <div className='relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-blue-200'>
              <Image
                src={image}
                alt={name}
                fill
                className='object-cover'
                priority
              />
            </div>
            <div className='text-center md:text-left'>
              <h2 className='text-2xl font-bold text-slate-900 mb-1'>{name}</h2>
              <p className='text-base text-slate-700 font-medium mb-1'>
                {title}
              </p>
              <p className='text-sm text-slate-500'>
                Serving with vision, integrity, and dedication
              </p>
            </div>
          </div>
          <div className='prose prose-lg max-w-none text-slate-900 mb-10 font-serif'>
            {message.filter(Boolean).map((paragraph, idx) => (
              <p key={idx} className='mb-6 last:mb-0 whitespace-pre-line'>
                {paragraph}
              </p>
            ))}
          </div>
          <div className='bg-slate-50 rounded-lg p-6 shadow-inner'>
            <h3 className='text-lg font-semibold text-blue-800 mb-2'>
              About {name}
            </h3>
            <p className='text-slate-700 text-base leading-relaxed font-serif'>
              {about}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
