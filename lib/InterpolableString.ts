import InterpolableColor from './InterpolableColor'
import InterpolableNumber from './InterpolableNumber'
import { webColors } from './utils'

type ValueType = {
  re: RegExp
  klass: any
  parse: (v: any) => number
}

class InterpolableString implements Interpolable<InterpolableString, string> {
  parts
  constructor(parts: any[]) {
    this.parts = parts
  }

  interpolate(endInterpolable: InterpolableString, t: number): InterpolableString {
    const start = this.parts;
    const end = endInterpolable.parts;
    const newParts = [];
    const minLength = Math.min(start.length, end.length);
    for (let i = 0; i < minLength; i++) {
      if (start[i].interpolate != null) {
        newParts.push(start[i].interpolate(end[i], t));
      } else {
        newParts.push(start[i]);
      }
    }
    return new InterpolableString(newParts);
  }

  format(): string {
    const parts = this.parts.map((val) => {
      if (val.format != null) {
        return val.format()
      } else {
        return val
      }
    })
    return parts.join('')
  }

  static create(value: string): InterpolableString {
    value = '' + value
    // name colors (teal/pupple...)
    if (webColors.has(value)) {
      value = webColors.get(value)!
    }
    const matches = []
    const types: ValueType[] = [
      {
        re: /(#[a-f\d]{3,6})/gi,
        klass: InterpolableColor,
        parse: function (v) {
          return v
        }
      },
      {
        re: /(rgba?\([0-9.]*, ?[0-9.]*, ?[0-9.]*(?:, ?[0-9.]*)?\))/gi,
        klass: InterpolableColor,
        parse: function (v) {
          return v
        }
      },
      {
        re: /([-+]?[\d.]+)/gi,
        klass: InterpolableNumber,
        parse: parseFloat
      }
    ]
    let match = null, re = null
    for (const type of types) {
      re = type.re
      while ((match = re.exec(value))) {
        matches.push({
          index: match.index,
          length: match[1].length,
          interpolable: type.klass.create(type.parse(match[1]))
        })
      }
    }
    matches.sort(function (a, b) {
      if (a.index > b.index) {
        return 1
      } else {
        return -1
      }
    })
    const parts = []
    let index = 0
    for (const match of matches) {
      if (match.index < index) {
        continue
      }
      if (match.index > index) {
        parts.push(value.substring(index, match.index))
      }
      parts.push(match.interpolable)
      index = match.index + match.length
    }
    if (index < value.length) {
      parts.push(value.substring(index))
    }
    return new InterpolableString(parts)
  }
}

export default InterpolableString
