"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    title: "Gestão completa",
    subtitle: "Pacientes, agendamentos e prontuários em um só lugar",
    image:
      "https://images.unsplash.com/photo-1580281658628-7b1a3d83b6f8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Agenda inteligente",
    subtitle: "Organize consultas e reduza faltas",
    image:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Relatórios claros",
    subtitle: "Indicadores para decisões estratégicas",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="m-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="relative h-[260px] sm:h-[320px] lg:h-[480px] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* texto */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                  <div className="glass p-6 sm:p-8 rounded-2xl w-fit max-w-2xl backdrop-blur-lg bg-black/30 border-white/10">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                      {slide.title}
                    </h3>
                    <p className="mt-3 text-lg text-white/90 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* SETAS corretamente posicionadas */}
        <CarouselPrevious className="left-4 h-10 w-10 bg-background/80 backdrop-blur hover:bg-background" />
        <CarouselNext className="right-4 h-10 w-10 bg-background/80 backdrop-blur hover:bg-background" />
      </Carousel>
    </div>
  );
}
