import dynamicx from '../lib/dynamicx.js'

 // Default options
 dynamicx.spring.defaults = {
  frequency: 300,
  friction: 200,
  anticipationSize: 0,
  anticipationStrength: 0
};

dynamicx.bounce.defaults = {
  frequency: 300,
  friction: 200
};

dynamicx.forceWithGravity.defaults = dynamicx.gravity.defaults = {
  bounciness: 400,
  elasticity: 200
};

dynamicx.easeInOut.defaults = dynamicx.easeIn.defaults = dynamicx.easeOut.defaults = {
  friction: 500
};

const roundf = function (float, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(float * factor) / factor;
};

const merge = function (a, b) {
  var c, k, v;
  c = {};
  for (k in a) {
    v = a[k];
    c[k] = v;
  }
  for (k in b) {
    v = b[k];
    c[k] = v;
  }
  return c;
};

class UIGraph {
  constructor(canvas) {
    this.insertPoint = this.insertPoint.bind(this);
    this.canvasKeyUp = this.canvasKeyUp.bind(this);
    this.canvasMouseUp = this.canvasMouseUp.bind(this);
    this.canvasMouseMove = this.canvasMouseMove.bind(this);
    this.canvasMouseDown = this.canvasMouseDown.bind(this);
    this.pointFromLocation = this.pointFromLocation.bind(this);
    this.isLocationAroundCenter = this.isLocationAroundCenter.bind(this);
    this.locationFromEvent = this.locationFromEvent.bind(this);
    this.draw = this.draw.bind(this);
    this.points = null;
    this.curve = null;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.editable = false;
    this.r = window.devicePixelRatio || 1;
    if (this.r) {
      canvas.style.width = "" + canvas.width + "px";
      canvas.style.height = "" + canvas.height + "px";
      canvas.width = canvas.width * this.r;
      canvas.height = canvas.height * this.r;
    }
    this.canvas.addEventListener('mousedown', this.canvasMouseDown);
    this.canvas.addEventListener('mousemove', this.canvasMouseMove);
    this.canvas.addEventListener('mouseup', this.canvasMouseUp);
    this.canvas.addEventListener('keyup', this.canvasKeyUp);
    this.canvas.addEventListener('keydown', (function (_this) {
      return function (e) {
        return e.preventDefault();
      };
    })(this));
  }
  pointCoordinates(point) {
    var h, w;
    w = this.canvas.width;
    h = this.canvas.height;
    return {
      x: point.x * w,
      y: (0.67 * h) - (point.y * 0.33 * h)
    };
  }

  convertFromCoordinates(location) {
    var h, r, w;
    r = window.devicePixelRatio;
    w = this.canvas.width;
    h = this.canvas.height;
    return {
      x: roundf(location.x / w * r, 3),
      y: roundf(((0.67 * h) - (location.y * r)) / (0.33 * h), 3)
    };
  }

