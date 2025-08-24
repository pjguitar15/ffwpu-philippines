import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Steps } from "@/components/about/steps"
import { Teams } from "@/components/about/teams"
import { CtaFaq } from "@/components/about/cta-faq"
import { SectionNav } from "@/components/about/section-nav"

export default function AboutPage() {
  // Hardcoded navigation model for now (can be fetched later)
  const sections = [
    { id: "how-to-join", label: "How to join" },
    { id: "what-to-expect", label: "What to expect" },
    { id: "faqs", label: "FAQs" },
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 scroll-smooth">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
            <div className="min-w-0">
              <Steps id="how-to-join" />
              <Teams id="what-to-expect" />
              <CtaFaq id="faqs" />
            </div>
            <div>
              <SectionNav sections={sections} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
