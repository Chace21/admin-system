import * as echarts from 'echarts/core'
import type { Ref, WatchSource } from 'vue'
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'

interface UseEChartOptions<TOption> {
  chartRef: Ref<HTMLElement | null>
  getOption: () => TOption
  watchSource: WatchSource | WatchSource[]
  watchDeep?: boolean
  autoResize?: boolean
}

export function useEChart<TOption>(options: UseEChartOptions<TOption>) {
  const chartInstance = shallowRef<echarts.ECharts | null>(null)
  let resizeObserver: ResizeObserver | null = null

  const resizeChart = () => {
    chartInstance.value?.resize()
  }

  const initChart = () => {
    if (!options.chartRef.value || chartInstance.value) {
      return
    }

    chartInstance.value = echarts.init(options.chartRef.value)
    chartInstance.value.setOption(options.getOption())

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeChart()
      })
      resizeObserver.observe(options.chartRef.value)
    }
  }

  const updateChart = () => {
    if (!chartInstance.value) {
      initChart()
      return
    }

    chartInstance.value.setOption(options.getOption(), { notMerge: true })
  }

  onMounted(() => {
    initChart()
    if (options.autoResize ?? true) {
      window.addEventListener('resize', resizeChart)
    }
  })

  watch(
    options.watchSource,
    () => {
      updateChart()
    },
    { deep: options.watchDeep ?? true }
  )

  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart)
    resizeObserver?.disconnect()
    chartInstance.value?.dispose()
    chartInstance.value = null
  })

  return {
    chartInstance,
    initChart,
    updateChart,
    resizeChart
  }
}