  draw() {
    var controlPoint, coords, coordsControlPoint, h, point, r, step, t, v, w, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    if (!this.curve) {
      return;
    }
    r = window.devicePixelRatio;
    w = this.canvas.width;
    h = this.canvas.height;
    step = 0.001;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.strokeStyle = '#D5E6F8';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0.67 * h);
    this.ctx.lineTo(w, 0.67 * h);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0.34 * h);
    this.ctx.lineTo(w, 0.34 * h);
    this.ctx.stroke();
    t = 0;
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#teal';
    this.ctx.lineWidth = 2 * r;
    while (t <= 1) {
      v = this.curve(t);
      y = h - ((0.33 + (v * 0.33)) * h);
      if (t === 0) {
        this.ctx.moveTo(t * w, y);
      } else {
        this.ctx.lineTo(t * w, y);
      }
      t += step;
    }
    this.ctx.stroke();
    if (this.points) {
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        _ref1 = point.cp;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          controlPoint = _ref1[_j];
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'blue';
          this.ctx.lineWidth = 1;
          coords = this.pointCoordinates(point);
          this.ctx.moveTo(coords.x, coords.y);
          coordsControlPoint = this.pointCoordinates(controlPoint);
          this.ctx.lineTo(coordsControlPoint.x, coordsControlPoint.y);
          this.ctx.stroke();
        }
      }
      _ref2 = this.points;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        point = _ref2[_k];
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.selectedPoint === point ? 'black' : 'blue';
        this.ctx.fillStyle = 'white';
        this.ctx.lineWidth = 2 * r;
        coords = this.pointCoordinates(point);
        this.ctx.arc(coords.x, coords.y, 5 * r, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.stroke();
        _results.push((function () {
          var _l, _len3, _ref3, _results1;
          _ref3 = point.cp;
          _results1 = [];
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            controlPoint = _ref3[_l];
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.selectedPoint === controlPoint ? 'black' : 'blue';
            this.ctx.fillStyle = 'white';
            this.ctx.lineWidth = 1 * r;
            coords = this.pointCoordinates(controlPoint);
            this.ctx.arc(coords.x, coords.y, 3 * r, 0, Math.PI * 2, true);
            this.ctx.fill();
            _results1.push(this.ctx.stroke());
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  }

  locationFromEvent(e) {
    return {
      x: e.layerX,
      y: e.layerY
    };
  }

  isLocationAroundCenter(location, center, size) {
    var r;
    r = window.devicePixelRatio;
    center = {
      x: center.x / r,
      y: center.y / r
    };
    return (location.x >= center.x - size / 2) && (location.x <= center.x + size / 2) && (location.y >= center.y - size / 2) && (location.y <= center.y + size / 2);
  }

  pointFromLocation(location) {
    var controlPoint, point, _i, _j, _len, _len1, _ref, _ref1;
    if ((this.points == null) || this.points.length < 2) {
      return null;
    }
    _ref = this.points;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      if (point !== this.points[0]) {
        if (this.isLocationAroundCenter(location, this.pointCoordinates(point), 14)) {
          return point;
        }
      }
      _ref1 = point.cp;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        controlPoint = _ref1[_j];
        if (this.isLocationAroundCenter(location, this.pointCoordinates(controlPoint), 10)) {
          return controlPoint;
        }
      }
    }
    return null;
  }

  canvasMouseDown(e) {
    var converted, location;
    if (!this.editable) {
      return;
    }
    location = this.locationFromEvent(e);
    this.selectedPoint = this.pointFromLocation(location);
    if (!this.selectedPoint) {
      converted = this.convertFromCoordinates(location);
      this.selectedPoint = {
        x: converted.x,
        y: converted.y,
        cp: [
          {
            x: converted.x - 0.1,
            y: converted.y
          }, {
            x: converted.x + 0.1,
            y: converted.y
          }
        ]
      };
      this.insertPoint(this.selectedPoint);
    }
    if (typeof this.pointsChanged === "function") {
      this.pointsChanged();
    }
    this.draw();
    return this.dragging = true;
  }

  canvasMouseMove(e) {
    var controlPoint, location, point, _i, _len, _ref;
    if (!this.editable) {
      return;
    }
    if (!this.selectedPoint) {
      return;
    }
    if (!this.dragging) {
      return;
    }
    location = this.locationFromEvent(e);
    point = this.convertFromCoordinates(location);
    if (this.selectedPoint === this.points[this.points.length - 1]) {
      point.x = 1;
      point.y = Math.min(1, Math.max(0, Math.round(point.y)));
    }
    if (this.selectedPoint.cp) {
      _ref = this.selectedPoint.cp;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        controlPoint = _ref[_i];
        controlPoint.x = roundf(controlPoint.x + point.x - this.selectedPoint.x, 3);
        controlPoint.y = roundf(controlPoint.y + point.y - this.selectedPoint.y, 3);
      }
    }
    this.selectedPoint.x = point.x;
    this.selectedPoint.y = point.y;
    if (typeof this.pointsChanged === "function") {
      this.pointsChanged();
    }
    return this.draw();
  }

  canvasMouseUp(e) {
    if (!this.editable) {
      return;
    }
    this.dragging = false;
    return typeof this.pointsChanged === "function" ? this.pointsChanged() : void 0;
  }

  canvasKeyUp(e) {
    if (!this.editable) {
      return;
    }
    if (!this.selectedPoint) {
      return;
    }
    if (e.keyCode === 8) {
      if (!this.selectedPoint.cp) {
        return;
      }
      if (this.selectedPoint === this.points[0] || this.selectedPoint === this.points[this.points.length - 1]) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.points.splice(this.points.indexOf(this.selectedPoint), 1);
      this.selectedPoint = null;
      return typeof this.pointsChanged === "function" ? this.pointsChanged() : void 0;
    }
  }

  insertPoint(toInsertPoint) {
    var i, index, point, _ref;
    if (!this.points) {
      return;
    }
    index = 0;
    _ref = this.points;
    for (i in _ref) {
      point = _ref[i];
      if (point.x >= toInsertPoint.x) {
        index = i;
        break;
      }
    }
    return this.points.splice(index, 0, toInsertPoint);
  }
}

