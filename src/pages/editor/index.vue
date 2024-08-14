<template>
  <div>
    <h1>editor page</h1>
    <div>{{ path }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const path = ref(route.query.path);
</script>

<style scoped lang="less"></style>
