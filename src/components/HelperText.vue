<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <p class="mt-1 text-sm text-gray-500">{{ text }}</p>
</template>