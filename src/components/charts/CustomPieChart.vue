<template>
  <div ref="chartRef" class="chart-container" :style="{ height }"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { PieSeriesOption } from 'echarts/charts'
import type { TooltipComponentOption, LegendComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { useEChart } from '@/composables/useEChart'
import { mergeChartOption, sanitizePieData, type PieDatum } from './utils'

type ECOption = ComposeOption<PieSeriesOption | TooltipComponentOption | LegendComponentOption>

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

const {
  pieData = [],
  height = '400px',
  radius = ['40%', '70%'],
  showLegend = true,
  optionOverrides = {}
} = defineProps<{
  pieData?: PieDatum[]
  height?: string
  radius?: [string, string]
  showLegend?: boolean
  optionOverrides?: Partial<ECOption>
}>()

const chartRef = ref<HTMLElement | null>(null)

function getOption(): ECOption {
  const safePieData = sanitizePieData(pieData)

  const baseOption: ECOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: showLegend
      ? {
          top: '5%',
          left: 'center'
        }
      : undefined,
    series: [
      {
        data: safePieData,
        type: 'pie',
        radius,
        avoidLabelOverlap: true,
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }

  return mergeChartOption(baseOption, optionOverrides)
}

const chartOption = computed(() => getOption())

useEChart({
  chartRef,
  getOption: () => chartOption.value,
  watchSource: chartOption,
  watchDeep: false
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>
