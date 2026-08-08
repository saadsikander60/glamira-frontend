import Link from "next/link";

const Hero = () => {
  return (

    <section className="relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]">


      {/* Soft Background Glow */}

      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20"></div>



      <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">



        {/* Left Content */}

        <div>

          <p className="text-pink-200 font-medium tracking-wide mb-5">
            Luxury Skincare Experience
          </p>



          <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-pink-200">

            Reveal Your Natural Glow,

            <br />

            <span className="text-pink-200">
              Embrace Timeless Beauty
            </span>

          </h1>



          <p className="mt-6 text-pink-100 text-lg leading-relaxed max-w-lg">

            Discover premium skincare and beauty essentials
            crafted with care to nourish your skin and enhance
            your everyday confidence.

          </p>




          <div className="flex gap-4 mt-8">


            <Link
              href="/products"
              className="bg-white text-[#be185d] px-8 py-3 rounded-full font-medium shadow-lg hover:bg-pink-100 transition"
            >
              Explore Collection →
            </Link>



            <Link
              href="/categories"
              className="border border-pink-200 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition"
            >
              Discover More
            </Link>


          </div>


        </div>





        {/* Right Beauty Image */}


        <div className="flex justify-center">


          <div className="relative">


            <div className="absolute inset-0 bg-pink-300 blur-3xl opacity-30 rounded-full"></div>



            <img
              src="/rightside2.png"
              alt="Luxury Beauty Skincare"
              className="relative w-[500px] h-[560px] object-cover rounded-[40px] shadow-2xl"
            />


          </div>


        </div>



      </div>


    </section>

  );
};

export default Hero;