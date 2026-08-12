import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-rose-200 opacity-20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-5 font-medium tracking-wide text-pink-200">
            Luxury Skincare Experience
          </p>

          <h1 className="font-serif text-5xl leading-tight font-bold text-pink-200 md:text-6xl">
            Reveal Your Natural Glow,
            <br />
            <span className="text-pink-200">Embrace Timeless Beauty</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-pink-100">
            Discover premium skincare and beauty essentials crafted with care to
            nourish your skin and enhance your everyday confidence. Browse as a
            guest, or sign in to shop with ease.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-7 py-3 font-semibold text-[#be185d] shadow-lg transition hover:bg-pink-100"
            >
              Shop Collection
            </Link>
            <Link
              href="/#categories"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Explore Categories
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/30 px-7 py-3 font-semibold text-pink-100 transition hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-300 opacity-30 blur-3xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/rightside2.png"
              alt="Luxury Beauty Skincare"
              className="relative h-[560px] w-[500px] rounded-[40px] object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
