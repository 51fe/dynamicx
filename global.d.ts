interface Interpolable<T, K> {
  interpolate(endInterpolable: T, t: number): T
  format(): K
}

type RGB = {
  r: number
  g: number
  b: number
  a: number
}

type Dic = Record<string, any> | undefined

interface TransformProps {
  translate: number[]
  scale: number[]
  rotate: number[]
  skew: number
}