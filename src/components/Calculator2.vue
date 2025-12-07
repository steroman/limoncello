<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import HelperText from './HelperText.vue';

import { 
  calculateSyrupVolume,
  calculateAlcoholVolume,
  getAlcoholDensity
} from '../utils/calculations';

import { 
  ALCOHOL_DENSITIES, 
  SUGAR_WATER_PROPORTIONS 
} from '../utils/constants';

const { t } = useI18n();

const inputs = reactive({
  alcohol: '',
  alcoholStrength: 96,
  desiredStrength: '',
  sugarWaterRatio: '1:2'
});

const result = ref(null);
const error = ref('');

function validate() {
  if (!inputs.alcohol || !inputs.desiredStrength) {
    error.value = t('common.error');
    return false;
  }

  if (Number(inputs.desiredStrength) >= Number(inputs.alcoholStrength)) {
    error.value = t('common.error');
    return false;
  }

  error.value = '';
  return true;
}

/**
 * Given a syrup scaling factor k, compute:
 * - sugar mass
 * - water mass
 * - syrup volume
 * - required alcohol volume (for ABV)
 * - total mixture volume
 */
function computeForK(k, ratio, desiredStrength, alcoholStrength, alcoholMassInput) {
  const sugarBase = ratio.sugar;
  const waterBase = ratio.water;

  const sugarMass = k * sugarBase;
  const waterMass = k * waterBase;

  // Syrup volume with contraction
  const syrupVolume = calculateSyrupVolume(sugarMass, waterMass);

  // Alcohol volume from the alcohol MASS provided by user
  const alcoholVolume = calculateAlcoholVolume(alcoholMassInput, alcoholStrength);

  // Pure ethanol volume inside the added alcohol
  const ethanolVolume = alcoholVolume * (alcoholStrength / 100);

  // Final ABV requirement:
  // ethanolVolume / (syrupVolume + alcoholVolume) = desiredStrength
  const Sd = desiredStrength / 100;

  // We solve the target total volume requirement:
  // ethanolVolume = Sd * finalVolume  → finalVolume = ethanolVolume / Sd
  const finalVolumeTarget = ethanolVolume / Sd;

  // Total real mixture volume using density:
  const realTotalVolume = syrupVolume + alcoholVolume;

  return {
    sugarMass,
    waterMass,
    syrupVolume,
    alcoholVolume,
    realTotalVolume,
    finalVolumeTarget
  };
}

function calculate() {
  if (!validate()) return;

  const alcoholMassInput = Number(inputs.alcohol);
  const desiredStrength = Number(inputs.desiredStrength);
  const alcoholStrength = Number(inputs.alcoholStrength);

  const ratio = SUGAR_WATER_PROPORTIONS[inputs.sugarWaterRatio];

  // First, compute alcohol volume from the mass provided
  const alcoholVolume = calculateAlcoholVolume(alcoholMassInput, alcoholStrength);
  const ethanolVolume = alcoholVolume * (alcoholStrength / 100);

  // Final desired volume from ABV law
  const Sd = desiredStrength / 100;
  const finalVolumeTarget = ethanolVolume / Sd;

  // -------------------------------------------------------------------
  // Solve for k so that: syrupVolume + alcoholVolume = finalVolumeTarget
  // -------------------------------------------------------------------
  let kLow = 0;
  let kHigh = 1;
  let highData = computeForK(
    kHigh,
    ratio,
    desiredStrength,
    alcoholStrength,
    alcoholMassInput
  );

  let safety = 0;
  while (highData.realTotalVolume < finalVolumeTarget && safety < 50) {
    kHigh *= 2;
    highData = computeForK(
      kHigh,
      ratio,
      desiredStrength,
      alcoholStrength,
      alcoholMassInput
    );
    safety++;
  }

  if (highData.realTotalVolume < finalVolumeTarget) {
    error.value = t('common.error');
    result.value = null;
    return;
  }

  // Bisection search
  let best = null;
  for (let i = 0; i < 50; i++) {
    const kMid = (kLow + kHigh) / 2;

    const dataMid = computeForK(
      kMid,
      ratio,
      desiredStrength,
      alcoholStrength,
      alcoholMassInput
    );

    best = dataMid;

    const diff = dataMid.realTotalVolume - finalVolumeTarget;

    if (Math.abs(diff) < 0.0001) break;

    if (diff > 0) kHigh = kMid;
    else          kLow = kMid;
  }

  if (!best) {
    error.value = t('common.error');
    result.value = null;
    return;
  }

  // After solving:
  const sugarMassFinal = best.sugarMass;
  const waterMassFinal = best.waterMass;

  // Display results (finalVolumeTarget is what the user expects)
  result.value = {
    sugar: sugarMassFinal.toFixed(2),
    water: waterMassFinal.toFixed(2),
    totalVolume: finalVolumeTarget.toFixed(2) // matches UI expectation
  };
}
</script>

<template>
  <div>
    <div class="grid gap-6 mb-8">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.waterSugar.inputs.alcohol') }}
        </label>
        <input 
          type="number" 
          v-model="inputs.alcohol" 
          min="0"
          class="input-field"
        >
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.waterSugar.inputs.alcoholVol') }}
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
          {{ t('calculators.waterSugar.inputs.desiredStrength') }}
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
          {{ t('calculators.waterSugar.inputs.ratio') }}
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
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('common.results') }}</h3>
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
          <span class="text-gray-600">{{ t('common.totalVolume') }}:</span>
          <span class="font-medium">{{ result.totalVolume }} ml</span>
        </p>
      </div>
    </div>
  </div>
</template>
