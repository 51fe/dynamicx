import Matrix from './Matrix'

type KeyType = keyof TransformProps

class DecomposedMatrix implements Interpolable<DecomposedMatrix, string> {
  translate: number[] = []
  scale: number[] = []
  skew: number[] = []
  rotate: number[] = []
  perspective: number[] = []
  quaternion: number[] = []

  constructor() {
    this.toMatrix = this.toMatrix.bind(this)
  }

  interpolate(
    decomposedB: DecomposedMatrix,
    t: number,
    only: string[] = []
  ): DecomposedMatrix {
    const decomposedA = this
    const decomposed = new DecomposedMatrix()

    const interpolateValue = (valA: number, valB: number, t: number): number => {
      return (valB - valA) * t + valA
    }

    const propsKeys = ['translate', 'scale', 'skew', 'perspective']
    propsKeys.forEach((key) => {
      const k = key as KeyType
      decomposed[k] = []
      for (let i = 0; i < decomposedA[k].length; i++) {
        if (only === null || only.includes(k) || only.includes(`${k}${['x', 'y', 'z'][i]}`)) {
          decomposed[k][i] = interpolateValue(decomposedA[k][i], decomposedB[k][i], t)
        } else {
          decomposed[k][i] = decomposedA[k][i]
        }
      }
    })

    if (only === null || only.includes('rotate')) {
      const qa = decomposedA.quaternion
      const qb = decomposedB.quaternion
      let angle = qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2] + qa[3] * qb[3]

      if (angle < 0.0) {
        for (let i = 0; i <= 3; i++) {
          qa[i] = -qa[i]
        }
        angle = -angle
      }

      if (angle + 1.0 > 0.05) {
        let th,
          invth,
          scale = 0,
          invscale = 0
        if (1.0 - angle >= 0.05) {
          th = Math.acos(angle)
          invth = 1.0 / Math.sin(th)
          scale = Math.sin(th * (1.0 - t)) * invth
          invscale = Math.sin(th * t) * invth
        } else {
          scale = 1.0 - t
          invscale = t
        }
        decomposed.quaternion = qa.map((valA, i) => {
          return valA * scale + qb[i] * invscale
        })
      } else {
        qb[0] = -qa[1]
        qb[1] = qa[0]
        qb[2] = -qa[3]
        qb[3] = qa[2]
        const piDouble = Math.PI * 2
        const scale = Math.sin(piDouble * (0.5 - t))
        const invscale = Math.sin(piDouble * t)
        decomposed.quaternion = qa.map((valA, i) => {
          return valA * scale + qb[i] * invscale
        })
      }
    } else {
      decomposed.quaternion = decomposedA.quaternion
    }

    return decomposed
  }

  format(): string {
    return this.toMatrix().toString()
  }

  toMatrix(): Matrix {
    const decomposedMatrix = this
    let matrix = Matrix.I(4)

    for (let i = 0; i <= 3; i++) {
      matrix.els[i][3] = decomposedMatrix.perspective[i]
    }

    const quaternion = decomposedMatrix.quaternion
    const x = quaternion[0]
    const y = quaternion[1]
    const z = quaternion[2]
    const w = quaternion[3]
    const skew = decomposedMatrix.skew
    const match = [
      [1, 0],
      [2, 0],
      [2, 1]
    ]

    for (let i = 2; i >= 0; i--) {
      if (skew[i]) {
        const temp = Matrix.I(4)
        temp.els[match[i][0]][match[i][1]] = skew[i]
        matrix = matrix.multiply(temp)
      }
    }

    matrix = matrix.multiply(new Matrix([
      [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
      [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
      [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0],
      [0, 0, 0, 1]
    ]))

    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        matrix.els[i][j] *= decomposedMatrix.scale[i]
      }
      matrix.els[3][i] = decomposedMatrix.translate[i]
    }

    return matrix
  }
}

export default DecomposedMatrix
