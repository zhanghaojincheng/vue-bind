function observe(data) {
  if (!data || typeof data == 'undefined') {
    return;
  }
  new Observer(data);
}

function Observer(data) {
  var self = this;
  Object.keys(data).forEach(function (key) {
    self.defineReactive(data, key, data[key]);
  })
}

Observer.prototype = {
  defineReactive: function (data, key, val) {
    var dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function (newVal) {
        if (val !== newVal) {
          val = newVal;
        }
        dep.notify();
      }
    })
  }
}

function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    })
  }
}

Dep.target = null;