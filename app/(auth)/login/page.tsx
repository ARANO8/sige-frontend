'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-surface to-surface-container items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-container flex items-center justify-center">
            <span className="font-headline text-3xl font-bold text-white">NF</span>
          </div>
          <h1 className="font-headline text-4xl font-bold text-on-surface">Nexu Fabrik ERP</h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Sistema de Gestión Empresarial para Manufactura
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            {['Producción', 'Inventarios', 'Compras', 'Ventas', 'Contabilidad', 'RRHH'].map((m) => (
              <div key={m} className="bento-card py-3 px-2 text-center">
                <p className="font-label text-xs text-primary font-medium">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-headline text-2xl font-semibold text-on-surface">Iniciar sesión</h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Accede a tu cuenta empresarial
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-error-container/30 text-on-error-container font-label text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <Input
              label="Email corporativo"
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

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Ingresar
            </Button>
          </form>

          <p className="text-center font-body text-sm text-on-surface-variant">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Registrar empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
