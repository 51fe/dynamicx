
type ColorFormat = 'hex' | 'rgb' | 'rgba'

class Color {
  rgb: RGB
  format: ColorFormat

  constructor(rgb: RGB = {r: 0, g: 0, b: 0, a: 0}, format: ColorFormat = 'rgb') {
    this.rgb = rgb
    this.format = format
  }

  static fromHex(hex: string): Color | null {
    const hex3 = hex.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i)
    if (hex3 != null) {
      hex = '#' + hex3[1] + hex3[1] + hex3[2] + hex3[2] + hex3[3] + hex3[3]
    }
    const result = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (result != null) {
      return new Color(
        {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1
        },
        'hex'
      )
    }
    return null
  }

  static fromRgb(rgb: string): Color | null {
    const match = rgb.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/)
    if (match != null) {
      return new Color(
        {
          r: parseFloat(match[1]),
          g: parseFloat(match[2]),
          b: parseFloat(match[3]),
          a: parseFloat(match[4] != null ? match[4] : '1')
        },
        match[4] != null ? 'rgba' : 'rgb'
      )
    }
    return null
  }

  static componentToHex(c: number): string {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  toHex(): string {
    return (
      '#' +
      Color.componentToHex(this.rgb.r) +
      Color.componentToHex(this.rgb.g) +
      Color.componentToHex(this.rgb.b)
    )
  }

  toRgb(): string {
    return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`
  }

  toRgba(): string {
    return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.rgb.a})`
  }
}

export default Color
