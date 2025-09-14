import { useEffect, useRef, useState } from "react"

export function LazyMount({
  force,
  children,
}: {
  force?: boolean
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(!!force)

  useEffect(() => setShow((s) => s || !!force), [force])

  useEffect(() => {
    if (show || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '800px' },
    ) // pre-mount a bit early
    io.observe(ref.current)
    return () => io.disconnect()
  }, [show])

  return <div ref={ref}>{show ? children : null}</div>
}
