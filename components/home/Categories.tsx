const Categories = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#fff0f5] via-[#fce7f3] to-[#fbcfe8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#be185d] uppercase tracking-[0.3em] text-sm font-medium">
            Explore Categories
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3b1026] mt-4">
            Find Your Beauty Essentials
          </h2>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Discover our premium collection designed to enhance your beauty
            routine.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="rounded-3xl p-8 bg-white/40 backdrop-blur-lg border border-pink-200 text-center hover:-translate-y-2 transition">
            <h3 className="text-xl font-serif font-semibold text-[#9d174d]">
              Skincare
            </h3>

            <p className="text-gray-600 text-sm mt-3">
              Glow with premium skincare products.
            </p>
          </div>

          <div className="rounded-3xl p-8 bg-white/40 backdrop-blur-lg border border-pink-200 text-center hover:-translate-y-2 transition">
            <h3 className="text-xl font-serif font-semibold text-[#9d174d]">
              Makeup
            </h3>

            <p className="text-gray-600 text-sm mt-3">
              Enhance your natural beauty.
            </p>
          </div>

          <div className="rounded-3xl p-8 bg-white/40 backdrop-blur-lg border border-pink-200 text-center hover:-translate-y-2 transition">
            <h3 className="text-xl font-serif font-semibold text-[#9d174d]">
              Haircare
            </h3>

            <p className="text-gray-600 text-sm mt-3">
              Care for healthy beautiful hair.
            </p>
          </div>

          <div className="rounded-3xl p-8 bg-white/40 backdrop-blur-lg border border-pink-200 text-center hover:-translate-y-2 transition">
            <h3 className="text-xl font-serif font-semibold text-[#9d174d]">
              Fragrance
            </h3>

            <p className="text-gray-600 text-sm mt-3">
              Elegant scents for every moment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
