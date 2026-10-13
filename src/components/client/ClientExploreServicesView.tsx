import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  ChevronRight, 
  SlidersHorizontal, 
  CheckCircle2, 
  ShieldCheck,
  Scissors,
  GraduationCap,
  Dumbbell,
  Camera,
  Headphones,
  LayoutGrid
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ClientExploreServicesViewProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const ClientExploreServicesView: React.FC<ClientExploreServicesViewProps> = ({
  services,
  onSelectService
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedModality, setSelectedModality] = useState('Todas');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'Todas', label: 'Todas las categorías', icon: LayoutGrid },
    { id: 'Barbería & Belleza', label: 'Barbería & Belleza', icon: Scissors },
    { id: 'Clases & Educación', label: 'Clases & Educación', icon: GraduationCap },
    { id: 'Entrenamiento Personal', label: 'Entrenamiento Personal', icon: Dumbbell },
    { id: 'Fotografía', label: 'Fotografía', icon: Camera },
    { id: 'Soporte & Consultoría', label: 'Soporte & Consultoría', icon: Headphones },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'Todas' || s.category === selectedCategory;

      const matchesModality =
        selectedModality === 'Todas' || s.modality.includes(selectedModality);

      return matchesSearch && matchesCategory && matchesModality;
    });
  }, [services, searchQuery, selectedCategory, selectedModality]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full inline-block mb-1">
            Catálogo verificado para clientes preferentes
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Explorar Servicios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Encuentra profesionales calificados y agenda tu cita en segundos con confirmación inmediata.
          </p>
        </div>

        {/* Header Right Metric Badges */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 bg-white rounded-xl border border-slate-200/90 shadow-xs text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PROFESIONALES
            </div>
            <div className="text-base font-extrabold text-blue-700">
              140+ <span className="text-xs text-slate-500 font-normal">Activos</span>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-white rounded-xl border border-slate-200/90 shadow-xs text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              GARANTÍA
            </div>
            <div className="text-base font-extrabold text-emerald-600">
              100% <span className="text-xs text-slate-500 font-normal">Segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
        
        {/* Top row filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por servicio, negocio o palabra clave..."
              className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="Todas">Modalidad: Todas</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="A domicilio">A domicilio</option>
              <option value="En estudio">En estudio</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              defaultValue="todos"
              className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="todos">Rango de precio</option>
              <option value="low">Hasta $40.000 COP</option>
              <option value="mid">$40.000 - $80.000 COP</option>
              <option value="high">Más de $80.000 COP</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
            >
              <option value="rating">Ordenar: Mejor calificados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="duration">Duración</option>
            </select>
          </div>

        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of 6 Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Media image container with floating price and modality */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                
                {/* Modality tag top left */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {service.modality}
                </span>

                {/* Floating price badge bottom right */}
                <div className="absolute bottom-3 right-3 bg-[#1E3A8A] text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-md tabular-nums">
                  ${service.priceCOP.toLocaleString('es-CO')} COP
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-700 tracking-wider uppercase text-[10px]">
                    {service.categoryBadge}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#0B1C30] group-hover:text-blue-700 transition-colors line-clamp-1">
                  {service.title}
                </h3>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="truncate">{service.subtitle}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Card footer with duration & action button */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{service.durationMinutes} min</span>
              </div>

              <button
                onClick={() => onSelectService(service)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>Ver horarios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Mostrando {filteredServices.length} de 24 servicios disponibles</span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
          >
            &lt;
          </button>
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                currentPage === num
                  ? 'bg-[#1E3A8A] text-white'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(p => Math.min(4, p + 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
          >
            &gt;
          </button>
        </div>
      </div>

    </div>
  );
};
