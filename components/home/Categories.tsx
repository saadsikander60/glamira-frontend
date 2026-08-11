const Categories = () => {
  const categories = [
    {
      title: "Skincare",
      text: "Glow with premium skincare products.",
      image: "/images/categories/skincare.jpg",
    },
    {
      title: "Makeup",
      text: "Enhance your natural beauty.",
      image: "/images/categories/makeup.jpg",
    },
    {
      title: "Haircare",
      text: "Care for healthy beautiful hair.",
      image: "/images/categories/haircare.jpg",
    },
    {
      title: "Fragrance",
      text: "Elegant scents for every moment.",
      image: "/images/categories/fragrance.jpg",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      {/* Glow */}

      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-pink-200 uppercase tracking-[0.3em] text-sm font-medium">
            Explore Categories
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
            Find Your Beauty Essentials
          </h2>

          <p className="text-pink-100 mt-4 max-w-xl mx-auto">
            Discover our premium collection designed to enhance your beauty
            routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 hover:-translate-y-2 transition duration-300"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-serif font-semibold text-white">
                  {category.title}
                </h3>

                <p className="text-pink-100 text-sm mt-3">{category.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
