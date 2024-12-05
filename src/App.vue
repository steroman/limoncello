<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Calculator1 from './components/Calculator1.vue';
import Calculator2 from './components/Calculator2.vue';
import Calculator3 from './components/Calculator3.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

const { t } = useI18n();
const activeTab = ref(0);

const tabs = computed(() => [
  { id: 0, name: t('calculators.volume.title'), description: t('calculators.volume.description') },
  { id: 1, name: t('calculators.waterSugar.title'), description: t('calculators.waterSugar.description') },
  { id: 2, name: t('calculators.ingredients.title'), description: t('calculators.ingredients.description') }
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center relative mb-8">
        <h1 class="text-3xl font-bold text-gray-900 inline-block">
          {{ t('common.title') }}
        </h1>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <LanguageSwitcher />
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 mb-8">
        <button 
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="bg-white rounded-lg p-6 text-left transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="[
            activeTab === tab.id
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : ''
          ]"
        >
          <h3 class="font-medium text-lg text-gray-900 mb-2" :class="[
            activeTab === tab.id ? 'text-blue-600' : ''
          ]">
            {{ tab.name }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ tab.description }}
          </p>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <Calculator1 v-if="activeTab === 0" />
        <Calculator2 v-if="activeTab === 1" />
        <Calculator3 v-if="activeTab === 2" />
      </div>
    </div>
  </div>
</template>