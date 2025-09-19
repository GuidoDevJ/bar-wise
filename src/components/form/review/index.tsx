'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StartSimple from '../../../../public/start_complete.svg';
import StartComplete from '../../../../public/start_simple.svg';

interface IReview {
  startNumber: number;
  title: string;
  review: string;
  fullName: string;
  email: string;
}

const FormReview = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IReview>();

  const [rating, setRating] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  // Watch de los campos obligatorios
  const watchFields = watch([
    'title',
    'review',
    'fullName',
    'email',
    'startNumber',
  ]);

  useEffect(() => {
    // Check si todos los campos obligatorios tienen valor
    const allFilled = watchFields.every(
      (field) => field && field.toString().trim() !== ''
    );
    setCanSubmit(allFilled);
  }, [watchFields]);

  const onSubmit: SubmitHandler<IReview> = (data) => {
    console.log(data);
    alert(JSON.stringify(data));
    reset();
    setRating(0);
  };

  const handleRating = (value: number) => {
    setRating(value);
    setValue('startNumber', value, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset();
    setRating(0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[700px] w-[70%] h-full flex flex-col space-y-4 text-lg font-medium"
    >
      <label>Calificación</label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => handleRating(star)}
            className="w-8 h-8"
          >
            <Image
              src={star <= rating ? StartComplete : StartSimple}
              alt={star <= rating ? 'completa' : 'simple'}
              width={32}
              height={32}
            />
          </button>
        ))}
      </div>
      <input type="hidden" {...register('startNumber', { required: true })} />
      {errors.startNumber && (
        <p className="text-red-600">La valoración es obligatoria</p>
      )}

      <input
        {...register('title', { required: 'El título es obligatorio' })}
        className="w-full h-14 border rounded p-2"
        placeholder="Comida"
      />

      <textarea
        {...register('review', { required: 'La reseña es obligatoria' })}
        className="border rounded p-2"
        placeholder="Reseña:"
      />
      {errors.review && <p className="text-red-600">{errors.review.message}</p>}

      <input
        {...register('fullName', { required: 'El nombre es obligatorio' })}
        className="w-full h-14 border rounded p-2"
        placeholder="Nombre"
      />

      <input
        {...register('email', {
          required: 'El email es obligatorio',
          pattern: { value: /^\S+@\S+$/i, message: 'Email no válido' },
        })}
        className="w-full h-14 border rounded p-2"
        placeholder="Email"
      />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="w-[90px] text-[#000] border-1 border-[#000] rounded p-2 hover:bg-gray-500"
        >
          Cancelar
        </button>

        {canSubmit && (
          <button
            type="submit"
            className="w-[90px] bg-[#FF9500CC] text-[#000] rounded p-2 font-bold"
          >
            Enviar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormReview;
