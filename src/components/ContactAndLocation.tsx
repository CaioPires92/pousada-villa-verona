import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactAndLocation({ hotelConfig }: { hotelConfig?: any }) {
  const [activeTab, setActiveTab] = useState<'contato' | 'reserva'>('contato');

  return (
    <section className="bg-[color:var(--brand-cream)] pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8 max-w-[82rem]">
        
        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-brown-dark leading-tight mb-4 tracking-tight">
              Entre em contato com a <br className="hidden md:block" />
              {hotelConfig?.name?.toUpperCase() || 'POUSADA'}
            </h2>
            <p className="text-foreground/70 mb-8 max-w-md leading-relaxed">
              Estamos à disposição para esclarecer dúvidas ou organizar sua estadia com tranquilidade e atenção.
            </p>

            <div className="space-y-4 max-w-md">
              {/* WhatsApp Card */}
              <a href="{hotelConfig?.whatsappLink || 'https://wa.me/5519999040040'}" target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 rounded-2xl border border-brand-brown-dark/10 bg-white hover:border-brand-brown-dark/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full text-brand-brown-dark group-hover:bg-[#00E676]/10 group-hover:text-[#00E676] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-dark/60 mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-brand-brown-dark">{hotelConfig?.whatsapp || '(19) 99904-0040'}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-brown-dark/30 group-hover:text-brand-brown-dark transition-colors" />
              </a>

              {/* Email Card */}
              <a href="{`mailto:${hotelConfig?.email || 'reservas@pousadadelplata.com.br'}`}" className="flex items-center justify-between p-5 rounded-2xl border border-brand-brown-dark/10 bg-white hover:border-brand-brown-dark/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full text-brand-brown-dark group-hover:bg-brand-brown-dark/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown-dark/60 mb-0.5">Email</p>
                    <p className="font-semibold text-brand-brown-dark text-sm md:text-base">{hotelConfig?.email || 'reservas@pousadadelplata.com.br'}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-brown-dark/30 group-hover:text-brand-brown-dark transition-colors" />
              </a>

              {/* Attendance Card */}
              <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-brand-brown-dark text-white mt-6">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <MapPin className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 text-brand-gold">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Horário de Atendimento</span>
                  </div>
                  <p className="text-xl font-semibold mb-6">TODOS OS DIAS, 07H ÀS 22H</p>
                  
                  <div className="h-px w-full bg-white/10 mb-6"></div>
                  
                  <p className="text-sm text-white/80 mb-4 leading-relaxed max-w-[85%]">
                    {hotelConfig?.address || 'Localizados no interior de SP, prontos para oferecer o melhor de Serra Negra.'}
                  </p>
                  <a href="#mapa" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-gold transition-colors">
                    Ver no Google Maps <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-brown-dark/5">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-50 rounded-xl mb-8">
              <button 
                onClick={() => setActiveTab('contato')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'contato' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'}`}
              >
                <MessageCircle className="w-4 h-4" /> Contato
              </button>
              <button 
                onClick={() => setActiveTab('reserva')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'reserva' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'}`}
              >
                <Clock className="w-4 h-4" /> Reserva
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-brown-dark/70">Nome Completo</label>
                  <input type="text" placeholder="Ex: João Silva" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:outline-none focus:border-brand-brown-dark transition-colors placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-brown-dark/70">E-mail</label>
                  <input type="email" placeholder="joao@email.com" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:outline-none focus:border-brand-brown-dark transition-colors placeholder:text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-brown-dark/70">Telefone / WhatsApp</label>
                <input type="text" placeholder="(00) 00000-0000" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:outline-none focus:border-brand-brown-dark transition-colors placeholder:text-gray-400" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-brown-dark/70">Mensagem</label>
                <textarea rows={3} placeholder="Como podemos ajudar?" className="w-full border-b border-gray-200 py-3 bg-transparent text-sm focus:outline-none focus:border-brand-brown-dark transition-colors placeholder:text-gray-400 resize-none"></textarea>
              </div>

              <Button type="button" className="w-full h-14 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-white font-bold tracking-wide mt-4">
                ENVIAR MENSAGEM <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div id="mapa" className="relative w-full h-[500px] rounded-[32px] overflow-hidden border border-brand-brown-dark/10 shadow-sm">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117972.18128362391!2d-46.77259163012803!3d-22.620023608149814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c9215017006835%3A0x7d025b3064ec64fc!2sSerra%20Negra%2C%20State%20of%20S%C3%A3o%20Paulo!5e0!3m2!1sen!2sbr!4v1714488392013!5m2!1sen!2sbr" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Localização"
            className="filter saturate-75 contrast-100"
          ></iframe>

          {/* Floating Map Card */}
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-[color:var(--brand-cream)] p-6 rounded-2xl shadow-xl max-w-sm border border-brand-brown-dark/10">
            <h3 className="font-serif text-2xl text-brand-brown-dark mb-2">Visite-nos</h3>
            <p className="text-sm text-foreground/70 mb-6">Explore a tranquilidade da serra pessoalmente.</p>
            <div className="flex items-center gap-2 text-brand-gold">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Localização Privilegiada</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
