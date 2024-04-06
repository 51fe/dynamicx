import DecomposedMatrix from './DecomposedMatrix'
import Vector from './Vector'
import { propertyWithPrefix, roundf } from './utils'

/**
 * @see Some code has been ported from Sylvester.js https://github.com/jcoglan/sylvester
 */
class Matrix {
  els: number[][]
  modulus: boolean = false
  constructor(els: number[][]) {
    this.els = els
  }

  e(i: number, j: number): number | null {
    if (i < 1 || i > this.els.length || j < 1 || j > this.els[0].length) {
      return null
    }
    return this.els[i - 1][j - 1]
  }

  dup(): Matrix {
    return new Matrix(this.els)
  }

  multiply(matrix: Matrix | Vector| number[][]): Matrix {
    let M: number[][]
    if (matrix instanceof Matrix) {
      M = matrix.els
    } else if (matrix instanceof Vector) {
      M = new Matrix([matrix.els]).els;
    } else {
      M = matrix
    }
    const ni = this.els.length
    const kj = M[0].length
    const cols = this.els[0].length
    const elements: number[][] = []
    for (let i = 0; i < ni; i++) {
      elements[i] = []
      for (let j = 0; j < kj; j++) {
        let sum = 0
        for (let c = 0; c < cols; c++) {
          sum += this.els[i][c] * M[c][j]
        }
        elements[i][j] = sum
      }
    }
    return new Matrix(elements)
  }

  transpose(): Matrix {
    const rows = this.els.length
    const cols = this.els[0].length
    const elements: number[][] = []
    for (let i = 0; i < cols; i++) {
      elements[i] = []
      for (let j = 0; j < rows; j++) {
        elements[i][j] = this.els[j][i]
      }
    }
    return new Matrix(elements)
  }

  toRightTriangular(): Matrix {
    const M = this.dup()
    const n = this.els.length
    const kp = this.els[0].length
    for (let i = 0; i < n; i++) {
      if (M.els[i][i] === 0) {
        for (let j = i + 1; j < n; j++) {
          if (M.els[j][i] !== 0) {
            const els = []
            for (let p = 0; p < kp; p++) {
              els.push(M.els[i][p] + M.els[j][p])
            }
            M.els[i] = els
            break
          }
        }
      }
      if (M.els[i][i] !== 0) {
        for (let j = i + 1; j < n; j++) {
          const multiplier = M.els[j][i] / M.els[i][i]
          const els = []
          for (let p = 0; p < kp; p++) {
            els.push(p <= i ? 0 : M.els[j][p] - M.els[i][p] * multiplier)
          }
          M.els[j] = els
        }
      }
    }
    return M
  }

  augment(matrix: Matrix | number[][]): Matrix | null {
    let M: number[][]
    if (matrix instanceof Matrix) {
      M = matrix.els
    } else {
      M = matrix
    }
    const T = this.dup()
    const cols = T.els[0].length
    const ni = T.els.length
    const kj = M[0].length
    if (ni !== M.length) {
      return null
    }
    for (let i = 0; i < ni; i++) {
      for (let j = 0; j < kj; j++) {
        T.els[i][cols + j] = M[i][j]
      }
    }
    return T
  }

  inverse(): Matrix {
    const ni = this.els.length
    const M = this.augment(Matrix.I(ni))!.toRightTriangular()
    const kp = M.els[0].length
    const inverseEle: number[][] = []
    for (let i = 0; i < ni; i++) {
      const els = []
      const divisor = M.els[i][i]
      for (let p = 0; p < kp; p++) {
        const newEle: number = M.els[i][p] / divisor
        els.push(newEle)
        if (p >= ni) {
          inverseEle[i].push(newEle)
        }
      }
      M.els[i] = els
      for (let j = 0; j < i; j++) {
        const els:number[] = []
        for (let p = 0; p < kp; p++) {
          els.push(M.els[j][p] - M.els[i][p] * M.els[j][i])
        }
        M.els[j] = els
      }
    }
    return new Matrix(inverseEle)
  }

  static I(n: number): Matrix {
    let i, j, k, nj
    const els: number[][] = []
    k = n
    n += 1
    while (--n) {
      i = k - n
      els[i] = []
      nj = k
      nj += 1
      while (--nj) {
        j = k - nj
        els[i][j] = i === j ? 1 : 0
      }
    }
    return new Matrix(els)
  }

