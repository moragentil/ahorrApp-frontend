import { 
  Coins, ShoppingCart, Coffee, Utensils, Pizza, Wine, Beer, 
  Home, Zap, Lightbulb, Car, Fuel, Bus, Plane,
  Film, Gamepad2, Music, Dumbbell, Pill, Hospital,
  ShoppingBag, Shirt, Smartphone, Laptop, GraduationCap, BookOpen,
  Gift, PartyPopper, Palmtree, Dog, Cat, Wifi, Tv, Sofa
} from 'lucide-react';

const ICON_MAP = {
  Coins, ShoppingCart, Coffee, Utensils, Pizza, Wine, Beer,
  Home, Zap, Lightbulb, Car, Fuel, Bus, Plane,
  Film, Gamepad2, Music, Dumbbell, Pill, Hospital,
  ShoppingBag, Shirt, Smartphone, Laptop, GraduationCap, BookOpen,
  Gift, PartyPopper, Palmtree, Dog, Cat, Wifi, Tv, Sofa
};

export const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || Coins;
};

export const renderIcon = (iconName, className = "w-5 h-5") => {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent className={className} />;
};