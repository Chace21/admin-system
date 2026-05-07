export type TableAlign = 'left' | 'center' | 'right'

export type TableFixed = boolean | 'left' | 'right'

export type TableRow = Record<string, unknown>
export type TableRowKey = string | number

export interface TableColumnItem {
  columnKey?: string
  prop?: string
  label?: string
  align?: TableAlign
  headerAlign?: TableAlign
  width?: string | number
  minWidth?: string | number
  fixed?: TableFixed
  sortable?: boolean | 'custom'
  headerCustom?: boolean
  headerSlotName?: string
  valueSlotName?: string
  children?: TableColumnItem[]
  suffix?: string
  defaultValue?: string
}

export interface TableOptions {
  showSelection?: boolean
  selectionWidth?: string | number
  selectionAlign?: TableAlign
  selectionHeaderAlign?: TableAlign
  selectionFixed?: TableFixed
  showIndex?: boolean
  indexLabel?: string
  indexWidth?: string | number
  indexAlign?: TableAlign
  indexHeaderAlign?: TableAlign
  indexFixed?: TableFixed
  pageIndex?: number
  pageSize?: number
  rowKey?: string
}

export interface PaginationProps {
  total?: number
  pageSize?: number
  currentPage?: number
  pageSizes?: number[]
  layout?: string
}

export interface CustomTableProps {
  tableData?: TableRow[]
  tableHead?: TableColumnItem[]
  tableObj?: TableOptions
}

export interface CustomTableColumnProps {
  column: TableColumnItem
}

export interface PaginationEmits {
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}
