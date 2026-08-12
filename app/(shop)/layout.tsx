import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-bg min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
