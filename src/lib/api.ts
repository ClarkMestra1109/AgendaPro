// Cliente HTTP hacia el backend real (Spring Boot) de Fábrica Escuela.
// Sustituye por completo el prototipo local basado en localStorage: todas las
// operaciones de autenticación, servicios, horarios y reservas pasan por aquí.

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const TOKEN_KEY = 'agendapro_token';

export type Rol = 'CLIENTE' | 'PROVEEDOR';

export interface UsuarioResponse {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: Rol;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioResponse;
}

export interface ServicioResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  estado: 'ACTIVO' | 'INACTIVO' | 'ELIMINADO';
  fechaCreacion: string;
}

export interface CatalogoServicioResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  proveedorNombre: string;
}

export interface FranjaResponse {
  id: number;
  servicioId: number;
  inicio: string; // instant ISO
  fin: string;
  cupoTotal: number;
  cuposOcupados: number;
  cuposDisponibles: number;
  estado: 'PUBLICADA' | 'RETIRADA';
}

export interface ReservaResponse {
  id: number;
  estado: 'CONFIRMADA' | 'CANCELADA';
  franjaId: number;
  inicio: string;
  fin: string;
  servicioId: number;
  servicioNombre: string;
  proveedorNombre: string;
  clienteNombre: string;
  clienteCorreo: string;
  duracionMin: number;
  precio: number;
}

export class ApiError extends Error {
  status: number;
  errores?: Record<string, string>;

  constructor(message: string, status: number, errores?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores;
  }
}

export function mensajeDeApiError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.errores) {
      const primero = Object.values(error.errores)[0];
      if (primero) return primero;
    }
    return error.message || fallback;
  }
  return fallback;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Almacenamiento no disponible: la sesión simplemente no persistirá entre recargas.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignorar
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No fue posible conectarse con el servidor. Verifica tu conexión e intenta de nuevo.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const texto = await response.text();
  const datos = texto ? JSON.parse(texto) : null;

  if (!response.ok) {
    const mensaje = datos?.mensaje || 'Ocurrió un error inesperado. Intenta nuevamente.';
    throw new ApiError(mensaje, response.status, datos?.errores);
  }

  return datos as T;
}

// --- Autenticación (HU01, HU02, HU04) ---

export function authRegistrar(nombre: string, correo: string, contrasena: string, rol: Rol) {
  return request<UsuarioResponse>('/api/auth/register', {
    method: 'POST',
    body: { nombre, correo, contrasena, rol },
    auth: false,
  });
}

export function authIniciarSesion(correo: string, contrasena: string) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { correo, contrasena },
    auth: false,
  });
}

export function authSolicitarRecuperacion(correo: string) {
  return request<void>('/api/auth/recuperar', { method: 'POST', body: { correo }, auth: false });
}

export function authRestablecerContrasena(token: string, nuevaContrasena: string, confirmarContrasena: string) {
  return request<void>('/api/auth/restablecer', {
    method: 'POST',
    body: { token, nuevaContrasena, confirmarContrasena },
    auth: false,
  });
}

// --- Perfil (HU03) ---

export function getMiPerfil() {
  return request<UsuarioResponse>('/api/usuarios/me');
}

export function actualizarPerfil(nombre: string, correo: string, telefono: string) {
  return request<UsuarioResponse>('/api/usuarios/me', { method: 'PUT', body: { nombre, correo, telefono } });
}

// --- Servicios del proveedor (HU05, HU06) ---

export interface ServicioRequestBody {
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  estado?: 'ACTIVO' | 'INACTIVO';
}

export function crearServicio(req: ServicioRequestBody) {
  return request<ServicioResponse>('/api/servicios', { method: 'POST', body: req });
}

export function misServicios() {
  return request<ServicioResponse[]>('/api/servicios/mis-servicios');
}

export function actualizarServicio(id: number, req: ServicioRequestBody) {
  return request<ServicioResponse>(`/api/servicios/${id}`, { method: 'PUT', body: req });
}

export function eliminarServicio(id: number) {
  return request<void>(`/api/servicios/${id}`, { method: 'DELETE' });
}

// --- Catálogo público (HU13) ---

export function catalogoServicios() {
  return request<CatalogoServicioResponse[]>('/api/catalogo/servicios');
}

export function catalogoFranjasDeServicio(servicioId: number) {
  return request<FranjaResponse[]>(`/api/catalogo/servicios/${servicioId}/franjas`);
}

// --- Disponibilidad del proveedor (HU10, HU11, HU12) ---

export function publicarFranja(servicioId: number, inicioISO: string, finISO: string, cupoTotal?: number) {
  return request<FranjaResponse>(`/api/servicios/${servicioId}/franjas`, {
    method: 'POST',
    body: { inicio: inicioISO, fin: finISO, cupoTotal },
  });
}

export interface FranjaRecurrenteBody {
  horaInicio: string; // "HH:mm"
  horaFin: string;
  diasSemana: string[]; // nombres de java.time.DayOfWeek
  repetirHasta: string; // "YYYY-MM-DD"
  cupoTotal?: number;
}

export function publicarFranjaRecurrente(servicioId: number, req: FranjaRecurrenteBody) {
  return request<FranjaResponse[]>(`/api/servicios/${servicioId}/franjas/recurrentes`, {
    method: 'POST',
    body: req,
  });
}

export function listarFranjasDeServicioPropio(servicioId: number) {
  return request<FranjaResponse[]>(`/api/servicios/${servicioId}/franjas`);
}

export function retirarFranja(franjaId: number) {
  return request<FranjaResponse>(`/api/franjas/${franjaId}`, { method: 'DELETE' });
}

// --- Reservas del cliente (HU14, HU15, HU16) ---

export function crearReserva(franjaId: number) {
  return request<ReservaResponse>('/api/reservas', { method: 'POST', body: { franjaId } });
}

export function cancelarReserva(id: number) {
  return request<ReservaResponse>(`/api/reservas/${id}/cancelar`, { method: 'PUT' });
}

export function reprogramarReserva(id: number, nuevaFranjaId: number) {
  return request<ReservaResponse>(`/api/reservas/${id}/reprogramar`, {
    method: 'PUT',
    body: { nuevaFranjaId },
  });
}

// --- Agenda (HU17, HU18) ---

export function miAgenda(fecha?: string, servicioId?: number) {
  const params = new URLSearchParams();
  if (fecha) params.set('fecha', fecha);
  if (servicioId) params.set('servicioId', String(servicioId));
  const query = params.toString();
  return request<ReservaResponse[]>(`/api/agenda${query ? `?${query}` : ''}`);
}
