import { useState } from 'react';
import { ADMIN_SESSION_KEY, ADMIN_PASSCODE } from '../../useContent';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-purple px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl"
      >
        <h1 className="text-lg font-bold text-dark-purple mb-1">
          Operator Dashboard
        </h1>
        <p className="text-sm text-dark-purple/60 mb-4">KKN Penyetaraan</p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setError(false);
          }}
          placeholder="Masukkan passcode"
          autoFocus
          className="w-full bg-card-bg rounded-xl px-4 py-3 text-sm text-dark-purple border border-transparent focus:border-primary-purple focus:outline-none"
        />
        {error && (
          <p className="text-red-500 text-xs mt-2">Passcode salah, coba lagi</p>
        )}
        <button
          type="submit"
          className="w-full mt-5 bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold py-3 rounded-xl transition-all"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}