export type AxisValue = string | number
export type SeriesValue = string | number
export type PieDatum = { name: string; value: number }
type PlainObject = Record<string, unknown>

export interface DataZoomPreset {
  dataZoom: Array<{
    type: 'inside' | 'slider'
    startValue: number
    endValue: number
    bottom?: number
    height?: number
  }>
  gridBottom: number | string
}

interface CartesianBaseOptionInput {
  axisData: AxisValue[]
  dataZoomPreset?: DataZoomPreset
}

export function alignAxisAndSeries(axisData: AxisValue[], seriesData: SeriesValue[]) {
  const len = Math.min(axisData.length, seriesData.length)
  return {
    axisData: axisData.slice(0, len),
    seriesData: seriesData.slice(0, len)
  }
}

export function alignBarLineData(
  axisData: AxisValue[],
  barData: SeriesValue[],
  lineData: SeriesValue[]
) {
  const len = Math.min(axisData.length, barData.length, lineData.length)
  return {
    axisData: axisData.slice(0, len),
    barData: barData.slice(0, len),
    lineData: lineData.slice(0, len)
  }
}

export function sanitizePieData(data: PieDatum[]) {
  return data.filter((item) => item.name.trim() && Number.isFinite(item.value) && item.value >= 0)
}

export function createDataZoomPreset(
  dataLength: number,
  visibleCount: number
): DataZoomPreset | undefined {
  const safeVisibleCount = Math.max(1, Math.floor(visibleCount))
  const needDataZoom = dataLength > safeVisibleCount
  if (!needDataZoom) {
    return undefined
  }

  const endValue = Math.min(dataLength - 1, safeVisibleCount - 1)
  return {
    gridBottom: 56,
    dataZoom: [
      {
        type: 'inside',
        startValue: 0,
        endValue
      },
      {
        type: 'slider',
        bottom: 8,
        height: 18,
        startValue: 0,
        endValue
      }
    ]
  }
}

export function createAxisLabelFormatter(unit: string) {
  return unit ? `{value}${unit}` : '{value}'
}

export function createCartesianBaseOption(input: CartesianBaseOptionInput) {
  return {
    tooltip: {
      trigger: 'axis' as const
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: input.dataZoomPreset?.gridBottom ?? '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: input.axisData
    },
    dataZoom: input.dataZoomPreset?.dataZoom
  }
}

function isPlainObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function mergeChartOption<T extends PlainObject>(base: T, overrides?: Partial<T>): T {
  if (!overrides) {
    return base
  }

  const result: PlainObject = { ...base }

  for (const [key, overrideValue] of Object.entries(overrides)) {
    if (overrideValue === undefined) {
      continue
    }

    const baseValue = result[key]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = mergeChartOption(baseValue, overrideValue)
      continue
    }

    result[key] = overrideValue
  }

  return result as T
}