  decompose(): DecomposedMatrix | null {
    const els: number[][] = []
    for (let i = 0; i <= 3; i++) {
      els[i] = []
      for (let j = 0; j <= 3; j++) {
        els[i][j] = this.els[i][j]
      }
    }
    if (els[3][3] === 0) {
      return null
    }
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        els[i][j] /= els[3][3]
      }
    }
    const perspectiveMatrix = this.dup()
    for (let i = 0; i <= 2; i++) {
      perspectiveMatrix.els[i][3] = 0
    }
    perspectiveMatrix.els[3][3] = 1
    let perspective: number[] = []
    // perspective
    if (els[0][3] !== 0 || els[1][3] !== 0 || els[2][3] !== 0) {
      const rightHandSide = new Vector(els.slice(0, 4)[3])
      const inversePerspectiveMatrix = perspectiveMatrix.inverse()
      const transposedInversePerspectiveMatrix: Matrix = inversePerspectiveMatrix.transpose()
      //@ts-ignore
      perspective = transposedInversePerspectiveMatrix.multiply(rightHandSide).els
      for (let i = 0; i <= 2; i++) {
        els[i][3] = 0
      }
      els[3][3] = 1
    } else {
      perspective = [0, 0, 0, 1]
    }
    const translate: number[] = []
    for (let i = 0; i <= 2; i++) {
      translate[i] = els[3][i]
      els[3][i] = 0
    }
    const row: Vector[] = []
    for (let i = 0; i <= 2; i++) {
      row[i] = new Vector(els[i].slice(0, 3))
    }
    const scale: number[] = []
    const skew: number[] = []
    scale[0] = row[0].length()
    row[0] = row[0].normalize()
    skew[0] = row[0].dot(row[1])
    row[1] = row[1].combine(row[0], 1.0, -skew[0])
    scale[1] = row[1].length()
    row[1] = row[1].normalize()
    skew[0] /= scale[1]
    skew[1] = row[0].dot(row[2])
    row[2] = row[2].combine(row[0], 1.0, -skew[1])
    skew[2] = row[1].dot(row[2])
    row[2] = row[2].combine(row[1], 1.0, -skew[2])
    scale[2] = row[2].length()
    row[2] = row[2].normalize()
    skew[1] /= scale[2]
    skew[2] /= scale[2]
    const pdum3 = row[1].cross(row[2])
    if (pdum3 !== null && row[0].dot(pdum3) < 0) {
      for (let i = 0; i <= 2; i++) {
        scale[i] *= -1
        for (let j = 0; j <= 2; j++) {
          row[i].els[j] *= -1
        }
      }
    }
    const rowElement = function (index: number, elementIndex: number) {
      return row[index].els[elementIndex]
    }
    const rotate: number[] = []
    rotate[1] = Math.asin(-rowElement(0, 2))
    if (Math.cos(rotate[1]) !== 0) {
      rotate[0] = Math.atan2(rowElement(1, 2), rowElement(2, 2))
      rotate[2] = Math.atan2(rowElement(0, 1), rowElement(0, 0))
    } else {
      rotate[0] = Math.atan2(-rowElement(2, 0), rowElement(1, 1))
      rotate[1] = 0
    }
    let s, w, x, y, z
    const t = rowElement(0, 0) + rowElement(1, 1) + rowElement(2, 2) + 1.0
    if (t > 1e-4) {
      s = 0.5 / Math.sqrt(t)
      w = 0.25 / s
      x = (rowElement(2, 1) - rowElement(1, 2)) * s
      y = (rowElement(0, 2) - rowElement(2, 0)) * s
      z = (rowElement(1, 0) - rowElement(0, 1)) * s
    } else if (rowElement(0, 0) > rowElement(1, 1) && rowElement(0, 0) > rowElement(2, 2)) {
      s = Math.sqrt(1.0 + rowElement(0, 0) - rowElement(1, 1) - rowElement(2, 2)) * 2.0
      x = 0.25 * s
      y = (rowElement(0, 1) + rowElement(1, 0)) / s
      z = (rowElement(0, 2) + rowElement(2, 0)) / s
      w = (rowElement(2, 1) - rowElement(1, 2)) / s
    } else if (rowElement(1, 1) > rowElement(2, 2)) {
      s = Math.sqrt(1.0 + rowElement(1, 1) - rowElement(0, 0) - rowElement(2, 2)) * 2.0
      x = (rowElement(0, 1) + rowElement(1, 0)) / s
      y = 0.25 * s
      z = (rowElement(1, 2) + rowElement(2, 1)) / s
      w = (rowElement(0, 2) - rowElement(2, 0)) / s
    } else {
      s = Math.sqrt(1.0 + rowElement(2, 2) - rowElement(0, 0) - rowElement(1, 1)) * 2.0
      x = (rowElement(0, 2) + rowElement(2, 0)) / s
      y = (rowElement(1, 2) + rowElement(2, 1)) / s
      z = 0.25 * s
      w = (rowElement(1, 0) - rowElement(0, 1)) / s
    }
    const quaternion = [x, y, z, w]
    const result = new DecomposedMatrix()
    result.translate = translate
    result.scale = scale
    result.skew = skew
    result.quaternion = quaternion
    result.perspective = perspective
    result.rotate = rotate
    for (const values of Object.values(result)) {
      if (typeof values !== 'function') {
        for (const v of values) {
          if (isNaN(v)) {
            values[v] = 0
          }
        }
      }
    }
    return result
  }

  toString(): string {
    let str = 'matrix3d('
    const rows = this.els.length
    const cols = this.els[0].length
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        str += roundf(this.els[i][j], 10)
        if (!(i === rows - 1 && j === cols - 1)) {
          str += ','
        }
      }
    }
    str += ')'
    return str
  }

  static matrixForTransform(transform: string) {
    const matrixEl: HTMLDivElement = document.createElement('div')
    matrixEl.style.position = 'absolute'
    matrixEl.style.visibility = 'hidden'
    // @ts-ignore
    matrixEl.style[propertyWithPrefix('transform')] = transform
    document.body.appendChild(matrixEl)
    const style = getComputedStyle(matrixEl, null)
    // @ts-ignore
    const result = style?.transform ?? style[propertyWithPrefix('transform')]
    document.body.removeChild(matrixEl)
    return result
  }

  static fromTransform(transform: string): Matrix {
    let digits = [], elements
    const match = transform?.match(/matrix3?d?\(([-0-9,e \.]*)\)/)
    if (match) {
      digits = match[1].split(',')
      digits = digits.map(parseFloat)
      if (digits.length === 6) {
        elements = [
          digits[0],
          digits[1],
          0,
          0,
          digits[2],
          digits[3],
          0,
          0,
          0,
          0,
          1,
          0,
          digits[4],
          digits[5],
          0,
          1
        ]
      } else {
        elements = digits
      }
    } else {
      elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
    const matrixElements = []
    for (let i = 0; i <= 3; i++) {
      matrixElements.push(elements.slice(i * 4, i * 4 + 4))
    }
    return new Matrix(matrixElements)
  }
}

export default Matrix
