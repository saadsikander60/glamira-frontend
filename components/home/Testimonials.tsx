const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Ahmed",
      role: "Verified Customer",
      review:
        "Glamira products transformed my skincare routine. The quality feels truly premium.",
    },
    {
      name: "Emma Williams",
      role: "Beauty Enthusiast",
      review:
        "Beautiful packaging, amazing quality, and a luxury experience from start to finish.",
    },
    {
      name: "Ayesha Khan",
      role: "Verified Customer",
      review:
        "The products are elegant, effective, and delivered with excellent service.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      {/* Glow */}

      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-pink-200 uppercase tracking-[0.35em] text-sm">
            Customer Love
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-5">
            What Our Customers Say
          </h2>

          <p className="text-pink-100 mt-5 max-w-xl mx-auto">
            Real experiences from customers who love the Glamira beauty journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((item) => (
            <div
              key={item.name}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white hover:-translate-y-2 transition duration-300"
            >
              <div className="text-yellow-300 text-2xl mb-5">★★★★★</div>

              <p className="text-pink-100 leading-relaxed">"{item.review}"</p>

              <div className="mt-6">
                <h3 className="font-serif text-xl font-semibold">
                  {item.name}
                </h3>

                <p className="text-pink-200 text-sm mt-1">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
