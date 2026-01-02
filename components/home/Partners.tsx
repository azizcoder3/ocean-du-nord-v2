import { Handshake } from "lucide-react";

export default function Partners() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Petite icône décorative */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-400 mb-6">
          <Handshake className="w-6 h-6" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Nos Partenaires
        </h2>

        <p className="text-lg md:text-xl text-gray-600 font-light italic leading-relaxed max-w-3xl mx-auto">
          &quot;Des partenaires engagés pour révolutionner le transport et vous
          offrir des solutions fiables, innovantes et performantes.&quot;
        </p>

        {/* Placeholder visuel pour montrer que c'est une section partenaires (Optionnel) */}
        <div className="mt-10 flex justify-center gap-4 opacity-30 grayscale">
          {/* On simule des logos grisés pour l'habillage */}
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse hidden sm:block"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse hidden md:block"></div>
        </div>
      </div>
    </section>
  );
}
