import { createInterpolable } from './utils'

class InterpolableArray implements Interpolable<InterpolableArray, any[]> {
  values: any[]

  constructor(values: any[]) {
    this.values = values
  }

  interpolate(endInterpolable: InterpolableArray, t: number): InterpolableArray {
    const start = this.values
    const end = endInterpolable.values
    const newValues: any[] = []
    const minLength = Math.min(start.length, end.length)
    for (let i = 0; i < minLength; i++) {
      if (start[i].interpolate != null) {
        newValues.push(start[i].interpolate(end[i], t))
      } else {
        newValues.push(start[i])
      }
    }
    return new InterpolableArray(newValues)
  }

  format(): any[] {
    return this.values.map((val) => {
      if (val.format != null) {
        return val.format()
      } else {
        return val
      }
    })
  }

  static createFromArray(arr: any[]): InterpolableArray | null {
    let values = arr.map((val) => {
      return createInterpolable(val) || val
    })
    values = values.filter((val) => {
      return val != null
    })
    return new InterpolableArray(values)
  }

  static create(value: any): InterpolableArray | null {
    if (value instanceof Array) {
      return InterpolableArray.createFromArray(value)
    }
    return null
  }
}

export default InterpolableArray
