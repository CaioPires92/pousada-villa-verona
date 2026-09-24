import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Daniel Atensia",
      initial: "D",
      text: "Minha experiência foi incrível. Tudo impecável! Café da manhã, localização, vista, instalações, limpeza, tudo maravilho. Indico!!!...",
      photos: [
        "/fotos/piscina-aptos/DJI_0845.jpg", 
        "/fotos/ala-principal/apartamentos/superior/DSC_0069-1200.webp", 
        "/fotos/piscina-aptos/DJI_0863.jpg", 
        "/fotos/restaurante/DSC_0056.jpg"
      ],
      extraPhotos: 0
    },
    {
      name: "Scheila Melo",
      initial: "S",
      text: "Experiência incrível! Tudo perfeito! Um lugar para carregar a bateria. Saímos de lá abastecidos. Já quero voltar. Vocês estão de parabéns!",
      photos: [
        "/fotos/ala-chales/chales/IMG_0125-1200.webp", 
        "/fotos/restaurante/IMG_0025.webp", 
        "/fotos/jardim-aptos/DJI_0904.jpg", 
        "/fotos/jardim-aptos/DSC_0267.jpg"
      ],
      extraPhotos: 2
    },
    {
      name: "Rodrigo Proni",
      initial: "R",
      text: "Vivemos dias Incríveis nesse lugar!!!\n\n A Recepção da Luciana foi excepcional....",
      photos: [
        "/fotos/bar-principal/porcoes/DSC_0279.jpg", 
        "/fotos/bar-principal/porcoes/IMG_6983.jpg", 
        "/fotos/piscina-chale/DJI_0916.jpg", 
        "/fotos/piscina-chale/DSC_0370.jpg"
      ],
      extraPhotos: 6
    },
    {
      name: "Danilo Viana dos santos",
      initial: "D",
      text: "Um lugar perfeito e romântico , olhando pelas fotos do site parece até ser de mentira , mas é real e muito melhor !!! Eu garanto , um luxo...",
      photos: [
        "/fotos/churrasqueira-aptos/DJI_0902.jpg", 
        "/fotos/churrasqueira-aptos/DSC_0273.jpg", 
        "/fotos/Sala de jogos/DSC_0333.jpg", 
        "/fotos/Sala de jogos/DSC_0334.jpg"
      ],
      extraPhotos: 2
    }
  ];

  return (
    <section className="bg-[#FAF9F6] py-24 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-14">
        <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Relatos da estadia</p>
        <h2 className="font-serif text-4xl md:text-5xl text-brand-brown-dark">O que dizem nossos hóspedes</h2>
        <div className="w-12 h-px bg-brand-gold mx-auto mt-8"></div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-10 px-4 md:px-12 xl:justify-center snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-7 min-w-[340px] max-w-[340px] shrink-0 snap-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-primary/5 flex flex-col">
             {/* Header */}
             <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#EBE9E4] text-brand-brown-dark flex items-center justify-center font-serif text-xl">{t.initial}</div>
                <span className="font-serif text-lg text-brand-brown-dark">{t.name}</span>
             </div>
             
             {/* Stars */}
             <div className="flex gap-1 mb-5">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
               ))}
             </div>
             
             {/* Text */}
             <p className="text-brand-brown-dark/80 text-[0.95rem] leading-relaxed font-light flex-grow whitespace-pre-wrap">
               {t.text}
             </p>
             <button className="text-brand-gold text-[0.65rem] font-semibold tracking-[0.3em] uppercase mt-4 text-left mb-6 hover:text-brand-brown-dark transition-colors">VER MAIS</button>
             
             {/* Photos Grid */}
             <div className="grid grid-cols-2 gap-2 mt-auto">
                {t.photos.map((photo, pIdx) => (
                  <div key={pIdx} className="relative aspect-square rounded-2xl overflow-hidden">
                    <Image src={photo} alt={`Foto do hóspede ${t.name}`} fill className="object-cover" sizes="150px" />
                    {pIdx === 3 && t.extraPhotos > 0 && (
                      <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/75 transition-colors">
                         <span className="font-semibold text-lg">+{t.extraPhotos}</span>
                         <span className="text-[0.55rem] font-bold tracking-[0.15em] uppercase mt-1">VER MAIS</span>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
