<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  name: string;
  path: string;
  url: string;
  origin: string;
  image?: string;
}>();

// Favicon fallback chain: explicit override → service-path favicon → host-root
// favicon → monogram tile.
const candidates = computed(() => {
  if (props.image) return [props.image];
  const atPath = `${props.origin}${props.path}favicon.ico`;
  const atRoot = `${props.origin}/favicon.ico`;
  return atRoot === atPath ? [atPath] : [atPath, atRoot];
});

const step = ref(0);
const exhausted = ref(false);
const currentSrc = computed(() => candidates.value[step.value]);
const showMonogram = computed(() => exhausted.value);
const monogram = computed(() => props.name.charAt(0).toUpperCase());

function onImageError() {
  if (step.value < candidates.value.length - 1) {
    step.value += 1;
  } else {
    exhausted.value = true;
  }
}

// Track the cursor so the local aurora glow follows it across the tile.
function onPointerMove(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}
</script>

<template>
  <a
    class="card glass group relative flex flex-col gap-4 rounded-2xl p-5 no-underline"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    @pointermove="onPointerMove"
  >
    <span class="glow" aria-hidden="true"></span>

    <span class="media relative flex size-14 items-center justify-center">
      <img
        v-if="!showMonogram"
        :src="currentSrc"
        :alt="`${name} icon`"
        class="size-10 object-contain"
        loading="lazy"
        @error="onImageError"
      />
      <span v-else class="monogram" aria-hidden="true">{{ monogram }}</span>
    </span>

    <span class="relative flex flex-col gap-1">
      <span class="text-lg font-medium leading-tight">{{ name }}</span>
      <span class="font-mono text-xs" style="color: var(--muted)">{{
        path
      }}</span>
    </span>

    <svg
      class="arrow absolute right-4 top-4 size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  </a>
</template>

<style scoped>
.card {
  color: var(--text);
  animation: rise 0.5s ease backwards;
  animation-delay: calc(var(--i, 0) * 55ms);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  overflow: hidden;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-6px);
  border-color: var(--glass-border-hover);
  box-shadow: 0 18px 50px -12px rgba(79, 140, 255, 0.4);
  outline: none;
}

/* The signature: a local aurora glow that tracks the cursor on hover/focus. */
.glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(
    18rem 18rem at var(--mx, 50%) var(--my, 50%),
    rgba(79, 140, 255, 0.35),
    rgba(56, 189, 248, 0.12) 45%,
    transparent 70%
  );
}

.card:hover .glow,
.card:focus-visible .glow {
  opacity: 1;
}

.monogram {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 0.85rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--color-aurora-blue),
    var(--color-aurora-sky)
  );
}

.arrow {
  color: var(--muted);
  opacity: 0;
  transform: translate(-2px, 2px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    color 0.25s ease;
}

.card:hover .arrow,
.card:focus-visible .arrow {
  color: var(--color-accent);
  opacity: 1;
  transform: none;
}
</style>
