import Color from './Color'
import { roundf } from './utils'

type RGBKey = keyof RGB

class InterpolableColor implements Interpolable<InterpolableColor, string> {
  color: Color
  constructor(color: Color) {
    this.color = color
  }

  interpolate(endInterpolable: InterpolableColor, t: number): InterpolableColor {
    const start = this.color
    const end = endInterpolable.color
    const rgb: RGB = { r: 0, g: 0, b: 0, a: 0 }
    const keys: RGBKey[] = ['r', 'g', 'b']
    for (const k of keys) {
      const v = Math.round((end.rgb[k] - start.rgb[k]) * t + start.rgb[k])
      rgb[k] = Math.min(255, Math.max(0, v))
    }
    const alphaKey: RGBKey = 'a'
    const alphaValue = roundf(
      (end.rgb[alphaKey] - start.rgb[alphaKey]) * t + start.rgb[alphaKey],
      5
    )
    rgb[alphaKey] = Math.min(1, Math.max(0, alphaValue))
    return new InterpolableColor(new Color(rgb, end.format))
  }

  format(): string {
    if (this.color.format === 'hex') {
      return this.color.toHex()
    } else if (this.color.format === 'rgb') {
      return this.color.toRgb()
    } else if (this.color.format === 'rgba') {
      return this.color.toRgba()
    }
    return ''
  }

  static create(value: string): InterpolableColor | null {
    if (typeof value !== 'string') {
      return null
    }
    const color = Color.fromHex(value) || Color.fromRgb(value)
    if (color != null) {
      return new InterpolableColor(color)
    }
    return null
  }
}

export default InterpolableColor
