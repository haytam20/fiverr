"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/actions/bookings";
import { bookingSchema } from "@/app/lib/validators";
import "react-day-picker/style.css";
import useFetch from "@/hooks/use-fetch";
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, ExternalLink, AlertCircle } from "lucide-react";

export default function BookingForm({ event, availability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

  const onSubmit = async (data) => {
    console.log("Formulario enviado con datos:", data);

    if (!selectedDate || !selectedTime) {
      console.error("Fecha u hora no seleccionada");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  // Componente de éxito
  if (data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">¡Reserva Exitosa!</h2>
          </div>
          
          <div className="p-6 text-center space-y-4">
            <p className="text-gray-600">
              Tu cita ha sido programada exitosamente. Recibirás un email de confirmación en breve.
            </p>
            
            {data.meetLink && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-700 mb-3">Enlace de la reunión:</p>
                <a
                  href={data.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Unirse a la reunión
                </a>
              </div>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              className="w-full mt-6 bg-green-600 hover:bg-green-700"
            >
              Programar otra cita
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6" />
              <h1 className="text-xl sm:text-2xl font-bold">Programar Cita</h1>
            </div>
            <p className="text-blue-100 text-sm sm:text-base">
              Selecciona una fecha y hora que funcione mejor para ti
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Paso 1: Selección de fecha y hora */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Calendario */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Seleccionar Fecha</h3>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 overflow-hidden">
                  <style jsx>{`
                    .rdp {
                      margin: 0;
                    }
                    .rdp-day_available {
                      background-color: #dbeafe !important;
                      border-radius: 8px !important;
                      font-weight: 500;
                    }
                    .rdp-day_available:hover {
                      background-color: #3b82f6 !important;
                      color: white !important;
                    }
                    .rdp-day_selected {
                      background-color: #3b82f6 !important;
                      color: white !important;
                    }
                  `}</style>
                  
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    disabled={[{ before: new Date() }]}
                    modifiers={{ available: availableDays }}
                    modifiersStyles={{
                      available: {
                        background: "#dbeafe",
                        borderRadius: "8px",
                        fontWeight: "500",
                      },
                    }}
                    locale={es}
                    className="w-full"
                  />
                </div>
                
                {selectedDate && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Fecha seleccionada: {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                )}
              </div>

              {/* Horarios disponibles */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Horarios Disponibles</h3>
                </div>
                
                {!selectedDate ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Primero selecciona una fecha para ver los horarios disponibles</p>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="bg-orange-50 rounded-xl p-8 text-center border border-orange-200">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <p className="text-orange-700 font-medium">No hay horarios disponibles</p>
                    <p className="text-orange-600 text-sm mt-1">Por favor selecciona otra fecha</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot)}
                          className={`h-12 transition-all duration-200 ${
                            selectedTime === slot
                              ? "bg-blue-600 hover:bg-blue-700 text-white scale-105 shadow-md"
                              : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          }`}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      Hora seleccionada: {selectedTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Paso 2: Formulario de información */}
            {selectedTime && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 inline mr-2" />
                        Nombre Completo *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Ingresa tu nombre completo"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Correo Electrónico *
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="tu@email.com"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Información Adicional (Opcional)
                    </label>
                    <Textarea
                      {...register("additionalInfo")}
                      placeholder="Comparte cualquier detalle relevante para la reunión..."
                      className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Resumen de la cita */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Resumen de tu cita:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTime} ({event.duration} minutos)</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de envío */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Programando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirmar Cita</span>
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}