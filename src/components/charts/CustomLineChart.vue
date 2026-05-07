<template>
  <div ref="chartRef" class="chart-container" :style="{ height }"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { LineSeriesOption } from 'echarts/charts'
import type {
  TooltipComponentOption,
  GridComponentOption,
  DataZoomComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { useEChart } from '@/composables/useEChart'
import {
  alignAxisAndSeries,
  createAxisLabelFormatter,
  createCartesianBaseOption,
  createDataZoomPreset,
  mergeChartOption,
  type AxisValue,
  type SeriesValue
} from './utils'

type ECOption = ComposeOption<
  LineSeriesOption | TooltipComponentOption | GridComponentOption | DataZoomComponentOption
>

echarts.use([TooltipComponent, GridComponent, DataZoomComponent, LineChart, CanvasRenderer])

const {
  xAxisData = [],
  lineData = [],
  height = '400px',
  lineColor = '#409eff',
  smooth = false,
  yAxisName = '',
  unit = '',
  visibleCount = 6,
  optionOverrides = {}
} = defineProps<{
  xAxisData?: AxisValue[]
  lineData?: SeriesValue[]
  height?: string
  lineColor?: string
  smooth?: boolean
  yAxisName?: string
  unit?: string
  visibleCount?: number
  optionOverrides?: Partial<ECOption>
}>()

const chartRef = ref<HTMLElement | null>(null)

function getOption(): ECOption {
  const { axisData, seriesData } = alignAxisAndSeries(xAxisData, lineData)
  const axisLabelFormatter = createAxisLabelFormatter(unit)
  const dataZoomPreset = createDataZoomPreset(axisData.length, visibleCount)

  const baseOption: ECOption = {
    ...createCartesianBaseOption({
      axisData,
      dataZoomPreset
    }),
    yAxis: {
      type: 'value',
      name: yAxisName,
      axisLabel: {
        formatter: axisLabelFormatter
      }
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        smooth,
        itemStyle: {
          color: lineColor
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
