export const SUGAR_SPECIFIC_GRAVITY = 1.59;
export const WATER_SPECIFIC_GRAVITY = 1;

export const SUGAR_WATER_PROPORTIONS = {
  '1:2': { sugar: 500, water: 1000 },
  '11:20': { sugar: 550, water: 1000 },
  '3:5': { sugar: 600, water: 1000 },
  '13:20': { sugar: 650, water: 1000 },
  '7:10': { sugar: 700, water: 1000 },
  '3:4': { sugar: 750, water: 1000 },
  '4:5': { sugar: 800, water: 1000 }
};

export const ALCOHOL_DENSITIES = [
/* Source https://www.plantagea.hr/wp-content/uploads/2021/09/Dilution-of-ethanol.pdf */
/*  { strength: 10, density: 984.71 },
  { strength: 20, density: 973.56 },
  { strength: 30, density: 962.21 },
  { strength: 40, density: 948.05 },
  { strength: 50, density: 930.14 },
  { strength: 60, density: 909.11 },
  { strength: 70, density: 885.56 },
  { strength: 80, density: 859.27 }, */
  { strength: 90, density: 829.18 },
  { strength: 91, density: 825.83 },
  { strength: 92, density: 822.39 },
  { strength: 93, density: 818.85 },
  { strength: 94, density: 815.18 },
  { strength: 95, density: 811.38 },
  { strength: 96, density: 807.42 },
  { strength: 97, density: 803.27 },
  { strength: 98, density: 798.90 },
  { strength: 99, density: 794.25 },
  { strength: 100, density: 789.24 }
];

export const SYRUP_DENSITIES = [
  { brix:   0, density: 0.99717 },
  { brix:   5, density: 1.01680 },
  { brix:  10, density: 1.03709 },
  { brix:  15, density: 1.05811 },
  { brix:  20, density: 1.07991 },
  { brix:  25, density: 1.10251 },
  { brix:  30, density: 1.12594 },
  { brix:  35, density: 1.15024 },
  { brix:  40, density: 1.17541 },
  { brix:  45, density: 1.20151 },
  { brix:  50, density: 1.22854 },
  { brix:  55, density: 1.25651 },
  { brix:  60, density: 1.28544 }
  // — you can extend further if you like
];