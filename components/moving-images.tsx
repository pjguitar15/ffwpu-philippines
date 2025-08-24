"use client"

export function MovingImages() {
  const images = [
    "/church-community-gathering.png",
    "/family-worship.png",
    "/youth-fellowship.png",
    "/community-service-volunteers.png",
    "/church-choir-singing.png",
    "/prayer-circle.png",
    "/children-sunday-school.png",
    "/church-picnic-families.png",
  ]

  return (
    <div className="relative overflow-hidden h-96 bg-muted/20">
      <div className="flex animate-scroll-left space-x-6 h-full items-center">
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              clipPath: "polygon(0 20%, 100% 15%, 100% 100%, 0% 100%)",
            }}
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`FFWPU Philippines community ${index + 1}`}
              className="h-80 w-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
