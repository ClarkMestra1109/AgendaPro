export type UserRole = 'provider' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
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

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categoryBadge: string;
  durationMinutes: number;
  modality: ServiceModality;
  priceCOP: number;
  status: 'active' | 'inactive';
  rating: number;
  reviewsCount: number;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRoleTitle: string;
  location: string;
  image: string;
}

export type SlotStatus = 'available' | 'booked' | 'withdrawn' | 'blocked';

export interface TimeSlot {
  id: string;
  dateStr: string; // e.g. "2024-10-27"
  dayLabel: string; // e.g. "Jueves, 27 de Octubre"
  time: string; // e.g. "11:00 AM"
  endTime: string; // e.g. "11:45 AM"
  serviceId: string;
  serviceName: string;
  status: SlotStatus;
  bookedByClientName?: string;
  clientPhone?: string;
  notes?: string;
  modality?: ServiceModality;
  priceCOP?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  code: string; // e.g. "#RS-8841"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAvatar?: string;
  clientId: string;
  serviceId: string;
  serviceTitle: string;
  providerName: string;
  providerAvatar: string;
  providerRoleTitle?: string;
  dateStr: string; // "2024-10-27"
  dateDisplay: string; // "Jueves, 27 Oct 2024"
  timeDisplay: string; // "11:00 AM"
  timeRange: string; // "11:00 AM - 11:45 AM"
  durationMinutes: number;
  priceCOP: number;
  modality: ServiceModality;
  status: BookingStatus;
  address?: string;
  notes?: string;
  virtualMeetingUrl?: string;
  virtualMeetingId?: string;
  cancelReason?: string;
  periodOfDay?: 'Mañana' | 'Tarde' | 'Noche';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'confirmed' | 'reminder' | 'review' | 'notification';
}
