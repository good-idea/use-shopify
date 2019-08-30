/* Get the last item in an array */

export const tail = <T>(arr: T[]): T | undefined =>
  arr.length ? arr[arr.length - 1] : undefined