class UIProperty {
  constructor(options) {
    this.options = options != null ? options : {};
    this.setValue = this.setValue.bind(this);
    this.el = document.createElement('div');
    this.label = document.createElement('label');
    this.label.innerHTML = this.options.property;
    this.valueEl = document.createElement('div');
    this.valueEl.classList.add('value');
    this.valueEl.classList.add(options.property);
    this.el.appendChild(this.label);
    this.el.appendChild(this.valueEl);
    this.valueEl.innerHTML = this.options.value;
  }

  setValu(value) {
    this.options.value = value;
    return this.valueEl.innerHTML = this.options.value;
  }
}

class UISlider {
  constructor(options) {
    var _base, _base1;
    this.options = options != null ? options : {};
    this._windowMouseUp = this._windowMouseUp.bind(this);
    this._windowMouseMove = this._windowMouseMove.bind(this);
    this._controlMouseDown = this._controlMouseDown.bind(this);
    this._sliderMouseDown = this._sliderMouseDown.bind(this);
    this._updateLeftFromValue = this._updateLeftFromValue.bind(this);
    this.value = this.value.bind(this);
    if ((_base = this.options).min == null) {
      _base.min = 0;
    }
    if ((_base1 = this.options).max == null) {
      _base1.max = 1000;
    }
    if (this.options.value === void 0) {
      this.options.value = 10;
    }
    this.width = 205 - 11;
    this.el = document.createElement('div');
    this.label = document.createElement('label');
    this.label.innerHTML = this.options.property;
    this.valueEl = document.createElement('div');
    this.valueEl.classList.add('value');
    this.valueEl.classList.add(options.property);
    this.slider = document.createElement('div');
    this.slider.classList.add('slider');
    this.slider.classList.add(options.property);
    this.bar = document.createElement('div');
    this.bar.classList.add('bar');
    this.control = document.createElement('div');
    this.control.classList.add('control');
    this.slider.appendChild(this.bar);
    this.slider.appendChild(this.control);
    this.el.appendChild(this.label);
    this.el.appendChild(this.valueEl);
    this.el.appendChild(this.slider);
    this.valueEl.innerHTML = this.options.value;
    this._updateLeftFromValue();
    this.slider.addEventListener('mousedown', this._sliderMouseDown);
    this.control.addEventListener('mousedown', this._controlMouseDown);
  }

  value() {
    return this.options.value;
  }

  _updateLeftFromValue() {
    return this.control.style.left = (this.options.value - this.options.min) / (this.options.max - this.options.min) * this.width + "px";
  }

  _sliderMouseDown(e) {
    var layerX;
    layerX = e.layerX;
    this.options.value = Math.round(layerX / (this.width + 11) * (this.options.max - this.options.min) + this.options.min);
    this.valueEl.innerHTML = this.options.value;
    if (typeof this.onUpdate === "function") {
      this.onUpdate();
    }
    this.control.style.left = Math.round(layerX / (this.width + 11) * this.width) + "px";
    return this._controlMouseDown(e);
  }

  _controlMouseDown(e) {
    this.dragging = true;
    this.startPoint = [e.pageX, e.pageY];
    this.startLeft = parseInt(this.control.style.left || 0);
    this.control.classList.add('highlighted');
    window.addEventListener('mousemove', this._windowMouseMove);
    window.addEventListener('mouseup', this._windowMouseUp);
    return e.stopPropagation();
  }

