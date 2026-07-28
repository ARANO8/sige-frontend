'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

const registerSchema = z.object({
  empresaNombre: z.string().min(3, 'Mínimo 3 caracteres'),
  nit: z.string().min(5, 'NIT inválido'),
  nombreAdmin: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    try {
      await registerUser({
        empresaNombre: data.empresaNombre,
        nit: data.nit,
        nombreAdmin: data.nombreAdmin,
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-surface to-surface-container items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-container flex items-center justify-center">
            <span className="font-headline text-3xl font-bold text-white">NF</span>
          </div>
          <h1 className="font-headline text-4xl font-bold text-on-surface">Nuevo Tenant</h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Registra tu empresa y comienza a gestionar tus operaciones de manufactura en una sola plataforma
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-headline text-2xl font-semibold text-on-surface">Registrar empresa</h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Crea tu cuenta multitenant
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-error-container/30 text-on-error-container font-label text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <Input
              label="Empresa"
              placeholder="Razón social"
              error={errors.empresaNombre?.message}
              {...register('empresaNombre')}
            />

            <Input
              label="NIT"
              placeholder="1234567890"
              error={errors.nit?.message}
              {...register('nit')}
            />

            <Input
              label="Nombre del administrador"
              placeholder="Juan Pérez"
              error={errors.nombreAdmin?.message}
              {...register('nombreAdmin')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="admin@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Registrar empresa
            </Button>
          </form>

          <p className="text-center font-body text-sm text-on-surface-variant">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
