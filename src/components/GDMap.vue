<template>
  <div id="map">
    <el-card class="weather-info">
      <div v-for="(item, index) in weatherInfo" :key="index">
        {{ item.label }}: {{ item.value }} {{ item.unit }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const map = shallowRef()
const AMapUtil = shallowRef()
const locationUtil = shallowRef()
const weatherUtil = shallowRef()
const weatherInfo = ref([
  {
    label: '福田'
  },
  {
    label: '天气',
    prop: 'weather',
    value: ''
  },
  {
    label: '温度',
    prop: 'temperature',
    value: '',
    unit: '℃'
  },
  {
    label: '湿度',
    prop: 'humidity',
    value: '',
    unit: '%'
  }
])

window._AMapSecurityConfig = {
  securityJsCode: '8c8bca08360fedb1097b9e021901cc44'
}

function initMap() {
  AMapLoader.load({
    key: 'a5e2d4dc4e765ccf3cab13e8d7d444a2', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Geolocation', 'AMap.Weather'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      AMapUtil.value = AMap
      map.value = new AMap.Map('map', {
        // 设置地图容器id
        viewMode: '2D', // 2D地图模式
        zoom: 11, // 初始化地图级别
        center: [114.079262, 22.637489] // 初始化地图中心点位置
      })
      locationUtil.value = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 设置定位超时时间，默认：无穷大
        offset: [10, 20], // 定位按钮的停靠位置的偏移量
        zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        position: 'RT' //  定位按钮的排放位置,  LT表示左角
      })
      map.value.addControl(locationUtil.value)

      weatherUtil.value = new AMap.Weather()
      weatherUtil.value.getLive('福田', function (err, liveData) {
        weatherInfo.value.forEach((item) => {
          item.value = liveData[item.prop] || ''
        })
      })

      weatherUtil.value.getForecast('福田', function (err, forecastData) {
        console.log(forecastData)
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped lang="scss">
#map {
  width: 100%;
  height: calc(100vh - 120px);
}

.weather-info {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
}
</style>
