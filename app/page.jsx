import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import TestimonialsCarousel from "@/components/testimonials";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "Crear Eventos",
    description: "Configura y personaliza fácilmente tus tipos de eventos",
  },
  {
    icon: Clock,
    title: "Gestionar Disponibilidad",
    description: "Define tu disponibilidad para optimizar la programación",
  },
  {
    icon: LinkIcon,
    title: "Enlaces Personalizados",
    description: "Comparte tu enlace de programación personalizado",
  },
];

const howItWorks = [
  { step: "Regístrate", description: "Crea tu cuenta gratuita de Schedulrr" },
  {
    step: "Establece Disponibilidad",
    description: "Define cuándo estás disponible para reuniones",
  },
  {
    step: "Comparte tu Enlace",
    description: "Envía tu enlace de programación a clientes o colegas",
  },
  {
    step: "Recibe Reservas",
    description: "Obtén confirmaciones automáticas para nuevas citas",
  },
];

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-16 md:mb-24">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold gradient-title pb-4 md:pb-6 leading-tight">
            Simplifica tu Programación
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto lg:mx-0">
            Schedulrr te ayuda a gestionar tu tiempo de manera efectiva. Crea eventos, 
            establece tu disponibilidad y permite que otros reserven tiempo contigo sin problemas.
          </p>
          <Link href={"/dashboard"}>
            <Button size="lg" className="text-base md:text-lg w-full sm:w-auto">
              Comenzar <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <div className="relative w-full max-w-sm md:max-w-md aspect-square">
            <Image
              src="/poster.png"
              alt="Ilustración de programación"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-600">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-blue-500 mb-3 md:mb-4 mx-auto" />
                <CardTitle className="text-center text-blue-600 text-lg md:text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-600">
          Lo que Dicen Nuestros Usuarios
        </h2>
        <TestimonialsCarousel />
      </div>

      {/* How It Works Section */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-blue-600">
          Cómo Funciona
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-100 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-blue-600 font-bold text-lg md:text-xl">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800">
                {step.step}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 md:p-8 text-center shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
          ¿Listo para Simplificar tu Programación?
        </h2>
        <p className="text-lg md:text-xl mb-5 md:mb-6 opacity-90 max-w-3xl mx-auto">
          Únete a miles de profesionales que confían en Schedulrr para una 
          gestión eficiente del tiempo.
        </p>
        <Link href={"/dashboard"}>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto text-base md:text-lg"
          >
            Comenzar Gratis <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default Home;