import ReviewGenerator from "@/components/review-generator"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:p-6 bg-gradient-to-br from-rose-50 via-white to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(152,251,152,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.3)_50%,transparent)]" />

      <div className="relative z-10">
        <ReviewGenerator />
      </div>
    </main>
  )
}
