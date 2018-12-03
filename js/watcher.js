function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
}

Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    var oldValue = this.value;
    var newValue = this.vm[this.exp];
    if (newValue !== oldValue) {
      this.value = newValue;
      this.cb(this.value);
    }
  },
  get: function () {
    Dep.target = this;
    var value = this.vm[this.exp];
    Dep.target = null;
    return value;
  }

}