import Categories from "@/components/home/Categories";

import WhyChoose from "@/components/home/WhyChoose";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
export default function Home() {
  return (
    <main>
      <Categories />

      <WhyChoose />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
