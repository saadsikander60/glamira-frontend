const Newsletter = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      {/* Glow */}

      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 right-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-10 md:p-16 text-center">
          <p className="text-pink-200 uppercase tracking-[0.35em] text-sm font-medium">
            Join Glamira Beauty Circle
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-5">
            Discover Beauty Beyond Ordinary
          </h2>

          <p className="text-pink-100 mt-5 max-w-xl mx-auto leading-relaxed">
            Subscribe to receive exclusive offers, beauty tips, and updates
            about our latest luxury collections.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
            />

            <button className="px-8 py-4 rounded-full bg-white text-[#be185d] font-semibold hover:bg-pink-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
