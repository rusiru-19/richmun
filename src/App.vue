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
import StorySection from './components/StorySection.vue'
import HudSection from './components/HudSection.vue'
import CollectionSection from './components/CollectionSection.vue'
import GallerySection from './components/GallerySection.vue'
import TableauScene from './components/TableauScene.vue'
import FinalCTA from './components/FinalCTA.vue'
import FooterSection from './components/FooterSection.vue'

const ready = ref(false), active = ref('hero'), theme = ref('dark')
const menuOpen = ref(false), consoleOpen = ref(false)
const nav = [{ id: 'hero', label: 'Home' }, { id: 'story', label: 'Story' }, { id: 'collection', label: 'Collection' }, { id: 'scene-1', label: 'World' }]
const scenes = [
  { id: 'scene-1', seed: 'dust-city', text: '[Scene one description — one line.]', caption: 'Location 01' },
  { id: 'scene-2', seed: 'neon-alley', text: '[Scene two description — one line.]', caption: 'Location 02' },
  { id: 'scene-3', seed: 'green-ruins', text: '[Scene three description — one line.]', caption: 'Location 03' }
]
const img = (s) => `https://picsum.photos/seed/${s}/1920/1080`
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
  <Preloader @done="onLoaded" />
  <FrameHUD :sections="nav" :active="active" :theme="theme" @menu="menuOpen = true" @console="consoleOpen = true" />
  <MenuOverlay :open="menuOpen" :active="active" @close="menuOpen = false" @console="openConsole" />
  <ConsoleOverlay :open="consoleOpen" @close="consoleOpen = false" />
  <main>
    <HeroSection :ready="ready" @theme="theme = $event" />
    <CardShowcase />
    <StorySection />
    <HudSection />
    <CollectionSection />
    <GallerySection />
    <TableauScene v-for="(s, i) in scenes" :key="s.id" :id="s.id" :image="img(s.seed)"
      :prev-image="img(i ? scenes[i - 1].seed : 'ruin-sky')" :text="s.text" :caption="s.caption" />
    <FinalCTA />
    <FooterSection />
  </main>
</template>