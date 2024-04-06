import { createInterpolable } from './utils'

class InterpolableObject implements Interpolable<InterpolableObject, Dic> {
  obj: Dic = {}

  constructor(obj: Dic) {
    this.obj = obj
  }

  interpolate(endInterpolable: InterpolableObject, t: number): InterpolableObject {
    const start = this.obj
    const end = endInterpolable.obj
    const newObj: Dic = {}
    for (const k in start) {
      const v = start[k]
      if (v.interpolate != null) {
        if(end) {
          newObj[k] = v.interpolate(end[k], t)
        }        
      } else {
        newObj[k] = v
      }
    }
    return new InterpolableObject(newObj)
  }

  format(): Dic {
    return this.obj
  }

  static create(value: any): InterpolableObject | null {
    if (value instanceof Object) {
      const obj: Dic = {}
      for (const k in value) {
        const v = value[k]
        obj[k] = createInterpolable(v)
      }
      return new InterpolableObject(obj)
    }
    return null
  }
}

export default InterpolableObject
