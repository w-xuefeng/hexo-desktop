<template>
  <div class="not-found-body">
    <div class="not-found-main">
      <div class="fof">
        <h1>404 Not Found</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
* {
  transition: all 0.6s;
}

.not-found-body {
  height: 100%;
  font-family: 'Lato', sans-serif;
  color: #888;
  margin: 0;

  .not-found-main {
    display: table;
    width: 100%;
    height: 100vh;
    text-align: center;

    .fof {
      display: table-cell;
      vertical-align: middle;

      h1 {
        font-size: 50px;
        display: inline-block;
        padding-right: 12px;
        animation: type .5s alternate infinite;
      }
    }
  }
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }

  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}
</style>
