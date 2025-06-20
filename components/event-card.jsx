"use client";

import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Link, Trash2, Clock, Users, Eye, EyeOff, ExternalLink, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventCard({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window?.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      await fnDeleteEvent(event.id);
      router.refresh();
    }
  };

  const handleCardClick = (e) => {
    // Evitar navegación si se hace clic en botones o elementos interactivos
    if (
      e.target.closest('button') || 
      e.target.closest('[role="button"]') ||
      e.target.tagName === "SVG" ||
      e.target.tagName === "BUTTON"
    ) {
      return;
    }
    
    window?.open(
      `${window?.location.origin}/${username}/${event.id}`,
      "_blank"
    );
  };

  // Función para obtener la descripción truncada
  const getTruncatedDescription = (description) => {
    if (!description) return "";
    const firstSentence = description.split('.')[0];
    if (firstSentence.length > 120) {
      return firstSentence.substring(0, 120) + "...";
    }
    return firstSentence + ".";
  };

  return (
    <Card
      className="group flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 shadow-sm bg-white overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Header con gradiente sutil */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <CardHeader className="p-0">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
            {event.title}
          </CardTitle>
          
          {/* Badges informativos */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
              <Clock className="w-3 h-3" />
              <span>{event.duration} min</span>
            </div>
            
            <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
              event.isPrivate 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {event.isPrivate ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{event.isPrivate ? "Privado" : "Público"}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium">
              <Users className="w-3 h-3" />
              <span>{event._count.bookings} reserva{event._count.bookings !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardHeader>
      </div>

      {/* Contenido */}
      <CardContent className="p-6 flex-1">
        <p className="text-gray-600 text-sm leading-relaxed">
          {getTruncatedDescription(event.description)}
        </p>
        
        {/* Indicador visual de que es clickeable */}
        <div className="flex items-center gap-1 mt-4 text-xs text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
          <ExternalLink className="w-3 h-3" />
          <span>Clic para ver detalles</span>
        </div>
      </CardContent>

      {/* Footer con acciones */}
      {!isPublic && (
        <CardFooter className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">¡Copiado!</span>
                  <span className="sm:hidden">¡Listo!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copiar Enlace</span>
                  <span className="sm:hidden">Copiar</span>
                </>
              )}
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Eliminando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Eliminar</span>
                  <span className="sm:hidden">Del</span>
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}