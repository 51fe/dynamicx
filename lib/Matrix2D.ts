import DecomposedMatrix2D from './DecomposedMatrix2D'
import Vector from './Vector'
import { baseSVG } from './utils'

class Matrix2D {
  m: DOMMatrix
  rotateCX: number = 0
  rotateCY: number = 0

  constructor(m: DOMMatrix = baseSVG.createSVGMatrix()) {
    this.m = m
  }

  decompose(): DecomposedMatrix2D {
    const r0 = new Vector([this.m.a, this.m.b])
    const r1 = new Vector([this.m.c, this.m.d])
    const kx = r0.length()
    const kz = r0.dot(r1)
    const ky = r1.combine(r0, 1, -kz).length()
    const angle = (Math.atan2(this.m.b, this.m.a) * 180) / Math.PI
    const skew = ((kz / ky) * 180) / Math.PI

    return new DecomposedMatrix2D({
      translate: [this.m.e, this.m.f],
      rotate: [angle, this.rotateCX, this.rotateCY],
      scale: [kx, ky],
      skew: skew
    })
  }

  applyProperties(properties: [string, number][]): void {
    const hash: { [key: string]: number } = {}
    for (const props of properties) {
      hash[props[0]] = props[1]
    }

    for (const k in hash) {
      const v = hash[k]
      if (k === 'translateX') {
        this.m = this.m.translate(v, 0)
      } else if (k === 'translateY') {
        this.m = this.m.translate(0, v)
      } else if (k === 'scaleX') {
        this.m = this.m.scale(v, 1)
      } else if (k === 'scaleY') {
        this.m = this.m.scale(1, v)
      } else if (k === 'rotateZ') {
        this.m = this.m.rotate(v)
      } else if (k === 'skewX') {
        this.m = this.m.skewX(v)
      } else if (k === 'skewY') {
        this.m = this.m.skewY(v)
      }
    }
    this.rotateCX = hash?.rotateCX ?? 0
    this.rotateCY = hash?.rotateCY ?? 0
  }
}

export default Matrix2D
