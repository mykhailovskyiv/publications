<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, ref } from 'vue';
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
  <footer class="footer">
    <p>&copy; {{ currentYear }} Valerii Mykhailovskyi</p>
  </footer>
</template>

<style>
#app {
  font-family: Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  background-color: var(--color-background);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2rem;
  max-width: 1280px;
  min-width: 1024px;

  width: 100%;
  margin: 0 auto;
}
@media (max-width: 1024px) {
  #app {
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  #app {
    padding: 2rem;
  }
}

footer {
  margin-top: auto;
  padding: 1rem 0;
  font-size: 14px;
  color: var(--color-text);
  text-align: center;
}

footer p {
  margin: 0;
  font-weight: normal;
  color: var(--color-text-light-2);
}
</style>
