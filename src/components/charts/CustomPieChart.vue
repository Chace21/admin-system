<template>
  <div :id="chartId" class="chart-container"></div>
</template>

<script setup lang="ts">
import { handleEmptyValue } from '@/utils/format'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  // 系列类型的定义后缀都为 SeriesOption
  PieSeriesOption
} from 'echarts/charts'
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
  PieSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  PieChart
])

const {
  color = [],
  chartId = 'pie-chart',
  unit = '',
  showTooltip = true,
  showLegend = true,
  pieData = []
} = defineProps<{
  color?: string[]
  chartId?: string
  showTooltip?: boolean
  showLegend?: boolean
  unit?: string
  pieData?: Array<{ name: string; value: number }>
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
  if (pieData.length === 0) return

  // 初始化图表实例
  if (!chartInstance) {
    chartInstance = echarts.init(dom)
  }

  const seriesData = generateSeriesData()

  const option: ECOption = {
    tooltip: {
      show: showTooltip,
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      },
      valueFormatter: (value) => {
        return handleEmptyValue(value, '-', unit)
      }
    },

    legend: {
      show: showLegend
    },
    series: {
      type: 'pie',
      data: seriesData
    }
  }

  chartInstance.setOption(option, true)

  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(resizeChart)
    resizeObserver.observe(dom)
  }
}

function generateSeriesData() {
  return pieData.map((item, index) => {
    const itemStyle: { color?: string } = {}
    // 如果传入了颜色数组，就使用数组中的颜色，否则使用默认颜色
    if (color.length > 0) itemStyle.color = color[index] || color[0]

    return {
      ...item,
      itemStyle
    }
  })
}

watch(
  () => [pieData],
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
}
</style>
