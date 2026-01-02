"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  Smile,
  ChevronDown,
  Loader2,
  Phone,
  Sparkles,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Mbote ! 👋 Je suis Océane, ton assistante virtuelle. Comment puis-je t'aider aujourd'hui ?",
      sender: "bot",
      time: "Maintenant",
    },
  ]);

  // Suggestions rapides
  const quickReplies = [
    { icon: "🎫", text: "Voir les tarifs", query: "Quels sont vos tarifs ?" },
    {
      icon: "📍",
      text: "Destinations",
      query: "Quelles sont vos destinations ?",
    },
    {
      icon: "🚌",
      text: "Comment réserver ?",
      query: "Comment faire une réservation ?",
    },
  ];

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      text: text,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    // Délai réaliste de "réflexion"
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setIsTyping(false);

      // Effet de frappe progressive
      await new Promise((resolve) => setTimeout(resolve, 300));

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.text,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Erreur Chat:", error);
      setIsTyping(false);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Désolée, j'ai un petit souci technique 🛠️. Peux-tu réessayer ?",
        sender: "bot",
        time: "Maintenant",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-in forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-scale-out {
          animation: scaleOut 0.3s ease-in forwards;
        }

        .animate-bounce-gentle {
          animation: bounce 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .typing-indicator span {
          animation: pulse 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .gradient-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .message-enter {
          animation: slideUp 0.3s ease-out;
        }

        .hover-lift {
          transition: all 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
        {/* BULLE DE NOTIFICATION */}
        {!isOpen && hasNotification && (
          <div className="animate-slide-up">
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 max-w-xs relative hover-lift">
              <button
                onClick={() => setHasNotification(false)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Fermer la notification"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 animate-bounce-gentle">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-800 text-sm font-medium mb-1">
                    👋 Mbote ! Je suis Océane
                  </p>
                  <p className="text-gray-600 text-xs">
                    Besoin d&apos;aide pour réserver ton voyage ? 🚌
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FENÊTRE DE CHAT */}
        {isOpen && (
          <div className="animate-scale-in">
            <div className="bg-white w-[380px] h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header avec gradient */}
              <div className="bg-gradient-to-r from-[#00a651] to-[#008c44] p-5 relative overflow-hidden">
                <div className="gradient-shimmer absolute inset-0 opacity-20"></div>
                <div className="relative flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-white/20 p-2 rounded-full transition-all"
                      aria-label="Réduire le chat"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg">
                          <Image
                            src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg"
                            alt="Océane"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse-slow"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Océane</h3>
                        <p className="text-xs text-white/90 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          En ligne • Répond en ~30s
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    href="tel:+242060000000"
                    className="hover:bg-white/20 p-2 rounded-full transition-all"
                    aria-label="Appeler"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Corps du chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <p className="text-center text-xs text-gray-400 my-2">
                  Aujourd&apos;hui • {new Date().toLocaleDateString("fr-FR")}
                </p>

                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 message-enter ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <Image
                          src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg"
                          alt="O"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`p-4 rounded-2xl text-sm shadow-md transition-all hover:shadow-lg ${
                          msg.sender === "user"
                            ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span
                        className={`text-[10px] text-gray-400 mt-1 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                  <div className="flex justify-start gap-2 animate-slide-up">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg"
                        alt="O"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                      <div className="typing-indicator flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions rapides (uniquement au début) */}
                {messages.length === 1 && !isLoading && (
                  <div className="flex flex-col gap-2 pt-2 animate-slide-up">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Suggestions :
                    </p>
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(reply.query)}
                        className="bg-white border-2 border-gray-200 hover:border-[#00a651] hover:bg-green-50 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 hover-lift"
                        style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                      >
                        <span className="text-lg">{reply.icon}</span>
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="bg-white p-4 border-t border-gray-200 shadow-lg">
                <div className="relative flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Ajouter une pièce jointe"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    disabled={isLoading}
                    type="text"
                    placeholder={
                      isLoading ? "Océane réfléchit..." : "Écris ton message..."
                    }
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-full border-2 border-transparent focus:border-[#00a651] focus:bg-white outline-none text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="p-3 bg-gradient-to-br from-[#00a651] to-[#008c44] text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    aria-label="Envoyer le message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Propulsé par Océan du Nord Tech
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BOUTON FLOTTANT PRINCIPAL */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNotification(false);
          }}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-br from-[#00a651] to-[#008c44] text-white hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          {isOpen ? (
            <ChevronDown className="w-8 h-8 transition-transform group-hover:rotate-180 duration-300" />
          ) : (
            <>
              <MessageSquare className="w-8 h-8 fill-current animate-bounce-gentle" />
              {hasNotification && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                  1
                </div>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
}

// //
// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import {
//   MessageSquare,
//   X,
//   Send,
//   Paperclip,
//   Smile,
//   ChevronDown,
//   ThumbsUp,
//   Loader2,
// } from "lucide-react";

// interface Message {
//   id: number;
//   text: string;
//   sender: "user" | "bot";
//   time: string;
// }

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hasNotification, setHasNotification] = useState(true);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false); // État suggéré par Claude
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Slt! Je suis Océane! L'assistante virtuelle d'Océan du nord. Comment puis-je vous aider ?",
//       sender: "bot",
//       time: "Maintenant",
//     },
//   ]);

//   // FIX : Le tableau de dépendances [messages, isOpen] reste constant en taille
//   useEffect(() => {
//     if (isOpen && messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, isOpen]);

//   const handleSendMessage = async (text: string = inputValue) => {
//     // On empêche l'envoi si c'est vide ou si une réponse est déjà en cours
//     if (!text.trim() || isLoading) return;

//     const userMsg: Message = {
//       id: Date.now(),
//       text: text,
//       sender: "user",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInputValue("");
//     setIsLoading(true); // On lance le chargement

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: text }),
//       });

//       const data = await response.json();

//       const botMsg: Message = {
//         id: Date.now() + 1,
//         text: data.text,
//         sender: "bot",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (error) {
//       console.error("Erreur Chat:", error);
//       const errorMsg: Message = {
//         id: Date.now() + 1,
//         text: "Désolée, j'ai un petit souci technique. Peux-tu réessayer ?",
//         sender: "bot",
//         time: "Maintenant",
//       };
//       setMessages((prev) => [...prev, errorMsg]);
//     } finally {
//       setIsLoading(false); // On arrête le chargement quoi qu'il arrive
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
//       {/* BULLE NOTIFICATION */}
//       {!isOpen && hasNotification && (
//         <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-fade-in-up mb-2 relative">
//           <button
//             onClick={() => setHasNotification(false)}
//             className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1"
//           >
//             <X className="w-3 h-3 text-gray-500" />
//           </button>
//           <p className="text-gray-800 text-sm">👋 Slt! Je suis Océane!</p>
//         </div>
//       )}

//       {/* FENÊTRE DE CHAT */}
//       {isOpen && (
//         <div className="bg-gray-100 w-[350px] h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in origin-bottom-right">
//           {/* Header */}
//           <div className="bg-[#00a651] p-4 flex items-center justify-between text-white">
//             <div className="flex items-center gap-3">
//               <button onClick={() => setIsOpen(false)}>
//                 <ChevronDown className="w-6 h-6" />
//               </button>
//               <div>
//                 <h3 className="font-bold text-lg">Support Océane</h3>
//                 <p className="text-xs text-white/80">En ligne</p>
//               </div>
//             </div>
//           </div>

//           {/* Corps du chat */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {msg.sender === "bot" && (
//                   <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white flex-shrink-0">
//                     <Image
//                       src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg"
//                       alt="O"
//                       width={32}
//                       height={32}
//                     />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
//                     msg.sender === "user"
//                       ? "bg-gray-200 text-gray-800"
//                       : "bg-[#00a651] text-white"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}

//             {/* ANIMATION : OCÉANE RÉFLÉCHIT */}
//             {isLoading && (
//               <div className="flex justify-start items-center gap-2 animate-pulse">
//                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
//                   <Loader2 className="w-4 h-4 text-[#00a651] animate-spin" />
//                 </div>
//                 <div className="bg-white px-3 py-2 rounded-xl text-xs text-gray-400">
//                   Océane réfléchit...
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Zone de saisie */}
//           <div className="bg-white p-3 border-t border-gray-200">
//             <div className="relative flex items-center">
//               <input
//                 disabled={isLoading}
//                 type="text"
//                 placeholder={
//                   isLoading ? "Veuillez patienter..." : "Écrire ici..."
//                 }
//                 className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-full border border-gray-200 outline-none text-sm disabled:opacity-50"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               />
//               <button
//                 onClick={() => handleSendMessage()}
//                 disabled={isLoading || !inputValue.trim()}
//                 className="absolute right-2 p-2 text-[#00a651] disabled:text-gray-300"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BOUTON TOGGLE */}
//       <button
//         onClick={() => {
//           setIsOpen(!isOpen);
//           setHasNotification(false);
//         }}
//         className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-[#00a651] text-white"
//       >
//         {isOpen ? (
//           <ChevronDown className="w-8 h-8" />
//         ) : (
//           <MessageSquare className="w-8 h-8 fill-current" />
//         )}
//       </button>
//     </div>
//   );
// }
