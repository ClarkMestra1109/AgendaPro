export type UserRole = 'provider' | 'client';

export type CurrentView =
  | 'login'
  | 'provider-dashboard'
  | 'provider-reservations'
  | 'provider-agenda'
  | 'provider-services'
  | 'provider-availability'
  | 'client-dashboard'
  | 'client-explore'
  | 'client-booking'
  | 'client-reservations'
  | 'client-profile';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Perfil de usuario utilizado en Navbar, Sidebar y ProfileView
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

// Representación de items de actividad o historial
export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
}

// Slots de tiempo para la agenda / disponibilidad
export interface TimeSlot {
  id: string;
  time: string;
  isAvailable?: boolean;
}

export interface Booking {
  id: string;
  code?: string; // Código de reserva (ej: 'BK-102')
  clientName: string;
  providerEmail?: string;
  dateISO?: string;
  startTime?: string;
  availabilitySlotId?: string;
  clientEmail: string;
  clientPhone: string;
  clientInitials: string;
  clientAvatar?: string;
  providerName?: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  locationName?: string;
  address?: string;
  date: string; // e.g. 'Hoy, 24 Oct' or '2024-10-27'
  dateDisplay?: string;
  time: string; // e.g. '10:00 AM'
  timeDisplay?: string;
  timeSlotFormatted?: string; // e.g. 'Hoy, 10:00 AM'
  durationMinutes: number;
  price: number;
  priceCOP?: number;
  status: BookingStatus;
  notes?: string;
  modality: 'Presencial' | 'Virtual' | 'A domicilio' | string;
  meetingUrl?: string;
  virtualMeetingUrl?: string;
  virtualMeetingId?: string;
  cancelReason?: string;
  isVirtual?: boolean;
  clientId?: string;
  providerAvatar?: string;
  providerRoleTitle?: string;
  dateStr?: string;
  timeRange?: string;
  periodOfDay?: 'Mañana' | 'Tarde' | 'Noche';
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  categorySlug?: string;
  categoryBadge?: string;
  providerName: string;
  providerEmail?: string;
  providerStudio?: string;
  providerAvatar?: string;
  providerRoleTitle?: string;
  modalityBadge?: string;
  price: number;
  priceCOP?: number;
  durationMinutes: number;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  image?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive' | string;
  modality?: ServiceModality;
}

export interface AvailabilitySlot {
  id: string;
  dayLabel: string;
  fullDate: string;
  dateISO?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  providerEmail?: string;
  timeRange: string;
  capacityText: string;
  serviceTag: string;
  isBooked: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  timeRange: string;
  day: string;
  startHour: number; // e.g. 10.0 for 10:00 AM, 14.5 for 2:30 PM
  durationHours: number; // e.g. 0.75, 1, 2
  status: 'confirmed' | 'pending' | 'available' | 'blocked';
  color: string;
  price?: string;
  location?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subtitle: string;
  statusText?: string;
  phone?: string;
  businessName?: string;
}

export type ServiceModality =
  | 'Presencial'
  | 'Virtual'
  | 'A domicilio'
  | 'En estudio'
  | 'Presencial / Virtual'
  | 'Taller / Domicilio'
  | 'Virtual (Google Meet)'
  | 'Virtual (Zoom)';

export type SlotStatus =
  | 'available'
  | 'booked'
  | 'withdrawn'
  | 'blocked';

export interface TimeSlot {
  id: string;
  dateStr: string;
  dayLabel: string;
  time: string;
  endTime: string;
  serviceId: string;
  serviceName: string;
  status: SlotStatus;
  bookedByClientName?: string;
  clientPhone?: string;
  notes?: string;
  modality?: ServiceModality;
  priceCOP?: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'confirmed' | 'reminder' | 'review' | 'notification';
}
