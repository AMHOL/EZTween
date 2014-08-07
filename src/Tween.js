(function(window, undefined) {
  window.EZ = window.EZ || {};
  window.EZ.Easing = {
    Linear: function(percentComplete) {
      return percentComplete;
    }
  };
  var Tween = function(from) {
    if ( typeof from !== 'number' && Object.prototype.toString.call(from) !== '[object Object]' ) {
      throw 'from value must be an object or an integer';
    }
    this.started = false;
    this.playing = false;
    this.from = from;
    this.to = from;
    this.duration = 0;
    this.interval = 10;
    this.tweenFn = EZ.Easing.Linear;
    this.stepCallback = undefined;
    this.completeCallback = undefined;
  };
  Tween.prototype.setTo = function(to) {
    if ( (typeof to) !== (typeof this.from) ) {
      throw 'to value must be the same type as from value';
    }
    this.to = to;
    return this;
  };
  Tween.prototype.setDuration = function(duration) {
    this.duration = duration;
    return this;
  };
  Tween.prototype.setInterval = function(interval) {
    this.interval = interval;
    return this;
  };
  Tween.prototype.setTweenFn = function(tweenFn) {
    this.tweenFn = tweenFn;
    return this;
  };
  Tween.prototype.setStepCallback = function(stepCallback) {
    this.stepCallback = stepCallback;
    return this;
  };
  Tween.prototype.setCompleteCallback = function(completeCallback) {
    this.completeCallback = completeCallback;
    return this;
  };
  Tween.prototype.start = function(stepCallback, completeCallback) {
    if ( typeof stepCallback === 'function ' ) {
      this.setStepCallback(stepCallback);
    }
    if ( typeof completeCallback === 'function ' ) {
      this.setCompleteCallback(completeCallback);
    }
    if ( this.started ) {
      return this.play();
    }
    this.playing = this.started = true;
    timeElapsed = 0;
    var duration = parseInt(this.duration, 10);
    var interval = parseInt(this.interval, 10);
    if ( typeof this.tweenFn !== 'function' ) {
      throw 'tweenFn must be a function';
    }
    if ( isNaN(interval) || interval <= 0 ) {
      throw 'Interval must be a positive integer';
    }
    if ( isNaN(duration) || duration <= 0 ) {
      throw 'Duration must be a positive integer';
    }
    if ( interval > duration ) {
      duration = interval;
    }
    interval = makeIntervalFullyDivisible(interval, duration);
    
    var _self = this;
    var currentValue;
    eLoop = window.setInterval(function() {
      step(_self, interval, duration);
    }, interval);
    return this;
  };
  Tween.prototype.pause = Tween.prototype.stop = function() {
    if ( this.playing ) {
      window.clearInterval(eLoop);
      this.playing = false;
    }
    return this;
  };
  Tween.prototype.play = function() {
    if ( !this.started ) {
      return this.start();
    }
    if ( !this.playing ) {
      var _self = this;
      eLoop = window.setInterval(function() {
        step(_self, _self.interval, _self.duration);
      }, this.interval);
      this.playing = true;
    }
    return this;
  };
  window.EZ.Tween = Tween;
  var timeElapsed;
  var eLoop;
  function step(tween, interval, duration) {
    timeElapsed += interval;
    if ( typeof tween.from === 'number' ) {
      currentValue = tweenNumeric(tween.from, tween.to - tween.from, tween.tweenFn(timeElapsed / duration));
    } else {
      currentValue = clone(tween.from);
      for ( var k in tween.to ) {
        if ( typeof tween.from[k] !== 'number' || typeof tween.to[k] !== 'number' ) {
          continue;
        }
        currentValue[k] = tweenNumeric(tween.from[k], tween.to[k] - tween.from[k], tween.tweenFn(timeElapsed / duration));
      }
    }
    if ( typeof tween.stepCallback === 'function' ) {
      tween.stepCallback.call(tween, currentValue);
    }
    if ( timeElapsed >= duration ) {
      if ( typeof tween.completeCallback === 'function' ) {
        tween.completeCallback.call(tween, currentValue);
      }
      tween.stop();
    }
    return timeElapsed;
  }
  function tweenNumeric(from, valueDiff, percentComplete) {
    var result = from + (valueDiff * percentComplete);
    if ( result > from + valueDiff) {
      result = from + valueDiff;
    }
    return result;
  }
  function makeIntervalFullyDivisible(interval, duration) {
    return duration / Math.ceil(duration / interval);
  }
  function clone(obj) {
      if (null === obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
  }
})(this);
