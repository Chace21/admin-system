<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
const T = window.T

onMounted(() => {
  const map = new T.Map('map')
  map.centerAndZoom(new T.LngLat(116.40769, 39.89945), 10)
})
</script>

<style scoped lang="scss">
#map {
  width: 100vw;
  height: 100vh;
}
</style>
