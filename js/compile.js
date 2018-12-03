// Compile.prototype = {
//   compile: function (node) {
//     var nodeAttrs = node.attributes;
//     var self = this;
//     Array.prototype.forEach.call(nodeAttrs, function (attr) {
//       var attrName = attr.name;
//       if (self.isDirective(attrName)) {
//         var exp = attr.value;
//         var dir = attrName.substring(2);
//         if (self.isEventDirective(dir)) {
//           self.compileEvent(node, self.vm, exp, dir);
//         } else { // v-model指令
//           self.compileModel(node, self.vm, exp, dir);
//         }
//         node.removeAttribute(attrName);
//       }
//     });
//   },
//   compileEvent: function (node, vm, exp, dir) {
//     var eventType = dir.split(':')[1];
//     var cb = vm.methods && vm.methods[exp];

//     if (eventType && cb) {
//       node.addEventListener(eventType, cb.bind(vm), false);
//     }
//   },
//   compileModel: function (node, vm, exp, dir) {
//     var self = this;
//     var val = this.vm[exp];
//     this.modelUpdater(node, val);
//     // new Watcher(this.vm, exp, function (value) {
//     //   self.modelUpdater(node, value);
//     // });

//     node.addEventListener('input', function (e) {
//       var newValue = e.target.value;
//       if (val === newValue) {
//         return;
//       }
//       self.vm[exp] = newValue;
//       val = newValue;
//     });
//   },
//   modelUpdater: function (node, value, oldValue) {
//     node.value = typeof value == 'undefined' ? '' : value;
//   },
//   isDirective: function (attr) {
//     return attr.indexOf('v-') == 0;
//   },
//   isEventDirective: function (dir) {
//     return dir.indexOf('on:') === 0;
//   },
// }

function Compile(el, vm) {
  this.el = document.querySelector(el);
  this.vm = vm;
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
    this.fragment = this.nodeToFragment(this.el);
    this.compileElement(this.fragment);
    this.el.appendChild(this.fragment);
  },
  nodeToFragment: function (el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileElement: function (fragment) {
    var self = this;
    var childNodes = fragment.childNodes;

    [].slice.call(childNodes).forEach(function (node) {
      var reg = /\{\{(.*)\}\}/;
      var text = node.textContent;
      if (self.isElementNode(node)) {
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1]);
      }
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    })
  },
  compile: function (node) {
    var nodeAttrs = node.attributes;
    var self = this;
    Array.prototype.forEach.call(nodeAttrs, function (attr) {
      console.log(attr);
      var attrName = attr.name;
      var exp = attr.value;
      if (self.isDirective(attrName)) {
        var dir = attrName.substring(2);
        if (self.isEventDirective(dir)) {
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          self.compileModel(node, self.vm, exp, dir);
        }
      }
    })
  },
  compileText: function (node, exp) {
    var self = this;
    self.updateText(node, self.vm.data[exp]);
    new Watcher(self.vm, exp, function (value) {
      self.updateText(node, value);
    })
  },
  updateText: function (node, value) {
    node.textContent = value;
  },
  compileEvent: function (node, vm, exp, dir) {
    var type = dir.split(':')[1];
    var cb = vm.methods && vm.methods[exp];
    node.addEventListener(type, cb.bind(vm), false);
  },
  compileModel: function (node, vm, exp) {
    var self = this;
    var val = vm.data[exp];
    this.modelUpdater(node, val);
    node.addEventListener('input', function (e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      self.modelUpdater(node, newValue);
      vm.data[exp] = newValue;
    })
  },
  modelUpdater: function (node, value) {
    node.value = value;
  },
  isElementNode: function (node) {
    return node.nodeType == 1;
  },
  isDirective: function (attr) {
    return attr.indexOf('v-') == 0;
  },
  isEventDirective: function (dir) {
    return dir.indexOf('on:') == 0;
  },
  isTextNode: function (node) {
    return node.nodeType == 3;
  }
}