export function handleEmptyValue(value: any, defaultValue: string = '-', suffix: string = '') {
  let formattedValue = value
  if (value === null || value === undefined || value === '') {
    formattedValue = defaultValue
  }
  return formattedValue + suffix
}
