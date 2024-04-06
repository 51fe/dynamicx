/**
 * Vector
 * @see Some code has been ported from Sylvester.js https://github.com/jcoglan/sylvester
 */
class Vector {
  els: number[]

  constructor(els: number[]) {
    this.els = els
  }

  e(i: number): number | null {
    if (i < 1 || i > this.els.length) {
      return null
    } else {
      return this.els[i - 1]
    }
  }

  dot(vector: Vector | number[]): number {
    const V = vector instanceof Vector ? vector.els : vector
    let product = 0
    const n = this.els.length
    if (n !== V.length) {
      return 0
    }
    for (let i = 0; i < n; i++) {
      product += this.els[i] * V[i]
    }
    return product
  }

  cross(vector: Vector | number[]): Vector | null {
    const B = vector instanceof Vector ? vector.els : vector
    if (this.els.length !== 3 || B.length !== 3) {
      return null
    }
    const A = this.els
    return new Vector([
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0]
    ])
  }

  length(): number {
    let sum = 0
    for (const e of this.els) {
      sum += e ** 2
    }
    return Math.sqrt(sum)
  }

  normalize(): Vector {
    const length = this.length()
    const newElements: number[] = []
    for (const e of this.els) {
      newElements.push(e / length)
    }
    return new Vector(newElements)
  }

  combine(b: Vector, ascl: number, bscl: number): Vector {
    const result: number[] = []
    for (let i = 0; i < this.els.length; i++) {
      result[i] = ascl * this.els[i] + bscl * b.els[i]
    }
    return new Vector(result)
  }
}

export default Vector
