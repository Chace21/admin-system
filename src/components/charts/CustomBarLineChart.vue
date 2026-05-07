<template>
  <div ref="chartRef" class="chart-container" :style="{ height }"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type {
  TooltipComponentOption,
  GridComponentOption,
  DataZoomComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { useEChart } from '@/composables/useEChart'
import {
  alignBarLineData,
  createAxisLabelFormatter,
  createCartesianBaseOption,
  createDataZoomPreset,
  mergeChartOption,
  type AxisValue,
  type SeriesValue
} from './utils'

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
>

echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer
])

const {
  xAxisData = [],
  barData: sourceBarData = [],
  lineData: sourceLineData = [],
  height = '400px',
  barColor = '#409eff',
  lineColor = '#ff4949',
  barAxisName = 'barData',
  lineAxisName = 'lineData',
  unit = '人',
  smooth = false,
  visibleCount = 6,
  optionOverrides = {}
} = defineProps<{
  xAxisData?: AxisValue[]
  barData?: SeriesValue[]
  lineData?: SeriesValue[]
  height?: string
  barColor?: string
  lineColor?: string
  barAxisName?: string
  lineAxisName?: string
  unit?: string
  smooth?: boolean
  visibleCount?: number
  optionOverrides?: Partial<ECOption>
}>()

const chartRef = ref<HTMLElement | null>(null)

function getOption(): ECOption {
  const { axisData, barData, lineData } = alignBarLineData(xAxisData, sourceBarData, sourceLineData)
  const axisLabelFormatter = createAxisLabelFormatter(unit)
  const dataZoomPreset = createDataZoomPreset(axisData.length, visibleCount)

  const baseOption: ECOption = {
    ...createCartesianBaseOption({
      axisData,
      dataZoomPreset
    }),
    yAxis: [
      {
        type: 'value',
        name: barAxisName,
        axisLabel: {
          formatter: axisLabelFormatter
        }
      },
      {
        type: 'value',
        name: lineAxisName,
        axisLabel: {
          formatter: axisLabelFormatter
        }
      }
    ],
    series: [
      {
        data: barData,
        type: 'bar',
        yAxisIndex: 0,
        itemStyle: {
          color: barColor
        }
      },
      {
        data: lineData,
        type: 'line',
        yAxisIndex: 1,
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
