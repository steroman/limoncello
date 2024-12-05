<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' }
];
</script>

<template>
  <select 
    v-model="locale"
    class="px-2 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  >
    <option 
      v-for="lang in languages" 
      :key="lang.code" 
      :value="lang.code"
    >
      {{ lang.name }}
    </option>
  </select>
</template>