import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Scissors, 
  Music, 
  Dumbbell, 
  Laptop, 
  Camera, 
  Briefcase, 
  Clock, 
  Edit, 
  Trash2, 
  Check, 
  X,
  CreditCard,
  MapPin,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ProviderServicesViewProps {
  services: ServiceItem[];
  onAddService: (newService: Partial<ServiceItem>) => void;
  onToggleStatus: (serviceId: string) => void;
}

export const ProviderServicesView: React.FC<ProviderServicesViewProps> = ({
  services,
  onAddService,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating service
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Barbería & Belleza');
  const [newDuration, setNewDuration] = useState('45');
  const [newModality, setNewModality] = useState<'Presencial' | 'Virtual' | 'A domicilio' | 'En estudio'>('Presencial');
  const [newPrice, setNewPrice] = useState('30000');
  const [newDesc, setNewDesc] = useState('');

  const activeCount = services.filter(s => s.status === 'active').length;
  const inactiveCount = services.filter(s => s.status === 'inactive').length;

  const filteredServices = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                        s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'Todas' || s.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || 
                        (statusFilter === 'active' && s.status === 'active') ||
                        (statusFilter === 'inactive' && s.status === 'inactive');
    return matchSearch && matchCat && matchStatus;
  });

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Barber') || cat.includes('Belleza')) return <Scissors className="w-4 h-4 text-blue-600" />;
    if (cat.includes('Clases') || cat.includes('Música')) return <Music className="w-4 h-4 text-blue-600" />;
    if (cat.includes('Entrenamiento') || cat.includes('Salud')) return <Dumbbell className="w-4 h-4 text-blue-600" />;
    if (cat.includes('Soporte') || cat.includes('Tecnología') || cat.includes('Reparación')) return <Laptop className="w-4 h-4 text-blue-600" />;
    if (cat.includes('Foto')) return <Camera className="w-4 h-4 text-blue-600" />;
    return <Briefcase className="w-4 h-4 text-blue-600" />;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddService({
      title: newTitle,
      category: newCategory,
      categoryBadge: newCategory.toUpperCase(),
      durationMinutes: Number(newDuration) || 45,
      modality: newModality,
      priceCOP: Number(newPrice) || 30000,
      description: newDesc || 'Servicio personalizado de alta calidad brindado por el equipo profesional.',
      status: 'active',
      subtitle: 'Laura Morales Studio',
      rating: 5.0,
      reviewsCount: 1,
      image: '/src/assets/images/barber_shop_chair_1791857352646.jpg'
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-7 font-sans">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full inline-block mb-1">
            CONFIGURACIÓN DEL CATÁLOGO
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Mis Servicios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Administra tu catálogo de servicios, precios, duración y estado para tus clientes. Controla los canales de atención y la disponibilidad en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Counters */}
          <div className="flex items-center gap-3 text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              {activeCount} Activos
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              {inactiveCount} Inactivo
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 font-medium">
              {services.length} servicios registrados
            </span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Crear servicio</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar servicio por nombre o etiqueta..."
            className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-400 uppercase text-[10px]">CATEGORÍA:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Barbería & Belleza">Barbería & Belleza</option>
              <option value="Clases & Educación">Clases & Educación</option>
              <option value="Entrenamiento Personal">Entrenamiento Personal</option>
              <option value="Soporte & Consultoría">Soporte & Consultoría</option>
              <option value="Fotografía">Fotografía</option>
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <span className="text-[10px] font-bold text-slate-400 px-1 uppercase">ESTADO:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'active' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'inactive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/60">
                <th className="py-3.5 px-4">SERVICIO</th>
                <th className="py-3.5 px-4">CATEGORÍA</th>
                <th className="py-3.5 px-4">DURACIÓN</th>
                <th className="py-3.5 px-4">MODALIDAD</th>
                <th className="py-3.5 px-4 text-right">PRECIO</th>
                <th className="py-3.5 px-4 text-right">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Service Icon, Title, Description */}
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                        {getCategoryIcon(svc.category)}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">
                          {svc.title}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-1 max-w-sm">
                          {svc.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px] whitespace-nowrap">
                      {svc.category}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{svc.durationMinutes} min</span>
                    </div>
                  </td>

                  {/* Modality */}
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {svc.modality}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-right">
                    <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                      ${svc.priceCOP.toLocaleString('es-CO')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">COP</span>
                  </td>

                  {/* Status & Toggle */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onToggleStatus(svc.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        svc.status === 'active'
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'active' ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
                      <span>{svc.status === 'active' ? '● Activo' : '● Inactivo'}</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Mostrando {filteredServices.length} de {services.length} servicios disponibles</span>
          <div className="flex items-center gap-1">
            <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">1</span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Metric Cards matching Image 20.jpeg */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Precio Promedio de Catálogo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400">
              Precio Promedio de Catálogo
            </div>
            <div className="text-xl font-extrabold text-[#0B1C30] tabular-nums mt-0.5">
              $67.500 COP
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              +12% vs. mes anterior
            </div>
          </div>
        </div>

        {/* Metric 2: Duración Típica de Reserva */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400">
              Duración Típica de Reserva
            </div>
            <div className="text-xl font-extrabold text-[#0B1C30] tabular-nums mt-0.5">
              72 minutos
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rango: 45 min a 120 min
            </div>
          </div>
        </div>

        {/* Metric 3: Canal Más Frecuente */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400">
              Canal Más Frecuente
            </div>
            <div className="text-xl font-extrabold text-[#0B1C30] mt-0.5">
              Presencial (50%)
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              33% A domicilio, 17% Virtual
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Crear Servicio */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Crear Nuevo Servicio en Catálogo
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Limpieza Facial Profunda"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="Barbería & Belleza">Barbería & Belleza</option>
                    <option value="Clases & Educación">Clases & Educación</option>
                    <option value="Entrenamiento Personal">Entrenamiento Personal</option>
                    <option value="Soporte & Consultoría">Soporte & Consultoría</option>
                    <option value="Fotografía">Fotografía</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modalidad</label>
                  <select
                    value={newModality}
                    onChange={(e) => setNewModality(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="A domicilio">A domicilio</option>
                    <option value="En estudio">En estudio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    step="5"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Precio (COP) *</label>
                  <input
                    type="number"
                    step="1000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalles sobre lo que incluye el servicio, equipamiento y recomendaciones..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Guardar y Publicar
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
