import { Sparkles, ShieldCheck, Truck, Crown } from "lucide-react";

const WhyChoose = () => {
  const features = [
    {
      icon: Sparkles,
      iconColor: "text-yellow-300",
      glow: "bg-yellow-300",
      title: "Premium Ingredients",
      text: "Carefully selected ingredients designed to enhance your natural beauty.",
    },
    {
      icon: Crown,
      iconColor: "text-pink-300",
      glow: "bg-pink-300",
      title: "Luxury Experience",
      text: "Elegant beauty collections crafted for a premium lifestyle.",
    },
    {
      icon: Truck,
      iconColor: "text-blue-300",
      glow: "bg-blue-300",
      title: "Fast & Secure Delivery",
      text: "Your beauty essentials delivered safely and quickly.",
    },
    {
      icon: ShieldCheck,
      iconColor: "text-emerald-300",
      glow: "bg-emerald-300",
      title: "Trusted Quality",
      text: "High-quality products created with care and confidence.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      {/* Glow */}

      <div className="absolute top-10 left-20 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-10 right-20 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-pink-200 uppercase tracking-[0.35em] text-sm">
            Why Choose Glamira
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-5">
            Crafted For Timeless Beauty
          </h2>

          <p className="text-pink-100 mt-5 max-w-2xl mx-auto">
            Experience premium skincare and beauty essentials created to bring
            elegance, confidence, and natural glow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex items-center gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition duration-500"
              >
                <div className="relative flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center bg-white/10 border border-white/20">
                  <div
                    className={`absolute inset-0 rounded-full ${feature.glow} blur-xl opacity-20 group-hover:opacity-50 transition`}
                  ></div>

                  <Icon
                    size={38}
                    strokeWidth={1.8}
                    className={`relative ${feature.iconColor} group-hover:scale-125 transition duration-300`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-pink-100 text-sm mt-2 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
