import { UserRole } from '../types';
import { ApiError, authIniciarSesion, authRegistrar, clearToken, setToken } from '../lib/api';
import { rolAUserRole, userRoleARol, usuarioAAuthenticatedUser } from '../lib/adapters';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthenticatedUser;
}

function mensajeDeError(error: unknown, generico: string): string {
  if (error instanceof ApiError) {
    if (error.errores) {
      const primero = Object.values(error.errores)[0];
      if (primero) return primero;
    }
    return error.message || generico;
  }
  return generico;
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<AuthResult> {
  try {
    await authRegistrar(name.trim(), email.trim().toLowerCase(), password, userRoleARol(role));
    // El registro no devuelve token: iniciamos sesión justo después para entrar directo.
    const sesion = await authIniciarSesion(email.trim().toLowerCase(), password);
    setToken(sesion.token);
    return {
      success: true,
      message: 'Cuenta creada correctamente.',
      user: usuarioAAuthenticatedUser(sesion.usuario),
    };
  } catch (error) {
    return { success: false, message: mensajeDeError(error, 'No se pudo crear la cuenta.') };
  }
}

export async function authenticateAccount(email: string, password: string): Promise<AuthResult> {
  try {
    const sesion = await authIniciarSesion(email.trim().toLowerCase(), password);
    setToken(sesion.token);
    return {
      success: true,
      message: 'Inicio de sesión correcto.',
      user: usuarioAAuthenticatedUser(sesion.usuario),
    };
  } catch (error) {
    return { success: false, message: mensajeDeError(error, 'No se pudo iniciar sesión.') };
  }
}

export function cerrarSesion(): void {
  clearToken();
}

export { rolAUserRole };
