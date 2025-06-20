"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { updateAvailability } from "@/actions/availability";
import { availabilitySchema } from "@/app/lib/validators";
import { timeSlots } from "../data";
import useFetch from "@/hooks/use-fetch";

const dayTranslations = {
  monday: "Lunes",
  tuesday: "Martes", 
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo"
};

export default function AvailabilityForm({ initialData }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    loading,
    error,
    fn: fnupdateAvailability,
  } = useFetch(updateAvailability);

  const onSubmit = async (data) => {
    await fnupdateAvailability(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Configurar Disponibilidad
          </h2>
          <p className="text-gray-600">
            Establece tus horarios de disponibilidad para cada día de la semana
          </p>
        </div>

        {/* Days Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Días de la Semana
          </h3>
          
          {[
            "monday",
            "tuesday", 
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].map((day) => {
            const isAvailable = watch(`${day}.isAvailable`);

            return (
              <div 
                key={day} 
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Controller
                        name={`${day}.isAvailable`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={`${day}-checkbox`}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              setValue(`${day}.isAvailable`, checked);
                              if (!checked) {
                                setValue(`${day}.startTime`, "09:00");
                                setValue(`${day}.endTime`, "17:00");
                              }
                            }}
                          />
                        )}
                      />
                      <label 
                        htmlFor={`${day}-checkbox`}
                        className="text-lg font-medium text-gray-800"
                      >
                        {dayTranslations[day]}
                      </label>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  
                  {isAvailable && (
                    <div className="space-y-3 pl-7">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Hora de inicio
                        </label>
                        <Controller
                          name={`${day}.startTime`}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar hora" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Hora de fin
                        </label>
                        <Controller
                          name={`${day}.endTime`}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar hora" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors[day]?.endTime && (
                          <span className="text-red-500 text-sm">
                            {errors[day].endTime.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Controller
                    name={`${day}.isAvailable`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`${day}-checkbox-desktop`}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          setValue(`${day}.isAvailable`, checked);
                          if (!checked) {
                            setValue(`${day}.startTime`, "09:00");
                            setValue(`${day}.endTime`, "17:00");
                          }
                        }}
                      />
                    )}
                  />
                  
                  <label 
                    htmlFor={`${day}-checkbox-desktop`}
                    className="w-28 text-base font-medium text-gray-800 cursor-pointer"
                  >
                    {dayTranslations[day]}
                  </label>
                  
                  {isAvailable ? (
                    <div className="flex items-center space-x-3 flex-1">
                      <Controller
                        name={`${day}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Inicio" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      
                      <span className="text-gray-500 font-medium">a</span>
                      
                      <Controller
                        name={`${day}.endTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Fin" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      
                      {errors[day]?.endTime && (
                        <span className="text-red-500 text-sm ml-2">
                          {errors[day].endTime.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="text-gray-400 text-sm">
                        No disponible este día
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Gap Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Configuración Adicional
          </h3>
          
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <label className="block sm:inline text-sm font-medium text-gray-700 sm:w-64">
              Tiempo mínimo antes de la reserva (minutos):
            </label>

            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                step="5"
                placeholder="15"
                {...register("timeGap", {
                  valueAsNumber: true,
                })}
                className="w-24 sm:w-32"
              />
              <span className="text-sm text-gray-500">min</span>
            </div>
          </div>

          {errors.timeGap && (
            <div className="mt-2">
              <span className="text-red-500 text-sm">
                {errors.timeGap.message}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al actualizar
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  {error?.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Actualizando...</span>
              </div>
            ) : (
              "Actualizar Disponibilidad"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}