const FeaturedProducts = () => {
  const products = [
    {
      name: "Vitamin C Brightening Serum",
      image: "/images/products/vitamin-serum.png",
      price: "AED 95",
    },
    {
      name: "Hydrating Face Cream",
      image: "/images/products/hydrating-cream.png",
      price: "AED 120",
    },
    {
      name: "Luxury Face Cleanser",
      image: "/images/products/cleanser.png",
      price: "AED 75",
    },
    {
      name: "Rose Luxury Face Mask",
      image: "/images/products/rose-mask.png",
      price: "AED 110",
    },
    {
      name: "Hair Repair Serum",
      image: "/images/products/hair-serum.png",
      price: "AED 130",
    },
    {
      name: "Premium Shampoo",
      image: "/images/products/shampoo.png",
      price: "AED 90",
    },
    {
      name: "Luxury Perfume",
      image: "/images/products/perfume.png",
      price: "AED 180",
    },
    {
      name: "Body Lotion",
      image: "/images/products/body-lotion.png",
      price: "AED 85",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-pink-200 uppercase tracking-[0.3em] text-sm font-medium">
            Featured Collection
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
            Our Best Beauty Picks
          </h2>

          <p className="text-pink-100 mt-4 max-w-xl mx-auto">
            Explore our carefully selected beauty essentials designed to elevate
            your daily routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 hover:-translate-y-2 transition duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-white">
                  {product.name}
                </h3>

                <p className="text-pink-200 font-semibold mt-2">
                  {product.price}
                </p>

                <button className="mt-4 w-full bg-white text-[#be185d] py-2 rounded-full hover:bg-pink-100 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
