import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Heart, 
  Search, 
  CalendarDays, 
  ArrowRight, 
  Clock, 
  Star, 
  MapPin, 
  ChevronRight,
  Bell,
  ShieldCheck,
  Check,
  Mail,
  User
} from 'lucide-react';
import { Booking, ServiceItem, ActivityItem } from '../../types';

interface ClientHomeViewProps {
  onNavigateExplore: () => void;
  onNavigateMyBookings: () => void;
  onSelectServiceToBook: (service: ServiceItem) => void;
  services: ServiceItem[];
  bookings: Booking[];
  activities: ActivityItem[];
  onCancelBooking: (bookingId: string) => void;
  onViewBookingDetails: (booking: Booking) => void;
}

export const ClientHomeView: React.FC<ClientHomeViewProps> = ({
  onNavigateExplore,
  onNavigateMyBookings,
  onSelectServiceToBook,
  services,
  bookings,
  activities,
  onCancelBooking,
  onViewBookingDetails
}) => {
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const featuredBooking = activeBookings[0] || bookings[0];

  const recommendedServices = services.slice(1, 4);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Panel Personal · Sesión iniciada
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Hola, Carlos Mendoza
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Encuentra y gestiona tus reservas de servicios profesionales en un solo lugar con disponibilidad en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateExplore}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Explorar servicios</span>
          </button>
          <button
            onClick={onNavigateMyBookings}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <span>Ver mis reservas</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Reservas activas</div>
            <div className="text-3xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              {activeBookings.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">próximas agendadas</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Servicios disfrutados</div>
            <div className="text-3xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              {completedBookings.length || 8}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">citas completadas</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Proveedores favoritos</div>
            <div className="text-3xl font-extrabold text-[#0B1C30] mt-1 tabular-nums">
              4
            </div>
            <div className="text-[11px] text-slate-400 mt-1">profesionales guardados</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Middle Section: Próxima Reserva Destacada + Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Próxima Reserva Destacada */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Próxima Reserva Destacada
              </h3>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full">
              En 3 días
            </span>
          </div>

          {featuredBooking ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-1">
              <div className="sm:col-span-5 relative rounded-xl overflow-hidden aspect-4/3 sm:aspect-auto sm:h-full min-h-[160px] bg-slate-100">
                <img
                  src="/src/assets/images/barber_shop_chair_1791857352646.jpg"
                  alt={featuredBooking.serviceTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {featuredBooking.modality}
                </span>
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">
                      CUIDADO PERSONAL
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Confirmada
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#0B1C30]">
                    {featuredBooking.serviceTitle}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Barbería Urban · Laura Morales Studio</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <div className="text-[11px] text-slate-400">Fecha y Hora</div>
                    <div className="font-bold text-slate-800">
                      Jueves, 27 Octubre
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      11:00 AM (45 min)
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Total a pagar</div>
                    <div className="font-bold text-blue-700 tabular-nums">
                      $25.000 COP
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Pago al finalizar
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onViewBookingDetails(featuredBooking)}
                    className="flex-1 py-2 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Ver detalles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onCancelBooking(featuredBooking.id)}
                    className="py-2 px-3 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancelar reserva
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No tienes reservas activas en este momento.
            </div>
          )}
        </div>

        {/* Right: Actividad Reciente */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Actividad Reciente
            </h3>
            <button
              onClick={onNavigateMyBookings}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Ver historial
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.map((item) => (
              <div key={item.id} className="py-3 flex items-start gap-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  {item.type === 'confirmed' ? (
                    <Calendar className="w-4 h-4" />
                  ) : item.type === 'reminder' ? (
                    <Bell className="w-4 h-4" />
                  ) : item.type === 'review' ? (
                    <Star className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Servicios Recomendados para Ti */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Servicios Recomendados para Ti
            </h3>
            <p className="text-xs text-slate-500">
              Basados en tus preferencias y profesionales mejor valorados esta semana
            </p>
          </div>

          <button
            onClick={onNavigateExplore}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Explorar todo el catálogo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {service.categoryBadge}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-slate-400">({service.reviewsCount} opiniones)</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {service.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{service.subtitle}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                <div>
                  <div className="text-[10px] text-slate-400">Precio sesión</div>
                  <div className="font-bold text-sm text-slate-900 tabular-nums">
                    ${service.priceCOP.toLocaleString('es-CO')} COP
                  </div>
                </div>

                <button
                  onClick={() => onSelectServiceToBook(service)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Ver disponibilidad
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
