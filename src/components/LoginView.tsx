import React, { useState } from 'react';
import { User } from '../types';
import { loginUser } from '../api';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('agente@supportdesk.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const res = await loginUser(email, password);
      if (res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      alert('Erro ao realizar login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <main className="w-full max-w-[420px] bg-white border border-[#c3c6d7] rounded-xl p-8 relative z-10 shadow-lg">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[32px] material-symbols-filled">
              headset_mic
            </span>
            <h1 className="text-2xl font-bold text-[#004ac6]">SupportDesk</h1>
          </div>
          <p className="text-xs text-[#434655]">
            Bem-vindo de volta, por favor faça login na sua conta
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Endereço de E-mail</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[20px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agente@supportdesk.com"
                className="w-full h-10 pl-10 pr-3 bg-white border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#dce9ff] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0b1c30]">Senha</label>
              <button
                type="button"
                onClick={() => alert('Para redefinir a senha, entre em contato com o administrador.')}
                className="text-xs font-semibold text-[#004ac6] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-10 pr-10 bg-white border border-[#c3c6d7] rounded-lg text-xs text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#dce9ff] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#737686] hover:text-[#0b1c30] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-10 mt-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg flex items-center justify-center transition-all shadow-sm"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="mt-4 pt-4 border-t border-[#c3c6d7] text-center">
            <p className="text-[11px] text-[#737686]">
              Autenticação integrada com banco em arquivo <code>data/users.json</code>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};
