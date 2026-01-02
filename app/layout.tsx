import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Import du Navbar
import Footer from "@/components/layout/Footer"; // Import du Footer
import ChatWidget from "@/components/layout/ChatWidget"; // Import du ChatWidget
import AuthProvider from "@/components/providers/AuthProvider"; // Import du AuthProvider
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Océan du Nord - Voyagez comme jamais",
  description: "Réservez vos billets de bus en ligne au Congo Brazzaville.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${poppins.variable} antialiased font-sans text-slate-800`}
      >
        <AuthProvider>
          {/* Navbar fixe en haut */}
          <Navbar />

          {/* Le contenu de chaque page s'insère ici */}
          {children}

          {/* Footer en bas */}
          <Footer />

          {/* Widget de Chat */}
          <ChatWidget />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
