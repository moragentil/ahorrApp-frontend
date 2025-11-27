import { useState } from 'react';
import { 
  Coins, ShoppingCart, Coffee, Utensils, Pizza, Wine, Beer, 
  Home, Zap, Lightbulb, Car, Fuel, Bus, Plane,
  Film, Gamepad2, Music, Dumbbell, Pill, Hospital,
  ShoppingBag, Shirt, Smartphone, Laptop, GraduationCap, BookOpen,
  Gift, PartyPopper, Palmtree, Dog, Cat, Wifi, Tv, Sofa, X
} from 'lucide-react';

const ICONOS_DISPONIBLES = [
  { name: 'Coins', icon: Coins, label: 'Dinero' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'Supermercado' },
  { name: 'Utensils', icon: Utensils, label: 'Restaurante' },
  { name: 'Pizza', icon: Pizza, label: 'Pizza' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'Wine', icon: Wine, label: 'Vino' },
  { name: 'Beer', icon: Beer, label: 'Cerveza' },
  { name: 'Home', icon: Home, label: 'Hogar' },
  { name: 'Zap', icon: Zap, label: 'Electricidad' },
  { name: 'Lightbulb', icon: Lightbulb, label: 'Luz' },
  { name: 'Wifi', icon: Wifi, label: 'Internet' },
  { name: 'Tv', icon: Tv, label: 'TV/Cable' },
  { name: 'Sofa', icon: Sofa, label: 'Muebles' },
  { name: 'Car', icon: Car, label: 'Auto' },
  { name: 'Fuel', icon: Fuel, label: 'Combustible' },
  { name: 'Bus', icon: Bus, label: 'Transporte' },
  { name: 'Plane', icon: Plane, label: 'Avión' },
  { name: 'Film', icon: Film, label: 'Cine' },
  { name: 'Gamepad2', icon: Gamepad2, label: 'Videojuegos' },
  { name: 'Music', icon: Music, label: 'Música' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Gimnasio' },
  { name: 'Pill', icon: Pill, label: 'Farmacia' },
  { name: 'Hospital', icon: Hospital, label: 'Médico' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Compras' },
  { name: 'Shirt', icon: Shirt, label: 'Ropa' },
  { name: 'Smartphone', icon: Smartphone, label: 'Teléfono' },
  { name: 'Laptop', icon: Laptop, label: 'Computadora' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Educación' },
  { name: 'BookOpen', icon: BookOpen, label: 'Libros' },
  { name: 'Gift', icon: Gift, label: 'Regalo' },
  { name: 'PartyPopper', icon: PartyPopper, label: 'Fiesta' },
  { name: 'Palmtree', icon: Palmtree, label: 'Vacaciones' },
  { name: 'Dog', icon: Dog, label: 'Mascota' },
  { name: 'Cat', icon: Cat, label: 'Gato' },
];

function IconSelector({ selectedIcon, onSelectIcon }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectIcon = (iconName) => {
    onSelectIcon(iconName);
    setIsOpen(false);
  };

  const selectedIconData = ICONOS_DISPONIBLES.find(i => i.name === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || Coins;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-1">
        Icono
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md hover:bg-muted/50 transition-colors flex items-center gap-3"
      >
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <SelectedIconComponent className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm flex-1 text-left">
          {selectedIconData?.label || 'Seleccionar icono'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal centrado */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="p-2 border-b border-border flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Grid de iconos */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-7 sm:grid-cols-9  md:grid-cols-10 gap-1">
                  {ICONOS_DISPONIBLES.map(icono => {
                    const IconComponent = icono.icon;
                    return (
                      <button
                        key={icono.name}
                        type="button"
                        onClick={() => handleSelectIcon(icono.name)}
                        className={`aspect-square flex items-center justify-center p-3 rounded-lg transition-all hover:bg-muted hover:scale-110 ${
                          selectedIcon === icono.name
                            ? 'bg-primary/20 ring-2 ring-primary'
                            : 'bg-muted/30'
                        }`}
                        title={icono.label}
                      >
                        <IconComponent className="w-4 h-4 text-foreground" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IconSelector;