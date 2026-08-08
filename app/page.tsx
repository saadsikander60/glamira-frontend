import Categories from "@/components/home/Categories";

export default function Home() {
  return (
    <main>
      <Categories />

      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#8f1748] via-[#be185d] to-[#f472b6]">
        {/* Glow */}

        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 opacity-20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200 opacity-20 blur-3xl rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-pink-100 tracking-[0.3em] uppercase text-sm">
              Why Choose Glamira
            </p>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
              Beauty Crafted With Elegance
            </h2>

            <p className="text-pink-100 mt-4 max-w-xl mx-auto">
              Discover premium skincare and beauty essentials created for your
              natural glow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "🌿",
                title: "Natural Care",
                text: "Pure ingredients for healthy skin",
              },
              {
                icon: "✨",
                title: "Luxury Beauty",
                text: "Premium collections for you",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                text: "Safe and quick shipping",
              },
              {
                icon: "💎",
                title: "Premium Quality",
                text: "Beauty products you trust",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center text-white hover:bg-white/20 transition"
              >
                <div className="text-5xl mb-5">{item.icon}</div>

                <h3 className="font-serif text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="text-pink-100 text-sm mt-3">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
