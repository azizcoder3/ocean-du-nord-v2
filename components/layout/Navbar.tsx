// components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  Bot,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <header className="bg-white backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/logo-ocean-du-nord.png"
                alt="Logo Océan du Nord"
                width={150}
                height={50}
                className="h-10 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
                priority
              />
            </Link>
          </div>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {/* Océan du nord */}
            <div className="relative group">
              {/* MODIFICATION ICI : text-base au lieu de text-sm */}
              <button className="text-gray-700 group-hover:text-primary font-medium transition-colors flex items-center gap-1 py-4 text-base">
                Océan du nord{" "}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <Link
                  href="/ocean-du-nord/agences"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Nos agences
                </Link>
                <Link
                  href="/ocean-du-nord/tarifs"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Grille tarifaire
                </Link>
                <Link
                  href="/ocean-du-nord/multimedia"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Yebana Multimédia
                </Link>
              </div>
            </div>

            {/* Services */}
            <div className="relative group">
              {/* MODIFICATION ICI : text-base au lieu de text-sm */}
              <button className="text-gray-700 group-hover:text-primary font-medium transition-colors flex items-center gap-1 py-4 text-base">
                Services{" "}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <Link
                  href="/services/courrier"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Courrier Express
                </Link>
                <Link
                  href="/services/fret"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Service Fret
                </Link>
                <Link
                  href="/services/location"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Location de Bus
                </Link>
              </div>
            </div>

            {/* MODIFICATION ICI : text-base pour les liens simples */}
            <Link
              href="/actualites"
              className="text-gray-700 hover:text-primary font-medium text-base"
            >
              Actualités
            </Link>
            <Link
              href="/onc"
              className="text-gray-700 hover:text-primary font-medium text-base"
            >
              ONC
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary font-medium text-base"
            >
              Nous contacter
            </Link>

            <Link
              href="/oceane"
              className="flex items-center gap-2 text-secondary font-bold bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary hover:text-white transition-colors text-xs"
            >
              <Bot className="w-4 h-4" /> Océane
            </Link>
          </nav>

          {/* ACTIONS BOUTONS DESKTOP */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={isAdmin ? "/admin" : "/profile"}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                    isAdmin
                      ? "bg-secondary text-white shadow-lg shadow-amber-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                  <span>{user.name?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                // MODIFICATION ICI : text-base
                className="text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors text-base"
              >
                Connexion
              </Link>
            )}
            <Link
              href="/booking"
              // MODIFICATION ICI : text-base pour le bouton réserver
              className="bg-primary hover:bg-emerald-900 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95 text-base"
            >
              Réserver
            </Link>
          </div>

          {/* BURGER MENU BUTTON (MOBILE) */}
          <div className="lg:hidden flex items-center gap-4">
            {!user && (
              <Link href="/login" className="p-2 text-primary">
                <User className="w-6 h-6" />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU - (Je n'ai pas changé les tailles ici, car sur mobile on reste souvent en 14/15px, mais dites-moi si vous voulez changer aussi) */}
      <div
        className={`lg:hidden fixed inset-x-0 bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out z-40 overflow-y-auto max-h-[calc(100vh-80px)] ${
          isOpen ? "top-20 opacity-100" : "-top-full opacity-0 invisible"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* User Section Mobile */}
          {user && (
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold uppercase">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-gray-900 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    {isAdmin ? "Administrateur" : "Client"}
                  </p>
                </div>
              </div>
              <Link
                href={isAdmin ? "/admin" : "/profile"}
                onClick={toggleMenu}
                className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-400" />
              </Link>
            </div>
          )}

          {/* Links List */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={toggleMenu}
              className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/booking"
              onClick={toggleMenu}
              className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              Destinations
            </Link>

            {/* Océan du nord (Accordion) */}
            <div>
              <button
                onClick={() => toggleSubmenu("odn")}
                className="w-full flex items-center justify-between p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Océan du Nord{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSubmenu === "odn" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSubmenu === "odn" && (
                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                  <Link
                    href="/ocean-du-nord/agences"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Nos agences
                  </Link>
                  <Link
                    href="/ocean-du-nord/tarifs"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Grille tarifaire
                  </Link>
                  <Link
                    href="/ocean-du-nord/multimedia"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Yebana Multimédia
                  </Link>
                </div>
              )}
            </div>

            {/* Services (Accordion) */}
            <div>
              <button
                onClick={() => toggleSubmenu("services")}
                className="w-full flex items-center justify-between p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Services{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSubmenu === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSubmenu === "services" && (
                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
                  <Link
                    href="/services/courrier"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Courrier Express
                  </Link>
                  <Link
                    href="/services/fret"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Service Fret
                  </Link>
                  <Link
                    href="/services/location"
                    onClick={toggleMenu}
                    className="block p-2 text-sm text-gray-600 font-medium"
                  >
                    Location de Bus
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/actualites"
              onClick={toggleMenu}
              className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              Actualités
            </Link>
            <Link
              href="/onc"
              onClick={toggleMenu}
              className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              ONC
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-4 space-y-3">
            <Link
              href="/oceane"
              onClick={toggleMenu}
              className="w-full flex items-center justify-center gap-2 p-4 bg-secondary/10 text-secondary font-black rounded-2xl transition-all"
            >
              <Bot className="w-5 h-5" /> Parler à Océane
            </Link>

            {user ? (
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 font-black rounded-2xl transition-all border border-red-100"
              >
                <LogOut className="w-5 h-5" /> Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                onClick={toggleMenu}
                className="w-full flex items-center justify-center gap-2 p-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// // components/layout/Navbar.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useSession, signOut } from "next-auth/react";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   Bot,
//   User,
//   LogOut,
//   ShieldCheck,
// } from "lucide-react";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

//   const user = session?.user;
//   const isAdmin = user?.role === "ADMIN";

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const toggleSubmenu = (name: string) => {
//     setOpenSubmenu(openSubmenu === name ? null : name);
//   };

//   return (
//     <header className="bg-white backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* LOGO */}
//           {/* <div className="shrink-0">
//             <Link href="/" className="flex items-center gap-2 group">
//               <span className="text-2xl font-black tracking-tighter text-primary group-hover:opacity-80 transition-opacity">
//                 OCEAN<span className="text-secondary">DU</span>NORD
//               </span>
//             </Link>
//           </div> */}

//           <Link href="/" className="flex items-center gap-2 group">
//             {/* Remplacement du texte par l'Image */}
//             <Image
//               src="/images/logo-ocean-du-nord.png" // Remplacez par le nom exact de votre fichier dans public/images/
//               alt="Logo Océan du Nord"
//               width={150} // Largeur approximative (pour le ratio)
//               height={50} // Hauteur approximative
//               className="h-10 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
//               priority // Charge l'image en priorité (LCP)
//             />
//           </Link>

//           {/* MENU DESKTOP (Caché sur mobile) */}
//           <nav className="hidden lg:flex space-x-6 items-center">
//             {/* Océan du nord */}
//             <div className="relative group">
//               <button className="text-gray-700 group-hover:text-primary font-medium transition-colors flex items-center gap-1 py-4 text-sm">
//                 Océan du nord{" "}
//                 <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
//               </button>
//               <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
//                 <Link
//                   href="/ocean-du-nord/agences"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Nos agences
//                 </Link>
//                 <Link
//                   href="/ocean-du-nord/tarifs"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Grille tarifaire
//                 </Link>
//                 <Link
//                   href="/ocean-du-nord/multimedia"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Yebana Multimédia
//                 </Link>
//               </div>
//             </div>

//             {/* Services */}
//             <div className="relative group">
//               <button className="text-gray-700 group-hover:text-primary font-medium transition-colors flex items-center gap-1 py-4 text-sm">
//                 Services{" "}
//                 <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
//               </button>
//               <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
//                 <Link
//                   href="/services/courrier"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Courrier Express
//                 </Link>
//                 <Link
//                   href="/services/fret"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Service Fret
//                 </Link>
//                 <Link
//                   href="/services/location"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
//                 >
//                   Location de Bus
//                 </Link>
//               </div>
//             </div>

//             <Link
//               href="/actualites"
//               className="text-gray-700 hover:text-primary font-medium text-sm"
//             >
//               Actualités
//             </Link>
//             <Link
//               href="/onc"
//               className="text-gray-700 hover:text-primary font-medium text-sm"
//             >
//               ONC
//             </Link>
//             <Link
//               href="/contact"
//               className="text-gray-700 hover:text-primary font-medium text-sm"
//             >
//               Nous contacter
//             </Link>

//             <Link
//               href="/oceane"
//               className="flex items-center gap-2 text-secondary font-bold bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary hover:text-white transition-colors text-xs"
//             >
//               <Bot className="w-4 h-4" /> Océane
//             </Link>
//           </nav>

//           {/* ACTIONS BOUTONS DESKTOP */}
//           <div className="hidden lg:flex items-center space-x-3">
//             {user ? (
//               <div className="flex items-center gap-2">
//                 <Link
//                   href={isAdmin ? "/admin" : "/profile"}
//                   className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
//                     isAdmin
//                       ? "bg-secondary text-white shadow-lg shadow-amber-200"
//                       : "bg-gray-50 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {isAdmin ? (
//                     <ShieldCheck className="w-4 h-4" />
//                   ) : (
//                     <User className="w-4 h-4 text-primary" />
//                   )}
//                   <span>{user.name?.split(" ")[0]}</span>
//                 </Link>
//                 <button
//                   onClick={() => signOut()}
//                   className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors text-sm"
//               >
//                 Connexion
//               </Link>
//             )}
//             <Link
//               href="/booking"
//               className="bg-primary hover:bg-emerald-900 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95 text-sm"
//             >
//               Réserver
//             </Link>
//           </div>

//           {/* BURGER MENU BUTTON (MOBILE) */}
//           <div className="lg:hidden flex items-center gap-4">
//             {!user && (
//               <Link href="/login" className="p-2 text-primary">
//                 <User className="w-6 h-6" />
//               </Link>
//             )}
//             <button
//               onClick={toggleMenu}
//               className="text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
//             >
//               {isOpen ? (
//                 <X className="w-8 h-8" />
//               ) : (
//                 <Menu className="w-8 h-8" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE MENU OVERLAY */}
//       <div
//         className={`lg:hidden fixed inset-x-0 bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 ease-in-out z-40 overflow-y-auto max-h-[calc(100vh-80px)] ${
//           isOpen ? "top-20 opacity-100" : "-top-full opacity-0 invisible"
//         }`}
//       >
//         <div className="p-6 space-y-6">
//           {/* User Section Mobile */}
//           {user && (
//             <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold uppercase">
//                   {user.name?.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="font-black text-gray-900 leading-none">
//                     {user.name}
//                   </p>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
//                     {isAdmin ? "Administrateur" : "Client"}
//                   </p>
//                 </div>
//               </div>
//               <Link
//                 href={isAdmin ? "/admin" : "/profile"}
//                 onClick={toggleMenu}
//                 className="p-2 bg-white rounded-lg shadow-sm border border-gray-100"
//               >
//                 <ChevronDown className="w-5 h-5 -rotate-90 text-gray-400" />
//               </Link>
//             </div>
//           )}

//           {/* Links List */}
//           <nav className="space-y-1">
//             <Link
//               href="/"
//               onClick={toggleMenu}
//               className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               Accueil
//             </Link>
//             <Link
//               href="/booking"
//               onClick={toggleMenu}
//               className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               Destinations
//             </Link>

//             {/* Océan du nord (Accordion) */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu("odn")}
//                 className="w-full flex items-center justify-between p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//               >
//                 Océan du Nord{" "}
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     openSubmenu === "odn" ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//               {openSubmenu === "odn" && (
//                 <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
//                   <Link
//                     href="/ocean-du-nord/agences"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Nos agences
//                   </Link>
//                   <Link
//                     href="/ocean-du-nord/tarifs"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Grille tarifaire
//                   </Link>
//                   <Link
//                     href="/ocean-du-nord/multimedia"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Yebana Multimédia
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Services (Accordion) */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu("services")}
//                 className="w-full flex items-center justify-between p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//               >
//                 Services{" "}
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     openSubmenu === "services" ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//               {openSubmenu === "services" && (
//                 <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-1">
//                   <Link
//                     href="/services/courrier"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Courrier Express
//                   </Link>
//                   <Link
//                     href="/services/fret"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Service Fret
//                   </Link>
//                   <Link
//                     href="/services/location"
//                     onClick={toggleMenu}
//                     className="block p-2 text-sm text-gray-600 font-medium"
//                   >
//                     Location de Bus
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link
//               href="/actualites"
//               onClick={toggleMenu}
//               className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               Actualités
//             </Link>
//             <Link
//               href="/onc"
//               onClick={toggleMenu}
//               className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               ONC
//             </Link>
//             <Link
//               href="/contact"
//               onClick={toggleMenu}
//               className="flex items-center gap-3 p-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               Contact
//             </Link>
//           </nav>

//           <div className="pt-4 space-y-3">
//             <Link
//               href="/oceane"
//               onClick={toggleMenu}
//               className="w-full flex items-center justify-center gap-2 p-4 bg-secondary/10 text-secondary font-black rounded-2xl transition-all"
//             >
//               <Bot className="w-5 h-5" /> Parler à Océane
//             </Link>

//             {user ? (
//               <button
//                 onClick={() => signOut()}
//                 className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 font-black rounded-2xl transition-all border border-red-100"
//               >
//                 <LogOut className="w-5 h-5" /> Déconnexion
//               </button>
//             ) : (
//               <Link
//                 href="/login"
//                 onClick={toggleMenu}
//                 className="w-full flex items-center justify-center gap-2 p-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
//               >
//                 Se connecter
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
