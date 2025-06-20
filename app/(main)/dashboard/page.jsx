"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Tarjeta de Bienvenida */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
              ¡Bienvenido{user?.firstName ? `, ${user.firstName}` : ""}!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!loadingUpdates ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Próximas Reuniones
                  </h3>
                  {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingMeetings?.map((meeting) => (
                        <div key={meeting.id} className="bg-white rounded-md p-3 border border-blue-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {meeting.event.title}
                              </p>
                              <p className="text-gray-600 text-xs sm:text-sm">
                                con {meeting.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-blue-600 font-medium text-xs sm:text-sm">
                                {format(
                                  new Date(meeting.startTime),
                                  "d MMM, yyyy",
                                  { locale: es }
                                )}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {format(
                                  new Date(meeting.startTime),
                                  "HH:mm"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No tienes reuniones programadas</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Cargando actualizaciones...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tarjeta de Enlace Único */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Tu Enlace Único
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  URL Personalizada
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 border border-gray-200 min-w-0 flex-shrink-0">
                    <span className="text-gray-600 text-sm truncate">
                      {typeof window !== 'undefined' ? window.location.origin : 'tu-dominio.com'}/
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Input 
                      {...register("username")} 
                      placeholder="nombre-usuario"
                      className="w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                {/* Errores */}
                {errors.username && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.username.message}</span>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error?.message}</span>
                  </div>
                )}

                {/* URL Preview */}
                {user?.username && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-800 font-medium mb-1">
                      Vista previa de tu enlace:
                    </p>
                    <p className="text-sm text-green-700 break-all">
                      {typeof window !== 'undefined' ? window.location.origin : 'tu-dominio.com'}/{user.username}
                    </p>
                  </div>
                )}
              </div>

              {/* Loading Bar */}
              {loading && (
                <div className="space-y-2">
                  <BarLoader className="w-full" color="#10b981" />
                  <p className="text-sm text-gray-600 text-center">Actualizando...</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Actualizar Nombre de Usuario</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}