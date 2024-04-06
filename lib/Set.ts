/**
 * Set
 */

class Set {
  obj: Dic

  constructor(array: string[]) {
    this.obj = {}
    for (const v of array) {
      this.obj[v] = 1
    }
  }

  contains(v: string): boolean {
    if(this.obj) {
      return this.obj[v] === 1
    }
    return false
  }
}

export default Set
