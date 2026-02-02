import Navbar from "@/components/layout/Navbar";
import PromoBanner from "@/components/layout/PromoBanner";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PromoBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
