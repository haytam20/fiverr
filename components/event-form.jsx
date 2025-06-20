import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventSchema } from "@/app/lib/validators";
import { createEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

const EventForm = ({ onSubmitForm, initialData = {} }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      duration: initialData.duration || 30,
      isPrivate: initialData.isPrivate ?? true,
    },
  });

  const { loading, error, fn: fnCreateEvent } = useFetch(createEvent);

  const onSubmit = async (data) => {
    await fnCreateEvent(data);
    if (!loading && !error) onSubmitForm();
    router.refresh(); // Refresh the page to show updated data
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className="px-4 sm:px-6 py-4 flex flex-col gap-4 sm:gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Event Title Field */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Título del Evento
          </label>
          <Input 
            id="title" 
            {...register("title")} 
            className="w-full transition-colors focus:ring-2 focus:ring-blue-500" 
            placeholder="Ingresa el título del evento"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descripción
          </label>
          <Textarea
            {...register("description")}
            id="description"
            className="w-full min-h-[100px] resize-y transition-colors focus:ring-2 focus:ring-blue-500"
            placeholder="Describe tu evento (opcional)"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Duration Field */}
        <div className="space-y-2">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Duración (minutos)
          </label>
          <Input
            id="duration"
            {...register("duration", {
              valueAsNumber: true,
            })}
            type="number"
            min="5"
            max="240"
            step="5"
            className="w-full transition-colors focus:ring-2 focus:ring-blue-500"
            placeholder="30"
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.duration.message}
            </p>
          )}
        </div>

        {/* Privacy Field */}
        <div className="space-y-2">
          <label
            htmlFor="isPrivate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Privacidad del Evento
          </label>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
              >
                <SelectTrigger className="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Selecciona la privacidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Privado
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Público
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Los eventos privados solo son visibles para ti, los públicos pueden ser reservados por cualquiera con el enlace.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm flex items-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {error.message || "Ocurrió un error al crear el evento"}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto sm:min-w-[150px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </div>
            ) : (
              "Crear Evento"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;