<template>
  <div :id="chartId" class="chart-container"></div>
</template>

<script setup lang="ts">
import { handleEmptyValue } from '@/utils/format'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  // 系列类型的定义后缀都为 SeriesOption
  LineSeriesOption
} from 'echarts/charts'
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
  DataZoomComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart
])

const {
  color = [],
  chartId = 'line-chart',
  yAxisName = '',
  unit = '',
  showTooltip = true,
  showLegend = true,
  xAxisData = [],
  gridConfig = {},
  lineData = [],
  zoomEnd = 6
} = defineProps<{
  color?: string[]
  chartId?: string
  gridConfig?: GridComponentOption
  yAxisName?: string
  showTooltip?: boolean
  showLegend?: boolean
  unit?: string
  xAxisData?: Array<string | number>
  lineData?: Array<{ name: string; value: (number | null)[] }>
  zoomEnd?: number
}>()

let chartInstance: echarts.ECharts | null
let resizeObserver: ResizeObserver | null

function resizeChart() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function renderChart() {
  // 检查图表容器是否存在
  const dom = document.getElementById(chartId)
  if (!dom) return

  // 检查数据是否为空
  if (xAxisData.length === 0 || lineData.length === 0) return

  // 初始化图表实例
  if (!chartInstance) {
    chartInstance = echarts.init(dom)
  }

  const seriesConfig = generateSeriesOption()

  const option: ECOption = {
    tooltip: {
      show: showTooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      appendTo: dom,
      formatter: (params) => {
        const dataIndex = params[0]?.dataIndex
        let htmlStr = '<div>' + xAxisData[dataIndex] + '</div>'
        lineData.forEach((item) => {
          htmlStr +=
            '<div class="flex">' +
            item.name +
            '<div class="value">' +
            handleEmptyValue(item.value[dataIndex], '-', unit) +
            '</div>' +
            '</div>'
        })
        return htmlStr
      }
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '5%',
      ...gridConfig
    },
    legend: {
      show: showLegend
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      alignTicks: true
    },
    series: seriesConfig,
    dataZoom: {
      type: 'inside',
      startValue: Math.max(0, xAxisData.length - zoomEnd),
      endValue: xAxisData.length - 1
    }
  }

  chartInstance.setOption(option, true)

  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(resizeChart)
    resizeObserver.observe(dom)
  }
}

function generateSeriesOption(): LineSeriesOption[] {
  return lineData.map((item, index) => {
    const itemStyle: { color?: string } = {}
    // 如果传入了颜色数组，就使用数组中的颜色，否则使用默认颜色
    if (color.length > 0) itemStyle.color = color[index] || color[0]

    return {
      type: 'line',
      name: item.name,
      data: item.value,
      yAxisIndex: 0,
      itemStyle
    }
  })
}

watch(
  () => [xAxisData, lineData],
  () => {
    renderChart()
  }
)

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  resizeObserver?.disconnect()
  resizeObserver = null
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style lang="scss" scoped>
.chart-container {
  height: 400px;
  :deep(.flex) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .value {
      margin-left: 20px;
    }
  }
}
</style>
