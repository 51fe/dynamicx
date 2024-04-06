import Matrix2D from './Matrix2D'
import { baseSVG } from './utils'

type KeyType = keyof Omit<TransformProps, 'skew'>

class DecomposedMatrix2D implements Interpolable<DecomposedMatrix2D, string> {
  props: TransformProps

  constructor(props: TransformProps) {
    this.props = props
  }

  interpolate(endMatrix: DecomposedMatrix2D, t: number): DecomposedMatrix2D {
    const newProps: TransformProps = {
      translate: [],
      scale: [],
      rotate: [],
      skew: 0
    }

    const propsKeys = ['translate', 'scale', 'rotate']
    for (const key of propsKeys) {
      const k = key as KeyType
      newProps[k] = []
      if (typeof this.props[k] === 'object') {
        for (let i = 0; i < this.props[k].length; i++) {
          newProps[k][i] = (endMatrix.props[k][i] - this.props[k][i]) * t + this.props[k][i]
        }
      }
    }

    newProps['rotate'][1] = endMatrix.props['rotate'][1]
    newProps['rotate'][2] = endMatrix.props['rotate'][2]

    newProps['skew'] = (endMatrix.props['skew'] - this.props['skew']) * t + this.props['skew']

    return new DecomposedMatrix2D(newProps)
  }

  format(): string {
    return `translate(${this.props.translate.join(',')}) rotate(${this.props.rotate.join(',')}) skewX(${this.props.skew}) scale(${this.props.scale.join(',')})`
  }

  applyRotateCenter(rotateC: number[]) {
    let m = baseSVG.createSVGMatrix()
    m = m.translate(rotateC[0], rotateC[1])
    m = m.rotate(this.props.rotate[0])
    m = m.translate(-rotateC[0], -rotateC[1])
    const m2d = new Matrix2D(m)
    const negativeTranslate = m2d.decompose().props.translate
    const _results = []
    for (let i = 0; i <= 1; i++) {
      this.props.translate[i] -= negativeTranslate[i]
      _results.push(this.props.translate[i])
    }
    return _results
  }
}

export default DecomposedMatrix2D
