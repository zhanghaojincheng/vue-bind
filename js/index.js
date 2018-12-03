function SelfVue(options) {
  var self = this;
  this.vm = this;
  this.data = options.data;
  this.methods = options.methods;

  Object.keys(this.data).forEach(function (key) {
    self.agentKeys(key);
  })

  observe(this.data);
  new Compile(options.el, this.vm);
  options.mounted.call(this);
}

SelfVue.prototype = {
  agentKeys: function (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function () {
        return this.data[key];
      },
      set: function (newVal) {
        this.data[key] = newVal;
      }
    })
  }
}