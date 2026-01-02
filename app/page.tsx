//app/page.tsx
import Hero from "@/components/home/Hero";
import PopularRoutes from "@/components/home/PopularRoutes";
import OurServices from "@/components/home/OurServices";
import Features from "@/components/home/Features";
import LatestNews from "@/components/home/LatestNews";
import Partners from "@/components/home/Partners";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PopularRoutes />
      <Features />
      <OurServices />
      <LatestNews />
      <Partners />
    </main>
  );
}
