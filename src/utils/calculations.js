// calculations.js
//
// This version replaces the old sugar-volume + water-volume additive model
// with a realistic syrup-volume calculation based on °Brix and a lookup table.
//
// Requires:
//   - SYRUP_DENSITIES (array of { brix, density } objects)
//   - ALCOHOL_DENSITIES (the one already in your constants.js)
//

import {
  SYRUP_DENSITIES,
  ALCOHOL_DENSITIES
} from './constants';

/* -------------------------------------------------------
 * Helper: Lookup alcohol density (your existing logic)
 * -----------------------------------------------------*/
export function getAlcoholDensity(strength) {
  const entry = ALCOHOL_DENSITIES.find(x => x.strength === strength);
  return entry ? entry.density : null;
}

/* -------------------------------------------------------
 * Helper: Convert alcohol mass → volume
 * -----------------------------------------------------*/
export function calculateAlcoholVolume(alcoholGrams, alcoholStrength) {
  const density_g_per_L = getAlcoholDensity(alcoholStrength);

  if (!density_g_per_L) return 0;

  // Convert L → ml explicitly (density is g/L)
  return (alcoholGrams / density_g_per_L) * 1000;
}

/* -------------------------------------------------------
 * NEW: Get syrup density at a given °Brix using linear interpolation
 * -----------------------------------------------------*/
export function getSyrupDensity(brix) {
  // If exact match in table:
  const exact = SYRUP_DENSITIES.find(row => row.brix === brix);
  if (exact) return exact.density;

  const table = SYRUP_DENSITIES;

  // Find lower + upper bounding entries
  let lower = table[0];
  let upper = table[table.length - 1];

  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];

    if (brix >= a.brix && brix <= b.brix) {
      lower = a;
      upper = b;
      break;
    }
  }

  // If outside the table range, clamp
  if (brix <= lower.brix) return lower.density;
  if (brix >= upper.brix) return upper.density;

  // Linear interpolation:
  const ratio = (brix - lower.brix) / (upper.brix - lower.brix);
  return lower.density + ratio * (upper.density - lower.density);
}

/* -------------------------------------------------------
 * NEW: Calculate REAL syrup volume using °Brix + density table
 *
 * sugarGrams : mass of sugar (g)
 * waterGrams : mass of water (g)
 *
 * Returns: volume in ml
 * -----------------------------------------------------*/
export function calculateSyrupVolume(sugarGrams, waterGrams) {
  const totalMass = sugarGrams + waterGrams;

  if (totalMass === 0) return 0;

  // °Brix = sugar mass fraction * 100
  const brix = (sugarGrams / totalMass) * 100;

  const density = getSyrupDensity(brix); // g/ml

  // Realistic volume: solution mass / solution density
  const volume_ml = totalMass / density;

  return volume_ml;
}

/* -------------------------------------------------------
 * TOTAL FINAL VOLUME: syrup volume + alcohol volume
 *
 * This replaces your old:
 *   sugarVol + waterVol + alcoholVol
 * -----------------------------------------------------*/
export function calculateTotalMixtureVolume({
  sugarGrams,
  waterGrams,
  alcoholGrams,
  alcoholStrength,
}) {
  const syrupVol = calculateSyrupVolume(sugarGrams, waterGrams);
  const alcoholVol = calculateAlcoholVolume(alcoholGrams, alcoholStrength);

  return syrupVol + alcoholVol;
}

/* -------------------------------------------------------
 * Calculate final ABV % by volume
 * -----------------------------------------------------*/
export function calculateFinalABV({
  sugarGrams,
  waterGrams,
  alcoholGrams,
  alcoholStrength,
}) {
  const alcoholVol = calculateAlcoholVolume(alcoholGrams, alcoholStrength);

  // Pure ethanol volume inside the alcohol
  const ethanolVol = alcoholVol * (alcoholStrength / 100);

  const totalVolume =
    calculateTotalMixtureVolume({
      sugarGrams,
      waterGrams,
      alcoholGrams,
      alcoholStrength,
    });

  if (totalVolume === 0) return 0;

  return (ethanolVol / totalVolume) * 100;
}

/* -------------------------------------------------------
 * OPTIONAL exports for debugging or external use
 * -----------------------------------------------------*/
export default {
  getAlcoholDensity,
  calculateAlcoholVolume,
  getSyrupDensity,
  calculateSyrupVolume,
  calculateTotalMixtureVolume,
  calculateFinalABV,
};
