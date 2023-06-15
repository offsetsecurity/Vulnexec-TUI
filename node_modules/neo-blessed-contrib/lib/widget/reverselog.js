var blessed = require('neo-blessed')
   , Node = blessed.Node
   , List = blessed.List   

function ReverseLog(options) {  

  if (!(this instanceof Node)) {
    return new ReverseLog(options);
  }

  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  this.options = options
  List.call(this, options);

  this.ReverseLogLines = []
  this.interactive = false
}


ReverseLog.prototype.ReverseLog = function(str) {  
  this.ReverseLogLines.push(str)  
  if (this.ReverseLogLines.length>this.options.bufferLength) {
    this.ReverseLogLines.shift()
  }
  this.setItems(this.ReverseLogLines)
  this.scrollTo(this.ReverseLogLines.length)
}

ReverseLog.prototype.__proto__ = List.prototype;

ReverseLog.prototype.type = 'ReverseLog';

module.exports = ReverseLog