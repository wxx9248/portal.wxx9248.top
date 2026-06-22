<script setup lang="ts"></script>

<template>
  <div class="aurora" aria-hidden="true">
    <span class="blob blob-blue"></span>
    <span class="blob blob-sky"></span>
    <span class="blob blob-indigo"></span>
  </div>
</template>

<style scoped>
.aurora {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: var(--aurora-opacity);
  transition: opacity 0.5s ease;
}

.blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
}

.blob-blue {
  width: 48vw;
  height: 48vw;
  top: -12%;
  left: -8%;
  background: var(--color-aurora-blue);
  animation: drift-a 19s ease-in-out infinite alternate;
}

.blob-sky {
  width: 42vw;
  height: 42vw;
  top: 20%;
  right: -10%;
  background: var(--color-aurora-sky);
  animation: drift-b 23s ease-in-out infinite alternate;
}

.blob-indigo {
  width: 40vw;
  height: 40vw;
  bottom: -15%;
  left: 25%;
  background: var(--color-aurora-indigo);
  animation: drift-c 27s ease-in-out infinite alternate;
}
</style>
