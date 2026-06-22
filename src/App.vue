<script setup lang="ts">
import { computed, ref } from "vue";

import entries from "@/data/entries";
import { useTheme } from "@/composables/useTheme";
import AuroraBackground from "@/components/AuroraBackground.vue";
import ServiceCard from "@/components/ServiceCard.vue";

const { theme, toggle } = useTheme();

const search = ref("");

const groups = computed(() => {
  const query = search.value.trim().toLowerCase();

  return Object.entries(entries)
    .map(([host, services]) => {
      const origin = `https://${host}`;
      const items = services
        .filter((service) => {
          if (!query) return true;
          return (
            service.name.toLowerCase().includes(query) ||
            service.path.toLowerCase().includes(query) ||
            host.toLowerCase().includes(query)
          );
        })
        .map((service) => ({
          ...service,
          origin,
          url: `${origin}${service.path}`
        }));

      return { host, origin, items };
    })
    .filter((group) => group.items.length > 0);
});

const hasResults = computed(() => groups.value.length > 0);
</script>

<template>
  <AuroraBackground />

  <div class="relative z-10 min-h-screen">
    <header
      class="glass sticky top-0 z-20 flex items-center gap-4 px-5 py-3 sm:px-8"
    >
      <h1 class="text-xl font-bold tracking-tight">Portal</h1>

      <label class="relative ml-auto w-full max-w-xs">
        <span class="sr-only">Filter services</span>
        <input
          v-model="search"
          type="search"
          placeholder="filter services…"
          class="search w-full rounded-xl px-3 py-2 font-mono text-sm outline-none"
        />
      </label>

      <button
        type="button"
        class="toggle grid size-10 shrink-0 place-items-center rounded-xl"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
        @click="toggle"
      >
        <svg
          v-if="theme === 'dark'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </button>
    </header>

    <main class="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <section
        v-for="group in groups"
        :key="group.host"
        class="mb-12 last:mb-0"
      >
        <div class="mb-4 flex items-baseline gap-3">
          <span class="node-dot" aria-hidden="true"></span>
          <h2 class="font-mono text-sm" style="color: var(--text)">
            {{ group.host }}
          </h2>
          <span class="font-mono text-xs" style="color: var(--muted)">
            {{ group.items.length }}
            {{ group.items.length === 1 ? "service" : "services" }}
          </span>
        </div>

        <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
          <ServiceCard
            v-for="(item, index) in group.items"
            :key="item.url"
            :style="{ '--i': index }"
            :name="item.name"
            :path="item.path"
            :url="item.url"
            :origin="item.origin"
            :image="item.image"
          />
        </div>
      </section>

      <p
        v-if="!hasResults"
        class="mt-16 text-center font-mono text-sm"
        style="color: var(--muted)"
      >
        No services match “{{ search }}”.
      </p>
    </main>
  </div>
</template>

<style scoped>
.search {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text);
  transition: border-color 0.2s ease;
}

.search::placeholder {
  color: var(--muted);
}

.search:focus-visible {
  border-color: var(--color-accent);
}

.toggle {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.node-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 0 rgba(79, 140, 255, 0.6);
  animation: node-pulse 2.6s ease-out infinite;
}

@keyframes node-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 140, 255, 0.55);
  }
  70% {
    box-shadow: 0 0 0 0.5rem rgba(79, 140, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 140, 255, 0);
  }
}
</style>
