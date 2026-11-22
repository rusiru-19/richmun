<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useScale } from './composables/useScale'
import { initSmoothScroll, ScrollTrigger } from './composables/useSmoothScroll'
import { initHoverSounds } from './composables/useAudio'
import Preloader from './components/Preloader.vue'
import FrameHUD from './components/FrameHUD.vue'
import MenuOverlay from './components/MenuOverlay.vue'
import ConsoleOverlay from './components/ConsoleOverlay.vue'
import ResolutionGuard from './components/ResolutionGuard.vue'
import HeroSection from './components/HeroSection.vue'
import CardShowcase from './components/CardShowcase.vue'
import FooterSection from './components/FooterSection.vue'

const ready = ref(false), active = ref('hero'), theme = ref('dark')
const menuOpen = ref(false), consoleOpen = ref(false)
const nav = [{ id: 'hero', label: 'Home' }, { id: 'showcase', label: 'Committees' }, { id: 'footer', label: 'Register' }]
const openConsole = () => { menuOpen.value = false; consoleOpen.value = true }

useScale()
onMounted(() => { initSmoothScroll(); initHoverSounds() })

const onLoaded = async () => {
  ready.value = true
  await nextTick()
  document.querySelectorAll('[data-section]').forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: 'top 50%', end: 'bottom 50%',
      onToggle: (s) => { if (s.isActive) { active.value = el.id; theme.value = el.dataset.theme } } }))
  ScrollTrigger.refresh()
}
</script>

<template>
  <ResolutionGuard />
  <Preloader v-if="!ready" @done.once="onLoaded" />
  <FrameHUD :sections="nav" :active="active" :theme="theme" @menu="menuOpen = true" @console="consoleOpen = true" />
  <MenuOverlay :open="menuOpen" :active="active" @close="menuOpen = false" @console="openConsole" />
  <ConsoleOverlay :open="consoleOpen" @close="consoleOpen = false" />
  <main>
    <HeroSection :ready="ready" @theme="theme = $event" />
    <CardShowcase @theme="theme = $event" />
    <FooterSection />
  </main>
</template>
