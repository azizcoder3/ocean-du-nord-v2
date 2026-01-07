import Image from "next/image"; // <--- C'est cette ligne qui manquait !
import { ShieldCheck, Wifi, Armchair, Coffee } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Sécurité Maximale",
    desc: "Nos bus sont suivis par GPS et nos chauffeurs sont formés aux meilleurs standards de conduite.",
  },
  {
    icon: Armchair,
    title: "Confort Premium",
    desc: "Sièges inclinables spacieux, climatisation optimale et espace pour vos jambes.",
  },
  {
    icon: Wifi,
    title: "WiFi à bord",
    desc: "Restez connectés tout au long du trajet grâce à notre connexion internet haut débit.",
  },
  {
    icon: Coffee,
    title: "Snacks & Boissons",
    desc: "Profitez d'une sélection de rafraîchissements servis durant votre voyage.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Partie Gauche : Texte */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir <br />
              <span className="text-primary">Océan du Nord ?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nous redéfinissons le transport interurbain au Congo. Plus
              qu&apos;un simple trajet, nous vous offrons une expérience de
              voyage sûre, agréable et moderne.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partie Droite : Image/Vidéo */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/bus-03.webp"
              alt="Confort Océan du Nord"
              fill
              className="object-cover"
            />
            {/* Overlay dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="font-bold text-lg">Le transport N°1 au Congo</p>
                <p className="text-sm text-gray-300">
                  Élu meilleur service client 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
