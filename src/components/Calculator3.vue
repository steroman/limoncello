<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import HelperText from './HelperText.vue';
import { 
  calculateAlcoholVolume,
  calculateTotalVolume,
  getAlcoholDensity
} from '../utils/calculations';
import { ALCOHOL_DENSITIES, SUGAR_WATER_PROPORTIONS } from '../utils/constants';

const { t } = useI18n();

const inputs = reactive({
  totalVolume: '',
  desiredStrength: '',
  alcoholStrength: 96,
  sugarWaterRatio: '1:2'
});

const result = ref(null);
const error = ref('');

function validate() {
  if (!inputs.totalVolume || !inputs.desiredStrength) {
    error.value = t('common.error');
    return false;
  }
  error.value = '';
  return true;
}

function calculate() {
  if (!validate()) return;

  // Step 1: Calculate the desired alcohol content in the final volume
  const desiredAlcoholContent = inputs.totalVolume * (inputs.desiredStrength / 100); // Volume of pure alcohol (ml)
  
  // Step 2: Calculate the required alcohol volume based on alcohol strength
  const requiredAlcoholVolume = desiredAlcoholContent / (inputs.alcoholStrength / 100); // Total alcohol volume (ml)
  
  // Step 3: Convert alcohol volume to weight using density
  const alcoholDensity = getAlcoholDensity(inputs.alcoholStrength);
  const requiredAlcoholWeight = (requiredAlcoholVolume * alcoholDensity) / 1000; // Weight in grams

  // Step 4: Calculate the remaining volume (sugar + water)
  const remainingVolume = inputs.totalVolume - requiredAlcoholVolume; // Remaining volume in ml

  // Step 5: Allocate remaining volume into sugar and water (by mass)
  const ratio = SUGAR_WATER_PROPORTIONS[inputs.sugarWaterRatio];
  const totalParts = ratio.sugar + ratio.water; // Total parts in the ratio
  const sugarProportion = ratio.sugar / totalParts;
  const waterProportion = ratio.water / totalParts;

  // Calculate sugar and water masses
  const requiredSugarMass = remainingVolume * sugarProportion; // Sugar mass in grams
  const requiredWaterMass = remainingVolume * waterProportion; // Water mass in grams

  // Step 6: Return results
  result.value = {
    sugar: requiredSugarMass.toFixed(2),
    water: requiredWaterMass.toFixed(2),
    alcohol: requiredAlcoholWeight.toFixed(2),
    totalVolume: inputs.totalVolume.toFixed(2) // Ensure total volume is included in the output
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
          <span class="text-gray-600">{{ t('common.requiredAlcohol') }}:</span>
          <span class="font-medium">{{ result.alcohol }} g</span>
        </p>
      </div>
    </div>
  </div>
</template>