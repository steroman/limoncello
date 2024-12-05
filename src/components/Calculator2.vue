<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import HelperText from './HelperText.vue';
import { 
  calculateAlcoholVolume,
  calculateTotalVolume,
  calculateAlcoholContent 
} from '../utils/calculations';
import { ALCOHOL_DENSITIES, SUGAR_WATER_PROPORTIONS } from '../utils/constants';

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
  error.value = '';
  return true;
}

function calculate() {
  if (!validate()) return;

  // Step 1: Calculate alcohol volume in ml
  const alcoholVol = calculateAlcoholVolume(inputs.alcohol, inputs.alcoholStrength);
  const alcoholContentVol = alcoholVol * (inputs.alcoholStrength / 100);

  // Step 2: Calculate required total volume based on desired strength
  const totalRequiredVolume = alcoholContentVol / (inputs.desiredStrength / 100);

  // Step 3: Calculate remaining volume (water + sugar)
  const remainingVolume = totalRequiredVolume - alcoholVol;

  // Step 4: Get sugar-to-water ratio
  const ratio = SUGAR_WATER_PROPORTIONS[inputs.sugarWaterRatio];
  const sugarToWaterRatio = ratio.sugar / ratio.water;

  // Step 5: Calculate water and sugar masses
  const requiredWaterMass = remainingVolume / (1 + sugarToWaterRatio); // No rounding
  const requiredSugarMass = requiredWaterMass * sugarToWaterRatio; // No rounding

  // Step 6: Assign results with final rounding for display
  result.value = {
    sugar: requiredSugarMass.toFixed(2),
    water: requiredWaterMass.toFixed(2),
    totalVolume: totalRequiredVolume.toFixed(2),
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