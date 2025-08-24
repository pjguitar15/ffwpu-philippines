"use client"

type Event = {
  id: number
  title: string
  date: string
  end?: string
  location: string
  image: string
}

function getCountdown(dateStr: string) {
  const eventDate = new Date(dateStr)
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((diff / (1000 * 60)) % 60)
  const secs = Math.floor((diff / 1000) % 60)
  return { days, hours, mins, secs }
}

export function UpcomingEventsSection({ events }: { events: Event[] }) {
  return (
    <section
      className='w-screen py-16 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600'
      style={{
        clipPath: 'ellipse(120% 100% at 50% 0%)',
      }}
    >
      <div className='container mx-auto'>
        <h2 className='text-4xl font-bold text-center mb-2 text-white'>
          Our Upcoming Events
        </h2>
        <p className='text-center text-blue-100 max-w-2xl mx-auto mb-10'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna. adipiscing enim
          ad minim veniam.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-16'>
          {events.map((event) => {
            const countdown = getCountdown(event.date)
            return (
              <div
                key={event.id}
                className='flex flex-col md:flex-row lg:flex-col overflow-hidden bg-transparent transition-transform duration-300 hover:scale-[1.025] cursor-pointer'
              >
                <div className='md:w-1/2 lg:w-full h-56 lg:h-48 relative flex-shrink-0'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image}
                    alt={event.title}
                    className='w-full h-full object-cover object-center'
                  />
                </div>
                <div className='flex-1 p-6 flex flex-col justify-between'>
                  <div>
                    <h3 className='text-lg font-bold mb-1 text-white'>
                      {event.title}
                    </h3>
                    <div className='flex items-center gap-2 mb-1 text-sm text-blue-100'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        ></path>
                      </svg>
                      {new Date(event.date).toLocaleDateString()} @{' '}
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {event.end && (
                        <>
                          {' - '}
                          {new Date(event.end).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </>
                      )}
                    </div>
                    <div className='flex items-center gap-2 mb-2 text-sm text-blue-100'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
                        ></path>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        ></path>
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  <div className='flex gap-4 justify-center md:justify-start lg:justify-center mt-4'>
                    <div className='flex flex-col items-center'>
                      <span className='text-xl font-bold text-white'>
                        {countdown.days}
                      </span>
                      <span className='text-xs text-blue-100'>Days</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <span className='text-xl font-bold text-white'>
                        {countdown.hours}
                      </span>
                      <span className='text-xs text-blue-100'>Hrs</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <span className='text-xl font-bold text-white'>
                        {countdown.mins}
                      </span>
                      <span className='text-xs text-blue-100'>Mins</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <span className='text-xl font-bold text-white'>
                        {countdown.secs}
                      </span>
                      <span className='text-xs text-blue-100'>Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
