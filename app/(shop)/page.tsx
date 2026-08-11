import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChoose from "@/components/home/WhyChoose";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
export default function Home() {
  return (
    <main>
      <Categories />
      <FeaturedProducts />
      <WhyChoose />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
