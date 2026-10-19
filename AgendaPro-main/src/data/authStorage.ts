import { UserRole } from '../types';

const ACCOUNTS_KEY = 'agendapro_accounts_v1';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface StoredAccount extends AuthenticatedUser {
  passwordHash: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthenticatedUser;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readAccounts(): StoredAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

async function hashPassword(password: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('El navegador no permite procesar credenciales. Abre la aplicación desde localhost.');
  }

  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function publicAccount(account: StoredAccount): AuthenticatedUser {
  const { passwordHash: _passwordHash, ...user } = account;
  return user;
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<AuthResult> {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  if (cleanName.length < 2) {
    return { success: false, message: 'Ingresa tu nombre completo.' };
  }
  if (!cleanEmail) {
    return { success: false, message: 'Ingresa un correo electrónico.' };
  }
  if (password.length < 8) {
    return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  const accounts = readAccounts();
  if (accounts.some((account) => normalizeEmail(account.email) === cleanEmail)) {
    return { success: false, message: 'Ya existe una cuenta registrada con ese correo.' };
  }

  try {
    const account: StoredAccount = {
      id: `cuenta-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role,
      passwordHash: await hashPassword(password),
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
    return { success: true, message: 'Cuenta creada correctamente.', user: publicAccount(account) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la cuenta.';
    return { success: false, message };
  }
}

export async function authenticateAccount(email: string, password: string): Promise<AuthResult> {
  const cleanEmail = normalizeEmail(email);
  const account = readAccounts().find(
    (candidate) => normalizeEmail(candidate.email) === cleanEmail,
  );

  if (!account) {
    return { success: false, message: 'No encontramos una cuenta con ese correo. Puedes crear una cuenta primero.' };
  }

  try {
    const submittedHash = await hashPassword(password);
    if (submittedHash !== account.passwordHash) {
      return { success: false, message: 'La contraseña es incorrecta.' };
    }
    return { success: true, message: 'Inicio de sesión correcto.', user: publicAccount(account) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
    return { success: false, message };
  }
}
