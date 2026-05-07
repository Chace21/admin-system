<template>
  <div ref="chartRef" class="chart-container" :style="{ height }"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesOption } from 'echarts/charts'
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
  BarSeriesOption | TooltipComponentOption | GridComponentOption | DataZoomComponentOption
>

echarts.use([TooltipComponent, GridComponent, DataZoomComponent, BarChart, CanvasRenderer])

const {
  xAxisData = [],
  barData = [],
  height = '400px',
  barColor = '#409eff',
  yAxisName = '',
  unit = '',
  visibleCount = 6,
  optionOverrides = {}
} = defineProps<{
  xAxisData?: AxisValue[]
  barData?: SeriesValue[]
  height?: string
  barColor?: string
  yAxisName?: string
  unit?: string
  visibleCount?: number
  optionOverrides?: Partial<ECOption>
}>()

const chartRef = ref<HTMLElement | null>(null)

function getOption(): ECOption {
  const { axisData, seriesData } = alignAxisAndSeries(xAxisData, barData)
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
        type: 'bar',
        itemStyle: {
          color: barColor
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
