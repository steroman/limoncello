import { SUGAR_SPECIFIC_GRAVITY, WATER_SPECIFIC_GRAVITY, ALCOHOL_DENSITIES } from './constants';

export function calculateSugarVolume(sugarGrams) {
  return sugarGrams / SUGAR_SPECIFIC_GRAVITY;
}

export function calculateWaterVolume(waterGrams) {
  return waterGrams / WATER_SPECIFIC_GRAVITY;
}

export function getAlcoholDensity(strength) {
  return ALCOHOL_DENSITIES.find(item => item.strength === strength)?.density || 0;
}

export function calculateAlcoholVolume(alcoholGrams, alcoholStrength) {
  const density = getAlcoholDensity(alcoholStrength);
  return (alcoholGrams / density) * 1000;
}

export function calculateTotalVolume(sugarVolume, waterVolume, alcoholVolume) {
  return sugarVolume + waterVolume + alcoholVolume;
}

export function calculateAlcoholContent(alcoholVolume, alcoholStrength, totalVolume) {
  const alcoholContentVolume = alcoholVolume * (alcoholStrength / 100);
  return (alcoholContentVolume / totalVolume) * 100;
}