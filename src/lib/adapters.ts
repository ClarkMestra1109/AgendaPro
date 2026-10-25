// Convierte las respuestas del backend real a las formas que ya esperan las pantallas
// de este prototipo (src/types.ts), para no tener que reescribir cada componente.

import type { AuthenticatedUser } from '../data/authStorage';
import type {
  CatalogoServicioResponse,
  FranjaResponse,
  ReservaResponse,
  Rol,
  ServicioResponse,
  UsuarioResponse,
} from './api';
import type { AvailabilitySlot, Booking, BookingStatus, ServiceItem, UserRole } from '../types';

const ZONA = 'America/Bogota';

export function rolAUserRole(rol: Rol): UserRole {
  return rol === 'PROVEEDOR' ? 'provider' : 'client';
}

export function userRoleARol(role: UserRole): Rol {
  return role === 'provider' ? 'PROVEEDOR' : 'CLIENTE';
}

export function usuarioAAuthenticatedUser(u: UsuarioResponse): AuthenticatedUser {
  return {
    id: String(u.id),
    name: u.nombre,
    email: u.correo,
    role: rolAUserRole(u.rol),
  };
}

function partesEnBogota(iso: string): { dateISO: string; hhmm: string } {
  const fecha = new Date(iso);
  const dateISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha);
  const hhmm = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(fecha);
  return { dateISO, hhmm };
}

function horaAMPM(hhmm: string): string {
  const [horas, minutos] = hhmm.split(':').map(Number);
  const sufijo = horas >= 12 ? 'PM' : 'AM';
  return `${String(horas % 12 || 12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${sufijo}`;
}

function fechaLegible(dateISO: string, conAnio = true): string {
  const [anio, mes, dia] = dateISO.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(conAnio ? { year: 'numeric' as const } : {}),
  });
}

/** Clave estable para emparejar servicio/franjas/reservas sin exponer el correo del proveedor. */
export function claveProveedorDeServicio(servicioId: number | string): string {
  return `servicio-${servicioId}`;
}

export function servicioPropioAServiceItem(s: ServicioResponse, providerName: string): ServiceItem {
  return {
    id: String(s.id),
    title: s.nombre,
    category: 'Servicios Generales',
    categorySlug: 'general',
    providerName,
    providerEmail: claveProveedorDeServicio(s.id),
    providerStudio: providerName,
    modalityBadge: 'Presencial',
    price: Number(s.precio),
    priceCOP: Number(s.precio),
    durationMinutes: s.duracionMin,
    rating: 0,
    reviewsCount: 0,
    imageUrl: '',
    description: s.descripcion,
    isActive: s.estado === 'ACTIVO',
    status: s.estado === 'ACTIVO' ? 'active' : 'inactive',
  };
}

export function catalogoAServiceItem(c: CatalogoServicioResponse): ServiceItem {
  return {
    id: String(c.id),
    title: c.nombre,
    category: 'Servicios Generales',
    categorySlug: 'general',
    providerName: c.proveedorNombre,
    providerEmail: claveProveedorDeServicio(c.id),
    providerStudio: c.proveedorNombre,
    modalityBadge: 'Presencial',
    price: Number(c.precio),
    priceCOP: Number(c.precio),
    durationMinutes: c.duracionMin,
    rating: 0,
    reviewsCount: 0,
    imageUrl: '',
    description: c.descripcion,
    isActive: true,
    status: 'active',
  };
}

export function franjaASlot(f: FranjaResponse, serviceTag: string): AvailabilitySlot {
  const inicio = partesEnBogota(f.inicio);
  const fin = partesEnBogota(f.fin);
  const duracionMinutos = Math.round((new Date(f.fin).getTime() - new Date(f.inicio).getTime()) / 60000);
  return {
    id: String(f.id),
    dayLabel: new Date(`${inicio.dateISO}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
    fullDate: fechaLegible(inicio.dateISO),
    dateISO: inicio.dateISO,
    startTime: inicio.hhmm,
    endTime: fin.hhmm,
    durationMinutes: duracionMinutos,
    providerEmail: claveProveedorDeServicio(f.servicioId),
    timeRange: `${horaAMPM(inicio.hhmm)} - ${horaAMPM(fin.hhmm)}`,
    capacityText: `${f.cuposDisponibles} de ${f.cupoTotal} cupo(s) libres`,
    serviceTag,
    isBooked: f.estado !== 'PUBLICADA' || f.cuposDisponibles <= 0,
  };
}

function estadoABookingStatus(estado: ReservaResponse['estado']): BookingStatus {
  return estado === 'CONFIRMADA' ? 'confirmed' : 'cancelled';
}

export interface DatosLocalesReserva {
  clientPhone?: string;
  notes?: string;
  modality?: Booking['modality'];
}

export function reservaABooking(r: ReservaResponse, extra: DatosLocalesReserva = {}): Booking {
  const inicio = partesEnBogota(r.inicio);
  const hora = horaAMPM(inicio.hhmm);
  const fecha = fechaLegible(inicio.dateISO);
  const iniciales = r.clienteNombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('');

  return {
    id: String(r.id),
    clientName: r.clienteNombre,
    clientEmail: r.clienteCorreo,
    clientPhone: extra.clientPhone || '',
    clientInitials: iniciales || 'CL',
    providerEmail: claveProveedorDeServicio(r.servicioId),
    providerName: r.proveedorNombre,
    dateISO: inicio.dateISO,
    startTime: inicio.hhmm,
    availabilitySlotId: String(r.franjaId),
    serviceId: String(r.servicioId),
    serviceTitle: r.servicioNombre,
    category: 'Servicios Generales',
    locationName: r.proveedorNombre,
    date: fecha,
    time: hora,
    timeSlotFormatted: `${fecha} • ${hora}`,
    durationMinutes: r.duracionMin,
    price: Number(r.precio),
    status: estadoABookingStatus(r.estado),
    modality: extra.modality || 'Presencial',
    notes: extra.notes || '',
  };
}