  _windowMouseMove(e) {
    var dX, newLeft;
    if (!this.dragging) {
      return;
    }
    dX = e.pageX - this.startPoint[0];
    newLeft = this.startLeft + dX;
    if (newLeft > this.width) {
      newLeft = this.width;
    } else if (newLeft < 0) {
      newLeft = 0;
    }
    this.options.value = Math.round(newLeft / this.width * (this.options.max - this.options.min) + this.options.min);
    this.valueEl.innerHTML = this.options.value;
    if (typeof this.onUpdate === "function") {
      this.onUpdate();
    }
    return this.control.style.left = newLeft + "px";
  }

  _windowMouseUp(e) {
    this.dragging = false;
    this.control.classList.remove('highlighted');
    window.removeEventListener('mousemove', this._windowMouseMove);
    return window.removeEventListener('mouseup', this._windowMouseUp);
  }
}

class Editor {
  constructor(options) {
    var canvasSize, graphEl, r, settingsEl, spanIndex0, spanIndex1;
    this.options = options != null ? options : {};
    this.createCircle = this.createCircle.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.startAnimationDelayed = this.startAnimationDelayed.bind(this);
    this.onPointsChanged = this.onPointsChanged.bind(this);
    this.redraw = this.redraw.bind(this);
    this.update = this.update.bind(this);
    this.fillSettings = this.fillSettings.bind(this);
    this.selectDidChange = this.selectDidChange.bind(this);
    this.fillSelect = this.fillSelect.bind(this);
    this.width = 580;
    this.height = this.width - 234;
    this.duration = 1000;
    this.el = document.createElement('div');
    this.el.id = 'editor';
    this.el.addEventListener('click', function (e) {
      return e.stopPropagation();
    });
    graphEl = document.createElement('div');
    graphEl.className = 'graph';
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('tabIndex', '0');
    r = window.devicePixelRatio || 1;
    canvasSize = this.width - 234;
    this.canvas.width = "" + canvasSize;
    this.canvas.height = "" + canvasSize;
    spanIndex0 = document.createElement('span');
    spanIndex0.className = 'index0';
    spanIndex0.innerHTML = '0';
    spanIndex1 = document.createElement('span');
    spanIndex1.className = 'index1';
    spanIndex1.innerHTML = '1';
    graphEl.appendChild(this.canvas);
    graphEl.appendChild(spanIndex0);
    graphEl.appendChild(spanIndex1);
    this.el.appendChild(graphEl);
    settingsEl = document.createElement('div');
    settingsEl.className = 'settings';
    this.select = document.createElement('select');
    this.select.className = 'dynamicx';
    this.optionsEl = document.createElement('div');
    this.optionsEl.className = 'options';
    settingsEl.appendChild(this.select);
    settingsEl.appendChild(this.optionsEl);
    this.el.appendChild(settingsEl);
    this.currentCircle = null;
    this.select.addEventListener('change', this.selectDidChange);
    this.graph = new UIGraph(this.canvas);
    this.graph.pointsChanged = this.onPointsChanged;
    this.sliders = [];
    this.properties = [];
    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';
    this.fillSelect();
    this.selectDidChange();
  }

  fillSelect() {
    var k, option, sortedDynamicxKeys, _i, _len, _results;
    sortedDynamicxKeys = ['spring', 'bounce', 'forceWithGravity', 'gravity', 'bezier', 'easeInOut', 'easeIn', 'easeOut', 'linear'];
    _results = [];
    for (_i = 0, _len = sortedDynamicxKeys.length; _i < _len; _i++) {
      k = sortedDynamicxKeys[_i];
      option = document.createElement('option');
      option.innerHTML = "dynamicx." + k;
      option.value = k;
      _results.push(this.select.appendChild(option));
    }
    return _results;
  }

  selectDidChange() {
    var k, name, v, _ref;
    this.select.blur();
    name = this.select.options[this.select.selectedIndex].value;
    if (name === "bezier") {
      this.graph.points = [
        {
          x: 0,
          y: 0,
          cp: [
            {
              x: 0.1,
              y: 0
            }
          ]
        }, {
          x: 1,
          y: 1,
          cp: [
            {
              x: 0.9,
              y: 1
            }
          ]
        }
      ];
      this.graph.editable = true;
    } else {
      this.graph.points = null;
      this.graph.editable = false;
    }
    this.curveName = "dynamicx." + name;
    this.curve = eval(this.curveName);
    this.values = {};
    _ref = this.curve.defaults;
    for (k in _ref) {
      v = _ref[k];
      this.values[k] = v;
    }
    this.fillSettings();
    return this.update();
  }

