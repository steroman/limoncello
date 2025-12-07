<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import HelperText from './HelperText.vue';

import { 
  calculateSyrupVolume,
  getAlcoholDensity
} from '../utils/calculations';

import { 
  ALCOHOL_DENSITIES, 
  SUGAR_WATER_PROPORTIONS 
} from '../utils/constants';

const { t } = useI18n();

const inputs = reactive({
  totalVolume: '',
  desiredStrength: '',
  alcoholStrength: 96,
  sugarWaterRatio: '1:2'
});

const result = ref(null);
const error = ref('');

/**
 * Simple validator
 */
function validate() {
  if (!inputs.totalVolume || !inputs.desiredStrength) {
    error.value = t('common.error');
    return false;
  }

  const totalVolume = Number(inputs.totalVolume);
  const desiredStrength = Number(inputs.desiredStrength);
  const alcoholStrength = Number(inputs.alcoholStrength);

  if (totalVolume <= 0 || desiredStrength <= 0) {
    error.value = t('common.error');
    return false;
  }

  if (desiredStrength >= alcoholStrength) {
    error.value = t('common.error');
    return false;
  }

  error.value = '';
  return true;
}

/**
 * For a given scale factor k (how much syrup we make),
 * compute the total final volume using the realistic syrup
 * model and the ABV constraint.
 *
 * k scales sugarBase and waterBase from SUGAR_WATER_PROPORTIONS.
 */
function computeTotalVolumeForK(k, ratio, desiredStrength, alcoholStrength) {
  const sugarBase = ratio.sugar;
  const waterBase = ratio.water;

  const sugarMass = k * sugarBase;
  const waterMass = k * waterBase;

  // Syrup volume with contraction taken into account
  const syrupVolume = calculateSyrupVolume(sugarMass, waterMass); // ml

  const Sd = desiredStrength;      // %
  const Sa = alcoholStrength;      // %

  const ethanolFractionDesired = Sd / 100;
  const alcoholStrengthFraction = Sa / 100;

  // From derivation:
  // V_a = (Sd * V_s) / (Sa - Sd)
  const alcoholVolume = 
    (ethanolFractionDesired * syrupVolume) / (alcoholStrengthFraction - ethanolFractionDesired);

  const totalVolume = syrupVolume + alcoholVolume;

  return {
    totalVolume,
    syrupVolume,
    sugarMass,
    waterMass,
    alcoholVolume
  };
}

function calculate() {
  if (!validate()) return;

  const targetVolume = Number(inputs.totalVolume);       // ml
  const desiredStrength = Number(inputs.desiredStrength); // %
  const alcoholStrength = Number(inputs.alcoholStrength); // %

  const ratio = SUGAR_WATER_PROPORTIONS[inputs.sugarWaterRatio];

  // ------------------------------------------------------------------
  // 1. Find k such that totalVolume(k) ≈ targetVolume using bisection
  // ------------------------------------------------------------------
  let kLow = 0;
  let kHigh = 1;
  let vHigh = computeTotalVolumeForK(kHigh, ratio, desiredStrength, alcoholStrength).totalVolume;

  // Expand kHigh until we exceed targetVolume
  let safetyCounter = 0;
  while (vHigh < targetVolume && safetyCounter < 50) {
    kHigh *= 2;
    vHigh = computeTotalVolumeForK(kHigh, ratio, desiredStrength, alcoholStrength).totalVolume;
    safetyCounter++;
  }

  // If we still didn't exceed, something is off; bail out gracefully
  if (vHigh < targetVolume) {
    error.value = t('common.error');
    result.value = null;
    return;
  }

  // Bisection search
  let best = null;
  const maxIterations = 50;
  for (let i = 0; i < maxIterations; i++) {
    const kMid = (kLow + kHigh) / 2;
    const dataMid = computeTotalVolumeForK(kMid, ratio, desiredStrength, alcoholStrength);
    const diff = dataMid.totalVolume - targetVolume;

    best = dataMid;

    if (Math.abs(diff) < 0.0001) {
      break;
    }

    if (diff > 0) {
      // Too much volume → reduce k
      kHigh = kMid;
    } else {
      // Too little volume → increase k
      kLow = kMid;
    }
  }

  if (!best) {
    error.value = t('common.error');
    result.value = null;
    return;
  }

  const { sugarMass, waterMass, alcoholVolume } = best;

  // ------------------------------------------------------------------
  // 2. Convert alcohol volume → mass using alcohol density
  // ------------------------------------------------------------------
  const density_g_L = getAlcoholDensity(alcoholStrength);
  if (!density_g_L) {
    error.value = t('common.error');
    result.value = null;
    return;
  }

  const density_g_ml = density_g_L / 1000;
  const alcoholMass = alcoholVolume * density_g_ml;

  // ------------------------------------------------------------------
  // 3. Set final results for UI (we keep targetVolume as displayed)
  // ------------------------------------------------------------------
  result.value = {
    sugar: sugarMass.toFixed(2),
    water: waterMass.toFixed(2),
    alcohol: alcoholMass.toFixed(2),
    totalVolume: targetVolume.toFixed(2)
  };
}
</script>

<template>
  <div>
    <div class="grid gap-6 mb-8">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.ingredients.inputs.volume') }}
        </label>
        <input 
          type="number" 
          v-model.number="inputs.totalVolume" 
          min="0"
          class="input-field"
        >
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.ingredients.inputs.desiredStrength') }}
        </label>
        <input 
          type="number" 
          v-model.number="inputs.desiredStrength" 
          min="0"
          max="100"
          class="input-field"
        >
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.ingredients.inputs.alcoholVol') }}
        </label>
        <select 
          v-model.number="inputs.alcoholStrength"
          class="input-field"
        >
          <option 
            v-for="{ strength } in ALCOHOL_DENSITIES" 
            :key="strength" 
            :value="strength"
          >
            {{ strength }}%
          </option>
        </select>
        <HelperText :text="t('calculators.volume.inputs.alcoholHelper')" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.ingredients.inputs.ratio') }}
        </label>
        <select 
          v-model="inputs.sugarWaterRatio"
          class="input-field"
        >
          <option 
            v-for="(ratio, key) in SUGAR_WATER_PROPORTIONS" 
            :key="key" 
            :value="key"
          >
            {{ key }} ({{ ratio.sugar }}g/lt)
          </option>
        </select>
      </div>

      <button 
        @click="calculate"
        class="btn btn-primary w-full"
      >
        {{ t('common.calculate') }}
      </button>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </div>

    <div v-if="result" class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ t('common.results') }}
      </h3>
      <div class="space-y-2 text-sm">
        <p class="flex justify-between">
          <span class="text-gray-600">{{ t('common.requiredSugar') }}:</span>
          <span class="font-medium">{{ result.sugar }} g</span>
        </p>
        <p class="flex justify-between">
          <span class="text-gray-600">{{ t('common.requiredWater') }}:</span>
          <span class="font-medium">{{ result.water }} g</span>
        </p>
        <p class="flex justify-between">
          <span class="text-gray-600">{{ t('common.requiredAlcohol') }}:</span>
          <span class="font-medium">{{ result.alcohol }} g</span>
        </p>
      </div>
    </div>
  </div>
</template>
