import { useEffect, useState } from 'react';
import { UserRound, Mail, Phone, Pencil, Save, X, CheckCircle2 } from 'lucide-react';

export interface ClientProfileData {
  name: string;
  phone: string;
  email: string;
}

interface ClientProfileProps {
  profile: ClientProfileData;
  onSave: (profile: ClientProfileData) => void;
}

export function ClientProfile({ profile, onSave }: ClientProfileProps) {
  const [form, setForm] = useState<ClientProfileData>(profile);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleCancel = () => {
    setForm(profile);
    setError('');
    setEditing(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!name || !phone || !email) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (!/^[+()\d\s.-]{7,20}$/.test(phone)) {
      setError('Ingresa un teléfono válido.');
      return;
    }

    onSave({ name, phone, email });
    setError('');
    setEditing(false);
  };

  const fields = [
    { key: 'name' as const, label: 'Nombre completo', icon: UserRound, type: 'text' },
    { key: 'phone' as const, label: 'Teléfono', icon: Phone, type: 'tel' },
    { key: 'email' as const, label: 'Correo electrónico', icon: Mail, type: 'email' },
  ];

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Mi cuenta</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0b1c30]">
          Mi perfil
        </h1>
        <p className="mt-2 text-slate-500">
          Consulta y actualiza tu información personal.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <UserRound size={30} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#0b1c30]">
              {profile.name || 'Mi perfil'}
            </h2>
            <p className="break-all text-sm text-slate-500">
              {profile.email}
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Pencil size={16} />
              Editar
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 p-6">
          {fields.map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label
                htmlFor={`profile-${key}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {label}
              </label>

              <div className="relative">
                <Icon
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id={`profile-${key}`}
                  type={type}
                  value={form[key]}
                  readOnly={!editing}
                  required
                  maxLength={key === 'name' ? 100 : key === 'email' ? 254 : 20}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      [key]: event.target.value,
                    }))
                  }
                  className={`w-full rounded-xl border py-3 pl-12 pr-4 text-sm outline-none ${
                    editing
                      ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                />
              </div>
            </div>
          ))}

          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {editing && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X size={16} />
                Cancelar
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                Guardar cambios
              </button>
            </div>
          )}

          {!editing && (
            <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              <p>Tu información personal está disponible para su consulta.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}