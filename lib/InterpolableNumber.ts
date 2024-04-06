import { roundf } from './utils'

class InterpolableNumber implements Interpolable<InterpolableNumber, number> {
  value: number

  constructor(value: string | number) {
    if (typeof value === 'string') {
      this.value = parseFloat(value)
    } else {
      this.value = value
    }
    this.interpolate = this.interpolate.bind(this)
    this.format = this.format.bind(this)
  }

  interpolate(endInterpolable: InterpolableNumber, t: number): InterpolableNumber {
    const start = this.value
    const end = endInterpolable.value
    return new InterpolableNumber((end - start) * t + start)
  }

  format(): number {
    return roundf(this.value, 5)
  }

  static create(value: number): InterpolableNumber | null {
    if (typeof value === 'number') {
      return new InterpolableNumber(value.toString())
    }
    return null
  }
}

export default InterpolableNumber
