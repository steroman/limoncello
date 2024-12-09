<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import HelperText from './HelperText.vue';
import { 
  calculateSugarVolume, 
  calculateWaterVolume,
  calculateAlcoholVolume, 
  calculateTotalVolume,
  calculateAlcoholContent 
} from '../utils/calculations';
import { ALCOHOL_DENSITIES } from '../utils/constants';

const { t } = useI18n();

const inputs = reactive({
  sugar: '',
  water: '',
  alcohol: '',
  alcoholStrength: 96
});

const result = ref(null);
const error = ref('');

function validate() {
  if (!inputs.sugar || !inputs.water || !inputs.alcohol) {
    error.value = t('common.error');
    return false;
  }
  error.value = '';
  return true;
}

function calculate() {
  if (!validate()) return;

  // Step 1: Water and alcohol volumes (remain unchanged)
  const waterVol = calculateWaterVolume(inputs.water); // Water is 1:1 mass-to-volume
  const alcoholVol = calculateAlcoholVolume(inputs.alcohol, inputs.alcoholStrength);

  // Step 2: Add sugar as mass directly to the total volume
  const sugarMass = inputs.sugar; // Keep sugar as mass, do not convert to volume
  const totalVol = waterVol + alcoholVol + sugarMass; // Add sugar mass directly

  // Step 3: Calculate the alcohol content
  const alcoholContent = calculateAlcoholContent(alcoholVol, inputs.alcoholStrength, totalVol);

  // Step 4: Format results
  result.value = {
    totalVolume: totalVol.toFixed(2),
    alcoholContent: alcoholContent.toFixed(2),
  };
}

</script>

<template>
  <div>
    <div class="grid gap-6 mb-8">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.volume.inputs.sugar') }}
        </label>
        <input 
          type="number" 
          v-model="inputs.sugar" 
          min="0"
          class="input-field"
        >
        <HelperText :text="t('calculators.volume.inputs.sugarHelper')" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.volume.inputs.water') }}
        </label>
        <input 
          type="number" 
          v-model="inputs.water" 
          min="0"
          class="input-field"
        >
        <HelperText :text="t('calculators.volume.inputs.waterHelper')" />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ t('calculators.volume.inputs.alcohol') }}
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
          {{ t('calculators.volume.inputs.alcoholVol') }}
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
          <span class="text-gray-600">{{ t('common.totalVolume') }}:</span>
          <span class="font-medium">{{ result.totalVolume }} ml</span>
        </p>
        <p class="flex justify-between">
          <span class="text-gray-600">{{ t('common.finalStrength') }}:</span>
          <span class="font-medium">{{ result.alcoholContent }}%</span>
        </p>
      </div>
    </div>
  </div>
</template>