  fillSettings() {
    var k, slider, v, _ref, _results;
    this.optionsEl.innerHTML = '';
    this.sliders = [];
    slider = new UISlider({
      min: 100,
      max: 5000,
      value: this.duration,
      property: "duration"
    });
    slider.onUpdate = this.update;
    this.optionsEl.appendChild(slider.el);
    this.sliders.push(slider);
    _ref = this.curve.defaults;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      slider = new UISlider({
        min: v === 0 ? 0 : 1,
        max: 1000,
        value: this.values[k],
        property: k
      });
      slider.onUpdate = this.update;
      this.optionsEl.appendChild(slider.el);
      _results.push(this.sliders.push(slider));
    }
    return _results;
  }

  update() {
    var points, slider, _i, _len, _ref, _ref1;
    _ref = this.sliders;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slider = _ref[_i];
      if (slider.options.property === 'duration') {
        this.duration = slider.value();
      } else {
        this.values[slider.options.property] = slider.value();
      }
    }
    if (this.graph.points != null) {
      points = this.graph.points.slice();
      points = points.sort(function (a, b) {
        if (a.x < b.x) {
          return -1;
        }
        return 1;
      });
      this.values.points = points;
    } else {
      delete this.values.points;
    }
    this.redraw();
    if ((_ref1 = this.options.onChange) != null) {
      _ref1.call(this);
    }
    return this.startAnimationDelayed();
  }

  redraw() {
    this.graph.curve = this.curve(this.values);
    return this.graph.draw();
  }

  onPointsChanged() {
    return this.update();
  }

  startAnimationDelayed() {
    dynamicx.clearTimeout(this.delayedAnimation);
    return this.delayedAnimation = dynamicx.setTimeout(this.startAnimation, 100);
  }

  startAnimation() {
    var circle, initialForce, oldCircle, options, timeout;
    timeout = 0;
    if (this.circle != null) {
      oldCircle = this.circle;
      this.circle = null;
      dynamicx.animate(oldCircle, {
        opacity: 0
      }, {
        type: dynamicx.easeInOut,
        duration: 100,
        complete: (function (_this) {
          return function () {
            var demo;
            demo = document.querySelector('.demo');
            if (oldCircle.parentNode != null) {
              return demo.removeChild(oldCircle);
            }
          };
        })(this)
      });
    }
    this.circle = circle = this.createCircle();
    clearTimeout(this.restartAnimationTimeout);
    initialForce = this.curve(this.values).initialForce;
    options = merge(this.values, {
      type: this.curve,
      duration: this.duration,
      delay: 250,
      complete: (function (_this) {
        return function () {
          var wasCircle;
          wasCircle = _this.circle;
          if (_this.circle !== circle) {
            return;
          }
          _this.circle = null;
          _this.restartAnimationTimeout = dynamicx.setTimeout(_this.startAnimation, 300);
          return dynamicx.animate(circle, {
            translateX: initialForce ? 0 : 350,
            scale: 0.01
          }, {
            type: dynamicx.easeInOut,
            duration: 100,
            delay: 100,
            complete: function () {
              var demo;
              demo = document.querySelector('.demo');
              if (circle.parentNode != null) {
                return demo.removeChild(circle);
              }
            }
          });
        };
      })(this)
    });
    return dynamicx.animate(circle, {
      translateX: 350
    }, options);
  };

  createCircle() {
    var circle, demo;
    demo = document.querySelector('.demo');
    circle = document.createElement('div');
    circle.className = 'circle';
    dynamicx.css(circle, {
      scale: 0.01
    });
    demo.appendChild(circle);
    dynamicx.animate(circle, {
      scale: 1
    }, {
      type: dynamicx.spring,
      friction: 300,
      duration: 800
    });
    return circle;
  }
}

var editor = new Editor();
document.querySelector(".editor").appendChild(editor.el);