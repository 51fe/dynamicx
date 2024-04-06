class InterpolableArray {
  constructor(values) {
    this.values = values;
  }
  interpolate(endInterpolable, t) {
    const start = this.values;
    const end = endInterpolable.values;
    const newValues = [];
    const minLength = Math.min(start.length, end.length);
    for (let i = 0; i < minLength; i++) {
      if (start[i].interpolate != null) {
        newValues.push(start[i].interpolate(end[i], t));
      } else {
        newValues.push(start[i]);
      }
    }
    return new InterpolableArray(newValues);
  }
  format() {
    return this.values.map((val) => {
      if (val.format != null) {
        return val.format();
      } else {
        return val;
      }
    });
  }
  static createFromArray(arr) {
    let values = arr.map((val) => {
      return createInterpolable(val) || val;
    });
    values = values.filter((val) => {
      return val != null;
    });
    return new InterpolableArray(values);
  }
  static create(value) {
    if (value instanceof Array) {
      return InterpolableArray.createFromArray(value);
    }
    return null;
  }
}
class InterpolableObject {
  constructor(obj) {
    this.obj = {};
    this.obj = obj;
  }
  interpolate(endInterpolable, t) {
    const start = this.obj;
    const end = endInterpolable.obj;
    const newObj = {};
    for (const k in start) {
      const v = start[k];
      if (v.interpolate != null) {
        if (end) {
          newObj[k] = v.interpolate(end[k], t);
        }
      } else {
        newObj[k] = v;
      }
    }
    return new InterpolableObject(newObj);
  }
  format() {
    return this.obj;
  }
  static create(value) {
    if (value instanceof Object) {
      const obj = {};
      for (const k in value) {
        const v = value[k];
        obj[k] = createInterpolable(v);
      }
      return new InterpolableObject(obj);
    }
    return null;
  }
}
class Color {
  constructor(rgb = { r: 0, g: 0, b: 0, a: 0 }, format = "rgb") {
    this.rgb = rgb;
    this.format = format;
  }
  static fromHex(hex) {
    const hex3 = hex.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i);
    if (hex3 != null) {
      hex = "#" + hex3[1] + hex3[1] + hex3[2] + hex3[2] + hex3[3] + hex3[3];
    }
    const result = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (result != null) {
      return new Color(
        {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1
        },
        "hex"
      );
    }
    return null;
  }
  static fromRgb(rgb) {
    const match = rgb.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/);
    if (match != null) {
      return new Color(
        {
          r: parseFloat(match[1]),
          g: parseFloat(match[2]),
          b: parseFloat(match[3]),
          a: parseFloat(match[4] != null ? match[4] : "1")
        },
        match[4] != null ? "rgba" : "rgb"
      );
    }
    return null;
  }
  static componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  toHex() {
    return "#" + Color.componentToHex(this.rgb.r) + Color.componentToHex(this.rgb.g) + Color.componentToHex(this.rgb.b);
  }
  toRgb() {
    return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
  }
  toRgba() {
    return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.rgb.a})`;
  }
}
class InterpolableColor {
  constructor(color) {
    this.color = color;
  }
  interpolate(endInterpolable, t) {
    const start = this.color;
    const end = endInterpolable.color;
    const rgb = { r: 0, g: 0, b: 0, a: 0 };
    const keys = ["r", "g", "b"];
    for (const k of keys) {
      const v = Math.round((end.rgb[k] - start.rgb[k]) * t + start.rgb[k]);
      rgb[k] = Math.min(255, Math.max(0, v));
    }
    const alphaKey = "a";
    const alphaValue = roundf(
      (end.rgb[alphaKey] - start.rgb[alphaKey]) * t + start.rgb[alphaKey],
      5
    );
    rgb[alphaKey] = Math.min(1, Math.max(0, alphaValue));
    return new InterpolableColor(new Color(rgb, end.format));
  }
  format() {
    if (this.color.format === "hex") {
      return this.color.toHex();
    } else if (this.color.format === "rgb") {
      return this.color.toRgb();
    } else if (this.color.format === "rgba") {
      return this.color.toRgba();
    }
    return "";
  }
  static create(value) {
    if (typeof value !== "string") {
      return null;
    }
    const color = Color.fromHex(value) || Color.fromRgb(value);
    if (color != null) {
      return new InterpolableColor(color);
    }
    return null;
  }
}
class InterpolableString {
  constructor(parts) {
    this.parts = parts;
  }
  interpolate(endInterpolable, t) {
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
  format() {
    const parts = this.parts.map((val) => {
      if (val.format != null) {
        return val.format();
      } else {
        return val;
      }
    });
    return parts.join("");
  }
  static create(value) {
    value = "" + value;
    if (webColors.has(value)) {
      value = webColors.get(value);
    }
    const matches = [];
    const types = [
      {
        re: /(#[a-f\d]{3,6})/gi,
        klass: InterpolableColor,
        parse: function(v) {
          return v;
        }
      },
      {
        re: /(rgba?\([0-9.]*, ?[0-9.]*, ?[0-9.]*(?:, ?[0-9.]*)?\))/gi,
        klass: InterpolableColor,
        parse: function(v) {
          return v;
        }
      },
      {
        re: /([-+]?[\d.]+)/gi,
        klass: InterpolableNumber$1,
        parse: parseFloat
      }
    ];
    let match = null, re = null;
    for (const type of types) {
      re = type.re;
      while (match = re.exec(value)) {
        matches.push({
          index: match.index,
          length: match[1].length,
          interpolable: type.klass.create(type.parse(match[1]))
        });
      }
    }
    matches.sort(function(a, b) {
      if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    });
    const parts = [];
    let index = 0;
    for (const match2 of matches) {
      if (match2.index < index) {
        continue;
      }
      if (match2.index > index) {
        parts.push(value.substring(index, match2.index));
      }
      parts.push(match2.interpolable);
      index = match2.index + match2.length;
    }
    if (index < value.length) {
      parts.push(value.substring(index));
    }
    return new InterpolableString(parts);
  }
}
const baseSVG = (document == null ? void 0 : document.createElementNS("http://www.w3.org/2000/svg", "svg")) ?? null;
function roundf(value, decimal) {
  const d = Math.pow(10, decimal);
  return Math.round(value * d) / d;
}
const createInterpolable = function(value) {
  const klasses = [InterpolableArray, InterpolableObject, InterpolableNumber$1, InterpolableString];
  for (const klasse of klasses) {
    const interpolable = klasse.create(value);
    if (interpolable != null) {
      return interpolable;
    }
  }
  return null;
};
const cacheFn = (func) => {
  const data = {};
  return (...args) => {
    let key = "";
    for (const k of args) {
      key += k.toString() + ",";
    }
    let result = data[key];
    if (!result) {
      data[key] = result = func(...args);
    }
    return result;
  };
};
const prefixFor = cacheFn((property) => {
  let k, prefix, prop, propArray, propertyName;
  if (document.body.style[property] !== void 0) {
    return "";
  }
  propArray = property.split("-");
  propertyName = "";
  for (let i = 0, len = propArray.length; i < len; i++) {
    prop = propArray[i];
    propertyName += prop.substring(0, 1).toUpperCase() + prop.substring(1);
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  for (let j = 0, len1 = prefixes.length; j < len1; j++) {
    prefix = prefixes[j];
    k = prefix + propertyName;
    if (document.body.style[k] !== void 0) {
      return prefix;
    }
  }
  return "";
});
const propertyWithPrefix = cacheFn((property) => {
  const prefix = prefixFor(property);
  if (prefix === "Moz") {
    return `${prefix}${property.substring(0, 1).toUpperCase()}${property.substring(1)}`;
  }
  if (prefix !== "") {
    return `-${prefix.toLowerCase()}-${toDashed(property)}`;
  }
  return toDashed(property);
});
const toDashed = function(str) {
  return str.replace(/([A-Z])/g, function($1) {
    return "-" + $1.toLowerCase();
  });
};
const webColors = /* @__PURE__ */ new Map([
  ["aliceblue", "#f0f8ff"],
  ["antiquewhite", "#faebd7"],
  ["aqua", "#00ffff"],
  ["aquamarine", "#7fffd4"],
  ["azure", "#f0ffff"],
  ["beige", "#f5f5dc"],
  ["bisque", "#ffe4c4"],
  ["black", "#000000"],
  ["blanchedalmond", "#ffebcd"],
  ["blue", "#0000ff"],
  ["blueviolet", "#8a2be2"],
  ["brown", "#a52a2a"],
  ["burlywood", "#deb887"],
  ["cadetblue", "#5f9ea0"],
  ["chartreuse", "#7fff00"],
  ["chocolate", "#d2691e"],
  ["coral", "#ff7f50"],
  ["cornflowerblue", "#6495ed"],
  ["cornsilk", "#fff8dc"],
  ["crimson", "#dc143c"],
  ["cyan", "#00ffff"],
  ["darkblue", "#00008b"],
  ["darkcyan", "#008b8b"],
  ["darkgoldenrod", "#b8860b"],
  ["darkgray", "#a9a9a9"],
  ["darkgreen", "#006400"],
  ["darkgrey", "#a9a9a9"],
  ["darkkhaki", "#bdb76b"],
  ["darkmagenta", "#8b008b"],
  ["darkolivegreen", "#556b2f"],
  ["darkorange", "#ff8c00"],
  ["darkorchid", "#9932cc"],
  ["darkred", "#8b0000"],
  ["darksalmon", "#e9967a"],
  ["darkseagreen", "#8fbc8f"],
  ["darkslateblue", "#483d8b"],
  ["darkslategray", "#2f4f4f"],
  ["darkslategrey", "#2f4f4f"],
  ["darkturquoise", "#00ced1"],
  ["darkviolet", "#9400d3"],
  ["deeppink", "#ff1493"],
  ["deepskyblue", "#00bfff"],
  ["dimgray", "#696969"],
  ["dimgrey", "#696969"],
  ["dodgerblue", "#1e90ff"],
  ["firebrick", "#b22222"],
  ["floralwhite", "#fffaf0"],
  ["forestgreen", "#228b22"],
  ["fuchsia", "#ff00ff"],
  ["gainsboro", "#dcdcdc"],
  ["ghostwhite", "#f8f8ff"],
  ["gold", "#ffd700"],
  ["goldenrod", "#daa520"],
  ["gray", "#808080"],
  ["green", "#008000"],
  ["greenyellow", "#adff2f"],
  ["grey", "#808080"],
  ["honeydew", "#f0fff0"],
  ["hotpink", "#ff69b4"],
  ["indianred", "#cd5c5c"],
  ["indigo", "#4b0082"],
  ["ivory", "#fffff0"],
  ["khaki", "#f0e68c"],
  ["lavender", "#e6e6fa"],
  ["lavenderblush", "#fff0f5"],
  ["lawngreen", "#7cfc00"],
  ["lemonchiffon", "#fffacd"],
  ["lightblue", "#add8e6"],
  ["lightcoral", "#f08080"],
  ["lightcyan", "#e0ffff"],
  ["lightgoldenrodyellow", "#fafad2"],
  ["lightgray", "#d3d3d3"],
  ["lightgreen", "#90ee90"],
  ["lightgrey", "#d3d3d3"],
  ["lightpink", "#ffb6c1"],
  ["lightsalmon", "#ffa07a"],
  ["lightseagreen", "#20b2aa"],
  ["lightskyblue", "#87cefa"],
  ["lightslategray", "#778899"],
  ["lightslategrey", "#778899"],
  ["lightsteelblue", "#b0c4de"],
  ["lightyellow", "#ffffe0"],
  ["lime", "#00ff00"],
  ["limegreen", "#32cd32"],
  ["linen", "#faf0e6"],
  ["magenta", "#ff00ff"],
  ["maroon", "#800000"],
  ["mediumaquamarine", "#66cdaa"],
  ["mediumblue", "#0000cd"],
  ["mediumorchid", "#ba55d3"],
  ["mediumpurple", "#9370db"],
  ["mediumseagreen", "#3cb371"],
  ["mediumslateblue", "#7b68ee"],
  ["mediumspringgreen", "#00fa9a"],
  ["mediumturquoise", "#48d1cc"],
  ["mediumvioletred", "#c71585"],
  ["midnightblue", "#191970"],
  ["mintcream", "#f5fffa"],
  ["mistyrose", "#ffe4e1"],
  ["moccasin", "#ffe4b5"],
  ["navajowhite", "#ffdead"],
  ["navy", "#000080"],
  ["oldlace", "#fdf5e6"],
  ["olive", "#808000"],
  ["olivedrab", "#6b8e23"],
  ["orange", "#ffa500"],
  ["orangered", "#ff4500"],
  ["orchid", "#da70d6"],
  ["palegoldenrod", "#eee8aa"],
  ["palegreen", "#98fb98"],
  ["paleturquoise", "#afeeee"],
  ["palevioletred", "#db7093"],
  ["papayawhip", "#ffefd5"],
  ["peachpuff", "#ffdab9"],
  ["peru", "#cd853f"],
  ["pink", "#ffc0cb"],
  ["plum", "#dda0dd"],
  ["powderblue", "#b0e0e6"],
  ["purple", "#800080"],
  ["rebeccapurple", "#663399"],
  ["red", "#ff0000"],
  ["rosybrown", "#bc8f8f"],
  ["royalblue", "#4169e1"],
  ["saddlebrown", "#8b4513"],
  ["salmon", "#fa8072"],
  ["sandybrown", "#f4a460"],
  ["seagreen", "#2e8b57"],
  ["seashell", "#fff5ee"],
  ["sienna", "#a0522d"],
  ["silver", "#c0c0c0"],
  ["skyblue", "#87ceeb"],
  ["slateblue", "#6a5acd"],
  ["slategray", "#708090"],
  ["slategrey", "#708090"],
  ["snow", "#fffafa"],
  ["springgreen", "#00ff7f"],
  ["steelblue", "#4682b4"],
  ["tan", "#d2b48c"],
  ["teal", "#008080"],
  ["thistle", "#d8bfd8"],
  ["tomato", "#ff6347"],
  ["turquoise", "#40e0d0"],
  ["violet", "#ee82ee"],
  ["wheat", "#f5deb3"],
  ["white", "#ffffff"],
  ["whitesmoke", "#f5f5f5"],
  ["yellow", "#ffff00"],
  ["yellowgreen", "#9acd32"]
]);
class InterpolableNumber {
  constructor(value) {
    if (typeof value === "string") {
      this.value = parseFloat(value);
    } else {
      this.value = value;
    }
    this.interpolate = this.interpolate.bind(this);
    this.format = this.format.bind(this);
  }
  interpolate(endInterpolable, t) {
    const start = this.value;
    const end = endInterpolable.value;
    return new InterpolableNumber((end - start) * t + start);
  }
  format() {
    return roundf(this.value, 5);
  }
  static create(value) {
    if (typeof value === "number") {
      return new InterpolableNumber(value.toString());
    }
    return null;
  }
}
const InterpolableNumber$1 = InterpolableNumber;
class DecomposedMatrix {
  constructor() {
    this.translate = [];
    this.scale = [];
    this.skew = [];
    this.rotate = [];
    this.perspective = [];
    this.quaternion = [];
    this.toMatrix = this.toMatrix.bind(this);
  }
  interpolate(decomposedB, t, only = null) {
    const decomposedA = this;
    const decomposed = new DecomposedMatrix();
    const interpolateValue = (valA, valB, t2) => {
      return (valB - valA) * t2 + valA;
    };
    const propsKeys = ["translate", "scale", "skew", "perspective"];
    propsKeys.forEach((key) => {
      const k = key;
      decomposed[k] = [];
      for (let i = 0; i < decomposedA[k].length; i++) {
        if (only === null || only.includes(k) || only.includes(`${k}${["x", "y", "z"][i]}`)) {
          decomposed[k][i] = interpolateValue(decomposedA[k][i], decomposedB[k][i], t);
        } else {
          decomposed[k][i] = decomposedA[k][i];
        }
      }
    });
    if (only === null || only.includes("rotate")) {
      const qa = decomposedA.quaternion;
      const qb = decomposedB.quaternion;
      let angle = qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2] + qa[3] * qb[3];
      if (angle < 0) {
        for (let i = 0; i <= 3; i++) {
          qa[i] = -qa[i];
        }
        angle = -angle;
      }
      if (angle + 1 > 0.05) {
        let th, invth, scale = 0, invscale = 0;
        if (1 - angle >= 0.05) {
          th = Math.acos(angle);
          invth = 1 / Math.sin(th);
          scale = Math.sin(th * (1 - t)) * invth;
          invscale = Math.sin(th * t) * invth;
        } else {
          scale = 1 - t;
          invscale = t;
        }
        decomposed.quaternion = qa.map((valA, i) => {
          return valA * scale + qb[i] * invscale;
        });
      } else {
        qb[0] = -qa[1];
        qb[1] = qa[0];
        qb[2] = -qa[3];
        qb[3] = qa[2];
        const piDouble = Math.PI * 2;
        const scale = Math.sin(piDouble * (0.5 - t));
        const invscale = Math.sin(piDouble * t);
        decomposed.quaternion = qa.map((valA, i) => {
          return valA * scale + qb[i] * invscale;
        });
      }
    } else {
      decomposed.quaternion = decomposedA.quaternion;
    }
    return decomposed;
  }
  format() {
    return this.toMatrix().toString();
  }
  toMatrix() {
    const decomposedMatrix = this;
    let matrix = Matrix$1.I(4);
    for (let i = 0; i <= 3; i++) {
      matrix.els[i][3] = decomposedMatrix.perspective[i];
    }
    const quaternion = decomposedMatrix.quaternion;
    const x = quaternion[0];
    const y = quaternion[1];
    const z = quaternion[2];
    const w = quaternion[3];
    const skew = decomposedMatrix.skew;
    const match = [
      [1, 0],
      [2, 0],
      [2, 1]
    ];
    for (let i = 2; i >= 0; i--) {
      if (skew[i]) {
        const temp = Matrix$1.I(4);
        temp.els[match[i][0]][match[i][1]] = skew[i];
        matrix = matrix.multiply(temp);
      }
    }
    matrix = matrix.multiply(new Matrix$1([
      [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
      [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
      [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0],
      [0, 0, 0, 1]
    ]));
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        matrix.els[i][j] *= decomposedMatrix.scale[i];
      }
      matrix.els[3][i] = decomposedMatrix.translate[i];
    }
    return matrix;
  }
}
class Vector {
  constructor(els) {
    this.els = els;
  }
  e(i) {
    if (i < 1 || i > this.els.length) {
      return null;
    } else {
      return this.els[i - 1];
    }
  }
  dot(vector) {
    const V = vector instanceof Vector ? vector.els : vector;
    let product = 0;
    const n = this.els.length;
    if (n !== V.length) {
      return 0;
    }
    for (let i = 0; i < n; i++) {
      product += this.els[i] * V[i];
    }
    return product;
  }
  cross(vector) {
    const B = vector instanceof Vector ? vector.els : vector;
    if (this.els.length !== 3 || B.length !== 3) {
      return null;
    }
    const A = this.els;
    return new Vector([
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0]
    ]);
  }
  length() {
    let sum = 0;
    for (const e of this.els) {
      sum += e ** 2;
    }
    return Math.sqrt(sum);
  }
  normalize() {
    const length = this.length();
    const newElements = [];
    for (const e of this.els) {
      newElements.push(e / length);
    }
    return new Vector(newElements);
  }
  combine(b, ascl, bscl) {
    const result = [];
    for (let i = 0; i < this.els.length; i++) {
      result[i] = ascl * this.els[i] + bscl * b.els[i];
    }
    return new Vector(result);
  }
}
class Matrix {
  constructor(els) {
    this.modulus = false;
    this.els = els;
  }
  e(i, j) {
    if (i < 1 || i > this.els.length || j < 1 || j > this.els[0].length) {
      return null;
    }
    return this.els[i - 1][j - 1];
  }
  dup() {
    return new Matrix(this.els);
  }
  multiply(matrix) {
    let M;
    if (matrix instanceof Matrix) {
      M = matrix.els;
    } else if (matrix instanceof Vector) {
      M = new Matrix([matrix.els]).els;
    } else {
      M = matrix;
    }
    const ni = this.els.length;
    const kj = M[0].length;
    const cols = this.els[0].length;
    const elements = [];
    for (let i = 0; i < ni; i++) {
      elements[i] = [];
      for (let j = 0; j < kj; j++) {
        let sum = 0;
        for (let c = 0; c < cols; c++) {
          sum += this.els[i][c] * M[c][j];
        }
        elements[i][j] = sum;
      }
    }
    return new Matrix(elements);
  }
  transpose() {
    const rows = this.els.length;
    const cols = this.els[0].length;
    const elements = [];
    for (let i = 0; i < cols; i++) {
      elements[i] = [];
      for (let j = 0; j < rows; j++) {
        elements[i][j] = this.els[j][i];
      }
    }
    return new Matrix(elements);
  }
  toRightTriangular() {
    const M = this.dup();
    const n = this.els.length;
    const kp = this.els[0].length;
    for (let i = 0; i < n; i++) {
      if (M.els[i][i] === 0) {
        for (let j = i + 1; j < n; j++) {
          if (M.els[j][i] !== 0) {
            const els = [];
            for (let p = 0; p < kp; p++) {
              els.push(M.els[i][p] + M.els[j][p]);
            }
            M.els[i] = els;
            break;
          }
        }
      }
      if (M.els[i][i] !== 0) {
        for (let j = i + 1; j < n; j++) {
          const multiplier = M.els[j][i] / M.els[i][i];
          const els = [];
          for (let p = 0; p < kp; p++) {
            els.push(p <= i ? 0 : M.els[j][p] - M.els[i][p] * multiplier);
          }
          M.els[j] = els;
        }
      }
    }
    return M;
  }
  augment(matrix) {
    let M;
    if (matrix instanceof Matrix) {
      M = matrix.els;
    } else {
      M = matrix;
    }
    const T = this.dup();
    const cols = T.els[0].length;
    const ni = T.els.length;
    const kj = M[0].length;
    if (ni !== M.length) {
      return null;
    }
    for (let i = 0; i < ni; i++) {
      for (let j = 0; j < kj; j++) {
        T.els[i][cols + j] = M[i][j];
      }
    }
    return T;
  }
  inverse() {
    const ni = this.els.length;
    const M = this.augment(Matrix.I(ni)).toRightTriangular();
    const kp = M.els[0].length;
    const inverseEle = [];
    for (let i = 0; i < ni; i++) {
      const els = [];
      const divisor = M.els[i][i];
      for (let p = 0; p < kp; p++) {
        const newEle = M.els[i][p] / divisor;
        els.push(newEle);
        if (p >= ni) {
          inverseEle[i].push(newEle);
        }
      }
      M.els[i] = els;
      for (let j = 0; j < i; j++) {
        const els2 = [];
        for (let p = 0; p < kp; p++) {
          els2.push(M.els[j][p] - M.els[i][p] * M.els[j][i]);
        }
        M.els[j] = els2;
      }
    }
    return new Matrix(inverseEle);
  }
  static I(n) {
    let i, j, k, nj;
    const els = [];
    k = n;
    n += 1;
    while (--n) {
      i = k - n;
      els[i] = [];
      nj = k;
      nj += 1;
      while (--nj) {
        j = k - nj;
        els[i][j] = i === j ? 1 : 0;
      }
    }
    return new Matrix(els);
  }
  decompose() {
    const els = [];
    for (let i = 0; i <= 3; i++) {
      els[i] = [];
      for (let j = 0; j <= 3; j++) {
        els[i][j] = this.els[i][j];
      }
    }
    if (els[3][3] === 0) {
      return null;
    }
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        els[i][j] /= els[3][3];
      }
    }
    const perspectiveMatrix = this.dup();
    for (let i = 0; i <= 2; i++) {
      perspectiveMatrix.els[i][3] = 0;
    }
    perspectiveMatrix.els[3][3] = 1;
    let perspective = [];
    if (els[0][3] !== 0 || els[1][3] !== 0 || els[2][3] !== 0) {
      const rightHandSide = new Vector(els.slice(0, 4)[3]);
      const inversePerspectiveMatrix = perspectiveMatrix.inverse();
      const transposedInversePerspectiveMatrix = inversePerspectiveMatrix.transpose();
      perspective = transposedInversePerspectiveMatrix.multiply(rightHandSide).els;
      for (let i = 0; i <= 2; i++) {
        els[i][3] = 0;
      }
      els[3][3] = 1;
    } else {
      perspective = [0, 0, 0, 1];
    }
    const translate = [];
    for (let i = 0; i <= 2; i++) {
      translate[i] = els[3][i];
      els[3][i] = 0;
    }
    const row = [];
    for (let i = 0; i <= 2; i++) {
      row[i] = new Vector(els[i].slice(0, 3));
    }
    const scale = [];
    const skew = [];
    scale[0] = row[0].length();
    row[0] = row[0].normalize();
    skew[0] = row[0].dot(row[1]);
    row[1] = row[1].combine(row[0], 1, -skew[0]);
    scale[1] = row[1].length();
    row[1] = row[1].normalize();
    skew[0] /= scale[1];
    skew[1] = row[0].dot(row[2]);
    row[2] = row[2].combine(row[0], 1, -skew[1]);
    skew[2] = row[1].dot(row[2]);
    row[2] = row[2].combine(row[1], 1, -skew[2]);
    scale[2] = row[2].length();
    row[2] = row[2].normalize();
    skew[1] /= scale[2];
    skew[2] /= scale[2];
    const pdum3 = row[1].cross(row[2]);
    if (pdum3 !== null && row[0].dot(pdum3) < 0) {
      for (let i = 0; i <= 2; i++) {
        scale[i] *= -1;
        for (let j = 0; j <= 2; j++) {
          row[i].els[j] *= -1;
        }
      }
    }
    const rowElement = function(index, elementIndex) {
      return row[index].els[elementIndex];
    };
    const rotate = [];
    rotate[1] = Math.asin(-rowElement(0, 2));
    if (Math.cos(rotate[1]) !== 0) {
      rotate[0] = Math.atan2(rowElement(1, 2), rowElement(2, 2));
      rotate[2] = Math.atan2(rowElement(0, 1), rowElement(0, 0));
    } else {
      rotate[0] = Math.atan2(-rowElement(2, 0), rowElement(1, 1));
      rotate[1] = 0;
    }
    let s, w, x, y, z;
    const t = rowElement(0, 0) + rowElement(1, 1) + rowElement(2, 2) + 1;
    if (t > 1e-4) {
      s = 0.5 / Math.sqrt(t);
      w = 0.25 / s;
      x = (rowElement(2, 1) - rowElement(1, 2)) * s;
      y = (rowElement(0, 2) - rowElement(2, 0)) * s;
      z = (rowElement(1, 0) - rowElement(0, 1)) * s;
    } else if (rowElement(0, 0) > rowElement(1, 1) && rowElement(0, 0) > rowElement(2, 2)) {
      s = Math.sqrt(1 + rowElement(0, 0) - rowElement(1, 1) - rowElement(2, 2)) * 2;
      x = 0.25 * s;
      y = (rowElement(0, 1) + rowElement(1, 0)) / s;
      z = (rowElement(0, 2) + rowElement(2, 0)) / s;
      w = (rowElement(2, 1) - rowElement(1, 2)) / s;
    } else if (rowElement(1, 1) > rowElement(2, 2)) {
      s = Math.sqrt(1 + rowElement(1, 1) - rowElement(0, 0) - rowElement(2, 2)) * 2;
      x = (rowElement(0, 1) + rowElement(1, 0)) / s;
      y = 0.25 * s;
      z = (rowElement(1, 2) + rowElement(2, 1)) / s;
      w = (rowElement(0, 2) - rowElement(2, 0)) / s;
    } else {
      s = Math.sqrt(1 + rowElement(2, 2) - rowElement(0, 0) - rowElement(1, 1)) * 2;
      x = (rowElement(0, 2) + rowElement(2, 0)) / s;
      y = (rowElement(1, 2) + rowElement(2, 1)) / s;
      z = 0.25 * s;
      w = (rowElement(1, 0) - rowElement(0, 1)) / s;
    }
    const quaternion = [x, y, z, w];
    const result = new DecomposedMatrix();
    result.translate = translate;
    result.scale = scale;
    result.skew = skew;
    result.quaternion = quaternion;
    result.perspective = perspective;
    result.rotate = rotate;
    for (const values of Object.values(result)) {
      if (typeof values !== "function") {
        for (const v of values) {
          if (isNaN(v)) {
            values[v] = 0;
          }
        }
      }
    }
    return result;
  }
  toString() {
    let str = "matrix3d(";
    const rows = this.els.length;
    const cols = this.els[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        str += roundf(this.els[i][j], 10);
        if (!(i === rows - 1 && j === cols - 1)) {
          str += ",";
        }
      }
    }
    str += ")";
    return str;
  }
  static matrixForTransform(transform) {
    const matrixEl = document.createElement("div");
    matrixEl.style.position = "absolute";
    matrixEl.style.visibility = "hidden";
    matrixEl.style[propertyWithPrefix("transform")] = transform;
    document.body.appendChild(matrixEl);
    const style = getComputedStyle(matrixEl, null);
    const result = (style == null ? void 0 : style.transform) ?? style[propertyWithPrefix("transform")];
    document.body.removeChild(matrixEl);
    return result;
  }
  static fromTransform(transform) {
    let digits = [], elements;
    const match = transform == null ? void 0 : transform.match(/matrix3?d?\(([-0-9,e \.]*)\)/);
    if (match) {
      digits = match[1].split(",");
      digits = digits.map(parseFloat);
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
        ];
      } else {
        elements = digits;
      }
    } else {
      elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    const matrixElements = [];
    for (let i = 0; i <= 3; i++) {
      matrixElements.push(elements.slice(i * 4, i * 4 + 4));
    }
    return new Matrix(matrixElements);
  }
}
const Matrix$1 = Matrix;
class DecomposedMatrix2D {
  constructor(props) {
    this.props = props;
  }
  interpolate(endMatrix, t) {
    const newProps = {
      translate: [],
      scale: [],
      rotate: [],
      skew: 0
    };
    const propsKeys = ["translate", "scale", "rotate"];
    for (const key of propsKeys) {
      const k = key;
      newProps[k] = [];
      if (typeof this.props[k] === "object") {
        for (let i = 0; i < this.props[k].length; i++) {
          newProps[k][i] = (endMatrix.props[k][i] - this.props[k][i]) * t + this.props[k][i];
        }
      }
    }
    newProps["rotate"][1] = endMatrix.props["rotate"][1];
    newProps["rotate"][2] = endMatrix.props["rotate"][2];
    newProps["skew"] = (endMatrix.props["skew"] - this.props["skew"]) * t + this.props["skew"];
    return new DecomposedMatrix2D(newProps);
  }
  format() {
    return `translate(${this.props.translate.join(",")}) rotate(${this.props.rotate.join(",")}) skewX(${this.props.skew}) scale(${this.props.scale.join(",")})`;
  }
  applyRotateCenter(rotateC) {
    let m = baseSVG.createSVGMatrix();
    m = m.translate(rotateC[0], rotateC[1]);
    m = m.rotate(this.props.rotate[0]);
    m = m.translate(-rotateC[0], -rotateC[1]);
    const m2d = new Matrix2D$1(m);
    const negativeTranslate = m2d.decompose().props.translate;
    const _results = [];
    for (let i = 0; i <= 1; i++) {
      this.props.translate[i] -= negativeTranslate[i];
      _results.push(this.props.translate[i]);
    }
    return _results;
  }
}
class Matrix2D {
  constructor(m = baseSVG.createSVGMatrix()) {
    this.rotateCX = 0;
    this.rotateCY = 0;
    this.m = m;
  }
  decompose() {
    const r0 = new Vector([this.m.a, this.m.b]);
    const r1 = new Vector([this.m.c, this.m.d]);
    const kx = r0.length();
    const kz = r0.dot(r1);
    const ky = r1.combine(r0, 1, -kz).length();
    const angle = Math.atan2(this.m.b, this.m.a) * 180 / Math.PI;
    const skew = kz / ky * 180 / Math.PI;
    return new DecomposedMatrix2D({
      translate: [this.m.e, this.m.f],
      rotate: [angle, this.rotateCX, this.rotateCY],
      scale: [kx, ky],
      skew
    });
  }
  applyProperties(properties) {
    const hash = {};
    for (const props of properties) {
      hash[props[0]] = props[1];
    }
    for (const k in hash) {
      const v = hash[k];
      if (k === "translateX") {
        this.m = this.m.translate(v, 0);
      } else if (k === "translateY") {
        this.m = this.m.translate(0, v);
      } else if (k === "scaleX") {
        this.m = this.m.scale(v, 1);
      } else if (k === "scaleY") {
        this.m = this.m.scale(1, v);
      } else if (k === "rotateZ") {
        this.m = this.m.rotate(v);
      } else if (k === "skewX") {
        this.m = this.m.skewX(v);
      } else if (k === "skewY") {
        this.m = this.m.skewY(v);
      }
    }
    this.rotateCX = (hash == null ? void 0 : hash.rotateCX) ?? 0;
    this.rotateCY = (hash == null ? void 0 : hash.rotateCY) ?? 0;
  }
}
const Matrix2D$1 = Matrix2D;
class Set {
  constructor(array) {
    this.obj = {};
    for (const v of array) {
      this.obj[v] = 1;
    }
  }
  contains(v) {
    if (this.obj) {
      return this.obj[v] === 1;
    }
    return false;
  }
}
const pxProperties = new Set("marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius".split(","));
const degProperties = new Set("rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ".split(","));
const transformProperties = new Set("translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective".split(","));
const svgProperties = new Set("cx,cy,d,dx,dy,fill,fillOpacity,filterRes,floodColor,floodOpacity,gradientTransform,height,kernelMatrix,letterSpacing,lightingColor,limitingConeAngle,markerHeight,markerWidth,numOctaves,opacity,patternTransform,points,r,rx,ry,specularConstant,specularExponent,stdDeviation,stopColor,stopOpacity,stroke,strokeWidth,strokeDashoffset,strokeOpacity,textLength,transform,viewBox,width,x,x1,x2,y,y1,y2,z".split(","));
const stringProperties = new Set("azimuth,baseFrequency,bias,diffuseConstant,divisor,elevation,k1,k2,k3,k4,fr,fx,fy,limitingConeAngle,pathLength,pointsAtX,pointsAtY,pointsAtZ,radius,seed,surfaceScale".split(","));
const isDocumentVisible = () => {
  return (document == null ? void 0 : document.visibilityState) === "visible";
};
const observeVisibilityChange = (() => {
  const fns = [];
  document == null ? void 0 : document.addEventListener("visibilitychange", () => {
    const _results = [];
    for (const fn of fns) {
      _results.push(fn(isDocumentVisible()));
    }
    return _results;
  });
  return (fn) => fns.push(fn);
})();
const applyFrame = (el, properties) => {
  if (el.style != null) {
    return applyProperties(el, properties);
  } else {
    const _results = [];
    for (const k in properties) {
      const v = properties[k].format();
      el[k] = v;
      _results.push(v);
    }
    return _results;
  }
};
const applyProperties = (el, properties) => {
  properties = parseProperties(properties);
  const transforms = [];
  const isSVG = isSVGElement(el);
  for (const k in properties) {
    let v = properties[k];
    if (transformProperties.contains(k)) {
      transforms.push([k, v]);
    } else {
      if (v.format != null) {
        v = v.format();
      }
      if (typeof v === "number") {
        v = "" + v + unitForProperty(k);
      }
      if (el.hasAttribute(k)) {
        if (k === "numOctaves") {
          v = parseInt(v);
        }
        el.setAttribute(k, v);
      } else if (el.style != null) {
        el.style[propertyWithPrefix(k)] = v;
      }
      if (!(el instanceof SVGElement) && k in el) {
        el[k] = v;
      }
    }
  }
  if (transforms.length > 0) {
    if (isSVG) {
      const matrix = new Matrix2D$1();
      matrix.applyProperties(transforms);
      el.setAttribute("transform", matrix.decompose().format());
    } else {
      const v = transforms.map((transform) => {
        return transformValueForProperty(transform[0], transform[1]);
      }).join(" ");
      el.style[propertyWithPrefix("transform")] = v;
    }
  }
};
const isSVGElement = (el) => {
  return el instanceof SVGElement && !(el instanceof SVGSVGElement);
};
const unitForProperty = (k) => {
  if (pxProperties.contains(k)) {
    return "px";
  } else if (degProperties.contains(k)) {
    return "deg";
  }
  return "";
};
const transformValueForProperty = function(k, v) {
  let match, unit;
  match = ("" + v).match(/^([0-9.-]*)([^0-9]*)$/);
  if (match != null) {
    v = match[1];
    unit = match[2];
  }
  if (unit == null || unit === "") {
    unit = unitForProperty(k);
  }
  return `${k}(${v}${unit})`;
};
const parseProperties = (properties) => {
  const parsed = {};
  for (const k in properties) {
    const value = properties[k];
    if (transformProperties.contains(k)) {
      const match = k.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/);
      if (match && match[2].length > 0) {
        parsed[k] = value;
      } else {
        for (const axis of ["X", "Y", "Z"]) {
          if (match == null ? void 0 : match[1]) {
            parsed[match[1] + axis] = value;
          }
        }
      }
    } else {
      parsed[k] = value;
    }
  }
  return parsed;
};
const defaultValueForKey = (key) => {
  const v = key === "opacity" ? 1 : 0;
  return `${v}${unitForProperty(key)}`;
};
const getCurrentProperties = (el, keys) => {
  var _a;
  const properties = {};
  const isSVG = isSVGElement(el);
  if ((el == null ? void 0 : el.style) != null) {
    const style = window.getComputedStyle(el, null);
    for (let key of keys) {
      if (transformProperties.contains(key)) {
        if (properties["transform"] == null) {
          let matrix;
          if (isSVG && el.transform != null) {
            matrix = new Matrix2D$1((_a = el.transform.baseVal.consolidate()) == null ? void 0 : _a.matrix);
          } else {
            matrix = Matrix$1.fromTransform(style[propertyWithPrefix("transform")]);
          }
          properties["transform"] = matrix.decompose();
        }
      } else {
        let v;
        if (el.hasAttribute(key)) {
          v = el.getAttribute(key);
        } else if (key in el) {
          v = el[key];
        } else {
          v = style[key];
        }
        if ((v == null || key === "d") && svgProperties.contains(key)) {
          v = el.getAttribute(key);
        }
        if (v === "" || v == null) {
          v = defaultValueForKey(key);
        }
        properties[key] = createInterpolable(v);
      }
    }
  } else {
    for (const k of keys) {
      properties[k] = createInterpolable(el[k]);
    }
  }
  addUnitsToNumberInterpolables(el, properties);
  return properties;
};
const addUnitsToNumberInterpolables = (el, properties) => {
  for (const k in properties) {
    let interpolable = properties[k];
    if (interpolable instanceof InterpolableNumber$1) {
      if (el.style != null && k in el.style) {
        interpolable = new InterpolableString([interpolable, unitForProperty(k)]);
      }
    }
    properties[k] = interpolable;
  }
};
let slow = false, slowRatio = 1;
let rAF = window == null ? void 0 : window.requestAnimationFrame;
window == null ? void 0 : window.addEventListener("keyup", (e) => {
  if (e.key === "D" && e.shiftKey) {
    return dynamicx.toggleSlow();
  }
});
if (rAF == null) {
  let lastTime = 0;
  rAF = (callback) => {
    const currTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      return callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
let runLoopRunning = false, runLoopPaused = false;
const startRunLoop = () => {
  if (!runLoopRunning) {
    runLoopRunning = true;
    return rAF(runLoopTick);
  }
};
let animations = [];
const runLoopTick = (t) => {
  if (runLoopPaused) {
    rAF(runLoopTick);
    return;
  }
  let animation;
  const toRemoveAnimations = [];
  const len = animations.length;
  for (let i = 0; i < len; i++) {
    animation = animations[i];
    if (!animationTick(t, animation)) {
      toRemoveAnimations.push(animation);
    }
  }
  animations = animations.filter((item) => !toRemoveAnimations.includes(item));
  if (animations.length === 0) {
    return runLoopRunning = false;
  } else {
    return rAF(runLoopTick);
  }
};
const animationTick = (t, animation) => {
  if (animation.tStart === void 0) {
    animation.tStart = t;
  }
  const tt = (t - animation.tStart) / animation.options.duration;
  const y = animation.curve(tt);
  let properties = {};
  if (tt >= 1) {
    if (animation.curve.returnsToSelf) {
      properties = animation.properties.start;
    } else {
      properties = animation.properties.end;
    }
  } else {
    const _ref = animation.properties.start;
    for (const key in _ref) {
      const property = _ref[key];
      const end = animation.properties.end;
      properties[key] = interpolate(property, end == null ? void 0 : end[key], y);
    }
  }
  applyFrame(animation.el, properties);
  const _base = animation.options;
  if (typeof _base.change === "function") {
    _base.change(animation.el, Math.min(1, tt));
  }
  if (tt >= 1) {
    const _base1 = animation.options;
    if (typeof _base1.complete === "function") {
      _base1.complete(animation.el);
    }
  }
  return tt < 1;
};
const interpolate = (start, end, y) => {
  if (start.interpolate != null) {
    return start.interpolate(end, y);
  }
  return null;
};
let animationsTimeouts = [];
const startAnimation = (el, properties, options, timeoutId) => {
  if (timeoutId != null) {
    animationsTimeouts = animationsTimeouts.filter((item) => item.id !== timeoutId);
  }
  dynamicx.stop(el, { timeout: false });
  if (!options.animated) {
    dynamicx.css(el, properties);
    if (typeof options.complete === "function") {
      options.complete(el);
    }
    return;
  }
  const startProperties = getCurrentProperties(el, Object.keys(properties));
  const props = parseProperties(properties);
  const endProperties = {};
  const transforms = [];
  for (const k in props) {
    let v = props[k];
    if (el.style != null && transformProperties.contains(k)) {
      transforms.push([k, v]);
    } else if (stringProperties.contains(k)) {
      endProperties[k] = InterpolableString.create(v);
    } else {
      endProperties[k] = createInterpolable(v);
    }
  }
  if (transforms.length > 0) {
    const isSVG = isSVGElement(el);
    let matrix;
    if (isSVG) {
      matrix = new Matrix2D$1();
      matrix.applyProperties(transforms);
    } else if (Array.isArray(transforms)) {
      const v = transforms.map((transform) => {
        return transformValueForProperty(transform[0], transform[1].toString());
      }).join(" ");
      matrix = Matrix$1.fromTransform(Matrix$1.matrixForTransform(v));
    }
    if (matrix) {
      endProperties["transform"] = matrix.decompose();
    }
    if (isSVG) {
      startProperties.transform.applyRotateCenter([
        endProperties.transform.props.rotate[1],
        endProperties.transform.props.rotate[2]
      ]);
    }
  }
  addUnitsToNumberInterpolables(el, endProperties);
  if (endProperties) {
    animations.push({
      el,
      properties: {
        start: startProperties,
        end: endProperties
      },
      options,
      curve: options.type(options)
    });
    return startRunLoop();
  }
};
let timeouts = [], timeoutLastId = 0;
const setRealTimeout = (timeout) => {
  if (isDocumentVisible()) {
    return rAF(() => {
      if (timeouts.indexOf(timeout) !== -1) {
        return timeout.realTimeoutId = window.setTimeout(() => {
          timeout.fn();
          return cancelTimeout(timeout.id);
        }, timeout.delay);
      }
    });
  }
};
const addTimeout = (fn, delay) => {
  timeoutLastId += 1;
  const timeout = {
    id: timeoutLastId,
    tStart: Date.now(),
    fn,
    delay,
    originalDelay: delay
  };
  setRealTimeout(timeout);
  timeouts.push(timeout);
  return timeoutLastId;
};
const cancelTimeout = (id) => {
  return timeouts = timeouts.filter((timeout) => {
    if (timeout.id === id && timeout.realTimeoutId) {
      window.clearTimeout(timeout.realTimeoutId);
    }
    return timeout.id !== id;
  });
};
const leftDelayForTimeout = (time, timeout) => {
  let consumedDelay = 0;
  if (time !== null) {
    consumedDelay = time - timeout.tStart;
    return timeout.originalDelay - consumedDelay;
  } else {
    return timeout.originalDelay;
  }
};
let timeBeforeVisibilityChange = null;
observeVisibilityChange((visible) => {
  runLoopPaused = !visible;
  if (!visible) {
    timeBeforeVisibilityChange = Date.now();
    const _results = [];
    for (const timeout of timeouts) {
      _results.push(window.clearTimeout(timeout.realTimeoutId));
    }
    return _results;
  } else {
    if (runLoopRunning) {
      const difference = Date.now() - timeBeforeVisibilityChange;
      for (const animation of animations) {
        if (animation.tStart != null) {
          animation.tStart += difference;
        }
      }
    }
    for (const timeout of timeouts) {
      timeout.delay = leftDelayForTimeout(timeBeforeVisibilityChange, timeout);
      setRealTimeout(timeout);
    }
    timeBeforeVisibilityChange = void 0;
    return timeBeforeVisibilityChange;
  }
});
class Dynamicx {
  constructor() {
    this.linear = () => (t) => t;
    this.spring = (options = {}) => {
      const opt = {
        frequency: 300,
        friction: 200,
        anticipationSize: 0,
        anticipationStrength: 0,
        ...options
      };
      const frequency = Math.max(1, opt.frequency / 20);
      const friction = Math.pow(20, opt.friction / 100);
      const s = opt.anticipationSize / 1e3;
      const A1 = (t) => {
        let M, a, b, x0, x1;
        M = 0.8;
        x0 = s / (1 - s);
        x1 = 0;
        b = (x0 - M * x1) / (x0 - x1);
        a = (M - b) / x0;
        return a * t * opt.anticipationStrength / 100 + b;
      };
      const A2 = (t) => {
        return Math.pow(friction / 10, -t) * (1 - t);
      };
      return (t) => {
        let A, At, a, angle, b, frictionT, y0, yS;
        frictionT = t / (1 - s) - s / (1 - s);
        if (t < s) {
          yS = s / (1 - s) - s / (1 - s);
          y0 = 0 / (1 - s) - s / (1 - s);
          b = Math.acos(1 / A1(yS));
          a = (Math.acos(1 / A1(y0)) - b) / (frequency * -s);
          A = A1;
        } else {
          A = A2;
          b = 0;
          a = 1;
        }
        At = A(frictionT);
        angle = frequency * (t - s) * a + b;
        return 1 - At * Math.cos(angle);
      };
    };
    this.bounce = (options = {}) => {
      const opt = {
        frequency: 300,
        friction: 200,
        ...options
      };
      const frequency = Math.max(1, opt.frequency / 20);
      const friction = Math.pow(20, opt.friction / 100);
      const A = (t) => {
        return Math.pow(friction / 10, -t) * (1 - t);
      };
      const fn = (t) => {
        const b = -3.14 / 2;
        const a = 1;
        const At = A(t);
        const angle = frequency * t * a + b;
        return At * Math.cos(angle);
      };
      fn.returnsToSelf = true;
      return fn;
    };
    this.gravity = (options = {}) => {
      const opt = {
        bounciness: 400,
        elasticity: 200,
        ...options
      };
      const bounciness = Math.min(opt.bounciness / 1250, 0.8);
      const elasticity = opt.elasticity / 1e3;
      const gravity = 100;
      const curves = [];
      const returnsToSelf = opt.returnsToSelf;
      let L = 0;
      L = (() => {
        const b = Math.sqrt(2 / gravity);
        let curve = {
          a: -b,
          b,
          H: 1
        };
        if (returnsToSelf) {
          curve.a = 0;
          curve.b = curve.b * 2;
        }
        while (curve.H > 1e-3) {
          L = curve.b - curve.a;
          curve = {
            a: curve.b,
            b: curve.b + L * bounciness,
            H: curve.H * bounciness * bounciness
          };
        }
        return curve.b;
      })();
      const getPointInCurve = (a, b, H, t) => {
        L = b - a;
        const t2 = 2 / L * t - 1 - a * 2 / L;
        let c = t2 * t2 * H - H + 1;
        if (returnsToSelf) {
          c = 1 - c;
        }
        return c;
      };
      (() => {
        let L2, b, curve, _results;
        b = Math.sqrt(2 / (gravity * L * L));
        curve = {
          a: -b,
          b,
          H: 1
        };
        if (returnsToSelf) {
          curve.a = 0;
          curve.b = curve.b * 2;
        }
        curves.push(curve);
        L2 = L;
        _results = [];
        while (curve.b < 1 && curve.H > 1e-3) {
          L2 = curve.b - curve.a;
          curve = {
            a: curve.b,
            b: curve.b + L2 * bounciness,
            H: curve.H * elasticity
          };
          _results.push(curves.push(curve));
        }
        return _results;
      })();
      const fn = (t) => {
        let curve, i, v;
        i = 0;
        curve = curves[i];
        while (!(t >= curve.a && t <= curve.b)) {
          i += 1;
          curve = curves[i];
          if (!curve) {
            break;
          }
        }
        if (!curve) {
          v = returnsToSelf ? 0 : 1;
        } else {
          v = getPointInCurve(curve.a, curve.b, curve.H, t);
        }
        return v;
      };
      fn.returnsToSelf = returnsToSelf;
      return fn;
    };
    this.forceWithGravity = (options = {}) => {
      const opt = {
        bounciness: 400,
        elasticity: 200,
        returnsToSelf: true,
        ...options
      };
      return dynamicx.gravity(opt);
    };
    this.bezier = (options) => {
      const Bezier_ = (t, p0, p1, p2, p3) => {
        return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
      };
      const Bezier = (t, p0, p1, p2, p3) => {
        return {
          x: Bezier_(t, p0.x, p1.x, p2.x, p3.x),
          y: Bezier_(t, p0.y, p1.y, p2.y, p3.y)
        };
      };
      const yForX = (xTarget, Bs, returnsToSelf) => {
        let B = null;
        const len = Bs.length;
        for (let i2 = 0; i2 < len; i2++) {
          const aB = Bs[i2];
          if (xTarget >= aB(0).x && xTarget <= aB(1).x) {
            B = aB;
          }
          if (B !== null) {
            break;
          }
        }
        if (!B) {
          if (returnsToSelf) {
            return 0;
          } else {
            return 1;
          }
        }
        const xTolerance = 1e-4;
        let lower = 0;
        let upper = 1;
        let percent = (upper + lower) / 2;
        let x = B(percent).x;
        let i = 0;
        while (Math.abs(xTarget - x) > xTolerance && i < 100) {
          if (xTarget > x) {
            lower = percent;
          } else {
            upper = percent;
          }
          percent = (upper + lower) / 2;
          x = B(percent).x;
          i += 1;
        }
        return B(percent).y;
      };
      const points = options.points;
      const _Bs = (() => {
        const Bs = [];
        const _fn = (pointA, pointB) => {
          const B2 = (t) => {
            return Bezier(t, pointA, pointA.cp[pointA.cp.length - 1], pointB.cp[0], pointB);
          };
          return Bs.push(B2);
        };
        for (const i in points) {
          const k = parseInt(i);
          if (k >= points.length - 1) {
            break;
          }
          _fn(points[k], points[k + 1]);
        }
        return Bs;
      })();
      const fn = (t) => {
        if (t === 0) {
          return 0;
        } else if (t === 1) {
          return 1;
        } else {
          return yForX(t, _Bs, fn.returnsToSelf);
        }
      };
      fn.returnsToSelf = points[points.length - 1].y === 0;
      return fn;
    };
    this.easeInOut = (options = {}) => {
      const opt = {
        friction: 500,
        ...options
      };
      const friction = opt.friction;
      return dynamicx.bezier({
        points: [
          {
            x: 0,
            y: 0,
            cp: [
              {
                x: 0.92 - friction / 1e3,
                y: 0
              }
            ]
          },
          {
            x: 1,
            y: 1,
            cp: [
              {
                x: 0.08 + friction / 1e3,
                y: 1
              }
            ]
          }
        ]
      });
    };
    this.easeIn = (options = {}) => {
      const opt = {
        friction: 500,
        ...options
      };
      const friction = opt.friction;
      return dynamicx.bezier({
        points: [
          {
            x: 0,
            y: 0,
            cp: [
              {
                x: 0.92 - friction / 1e3,
                y: 0
              }
            ]
          },
          {
            x: 1,
            y: 1,
            cp: [
              {
                x: 1,
                y: 1
              }
            ]
          }
        ]
      });
    };
    this.easeOut = (options = {}) => {
      const opt = {
        friction: 500,
        ...options
      };
      const friction = opt.friction;
      return dynamicx.bezier({
        points: [
          {
            x: 0,
            y: 0,
            cp: [
              {
                x: 0,
                y: 0
              }
            ]
          },
          {
            x: 1,
            y: 1,
            cp: [
              {
                x: 0.08 + friction / 1e3,
                y: 1
              }
            ]
          }
        ]
      });
    };
  }
  /**
   * Animates an element to the properties with the animation options
   * @param el Element | NodeList | HTMLCollection | Array | Object
   * @param properties animate properties
   * @param settings animate options
   * 
   * @example 
   * 
   * ```js
   * const el = document.querySelector('#triangle')
   * dynamicx.animate(el, {
   *   rotateZ: 180,
   *   scale: 1.5,
   *   borderBottomColor: '#43F086'
   * }, {
   *   type: dynamicx.spring,
   *   friction: 400,
   *   duration: 1300,
   *   complete: animate2
   * })
   * ```
   * Documentation: https://github.com/51fe/dynamicx/#reference
   */
  animate(el, properties, options) {
    const fn = (el2, properties2, options2) => {
      const opt = {
        type: dynamicx.easeInOut,
        duration: 1e3,
        delay: 0,
        animated: true,
        ...options2
      };
      opt.duration = Math.max(0, opt.duration * slowRatio);
      opt.delay = Math.max(0, opt.delay);
      if (opt.delay === 0) {
        return startAnimation(el2, properties2, opt);
      } else {
        const id = dynamicx.setTimeout(() => {
          return startAnimation(el2, properties2, opt, id);
        }, opt.delay);
        return animationsTimeouts.push({
          id,
          el: el2
        });
      }
    };
    if (el instanceof Array && el.length) {
      el.map((item) => fn(item, properties, options));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map((item) => fn(item, properties, options));
    } else {
      fn(el, properties, options);
    }
  }
  /**
  * This is applying the CSS properties to your element with the correct browser prefixes
  * @param el Element | NodeList | HTMLCollection | Object
  * @param properties css properties
  */
  css(el, properties) {
    if (el instanceof Array) {
      el.map((item) => applyProperties(item, properties));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map((item) => applyProperties(item, properties));
    } else {
      applyProperties(el, properties);
    }
  }
  /**
   * Stops the animation applied on the element
   * @param el 
   * @param options 
   */
  stop(el, options = {}) {
    const fn = (el2, options2) => {
      const opt = {
        timeout: true,
        ...options2
      };
      if (opt.timeout) {
        animationsTimeouts = animationsTimeouts.filter((timeout) => {
          if (timeout.el === el2 && (opt.filter == null || opt.filter(timeout))) {
            dynamicx.clearTimeout(timeout.id);
            return false;
          }
          return true;
        });
      }
      return animations = animations.filter((animation) => animation.el !== el2);
    };
    if (el instanceof Array) {
      el.map((item) => fn(item, options));
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
      Array.from(el).map((item) => fn(item, options));
    } else {
      fn(el, options);
    }
  }
  /**
   * Defines a setTimeout
   * @param fn callback
   * @param delay milliseconds
   */
  setTimeout(fn, delay) {
    return addTimeout(fn, delay * slowRatio);
  }
  /**
   * Clears the timeout that was defined earlier
   * @param id timeout id
   */
  clearTimeout(id) {
    return cancelTimeout(id);
  }
  /**
   * Toggles a debug mode to slow down every animations and timeout
   */
  toggleSlow() {
    slow = !slow;
    if (slow) {
      slowRatio = 3;
    } else {
      slowRatio = 1;
    }
    return console.log("dynamicx: slow animations " + (slow ? "enabled" : "disabled"));
  }
}
const dynamicx = new Dynamicx();
export {
  dynamicx as default
};
