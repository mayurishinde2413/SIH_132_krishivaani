import React from 'react';

/**
 * Normalizes any crop name or string to resolve the standard crop icon emoji.
 *
 * Rules:
 * - Case-insensitive
 * - Handles name variations (e.g. "Tomato (Tamatar)", "Potato (Batata)", "SOYBEAN")
 * - Does not depend on module, index, position, or buyer name
 * - Returns '🌱' as default/fallback for unknown crops (NEVER '🍅')
 */
export const getCropIcon = (cropName?: string | null): string => {
  if (!cropName || typeof cropName !== 'string') {
    return '🌱';
  }

  const normalized = cropName.toLowerCase().trim();

  // 1. Tomato
  if (normalized.includes('tomato') || normalized.includes('tamatar')) {
    return '🍅';
  }

  // 2. Potato
  if (
    normalized.includes('potato') ||
    normalized.includes('batata') ||
    normalized.includes('aalu') ||
    normalized.includes('alu')
  ) {
    return '🥔';
  }

  // 3. Soybean
  if (
    normalized.includes('soybean') ||
    normalized.includes('soya') ||
    normalized.includes('soy')
  ) {
    return '🫘';
  }

  // 4. Wheat
  if (
    normalized.includes('wheat') ||
    normalized.includes('gehun') ||
    normalized.includes('gehu')
  ) {
    return '🌾';
  }

  // 5. Maize / Corn
  if (
    normalized.includes('maize') ||
    normalized.includes('corn') ||
    normalized.includes('makka') ||
    normalized.includes('makai')
  ) {
    return '🌽';
  }

  // 6. Onion
  if (
    normalized.includes('onion') ||
    normalized.includes('kanda') ||
    normalized.includes('pyaz')
  ) {
    return '🧅';
  }

  // 7. Bajra / Millet / Rice / Grain grains
  if (
    normalized.includes('bajra') ||
    normalized.includes('bajri') ||
    normalized.includes('millet') ||
    normalized.includes('rice') ||
    normalized.includes('chawal') ||
    normalized.includes('paddy') ||
    normalized.includes('jowar')
  ) {
    return '🌾';
  }

  // 8. Cotton / Groundnut / Sugarcane / Oilseeds / Other crops
  if (
    normalized.includes('cotton') ||
    normalized.includes('kapas') ||
    normalized.includes('groundnut') ||
    normalized.includes('moongphali') ||
    normalized.includes('sugarcane') ||
    normalized.includes('ganna') ||
    normalized.includes('ginger') ||
    normalized.includes('garlic') ||
    normalized.includes('turmeric')
  ) {
    return '🌱';
  }

  // Fallback for any unknown crop: Always 🌱, NEVER 🍅
  return '🌱';
};

interface CropIconProps {
  cropName?: string | null;
  className?: string;
}

/**
 * Reusable CropIcon component that renders the normalized crop emoji with optional styling.
 */
export const CropIcon: React.FC<CropIconProps> = ({ cropName, className = '' }: CropIconProps) => {
  const icon = getCropIcon(cropName);
  return (
    <span role="img" aria-label={cropName || 'crop'} className={className}>
      {icon}
    </span>
  );
};

export default getCropIcon;
