'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SupabaseService from '@/lib/supabase/service';

type Step = 'loading' | 'set-password' | 'success' | 'error';

export default function AcceptInvitePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase procesa automáticamente el token del hash de la URL
    // y establece la sesión. Solo necesitamos esperar a que esté lista.
    const { data: { subscription } } = SupabaseService.client.auth.onAuthStateChange(
      (event) => {
        if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
          setStep('set-password');
        }
      }
    );

    // Fallback: si ya hay sesión activa al cargar (token ya procesado)
    SupabaseService.client.auth.getSession().then(({ data: { session } }) => {
      if (session) setStep('set-password');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await SupabaseService.client.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    setStep('success');
    setTimeout(() => router.push('/admin'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {step === 'loading' && (
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Verificando invitación...</p>
          </div>
        )}

        {step === 'set-password' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-800">Crear contraseña</h1>
              <p className="text-sm text-gray-500 mt-1">
                Establecé tu contraseña para acceder al panel de administración.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repetí la contraseña"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium">✗ {error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">¡Contraseña creada!</p>
            <p className="text-xs text-gray-500">Redirigiendo al panel...</p>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center space-y-3">
            <p className="text-sm text-red-600 font-medium">El enlace de invitación es inválido o expiró.</p>
            <button
              onClick={() => router.push('/admin/login')}
              className="text-sm text-secondary-600 hover:underline"
            >
              Ir al login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
