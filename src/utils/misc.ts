export const debounce = <F extends (...args: any) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: ReturnType<typeof setTimeout>

  const debounced = (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}
//
// function _debounce<T extends Function>(fn: T, delay) {
//   let timer = null
//   return function(...args: any) {
//     const context = this
//     clearTimeout(timer)
//     timer = setTimeout(function() {
//       fn.apply(context, args)
//     }, delay)
//   }
// }
