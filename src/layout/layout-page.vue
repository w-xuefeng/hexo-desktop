<template>
  <div>
    <div class="nav">
      <button
        v-if="$route.path !== '/404'"
        @click="$router.push('/404')"
      >
        404
      </button>
      <button
        v-if="$route.path === '/404'"
        @click="$router.back()"
      >
        back
      </button>
    </div>

    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.nav {
  display: flex;
}
</style>
