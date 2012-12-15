/*  Prototype JavaScript framework, version 1.6.1
 *  (c) 2005-2009 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.6.1',

  Browser: (function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile.*Safari/.test(ua)
    }
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;

      var div = document.createElement('div');
      var form = document.createElement('form');
      var isSupported = false;

      if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;


var Abstract = { };


var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {
  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype;
    var properties = Object.keys(source);

    if (!Object.keys({ toString: true }).length) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames().first() == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
(function() {

  var _toString = Object.prototype.toString;

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(object) {
    var type = typeof object;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }

    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (isElement(object)) return;

    var results = [];
    for (var property in object) {
      var value = toJSON(object[property]);
      if (!isUndefined(value))
        results.push(property.toJSON() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    var results = [];
    for (var property in object)
      results.push(property);
    return results;
  }

  function values(object) {
    var results = [];
    for (var property in object)
      results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) == "[object Array]";
  }


  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return typeof object === "function";
  }

  function isString(object) {
    return _toString.call(object) == "[object String]";
  }

  function isNumber(object) {
    return _toString.call(object) == "[object Number]";
  }

  function isUndefined(object) {
    return typeof object === "undefined";
  }

  extend(Object, {
    extend:        extend,
    inspect:       inspect,
    toJSON:        toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = slice.call(arguments, 1);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    }
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }

  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  return {
    argumentNames:       argumentNames,
    bind:                bind,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  }
})());


Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};


RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, (function() {

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }

  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  }

  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script) });
  }

  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }


  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  }

  function toArray() {
    return this.split('');
  }

  function succ() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }

  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  function camelize() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  }

  function toJSON() {
    return this.inspect(true);
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }

  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern) {
    return this.indexOf(pattern) === 0;
  }

  function endsWith(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  }

  function empty() {
    return this == '';
  }

  function blank() {
    return /^\s*$/.test(this);
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }

  return {
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    strip:          String.prototype.trim ? String.prototype.trim : strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    toJSON:         toJSON,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       evalJSON,
    include:        include,
    startsWith:     startsWith,
    endsWith:       endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3];
      var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = (function() {
  function each(iterator, context) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index);
      if (!result) throw $break;
    });
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index))
        throw $break;
    });
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  }

  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(RegExp.escape(filter));

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index));
    });
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index);
    });
    return memo;
  }

  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value >= result)
        result = value;
    });
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index);
      if (result == null || value < result)
        result = value;
    });
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  }

  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index))
        results.push(value);
    });
    return results;
  }

  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }









  return {
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();
function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}

function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;


(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }

  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  function reverse(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  }

  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  }


  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }

  function toJSON() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (!Object.isUndefined(value)) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }

  function indexOf(item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
      if (this[i] === item) return i;
    return -1;
  }

  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
  }

  function concat() {
    var array = slice.call(this, 0), item;
    for (var i = 0, length = arguments.length; i < length; i++) {
      item = arguments[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
          array.push(item[j]);
      } else {
        array.push(item);
      }
    }
    return array;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse)
    arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each:     _each,
    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect,
    toJSON:    toJSON
  });

  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2)

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }

  function _each(iterator) {
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  }

  function set(key, value) {
    return this._object[key] = value;
  }

  function get(key) {
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }

  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }

  function toObject() {
    return Object.clone(this._object);
  }

  function keys() {
    return this.pluck('key');
  }

  function values() {
    return this.pluck('value');
  }

  function index(value) {
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    return key + '=' + encodeURIComponent(String.interpret(value));
  }

  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;

      if (values && typeof values == 'object') {
        if (Object.isArray(values))
          return results.concat(values.map(toQueryPair.curry(key)));
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  function toJSON() {
    return Object.toJSON(this.toObject());
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toJSON,
    clone:                  clone
  };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  function succ() {
    return this + 1;
  }

  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  function toJSON() {
    return isFinite(this) ? this.toString() : 'null';
  }

  function abs() {
    return Math.abs(this);
  }

  function round() {
    return Math.round(this);
  }

  function ceil() {
    return Math.ceil(this);
  }

  function floor() {
    return Math.floor(this);
  }

  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    toJSON:         toJSON,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  }

  function include(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }

  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());



var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isString(this.options.parameters))
      this.options.parameters = this.options.parameters.toQueryParams();
    else if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Object.toQueryString(params)) {
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300);
  },

  getStatus: function() {
    try {
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];








Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if(readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    json = decodeURIComponent(escape(json));
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});



function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(Element.extend(query.snapshotItem(i)));
    return results;
  };
}

/*--------------------------------------------------------------------------*/

if (!window.Node) var Node = { };

if (!Node.ELEMENT_NODE) {
  Object.extend(Node, {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  });
}


(function(global) {

  var SETATTRIBUTE_IGNORES_NAME = (function(){
    var elForm = document.createElement("form");
    var elInput = document.createElement("input");
    var root = document.documentElement;
    elInput.setAttribute("name", "test");
    elForm.appendChild(elInput);
    root.appendChild(elForm);
    var isBuggy = elForm.elements
      ? (typeof elForm.elements.test == "undefined")
      : null;
    root.removeChild(elForm);
    elForm = elInput = null;
    return isBuggy;
  })();

  var element = global.Element;
  global.Element = function(tagName, attributes) {
    attributes = attributes || { };
    tagName = tagName.toLowerCase();
    var cache = Element.cache;
    if (SETATTRIBUTE_IGNORES_NAME && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
    return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
  };
  Object.extend(global.Element, element || { });
  if (element) global.Element.prototype = element.prototype;
})(this);

Element.cache = { };
Element.idCounter = 1;

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },


  hide: function(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  },

  show: function(element) {
    element = $(element);
    element.style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: (function(){

    var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
      var el = document.createElement("select"),
          isBuggy = true;
      el.innerHTML = "<option value=\"test\">test</option>";
      if (el.options && el.options[0]) {
        isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
      }
      el = null;
      return isBuggy;
    })();

    var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
      try {
        var el = document.createElement("table");
        if (el && el.tBodies) {
          el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
          var isBuggy = typeof el.tBodies[0] == "undefined";
          el = null;
          return isBuggy;
        }
      } catch (e) {
        return true;
      }
    })();

    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
      var s = document.createElement("script"),
          isBuggy = false;
      try {
        s.appendChild(document.createTextNode(""));
        isBuggy = !s.firstChild ||
          s.firstChild && s.firstChild.nodeType !== 3;
      } catch (e) {
        isBuggy = true;
      }
      s = null;
      return isBuggy;
    })();

    function update(element, content) {
      element = $(element);

      if (content && content.toElement)
        content = content.toElement();

      if (Object.isElement(content))
        return element.update().insert(content);

      content = Object.toHTML(content);

      var tagName = element.tagName.toUpperCase();

      if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
        element.text = content;
        return element;
      }

      if (SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY) {
        if (tagName in Element._insertionTranslations.tags) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          Element._getContentFromAnonymousElement(tagName, content.stripScripts())
            .each(function(node) {
              element.appendChild(node)
            });
        }
        else {
          element.innerHTML = content.stripScripts();
        }
      }
      else {
        element.innerHTML = content.stripScripts();
      }

      content.evalScripts.bind(content).defer();
      return element;
    }

    return update;
  })(),

  replace: function(element, content) {
    element = $(element);
    if (content && content.toElement) content = content.toElement();
    else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
    element.parentNode.replaceChild(content, element);
    return element;
  },

  insert: function(element, insertions) {
    element = $(element);

    if (Object.isString(insertions) || Object.isNumber(insertions) ||
        Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
          insertions = {bottom:insertions};

    var content, insert, tagName, childNodes;

    for (var position in insertions) {
      content  = insertions[position];
      position = position.toLowerCase();
      insert = Element._insertionTranslations[position];

      if (content && content.toElement) content = content.toElement();
      if (Object.isElement(content)) {
        insert(element, content);
        continue;
      }

      content = Object.toHTML(content);

      tagName = ((position == 'before' || position == 'after')
        ? element.parentNode : element).tagName.toUpperCase();

      childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());

      if (position == 'top' || position == 'after') childNodes.reverse();
      childNodes.each(insert.curry(element));

      content.evalScripts.bind(content).defer();
    }

    return element;
  },

  wrap: function(element, wrapper, attributes) {
    element = $(element);
    if (Object.isElement(wrapper))
      $(wrapper).writeAttribute(attributes || { });
    else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
    else wrapper = new Element('div', wrapper);
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return Element.recursivelyCollect(element, 'parentNode');
  },

  descendants: function(element) {
    return Element.select(element, "*");
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return Element.recursivelyCollect(element, 'previousSibling');
  },

  nextSiblings: function(element) {
    return Element.recursivelyCollect(element, 'nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return Element.previousSiblings(element).reverse()
      .concat(Element.nextSiblings(element));
  },

  match: function(element, selector) {
    if (Object.isString(selector))
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = Element.ancestors(element);
    return Object.isNumber(expression) ? ancestors[expression] :
      Selector.findElement(ancestors, expression, index);
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return Element.firstDescendant(element);
    return Object.isNumber(expression) ? Element.descendants(element)[expression] :
      Element.select(element, expression)[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = Element.previousSiblings(element);
    return Object.isNumber(expression) ? previousSiblings[expression] :
      Selector.findElement(previousSiblings, expression, index);
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = Element.nextSiblings(element);
    return Object.isNumber(expression) ? nextSiblings[expression] :
      Selector.findElement(nextSiblings, expression, index);
  },


  select: function(element) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element, args);
  },

  adjacent: function(element) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Selector.findChildElements(element.parentNode, args).without(element);
  },

  identify: function(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;
    do { id = 'anonymous_element_' + Element.idCounter++ } while ($(id));
    Element.writeAttribute(element, 'id', id);
    return id;
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      var t = Element._attributeTranslations.read;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.include(':')) {
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  },

  writeAttribute: function(element, name, value) {
    element = $(element);
    var attributes = { }, t = Element._attributeTranslations.write;

    if (typeof name == 'object') attributes = name;
    else attributes[name] = Object.isUndefined(value) ? true : value;

    for (var attr in attributes) {
      name = t.names[attr] || attr;
      value = attributes[attr];
      if (t.values[attr]) name = t.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  },

  getHeight: function(element) {
    return Element.getDimensions(element).height;
  },

  getWidth: function(element) {
    return Element.getDimensions(element).width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    if (!Element.hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element[Element.hasClassName(element, className) ?
      'removeClassName' : 'addClassName'](element, className);
  },

  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);

    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;

    if (ancestor.contains)
      return ancestor.contains(element) && ancestor !== element;

    while (element = element.parentNode)
      if (element == ancestor) return true;

    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = Element.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value || value == 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    if (Object.isString(styles)) {
      element.style.cssText += ';' + styles;
      return styles.include('opacity') ?
        element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property]);
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            property] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = Element.getStyle(element, 'display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    if (originalPosition != 'fixed') // Switching fixed to absolute causes issues in Safari
      els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      if (Prototype.Browser.Opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = Element.getStyle(element, 'overflow') || 'auto';
    if (element._overflow !== 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (element.tagName.toUpperCase() == 'BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  absolutize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'absolute') return element;

    var offsets = Element.positionedOffset(element);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
    return element;
  },

  relativize: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') == 'relative') return element;

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
    return element;
  },

  cumulativeScrollOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return Element._returnOffset(valueL, valueT);
  },

  getOffsetParent: function(element) {
    if (element.offsetParent) return $(element.offsetParent);
    if (element == document.body) return $(element);

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return $(element);

    return $(document.body);
  },

  viewportOffset: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if (element.offsetParent == document.body &&
        Element.getStyle(element, 'position') == 'absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!Prototype.Browser.Opera || (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return Element._returnOffset(valueL, valueT);
  },

  clonePosition: function(element, source) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || { });

    source = $(source);
    var p = Element.viewportOffset(source);

    element = $(element);
    var delta = [0, 0];
    var parent = null;
    if (Element.getStyle(element, 'position') == 'absolute') {
      parent = Element.getOffsetParent(element);
      delta = Element.viewportOffset(parent);
    }

    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    if (options.setLeft)   element.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)    element.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if (options.setWidth)  element.style.width = source.offsetWidth + 'px';
    if (options.setHeight) element.style.height = source.offsetHeight + 'px';
    return element;
  }
};

Object.extend(Element.Methods, {
  getElementsBySelector: Element.Methods.select,

  childElements: Element.Methods.immediateDescendants
});

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: { }
  }
};

if (Prototype.Browser.Opera) {
  Element.Methods.getStyle = Element.Methods.getStyle.wrap(
    function(proceed, element, style) {
      switch (style) {
        case 'left': case 'top': case 'right': case 'bottom':
          if (proceed(element, 'position') === 'static') return null;
        case 'height': case 'width':
          if (!Element.visible(element)) return null;

          var dim = parseInt(proceed(element, style), 10);

          if (dim !== element['offset' + style.capitalize()])
            return dim + 'px';

          var properties;
          if (style === 'height') {
            properties = ['border-top-width', 'padding-top',
             'padding-bottom', 'border-bottom-width'];
          }
          else {
            properties = ['border-left-width', 'padding-left',
             'padding-right', 'border-right-width'];
          }
          return properties.inject(dim, function(memo, property) {
            var val = proceed(element, property);
            return val === null ? memo : memo - parseInt(val, 10);
          }) + 'px';
        default: return proceed(element, style);
      }
    }
  );

  Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(
    function(proceed, element, attribute) {
      if (attribute === 'title') return element.title;
      return proceed(element, attribute);
    }
  );
}

else if (Prototype.Browser.IE) {
  Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(
    function(proceed, element) {
      element = $(element);
      try { element.offsetParent }
      catch(e) { return $(document.body) }
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    }
  );

  $w('positionedOffset viewportOffset').each(function(method) {
    Element.Methods[method] = Element.Methods[method].wrap(
      function(proceed, element) {
        element = $(element);
        try { element.offsetParent }
        catch(e) { return Element._returnOffset(0,0) }
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        var offsetParent = element.getOffsetParent();
        if (offsetParent && offsetParent.getStyle('position') === 'fixed')
          offsetParent.setStyle({ zoom: 1 });
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
  });

  Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(
    function(proceed, element) {
      try { element.offsetParent }
      catch(e) { return Element._returnOffset(0,0) }
      return proceed(element);
    }
  );

  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset' + style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    function stripAlpha(filter){
      return filter.replace(/alpha\([^\)]*\)/gi,'');
    }
    element = $(element);
    var currentStyle = element.currentStyle;
    if ((currentStyle && !currentStyle.hasLayout) ||
      (!currentStyle && element.style.zoom == 'normal'))
        element.style.zoom = 1;

    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      (filter = stripAlpha(filter)) ?
        style.filter = filter : style.removeAttribute('filter');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = stripAlpha(filter) +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  Element._attributeTranslations = (function(){

    var classProp = 'className';
    var forProp = 'for';

    var el = document.createElement('div');

    el.setAttribute(classProp, 'x');

    if (el.className !== 'x') {
      el.setAttribute('class', 'x');
      if (el.className === 'x') {
        classProp = 'class';
      }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
      el.setAttribute('htmlFor', 'x');
      if (el.htmlFor === 'x') {
        forProp = 'htmlFor';
      }
    }
    el = null;

    return {
      read: {
        names: {
          'class':      classProp,
          'className':  classProp,
          'for':        forProp,
          'htmlFor':    forProp
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute);
          },
          _getAttr2: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: (function(){

            var el = document.createElement('div');
            el.onclick = Prototype.emptyFunction;
            var value = el.getAttribute('onclick');
            var f;

            if (String(value).indexOf('{') > -1) {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                attribute = attribute.toString();
                attribute = attribute.split('{')[1];
                attribute = attribute.split('}')[0];
                return attribute.strip();
              };
            }
            else if (value === '') {
              f = function(element, attribute) {
                attribute = element.getAttribute(attribute);
                if (!attribute) return null;
                return attribute.strip();
              };
            }
            el = null;
            return f;
          })(),
          _flag: function(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      }
    }
  })();

  Element._attributeTranslations.write = {
    names: Object.extend({
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  Element._attributeTranslations.has = {};

  $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' +
      'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
  });

  (function(v) {
    Object.extend(v, {
      href:        v._getAttr2,
      src:         v._getAttr2,
      type:        v._getAttr,
      action:      v._getAttrNode,
      disabled:    v._flag,
      checked:     v._flag,
      readonly:    v._flag,
      multiple:    v._flag,
      onload:      v._getEv,
      onunload:    v._getEv,
      onclick:     v._getEv,
      ondblclick:  v._getEv,
      onmousedown: v._getEv,
      onmouseup:   v._getEv,
      onmouseover: v._getEv,
      onmousemove: v._getEv,
      onmouseout:  v._getEv,
      onfocus:     v._getEv,
      onblur:      v._getEv,
      onkeypress:  v._getEv,
      onkeydown:   v._getEv,
      onkeyup:     v._getEv,
      onsubmit:    v._getEv,
      onreset:     v._getEv,
      onselect:    v._getEv,
      onchange:    v._getEv
    });
  })(Element._attributeTranslations.read.values);

  if (Prototype.BrowserFeatures.ElementExtensions) {
    (function() {
      function _descendants(element) {
        var nodes = element.getElementsByTagName('*'), results = [];
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName !== "!") // Filter out comment nodes.
            results.push(node);
        return results;
      }

      Element.Methods.down = function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return element.firstDescendant();
        return Object.isNumber(expression) ? _descendants(element)[expression] :
          Element.select(element, expression)[index || 0];
      }
    })();
  }

}

else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

else if (Prototype.Browser.WebKit) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;

    if (value == 1)
      if(element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++; element.width--;
      } else try {
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
      } catch (e) { }

    return element;
  };

  Element.Methods.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return Element._returnOffset(valueL, valueT);
  };
}

if ('outerHTML' in document.documentElement) {
  Element.Methods.replace = function(element, content) {
    element = $(element);

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (Element._insertionTranslations.tags[tagName]) {
      var nextSibling = element.next();
      var fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
      parent.removeChild(element);
      if (nextSibling)
        fragments.each(function(node) { parent.insertBefore(node, nextSibling) });
      else
        fragments.each(function(node) { parent.appendChild(node) });
    }
    else element.outerHTML = content.stripScripts();

    content.evalScripts.bind(content).defer();
    return element;
  };
}

Element._returnOffset = function(l, t) {
  var result = [l, t];
  result.left = l;
  result.top = t;
  return result;
};

Element._getContentFromAnonymousElement = function(tagName, html) {
  var div = new Element('div'), t = Element._insertionTranslations.tags[tagName];
  if (t) {
    div.innerHTML = t[0] + html + t[1];
    t[2].times(function() { div = div.firstChild });
  } else div.innerHTML = html;
  return $A(div.childNodes);
};

Element._insertionTranslations = {
  before: function(element, node) {
    element.parentNode.insertBefore(node, element);
  },
  top: function(element, node) {
    element.insertBefore(node, element.firstChild);
  },
  bottom: function(element, node) {
    element.appendChild(node);
  },
  after: function(element, node) {
    element.parentNode.insertBefore(node, element.nextSibling);
  },
  tags: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};

(function() {
  var tags = Element._insertionTranslations.tags;
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });
})();

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
};

Element.Methods.ByTag = { };

Object.extend(Element, Element.Methods);

(function(div) {

  if (!Prototype.BrowserFeatures.ElementExtensions && div['__proto__']) {
    window.HTMLElement = { };
    window.HTMLElement.prototype = div['__proto__'];
    Prototype.BrowserFeatures.ElementExtensions = true;
  }

  div = null;

})(document.createElement('div'))

Element.extend = (function() {

  function checkDeficiency(tagName) {
    if (typeof window.Element != 'undefined') {
      var proto = window.Element.prototype;
      if (proto) {
        var id = '_' + (Math.random()+'').slice(2);
        var el = document.createElement(tagName);
        proto[id] = 'x';
        var isBuggy = (el[id] !== 'x');
        delete proto[id];
        el = null;
        return isBuggy;
      }
    }
    return false;
  }

  function extendElementWith(element, methods) {
    for (var property in methods) {
      var value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }
  }

  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');

  if (Prototype.BrowserFeatures.SpecificElementExtensions) {
    if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
      return function(element) {
        if (element && typeof element._extendedByPrototype == 'undefined') {
          var t = element.tagName;
          if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
          }
        }
        return element;
      }
    }
    return Prototype.K;
  }

  var Methods = { }, ByTag = Element.Methods.ByTag;

  var extend = Object.extend(function(element) {
    if (!element || typeof element._extendedByPrototype != 'undefined' ||
        element.nodeType != 1 || element == window) return element;

    var methods = Object.clone(Methods),
        tagName = element.tagName.toUpperCase();

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    extendElementWith(element, methods);

    element._extendedByPrototype = Prototype.emptyFunction;
    return element;

  }, {
    refresh: function() {
      if (!Prototype.BrowserFeatures.ElementExtensions) {
        Object.extend(Methods, Element.Methods);
        Object.extend(Methods, Element.Methods.Simulated);
      }
    }
  });

  extend.refresh();
  return extend;
})();

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || { });
  else {
    if (Object.isArray(tagName)) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = { };
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    var element = document.createElement(tagName);
    var proto = element['__proto__'] || element.constructor.prototype;
    element = null;
    return proto;
  }

  var elementPrototype = window.HTMLElement ? HTMLElement.prototype :
   Element.prototype;

  if (F.ElementExtensions) {
    copy(Element.Methods, elementPrototype);
    copy(Element.Methods.Simulated, elementPrototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (Object.isUndefined(klass)) continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;

  if (Element.extend.refresh) Element.extend.refresh();
  Element.cache = { };
};


document.viewport = {

  getDimensions: function() {
    return { width: this.getWidth(), height: this.getHeight() };
  },

  getScrollOffsets: function() {
    return Element._returnOffset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop);
  }
};

(function(viewport) {
  var B = Prototype.Browser, doc = document, element, property = {};

  function getRootElement() {
    if (B.WebKit && !doc.evaluate)
      return document;

    if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
      return document.body;

    return document.documentElement;
  }

  function define(D) {
    if (!element) element = getRootElement();

    property[D] = 'client' + D;

    viewport['get' + D] = function() { return element[property[D]] };
    return viewport['get' + D]();
  }

  viewport.getWidth  = define.curry('Width');

  viewport.getHeight = define.curry('Height');
})(document.viewport);


Element.Storage = {
  UID: 1
};

Element.addMethods({
  getStorage: function(element) {
    if (!(element = $(element))) return;

    var uid;
    if (element === window) {
      uid = 0;
    } else {
      if (typeof element._prototypeUID === "undefined")
        element._prototypeUID = [Element.Storage.UID++];
      uid = element._prototypeUID[0];
    }

    if (!Element.Storage[uid])
      Element.Storage[uid] = $H();

    return Element.Storage[uid];
  },

  store: function(element, key, value) {
    if (!(element = $(element))) return;

    if (arguments.length === 2) {
      Element.getStorage(element).update(key);
    } else {
      Element.getStorage(element).set(key, value);
    }

    return element;
  },

  retrieve: function(element, key, defaultValue) {
    if (!(element = $(element))) return;
    var hash = Element.getStorage(element), value = hash.get(key);

    if (Object.isUndefined(value)) {
      hash.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  },

  clone: function(element, deep) {
    if (!(element = $(element))) return;
    var clone = element.cloneNode(deep);
    clone._prototypeUID = void 0;
    if (deep) {
      var descendants = Element.select(clone, '*'),
          i = descendants.length;
      while (i--) {
        descendants[i]._prototypeUID = void 0;
      }
    }
    return Element.extend(clone);
  }
});
/* Portions of the Selector class are derived from Jack Slocum's DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create({
  initialize: function(expression) {
    this.expression = expression.strip();

    if (this.shouldUseSelectorsAPI()) {
      this.mode = 'selectorsAPI';
    } else if (this.shouldUseXPath()) {
      this.mode = 'xpath';
      this.compileXPathMatcher();
    } else {
      this.mode = "normal";
      this.compileMatcher();
    }

  },

  shouldUseXPath: (function() {

    var IS_DESCENDANT_SELECTOR_BUGGY = (function(){
      var isBuggy = false;
      if (document.evaluate && window.XPathResult) {
        var el = document.createElement('div');
        el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';

        var xpath = ".//*[local-name()='ul' or local-name()='UL']" +
          "//*[local-name()='li' or local-name()='LI']";

        var result = document.evaluate(xpath, el, null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        isBuggy = (result.snapshotLength !== 2);
        el = null;
      }
      return isBuggy;
    })();

    return function() {
      if (!Prototype.BrowserFeatures.XPath) return false;

      var e = this.expression;

      if (Prototype.Browser.WebKit &&
       (e.include("-of-type") || e.include(":empty")))
        return false;

      if ((/(\[[\w-]*?:|:checked)/).test(e))
        return false;

      if (IS_DESCENDANT_SELECTOR_BUGGY) return false;

      return true;
    }

  })(),

  shouldUseSelectorsAPI: function() {
    if (!Prototype.BrowserFeatures.SelectorsAPI) return false;

    if (Selector.CASE_INSENSITIVE_CLASS_NAMES) return false;

    if (!Selector._div) Selector._div = new Element('div');

    try {
      Selector._div.querySelector(this.expression);
    } catch(e) {
      return false;
    }

    return true;
  },

  compileMatcher: function() {
    var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
        c = Selector.criteria, le, p, m, len = ps.length, name;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e];
      return;
    }

    this.matcher = ["this.matcher = function(root) {",
                    "var r = root, h = Selector.handlers, c = false, n;"];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          this.matcher.push(Object.isFunction(c[name]) ? c[name](m) :
            new Template(c[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push("return h.unique(n);\n}");
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher: function() {
    var e = this.expression, ps = Selector.patterns,
        x = Selector.xpath, le, m, len = ps.length, name;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        name = ps[i].name;
        if (m = e.match(ps[i].re)) {
          this.matcher.push(Object.isFunction(x[name]) ? x[name](m) :
            new Template(x[name]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements: function(root) {
    root = root || document;
    var e = this.expression, results;

    switch (this.mode) {
      case 'selectorsAPI':
        if (root !== document) {
          var oldId = root.id, id = $(root).identify();
          id = id.replace(/([\.:])/g, "\\$1");
          e = "#" + id + " " + e;
        }

        results = $A(root.querySelectorAll(e)).map(Element.extend);
        root.id = oldId;

        return results;
      case 'xpath':
        return document._getElementsByXPath(this.xpath, root);
      default:
       return this.matcher(root);
    }
  },

  match: function(element) {
    this.tokens = [];

    var e = this.expression, ps = Selector.patterns, as = Selector.assertions;
    var le, p, m, len = ps.length, name;

    while (e && le !== e && (/\S/).test(e)) {
      le = e;
      for (var i = 0; i<len; i++) {
        p = ps[i].re;
        name = ps[i].name;
        if (m = e.match(p)) {
          if (as[name]) {
            this.tokens.push([name, Object.clone(m)]);
            e = e.replace(m[0], '');
          } else {
            return this.findElements(document).include(element);
          }
        }
      }
    }

    var match = true, name, matches;
    for (var i = 0, token; token = this.tokens[i]; i++) {
      name = token[0], matches = token[1];
      if (!Selector.assertions[name](element, matches)) {
        match = false; break;
      }
    }

    return match;
  },

  toString: function() {
    return this.expression;
  },

  inspect: function() {
    return "#<Selector:" + this.expression.inspect() + ">";
  }
});

if (Prototype.BrowserFeatures.SelectorsAPI &&
 document.compatMode === 'BackCompat') {
  Selector.CASE_INSENSITIVE_CLASS_NAMES = (function(){
    var div = document.createElement('div'),
     span = document.createElement('span');

    div.id = "prototype_test_id";
    span.className = 'Test';
    div.appendChild(span);
    var isIgnored = (div.querySelector('#prototype_test_id .test') !== null);
    div = span = null;
    return isIgnored;
  })();
}

Object.extend(Selector, {
  _cache: { },

  xpath: {
    descendant:   "//*",
    child:        "/*",
    adjacent:     "/following-sibling::*[1]",
    laterSibling: '/following-sibling::*',
    tagName:      function(m) {
      if (m[1] == '*') return '';
      return "[local-name()='" + m[1].toLowerCase() +
             "' or local-name()='" + m[1].toUpperCase() + "']";
    },
    className:    "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id:           "[@id='#{1}']",
    attrPresence: function(m) {
      m[1] = m[1].toLowerCase();
      return new Template("[@#{1}]").evaluate(m);
    },
    attr: function(m) {
      m[1] = m[1].toLowerCase();
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo: function(m) {
      var h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (Object.isFunction(h)) return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=':  "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child':  '[not(following-sibling::*)]',
      'only-child':  '[not(preceding-sibling::* or following-sibling::*)]',
      'empty':       "[count(*) = 0 and (count(text()) = 0)]",
      'checked':     "[@checked]",
      'disabled':    "[(@disabled) and (@type!='hidden')]",
      'enabled':     "[not(@disabled) and (@type!='hidden')]",
      'not': function(m) {
        var e = m[6], p = Selector.patterns,
            x = Selector.xpath, le, v, len = p.length, name;

        var exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (var i = 0; i<len; i++) {
            name = p[i].name
            if (m = e.match(p[i].re)) {
              v = Object.isFunction(x[name]) ? x[name](m) : new Template(x[name]).evaluate(m);
              exclusion.push("(" + v.substring(1, v.length - 1) + ")");
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return "[not(" + exclusion.join(" and ") + ")]";
      },
      'nth-child':      function(m) {
        return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
      },
      'nth-last-child': function(m) {
        return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
      },
      'nth-of-type':    function(m) {
        return Selector.xpath.pseudos.nth("position() ", m);
      },
      'nth-last-of-type': function(m) {
        return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
      },
      'first-of-type':  function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type':   function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type':   function(m) {
        var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth: function(fragment, m) {
        var mm, formula = m[6], predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd')  formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
          return '[' + fragment + "= " + mm[1] + ']';
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == "-") mm[1] = -1;
          var a = mm[1] ? Number(mm[1]) : 1;
          var b = mm[2] ? Number(mm[2]) : 0;
          predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
          "((#{fragment} - #{b}) div #{a} >= 0)]";
          return new Template(predicate).evaluate({
            fragment: fragment, a: a, b: b });
        }
      }
    }
  },

  criteria: {
    tagName:      'n = h.tagName(n, r, "#{1}", c);      c = false;',
    className:    'n = h.className(n, r, "#{1}", c);    c = false;',
    id:           'n = h.id(n, r, "#{1}", c);           c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
    attr: function(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);
    },
    pseudo: function(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant:   'c = "descendant";',
    child:        'c = "child";',
    adjacent:     'c = "adjacent";',
    laterSibling: 'c = "laterSibling";'
  },

  patterns: [
    { name: 'laterSibling', re: /^\s*~\s*/ },
    { name: 'child',        re: /^\s*>\s*/ },
    { name: 'adjacent',     re: /^\s*\+\s*/ },
    { name: 'descendant',   re: /^\s/ },

    { name: 'tagName',      re: /^\s*(\*|[\w\-]+)(\b|$)?/ },
    { name: 'id',           re: /^#([\w\-\*]+)(\b|$)/ },
    { name: 'className',    re: /^\.([\w\-\*]+)(\b|$)/ },
    { name: 'pseudo',       re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/ },
    { name: 'attrPresence', re: /^\[((?:[\w-]+:)?[\w-]+)\]/ },
    { name: 'attr',         re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/ }
  ],

  assertions: {
    tagName: function(element, matches) {
      return matches[1].toUpperCase() == element.tagName.toUpperCase();
    },

    className: function(element, matches) {
      return Element.hasClassName(element, matches[1]);
    },

    id: function(element, matches) {
      return element.id === matches[1];
    },

    attrPresence: function(element, matches) {
      return Element.hasAttribute(element, matches[1]);
    },

    attr: function(element, matches) {
      var nodeValue = Element.readAttribute(element, matches[1]);
      return nodeValue && Selector.operators[matches[2]](nodeValue, matches[5] || matches[6]);
    }
  },

  handlers: {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        a.push(node);
      return a;
    },

    mark: function(nodes) {
      var _true = Prototype.emptyFunction;
      for (var i = 0, node; node = nodes[i]; i++)
        node._countedByPrototype = _true;
      return nodes;
    },

    unmark: (function(){

      var PROPERTIES_ATTRIBUTES_MAP = (function(){
        var el = document.createElement('div'),
            isBuggy = false,
            propName = '_countedByPrototype',
            value = 'x'
        el[propName] = value;
        isBuggy = (el.getAttribute(propName) === value);
        el = null;
        return isBuggy;
      })();

      return PROPERTIES_ATTRIBUTES_MAP ?
        function(nodes) {
          for (var i = 0, node; node = nodes[i]; i++)
            node.removeAttribute('_countedByPrototype');
          return nodes;
        } :
        function(nodes) {
          for (var i = 0, node; node = nodes[i]; i++)
            node._countedByPrototype = void 0;
          return nodes;
        }
    })(),

    index: function(parentNode, reverse, ofType) {
      parentNode._countedByPrototype = Prototype.emptyFunction;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          var node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
          if (node.nodeType == 1 && (!ofType || node._countedByPrototype)) node.nodeIndex = j++;
      }
    },

    unique: function(nodes) {
      if (nodes.length == 0) return nodes;
      var results = [], n;
      for (var i = 0, l = nodes.length; i < l; i++)
        if (typeof (n = nodes[i])._countedByPrototype == 'undefined') {
          n._countedByPrototype = Prototype.emptyFunction;
          results.push(Element.extend(n));
        }
      return Selector.handlers.unmark(results);
    },

    descendant: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, child; child = node.childNodes[j]; j++)
          if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent: function(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        var next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling: function(node) {
      while (node = node.nextSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling: function(node) {
      while (node = node.previousSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    tagName: function(nodes, root, tagName, combinator) {
      var uTagName = tagName.toUpperCase();
      var results = [], h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          if (combinator == "descendant") {
            for (var i = 0, node; node = nodes[i]; i++)
              h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } else nodes = this[combinator](nodes);
          if (tagName == "*") return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName.toUpperCase() === uTagName) results.push(node);
        return results;
      } else return root.getElementsByTagName(tagName);
    },

    id: function(nodes, root, id, combinator) {
      var targetNode = $(id), h = Selector.handlers;

      if (root == document) {
        if (!targetNode) return [];
        if (!nodes) return [targetNode];
      } else {
        if (!root.sourceIndex || root.sourceIndex < 1) {
          var nodes = root.getElementsByTagName('*');
          for (var j = 0, node; node = nodes[j]; j++) {
            if (node.id === id) return [node];
          }
        }
      }

      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Selector.handlers.previousElementSibling(targetNode) == node)
                return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className: function(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName: function(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      var needle = ' ' + className + ' ';
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
          results.push(node);
      }
      return results;
    },

    attrPresence: function(nodes, root, attr, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var results = [];
      for (var i = 0, node; node = nodes[i]; i++)
        if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr: function(nodes, root, attr, value, operator, combinator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      if (nodes && combinator) nodes = this[combinator](nodes);
      var handler = Selector.operators[operator], results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        var nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo: function(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName("*");
      return Selector.pseudos[name](nodes, value, root);
    }
  },

  pseudos: {
    'first-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'last-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'only-child': function(nodes, value, root) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
          results.push(node);
      return results;
    },
    'nth-child':        function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child':   function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type':      function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type':    function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, false, true);
    },
    'last-of-type':     function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, true, true);
    },
    'only-of-type':     function(nodes, formula, root) {
      var p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    getIndices: function(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], function(memo, i) {
        if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    nth: function(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd')  formula = '2n+1';
      var h = Selector.handlers, results = [], indexed = [], m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._countedByPrototype) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == "-") m[1] = -1;
        var a = m[1] ? Number(m[1]) : 1;
        var b = m[2] ? Number(m[2]) : 0;
        var indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (var j = 0; j < l; j++)
            if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    'empty': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (node.tagName == '!' || node.firstChild) continue;
        results.push(node);
      }
      return results;
    },

    'not': function(nodes, selector, root) {
      var h = Selector.handlers, selectorType, m;
      var exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node._countedByPrototype) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    'enabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node.disabled && (!node.type || node.type !== 'hidden'))
          results.push(node);
      return results;
    },

    'disabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.disabled) results.push(node);
      return results;
    },

    'checked': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.checked) results.push(node);
      return results;
    }
  },

  operators: {
    '=':  function(nv, v) { return nv == v; },
    '!=': function(nv, v) { return nv != v; },
    '^=': function(nv, v) { return nv == v || nv && nv.startsWith(v); },
    '$=': function(nv, v) { return nv == v || nv && nv.endsWith(v); },
    '*=': function(nv, v) { return nv == v || nv && nv.include(v); },
    '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
    '|=': function(nv, v) { return ('-' + (nv || "").toUpperCase() +
     '-').include('-' + (v || "").toUpperCase() + '-'); }
  },

  split: function(expression) {
    var expressions = [];
    expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
      expressions.push(m[1].strip());
    });
    return expressions;
  },

  matchElements: function(elements, expression) {
    var matches = $$(expression), h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++)
      if (element._countedByPrototype) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement: function(elements, expression, index) {
    if (Object.isNumber(expression)) {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements: function(element, expressions) {
    expressions = Selector.split(expressions.join(','));
    var results = [], h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  }
});

if (Prototype.Browser.IE) {
  Object.extend(Selector.handlers, {
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        if (node.tagName !== "!") a.push(node);
      return a;
    }
  });
}

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}

var Form = {
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit;

    var data = elements.inject({ }, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          if (key in result) {
            if (!Object.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return options.hash ? data : Object.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },

  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*'),
        element,
        arr = [ ],
        serializers = Form.Element.Serializers;
    for (var i = 0; element = elements[i]; i++) {
      arr.push(element);
    }
    return arr.inject([], function(elements, child) {
      if (serializers[child.tagName.toLowerCase()])
        elements.push(Element.extend(child));
      return elements;
    })
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/


Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {

  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element, value);
      default:
        return Form.Element.Serializers.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if (Object.isUndefined(value)) return element.checked ? element.value : null;
    else element.checked = !!value;
  },

  textarea: function(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  },

  select: function(element, value) {
    if (Object.isUndefined(value))
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    else {
      var opt, currentValue, single = !Object.isArray(value);
      for (var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if (single) {
          if (currentValue == value) {
            opt.selected = true;
            return;
          }
        }
        else opt.selected = value.include(currentValue);
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
};

/*--------------------------------------------------------------------------*/


Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
(function() {

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45,

    cache: {}
  };

  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  var _isButton;
  if (Prototype.Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function(event, code) {
      return event.button === buttonMap[code];
    };
  } else if (Prototype.Browser.WebKit) {
    _isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 1 && event.metaKey;
        default: return false;
      }
    };
  } else {
    _isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }

  function isLeftClick(event)   { return _isButton(event, 0) }

  function isMiddleClick(event) { return _isButton(event, 1) }

  function isRightClick(event)  { return _isButton(event, 2) }

  function element(event) {
    event = Event.extend(event);

    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE)
      node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    var element = Event.element(event);
    if (!expression) return element;
    var elements = [element].concat(element.ancestors());
    return Selector.findElement(elements, expression, 0);
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }


  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }

  Event.Methods = {
    isLeftClick: isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick: isRightClick,

    element: element,
    findElement: findElement,

    pointer: pointer,
    pointerX: pointerX,
    pointerY: pointerY,

    stop: stop
  };


  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (Prototype.Browser.IE) {
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover': element = event.fromElement; break;
        case 'mouseout':  element = event.toElement;   break;
        default: return null;
      }
      return Element.extend(element);
    }

    Object.extend(methods, {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    });

    Event.extend = function(event, element) {
      if (!event) return false;
      if (event._extendedByPrototype) return event;

      event._extendedByPrototype = Prototype.emptyFunction;
      var pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });

      return Object.extend(event, methods);
    };
  } else {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
    Event.extend = Prototype.K;
  }

  function _createResponder(element, eventName, handler) {
    var registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) {
      CACHE.push(element);
      registry = Element.retrieve(element, 'prototype_event_registry', $H());
    }

    var respondersForEvent = registry.get(eventName);
    if (Object.isUndefined(respondersForEvent)) {
      respondersForEvent = [];
      registry.set(eventName, respondersForEvent);
    }

    if (respondersForEvent.pluck('handler').include(handler)) return false;

    var responder;
    if (eventName.include(":")) {
      responder = function(event) {
        if (Object.isUndefined(event.eventName))
          return false;

        if (event.eventName !== eventName)
          return false;

        Event.extend(event, element);
        handler.call(element, event);
      };
    } else {
      if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
       (eventName === "mouseenter" || eventName === "mouseleave")) {
        if (eventName === "mouseenter" || eventName === "mouseleave") {
          responder = function(event) {
            Event.extend(event, element);

            var parent = event.relatedTarget;
            while (parent && parent !== element) {
              try { parent = parent.parentNode; }
              catch(e) { parent = element; }
            }

            if (parent === element) return;

            handler.call(element, event);
          };
        }
      } else {
        responder = function(event) {
          Event.extend(event, element);
          handler.call(element, event);
        };
      }
    }

    responder.handler = handler;
    respondersForEvent.push(responder);
    return responder;
  }

  function _destroyCache() {
    for (var i = 0, length = CACHE.length; i < length; i++) {
      Event.stopObserving(CACHE[i]);
      CACHE[i] = null;
    }
  }

  var CACHE = [];

  if (Prototype.Browser.IE)
    window.attachEvent('onunload', _destroyCache);

  if (Prototype.Browser.WebKit)
    window.addEventListener('unload', Prototype.emptyFunction, false);


  var _getDOMEventName = Prototype.K;

  if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
    _getDOMEventName = function(eventName) {
      var translations = { mouseenter: "mouseover", mouseleave: "mouseout" };
      return eventName in translations ? translations[eventName] : eventName;
    };
  }

  function observe(element, eventName, handler) {
    element = $(element);

    var responder = _createResponder(element, eventName, handler);

    if (!responder) return element;

    if (eventName.include(':')) {
      if (element.addEventListener)
        element.addEventListener("dataavailable", responder, false);
      else {
        element.attachEvent("ondataavailable", responder);
        element.attachEvent("onfilterchange", responder);
      }
    } else {
      var actualEventName = _getDOMEventName(eventName);

      if (element.addEventListener)
        element.addEventListener(actualEventName, responder, false);
      else
        element.attachEvent("on" + actualEventName, responder);
    }

    return element;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);

    var registry = Element.retrieve(element, 'prototype_event_registry');

    if (Object.isUndefined(registry)) return element;

    if (eventName && !handler) {
      var responders = registry.get(eventName);

      if (Object.isUndefined(responders)) return element;

      responders.each( function(r) {
        Element.stopObserving(element, eventName, r.handler);
      });
      return element;
    } else if (!eventName) {
      registry.each( function(pair) {
        var eventName = pair.key, responders = pair.value;

        responders.each( function(r) {
          Element.stopObserving(element, eventName, r.handler);
        });
      });
      return element;
    }

    var responders = registry.get(eventName);

    if (!responders) return;

    var responder = responders.find( function(r) { return r.handler === handler; });
    if (!responder) return element;

    var actualEventName = _getDOMEventName(eventName);

    if (eventName.include(':')) {
      if (element.removeEventListener)
        element.removeEventListener("dataavailable", responder, false);
      else {
        element.detachEvent("ondataavailable", responder);
        element.detachEvent("onfilterchange",  responder);
      }
    } else {
      if (element.removeEventListener)
        element.removeEventListener(actualEventName, responder, false);
      else
        element.detachEvent('on' + actualEventName, responder);
    }

    registry.set(eventName, responders.without(responder));

    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = $(element);

    if (Object.isUndefined(bubble))
      bubble = true;

    if (element == document && document.createEvent && !element.dispatchEvent)
      element = document.documentElement;

    var event;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent('dataavailable', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = bubble ? 'ondataavailable' : 'onfilterchange';
    }

    event.eventName = eventName;
    event.memo = memo || { };

    if (document.createEvent)
      element.dispatchEvent(event);
    else
      element.fireEvent(event.eventType, event);

    return Event.extend(event);
  }


  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving
  });

  Element.addMethods({
    fire:          fire,

    observe:       observe,

    stopObserving: stopObserving
  });

  Object.extend(document, {
    fire:          fire.methodize(),

    observe:       observe.methodize(),

    stopObserving: stopObserving.methodize(),

    loaded:        false
  });

  if (window.Event) Object.extend(window.Event, Event);
  else window.Event = Event;
})();

(function() {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  var timer;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (timer) window.clearTimeout(timer);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.stopObserving('readystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try { document.documentElement.doScroll('left'); }
    catch(e) {
      timer = pollDoScroll.defer();
      return;
    }
    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.observe('readystatechange', checkReadyState);
    if (window == top)
      timer = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
})();

Element.addMethods();

/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },


  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/// script.aculo.us builder.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

var Builder = {
  NODEMAP: {
    AREA: 'map',
    CAPTION: 'table',
    COL: 'table',
    COLGROUP: 'table',
    LEGEND: 'fieldset',
    OPTGROUP: 'select',
    OPTION: 'select',
    PARAM: 'object',
    TBODY: 'table',
    TD: 'table',
    TFOOT: 'table',
    TH: 'table',
    THEAD: 'table',
    TR: 'table'
  },
  // note: For Firefox < 1.5, OPTION and OPTGROUP tags are currently broken,
  //       due to a Firefox bug
  node: function(elementName) {
    elementName = elementName.toUpperCase();

    // try innerHTML approach
    var parentTag = this.NODEMAP[elementName] || 'div';
    var parentElement = document.createElement(parentTag);
    try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
      parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
    } catch(e) {}
    var element = parentElement.firstChild || null;

    // see if browser added wrapping tags
    if(element && (element.tagName.toUpperCase() != elementName))
      element = element.getElementsByTagName(elementName)[0];

    // fallback to createElement approach
    if(!element) element = document.createElement(elementName);

    // abort if nothing could be created
    if(!element) return;

    // attributes (or text)
    if(arguments[1])
      if(this._isStringOrNumber(arguments[1]) ||
        (arguments[1] instanceof Array) ||
        arguments[1].tagName) {
          this._children(element, arguments[1]);
        } else {
          var attrs = this._attributes(arguments[1]);
          if(attrs.length) {
            try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
              parentElement.innerHTML = "<" +elementName + " " +
                attrs + "></" + elementName + ">";
            } catch(e) {}
            element = parentElement.firstChild || null;
            // workaround firefox 1.0.X bug
            if(!element) {
              element = document.createElement(elementName);
              for(attr in arguments[1])
                element[attr == 'class' ? 'className' : attr] = arguments[1][attr];
            }
            if(element.tagName.toUpperCase() != elementName)
              element = parentElement.getElementsByTagName(elementName)[0];
          }
        }

    // text, or array of children
    if(arguments[2])
      this._children(element, arguments[2]);

     return $(element);
  },
  _text: function(text) {
     return document.createTextNode(text);
  },

  ATTR_MAP: {
    'className': 'class',
    'htmlFor': 'for'
  },

  _attributes: function(attributes) {
    var attrs = [];
    for(attribute in attributes)
      attrs.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) +
          '="' + attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;') + '"');
    return attrs.join(" ");
  },
  _children: function(element, children) {
    if(children.tagName) {
      element.appendChild(children);
      return;
    }
    if(typeof children=='object') { // array can hold nodes and text
      children.flatten().each( function(e) {
        if(typeof e=='object')
          element.appendChild(e);
        else
          if(Builder._isStringOrNumber(e))
            element.appendChild(Builder._text(e));
      });
    } else
      if(Builder._isStringOrNumber(children))
        element.appendChild(Builder._text(children));
  },
  _isStringOrNumber: function(param) {
    return(typeof param=='string' || typeof param=='number');
  },
  build: function(html) {
    var element = this.node('div');
    $(element).update(html.strip());
    return element.down();
  },
  dump: function(scope) {
    if(typeof scope != 'object' && typeof scope != 'function') scope = window; //global scope

    var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " +
      "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " +
      "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+
      "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+
      "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+
      "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);

    tags.each( function(tag){
      scope[tag] = function() {
        return Builder.node.apply(Builder, [tag].concat($A(arguments)));
      };
    });
  }
};// script.aculo.us effects.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// Contributors:
//  Justin Palmer (http://encytemedia.com/)
//  Mark Pilgrim (http://diveintomark.org/)
//  Martin Bialasinki
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

// converts rgb() and #xxx to #xxxxxx format,
// returns self (or first argument) if not convertable
String.prototype.parseColor = function() {
  var color = '#';
  if (this.slice(0,4) == 'rgb(') {
    var cols = this.slice(4,this.length-1).split(',');
    var i=0; do { color += parseInt(cols[i]).toColorPart() } while (++i<3);
  } else {
    if (this.slice(0,1) == '#') {
      if (this.length==4) for(var i=1;i<4;i++) color += (this.charAt(i) + this.charAt(i)).toLowerCase();
      if (this.length==7) color = this.toLowerCase();
    }
  }
  return (color.length==7 ? color : (arguments[0] || this));
};

/*--------------------------------------------------------------------------*/

Element.collectTextNodes = function(element) {
  return $A($(element).childNodes).collect( function(node) {
    return (node.nodeType==3 ? node.nodeValue :
      (node.hasChildNodes() ? Element.collectTextNodes(node) : ''));
  }).flatten().join('');
};

Element.collectTextNodesIgnoreClass = function(element, className) {
  return $A($(element).childNodes).collect( function(node) {
    return (node.nodeType==3 ? node.nodeValue :
      ((node.hasChildNodes() && !Element.hasClassName(node,className)) ?
        Element.collectTextNodesIgnoreClass(node, className) : ''));
  }).flatten().join('');
};

Element.setContentZoom = function(element, percent) {
  element = $(element);
  element.setStyle({fontSize: (percent/100) + 'em'});
  if (Prototype.Browser.WebKit) window.scrollBy(0,0);
  return element;
};

Element.getInlineOpacity = function(element){
  return $(element).style.opacity || '';
};

Element.forceRerendering = function(element) {
  try {
    element = $(element);
    var n = document.createTextNode(' ');
    element.appendChild(n);
    element.removeChild(n);
  } catch(e) { }
};

/*--------------------------------------------------------------------------*/

var Effect = {
  _elementDoesNotExistError: {
    name: 'ElementDoesNotExistError',
    message: 'The specified DOM element does not exist, but is required for this effect to operate'
  },
  Transitions: {
    linear: Prototype.K,
    sinoidal: function(pos) {
      return (-Math.cos(pos*Math.PI)/2) + .5;
    },
    reverse: function(pos) {
      return 1-pos;
    },
    flicker: function(pos) {
      var pos = ((-Math.cos(pos*Math.PI)/4) + .75) + Math.random()/4;
      return pos > 1 ? 1 : pos;
    },
    wobble: function(pos) {
      return (-Math.cos(pos*Math.PI*(9*pos))/2) + .5;
    },
    pulse: function(pos, pulses) {
      return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
    },
    spring: function(pos) {
      return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
    },
    none: function(pos) {
      return 0;
    },
    full: function(pos) {
      return 1;
    }
  },
  DefaultOptions: {
    duration:   1.0,   // seconds
    fps:        100,   // 100= assume 66fps max.
    sync:       false, // true for combining
    from:       0.0,
    to:         1.0,
    delay:      0.0,
    queue:      'parallel'
  },
  tagifyText: function(element) {
    var tagifyStyle = 'position:relative';
    if (Prototype.Browser.IE) tagifyStyle += ';zoom:1';

    element = $(element);
    $A(element.childNodes).each( function(child) {
      if (child.nodeType==3) {
        child.nodeValue.toArray().each( function(character) {
          element.insertBefore(
            new Element('span', {style: tagifyStyle}).update(
              character == ' ' ? String.fromCharCode(160) : character),
              child);
        });
        Element.remove(child);
      }
    });
  },
  multiple: function(element, effect) {
    var elements;
    if (((typeof element == 'object') ||
        Object.isFunction(element)) &&
       (element.length))
      elements = element;
    else
      elements = $(element).childNodes;

    var options = Object.extend({
      speed: 0.1,
      delay: 0.0
    }, arguments[2] || { });
    var masterDelay = options.delay;

    $A(elements).each( function(element, index) {
      new effect(element, Object.extend(options, { delay: index * options.speed + masterDelay }));
    });
  },
  PAIRS: {
    'slide':  ['SlideDown','SlideUp'],
    'blind':  ['BlindDown','BlindUp'],
    'appear': ['Appear','Fade']
  },
  toggle: function(element, effect, options) {
    element = $(element);
    effect  = (effect || 'appear').toLowerCase();
    
    return Effect[ Effect.PAIRS[ effect ][ element.visible() ? 1 : 0 ] ](element, Object.extend({
      queue: { position:'end', scope:(element.id || 'global'), limit: 1 }
    }, options || {}));
  }
};

Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;

/* ------------- core effects ------------- */

Effect.ScopedQueue = Class.create(Enumerable, {
  initialize: function() {
    this.effects  = [];
    this.interval = null;
  },
  _each: function(iterator) {
    this.effects._each(iterator);
  },
  add: function(effect) {
    var timestamp = new Date().getTime();

    var position = Object.isString(effect.options.queue) ?
      effect.options.queue : effect.options.queue.position;

    switch(position) {
      case 'front':
        // move unstarted effects after this effect
        this.effects.findAll(function(e){ return e.state=='idle' }).each( function(e) {
            e.startOn  += effect.finishOn;
            e.finishOn += effect.finishOn;
          });
        break;
      case 'with-last':
        timestamp = this.effects.pluck('startOn').max() || timestamp;
        break;
      case 'end':
        // start effect after last queued effect has finished
        timestamp = this.effects.pluck('finishOn').max() || timestamp;
        break;
    }

    effect.startOn  += timestamp;
    effect.finishOn += timestamp;

    if (!effect.options.queue.limit || (this.effects.length < effect.options.queue.limit))
      this.effects.push(effect);

    if (!this.interval)
      this.interval = setInterval(this.loop.bind(this), 15);
  },
  remove: function(effect) {
    this.effects = this.effects.reject(function(e) { return e==effect });
    if (this.effects.length == 0) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  loop: function() {
    var timePos = new Date().getTime();
    for(var i=0, len=this.effects.length;i<len;i++)
      this.effects[i] && this.effects[i].loop(timePos);
  }
});

Effect.Queues = {
  instances: $H(),
  get: function(queueName) {
    if (!Object.isString(queueName)) return queueName;

    return this.instances.get(queueName) ||
      this.instances.set(queueName, new Effect.ScopedQueue());
  }
};
Effect.Queue = Effect.Queues.get('global');

Effect.Base = Class.create({
  position: null,
  start: function(options) {
    if (options && options.transition === false) options.transition = Effect.Transitions.linear;
    this.options      = Object.extend(Object.extend({ },Effect.DefaultOptions), options || { });
    this.currentFrame = 0;
    this.state        = 'idle';
    this.startOn      = this.options.delay*1000;
    this.finishOn     = this.startOn+(this.options.duration*1000);
    this.fromToDelta  = this.options.to-this.options.from;
    this.totalTime    = this.finishOn-this.startOn;
    this.totalFrames  = this.options.fps*this.options.duration;

    this.render = (function() {
      function dispatch(effect, eventName) {
        if (effect.options[eventName + 'Internal'])
          effect.options[eventName + 'Internal'](effect);
        if (effect.options[eventName])
          effect.options[eventName](effect);
      }

      return function(pos) {
        if (this.state === "idle") {
          this.state = "running";
          dispatch(this, 'beforeSetup');
          if (this.setup) this.setup();
          dispatch(this, 'afterSetup');
        }
        if (this.state === "running") {
          pos = (this.options.transition(pos) * this.fromToDelta) + this.options.from;
          this.position = pos;
          dispatch(this, 'beforeUpdate');
          if (this.update) this.update(pos);
          dispatch(this, 'afterUpdate');
        }
      };
    })();

    this.event('beforeStart');
    if (!this.options.sync)
      Effect.Queues.get(Object.isString(this.options.queue) ?
        'global' : this.options.queue.scope).add(this);
  },
  loop: function(timePos) {
    if (timePos >= this.startOn) {
      if (timePos >= this.finishOn) {
        this.render(1.0);
        this.cancel();
        this.event('beforeFinish');
        if (this.finish) this.finish();
        this.event('afterFinish');
        return;
      }
      var pos   = (timePos - this.startOn) / this.totalTime,
          frame = (pos * this.totalFrames).round();
      if (frame > this.currentFrame) {
        this.render(pos);
        this.currentFrame = frame;
      }
    }
  },
  cancel: function() {
    if (!this.options.sync)
      Effect.Queues.get(Object.isString(this.options.queue) ?
        'global' : this.options.queue.scope).remove(this);
    this.state = 'finished';
  },
  event: function(eventName) {
    if (this.options[eventName + 'Internal']) this.options[eventName + 'Internal'](this);
    if (this.options[eventName]) this.options[eventName](this);
  },
  inspect: function() {
    var data = $H();
    for(property in this)
      if (!Object.isFunction(this[property])) data.set(property, this[property]);
    return '#<Effect:' + data.inspect() + ',options:' + $H(this.options).inspect() + '>';
  }
});

Effect.Parallel = Class.create(Effect.Base, {
  initialize: function(effects) {
    this.effects = effects || [];
    this.start(arguments[1]);
  },
  update: function(position) {
    this.effects.invoke('render', position);
  },
  finish: function(position) {
    this.effects.each( function(effect) {
      effect.render(1.0);
      effect.cancel();
      effect.event('beforeFinish');
      if (effect.finish) effect.finish(position);
      effect.event('afterFinish');
    });
  }
});

Effect.Tween = Class.create(Effect.Base, {
  initialize: function(object, from, to) {
    object = Object.isString(object) ? $(object) : object;
    var args = $A(arguments), method = args.last(),
      options = args.length == 5 ? args[3] : null;
    this.method = Object.isFunction(method) ? method.bind(object) :
      Object.isFunction(object[method]) ? object[method].bind(object) :
      function(value) { object[method] = value };
    this.start(Object.extend({ from: from, to: to }, options || { }));
  },
  update: function(position) {
    this.method(position);
  }
});

Effect.Event = Class.create(Effect.Base, {
  initialize: function() {
    this.start(Object.extend({ duration: 0 }, arguments[0] || { }));
  },
  update: Prototype.emptyFunction
});

Effect.Opacity = Class.create(Effect.Base, {
  initialize: function(element) {
    this.element = $(element);
    if (!this.element) throw(Effect._elementDoesNotExistError);
    // make this work on IE on elements without 'layout'
    if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
      this.element.setStyle({zoom: 1});
    var options = Object.extend({
      from: this.element.getOpacity() || 0.0,
      to:   1.0
    }, arguments[1] || { });
    this.start(options);
  },
  update: function(position) {
    this.element.setOpacity(position);
  }
});

Effect.Move = Class.create(Effect.Base, {
  initialize: function(element) {
    this.element = $(element);
    if (!this.element) throw(Effect._elementDoesNotExistError);
    var options = Object.extend({
      x:    0,
      y:    0,
      mode: 'relative'
    }, arguments[1] || { });
    this.start(options);
  },
  setup: function() {
    this.element.makePositioned();
    this.originalLeft = parseFloat(this.element.getStyle('left') || '0');
    this.originalTop  = parseFloat(this.element.getStyle('top')  || '0');
    if (this.options.mode == 'absolute') {
      this.options.x = this.options.x - this.originalLeft;
      this.options.y = this.options.y - this.originalTop;
    }
  },
  update: function(position) {
    this.element.setStyle({
      left: (this.options.x  * position + this.originalLeft).round() + 'px',
      top:  (this.options.y  * position + this.originalTop).round()  + 'px'
    });
  }
});

// for backwards compatibility
Effect.MoveBy = function(element, toTop, toLeft) {
  return new Effect.Move(element,
    Object.extend({ x: toLeft, y: toTop }, arguments[3] || { }));
};

Effect.Scale = Class.create(Effect.Base, {
  initialize: function(element, percent) {
    this.element = $(element);
    if (!this.element) throw(Effect._elementDoesNotExistError);
    var options = Object.extend({
      scaleX: true,
      scaleY: true,
      scaleContent: true,
      scaleFromCenter: false,
      scaleMode: 'box',        // 'box' or 'contents' or { } with provided values
      scaleFrom: 100.0,
      scaleTo:   percent
    }, arguments[2] || { });
    this.start(options);
  },
  setup: function() {
    this.restoreAfterFinish = this.options.restoreAfterFinish || false;
    this.elementPositioning = this.element.getStyle('position');

    this.originalStyle = { };
    ['top','left','width','height','fontSize'].each( function(k) {
      this.originalStyle[k] = this.element.style[k];
    }.bind(this));

    this.originalTop  = this.element.offsetTop;
    this.originalLeft = this.element.offsetLeft;

    var fontSize = this.element.getStyle('font-size') || '100%';
    ['em','px','%','pt'].each( function(fontSizeType) {
      if (fontSize.indexOf(fontSizeType)>0) {
        this.fontSize     = parseFloat(fontSize);
        this.fontSizeType = fontSizeType;
      }
    }.bind(this));

    this.factor = (this.options.scaleTo - this.options.scaleFrom)/100;

    this.dims = null;
    if (this.options.scaleMode=='box')
      this.dims = [this.element.offsetHeight, this.element.offsetWidth];
    if (/^content/.test(this.options.scaleMode))
      this.dims = [this.element.scrollHeight, this.element.scrollWidth];
    if (!this.dims)
      this.dims = [this.options.scaleMode.originalHeight,
                   this.options.scaleMode.originalWidth];
  },
  update: function(position) {
    var currentScale = (this.options.scaleFrom/100.0) + (this.factor * position);
    if (this.options.scaleContent && this.fontSize)
      this.element.setStyle({fontSize: this.fontSize * currentScale + this.fontSizeType });
    this.setDimensions(this.dims[0] * currentScale, this.dims[1] * currentScale);
  },
  finish: function(position) {
    if (this.restoreAfterFinish) this.element.setStyle(this.originalStyle);
  },
  setDimensions: function(height, width) {
    var d = { };
    if (this.options.scaleX) d.width = width.round() + 'px';
    if (this.options.scaleY) d.height = height.round() + 'px';
    if (this.options.scaleFromCenter) {
      var topd  = (height - this.dims[0])/2;
      var leftd = (width  - this.dims[1])/2;
      if (this.elementPositioning == 'absolute') {
        if (this.options.scaleY) d.top = this.originalTop-topd + 'px';
        if (this.options.scaleX) d.left = this.originalLeft-leftd + 'px';
      } else {
        if (this.options.scaleY) d.top = -topd + 'px';
        if (this.options.scaleX) d.left = -leftd + 'px';
      }
    }
    this.element.setStyle(d);
  }
});

Effect.Highlight = Class.create(Effect.Base, {
  initialize: function(element) {
    this.element = $(element);
    if (!this.element) throw(Effect._elementDoesNotExistError);
    var options = Object.extend({ startcolor: '#ffff99' }, arguments[1] || { });
    this.start(options);
  },
  setup: function() {
    // Prevent executing on elements not in the layout flow
    if (this.element.getStyle('display')=='none') { this.cancel(); return; }
    // Disable background image during the effect
    this.oldStyle = { };
    if (!this.options.keepBackgroundImage) {
      this.oldStyle.backgroundImage = this.element.getStyle('background-image');
      this.element.setStyle({backgroundImage: 'none'});
    }
    if (!this.options.endcolor)
      this.options.endcolor = this.element.getStyle('background-color').parseColor('#ffffff');
    if (!this.options.restorecolor)
      this.options.restorecolor = this.element.getStyle('background-color');
    // init color calculations
    this._base  = $R(0,2).map(function(i){ return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16) }.bind(this));
    this._delta = $R(0,2).map(function(i){ return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i] }.bind(this));
  },
  update: function(position) {
    this.element.setStyle({backgroundColor: $R(0,2).inject('#',function(m,v,i){
      return m+((this._base[i]+(this._delta[i]*position)).round().toColorPart()); }.bind(this)) });
  },
  finish: function() {
    this.element.setStyle(Object.extend(this.oldStyle, {
      backgroundColor: this.options.restorecolor
    }));
  }
});

Effect.ScrollTo = function(element) {
  var options = arguments[1] || { },
  scrollOffsets = document.viewport.getScrollOffsets(),
  elementOffsets = $(element).cumulativeOffset();

  if (options.offset) elementOffsets[1] += options.offset;

  return new Effect.Tween(null,
    scrollOffsets.top,
    elementOffsets[1],
    options,
    function(p){ scrollTo(scrollOffsets.left, p.round()); }
  );
};

/* ------------- combination effects ------------- */

Effect.Fade = function(element) {
  element = $(element);
  var oldOpacity = element.getInlineOpacity();
  var options = Object.extend({
    from: element.getOpacity() || 1.0,
    to:   0.0,
    afterFinishInternal: function(effect) {
      if (effect.options.to!=0) return;
      effect.element.hide().setStyle({opacity: oldOpacity});
    }
  }, arguments[1] || { });
  return new Effect.Opacity(element,options);
};

Effect.Appear = function(element) {
  element = $(element);
  var options = Object.extend({
  from: (element.getStyle('display') == 'none' ? 0.0 : element.getOpacity() || 0.0),
  to:   1.0,
  // force Safari to render floated elements properly
  afterFinishInternal: function(effect) {
    effect.element.forceRerendering();
  },
  beforeSetup: function(effect) {
    effect.element.setOpacity(effect.options.from).show();
  }}, arguments[1] || { });
  return new Effect.Opacity(element,options);
};

Effect.Puff = function(element) {
  element = $(element);
  var oldStyle = {
    opacity: element.getInlineOpacity(),
    position: element.getStyle('position'),
    top:  element.style.top,
    left: element.style.left,
    width: element.style.width,
    height: element.style.height
  };
  return new Effect.Parallel(
   [ new Effect.Scale(element, 200,
      { sync: true, scaleFromCenter: true, scaleContent: true, restoreAfterFinish: true }),
     new Effect.Opacity(element, { sync: true, to: 0.0 } ) ],
     Object.extend({ duration: 1.0,
      beforeSetupInternal: function(effect) {
        Position.absolutize(effect.effects[0].element);
      },
      afterFinishInternal: function(effect) {
         effect.effects[0].element.hide().setStyle(oldStyle); }
     }, arguments[1] || { })
   );
};

Effect.BlindUp = function(element) {
  element = $(element);
  element.makeClipping();
  return new Effect.Scale(element, 0,
    Object.extend({ scaleContent: false,
      scaleX: false,
      restoreAfterFinish: true,
      afterFinishInternal: function(effect) {
        effect.element.hide().undoClipping();
      }
    }, arguments[1] || { })
  );
};

Effect.BlindDown = function(element) {
  element = $(element);
  var elementDimensions = element.getDimensions();
  return new Effect.Scale(element, 100, Object.extend({
    scaleContent: false,
    scaleX: false,
    scaleFrom: 0,
    scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
    restoreAfterFinish: true,
    afterSetup: function(effect) {
      effect.element.makeClipping().setStyle({height: '0px'}).show();
    },
    afterFinishInternal: function(effect) {
      effect.element.undoClipping();
    }
  }, arguments[1] || { }));
};

Effect.SwitchOff = function(element) {
  element = $(element);
  var oldOpacity = element.getInlineOpacity();
  return new Effect.Appear(element, Object.extend({
    duration: 0.4,
    from: 0,
    transition: Effect.Transitions.flicker,
    afterFinishInternal: function(effect) {
      new Effect.Scale(effect.element, 1, {
        duration: 0.3, scaleFromCenter: true,
        scaleX: false, scaleContent: false, restoreAfterFinish: true,
        beforeSetup: function(effect) {
          effect.element.makePositioned().makeClipping();
        },
        afterFinishInternal: function(effect) {
          effect.element.hide().undoClipping().undoPositioned().setStyle({opacity: oldOpacity});
        }
      });
    }
  }, arguments[1] || { }));
};

Effect.DropOut = function(element) {
  element = $(element);
  var oldStyle = {
    top: element.getStyle('top'),
    left: element.getStyle('left'),
    opacity: element.getInlineOpacity() };
  return new Effect.Parallel(
    [ new Effect.Move(element, {x: 0, y: 100, sync: true }),
      new Effect.Opacity(element, { sync: true, to: 0.0 }) ],
    Object.extend(
      { duration: 0.5,
        beforeSetup: function(effect) {
          effect.effects[0].element.makePositioned();
        },
        afterFinishInternal: function(effect) {
          effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);
        }
      }, arguments[1] || { }));
};

Effect.Shake = function(element) {
  element = $(element);
  var options = Object.extend({
    distance: 20,
    duration: 0.5
  }, arguments[1] || {});
  var distance = parseFloat(options.distance);
  var split = parseFloat(options.duration) / 10.0;
  var oldStyle = {
    top: element.getStyle('top'),
    left: element.getStyle('left') };
    return new Effect.Move(element,
      { x:  distance, y: 0, duration: split, afterFinishInternal: function(effect) {
    new Effect.Move(effect.element,
      { x: -distance*2, y: 0, duration: split*2,  afterFinishInternal: function(effect) {
    new Effect.Move(effect.element,
      { x:  distance*2, y: 0, duration: split*2,  afterFinishInternal: function(effect) {
    new Effect.Move(effect.element,
      { x: -distance*2, y: 0, duration: split*2,  afterFinishInternal: function(effect) {
    new Effect.Move(effect.element,
      { x:  distance*2, y: 0, duration: split*2,  afterFinishInternal: function(effect) {
    new Effect.Move(effect.element,
      { x: -distance, y: 0, duration: split, afterFinishInternal: function(effect) {
        effect.element.undoPositioned().setStyle(oldStyle);
  }}); }}); }}); }}); }}); }});
};

Effect.SlideDown = function(element) {
  element = $(element).cleanWhitespace();
  // SlideDown need to have the content of the element wrapped in a container element with fixed height!
  var oldInnerBottom = element.down().getStyle('bottom');
  var elementDimensions = element.getDimensions();
  return new Effect.Scale(element, 100, Object.extend({
    scaleContent: false,
    scaleX: false,
    scaleFrom: window.opera ? 0 : 1,
    scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
    restoreAfterFinish: true,
    afterSetup: function(effect) {
      effect.element.makePositioned();
      effect.element.down().makePositioned();
      if (window.opera) effect.element.setStyle({top: ''});
      effect.element.makeClipping().setStyle({height: '0px'}).show();
    },
    afterUpdateInternal: function(effect) {
      effect.element.down().setStyle({bottom:
        (effect.dims[0] - effect.element.clientHeight) + 'px' });
    },
    afterFinishInternal: function(effect) {
      effect.element.undoClipping().undoPositioned();
      effect.element.down().undoPositioned().setStyle({bottom: oldInnerBottom}); }
    }, arguments[1] || { })
  );
};

Effect.SlideUp = function(element) {
  element = $(element).cleanWhitespace();
  var oldInnerBottom = element.down().getStyle('bottom');
  var elementDimensions = element.getDimensions();
  return new Effect.Scale(element, window.opera ? 0 : 1,
   Object.extend({ scaleContent: false,
    scaleX: false,
    scaleMode: 'box',
    scaleFrom: 100,
    scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
    restoreAfterFinish: true,
    afterSetup: function(effect) {
      effect.element.makePositioned();
      effect.element.down().makePositioned();
      if (window.opera) effect.element.setStyle({top: ''});
      effect.element.makeClipping().show();
    },
    afterUpdateInternal: function(effect) {
      effect.element.down().setStyle({bottom:
        (effect.dims[0] - effect.element.clientHeight) + 'px' });
    },
    afterFinishInternal: function(effect) {
      effect.element.hide().undoClipping().undoPositioned();
      effect.element.down().undoPositioned().setStyle({bottom: oldInnerBottom});
    }
   }, arguments[1] || { })
  );
};

// Bug in opera makes the TD containing this element expand for a instance after finish
Effect.Squish = function(element) {
  return new Effect.Scale(element, window.opera ? 1 : 0, {
    restoreAfterFinish: true,
    beforeSetup: function(effect) {
      effect.element.makeClipping();
    },
    afterFinishInternal: function(effect) {
      effect.element.hide().undoClipping();
    }
  });
};

Effect.Grow = function(element) {
  element = $(element);
  var options = Object.extend({
    direction: 'center',
    moveTransition: Effect.Transitions.sinoidal,
    scaleTransition: Effect.Transitions.sinoidal,
    opacityTransition: Effect.Transitions.full
  }, arguments[1] || { });
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    height: element.style.height,
    width: element.style.width,
    opacity: element.getInlineOpacity() };

  var dims = element.getDimensions();
  var initialMoveX, initialMoveY;
  var moveX, moveY;

  switch (options.direction) {
    case 'top-left':
      initialMoveX = initialMoveY = moveX = moveY = 0;
      break;
    case 'top-right':
      initialMoveX = dims.width;
      initialMoveY = moveY = 0;
      moveX = -dims.width;
      break;
    case 'bottom-left':
      initialMoveX = moveX = 0;
      initialMoveY = dims.height;
      moveY = -dims.height;
      break;
    case 'bottom-right':
      initialMoveX = dims.width;
      initialMoveY = dims.height;
      moveX = -dims.width;
      moveY = -dims.height;
      break;
    case 'center':
      initialMoveX = dims.width / 2;
      initialMoveY = dims.height / 2;
      moveX = -dims.width / 2;
      moveY = -dims.height / 2;
      break;
  }

  return new Effect.Move(element, {
    x: initialMoveX,
    y: initialMoveY,
    duration: 0.01,
    beforeSetup: function(effect) {
      effect.element.hide().makeClipping().makePositioned();
    },
    afterFinishInternal: function(effect) {
      new Effect.Parallel(
        [ new Effect.Opacity(effect.element, { sync: true, to: 1.0, from: 0.0, transition: options.opacityTransition }),
          new Effect.Move(effect.element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition }),
          new Effect.Scale(effect.element, 100, {
            scaleMode: { originalHeight: dims.height, originalWidth: dims.width },
            sync: true, scaleFrom: window.opera ? 1 : 0, transition: options.scaleTransition, restoreAfterFinish: true})
        ], Object.extend({
             beforeSetup: function(effect) {
               effect.effects[0].element.setStyle({height: '0px'}).show();
             },
             afterFinishInternal: function(effect) {
               effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle);
             }
           }, options)
      );
    }
  });
};

Effect.Shrink = function(element) {
  element = $(element);
  var options = Object.extend({
    direction: 'center',
    moveTransition: Effect.Transitions.sinoidal,
    scaleTransition: Effect.Transitions.sinoidal,
    opacityTransition: Effect.Transitions.none
  }, arguments[1] || { });
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    height: element.style.height,
    width: element.style.width,
    opacity: element.getInlineOpacity() };

  var dims = element.getDimensions();
  var moveX, moveY;

  switch (options.direction) {
    case 'top-left':
      moveX = moveY = 0;
      break;
    case 'top-right':
      moveX = dims.width;
      moveY = 0;
      break;
    case 'bottom-left':
      moveX = 0;
      moveY = dims.height;
      break;
    case 'bottom-right':
      moveX = dims.width;
      moveY = dims.height;
      break;
    case 'center':
      moveX = dims.width / 2;
      moveY = dims.height / 2;
      break;
  }

  return new Effect.Parallel(
    [ new Effect.Opacity(element, { sync: true, to: 0.0, from: 1.0, transition: options.opacityTransition }),
      new Effect.Scale(element, window.opera ? 1 : 0, { sync: true, transition: options.scaleTransition, restoreAfterFinish: true}),
      new Effect.Move(element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition })
    ], Object.extend({
         beforeStartInternal: function(effect) {
           effect.effects[0].element.makePositioned().makeClipping();
         },
         afterFinishInternal: function(effect) {
           effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle); }
       }, options)
  );
};

Effect.Pulsate = function(element) {
  element = $(element);
  var options    = arguments[1] || { },
    oldOpacity = element.getInlineOpacity(),
    transition = options.transition || Effect.Transitions.linear,
    reverser   = function(pos){
      return 1 - transition((-Math.cos((pos*(options.pulses||5)*2)*Math.PI)/2) + .5);
    };

  return new Effect.Opacity(element,
    Object.extend(Object.extend({  duration: 2.0, from: 0,
      afterFinishInternal: function(effect) { effect.element.setStyle({opacity: oldOpacity}); }
    }, options), {transition: reverser}));
};

Effect.Fold = function(element) {
  element = $(element);
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    width: element.style.width,
    height: element.style.height };
  element.makeClipping();
  return new Effect.Scale(element, 5, Object.extend({
    scaleContent: false,
    scaleX: false,
    afterFinishInternal: function(effect) {
    new Effect.Scale(element, 1, {
      scaleContent: false,
      scaleY: false,
      afterFinishInternal: function(effect) {
        effect.element.hide().undoClipping().setStyle(oldStyle);
      } });
  }}, arguments[1] || { }));
};

Effect.Morph = Class.create(Effect.Base, {
  initialize: function(element) {
    this.element = $(element);
    if (!this.element) throw(Effect._elementDoesNotExistError);
    var options = Object.extend({
      style: { }
    }, arguments[1] || { });

    if (!Object.isString(options.style)) this.style = $H(options.style);
    else {
      if (options.style.include(':'))
        this.style = options.style.parseStyle();
      else {
        this.element.addClassName(options.style);
        this.style = $H(this.element.getStyles());
        this.element.removeClassName(options.style);
        var css = this.element.getStyles();
        this.style = this.style.reject(function(style) {
          return style.value == css[style.key];
        });
        options.afterFinishInternal = function(effect) {
          effect.element.addClassName(effect.options.style);
          effect.transforms.each(function(transform) {
            effect.element.style[transform.style] = '';
          });
        };
      }
    }
    this.start(options);
  },

  setup: function(){
    function parseColor(color){
      if (!color || ['rgba(0, 0, 0, 0)','transparent'].include(color)) color = '#ffffff';
      color = color.parseColor();
      return $R(0,2).map(function(i){
        return parseInt( color.slice(i*2+1,i*2+3), 16 );
      });
    }
    this.transforms = this.style.map(function(pair){
      var property = pair[0], value = pair[1], unit = null;

      if (value.parseColor('#zzzzzz') != '#zzzzzz') {
        value = value.parseColor();
        unit  = 'color';
      } else if (property == 'opacity') {
        value = parseFloat(value);
        if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
          this.element.setStyle({zoom: 1});
      } else if (Element.CSS_LENGTH.test(value)) {
          var components = value.match(/^([\+\-]?[0-9\.]+)(.*)$/);
          value = parseFloat(components[1]);
          unit = (components.length == 3) ? components[2] : null;
      }

      var originalValue = this.element.getStyle(property);
      return {
        style: property.camelize(),
        originalValue: unit=='color' ? parseColor(originalValue) : parseFloat(originalValue || 0),
        targetValue: unit=='color' ? parseColor(value) : value,
        unit: unit
      };
    }.bind(this)).reject(function(transform){
      return (
        (transform.originalValue == transform.targetValue) ||
        (
          transform.unit != 'color' &&
          (isNaN(transform.originalValue) || isNaN(transform.targetValue))
        )
      );
    });
  },
  update: function(position) {
    var style = { }, transform, i = this.transforms.length;
    while(i--)
      style[(transform = this.transforms[i]).style] =
        transform.unit=='color' ? '#'+
          (Math.round(transform.originalValue[0]+
            (transform.targetValue[0]-transform.originalValue[0])*position)).toColorPart() +
          (Math.round(transform.originalValue[1]+
            (transform.targetValue[1]-transform.originalValue[1])*position)).toColorPart() +
          (Math.round(transform.originalValue[2]+
            (transform.targetValue[2]-transform.originalValue[2])*position)).toColorPart() :
        (transform.originalValue +
          (transform.targetValue - transform.originalValue) * position).toFixed(3) +
            (transform.unit === null ? '' : transform.unit);
    this.element.setStyle(style, true);
  }
});

Effect.Transform = Class.create({
  initialize: function(tracks){
    this.tracks  = [];
    this.options = arguments[1] || { };
    this.addTracks(tracks);
  },
  addTracks: function(tracks){
    tracks.each(function(track){
      track = $H(track);
      var data = track.values().first();
      this.tracks.push($H({
        ids:     track.keys().first(),
        effect:  Effect.Morph,
        options: { style: data }
      }));
    }.bind(this));
    return this;
  },
  play: function(){
    return new Effect.Parallel(
      this.tracks.map(function(track){
        var ids = track.get('ids'), effect = track.get('effect'), options = track.get('options');
        var elements = [$(ids) || $$(ids)].flatten();
        return elements.map(function(e){ return new effect(e, Object.extend({ sync:true }, options)) });
      }).flatten(),
      this.options
    );
  }
});

Element.CSS_PROPERTIES = $w(
  'backgroundColor backgroundPosition borderBottomColor borderBottomStyle ' +
  'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth ' +
  'borderRightColor borderRightStyle borderRightWidth borderSpacing ' +
  'borderTopColor borderTopStyle borderTopWidth bottom clip color ' +
  'fontSize fontWeight height left letterSpacing lineHeight ' +
  'marginBottom marginLeft marginRight marginTop markerOffset maxHeight '+
  'maxWidth minHeight minWidth opacity outlineColor outlineOffset ' +
  'outlineWidth paddingBottom paddingLeft paddingRight paddingTop ' +
  'right textIndent top width wordSpacing zIndex');

Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;

String.__parseStyleElement = document.createElement('div');
String.prototype.parseStyle = function(){
  var style, styleRules = $H();
  if (Prototype.Browser.WebKit)
    style = new Element('div',{style:this}).style;
  else {
    String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
    style = String.__parseStyleElement.childNodes[0].style;
  }

  Element.CSS_PROPERTIES.each(function(property){
    if (style[property]) styleRules.set(property, style[property]);
  });

  if (Prototype.Browser.IE && this.include('opacity'))
    styleRules.set('opacity', this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);

  return styleRules;
};

if (document.defaultView && document.defaultView.getComputedStyle) {
  Element.getStyles = function(element) {
    var css = document.defaultView.getComputedStyle($(element), null);
    return Element.CSS_PROPERTIES.inject({ }, function(styles, property) {
      styles[property] = css[property];
      return styles;
    });
  };
} else {
  Element.getStyles = function(element) {
    element = $(element);
    var css = element.currentStyle, styles;
    styles = Element.CSS_PROPERTIES.inject({ }, function(results, property) {
      results[property] = css[property];
      return results;
    });
    if (!styles.opacity) styles.opacity = element.getOpacity();
    return styles;
  };
}

Effect.Methods = {
  morph: function(element, style) {
    element = $(element);
    new Effect.Morph(element, Object.extend({ style: style }, arguments[2] || { }));
    return element;
  },
  visualEffect: function(element, effect, options) {
    element = $(element);
    var s = effect.dasherize().camelize(), klass = s.charAt(0).toUpperCase() + s.substring(1);
    new Effect[klass](element, options);
    return element;
  },
  highlight: function(element, options) {
    element = $(element);
    new Effect.Highlight(element, options);
    return element;
  }
};

$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown '+
  'pulsate shake puff squish switchOff dropOut').each(
  function(effect) {
    Effect.Methods[effect] = function(element, options){
      element = $(element);
      Effect[effect.charAt(0).toUpperCase() + effect.substring(1)](element, options);
      return element;
    };
  }
);

$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(
  function(f) { Effect.Methods[f] = Element[f]; }
);

Element.addMethods(Effect.Methods);// script.aculo.us dragdrop.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

if(Object.isUndefined(Effect))
  throw("dragdrop.js requires including script.aculo.us' effects.js library");

var Droppables = {
  drops: [],

  remove: function(element) {
    this.drops = this.drops.reject(function(d) { return d.element==$(element) });
  },

  add: function(element) {
    element = $(element);
    var options = Object.extend({
      greedy:     true,
      hoverclass: null,
      tree:       false
    }, arguments[1] || { });

    // cache containers
    if(options.containment) {
      options._containers = [];
      var containment = options.containment;
      if(Object.isArray(containment)) {
        containment.each( function(c) { options._containers.push($(c)) });
      } else {
        options._containers.push($(containment));
      }
    }

    if(options.accept) options.accept = [options.accept].flatten();

    Element.makePositioned(element); // fix IE
    options.element = element;

    this.drops.push(options);
  },

  findDeepestChild: function(drops) {
    deepest = drops[0];

    for (i = 1; i < drops.length; ++i)
      if (Element.isParent(drops[i].element, deepest.element))
        deepest = drops[i];

    return deepest;
  },

  isContained: function(element, drop) {
    var containmentNode;
    if(drop.tree) {
      containmentNode = element.treeNode;
    } else {
      containmentNode = element.parentNode;
    }
    return drop._containers.detect(function(c) { return containmentNode == c });
  },

  isAffected: function(point, element, drop) {
    return (
      (drop.element!=element) &&
      ((!drop._containers) ||
        this.isContained(element, drop)) &&
      ((!drop.accept) ||
        (Element.classNames(element).detect(
          function(v) { return drop.accept.include(v) } ) )) &&
      Position.within(drop.element, point[0], point[1]) );
  },

  deactivate: function(drop) {
    if(drop.hoverclass)
      Element.removeClassName(drop.element, drop.hoverclass);
    this.last_active = null;
  },

  activate: function(drop) {
    if(drop.hoverclass)
      Element.addClassName(drop.element, drop.hoverclass);
    this.last_active = drop;
  },

  show: function(point, element) {
    if(!this.drops.length) return;
    var drop, affected = [];

    this.drops.each( function(drop) {
      if(Droppables.isAffected(point, element, drop))
        affected.push(drop);
    });

    if(affected.length>0)
      drop = Droppables.findDeepestChild(affected);

    if(this.last_active && this.last_active != drop) this.deactivate(this.last_active);
    if (drop) {
      Position.within(drop.element, point[0], point[1]);
      if(drop.onHover)
        drop.onHover(element, drop.element, Position.overlap(drop.overlap, drop.element));

      if (drop != this.last_active) Droppables.activate(drop);
    }
  },

  fire: function(event, element) {
    if(!this.last_active) return;
    Position.prepare();

    if (this.isAffected([Event.pointerX(event), Event.pointerY(event)], element, this.last_active))
      if (this.last_active.onDrop) {
        this.last_active.onDrop(element, this.last_active.element, event);
        return true;
      }
  },

  reset: function() {
    if(this.last_active)
      this.deactivate(this.last_active);
  }
};

var Draggables = {
  drags: [],
  observers: [],

  register: function(draggable) {
    if(this.drags.length == 0) {
      this.eventMouseUp   = this.endDrag.bindAsEventListener(this);
      this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
      this.eventKeypress  = this.keyPress.bindAsEventListener(this);

      Event.observe(document, "mouseup", this.eventMouseUp);
      Event.observe(document, "mousemove", this.eventMouseMove);
      Event.observe(document, "keypress", this.eventKeypress);
    }
    this.drags.push(draggable);
  },

  unregister: function(draggable) {
    this.drags = this.drags.reject(function(d) { return d==draggable });
    if(this.drags.length == 0) {
      Event.stopObserving(document, "mouseup", this.eventMouseUp);
      Event.stopObserving(document, "mousemove", this.eventMouseMove);
      Event.stopObserving(document, "keypress", this.eventKeypress);
    }
  },

  activate: function(draggable) {
    if(draggable.options.delay) {
      this._timeout = setTimeout(function() {
        Draggables._timeout = null;
        window.focus();
        Draggables.activeDraggable = draggable;
      }.bind(this), draggable.options.delay);
    } else {
      window.focus(); // allows keypress events if window isn't currently focused, fails for Safari
      this.activeDraggable = draggable;
    }
  },

  deactivate: function() {
    this.activeDraggable = null;
  },

  updateDrag: function(event) {
    if(!this.activeDraggable) return;
    var pointer = [Event.pointerX(event), Event.pointerY(event)];
    // Mozilla-based browsers fire successive mousemove events with
    // the same coordinates, prevent needless redrawing (moz bug?)
    if(this._lastPointer && (this._lastPointer.inspect() == pointer.inspect())) return;
    this._lastPointer = pointer;

    this.activeDraggable.updateDrag(event, pointer);
  },

  endDrag: function(event) {
    if(this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    if(!this.activeDraggable) return;
    this._lastPointer = null;
    this.activeDraggable.endDrag(event);
    this.activeDraggable = null;
  },

  keyPress: function(event) {
    if(this.activeDraggable)
      this.activeDraggable.keyPress(event);
  },

  addObserver: function(observer) {
    this.observers.push(observer);
    this._cacheObserverCallbacks();
  },

  removeObserver: function(element) {  // element instead of observer fixes mem leaks
    this.observers = this.observers.reject( function(o) { return o.element==element });
    this._cacheObserverCallbacks();
  },

  notify: function(eventName, draggable, event) {  // 'onStart', 'onEnd', 'onDrag'
    if(this[eventName+'Count'] > 0)
      this.observers.each( function(o) {
        if(o[eventName]) o[eventName](eventName, draggable, event);
      });
    if(draggable.options[eventName]) draggable.options[eventName](draggable, event);
  },

  _cacheObserverCallbacks: function() {
    ['onStart','onEnd','onDrag'].each( function(eventName) {
      Draggables[eventName+'Count'] = Draggables.observers.select(
        function(o) { return o[eventName]; }
      ).length;
    });
  }
};

/*--------------------------------------------------------------------------*/

var Draggable = Class.create({
  initialize: function(element) {
    var defaults = {
      handle: false,
      reverteffect: function(element, top_offset, left_offset) {
        var dur = Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;
        new Effect.Move(element, { x: -left_offset, y: -top_offset, duration: dur,
          queue: {scope:'_draggable', position:'end'}
        });
      },
      endeffect: function(element) {
        var toOpacity = Object.isNumber(element._opacity) ? element._opacity : 1.0;
        new Effect.Opacity(element, {duration:0.2, from:0.7, to:toOpacity,
          queue: {scope:'_draggable', position:'end'},
          afterFinish: function(){
            Draggable._dragging[element] = false
          }
        });
      },
      zindex: 1000,
      revert: false,
      quiet: false,
      scroll: false,
      scrollSensitivity: 20,
      scrollSpeed: 15,
      snap: false,  // false, or xy or [x,y] or function(x,y){ return [x,y] }
      delay: 0
    };

    if(!arguments[1] || Object.isUndefined(arguments[1].endeffect))
      Object.extend(defaults, {
        starteffect: function(element) {
          element._opacity = Element.getOpacity(element);
          Draggable._dragging[element] = true;
          new Effect.Opacity(element, {duration:0.2, from:element._opacity, to:0.7});
        }
      });

    var options = Object.extend(defaults, arguments[1] || { });

    this.element = $(element);

    if(options.handle && Object.isString(options.handle))
      this.handle = this.element.down('.'+options.handle, 0);

    if(!this.handle) this.handle = $(options.handle);
    if(!this.handle) this.handle = this.element;

    if(options.scroll && !options.scroll.scrollTo && !options.scroll.outerHTML) {
      options.scroll = $(options.scroll);
      this._isScrollChild = Element.childOf(this.element, options.scroll);
    }

    Element.makePositioned(this.element); // fix IE

    this.options  = options;
    this.dragging = false;

    this.eventMouseDown = this.initDrag.bindAsEventListener(this);
    Event.observe(this.handle, "mousedown", this.eventMouseDown);

    Draggables.register(this);
  },

  destroy: function() {
    Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
    Draggables.unregister(this);
  },

  currentDelta: function() {
    return([
      parseInt(Element.getStyle(this.element,'left') || '0'),
      parseInt(Element.getStyle(this.element,'top') || '0')]);
  },

  initDrag: function(event) {
    if(!Object.isUndefined(Draggable._dragging[this.element]) &&
      Draggable._dragging[this.element]) return;
    if(Event.isLeftClick(event)) {
      // abort on form elements, fixes a Firefox issue
      var src = Event.element(event);
      if((tag_name = src.tagName.toUpperCase()) && (
        tag_name=='INPUT' ||
        tag_name=='SELECT' ||
        tag_name=='OPTION' ||
        tag_name=='BUTTON' ||
        tag_name=='TEXTAREA')) return;

      var pointer = [Event.pointerX(event), Event.pointerY(event)];
      var pos     = this.element.cumulativeOffset();
      this.offset = [0,1].map( function(i) { return (pointer[i] - pos[i]) });

      Draggables.activate(this);
      Event.stop(event);
    }
  },

  startDrag: function(event) {
    this.dragging = true;
    if(!this.delta)
      this.delta = this.currentDelta();

    if(this.options.zindex) {
      this.originalZ = parseInt(Element.getStyle(this.element,'z-index') || 0);
      this.element.style.zIndex = this.options.zindex;
    }

    if(this.options.ghosting) {
      this._clone = this.element.cloneNode(true);
      this._originallyAbsolute = (this.element.getStyle('position') == 'absolute');
      if (!this._originallyAbsolute)
        Position.absolutize(this.element);
      this.element.parentNode.insertBefore(this._clone, this.element);
    }

    if(this.options.scroll) {
      if (this.options.scroll == window) {
        var where = this._getWindowScroll(this.options.scroll);
        this.originalScrollLeft = where.left;
        this.originalScrollTop = where.top;
      } else {
        this.originalScrollLeft = this.options.scroll.scrollLeft;
        this.originalScrollTop = this.options.scroll.scrollTop;
      }
    }

    Draggables.notify('onStart', this, event);

    if(this.options.starteffect) this.options.starteffect(this.element);
  },

  updateDrag: function(event, pointer) {
    if(!this.dragging) this.startDrag(event);

    if(!this.options.quiet){
      Position.prepare();
      Droppables.show(pointer, this.element);
    }

    Draggables.notify('onDrag', this, event);

    this.draw(pointer);
    if(this.options.change) this.options.change(this);

    if(this.options.scroll) {
      this.stopScrolling();

      var p;
      if (this.options.scroll == window) {
        with(this._getWindowScroll(this.options.scroll)) { p = [ left, top, left+width, top+height ]; }
      } else {
        p = Position.page(this.options.scroll);
        p[0] += this.options.scroll.scrollLeft + Position.deltaX;
        p[1] += this.options.scroll.scrollTop + Position.deltaY;
        p.push(p[0]+this.options.scroll.offsetWidth);
        p.push(p[1]+this.options.scroll.offsetHeight);
      }
      var speed = [0,0];
      if(pointer[0] < (p[0]+this.options.scrollSensitivity)) speed[0] = pointer[0]-(p[0]+this.options.scrollSensitivity);
      if(pointer[1] < (p[1]+this.options.scrollSensitivity)) speed[1] = pointer[1]-(p[1]+this.options.scrollSensitivity);
      if(pointer[0] > (p[2]-this.options.scrollSensitivity)) speed[0] = pointer[0]-(p[2]-this.options.scrollSensitivity);
      if(pointer[1] > (p[3]-this.options.scrollSensitivity)) speed[1] = pointer[1]-(p[3]-this.options.scrollSensitivity);
      this.startScrolling(speed);
    }

    // fix AppleWebKit rendering
    if(Prototype.Browser.WebKit) window.scrollBy(0,0);

    Event.stop(event);
  },

  finishDrag: function(event, success) {
    this.dragging = false;

    if(this.options.quiet){
      Position.prepare();
      var pointer = [Event.pointerX(event), Event.pointerY(event)];
      Droppables.show(pointer, this.element);
    }

    if(this.options.ghosting) {
      if (!this._originallyAbsolute)
        Position.relativize(this.element);
      delete this._originallyAbsolute;
      Element.remove(this._clone);
      this._clone = null;
    }

    var dropped = false;
    if(success) {
      dropped = Droppables.fire(event, this.element);
      if (!dropped) dropped = false;
    }
    if(dropped && this.options.onDropped) this.options.onDropped(this.element);
    Draggables.notify('onEnd', this, event);

    var revert = this.options.revert;
    if(revert && Object.isFunction(revert)) revert = revert(this.element);

    var d = this.currentDelta();
    if(revert && this.options.reverteffect) {
      if (dropped == 0 || revert != 'failure')
        this.options.reverteffect(this.element,
          d[1]-this.delta[1], d[0]-this.delta[0]);
    } else {
      this.delta = d;
    }

    if(this.options.zindex)
      this.element.style.zIndex = this.originalZ;

    if(this.options.endeffect)
      this.options.endeffect(this.element);

    Draggables.deactivate(this);
    Droppables.reset();
  },

  keyPress: function(event) {
    if(event.keyCode!=Event.KEY_ESC) return;
    this.finishDrag(event, false);
    Event.stop(event);
  },

  endDrag: function(event) {
    if(!this.dragging) return;
    this.stopScrolling();
    this.finishDrag(event, true);
    Event.stop(event);
  },

  draw: function(point) {
    var pos = this.element.cumulativeOffset();
    if(this.options.ghosting) {
      var r   = Position.realOffset(this.element);
      pos[0] += r[0] - Position.deltaX; pos[1] += r[1] - Position.deltaY;
    }

    var d = this.currentDelta();
    pos[0] -= d[0]; pos[1] -= d[1];

    if(this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
      pos[0] -= this.options.scroll.scrollLeft-this.originalScrollLeft;
      pos[1] -= this.options.scroll.scrollTop-this.originalScrollTop;
    }

    var p = [0,1].map(function(i){
      return (point[i]-pos[i]-this.offset[i])
    }.bind(this));

    if(this.options.snap) {
      if(Object.isFunction(this.options.snap)) {
        p = this.options.snap(p[0],p[1],this);
      } else {
      if(Object.isArray(this.options.snap)) {
        p = p.map( function(v, i) {
          return (v/this.options.snap[i]).round()*this.options.snap[i] }.bind(this));
      } else {
        p = p.map( function(v) {
          return (v/this.options.snap).round()*this.options.snap }.bind(this));
      }
    }}

    var style = this.element.style;
    if((!this.options.constraint) || (this.options.constraint=='horizontal'))
      style.left = p[0] + "px";
    if((!this.options.constraint) || (this.options.constraint=='vertical'))
      style.top  = p[1] + "px";

    if(style.visibility=="hidden") style.visibility = ""; // fix gecko rendering
  },

  stopScrolling: function() {
    if(this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
      Draggables._lastScrollPointer = null;
    }
  },

  startScrolling: function(speed) {
    if(!(speed[0] || speed[1])) return;
    this.scrollSpeed = [speed[0]*this.options.scrollSpeed,speed[1]*this.options.scrollSpeed];
    this.lastScrolled = new Date();
    this.scrollInterval = setInterval(this.scroll.bind(this), 10);
  },

  scroll: function() {
    var current = new Date();
    var delta = current - this.lastScrolled;
    this.lastScrolled = current;
    if(this.options.scroll == window) {
      with (this._getWindowScroll(this.options.scroll)) {
        if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
          var d = delta / 1000;
          this.options.scroll.scrollTo( left + d*this.scrollSpeed[0], top + d*this.scrollSpeed[1] );
        }
      }
    } else {
      this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1000;
      this.options.scroll.scrollTop  += this.scrollSpeed[1] * delta / 1000;
    }

    Position.prepare();
    Droppables.show(Draggables._lastPointer, this.element);
    Draggables.notify('onDrag', this);
    if (this._isScrollChild) {
      Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
      Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1000;
      Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1000;
      if (Draggables._lastScrollPointer[0] < 0)
        Draggables._lastScrollPointer[0] = 0;
      if (Draggables._lastScrollPointer[1] < 0)
        Draggables._lastScrollPointer[1] = 0;
      this.draw(Draggables._lastScrollPointer);
    }

    if(this.options.change) this.options.change(this);
  },

  _getWindowScroll: function(w) {
    var T, L, W, H;
    with (w.document) {
      if (w.document.documentElement && documentElement.scrollTop) {
        T = documentElement.scrollTop;
        L = documentElement.scrollLeft;
      } else if (w.document.body) {
        T = body.scrollTop;
        L = body.scrollLeft;
      }
      if (w.innerWidth) {
        W = w.innerWidth;
        H = w.innerHeight;
      } else if (w.document.documentElement && documentElement.clientWidth) {
        W = documentElement.clientWidth;
        H = documentElement.clientHeight;
      } else {
        W = body.offsetWidth;
        H = body.offsetHeight;
      }
    }
    return { top: T, left: L, width: W, height: H };
  }
});

Draggable._dragging = { };

/*--------------------------------------------------------------------------*/

var SortableObserver = Class.create({
  initialize: function(element, observer) {
    this.element   = $(element);
    this.observer  = observer;
    this.lastValue = Sortable.serialize(this.element);
  },

  onStart: function() {
    this.lastValue = Sortable.serialize(this.element);
  },

  onEnd: function() {
    Sortable.unmark();
    if(this.lastValue != Sortable.serialize(this.element))
      this.observer(this.element)
  }
});

var Sortable = {
  SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,

  sortables: { },

  _findRootElement: function(element) {
    while (element.tagName.toUpperCase() != "BODY") {
      if(element.id && Sortable.sortables[element.id]) return element;
      element = element.parentNode;
    }
  },

  options: function(element) {
    element = Sortable._findRootElement($(element));
    if(!element) return;
    return Sortable.sortables[element.id];
  },

  destroy: function(element){
    element = $(element);
    var s = Sortable.sortables[element.id];

    if(s) {
      Draggables.removeObserver(s.element);
      s.droppables.each(function(d){ Droppables.remove(d) });
      s.draggables.invoke('destroy');

      delete Sortable.sortables[s.element.id];
    }
  },

  create: function(element) {
    element = $(element);
    var options = Object.extend({
      element:     element,
      tag:         'li',       // assumes li children, override with tag: 'tagname'
      dropOnEmpty: false,
      tree:        false,
      treeTag:     'ul',
      overlap:     'vertical', // one of 'vertical', 'horizontal'
      constraint:  'vertical', // one of 'vertical', 'horizontal', false
      containment: element,    // also takes array of elements (or id's); or false
      handle:      false,      // or a CSS class
      only:        false,
      delay:       0,
      hoverclass:  null,
      ghosting:    false,
      quiet:       false,
      scroll:      false,
      scrollSensitivity: 20,
      scrollSpeed: 15,
      format:      this.SERIALIZE_RULE,

      // these take arrays of elements or ids and can be
      // used for better initialization performance
      elements:    false,
      handles:     false,

      onChange:    Prototype.emptyFunction,
      onUpdate:    Prototype.emptyFunction
    }, arguments[1] || { });

    // clear any old sortable with same element
    this.destroy(element);

    // build options for the draggables
    var options_for_draggable = {
      revert:      true,
      quiet:       options.quiet,
      scroll:      options.scroll,
      scrollSpeed: options.scrollSpeed,
      scrollSensitivity: options.scrollSensitivity,
      delay:       options.delay,
      ghosting:    options.ghosting,
      constraint:  options.constraint,
      handle:      options.handle };

    if(options.starteffect)
      options_for_draggable.starteffect = options.starteffect;

    if(options.reverteffect)
      options_for_draggable.reverteffect = options.reverteffect;
    else
      if(options.ghosting) options_for_draggable.reverteffect = function(element) {
        element.style.top  = 0;
        element.style.left = 0;
      };

    if(options.endeffect)
      options_for_draggable.endeffect = options.endeffect;

    if(options.zindex)
      options_for_draggable.zindex = options.zindex;

    // build options for the droppables
    var options_for_droppable = {
      overlap:     options.overlap,
      containment: options.containment,
      tree:        options.tree,
      hoverclass:  options.hoverclass,
      onHover:     Sortable.onHover
    };

    var options_for_tree = {
      onHover:      Sortable.onEmptyHover,
      overlap:      options.overlap,
      containment:  options.containment,
      hoverclass:   options.hoverclass
    };

    // fix for gecko engine
    Element.cleanWhitespace(element);

    options.draggables = [];
    options.droppables = [];

    // drop on empty handling
    if(options.dropOnEmpty || options.tree) {
      Droppables.add(element, options_for_tree);
      options.droppables.push(element);
    }

    (options.elements || this.findElements(element, options) || []).each( function(e,i) {
      var handle = options.handles ? $(options.handles[i]) :
        (options.handle ? $(e).select('.' + options.handle)[0] : e);
      options.draggables.push(
        new Draggable(e, Object.extend(options_for_draggable, { handle: handle })));
      Droppables.add(e, options_for_droppable);
      if(options.tree) e.treeNode = element;
      options.droppables.push(e);
    });

    if(options.tree) {
      (Sortable.findTreeElements(element, options) || []).each( function(e) {
        Droppables.add(e, options_for_tree);
        e.treeNode = element;
        options.droppables.push(e);
      });
    }

    // keep reference
    this.sortables[element.identify()] = options;

    // for onupdate
    Draggables.addObserver(new SortableObserver(element, options.onUpdate));

  },

  // return all suitable-for-sortable elements in a guaranteed order
  findElements: function(element, options) {
    return Element.findChildren(
      element, options.only, options.tree ? true : false, options.tag);
  },

  findTreeElements: function(element, options) {
    return Element.findChildren(
      element, options.only, options.tree ? true : false, options.treeTag);
  },

  onHover: function(element, dropon, overlap) {
    if(Element.isParent(dropon, element)) return;

    if(overlap > .33 && overlap < .66 && Sortable.options(dropon).tree) {
      return;
    } else if(overlap>0.5) {
      Sortable.mark(dropon, 'before');
      if(dropon.previousSibling != element) {
        var oldParentNode = element.parentNode;
        element.style.visibility = "hidden"; // fix gecko rendering
        dropon.parentNode.insertBefore(element, dropon);
        if(dropon.parentNode!=oldParentNode)
          Sortable.options(oldParentNode).onChange(element);
        Sortable.options(dropon.parentNode).onChange(element);
      }
    } else {
      Sortable.mark(dropon, 'after');
      var nextElement = dropon.nextSibling || null;
      if(nextElement != element) {
        var oldParentNode = element.parentNode;
        element.style.visibility = "hidden"; // fix gecko rendering
        dropon.parentNode.insertBefore(element, nextElement);
        if(dropon.parentNode!=oldParentNode)
          Sortable.options(oldParentNode).onChange(element);
        Sortable.options(dropon.parentNode).onChange(element);
      }
    }
  },

  onEmptyHover: function(element, dropon, overlap) {
    var oldParentNode = element.parentNode;
    var droponOptions = Sortable.options(dropon);

    if(!Element.isParent(dropon, element)) {
      var index;

      var children = Sortable.findElements(dropon, {tag: droponOptions.tag, only: droponOptions.only});
      var child = null;

      if(children) {
        var offset = Element.offsetSize(dropon, droponOptions.overlap) * (1.0 - overlap);

        for (index = 0; index < children.length; index += 1) {
          if (offset - Element.offsetSize (children[index], droponOptions.overlap) >= 0) {
            offset -= Element.offsetSize (children[index], droponOptions.overlap);
          } else if (offset - (Element.offsetSize (children[index], droponOptions.overlap) / 2) >= 0) {
            child = index + 1 < children.length ? children[index + 1] : null;
            break;
          } else {
            child = children[index];
            break;
          }
        }
      }

      dropon.insertBefore(element, child);

      Sortable.options(oldParentNode).onChange(element);
      droponOptions.onChange(element);
    }
  },

  unmark: function() {
    if(Sortable._marker) Sortable._marker.hide();
  },

  mark: function(dropon, position) {
    // mark on ghosting only
    var sortable = Sortable.options(dropon.parentNode);
    if(sortable && !sortable.ghosting) return;

    if(!Sortable._marker) {
      Sortable._marker =
        ($('dropmarker') || Element.extend(document.createElement('DIV'))).
          hide().addClassName('dropmarker').setStyle({position:'absolute'});
      document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);
    }
    var offsets = dropon.cumulativeOffset();
    Sortable._marker.setStyle({left: offsets[0]+'px', top: offsets[1] + 'px'});

    if(position=='after')
      if(sortable.overlap == 'horizontal')
        Sortable._marker.setStyle({left: (offsets[0]+dropon.clientWidth) + 'px'});
      else
        Sortable._marker.setStyle({top: (offsets[1]+dropon.clientHeight) + 'px'});

    Sortable._marker.show();
  },

  _tree: function(element, options, parent) {
    var children = Sortable.findElements(element, options) || [];

    for (var i = 0; i < children.length; ++i) {
      var match = children[i].id.match(options.format);

      if (!match) continue;

      var child = {
        id: encodeURIComponent(match ? match[1] : null),
        element: element,
        parent: parent,
        children: [],
        position: parent.children.length,
        container: $(children[i]).down(options.treeTag)
      };

      /* Get the element containing the children and recurse over it */
      if (child.container)
        this._tree(child.container, options, child);

      parent.children.push (child);
    }

    return parent;
  },

  tree: function(element) {
    element = $(element);
    var sortableOptions = this.options(element);
    var options = Object.extend({
      tag: sortableOptions.tag,
      treeTag: sortableOptions.treeTag,
      only: sortableOptions.only,
      name: element.id,
      format: sortableOptions.format
    }, arguments[1] || { });

    var root = {
      id: null,
      parent: null,
      children: [],
      container: element,
      position: 0
    };

    return Sortable._tree(element, options, root);
  },

  /* Construct a [i] index for a particular node */
  _constructIndex: function(node) {
    var index = '';
    do {
      if (node.id) index = '[' + node.position + ']' + index;
    } while ((node = node.parent) != null);
    return index;
  },

  sequence: function(element) {
    element = $(element);
    var options = Object.extend(this.options(element), arguments[1] || { });

    return $(this.findElements(element, options) || []).map( function(item) {
      return item.id.match(options.format) ? item.id.match(options.format)[1] : '';
    });
  },

  setSequence: function(element, new_sequence) {
    element = $(element);
    var options = Object.extend(this.options(element), arguments[2] || { });

    var nodeMap = { };
    this.findElements(element, options).each( function(n) {
        if (n.id.match(options.format))
            nodeMap[n.id.match(options.format)[1]] = [n, n.parentNode];
        n.parentNode.removeChild(n);
    });

    new_sequence.each(function(ident) {
      var n = nodeMap[ident];
      if (n) {
        n[1].appendChild(n[0]);
        delete nodeMap[ident];
      }
    });
  },

  serialize: function(element) {
    element = $(element);
    var options = Object.extend(Sortable.options(element), arguments[1] || { });
    var name = encodeURIComponent(
      (arguments[1] && arguments[1].name) ? arguments[1].name : element.id);

    if (options.tree) {
      return Sortable.tree(element, arguments[1]).children.map( function (item) {
        return [name + Sortable._constructIndex(item) + "[id]=" +
                encodeURIComponent(item.id)].concat(item.children.map(arguments.callee));
      }).flatten().join('&');
    } else {
      return Sortable.sequence(element, arguments[1]).map( function(item) {
        return name + "[]=" + encodeURIComponent(item);
      }).join('&');
    }
  }
};

// Returns true if child is contained within element
Element.isParent = function(child, element) {
  if (!child.parentNode || child == element) return false;
  if (child.parentNode == element) return true;
  return Element.isParent(child.parentNode, element);
};

Element.findChildren = function(element, only, recursive, tagName) {
  if(!element.hasChildNodes()) return null;
  tagName = tagName.toUpperCase();
  if(only) only = [only].flatten();
  var elements = [];
  $A(element.childNodes).each( function(e) {
    if(e.tagName && e.tagName.toUpperCase()==tagName &&
      (!only || (Element.classNames(e).detect(function(v) { return only.include(v) }))))
        elements.push(e);
    if(recursive) {
      var grandchildren = Element.findChildren(e, only, recursive, tagName);
      if(grandchildren) elements.push(grandchildren);
    }
  });

  return (elements.length>0 ? elements.flatten() : []);
};

Element.offsetSize = function (element, type) {
  return element['offset' + ((type=='vertical' || type=='height') ? 'Height' : 'Width')];
};// script.aculo.us controls.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//           (c) 2005-2009 Ivan Krstic (http://blogs.law.harvard.edu/ivan)
//           (c) 2005-2009 Jon Tirsen (http://www.tirsen.com)
// Contributors:
//  Richard Livsey
//  Rahul Bhargava
//  Rob Wills
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

// Autocompleter.Base handles all the autocompletion functionality
// that's independent of the data source for autocompletion. This
// includes drawing the autocompletion menu, observing keyboard
// and mouse events, and similar.
//
// Specific autocompleters need to provide, at the very least,
// a getUpdatedChoices function that will be invoked every time
// the text inside the monitored textbox changes. This method
// should get the text for which to provide autocompletion by
// invoking this.getToken(), NOT by directly accessing
// this.element.value. This is to allow incremental tokenized
// autocompletion. Specific auto-completion logic (AJAX, etc)
// belongs in getUpdatedChoices.
//
// Tokenized incremental autocompletion is enabled automatically
// when an autocompleter is instantiated with the 'tokens' option
// in the options parameter, e.g.:
// new Ajax.Autocompleter('id','upd', '/url/', { tokens: ',' });
// will incrementally autocomplete with a comma as the token.
// Additionally, ',' in the above example can be replaced with
// a token array, e.g. { tokens: [',', '\n'] } which
// enables autocompletion on multiple tokens. This is most
// useful when one of the tokens is \n (a newline), as it
// allows smart autocompletion after linebreaks.

if(typeof Effect == 'undefined')
  throw("controls.js requires including script.aculo.us' effects.js library");

var Autocompleter = { };
Autocompleter.Base = Class.create({
  baseInitialize: function(element, update, options) {
    element          = $(element);
    this.element     = element;
    this.update      = $(update);
    this.hasFocus    = false;
    this.changed     = false;
    this.active      = false;
    this.index       = 0;
    this.entryCount  = 0;
    this.oldElementValue = this.element.value;

    if(this.setOptions)
      this.setOptions(options);
    else
      this.options = options || { };

    this.options.paramName    = this.options.paramName || this.element.name;
    this.options.tokens       = this.options.tokens || [];
    this.options.frequency    = this.options.frequency || 0.4;
    this.options.minChars     = this.options.minChars || 1;
    this.options.onShow       = this.options.onShow ||
      function(element, update){
        if(!update.style.position || update.style.position=='absolute') {
          update.style.position = 'absolute';
          Position.clone(element, update, {
            setHeight: false,
            offsetTop: element.offsetHeight
          });
        }
        Effect.Appear(update,{duration:0.15});
      };
    this.options.onHide = this.options.onHide ||
      function(element, update){ new Effect.Fade(update,{duration:0.15}) };

    if(typeof(this.options.tokens) == 'string')
      this.options.tokens = new Array(this.options.tokens);
    // Force carriage returns as token delimiters anyway
    if (!this.options.tokens.include('\n'))
      this.options.tokens.push('\n');

    this.observer = null;

    this.element.setAttribute('autocomplete','off');

    Element.hide(this.update);

    Event.observe(this.element, 'blur', this.onBlur.bindAsEventListener(this));
    Event.observe(this.element, 'keydown', this.onKeyPress.bindAsEventListener(this));
  },

  show: function() {
    if(Element.getStyle(this.update, 'display')=='none') this.options.onShow(this.element, this.update);
    if(!this.iefix &&
      (Prototype.Browser.IE) &&
      (Element.getStyle(this.update, 'position')=='absolute')) {
      new Insertion.After(this.update,
       '<iframe id="' + this.update.id + '_iefix" '+
       'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' +
       'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
      this.iefix = $(this.update.id+'_iefix');
    }
    if(this.iefix) setTimeout(this.fixIEOverlapping.bind(this), 50);
  },

  fixIEOverlapping: function() {
    Position.clone(this.update, this.iefix, {setTop:(!this.update.style.height)});
    this.iefix.style.zIndex = 1;
    this.update.style.zIndex = 2;
    Element.show(this.iefix);
  },

  hide: function() {
    this.stopIndicator();
    if(Element.getStyle(this.update, 'display')!='none') this.options.onHide(this.element, this.update);
    if(this.iefix) Element.hide(this.iefix);
  },

  startIndicator: function() {
    if(this.options.indicator) Element.show(this.options.indicator);
  },

  stopIndicator: function() {
    if(this.options.indicator) Element.hide(this.options.indicator);
  },

  onKeyPress: function(event) {
    if(this.active)
      switch(event.keyCode) {
       case Event.KEY_TAB:
       case Event.KEY_RETURN:
         this.selectEntry();
         Event.stop(event);
       case Event.KEY_ESC:
         this.hide();
         this.active = false;
         Event.stop(event);
         return;
       case Event.KEY_LEFT:
       case Event.KEY_RIGHT:
         return;
       case Event.KEY_UP:
         this.markPrevious();
         this.render();
         Event.stop(event);
         return;
       case Event.KEY_DOWN:
         this.markNext();
         this.render();
         Event.stop(event);
         return;
      }
     else
       if(event.keyCode==Event.KEY_TAB || event.keyCode==Event.KEY_RETURN ||
         (Prototype.Browser.WebKit > 0 && event.keyCode == 0)) return;

    this.changed = true;
    this.hasFocus = true;

    if(this.observer) clearTimeout(this.observer);
      this.observer =
        setTimeout(this.onObserverEvent.bind(this), this.options.frequency*1000);
  },

  activate: function() {
    this.changed = false;
    this.hasFocus = true;
    this.getUpdatedChoices();
  },

  onHover: function(event) {
    var element = Event.findElement(event, 'LI');
    if(this.index != element.autocompleteIndex)
    {
        this.index = element.autocompleteIndex;
        this.render();
    }
    Event.stop(event);
  },

  onClick: function(event) {
    var element = Event.findElement(event, 'LI');
    this.index = element.autocompleteIndex;
    this.selectEntry();
    this.hide();
  },

  onBlur: function(event) {
    // needed to make click events working
    setTimeout(this.hide.bind(this), 250);
    this.hasFocus = false;
    this.active = false;
  },

  render: function() {
    if(this.entryCount > 0) {
      for (var i = 0; i < this.entryCount; i++)
        this.index==i ?
          Element.addClassName(this.getEntry(i),"selected") :
          Element.removeClassName(this.getEntry(i),"selected");
      if(this.hasFocus) {
        this.show();
        this.active = true;
      }
    } else {
      this.active = false;
      this.hide();
    }
  },

  markPrevious: function() {
    if(this.index > 0) this.index--;
      else this.index = this.entryCount-1;
    this.getEntry(this.index).scrollIntoView(true);
  },

  markNext: function() {
    if(this.index < this.entryCount-1) this.index++;
      else this.index = 0;
    this.getEntry(this.index).scrollIntoView(false);
  },

  getEntry: function(index) {
    return this.update.firstChild.childNodes[index];
  },

  getCurrentEntry: function() {
    return this.getEntry(this.index);
  },

  selectEntry: function() {
    this.active = false;
    this.updateElement(this.getCurrentEntry());
  },

  updateElement: function(selectedElement) {
    if (this.options.updateElement) {
      this.options.updateElement(selectedElement);
      return;
    }
    var value = '';
    if (this.options.select) {
      var nodes = $(selectedElement).select('.' + this.options.select) || [];
      if(nodes.length>0) value = Element.collectTextNodes(nodes[0], this.options.select);
    } else
      value = Element.collectTextNodesIgnoreClass(selectedElement, 'informal');

    var bounds = this.getTokenBounds();
    if (bounds[0] != -1) {
      var newValue = this.element.value.substr(0, bounds[0]);
      var whitespace = this.element.value.substr(bounds[0]).match(/^\s+/);
      if (whitespace)
        newValue += whitespace[0];
      this.element.value = newValue + value + this.element.value.substr(bounds[1]);
    } else {
      this.element.value = value;
    }
    this.oldElementValue = this.element.value;
    this.element.focus();

    if (this.options.afterUpdateElement)
      this.options.afterUpdateElement(this.element, selectedElement);
  },

  updateChoices: function(choices) {
    if(!this.changed && this.hasFocus) {
      this.update.innerHTML = choices;
      Element.cleanWhitespace(this.update);
      Element.cleanWhitespace(this.update.down());

      if(this.update.firstChild && this.update.down().childNodes) {
        this.entryCount =
          this.update.down().childNodes.length;
        for (var i = 0; i < this.entryCount; i++) {
          var entry = this.getEntry(i);
          entry.autocompleteIndex = i;
          this.addObservers(entry);
        }
      } else {
        this.entryCount = 0;
      }

      this.stopIndicator();
      this.index = 0;

      if(this.entryCount==1 && this.options.autoSelect) {
        this.selectEntry();
        this.hide();
      } else {
        this.render();
      }
    }
  },

  addObservers: function(element) {
    Event.observe(element, "mouseover", this.onHover.bindAsEventListener(this));
    Event.observe(element, "click", this.onClick.bindAsEventListener(this));
  },

  onObserverEvent: function() {
    this.changed = false;
    this.tokenBounds = null;
    if(this.getToken().length>=this.options.minChars) {
      this.getUpdatedChoices();
    } else {
      this.active = false;
      this.hide();
    }
    this.oldElementValue = this.element.value;
  },

  getToken: function() {
    var bounds = this.getTokenBounds();
    return this.element.value.substring(bounds[0], bounds[1]).strip();
  },

  getTokenBounds: function() {
    if (null != this.tokenBounds) return this.tokenBounds;
    var value = this.element.value;
    if (value.strip().empty()) return [-1, 0];
    var diff = arguments.callee.getFirstDifferencePos(value, this.oldElementValue);
    var offset = (diff == this.oldElementValue.length ? 1 : 0);
    var prevTokenPos = -1, nextTokenPos = value.length;
    var tp;
    for (var index = 0, l = this.options.tokens.length; index < l; ++index) {
      tp = value.lastIndexOf(this.options.tokens[index], diff + offset - 1);
      if (tp > prevTokenPos) prevTokenPos = tp;
      tp = value.indexOf(this.options.tokens[index], diff + offset);
      if (-1 != tp && tp < nextTokenPos) nextTokenPos = tp;
    }
    return (this.tokenBounds = [prevTokenPos + 1, nextTokenPos]);
  }
});

Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function(newS, oldS) {
  var boundary = Math.min(newS.length, oldS.length);
  for (var index = 0; index < boundary; ++index)
    if (newS[index] != oldS[index])
      return index;
  return boundary;
};

Ajax.Autocompleter = Class.create(Autocompleter.Base, {
  initialize: function(element, update, url, options) {
    this.baseInitialize(element, update, options);
    this.options.asynchronous  = true;
    this.options.onComplete    = this.onComplete.bind(this);
    this.options.defaultParams = this.options.parameters || null;
    this.url                   = url;
  },

  getUpdatedChoices: function() {
    this.startIndicator();

    var entry = encodeURIComponent(this.options.paramName) + '=' +
      encodeURIComponent(this.getToken());

    this.options.parameters = this.options.callback ?
      this.options.callback(this.element, entry) : entry;

    if(this.options.defaultParams)
      this.options.parameters += '&' + this.options.defaultParams;

    new Ajax.Request(this.url, this.options);
  },

  onComplete: function(request) {
    this.updateChoices(request.responseText);
  }
});

// The local array autocompleter. Used when you'd prefer to
// inject an array of autocompletion options into the page, rather
// than sending out Ajax queries, which can be quite slow sometimes.
//
// The constructor takes four parameters. The first two are, as usual,
// the id of the monitored textbox, and id of the autocompletion menu.
// The third is the array you want to autocomplete from, and the fourth
// is the options block.
//
// Extra local autocompletion options:
// - choices - How many autocompletion choices to offer
//
// - partialSearch - If false, the autocompleter will match entered
//                    text only at the beginning of strings in the
//                    autocomplete array. Defaults to true, which will
//                    match text at the beginning of any *word* in the
//                    strings in the autocomplete array. If you want to
//                    search anywhere in the string, additionally set
//                    the option fullSearch to true (default: off).
//
// - fullSsearch - Search anywhere in autocomplete array strings.
//
// - partialChars - How many characters to enter before triggering
//                   a partial match (unlike minChars, which defines
//                   how many characters are required to do any match
//                   at all). Defaults to 2.
//
// - ignoreCase - Whether to ignore case when autocompleting.
//                 Defaults to true.
//
// It's possible to pass in a custom function as the 'selector'
// option, if you prefer to write your own autocompletion logic.
// In that case, the other options above will not apply unless
// you support them.

Autocompleter.Local = Class.create(Autocompleter.Base, {
  initialize: function(element, update, array, options) {
    this.baseInitialize(element, update, options);
    this.options.array = array;
  },

  getUpdatedChoices: function() {
    this.updateChoices(this.options.selector(this));
  },

  setOptions: function(options) {
    this.options = Object.extend({
      choices: 10,
      partialSearch: true,
      partialChars: 2,
      ignoreCase: true,
      fullSearch: false,
      selector: function(instance) {
        var ret       = []; // Beginning matches
        var partial   = []; // Inside matches
        var entry     = instance.getToken();
        var count     = 0;

        for (var i = 0; i < instance.options.array.length &&
          ret.length < instance.options.choices ; i++) {

          var elem = instance.options.array[i];
          var foundPos = instance.options.ignoreCase ?
            elem.toLowerCase().indexOf(entry.toLowerCase()) :
            elem.indexOf(entry);

          while (foundPos != -1) {
            if (foundPos == 0 && elem.length != entry.length) {
              ret.push("<li><strong>" + elem.substr(0, entry.length) + "</strong>" +
                elem.substr(entry.length) + "</li>");
              break;
            } else if (entry.length >= instance.options.partialChars &&
              instance.options.partialSearch && foundPos != -1) {
              if (instance.options.fullSearch || /\s/.test(elem.substr(foundPos-1,1))) {
                partial.push("<li>" + elem.substr(0, foundPos) + "<strong>" +
                  elem.substr(foundPos, entry.length) + "</strong>" + elem.substr(
                  foundPos + entry.length) + "</li>");
                break;
              }
            }

            foundPos = instance.options.ignoreCase ?
              elem.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) :
              elem.indexOf(entry, foundPos + 1);

          }
        }
        if (partial.length)
          ret = ret.concat(partial.slice(0, instance.options.choices - ret.length));
        return "<ul>" + ret.join('') + "</ul>";
      }
    }, options || { });
  }
});

// AJAX in-place editor and collection editor
// Full rewrite by Christophe Porteneuve <tdd@tddsworld.com> (April 2007).

// Use this if you notice weird scrolling problems on some browsers,
// the DOM might be a bit confused when this gets called so do this
// waits 1 ms (with setTimeout) until it does the activation
Field.scrollFreeActivate = function(field) {
  setTimeout(function() {
    Field.activate(field);
  }, 1);
};

Ajax.InPlaceEditor = Class.create({
  initialize: function(element, url, options) {
    this.url = url;
    this.element = element = $(element);
    this.prepareOptions();
    this._controls = { };
    arguments.callee.dealWithDeprecatedOptions(options); // DEPRECATION LAYER!!!
    Object.extend(this.options, options || { });
    if (!this.options.formId && this.element.id) {
      this.options.formId = this.element.id + '-inplaceeditor';
      if ($(this.options.formId))
        this.options.formId = '';
    }
    if (this.options.externalControl)
      this.options.externalControl = $(this.options.externalControl);
    if (!this.options.externalControl)
      this.options.externalControlOnly = false;
    this._originalBackground = this.element.getStyle('background-color') || 'transparent';
    this.element.title = this.options.clickToEditText;
    this._boundCancelHandler = this.handleFormCancellation.bind(this);
    this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this);
    this._boundFailureHandler = this.handleAJAXFailure.bind(this);
    this._boundSubmitHandler = this.handleFormSubmission.bind(this);
    this._boundWrapperHandler = this.wrapUp.bind(this);
    this.registerListeners();
  },
  checkForEscapeOrReturn: function(e) {
    if (!this._editing || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (Event.KEY_ESC == e.keyCode)
      this.handleFormCancellation(e);
    else if (Event.KEY_RETURN == e.keyCode)
      this.handleFormSubmission(e);
  },
  createControl: function(mode, handler, extraClasses) {
    var control = this.options[mode + 'Control'];
    var text = this.options[mode + 'Text'];
    if ('button' == control) {
      var btn = document.createElement('input');
      btn.type = 'submit';
      btn.value = text;
      btn.className = 'editor_' + mode + '_button';
      if ('cancel' == mode)
        btn.onclick = this._boundCancelHandler;
      this._form.appendChild(btn);
      this._controls[mode] = btn;
    } else if ('link' == control) {
      var link = document.createElement('a');
      link.href = '#';
      link.appendChild(document.createTextNode(text));
      link.onclick = 'cancel' == mode ? this._boundCancelHandler : this._boundSubmitHandler;
      link.className = 'editor_' + mode + '_link';
      if (extraClasses)
        link.className += ' ' + extraClasses;
      this._form.appendChild(link);
      this._controls[mode] = link;
    }
  },
  createEditField: function() {
    var text = (this.options.loadTextURL ? this.options.loadingText : this.getText());
    var fld;
    if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
      fld = document.createElement('input');
      fld.type = 'text';
      var size = this.options.size || this.options.cols || 0;
      if (0 < size) fld.size = size;
    } else {
      fld = document.createElement('textarea');
      fld.rows = (1 >= this.options.rows ? this.options.autoRows : this.options.rows);
      fld.cols = this.options.cols || 40;
    }
    fld.name = this.options.paramName;
    fld.value = text; // No HTML breaks conversion anymore
    fld.className = 'editor_field';
    if (this.options.submitOnBlur)
      fld.onblur = this._boundSubmitHandler;
    this._controls.editor = fld;
    if (this.options.loadTextURL)
      this.loadExternalText();
    this._form.appendChild(this._controls.editor);
  },
  createForm: function() {
    var ipe = this;
    function addText(mode, condition) {
      var text = ipe.options['text' + mode + 'Controls'];
      if (!text || condition === false) return;
      ipe._form.appendChild(document.createTextNode(text));
    };
    this._form = $(document.createElement('form'));
    this._form.id = this.options.formId;
    this._form.addClassName(this.options.formClassName);
    this._form.onsubmit = this._boundSubmitHandler;
    this.createEditField();
    if ('textarea' == this._controls.editor.tagName.toLowerCase())
      this._form.appendChild(document.createElement('br'));
    if (this.options.onFormCustomization)
      this.options.onFormCustomization(this, this._form);
    addText('Before', this.options.okControl || this.options.cancelControl);
    this.createControl('ok', this._boundSubmitHandler);
    addText('Between', this.options.okControl && this.options.cancelControl);
    this.createControl('cancel', this._boundCancelHandler, 'editor_cancel');
    addText('After', this.options.okControl || this.options.cancelControl);
  },
  destroy: function() {
    if (this._oldInnerHTML)
      this.element.innerHTML = this._oldInnerHTML;
    this.leaveEditMode();
    this.unregisterListeners();
  },
  enterEditMode: function(e) {
    if (this._saving || this._editing) return;
    this._editing = true;
    this.triggerCallback('onEnterEditMode');
    if (this.options.externalControl)
      this.options.externalControl.hide();
    this.element.hide();
    this.createForm();
    this.element.parentNode.insertBefore(this._form, this.element);
    if (!this.options.loadTextURL)
      this.postProcessEditField();
    if (e) Event.stop(e);
  },
  enterHover: function(e) {
    if (this.options.hoverClassName)
      this.element.addClassName(this.options.hoverClassName);
    if (this._saving) return;
    this.triggerCallback('onEnterHover');
  },
  getText: function() {
    return this.element.innerHTML.unescapeHTML();
  },
  handleAJAXFailure: function(transport) {
    this.triggerCallback('onFailure', transport);
    if (this._oldInnerHTML) {
      this.element.innerHTML = this._oldInnerHTML;
      this._oldInnerHTML = null;
    }
  },
  handleFormCancellation: function(e) {
    this.wrapUp();
    if (e) Event.stop(e);
  },
  handleFormSubmission: function(e) {
    var form = this._form;
    var value = $F(this._controls.editor);
    this.prepareSubmission();
    var params = this.options.callback(form, value) || '';
    if (Object.isString(params))
      params = params.toQueryParams();
    params.editorId = this.element.id;
    if (this.options.htmlResponse) {
      var options = Object.extend({ evalScripts: true }, this.options.ajaxOptions);
      Object.extend(options, {
        parameters: params,
        onComplete: this._boundWrapperHandler,
        onFailure: this._boundFailureHandler
      });
      new Ajax.Updater({ success: this.element }, this.url, options);
    } else {
      var options = Object.extend({ method: 'get' }, this.options.ajaxOptions);
      Object.extend(options, {
        parameters: params,
        onComplete: this._boundWrapperHandler,
        onFailure: this._boundFailureHandler
      });
      new Ajax.Request(this.url, options);
    }
    if (e) Event.stop(e);
  },
  leaveEditMode: function() {
    this.element.removeClassName(this.options.savingClassName);
    this.removeForm();
    this.leaveHover();
    this.element.style.backgroundColor = this._originalBackground;
    this.element.show();
    if (this.options.externalControl)
      this.options.externalControl.show();
    this._saving = false;
    this._editing = false;
    this._oldInnerHTML = null;
    this.triggerCallback('onLeaveEditMode');
  },
  leaveHover: function(e) {
    if (this.options.hoverClassName)
      this.element.removeClassName(this.options.hoverClassName);
    if (this._saving) return;
    this.triggerCallback('onLeaveHover');
  },
  loadExternalText: function() {
    this._form.addClassName(this.options.loadingClassName);
    this._controls.editor.disabled = true;
    var options = Object.extend({ method: 'get' }, this.options.ajaxOptions);
    Object.extend(options, {
      parameters: 'editorId=' + encodeURIComponent(this.element.id),
      onComplete: Prototype.emptyFunction,
      onSuccess: function(transport) {
        this._form.removeClassName(this.options.loadingClassName);
        var text = transport.responseText;
        if (this.options.stripLoadedTextTags)
          text = text.stripTags();
        this._controls.editor.value = text;
        this._controls.editor.disabled = false;
        this.postProcessEditField();
      }.bind(this),
      onFailure: this._boundFailureHandler
    });
    new Ajax.Request(this.options.loadTextURL, options);
  },
  postProcessEditField: function() {
    var fpc = this.options.fieldPostCreation;
    if (fpc)
      $(this._controls.editor)['focus' == fpc ? 'focus' : 'activate']();
  },
  prepareOptions: function() {
    this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions);
    Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks);
    [this._extraDefaultOptions].flatten().compact().each(function(defs) {
      Object.extend(this.options, defs);
    }.bind(this));
  },
  prepareSubmission: function() {
    this._saving = true;
    this.removeForm();
    this.leaveHover();
    this.showSaving();
  },
  registerListeners: function() {
    this._listeners = { };
    var listener;
    $H(Ajax.InPlaceEditor.Listeners).each(function(pair) {
      listener = this[pair.value].bind(this);
      this._listeners[pair.key] = listener;
      if (!this.options.externalControlOnly)
        this.element.observe(pair.key, listener);
      if (this.options.externalControl)
        this.options.externalControl.observe(pair.key, listener);
    }.bind(this));
  },
  removeForm: function() {
    if (!this._form) return;
    this._form.remove();
    this._form = null;
    this._controls = { };
  },
  showSaving: function() {
    this._oldInnerHTML = this.element.innerHTML;
    this.element.innerHTML = this.options.savingText;
    this.element.addClassName(this.options.savingClassName);
    this.element.style.backgroundColor = this._originalBackground;
    this.element.show();
  },
  triggerCallback: function(cbName, arg) {
    if ('function' == typeof this.options[cbName]) {
      this.options[cbName](this, arg);
    }
  },
  unregisterListeners: function() {
    $H(this._listeners).each(function(pair) {
      if (!this.options.externalControlOnly)
        this.element.stopObserving(pair.key, pair.value);
      if (this.options.externalControl)
        this.options.externalControl.stopObserving(pair.key, pair.value);
    }.bind(this));
  },
  wrapUp: function(transport) {
    this.leaveEditMode();
    // Can't use triggerCallback due to backward compatibility: requires
    // binding + direct element
    this._boundComplete(transport, this.element);
  }
});

Object.extend(Ajax.InPlaceEditor.prototype, {
  dispose: Ajax.InPlaceEditor.prototype.destroy
});

Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
  initialize: function($super, element, url, options) {
    this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions;
    $super(element, url, options);
  },

  createEditField: function() {
    var list = document.createElement('select');
    list.name = this.options.paramName;
    list.size = 1;
    this._controls.editor = list;
    this._collection = this.options.collection || [];
    if (this.options.loadCollectionURL)
      this.loadCollection();
    else
      this.checkForExternalText();
    this._form.appendChild(this._controls.editor);
  },

  loadCollection: function() {
    this._form.addClassName(this.options.loadingClassName);
    this.showLoadingText(this.options.loadingCollectionText);
    var options = Object.extend({ method: 'get' }, this.options.ajaxOptions);
    Object.extend(options, {
      parameters: 'editorId=' + encodeURIComponent(this.element.id),
      onComplete: Prototype.emptyFunction,
      onSuccess: function(transport) {
        var js = transport.responseText.strip();
        if (!/^\[.*\]$/.test(js)) // TODO: improve sanity check
          throw('Server returned an invalid collection representation.');
        this._collection = eval(js);
        this.checkForExternalText();
      }.bind(this),
      onFailure: this.onFailure
    });
    new Ajax.Request(this.options.loadCollectionURL, options);
  },

  showLoadingText: function(text) {
    this._controls.editor.disabled = true;
    var tempOption = this._controls.editor.firstChild;
    if (!tempOption) {
      tempOption = document.createElement('option');
      tempOption.value = '';
      this._controls.editor.appendChild(tempOption);
      tempOption.selected = true;
    }
    tempOption.update((text || '').stripScripts().stripTags());
  },

  checkForExternalText: function() {
    this._text = this.getText();
    if (this.options.loadTextURL)
      this.loadExternalText();
    else
      this.buildOptionList();
  },

  loadExternalText: function() {
    this.showLoadingText(this.options.loadingText);
    var options = Object.extend({ method: 'get' }, this.options.ajaxOptions);
    Object.extend(options, {
      parameters: 'editorId=' + encodeURIComponent(this.element.id),
      onComplete: Prototype.emptyFunction,
      onSuccess: function(transport) {
        this._text = transport.responseText.strip();
        this.buildOptionList();
      }.bind(this),
      onFailure: this.onFailure
    });
    new Ajax.Request(this.options.loadTextURL, options);
  },

  buildOptionList: function() {
    this._form.removeClassName(this.options.loadingClassName);
    this._collection = this._collection.map(function(entry) {
      return 2 === entry.length ? entry : [entry, entry].flatten();
    });
    var marker = ('value' in this.options) ? this.options.value : this._text;
    var textFound = this._collection.any(function(entry) {
      return entry[0] == marker;
    }.bind(this));
    this._controls.editor.update('');
    var option;
    this._collection.each(function(entry, index) {
      option = document.createElement('option');
      option.value = entry[0];
      option.selected = textFound ? entry[0] == marker : 0 == index;
      option.appendChild(document.createTextNode(entry[1]));
      this._controls.editor.appendChild(option);
    }.bind(this));
    this._controls.editor.disabled = false;
    Field.scrollFreeActivate(this._controls.editor);
  }
});

//**** DEPRECATION LAYER FOR InPlace[Collection]Editor! ****
//**** This only  exists for a while,  in order to  let ****
//**** users adapt to  the new API.  Read up on the new ****
//**** API and convert your code to it ASAP!            ****

Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function(options) {
  if (!options) return;
  function fallback(name, expr) {
    if (name in options || expr === undefined) return;
    options[name] = expr;
  };
  fallback('cancelControl', (options.cancelLink ? 'link' : (options.cancelButton ? 'button' :
    options.cancelLink == options.cancelButton == false ? false : undefined)));
  fallback('okControl', (options.okLink ? 'link' : (options.okButton ? 'button' :
    options.okLink == options.okButton == false ? false : undefined)));
  fallback('highlightColor', options.highlightcolor);
  fallback('highlightEndColor', options.highlightendcolor);
};

Object.extend(Ajax.InPlaceEditor, {
  DefaultOptions: {
    ajaxOptions: { },
    autoRows: 3,                                // Use when multi-line w/ rows == 1
    cancelControl: 'link',                      // 'link'|'button'|false
    cancelText: 'cancel',
    clickToEditText: 'Click to edit',
    externalControl: null,                      // id|elt
    externalControlOnly: false,
    fieldPostCreation: 'activate',              // 'activate'|'focus'|false
    formClassName: 'inplaceeditor-form',
    formId: null,                               // id|elt
    highlightColor: '#ffff99',
    highlightEndColor: '#ffffff',
    hoverClassName: '',
    htmlResponse: true,
    loadingClassName: 'inplaceeditor-loading',
    loadingText: 'Loading...',
    okControl: 'button',                        // 'link'|'button'|false
    okText: 'ok',
    paramName: 'value',
    rows: 1,                                    // If 1 and multi-line, uses autoRows
    savingClassName: 'inplaceeditor-saving',
    savingText: 'Saving...',
    size: 0,
    stripLoadedTextTags: false,
    submitOnBlur: false,
    textAfterControls: '',
    textBeforeControls: '',
    textBetweenControls: ''
  },
  DefaultCallbacks: {
    callback: function(form) {
      return Form.serialize(form);
    },
    onComplete: function(transport, element) {
      // For backward compatibility, this one is bound to the IPE, and passes
      // the element directly.  It was too often customized, so we don't break it.
      new Effect.Highlight(element, {
        startcolor: this.options.highlightColor, keepBackgroundImage: true });
    },
    onEnterEditMode: null,
    onEnterHover: function(ipe) {
      ipe.element.style.backgroundColor = ipe.options.highlightColor;
      if (ipe._effect)
        ipe._effect.cancel();
    },
    onFailure: function(transport, ipe) {
      alert('Error communication with the server: ' + transport.responseText.stripTags());
    },
    onFormCustomization: null, // Takes the IPE and its generated form, after editor, before controls.
    onLeaveEditMode: null,
    onLeaveHover: function(ipe) {
      ipe._effect = new Effect.Highlight(ipe.element, {
        startcolor: ipe.options.highlightColor, endcolor: ipe.options.highlightEndColor,
        restorecolor: ipe._originalBackground, keepBackgroundImage: true
      });
    }
  },
  Listeners: {
    click: 'enterEditMode',
    keydown: 'checkForEscapeOrReturn',
    mouseover: 'enterHover',
    mouseout: 'leaveHover'
  }
});

Ajax.InPlaceCollectionEditor.DefaultOptions = {
  loadingCollectionText: 'Loading options...'
};

// Delayed observer, like Form.Element.Observer,
// but waits for delay after last key input
// Ideal for live-search fields

Form.Element.DelayedObserver = Class.create({
  initialize: function(element, delay, callback) {
    this.delay     = delay || 0.5;
    this.element   = $(element);
    this.callback  = callback;
    this.timer     = null;
    this.lastValue = $F(this.element);
    Event.observe(this.element,'keyup',this.delayedListener.bindAsEventListener(this));
  },
  delayedListener: function(event) {
    if(this.lastValue == $F(this.element)) return;
    if(this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
    this.lastValue = $F(this.element);
  },
  onTimerEvent: function() {
    this.timer = null;
    this.callback(this.element, $F(this.element));
  }
});// script.aculo.us slider.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Marty Haught, Thomas Fuchs
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

if (!Control) var Control = { };

// options:
//  axis: 'vertical', or 'horizontal' (default)
//
// callbacks:
//  onChange(value)
//  onSlide(value)
Control.Slider = Class.create({
  initialize: function(handle, track, options) {
    var slider = this;

    if (Object.isArray(handle)) {
      this.handles = handle.collect( function(e) { return $(e) });
    } else {
      this.handles = [$(handle)];
    }

    this.track   = $(track);
    this.options = options || { };

    this.axis      = this.options.axis || 'horizontal';
    this.increment = this.options.increment || 1;
    this.step      = parseInt(this.options.step || '1');
    this.range     = this.options.range || $R(0,1);

    this.value     = 0; // assure backwards compat
    this.values    = this.handles.map( function() { return 0 });
    this.spans     = this.options.spans ? this.options.spans.map(function(s){ return $(s) }) : false;
    this.options.startSpan = $(this.options.startSpan || null);
    this.options.endSpan   = $(this.options.endSpan || null);

    this.restricted = this.options.restricted || false;

    this.maximum   = this.options.maximum || this.range.end;
    this.minimum   = this.options.minimum || this.range.start;

    // Will be used to align the handle onto the track, if necessary
    this.alignX = parseInt(this.options.alignX || '0');
    this.alignY = parseInt(this.options.alignY || '0');

    this.trackLength = this.maximumOffset() - this.minimumOffset();

    this.handleLength = this.isVertical() ?
      (this.handles[0].offsetHeight != 0 ?
        this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/,"")) :
      (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth :
        this.handles[0].style.width.replace(/px$/,""));

    this.active   = false;
    this.dragging = false;
    this.disabled = false;

    if (this.options.disabled) this.setDisabled();

    // Allowed values array
    this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
    if (this.allowedValues) {
      this.minimum = this.allowedValues.min();
      this.maximum = this.allowedValues.max();
    }

    this.eventMouseDown = this.startDrag.bindAsEventListener(this);
    this.eventMouseUp   = this.endDrag.bindAsEventListener(this);
    this.eventMouseMove = this.update.bindAsEventListener(this);

    // Initialize handles in reverse (make sure first handle is active)
    this.handles.each( function(h,i) {
      i = slider.handles.length-1-i;
      slider.setValue(parseFloat(
        (Object.isArray(slider.options.sliderValue) ?
          slider.options.sliderValue[i] : slider.options.sliderValue) ||
         slider.range.start), i);
      h.makePositioned().observe("mousedown", slider.eventMouseDown);
    });

    this.track.observe("mousedown", this.eventMouseDown);
    document.observe("mouseup", this.eventMouseUp);
    document.observe("mousemove", this.eventMouseMove);

    this.initialized = true;
  },
  dispose: function() {
    var slider = this;
    Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
    Event.stopObserving(document, "mouseup", this.eventMouseUp);
    Event.stopObserving(document, "mousemove", this.eventMouseMove);
    this.handles.each( function(h) {
      Event.stopObserving(h, "mousedown", slider.eventMouseDown);
    });
  },
  setDisabled: function(){
    this.disabled = true;
  },
  setEnabled: function(){
    this.disabled = false;
  },
  getNearestValue: function(value){
    if (this.allowedValues){
      if (value >= this.allowedValues.max()) return(this.allowedValues.max());
      if (value <= this.allowedValues.min()) return(this.allowedValues.min());

      var offset = Math.abs(this.allowedValues[0] - value);
      var newValue = this.allowedValues[0];
      this.allowedValues.each( function(v) {
        var currentOffset = Math.abs(v - value);
        if (currentOffset <= offset){
          newValue = v;
          offset = currentOffset;
        }
      });
      return newValue;
    }
    if (value > this.range.end) return this.range.end;
    if (value < this.range.start) return this.range.start;
    return value;
  },
  setValue: function(sliderValue, handleIdx){
    if (!this.active) {
      this.activeHandleIdx = handleIdx || 0;
      this.activeHandle    = this.handles[this.activeHandleIdx];
      this.updateStyles();
    }
    handleIdx = handleIdx || this.activeHandleIdx || 0;
    if (this.initialized && this.restricted) {
      if ((handleIdx>0) && (sliderValue<this.values[handleIdx-1]))
        sliderValue = this.values[handleIdx-1];
      if ((handleIdx < (this.handles.length-1)) && (sliderValue>this.values[handleIdx+1]))
        sliderValue = this.values[handleIdx+1];
    }
    sliderValue = this.getNearestValue(sliderValue);
    this.values[handleIdx] = sliderValue;
    this.value = this.values[0]; // assure backwards compat

    this.handles[handleIdx].style[this.isVertical() ? 'top' : 'left'] =
      this.translateToPx(sliderValue);

    this.drawSpans();
    if (!this.dragging || !this.event) this.updateFinished();
  },
  setValueBy: function(delta, handleIdx) {
    this.setValue(this.values[handleIdx || this.activeHandleIdx || 0] + delta,
      handleIdx || this.activeHandleIdx || 0);
  },
  translateToPx: function(value) {
    return Math.round(
      ((this.trackLength-this.handleLength)/(this.range.end-this.range.start)) *
      (value - this.range.start)) + "px";
  },
  translateToValue: function(offset) {
    return ((offset/(this.trackLength-this.handleLength) *
      (this.range.end-this.range.start)) + this.range.start);
  },
  getRange: function(range) {
    var v = this.values.sortBy(Prototype.K);
    range = range || 0;
    return $R(v[range],v[range+1]);
  },
  minimumOffset: function(){
    return(this.isVertical() ? this.alignY : this.alignX);
  },
  maximumOffset: function(){
    return(this.isVertical() ?
      (this.track.offsetHeight != 0 ? this.track.offsetHeight :
        this.track.style.height.replace(/px$/,"")) - this.alignY :
      (this.track.offsetWidth != 0 ? this.track.offsetWidth :
        this.track.style.width.replace(/px$/,"")) - this.alignX);
  },
  isVertical:  function(){
    return (this.axis == 'vertical');
  },
  drawSpans: function() {
    var slider = this;
    if (this.spans)
      $R(0, this.spans.length-1).each(function(r) { slider.setSpan(slider.spans[r], slider.getRange(r)) });
    if (this.options.startSpan)
      this.setSpan(this.options.startSpan,
        $R(0, this.values.length>1 ? this.getRange(0).min() : this.value ));
    if (this.options.endSpan)
      this.setSpan(this.options.endSpan,
        $R(this.values.length>1 ? this.getRange(this.spans.length-1).max() : this.value, this.maximum));
  },
  setSpan: function(span, range) {
    if (this.isVertical()) {
      span.style.top = this.translateToPx(range.start);
      span.style.height = this.translateToPx(range.end - range.start + this.range.start);
    } else {
      span.style.left = this.translateToPx(range.start);
      span.style.width = this.translateToPx(range.end - range.start + this.range.start);
    }
  },
  updateStyles: function() {
    this.handles.each( function(h){ Element.removeClassName(h, 'selected') });
    Element.addClassName(this.activeHandle, 'selected');
  },
  startDrag: function(event) {
    if (Event.isLeftClick(event)) {
      if (!this.disabled){
        this.active = true;

        var handle = Event.element(event);
        var pointer  = [Event.pointerX(event), Event.pointerY(event)];
        var track = handle;
        if (track==this.track) {
          var offsets  = this.track.cumulativeOffset();
          this.event = event;
          this.setValue(this.translateToValue(
           (this.isVertical() ? pointer[1]-offsets[1] : pointer[0]-offsets[0])-(this.handleLength/2)
          ));
          var offsets  = this.activeHandle.cumulativeOffset();
          this.offsetX = (pointer[0] - offsets[0]);
          this.offsetY = (pointer[1] - offsets[1]);
        } else {
          // find the handle (prevents issues with Safari)
          while((this.handles.indexOf(handle) == -1) && handle.parentNode)
            handle = handle.parentNode;

          if (this.handles.indexOf(handle)!=-1) {
            this.activeHandle    = handle;
            this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
            this.updateStyles();

            var offsets  = this.activeHandle.cumulativeOffset();
            this.offsetX = (pointer[0] - offsets[0]);
            this.offsetY = (pointer[1] - offsets[1]);
          }
        }
      }
      Event.stop(event);
    }
  },
  update: function(event) {
   if (this.active) {
      if (!this.dragging) this.dragging = true;
      this.draw(event);
      if (Prototype.Browser.WebKit) window.scrollBy(0,0);
      Event.stop(event);
   }
  },
  draw: function(event) {
    var pointer = [Event.pointerX(event), Event.pointerY(event)];
    var offsets = this.track.cumulativeOffset();
    pointer[0] -= this.offsetX + offsets[0];
    pointer[1] -= this.offsetY + offsets[1];
    this.event = event;
    this.setValue(this.translateToValue( this.isVertical() ? pointer[1] : pointer[0] ));
    if (this.initialized && this.options.onSlide)
      this.options.onSlide(this.values.length>1 ? this.values : this.value, this);
  },
  endDrag: function(event) {
    if (this.active && this.dragging) {
      this.finishDrag(event, true);
      Event.stop(event);
    }
    this.active = false;
    this.dragging = false;
  },
  finishDrag: function(event, success) {
    this.active = false;
    this.dragging = false;
    this.updateFinished();
  },
  updateFinished: function() {
    if (this.initialized && this.options.onChange)
      this.options.onChange(this.values.length>1 ? this.values : this.value, this);
    this.event = null;
  }
});// script.aculo.us sound.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009

// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// Based on code created by Jules Gravinese (http://www.webveteran.com/)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

Sound = {
  tracks: {},
  _enabled: true,
  template:
    new Template('<embed style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>'),
  enable: function(){
    Sound._enabled = true;
  },
  disable: function(){
    Sound._enabled = false;
  },
  play: function(url){
    if(!Sound._enabled) return;
    var options = Object.extend({
      track: 'global', url: url, replace: false
    }, arguments[1] || {});

    if(options.replace && this.tracks[options.track]) {
      $R(0, this.tracks[options.track].id).each(function(id){
        var sound = $('sound_'+options.track+'_'+id);
        sound.Stop && sound.Stop();
        sound.remove();
      });
      this.tracks[options.track] = null;
    }

    if(!this.tracks[options.track])
      this.tracks[options.track] = { id: 0 };
    else
      this.tracks[options.track].id++;

    options.id = this.tracks[options.track].id;
    $$('body')[0].insert(
      Prototype.Browser.IE ? new Element('bgsound',{
        id: 'sound_'+options.track+'_'+options.id,
        src: options.url, loop: 1, autostart: true
      }) : Sound.template.evaluate(options));
  }
};

if(Prototype.Browser.Gecko && navigator.userAgent.indexOf("Win") > 0){
  if(navigator.plugins && $A(navigator.plugins).detect(function(p){ return p.name.indexOf('QuickTime') != -1 }))
    Sound.template = new Template('<object id="sound_#{track}_#{id}" width="0" height="0" type="audio/mpeg" data="#{url}"/>');
  else if(navigator.plugins && $A(navigator.plugins).detect(function(p){ return p.name.indexOf('Windows Media') != -1 }))
    Sound.template = new Template('<object id="sound_#{track}_#{id}" type="application/x-mplayer2" data="#{url}"></object>');
  else if(navigator.plugins && $A(navigator.plugins).detect(function(p){ return p.name.indexOf('RealPlayer') != -1 }))
    Sound.template = new Template('<embed type="audio/x-pn-realaudio-plugin" style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>');
  else
    Sound.play = function(){};
} /**
 * Image Cropper (v. 1.2.0 - 2006-10-30 )
 * Copyright (c) 2006 David Spurr (http://www.defusion.org.uk/)
 * 
 * The image cropper provides a way to draw a crop area on an image and capture
 * the coordinates of the drawn crop area.
 * 
 * Features include:
 * 		- Based on Prototype and Scriptaculous
 * 		- Image editing package styling, the crop area functions and looks 
 * 		  like those found in popular image editing software
 * 		- Dynamic inclusion of required styles
 * 		- Drag to draw areas
 * 		- Shift drag to draw/resize areas as squares
 * 		- Selection area can be moved 
 * 		- Seleciton area can be resized using resize handles
 * 		- Allows dimension ratio limited crop areas
 * 		- Allows minimum dimension crop areas
 * 		- Allows maximum dimesion crop areas
 * 		- If both min & max dimension options set to the same value for a single axis,then the cropper will not 
 * 		  display the resize handles as appropriate (when min & max dimensions are passed for both axes this
 * 		  results in a 'fixed size' crop area)
 * 		- Allows dynamic preview of resultant crop ( if minimum width & height are provided ), this is
 * 		  implemented as a subclass so can be excluded when not required
 * 		- Movement of selection area by arrow keys ( shift + arrow key will move selection area by
 * 		  10 pixels )
 *		- All operations stay within bounds of image
 * 		- All functionality & display compatible with most popular browsers supported by Prototype:
 * 			PC:	IE 7, 6 & 5.5, Firefox 1.5, Opera 8.5 (see known issues) & 9.0b
 * 			MAC: Camino 1.0, Firefox 1.5, Safari 2.0
 * 
 * Requires:
 * 		- Prototype v. 1.5.0_rc0 > (as packaged with Scriptaculous 1.6.1)
 * 		- Scriptaculous v. 1.6.1 > modules: builder, dragdrop 
 * 		
 * Known issues:
 * 		- Safari animated gifs, only one of each will animate, this seems to be a known Safari issue
 * 
 * 		- After drawing an area and then clicking to start a new drag in IE 5.5 the rendered height 
 *        appears as the last height until the user drags, this appears to be the related to the error 
 *        that the forceReRender() method fixes for IE 6, i.e. IE 5.5 is not redrawing the box properly.
 * 
 * 		- Lack of CSS opacity support in Opera before version 9 mean we disable those style rules, these 
 * 		  could be fixed by using PNGs with transparency if Opera 8.5 support is high priority for you
 * 
 * 		- Marching ants keep reloading in IE <6 (not tested in IE7), it is a known issue in IE and I have 
 *        found no viable workarounds that can be included in the release. If this really is an issue for you
 *        either try this post: http://mir.aculo.us/articles/2005/08/28/internet-explorer-and-ajax-image-caching-woes
 *        or uncomment the 'FIX MARCHING ANTS IN IE' rules in the CSS file
 *		
 *		- Styling & borders on image, any CSS styling applied directly to the image itself (floats, borders, padding, margin, etc.) will 
 *		  cause problems with the cropper. The use of a wrapper element to apply these styles to is recommended.
 * 
 * 		- overflow: auto or overflow: scroll on parent will cause cropper to burst out of parent in IE and Opera (maybe Mac browsers too)
 *		  I'm not sure why yet.
 * 
 * Usage:
 * 		See Cropper.Img & Cropper.ImgWithPreview for usage details
 * 
 * Changelog:
 * v1.2.0 - 2006-10-30
 * 		+ Added id to the preview image element using 'imgCrop_[originalImageID]'
 *      * #00001 - Fixed bug: Doesn't account for scroll offsets
 *      * #00009 - Fixed bug: Placing the cropper inside differently positioned elements causes incorrect co-ordinates and display
 *      * #00013 - Fixed bug: I-bar cursor appears on drag plane
 *      * #00014 - Fixed bug: If ID for image tag is not found in document script throws error
 *      * Fixed bug with drag start co-ordinates if wrapper element has moved in browser (e.g. dragged to a new position)
 *      * Fixed bug with drag start co-ordinates if image contained in a wrapper with scrolling - this may be buggy if image 
 * 		  has other ancestors with scrolling applied (except the body)
 *      * #00015 - Fixed bug: When cropper removed and then reapplied onEndCrop callback gets called multiple times, solution suggestion from Bill Smith
 *      * Various speed increases & code cleanup which meant improved performance in Mac - which allowed removal of different overlay methods for
 *        IE and all other browsers, which led to a fix for:
 * 		* #00010 - Fixed bug: Select area doesn't adhere to image size when image resized using img attributes
 *      - #00006 - Removed default behaviour of automatically setting a ratio when both min width & height passed, the ratioDimensions must be passed in
 * 		+ #00005 - Added ability to set maximum crop dimensions, if both min & max set as the same value then we'll get a fixed cropper size on the axes as appropriate
 *        and the resize handles will not be displayed as appropriate
 * 		* Switched keydown for keypress for moving select area with cursor keys (makes for nicer action) - doesn't appear to work in Safari
 * 
 * v1.1.3 - 2006-08-21
 * 		* Fixed wrong cursor on western handle in CSS
 * 		+ #00008 & #00003 - Added feature: Allow to set dimensions & position for cropper on load
 *      * #00002 - Fixed bug: Pressing 'remove cropper' twice removes image in IE
 * 
 * v1.1.2 - 2006-06-09
 * 		* Fixed bugs with ratios when GCD is low (patch submitted by Andy Skelton)
 * 
 * v1.1.1 - 2006-06-03
 * 		* Fixed bug with rendering issues fix in IE 5.5
 * 		* Fixed bug with endCrop callback issues once cropper had been removed & reset in IE
 * 
 * v1.1.0 - 2006-06-02
 * 		* Fixed bug with IE constantly trying to reload select area background image
 * 		* Applied more robust fix to Safari & IE rendering issues
 * 		+ Added method to reset parameters - useful for when dynamically changing img cropper attached to
 * 		+ Added method to remove cropper from image
 * 
 * v1.0.0 - 2006-05-18 
 * 		+ Initial verison
 * 
 * 
 * Copyright (c) 2006, David Spurr (http://www.defusion.org.uk/)
 * All rights reserved.
 * 
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *     * Neither the name of the David Spurr nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * http://www.opensource.org/licenses/bsd-license.php
 * 
 * See scriptaculous.js for full scriptaculous licence
 */
 
/**
 * Extend the Draggable class to allow us to pass the rendering
 * down to the Cropper object.
 */
var CropDraggable = Class.create();

Object.extend( Object.extend( CropDraggable.prototype, Draggable.prototype), {
	
	initialize: function(element) {
		this.options = Object.extend(
			{
				/**
				 * The draw method to defer drawing to
				 */
				drawMethod: function() {}
			}, 
			arguments[1] || {}
		);

		this.element = $(element);

		this.handle = this.element;

		this.delta    = this.currentDelta();
		this.dragging = false;   

		this.eventMouseDown = this.initDrag.bindAsEventListener(this);
		Event.observe(this.handle, "mousedown", this.eventMouseDown);

		Draggables.register(this);
	},
	
	/**
	 * Defers the drawing of the draggable to the supplied method
	 */
	draw: function(point) {
		var pos = Position.cumulativeOffset(this.element);
		var d = this.currentDelta();
		pos[0] -= d[0]; 
		pos[1] -= d[1];
				
		var p = [0,1].map(function(i) { 
			return (point[i]-pos[i]-this.offset[i]) 
		}.bind(this));
				
		this.options.drawMethod( p );
	}
	
});


var Cropper = {};
Cropper.Img = Class.create();
Cropper.Img.prototype = {
	
	initialize: function(element, options, width, height) {
		this.imageWidth = width;
		this.imageHeight = height;
		this.options = Object.extend(
			{
				/**
				 * @var obj
				 * The pixel dimensions to apply as a restrictive ratio
				 */
				ratioDim: { x: 0, y: 0 },
				/**
				 * @var int
				 * The minimum pixel width, also used as restrictive ratio if min height passed too
				 */
				minWidth:		0,
				/**
				 * @var int
				 * The minimum pixel height, also used as restrictive ratio if min width passed too
				 */
				minHeight:		0,
				/**
				 * @var boolean
				 * Whether to display the select area on initialisation, only used when providing minimum width & height or ratio
				 */
				displayOnInit:	false,
				/**
				 * @var function
				 * The call back function to pass the final values to
				 */
				onEndCrop: Prototype.emptyFunction,
				/**
				 * @var boolean
				 * Whether to capture key presses or not
				 */
				captureKeys: true,
				/**
				 * @var obj Coordinate object x1, y1, x2, y2
				 * The coordinates to optionally display the select area at onload
				 */
				onloadCoords: null,
				/**
				 * @var int
				 * The maximum width for the select areas in pixels (if both minWidth & maxWidth set to same the width of the cropper will be fixed)
				 */
				maxWidth: 0,
				/**
				 * @var int
				 * The maximum height for the select areas in pixels (if both minHeight & maxHeight set to same the height of the cropper will be fixed)
				 */
				maxHeight: 0
			}, 
			options || {}
		);				
		this.img			= $( element );
		this.clickCoords	= { x: 0, y: 0 };
		this.dragging		= false;
		this.resizing		= false;
		this.isWebKit 		= /Konqueror|Safari|KHTML/.test( navigator.userAgent );
		this.isIE 			= /MSIE/.test( navigator.userAgent );
		this.isOpera8		= /Opera\s[1-8]/.test( navigator.userAgent );
		this.ratioX			= 0;
		this.ratioY			= 0;
		this.attached		= false;
		this.fixedWidth		= ( this.options.maxWidth > 0 && ( this.options.minWidth >= this.options.maxWidth ) );
		this.fixedHeight	= ( this.options.maxHeight > 0 && ( this.options.minHeight >= this.options.maxHeight ) );
		this.postOnLoad		= this.options.postOnLoad;
		
		// quit if the image element doesn't exist
		if( typeof this.img == 'undefined' ) return;
				
		// include the stylesheet		
		$A( document.getElementsByTagName( 'script' ) ).each( 
			function(s) {
				if( s.src.match( /cropper\.js/ ) ) {
					var path 	= s.src.replace( /cropper\.js(.*)?/, '' );
					// '<link rel="stylesheet" type="text/css" href="' + path + 'cropper.css" media="screen" />';
					var style 		= document.createElement( 'link' );
					style.rel 		= 'stylesheet';
					style.type 		= 'text/css';
					style.href 		= path + 'cropper.css';
					style.media 	= 'screen';
					document.getElementsByTagName( 'head' )[0].appendChild( style );
				}
	    	}
	    );   
	
		// calculate the ratio when neccessary
		if( this.options.ratioDim.x > 0 && this.options.ratioDim.y > 0 ) {
			var gcd = this.getGCD( this.options.ratioDim.x, this.options.ratioDim.y );
			this.ratioX = this.options.ratioDim.x / gcd;
			this.ratioY = this.options.ratioDim.y / gcd;
			// dump( 'RATIO : ' + this.ratioX + ':' + this.ratioY + '\n' );
		}
							
		// initialise sub classes
		this.subInitialize();

		// only load the event observers etc. once the image is loaded
		// this is done after the subInitialize() call just in case the sub class does anything
		// that will affect the result of the call to onLoad()
		//if( this.img.complete || this.isWebKit ) this.onLoad(); // for some reason Safari seems to support img.complete but returns 'undefined' on the this.img object
		//else Event.observe( this.img, 'load', this.onLoad.bindAsEventListener( this) );		
		this.img.onload =  this.onLoad.bindAsEventListener(this) ;		
	},
	

	getGCD : function( a , b ) {
		if( b == 0 ) return a;
		return this.getGCD(b, a % b );
	},
	
	/**
	 * Attaches the cropper to the image once it has loaded
	 * 
	 * @access private
	 * @return void
	 */
	onLoad: function( ) {
		/*
		 * Build the container and all related elements, will result in the following
		 *
		 * <div class="imgCrop_wrap">
		 * 		<img ... this.img ... />
		 * 		<div class="imgCrop_dragArea">
		 * 			<!-- the inner spans are only required for IE to stop it making the divs 1px high/wide -->
		 * 			<div class="imgCrop_overlay imageCrop_north"><span></span></div>
		 * 			<div class="imgCrop_overlay imageCrop_east"><span></span></div>
		 * 			<div class="imgCrop_overlay imageCrop_south"><span></span></div>
		 * 			<div class="imgCrop_overlay imageCrop_west"><span></span></div>
		 * 			<div class="imgCrop_selArea">
		 * 				<!-- marquees -->
		 * 				<!-- the inner spans are only required for IE to stop it making the divs 1px high/wide -->
		 * 				<div class="imgCrop_marqueeHoriz imgCrop_marqueeNorth"><span></span></div>
		 * 				<div class="imgCrop_marqueeVert imgCrop_marqueeEast"><span></span></div>
		 * 				<div class="imgCrop_marqueeHoriz imgCrop_marqueeSouth"><span></span></div>
		 * 				<div class="imgCrop_marqueeVert imgCrop_marqueeWest"><span></span></div>			
		 * 				<!-- handles -->
		 * 				<div class="imgCrop_handle imgCrop_handleN"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleNE"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleE"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleSE"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleS"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleSW"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleW"></div>
		 * 				<div class="imgCrop_handle imgCrop_handleNW"></div>
		 * 				<div class="imgCrop_clickArea"></div>
		 * 			</div>	
		 * 			<div class="imgCrop_clickArea"></div>
		 * 		</div>	
		 * </div>
		 */
		var cNamePrefix = 'imgCrop_';
		
		// get the point to insert the container
		var insertPoint = this.img.parentNode;
		
		// apply an extra class to the wrapper to fix Opera below version 9
		var fixOperaClass = '';
		if( this.isOpera8 ) fixOperaClass = ' opera8';
		this.imgWrap = Builder.node( 'div', { 'class': cNamePrefix + 'wrap' + fixOperaClass } );
		
		this.north		= Builder.node( 'div', { 'class': cNamePrefix + 'overlay ' + cNamePrefix + 'north' }, [Builder.node( 'span' )] );
		this.east		= Builder.node( 'div', { 'class': cNamePrefix + 'overlay ' + cNamePrefix + 'east' } , [Builder.node( 'span' )] );
		this.south		= Builder.node( 'div', { 'class': cNamePrefix + 'overlay ' + cNamePrefix + 'south' }, [Builder.node( 'span' )] );
		this.west		= Builder.node( 'div', { 'class': cNamePrefix + 'overlay ' + cNamePrefix + 'west' } , [Builder.node( 'span' )] );
		
		var overlays	= [ this.north, this.east, this.south, this.west ];

		this.dragArea	= Builder.node( 'div', { 'class': cNamePrefix + 'dragArea' }, overlays );
						
		this.handleN	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleN' } );
		this.handleNE	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleNE' } );
		this.handleE	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleE' } );
		this.handleSE	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleSE' } );
		this.handleS	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleS' } );
		this.handleSW	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleSW' } );
		this.handleW	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleW' } );
		this.handleNW	= Builder.node( 'div', { 'class': cNamePrefix + 'handle ' + cNamePrefix + 'handleNW' } );
				
		this.selArea	= Builder.node( 'div', { 'class': cNamePrefix + 'selArea' },
			[
				Builder.node( 'div', { 'class': cNamePrefix + 'marqueeHoriz ' + cNamePrefix + 'marqueeNorth' }, [Builder.node( 'span' )] ),
				Builder.node( 'div', { 'class': cNamePrefix + 'marqueeVert ' + cNamePrefix + 'marqueeEast' }  , [Builder.node( 'span' )] ),
				Builder.node( 'div', { 'class': cNamePrefix + 'marqueeHoriz ' + cNamePrefix + 'marqueeSouth' }, [Builder.node( 'span' )] ),
				Builder.node( 'div', { 'class': cNamePrefix + 'marqueeVert ' + cNamePrefix + 'marqueeWest' }  , [Builder.node( 'span' )] ),
				this.handleN,
				this.handleNE,
				this.handleE,
				this.handleSE,
				this.handleS,
				this.handleSW,
				this.handleW,
				this.handleNW,
				Builder.node( 'div', { 'class': cNamePrefix + 'clickArea' })
			]
		);
				
		this.imgWrap.appendChild( this.img );
		this.imgWrap.appendChild( this.dragArea );
		this.dragArea.appendChild( this.selArea );
		this.dragArea.appendChild( Builder.node( 'div', { 'class': cNamePrefix + 'clickArea' } ) );

		insertPoint.appendChild( this.imgWrap );

		// add event observers
		this.startDragBind 	= this.startDrag.bindAsEventListener( this );
		Event.observe( document, 'mousedown', this.startDragBind );
		
		this.onDragBind 	= this.onDrag.bindAsEventListener( this );
		Event.observe( document, 'mousemove', this.onDragBind );
		
		this.endCropBind 	= this.endCrop.bindAsEventListener( this );
		Event.observe( document, 'mouseup', this.endCropBind );
		
		this.resizeBind		= this.startResize.bindAsEventListener( this );
		this.handles = [ this.handleN, this.handleNE, this.handleE, this.handleSE, this.handleS, this.handleSW, this.handleW, this.handleNW ];
		this.registerHandles( true );
		
		if( this.options.captureKeys ) {
			this.keysBind = this.handleKeys.bindAsEventListener( this );
			Event.observe( document, 'keypress', this.keysBind );
		}

		// attach the dragable to the select area
		new CropDraggable( this.selArea, { drawMethod: this.moveArea.bindAsEventListener( this ) } );
		
		this.setParams();
		
		this.dimWindow = Builder.node('div', {'class': 'cropper-dim-window', 'style': 'width: auto;height: auto; background: #000; color: #fff;position: absolute;'});
		this.dimWindow.hide();
		$(document.body).appendChild(this.dimWindow);
		this.postOnLoad();
	},
	
	/**
	 * Manages adding or removing the handle event handler and hiding or displaying them as appropriate
	 * 
	 * @access private
	 * @param boolean registration true = add, false = remove
	 * @return void
	 */
	registerHandles: function( registration ) {	
		for( var i = 0; i < this.handles.length; i++ ) {
			var handle = $( this.handles[i] );
			
			if( registration ) {
				var hideHandle	= false;	// whether to hide the handle
				
				// disable handles asappropriate if we've got fixed dimensions
				// if both dimensions are fixed we don't need to do much
				if( this.fixedWidth && this.fixedHeight ) hideHandle = true;
				else if( this.fixedWidth || this.fixedHeight ) {
					// if one of the dimensions is fixed then just hide those handles
					var isCornerHandle	= handle.className.match( /([S|N][E|W])$/ )
					var isWidthHandle 	= handle.className.match( /(E|W)$/ );
					var isHeightHandle 	= handle.className.match( /(N|S)$/ );
					if( isCornerHandle ) hideHandle = true;
					else if( this.fixedWidth && isWidthHandle ) hideHandle = true;
					else if( this.fixedHeight && isHeightHandle ) hideHandle = true;
				}
				if( hideHandle ) handle.hide();
				else Event.observe( handle, 'mousedown', this.resizeBind );
			} else {
				handle.show();
				Event.stopObserving( handle, 'mousedown', this.resizeBind );
			}
		}
	},
		
	/**
	 * Sets up all the cropper parameters, this can be used to reset the cropper when dynamically
	 * changing the images
	 * 
	 * @access private
	 * @return void
	 */
	setParams: function() {
		/**
		 * @var int
		 * The image width
		 */
		this.imgW = this.imageWidth;
		/**
		 * @var int
		 * The image height
		 */
		this.imgH = this.imageHeight;			

		$( this.north ).setStyle( { height: 0 } );
		$( this.east ).setStyle( { width: 0, height: 0 } );
		$( this.south ).setStyle( { height: 0 } );
		$( this.west ).setStyle( { width: 0, height: 0 } );
		
		// resize the container to fit the image
		$( this.imgWrap ).setStyle( { 'width': this.imgW + 'px', 'height': this.imgH + 'px' } );
		
		// hide the select area
		$( this.selArea ).hide();
						
		// setup the starting position of the select area
		var startCoords = { x1: 0, y1: 0, x2: 0, y2: 0 };
		var validCoordsSet = false;
		
		// display the select area 
		if( this.options.onloadCoords != null ) {
			// if we've being given some coordinates to 
			startCoords = this.cloneCoords( this.options.onloadCoords );
			validCoordsSet = true;
		} else if( this.options.ratioDim.x > 0 && this.options.ratioDim.y > 0 ) {
			// if there is a ratio limit applied and the then set it to initial ratio
			startCoords.x1 = Math.ceil( ( this.imgW - this.options.ratioDim.x ) / 2 );
			startCoords.y1 = Math.ceil( ( this.imgH - this.options.ratioDim.y ) / 2 );
			startCoords.x2 = startCoords.x1 + this.options.ratioDim.x;
			startCoords.y2 = startCoords.y1 + this.options.ratioDim.y;
			validCoordsSet = true;
		}
		
		this.setAreaCoords( startCoords, false, false, 1 );
		
		if( this.options.displayOnInit && validCoordsSet ) {
			this.selArea.show();
			this.drawArea();
			this.endCrop();
		}
		
		this.attached = true;
	},
	
	/**
	 * Removes the cropper
	 * 
	 * @access public
	 * @return void
	 */
	remove: function() {
		if( this.attached ) {
			this.attached = false;
			
			// remove the elements we inserted
			if (this.imgWrap.parentNode) {
				this.imgWrap.parentNode.insertBefore( this.img, this.imgWrap );
				this.imgWrap.parentNode.removeChild( this.imgWrap );
			}
			
			// remove the event observers
			Event.stopObserving( document, 'mousedown', this.startDragBind );
			Event.stopObserving( document, 'mousemove', this.onDragBind );		
			Event.stopObserving( document, 'mouseup', this.endCropBind );
			this.registerHandles( false );
			if( this.options.captureKeys ) Event.stopObserving( document, 'keypress', this.keysBind );
		}
	},
	
	/**
	 * Resets the cropper, can be used either after being removed or any time you wish
	 * 
	 * @access public
	 * @return void
	 */
	reset: function() {
		if( !this.attached ) this.onLoad();
		else this.setParams();
		this.endCrop();
	},
	
	/**
	 * Handles the key functionality, currently just using arrow keys to move, if the user
	 * presses shift then the area will move by 10 pixels
	 */
	handleKeys: function( e ) {
		var dir = { x: 0, y: 0 }; // direction to move it in & the amount in pixels
		if( !this.dragging ) {
			
			// catch the arrow keys
			switch( e.keyCode ) {
				case( 37 ) : // left
					dir.x = -1;
					break;
				case( 38 ) : // up
					dir.y = -1;
					break;
				case( 39 ) : // right
					dir.x = 1;
					break
				case( 40 ) : // down
					dir.y = 1;
					break;
			}
			
			if( dir.x != 0 || dir.y != 0 ) {
				// if shift is pressed then move by 10 pixels
				if( e.shiftKey ) {
					dir.x *= 10;
					dir.y *= 10;
				}
				
				this.moveArea( [ this.areaCoords.x1 + dir.x, this.areaCoords.y1 + dir.y ] );
				Event.stop( e ); 
			}
		}
	},
	
	/**
	 * Calculates the width from the areaCoords
	 * 
	 * @access private
	 * @return int
	 */
	calcW: function() {
		return (this.areaCoords.x2 - this.areaCoords.x1)
	},
	

	calcH: function() {
		return (this.areaCoords.y2 - this.areaCoords.y1)
	},
	

	moveArea: function( point ) {
		// dump( 'moveArea        : ' + point[0] + ',' + point[1] + ',' + ( point[0] + ( this.areaCoords.x2 - this.areaCoords.x1 ) ) + ',' + ( point[1] + ( this.areaCoords.y2 - this.areaCoords.y1 ) ) + '\n' );
		this.setAreaCoords( 
			{
				x1: point[0], 
				y1: point[1],
				x2: point[0] + this.calcW(),
				y2: point[1] + this.calcH()
			},
			true,
			false
		);
		this.drawArea();
	},


	cloneCoords: function( coords ) {
		return { x1: coords.x1, y1: coords.y1, x2: coords.x2, y2: coords.y2 };
	},


	setAreaCoords: function( coords, moving, square, direction, resizeHandle ) {
		// dump( 'setAreaCoords (in) : ' + coords.x1 + ',' + coords.y1 + ',' + coords.x2 + ',' + coords.y2 );
		if( moving ) {
			// if moving
			var targW = coords.x2 - coords.x1;
			var targH = coords.y2 - coords.y1;
			
			// ensure we're within the bounds
			if( coords.x1 < 0 ) {
				coords.x1 = 0;
				coords.x2 = targW;
			}
			if( coords.y1 < 0 ) {
				coords.y1 = 0;
				coords.y2 = targH;
			}
			if( coords.x2 > this.imgW ) {
				coords.x2 = this.imgW;
				coords.x1 = this.imgW - targW;
			}
			if( coords.y2 > this.imgH ) {
				coords.y2 = this.imgH;
				coords.y1 = this.imgH - targH;
			}			
		} else {
			// ensure we're within the bounds
			if( coords.x1 < 0 ) coords.x1 = 0;
			if( coords.y1 < 0 ) coords.y1 = 0;
			if( coords.x2 > this.imgW ) coords.x2 = this.imgW;
			if( coords.y2 > this.imgH ) coords.y2 = this.imgH;
			
			// This is passed as null in onload
			if( direction != null ) {
								
				// apply the ratio or squaring where appropriate
				if( this.ratioX > 0 ) this.applyRatio( coords, { x: this.ratioX, y: this.ratioY }, direction, resizeHandle );
				else if( square ) this.applyRatio( coords, { x: 1, y: 1 }, direction, resizeHandle );
										
				var mins = [ this.options.minWidth, this.options.minHeight ]; // minimum dimensions [x,y]			
				var maxs = [ this.options.maxWidth, this.options.maxHeight ]; // maximum dimensions [x,y]
		
				// apply dimensions where appropriate
				if( mins[0] > 0 || mins[1] > 0 || maxs[0] > 0 || maxs[1] > 0) {
				
					var coordsTransX 	= { a1: coords.x1, a2: coords.x2 };
					var coordsTransY 	= { a1: coords.y1, a2: coords.y2 };
					var boundsX			= { min: 0, max: this.imgW };
					var boundsY			= { min: 0, max: this.imgH };
					
					// handle squaring properly on single axis minimum dimensions
					if( (mins[0] != 0 || mins[1] != 0) && square ) {
						if( mins[0] > 0 ) mins[1] = mins[0];
						else if( mins[1] > 0 ) mins[0] = mins[1];
					}
					
					if( (maxs[0] != 0 || maxs[0] != 0) && square ) {
						// if we have a max x value & it is less than the max y value then we set the y max to the max x (so we don't go over the minimum maximum of one of the axes - if that makes sense)
						if( maxs[0] > 0 && maxs[0] <= maxs[1] ) maxs[1] = maxs[0];
						else if( maxs[1] > 0 && maxs[1] <= maxs[0] ) maxs[0] = maxs[1];
					}
					
					if( mins[0] > 0 ) this.applyDimRestriction( coordsTransX, mins[0], direction.x, boundsX, 'min' );
					if( mins[1] > 1 ) this.applyDimRestriction( coordsTransY, mins[1], direction.y, boundsY, 'min' );
					
					if( maxs[0] > 0 ) this.applyDimRestriction( coordsTransX, maxs[0], direction.x, boundsX, 'max' );
					if( maxs[1] > 1 ) this.applyDimRestriction( coordsTransY, maxs[1], direction.y, boundsY, 'max' );
					
					coords = { x1: coordsTransX.a1, y1: coordsTransY.a1, x2: coordsTransX.a2, y2: coordsTransY.a2 };
				}
				
			}
		}
		
		// dump( 'setAreaCoords (out) : ' + coords.x1 + ',' + coords.y1 + ',' + coords.x2 + ',' + coords.y2 + '\n' );
		this.areaCoords = coords;
	},
	

	applyDimRestriction: function( coords, val, direction, bounds, type ) {
		var check;
		if( type == 'min' ) check = ( ( coords.a2 - coords.a1 ) < val );
		else check = ( ( coords.a2 - coords.a1 ) > val );
		if( check ) {
			if( direction == 1 ) coords.a2 = coords.a1 + val;
			else coords.a1 = coords.a2 - val;
			
			// make sure we're still in the bounds (not too pretty for the user, but needed)
			if( coords.a1 < bounds.min ) {
				coords.a1 = bounds.min;
				coords.a2 = val;
			} else if( coords.a2 > bounds.max ) {
				coords.a1 = bounds.max - val;
				coords.a2 = bounds.max;
			}
		}
	},
		

	applyRatio : function( coords, ratio, direction, resizeHandle ) {
		// dump( 'direction.y : ' + direction.y + '\n');
		var newCoords;
		if( resizeHandle == 'N' || resizeHandle == 'S' ) {
			// dump( 'north south \n');
			// if moving on either the lone north & south handles apply the ratio on the y axis
			newCoords = this.applyRatioToAxis( 
				{ a1: coords.y1, b1: coords.x1, a2: coords.y2, b2: coords.x2 },
				{ a: ratio.y, b: ratio.x },
				{ a: direction.y, b: direction.x },
				{ min: 0, max: this.imgW }
			);
			coords.x1 = newCoords.b1;
			coords.y1 = newCoords.a1;
			coords.x2 = newCoords.b2;
			coords.y2 = newCoords.a2;
		} else {
			// otherwise deal with it as if we're applying the ratio on the x axis
			newCoords = this.applyRatioToAxis( 
				{ a1: coords.x1, b1: coords.y1, a2: coords.x2, b2: coords.y2 },
				{ a: ratio.x, b: ratio.y },
				{ a: direction.x, b: direction.y },
				{ min: 0, max: this.imgH }
			);
			coords.x1 = newCoords.a1;
			coords.y1 = newCoords.b1;
			coords.x2 = newCoords.a2;
			coords.y2 = newCoords.b2;
		}
		
	},
	

	applyRatioToAxis: function( coords, ratio, direction, bounds ) {
		var newCoords = Object.extend( coords, {} );
		var calcDimA = newCoords.a2 - newCoords.a1;			// calculate dimension a (e.g. width)
		var targDimB = Math.floor( calcDimA * ratio.b / ratio.a );	// the target dimension b (e.g. height)
		var targB;											// to hold target b (e.g. y value)
		var targDimA;                                		// to hold target dimension a (e.g. width)
		var calcDimB = null;								// to hold calculated dimension b (e.g. height)
		
		// dump( 'newCoords[0]: ' + newCoords.a1 + ',' + newCoords.b1 + ','+ newCoords.a2 + ',' + newCoords.b2 + '\n');
				
		if( direction.b == 1 ) {							// if travelling in a positive direction
			// make sure we're not going out of bounds
			targB = newCoords.b1 + targDimB;
			if( targB > bounds.max ) {
				targB = bounds.max;
				calcDimB = targB - newCoords.b1;			// calcuate dimension b (e.g. height)
			}
			
			newCoords.b2 = targB;
		} else {											// if travelling in a negative direction
			// make sure we're not going out of bounds
			targB = newCoords.b2 - targDimB;
			if( targB < bounds.min ) {
				targB = bounds.min;
				calcDimB = targB + newCoords.b2;			// calcuate dimension b (e.g. height)
			}
			newCoords.b1 = targB;
		}
		
		// dump( 'newCoords[1]: ' + newCoords.a1 + ',' + newCoords.b1 + ','+ newCoords.a2 + ',' + newCoords.b2 + '\n');
			
		// apply the calculated dimensions
		if( calcDimB != null ) {
			targDimA = Math.floor( calcDimB * ratio.a / ratio.b );
			
			if( direction.a == 1 ) newCoords.a2 = newCoords.a1 + targDimA;
			else newCoords.a1 = newCoords.a1 = newCoords.a2 - targDimA;
		}
		
		// dump( 'newCoords[2]: ' + newCoords.a1 + ',' + newCoords.b1 + ','+ newCoords.a2 + ',' + newCoords.b2 + '\n');
			
		return newCoords;
	},
	setImageSize: function(width, height){
		var newX1 = this.areaCoords.x1;
		var newX2 = this.areaCoords.x2;
		var newY1 = this.areaCoords.y1;
		var newY2 = this.areaCoords.y2;
		
		if (width < this.areaCoords.x2 ){
			newX1 = this.areaCoords.x1 - (this.areaCoords.x2-width);
			newX2 = width;
		}
		if (height < this.areaCoords.y2 ){
			newY1 = this.areaCoords.y1 - (this.areaCoords.y2-height);
			newY2 = height;
		}
		this.imageWidth = width;
		this.imageHeight = height;
		this.imgW = width;
		this.imgH = height;
		this.setAreaCoords( { x1: newX1, y1: newY1, x2: newX2, y2: newY2 }, false, false, null );
		this.imgWrap.setStyle('width: '+width+'px;height: '+height+'px;');
		this.drawArea();
	},
	/**
	 * Draws the select area
	 * 
	 * @access private
	 * @return void
	 */
	drawArea: function( ) {	
		/*
		 * NOTE: I'm not using the Element.setStyle() shortcut as they make it 
		 * quite sluggish on Mac based browsers
		 */
		// dump( 'drawArea        : ' + this.areaCoords.x1 + ',' + this.areaCoords.y1 + ',' + this.areaCoords.x2 + ',' + this.areaCoords.y2 + '\n' );
		var areaWidth     = this.calcW();
		var areaHeight    = this.calcH();
		
		/*
		 * Calculate all the style strings before we use them, allows reuse & produces quicker
		 * rendering (especially noticable in Mac based browsers)
		 */
		var px = 'px';
		var params = [
			this.areaCoords.x1 + px, 	// the left of the selArea
			this.areaCoords.y1 + px,		// the top of the selArea
			areaWidth + px,					// width of the selArea
			areaHeight + px,					// height of the selArea
			this.areaCoords.x2 + px,		// bottom of the selArea
			this.areaCoords.y2 + px,		// right of the selArea
			(this.imageWidth - this.areaCoords.x2) + px,	// right edge of selArea
			(this.imageHeight - this.areaCoords.y2) + px	// bottom edge of selArea
		];
				
		// do the select area
		var areaStyle				= this.selArea.style;
		areaStyle.left				= params[0];
		areaStyle.top				= params[1];
		areaStyle.width				= params[2];
		areaStyle.height			= params[3];
			  	
		// position the north, east, south & west handles
		var horizHandlePos = Math.ceil( (areaWidth - 6) / 2 ) + px;
		var vertHandlePos = Math.ceil( (areaHeight - 6) / 2 ) + px;
		
		this.handleN.style.left 	= horizHandlePos;
		this.handleE.style.top 		= vertHandlePos;
		this.handleS.style.left 	= horizHandlePos;
		this.handleW.style.top		= vertHandlePos;
		
		// draw the four overlays
		this.north.style.height 	= params[1];
		
		var eastStyle 				= this.east.style;
		eastStyle.top				= params[1];
		eastStyle.height			= params[3];
		eastStyle.left				= params[4];
	    eastStyle.width				= params[6];
	   
	   	var southStyle 				= this.south.style;
	   	southStyle.top				= params[5];
	   	southStyle.height			= params[7];
	   
	    var westStyle       		= this.west.style;
	    westStyle.top				= params[1];
	    westStyle.height			= params[3];
	   	westStyle.width				= params[0];
	   	
		// call the draw method on sub classes
		this.subDrawArea();
		
		this.forceReRender();
	},
	
	/**
	 * Force the re-rendering of the selArea element which fixes rendering issues in Safari 
	 * & IE PC, especially evident when re-sizing perfectly vertical using any of the south handles
	 * 
	 * @access private
	 * @return void
	 */
	forceReRender: function() {
		if( this.isIE || this.isWebKit) {
			var n = document.createTextNode(' ');
			var d,el,fixEL,i;
		
			if( this.isIE ) fixEl = this.selArea;
			else if( this.isWebKit ) {
				fixEl = document.getElementsByClassName( 'imgCrop_marqueeSouth', this.imgWrap )[0];
				/* we have to be a bit more forceful for Safari, otherwise the the marquee &
				 * the south handles still don't move
				 */ 
				d = Builder.node( 'div', '' );
				d.style.visibility = 'hidden';
				
				var classList = ['SE','S','SW'];
				for( i = 0; i < classList.length; i++ ) {
					el = document.getElementsByClassName( 'imgCrop_handle' + classList[i], this.selArea )[0];
					if( el.childNodes.length ) el.removeChild( el.childNodes[0] );
					el.appendChild(d);
				}
			}
			fixEl.appendChild(n);
			fixEl.removeChild(n);
		}
	},
	
	/**
	 * Starts the resize
	 * 
	 * @access private
	 * @param obj Event
	 * @return void
	 */
	startResize: function( e ) {
		this.startCoords = this.cloneCoords( this.areaCoords );
		
		this.resizing = true;
		this.resizeHandle = Event.element( e ).classNames().toString().replace(/([^N|NE|E|SE|S|SW|W|NW])+/, '');
		// dump( 'this.resizeHandle : ' + this.resizeHandle + '\n' );
		Event.stop( e );
	},
	
	/**
	 * Starts the drag
	 * 
	 * @access private
	 * @param obj Event
	 * @return void
	 */
	startDrag: function( e ) {	
		if (e.target != null && (e.target.nodeName == 'input' || e.target.nodeName == 'INPUT')) {
			return;
		}
		this.clickCoords = this.getCurPos( e );
		var offsets = this.getOffsets();
		
		var width = this.options.scrollWrapper?this.options.scrollWrapper.getWidth()-20:0;
		var height = this.options.scrollWrapper?this.options.scrollWrapper.getHeight()-20:0;
		var wrapperOffsets = this.options.scrollWrapper.cumulativeOffset();
		var pointerX = Event.pointerX(e);
		var pointerY = Event.pointerY(e);
		//if (this.clickCoords.x >= 0 && this.clickCoords.x <= width+offsets.x && this.clickCoords.y >= 0 && this.clickCoords.y <= height+offsets.y) {
		if ( pointerX > wrapperOffsets.left && pointerX <  wrapperOffsets.left+width && pointerY > wrapperOffsets.top && pointerY <  wrapperOffsets.top+height ){
			this.selArea.show();
    		this.setAreaCoords( { x1: this.clickCoords.x, y1: this.clickCoords.y, x2: this.clickCoords.x, y2: this.clickCoords.y }, false, false, null );
    		this.dragging = true;
	    	this.onDrag( e ); // incase the user just clicks once after already making a selection
    		Event.stop( e );
    	}
	},
	
	/**
	 * Gets the current cursor position relative to the image
	 * 
	 * @access private
	 * @param obj Event
	 * @return obj x,y pixels of the cursor
	 */
	getCurPos: function( e ) {
		// get the offsets for the wrapper within the document
		var el = this.imgWrap, wrapOffsets = Position.cumulativeOffset( el );
		// remove any scrolling that is applied to the wrapper (this may be buggy) - don't count the scroll on the body as that won't affect us
		while( el != null && el.nodeName != 'BODY' ) {
			wrapOffsets[1] -= el.scrollTop  || 0;
			wrapOffsets[0] -= el.scrollLeft || 0;
			el = el.parentNode;
	    }		
		return curPos = { 
			x: Event.pointerX(e) - wrapOffsets[0],
			y: Event.pointerY(e) - wrapOffsets[1]
		}
	},
	/* Agregado por nosotros */
  	getOffsets: function(){
  		if ( this.options.scrollWrapper ){
  			return offsets = { 
				x: this.options.scrollWrapper.scrollLeft,
				y: this.options.scrollWrapper.scrollTop
			}
  		}
		return offsets = { 
			x: 0,
			y: 0
		}
  	},
  	/**
  	 * Performs the drag for both resize & inital draw dragging
  	 * 
  	 * @access private
	 * @param obj Event
	 * @return void
	 */
  	onDrag: function( e ) {
  		if( this.dragging || this.resizing ) {	
  		
  			var resizeHandle = null;
  			var curPos = this.getCurPos( e );			
			var newCoords = this.cloneCoords( this.areaCoords );
  			var direction = { x: 1, y: 1 };
  	  					
		    if( this.dragging ) {
		    	if( curPos.x < this.clickCoords.x ) direction.x = -1;
		    	if( curPos.y < this.clickCoords.y ) direction.y = -1;
		    	
				this.transformCoords( curPos.x, this.clickCoords.x, newCoords, 'x' );
				this.transformCoords( curPos.y, this.clickCoords.y, newCoords, 'y' );
			} else if( this.resizing ) {
				resizeHandle = this.resizeHandle;			
				// do x movements first
				if( resizeHandle.match(/E/) ) {
					// if we're moving an east handle
					this.transformCoords( curPos.x, this.startCoords.x1, newCoords, 'x' );	
					if( curPos.x < this.startCoords.x1 ) direction.x = -1;
				} else if( resizeHandle.match(/W/) ) {
					// if we're moving an west handle
					this.transformCoords( curPos.x, this.startCoords.x2, newCoords, 'x' );
					if( curPos.x < this.startCoords.x2 ) direction.x = -1;
				}
									
				// do y movements second
				if( resizeHandle.match(/N/) ) {
					// if we're moving an north handle	
					this.transformCoords( curPos.y, this.startCoords.y2, newCoords, 'y' );
					if( curPos.y < this.startCoords.y2 ) direction.y = -1;
				} else if( resizeHandle.match(/S/) ) {
					// if we're moving an south handle
					this.transformCoords( curPos.y, this.startCoords.y1, newCoords, 'y' );	
					if( curPos.y < this.startCoords.y1 ) direction.y = -1;
				}	
			}
			// dimmensions!!
			this.dimWindow.show();	
			var targW = newCoords.x2 - newCoords.x1;
			var targH = newCoords.y2 - newCoords.y1;	
			this.dimWindow.innerHTML = targW+'x'+targH;
			this.dimWindow.setStyle('top: '+(Event.pointerY(e)-this.dimWindow.getHeight()-5)+'px;left:'+(Event.pointerX(e)+5)+'px;z-index: 100000;');
			//
			
			this.setAreaCoords( newCoords, false, e.shiftKey, direction, resizeHandle );
			this.drawArea();
			Event.stop( e ); // stop the default event (selecting images & text) in Safari & IE PC
		}
	},

	transformCoords : function( curVal, baseVal, coords, axis ) {
		var newVals = [ curVal, baseVal ];
		if( curVal > baseVal ) newVals.reverse();
		coords[ axis + '1' ] = newVals[0];
		coords[ axis + '2' ] = newVals[1];		
	},
	
	/**
	 * Ends the crop & passes the values of the select area on to the appropriate 
	 * callback function on completion of a crop
	 * 
	 * @access private
	 * @return void
	 */
	endCrop : function() {
		this.dragging = false;
		this.resizing = false;
		
		this.options.onEndCrop(
			this.areaCoords,
			{
				width: this.calcW(), 
				height: this.calcH() 
			}
		);
		if ( this.dimWindow ) {
			this.dimWindow.hide();
		}
	},
	
	/**
	 * Abstract method called on the end of initialization
	 * 
	 * @access private
	 * @abstract
	 * @return void
	 */
	subInitialize: function() {},
	
	/**
	 * Abstract method called on the end of drawArea()
	 * 
	 * @access private
	 * @abstract
	 * @return void
	 */
	subDrawArea: function() {}
};




Cropper.ImgWithPreview = Class.create();

Object.extend( Object.extend( Cropper.ImgWithPreview.prototype, Cropper.Img.prototype ), {
	
	/**
	 * Implements the abstract method from Cropper.Img to initialize preview image settings.
	 * Will only attach a preview image is the previewWrap element is defined and the minWidth
	 * & minHeight options are set.
	 * 
	 * @see Croper.Img.subInitialize
	 */
	subInitialize: function() {
		/**
		 * Whether or not we've attached a preview image
		 * @var boolean
		 */
		this.hasPreviewImg = false;
		if( typeof(this.options.previewWrap) != 'undefined' 
			&& this.options.minWidth > 0 
			&& this.options.minHeight > 0
		) {
			/**
			 * The preview image wrapper element
			 * @var obj HTML element
			 */
			this.previewWrap 	= $( this.options.previewWrap );
			/**
			 * The preview image element
			 * @var obj HTML IMG element
			 */
			this.previewImg 	= this.img.cloneNode( false );
			// set the ID of the preview image to be unique
			this.previewImg.id	= 'imgCrop_' + this.previewImg.id;
			
						
			// set the displayOnInit option to true so we display the select area at the same time as the thumbnail
			this.options.displayOnInit = true;

			this.hasPreviewImg 	= true;
			
			this.previewWrap.addClassName( 'imgCrop_previewWrap' );
			
			this.previewWrap.setStyle(
			 { 
			 	width: this.options.minWidth + 'px',
			 	height: this.options.minHeight + 'px'
			 }
			);
			
			this.previewWrap.appendChild( this.previewImg );
		}
	},
	
	/**
	 * Implements the abstract method from Cropper.Img to draw the preview image
	 * 
	 * @see Croper.Img.subDrawArea
	 */
	subDrawArea: function() {
		if( this.hasPreviewImg ) {
			// get the ratio of the select area to the src image
			var calcWidth = this.calcW();
			var calcHeight = this.calcH();
			// ratios for the dimensions of the preview image
			var dimRatio = { 
				x: this.imgW / calcWidth, 
				y: this.imgH / calcHeight 
			}; 
			//ratios for the positions within the preview
			var posRatio = { 
				x: calcWidth / this.options.minWidth, 
				y: calcHeight / this.options.minHeight 
			};
			
			// setting the positions in an obj before apply styles for rendering speed increase
			var calcPos	= {
				w: Math.ceil( this.options.minWidth * dimRatio.x ) + 'px',
				h: Math.ceil( this.options.minHeight * dimRatio.y ) + 'px',
				x: '-' + Math.ceil( this.areaCoords.x1 / posRatio.x )  + 'px',
				y: '-' + Math.ceil( this.areaCoords.y1 / posRatio.y ) + 'px'
			}
			
			var previewStyle 	= this.previewImg.style;
			previewStyle.width 	= calcPos.w;
			previewStyle.height	= calcPos.h;
			previewStyle.left	= calcPos.x;
			previewStyle.top	= calcPos.y;
		}
	}
	
});
/* protoload 0.1 beta by Andreas Kalsch
 * last change: 09.07.2007
 *
 * This simple piece of code automates the creating of Ajax loading symbols.
 * The loading symbol covers an HTML element with correct position and size - example:
 * $('myElement').startWaiting() and $('myElement').stopWaiting()
 */
 
Protoload = {
	// the script to wait this amount of msecs until it shows the loading element
	timeUntilShow: 250,
	
	// opacity of loading element
	opacity: 0.8,

	// Start waiting status - show loading element
	startWaiting: function(element, className, timeUntilShow) {
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (className == undefined)
			className = 'waiting';
		if (timeUntilShow == undefined)
			timeUntilShow = Protoload.timeUntilShow;
		
		element._waiting = true;
		if (!element._loading) {
			var e = document.createElement('div');
			(element.offsetParent || document.body).appendChild(element._loading = e);
			e.style.position = 'absolute';
			try {e.style.opacity = Protoload.opacity;} catch(e) {}
			try {e.style.MozOpacity = Protoload.opacity;} catch(e) {}
			try {e.style.filter = 'alpha(opacity='+Math.round(Protoload.opacity * 100)+')';} catch(e) {}
			try {e.style.KhtmlOpacity = Protoload.opacity;} catch(e) {}
		}
		element._loading.className = className;
		window.setTimeout((function() {
			if (this._waiting) {
				var left = this.positionedOffset()[0],
                	top = this.positionedOffset()[1],
                    width = this.offsetWidth,
                    height = this.offsetHeight,
                    l = this._loading;
                    
				l.style.left = left+'px';
				l.style.top = top+'px';
				l.style.width = width+'px';
				l.style.height = height+'px';
				l.style.display = 'inline';
			}
		}).bind(element), timeUntilShow);
	},
	
	// Stop waiting status - hide loading element
	stopWaiting: function(element) {
		if (element._waiting) {
			element._waiting = false;
			element._loading.parentNode.removeChild(element._loading);
			element._loading = null;
		}
	}/*,
	
	_zIndex: 1000000*/
};

if (Prototype) {
	Element.addMethods(Protoload);
	Object.extend(Element, Protoload);
}
/* */var _gaq = _gaq || [];
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

function isIE6() {
	return BrowserDetect.browser == 'Explorer' && BrowserDetect.version == '6';
}

function isIE7(){
	return BrowserDetect.browser == 'Explorer' && BrowserDetect.version == '7';
}
function isIEAny(){
	return BrowserDetect.browser == 'Explorer';
}

function isSafari(){
	return BrowserDetect.browser == 'Safari';
}



var TmcePlugin = Class.create({
	findEditor: function() {
		var tmces = $$('#edit-content-form .rich-text-area');
		for ( var i =0; i<tmces.length ; i++ ){
			if ( tinyMCE.get(tmces[i].id) != null ){
				return tinyMCE.activeEditor;
			}
		}
	},
	getEncodedData: function(button, buttonId){
		var auxbutton = button;
		if ( auxbutton == null ){
			auxbutton = $(buttonId);
		}
		this.title = auxbutton.getAttribute('data-title');
		this.okLabel = auxbutton.getAttribute('data-txt-ok');
		this.cancelLabel = auxbutton.getAttribute('data-txt-cancel');
		this.closeLabel = auxbutton.getAttribute('data-txt-close');
		this.confirmText = auxbutton.getAttribute('data-txt-confirm');
		this.width = auxbutton.getAttribute('data-width');
		this.height = auxbutton.getAttribute('data-height');
		this.windowDescription = auxbutton.getAttribute('data-window-description');
		this.windowDescriptionWidth = auxbutton.getAttribute('data-bligoo-tooltip-width');
	}
});


function drawFieldText(name, cls, id, value, label, maxL, size){
	if ( maxL == null ){
		maxL = 255;
	}
	if ( size == null ){
		size = 4;
	}
	var wrapper = Builder.node('div', {'class' : 'form-item '+cls});
	
	var labelArea = Builder.node('span', {'class': 'label'});
	labelArea.appendChild(Builder.node('label', {}, label));
	wrapper.appendChild(labelArea);
	
	wrapper.appendChild(Builder.node('br'));
	
	wrapper.appendChild(Builder.node('input', {'class': 'text-field', 'value':  value, 'id': id, 'name': 'edit['+name+']', 'maxlength': maxL, 'size': size, 'type': 'text', 'autocomplete': 'off' }));
	return wrapper;
}

function drawFieldDimensions(name, id, value1, value2, label, size){
	if ( size == null ){
		size = 4;
	}
	var wrapper = Builder.node('div', {'class' : 'form-item form-item-dimensions'});
	
	var labelArea = Builder.node('span', {'class': 'label'});
	labelArea.appendChild(Builder.node('label', {}, label));
	wrapper.appendChild(labelArea);
	
	wrapper.appendChild(Builder.node('br'));
	
	wrapper.appendChild(Builder.node('input', {'value': value1, 'class': 'dimension-field dimension-width', 'id': id, 'name': 'edit[' + name + '-width]', 'size': size, 'type': 'text', 'autocomplete': 'off' }));
	var x = new Element('span');
	x.innerHTML = 'x';
	wrapper.appendChild(x);
	wrapper.appendChild(Builder.node('input', {'value': value2, 'class': 'dimension-field dimension-height', 'id': id, 'name': 'edit[' + name + '-height]', 'size': size, 'type': 'text', 'autocomplete': 'off' }));
	return wrapper;
}

/// FUNCIONES BLIGOO!!!


function enableTinyMCE(editor){
	toggleDisplayElements('embed','none');
	toggleDisplayElements('object','none');
	tinymce.dom.Event.domLoaded = true;
	tinyMCE.execCommand('mceAddControl',false, editor);
}


function toggleDisplayElements(tagName, displayValue){
	var elements = document.getElementsByTagName(tagName);	
	for(i=0;i<elements.length;i++)
		$(elements[i]).setStyle('style: ' + displayValue);
}


var blogId = 0;


function tr(key){
	var value;
        var myAjax = new Ajax.Request(
		'/bligoo/ajaxproxy', 
		{	method: 't'
		,	parameters: {key: key}
		, 	asynchronous: false
		, 	onComplete: function(transport){
                value = transport.responseText;
			}
		});
	return value;
}


function customURLConverter(url, node, on_save) {
    if(url.substring(0,7) != 'http://' && url.substring(0,7) != 'mailto:' && url.substring(0,8) != 'https://' && url.substring(0,6) != 'ftp://'){
         index = url.indexOf('/');
	     if(index >= 0)
	         s = url.substring(0, index); 
         else
             s = url;
         if(s.indexOf('.') > 0)
		        url = 'http://' + url; 
     }
     return url; 
}



Event.observe(window, 'unload', function(event) {
		$$('.spinner-submit').each(function(button) { 
				button.enable(); 
			})
		}
);

//parsear la forma {"key1":"val1","key2":"val2",...,"keyn":"valn"}
function evalJSON(s){
	var data = $H();
	s = s.substr(1,s.length-2);
	myRE = new RegExp('"[^"]+"', "ig");
	results = s.match(myRE);
	if(results != undefined){
		for(var i=0; i<results.length; i+=2){
			var l1 = results[i].length;
			var l2 = results[i+1].length;
			var k = results[i].substr(1,l1-2);	
			var v = results[i+1].substr(1,l2-2);
			data[k] = v;
		}
	}
	return data;
} 


function decodeMsg(s){
	return unescape(s.replace(/\+/g,' '));
}

function decodeHTML(html){
	return unescape(html.replace(/\+/g,' '));
}

function disableTinyMCE(id){
	if($(id)){
		var editor = tinyMCE.get(id);
		if (editor) {
			tinyMCE.execCommand('mceFocus', false,id);
			tinyMCE.execCommand('mceRemoveControl',false,id);
		}
	}
}

function saveHit(path, userAdsType, queryString, lul){
	var locAddress = '';
	var userLongitude = '';
	var userLatitude = '';
	if ( lul ==  1){
		var item = google.loader.ClientLocation;
 		if ( item != null ){
 			if ( item.address != null ){
 				if ( item.address.country_code != null ){
 					locAddress += item.address.country_code; 
 				}
 				if ( item.address.country != null ){
 					if (locAddress != ''){
 						locAddress+='|';
 					}
 					locAddress += item.address.country;
 				}
 				if ( item.address.region != null ){
 					if (locAddress != ''){
 						locAddress+='|';
 					}
 					locAddress += item.address.region;
 				}
 				if ( item.address.city != null ){
 					if (locAddress != ''){
 						locAddress+='|';
 					}
 					locAddress += item.address.city;
 				}
 			}
 			userLongitude = item.longitude;
 			userLatitude = item.latitude;
 		}
	}
	var hitAjax = new Ajax.Request(
		'/bligoo/ajaxproxy',{
				method: 'savehit',
				parameters: {path: path, userAdsType: userAdsType, queryString: queryString, longitude: userLongitude, latitude: userLatitude, location: locAddress}
			});
}
 
var pressed = 0;
function newContent(path){
       if(pressed == 0){
               pressed = 1;
               document.location.href = path;
       }
}

function habilitaWordLimit(){
	var displayType = $('display-type');
	if ( displayType != null ){
		if (displayType.value == 3 || displayType.value == 4){
			$('word-limit').ancestors().first().show();
		} else{
			$('word-limit').ancestors().first().hide();
		}
	}
}

/* Mover al selector de contactos que es unico que lo usa. o convertirlo en una clase*/
function isEmail(string) {
    if ( string == null || string == '' || string.strip() == ''){
			return false;
	}
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return filter.test(string.strip());
}

var CrossImage = Class.create({
	initialize: function (img, executeFunction, paramsFunction) {
		img.observe('mouseover', function(event) { event.target.src='/static/images/bligoobar/delete-active.png'; });
		img.observe('mouseout', function(event) { event.target.src='/static/images/bligoobar/delete-inactive.png'; });
		img.setStyle('cursor: pointer');
		img.src='/static/images/bligoobar/delete-inactive.png';
		if ( executeFunction != null ){
			Event.observe(img, 'click', executeFunction.bindAsEventListener(this, paramsFunction));
		}
	}
});







function urlParameter( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  return results[1];
}

function set_cookie( name, value, expires, path, domain, secure ) {
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );

	/*
	if the expires variable is set, make the correct 
	expires time, the current script below will set 
	it for x number of days, to make it for hours, 
	delete * 24, for minutes, delete * 60 * 24
	*/
	if ( expires ){
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
	( ( path ) ? ";path=" + path : "" ) + 
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}
	
function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1){ 
			c_start=c_start + c_name.length+1; 
			c_end=document.cookie.indexOf(";",c_start);
    		if (c_end==-1){ 
    			c_end=document.cookie.length;
    		}
    		return unescape(document.cookie.substring(c_start,c_end));
    	} 
  	}
	return "";
}		
			
// this fixes an issue with the old method, ambiguous values 
// with this test document.cookie.indexOf( name + "=" );
function get_cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	
	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		
		
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
	
		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}		


var SubmitStopperClass = new Class.create({
	initialize: function(formId) {
	    $(formId).stopObserving('keydown');
		$(formId).observe('keydown', this.watch.bindAsEventListener(this));
	},
	watch: function(event) {
		if (event.keyCode == 13 && event.target.type != 'textarea' ) { 
			event.stop(); 
			if (event.target.type == 'select' || event.target.type == 'select-one'){
				return;
			}
		}
	}
});

if (isIE6()) {
	setInterval('document.fire("bligoo:updatefixed")', 100);
}


function displaySiteMessage(msg, closeMsg){
	removeSiteMessage()
	var msgHtml = "<div id='message-container'><div id='alerts' class='messages'><a name='alerts'/>"
	msgHtml += "<ul><li>"+msg+"</li></ul>";
	msgHtml += "<div id='close-message'><a id='close-messages-link' href='javascript:void(0);'>"+closeMsg+"</a>";
	msgHtml += "</div></div>";
	$(document.body).insert({top:msgHtml});
	enableSiteMessageClose();
}
function enableSiteMessageClose(){
	if ( $('close-messages-link') != null ){
		$('close-messages-link').observe('click', function (e){
			closeBligooMessages();
		});
	}
}
function removeSiteMessage(){
	if ( $('message-container') != null ){
		$('message-container').remove();
	}
}

function jsredirect(path){
	location.href = path;
}

function callJSApi(method, parameters) {
	var value;
	new Ajax.Request('/bligoo/apiproxy', 
		{	method: 'jsAPI'
		,	parameters: $H({ callback: method}).merge(parameters)
		, 	asynchronous: false
		, 	onComplete: function(transport){
                value = transport.responseText;
			}
		});
	return value;
}

/*
function initDebug() {
      $(document.body).insert('<div id="debug" style="overflow: auto; height: 600px; position: fixed; left: 0 ; top: 0; color: red; background: black;">debug</div>');
}
function d(s) {
        $('debug').update($('debug').innerHTML + '<br>' + s);
}
initDebug();

d('hola');
*/





function getTinyMCEConfig(key){
	var commonConfig = {
		pagebreak_separator : '<!--break-->',
	   	urlconverter_callback : 'customURLConverter',
	   	relative_urls : false,
	   	theme : 'advanced',
	   	theme_advanced_toolbar_location : 'top',
		convert_urls : true,
		remove_linebreaks : false,
		valid_elements : '*[*]',
		font_size_style_values : '8pt,10pt,12pt,14pt,18pt,24pt,36pt',
		editor_selector : 'bligoo-nb-rich-textarea',
		plugins : 'safari,bligooimages,externalcode,youtube,vimeo,bligoofiles,pagebreak,flash,paste,fileupload',
		invalid_elements : 'script,iframe',
		accessibility_focus : false,
		strict_loading_mode : 1,
		theme : 'advanced',
		mode : 'none',
		language : userLanguage
	};
	commonConfig = $H(commonConfig);
	if (key == 'genericBar'){
		return commonConfig.merge({	width: '600',
			theme_advanced_buttons1 : 'link,|,bold,italic,strikethrough,fontsizeselect,|,justifyleft,justifycenter,justifyright,justifyfull,|,forecolor,bullist,numlist,code',
			theme_advanced_buttons2 : '',
			theme_advanced_buttons3 : ''}).toObject();
	} else if ( key == 'blidgets' ){
		return commonConfig.merge({	width: '360',
			theme_advanced_buttons1 : 'link,|,bold,italic,strikethrough,fontsizeselect,|,bullist,numlist,code',
			theme_advanced_buttons2 : 'justifyleft,justifycenter,justifyright,justifyfull,forecolor'+((mediaEnabled)?',bligooimages,youtube,vimeo,flash,fileupload,externalcode':''),
			theme_advanced_buttons3 : ''}).toObject();
	} else if ( key == 'headerAndFooter' ){
		return commonConfig.merge({	width: '600',
			theme_advanced_buttons1 : 'link,|,bold,italic,strikethrough,fontsizeselect,|,bullist,numlist,code',
			theme_advanced_buttons2 : 'justifyleft,justifycenter,justifyright,justifyfull,forecolor'+((mediaEnabled)?',bligooimages,youtube,vimeo,flash,externalcode':''),
			theme_advanced_buttons3 : '',
			handle_event_callback : 'funcionHeaderFooterOnChange'}).toObject();
	} else if ( key == 'genericWindow' ){
		return commonConfig.merge({	width: '440',
			theme_advanced_buttons1 : 'link,|,bold,italic,strikethrough,fontsizeselect,|,justifyleft,justifycenter,justifyright,justifyfull,|,forecolor,bullist,numlist,code',
			theme_advanced_buttons2 : '',
			theme_advanced_buttons3 : ''}).toObject();
	} else if ( key == 'simple' ){
		return commonConfig.merge({	width: '440',
			theme_advanced_buttons1 : 'link,|,bold,italic,strikethrough',
			theme_advanced_buttons2 : '',
			theme_advanced_toolbar_align: 'left',
			theme_advanced_buttons3 : ''}).toObject();
	} 
}

function processFacebookResponse(){
	var loc = window.location;
	var code = loc.substring(loc.indexOf('code=')+5, loc.indexOf('|'));
	alert(code);
}

function preventTab(e) {
	var field = e.target;
	if (e.keyCode == 9 ||  (isSafari() && e.keyCode == 25)) {
		if (!e.stopPropagation) {
    		e.stopPropagation = function() {this.cancelBubble = true;};
    		e.preventDefault = function() {this.returnValue = false;};
  		}
  		if (!e.stop) {
    		e.stop = function() {
      			this.stopPropagation();
      			this.preventDefault();
    		};
  		}
		e.preventDefault();
		e.stopPropagation();
		e.stop();
  		
		var tab = "    ";
		
		if (document.selection) {
			var temp;
			field.focus();
			sel = document.selection.createRange();
			temp = sel.text.length;
			sel.text = tab;
			if (tab.length == 0) {
				sel.moveStart('character', tab.length);
				sel.moveEnd('character', tab.length);
		    } else {
	    		sel.moveStart('character', -tab.length + temp);
			}
			//sel.select();
		} else if (field.selectionStart || field.selectionStart == '0') {
	    	var startPos = field.selectionStart;
		    var endPos = field.selectionEnd;
		    var scrollTop = field.scrollTop;
	    	field.value = field.value.substring(0, startPos) + tab + field.value.substring(endPos, field.value.length);
	    	field.scrollTop = scrollTop;
		    field.selectionStart = startPos + tab.length;
	    	field.selectionEnd = startPos + tab.length;
	 	} else {
			field.value += tab;
		}
		
	}
}

var Base64 = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);
		return output;
	},

	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
}

var TinyMCEEditArea = Class.create({
	initialize: function(editor, parentNode, editFunction, e, tr) {
		this.editor = editor;
		this.parentNode = parentNode;
		this.tr = tr;
		this.editFunction = editFunction;
		this.left = Event.pointerX(e);
		this.top = Event.pointerY(e);
		this.principalImageHidden = $('content-main-image');
		this.cleanOlderAreas();
		this.drawArea(tr);
	},
	cleanOlderAreas: function(){
		var aux = $$('.editor-object-edit-icon-wrapper');
		if ( aux!= null && aux.lenght > 0 ){
			aux.each(function(item){item.remove();});
		}
	},
	drawArea: function(tr){
		var iframeOffset = Element.cumulativeOffset(this.editor.getWin().frameElement);
		var scrollOffsetN = null;
		if ( isIEAny() ){
			scrollOffsetN = Element.cumulativeScrollOffset(this.editor.getWin().frameElement);
		}else{
			scrollOffsetN = Element.cumulativeScrollOffset(this.parentNode);
		}
		var top = iframeOffset.top + this.top - scrollOffsetN.top - 25;
		var left = iframeOffset.left + this.left - scrollOffsetN.left - 22;
		
		this.floatingArea = Builder.node('div', {'style': 'position: absolute;top:' + top + 'px; left:' + left + 'px;', 'class': 'editor-object-edit-icon-wrapper'});		
		var editButton = Builder.node('div', {'class' : 'editor-object-edit-icon use-editor-toolbar-sprite', 'title': tr.edit});
		var deleteButton = Builder.node('div', {'class': 'editor-object-delete-icon use-editor-toolbar-sprite', 'title': tr.remove});
		if (this.principalImageHidden != null && tr.setmain != null && tr.remmain != null ){
			var imageSrc = this.parentNode.src;
			var aux = imageSrc.substring(imageSrc.lastIndexOf('/')+1);
			if (aux.indexOf('?')>-1){
				aux = aux.substring(0,aux.indexOf('?'));
			}
			if (this.principalImageHidden.value == aux ){
				var principalButton = Builder.node('div', {'class': 'editor-object-setprincipal-icon-used use-editor-toolbar-sprite', 'title': tr.remmain});
			}else{
				var principalButton = Builder.node('div', {'class': 'editor-object-setprincipal-icon-notused use-editor-toolbar-sprite', 'title': tr.setmain});
			}
		}
		this.floatingArea.appendChild(editButton);
		this.floatingArea.appendChild(deleteButton);
		if (this.principalImageHidden != null && principalButton != null){
			this.floatingArea.appendChild(principalButton);
		}
		editButton.observe('click', this.editNode.bindAsEventListener(this));
		deleteButton.observe('click', this.deleteNode.bindAsEventListener(this));
		if (this.principalImageHidden != null && principalButton != null){
			principalButton.observe('click', this.setPrincipalImage.bindAsEventListener(this, principalButton));
		}
		document.body.appendChild(this.floatingArea);
		this.iframe = null;
		if ( this.editor.getWin().frameElement.contentDocument == null ){
			this.iframe = this.editor.getWin().frameElement.contentWindow;
		}else{
			this.iframe = this.editor.getWin().frameElement.contentDocument;
		} 
		Element.observe(this.iframe,'scroll', this.destroy.bind(this));	
	},
	setPrincipalImage: function(event, button){
		var imageSrc = this.parentNode.src;
		var aux = imageSrc.substring(imageSrc.lastIndexOf('/')+1);
		if (aux.indexOf('?')>-1){
			aux = aux.substring(0,aux.indexOf('?'));
		}
		if ( $('content-main-image').value == aux ){
			//desmarcar
			button.addClassName('editor-object-setprincipal-icon-notused');
			button.removeClassName('editor-object-setprincipal-icon-used');
			button.writeAttribute('title', this.tr.setmain);
			$('content-main-image').value = '';
		}else{
			//marcar
			button.removeClassName('editor-object-setprincipal-icon-notused');
			button.addClassName('editor-object-setprincipal-icon-used');
			button.writeAttribute('title', this.tr.remmain);
			$('content-main-image').value = aux;
		}
	},
	editNode: function(event){
		event.cancelBubble = true;
		if (event.stopPropagation){
			event.stopPropagation();
		}
		this.editor.selection.select(this.parentNode);
		this.editFunction();
		//this.editor.execCommand('mceBligooImages');
	},
	deleteNode: function(event){
		event.cancelBubble = true;
		if (event.stopPropagation){
			event.stopPropagation();
		}
		this.editor.dom.remove(this.parentNode);
		this.editor.editorCommands.mceCleanup();
		this.remove();
	},
	destroy: function(){
		if (this.floatingArea != null ){
			this.remove();
			this.editor.editorCommands.mceCleanup();
		}
	},
	remove: function(){
		if (this.floatingArea != null ){
			Element.stopObserving(this.iframe, 'scroll');
			this.floatingArea.remove();
			this.floatingArea = null;
		}
	}
});

function formatTimeAgo(timems){
	var preTxt = '';
	var postTxt = '';
	var seconds = '';
	var secondsSingle = '';
	var minutes = '';
	var minutesSingle = '';
	var hours = '';
	var hoursSingle = '';
	var days = '';
	var daysSingle = '';
	
	if (userLanguage=='en'){
		preTxt = '';
		postTxt = 'ago';
		seconds = 'seconds';
		secondsSingle = 'second';
		minutes = 'minutes';
		minutesSingle = 'minute';
		hours = 'hours';
		hoursSingle = 'hour';
		days = 'days';
		daysSingle = 'day';	
	}else if (userLanguage=='pt'){
		preTxt = '';
		postTxt = 'atras';
		seconds = 'segundo';
		secondsSingle = 'segundo';
		minutes = 'minutos';
		minutesSingle = 'minuto';
		hours = 'horas';
		hoursSingle = 'hora';
		days = 'dias';
		daysSingle = 'dia';
	}else{
		preTxt = ' hace';
		postTxt = '';
		seconds = 'segundos';
		secondsSingle = 'segundo';
		minutes = 'minutos';
		minutesSingle = 'minuto';
		hours = 'horas';
		hoursSingle = 'hora';
		days = 'dias';
		daysSingle = 'd&iacute;a';		
	}
	var d = new Date();
	var dms = d.getTime();
		
	var diff = dms - timems;
	var dateTxt = preTxt;
	if ( diff < (60*1000) ){
		var amount = parseInt(diff/1000);
		dateTxt += ' ' +amount+' '+(amount>1?seconds:secondsSingle);
	}else if ( diff < (1000*60*60) ){
		var amount = parseInt(diff/(1000*60));
		dateTxt += ' ' +amount+' '+(amount>1?minutes:minutesSingle);
	}else if ( diff < (1000*60*60*24)){
		var amount = parseInt(diff/(1000*60*60));
		dateTxt += ' ' +amount+' '+(amount>1?hours:hoursSingle);
	}else{
		var amount = parseInt(diff/(1000*60*60*24));
		dateTxt += ' ' +amount+' '+(amount>1?days:daysSingle);
	}
	dateTxt += ' ' + postTxt;
	return dateTxt;
}
var monthToNumbers = new Array();
monthToNumbers['Jan'] = 0;
monthToNumbers['Feb'] = 1;
monthToNumbers['Mar'] = 2;
monthToNumbers['Apr'] = 3;
monthToNumbers['May'] = 4;
monthToNumbers['Jun'] = 5;
monthToNumbers['Jul'] = 6;
monthToNumbers['Aug'] = 7;
monthToNumbers['Sep'] = 8;
monthToNumbers['Oct'] = 9;
monthToNumbers['Nov'] = 10;
monthToNumbers['Dec'] = 11;
var BligooPluginClass = Class.create({
	initialize: function() {}
});

var PluginManagerClass = Class.create({
	initialize: function() {
		this.plugins = [];
		document.observe("bligoobar:initialized", function(event) {
			this.plugins.each(function(plugin) {
				if (plugin.onBarInit) {
					var f = plugin.onBarInit.bind(plugin);
					f(event);
				}
			});
		}.bind(this));
		
		document.observe("bligoobar:leaf-replaced", function(event){
			this.plugins.each(function(plugin) {
				if (plugin.onBarLeafReplaced) {
					var f = plugin.onBarLeafReplaced.bind(plugin);
					f(event);
				}
			});
		}.bind(this));

		document.observe("page:loaded", function(event){
			this.plugins.each(function(plugin) {
				if (plugin.onPageLoaded) {
					var f = plugin.onPageLoaded.bind(plugin);
					f(event);
				}
			});
		}.bind(this));		
		
		document.observe("dashboard:loaded", function(event){
			this.plugins.each(function(plugin) {
				if (plugin.onDashboardLoaded) {
					var f = plugin.onDashboardLoaded.bind(plugin);
					f(event);
				}
			});
		}.bind(this));	
		
		document.observe("dashboard:page-changed", function(event){
			this.plugins.each(function(plugin) {
				if (plugin.onDashboardPageChanged) {
					var f = plugin.onDashboardPageChanged.bind(plugin);
					f(event);
				}
			});
		}.bind(this));	
		
		document.observe("bligoowindow:content-replaced", function(event) {
			this.plugins.each(function(plugin) {
				if (plugin.onWindowContentReplaced) {
					var f = plugin.onWindowContentReplaced.bind(plugin);
					f(event);
				}
			});
		}.bind(this));	
		
		document.observe("bligoowindow:content-setted", function(event) {
			this.plugins.each(function(plugin) {
				if (plugin.onWindowContentSetted) {
					var f = plugin.onWindowContentSetted.bind(plugin);
					f(event);
				}
			});
		}.bind(this));	
		
		document.observe("bligoo:file-uploaded", function(event) {
			this.plugins.each(function(plugin) {
				if (plugin.onFileUpload) {
					var f = plugin.onFileUpload.bind(plugin);
					f(event);
				}
			});
		}.bind(this));
		
		document.observe("wizard-step:loaded", function(event) {
			this.plugins.each(function(plugin) {
				try {
					if (plugin.onWizardStepLoaded) {
						var f = plugin.onWizardStepLoaded.bind(plugin);
						f(event);
					}
				  } catch(e) { 
					  if (console) {
						  console.log(e);
					  }
				  }
			});
		}.bind(this));
		
	},
	add: function(plugin) {
		this.plugins[this.plugins.length] = plugin;
	},
	init: function() {
		this.plugins.each(function(plugin) {
			if (plugin.init) {
				plugin.init();
			}
		});
	}
});
var PluginManager = new PluginManagerClass();
function closeBligooMessages(){
	Effect.BlindUp('message-container',{ duration: 0.5 });
}

function google_ad_request_done(google_ads) {
	var s = '';
	var i;

	if (google_ads.length == 0) {
		return;
	}

	if (google_ads[0].type == "flash") {
		s += '<a href=\"'
				+ google_info.feedback_url
				+ '\" class=google-ad-feedback>Ads by Google</a><br>'
				+ '<object classid="clsid27CDB6E-AE6D-11cf-96B8-444553540000"'
				+ ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH="'
				+ google_ad.image_width
				+ '" HEIGHT="'
				+ google_ad.image_height
				+ '"> <PARAM NAME="movie" VALUE="'
				+ google_ad.image_url
				+ '">'
				+ '<param name="wmode" value="transparent">'
				+ '<PARAM NAME="quality" VALUE="high">'
				+ '<PARAM NAME="AllowScriptAccess" VALUE="never">'
				+ '<EMBED wmode="transparent" src="'
				+ google_ad.image_url
				+ '" WIDTH="'
				+ google_ad.image_width
				+ '" HEIGHT="'
				+ google_ad.image_height
				+ '" TYPE="application/x-shockwave-flash"'
				+ ' AllowScriptAccess="never" '
				+ ' PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT>';
	} else if (google_ads[0].type == "image") {
		s += '<a href=\"'
				+ google_info.feedback_url
				+ '\" class=google-ad-feedback>Ads by Google</a><br> <a href="'
				+ google_ads[0].url
				+ '" target="_top" title="go to '
				+ google_ads[0].visible_url
				+ '" onmouseout="window.status=\'\'" onmouseover="window.status=\'go to '
				+ google_ads[0].visible_url
				+ '\';return true"><img border="0" src="'
				+ google_ads[0].image_url + '"width="'
				+ google_ads[0].image_width + '"height="'
				+ google_ads[0].image_height + '"></a>';
	} else if (google_ads[0].type == "html") {
		s += '<a href=\"' + google_info.feedback_url
				+ '\" class=google-ad-feedback>Ads by Google</a><br>'
				+ google_ads[0].snippet;
	} else {
		s += '<a href=\"' + google_info.feedback_url + '\" class=google-ad-feedback>Ads by Google</a><ul>'
		for (i = 0; i < google_ads.length; ++i) {
			s += '<li id=google-ad-link-item-'
					+ i
					+ '><a class=google-ad-link href="'
					+ google_ads[i].url
					+ '" onmouseout="window.status=\'\'" onmouseover="window.status=\'ir a '
					+ google_ads[i].visible_url
					+ '\';return true"> <span class=google-ad-line1> '
					+ google_ads[i].line1
					+ '</span></a> <span class=google-ad-line2>'
					+ google_ads[i].line2
					+ ''
					+ google_ads[i].line3
					+ '</span> <a class=google-ad-line3 href="'
					+ google_ads[i].url
					+ '" onmouseout="window.status=\'\'" onmouseover="window.status=\'ir a '
					+ google_ads[i].visible_url + '\';return true"><span>'
					+ google_ads[i].visible_url + '</span></a></li>';
			break;
		}
		s += '</ul>';
	}
	document.write(s);
	return;
}

var SubmitSpinnerButton = Class.create( {
	initialize : function(button) {
		this.button = button;
		button.observe('click', this.click.bindAsEventListener(this));
	},
	click : function() {
		this.button.startWaiting('waiting', 0);
	}
});

var CorePluginClass = Class.create(BligooPluginClass, {
	onWindowContentReplaced : function(event) {
		this.initToggleCheckBoxes();
		var windowId = event.memo.window
				.select('input#bligoo-window-step-id')[0];
		if (windowId != null) {
			_gaq
					.push( [ 'bligooTracker._trackEvent',
							'bligoo-window',
							'open:' + windowId.value ]);
			_gaq.push( [ 'bligooTracker._trackPageview',
					'/window/' + windowId.value ]);
		} else {
			_gaq
					.push( [ 'bligooTracker._trackEvent',
							'bligoo-window',
							'open:' + event.memo.name ]);
		}
	},
	onWindowContentSetted : function(event) {
		var windowId = event.memo.window
				.select('input#bligoo-window-step-id')[0];
		if (windowId != null) {
			_gaq
					.push( [ 'bligooTracker._trackEvent',
							'bligoo-window',
							'open:' + windowId.value ]);
		} else {
			_gaq
					.push( [ 'bligooTracker._trackEvent',
							'bligoo-window',
							'open:' + event.memo.name ]);
		}
	},
	onBarLeafReplaced : function(event) {
		_gaq.push( [ 'bligooTracker._trackEvent', 'bligoo-bar',
				'open:' + event.memo ]);
	},
	onPageLoaded : function(event) {
		$$('.spinner-button').each(function(button) {
			button.observe('click', button.startWaiting());
		});
		var hint = $$('.bligoo-hint').first();
		if (hint != null) {
			new BligooTooltipClass($(hint), hint
					.getAttribute("bligooHintText"), {
				direction : BligooTooltipClass.VERTICAL,
				width : 200
			});
		}

		if ($('close-messages-link') != null) {
			$('close-messages-link').observe('click',
					function(e) {
						closeBligooMessages();
					});
		}

		$$('.spinner-submit').each(function(button) {
			new SubmitSpinnerButton(button);
		});

		if ($('facebook-login')) {
			$('facebook-login')
					.observe(
							'click',
							function(e) {
								window
										.open(
												'https://graph.facebook.com/oauth/authorize?client_id=135961833086048&redirect_uri=http://www.bligoo.com/user/fbcallback&type=user_agent&display=popup&scope=publish_stream,email,user_about_me,user_birthday,user_interests,user_location,user_photos,read_friendlists',
												'facebook coonect',
												'width=400,height=300');
							});
		}
		this.positionAds();
	},
	positionAds : function() {
		if ($('bligoo-ad-upper') && $('bligoo-ad-image-1')) {
			var w1 = $('bligoo-ad-image-1').getWidth();
			var textw = $('bligoo-ad-upper').getWidth();
			if (w1 > 0) {
				textw = ($('bligoo-ad-upper').getWidth()
						- $('bligoo-ad-image-1').getWidth() - 10);
				$('bligoo-ad-text-1')
						.setStyle(
								'margin-left: 10px; width: ' + textw + 'px');
			} else {
				$('bligoo-ad-text-1').addClassName(
						'bligoo-ad-text-full-size');
				if ($('bligoo-ad-text-1').select(
						'#google-ad-link-item-4')[0]) {
					$('bligoo-ad-text-1').select(
							'#google-ad-link-item-4')[0]
							.remove();
				}
				if ($('bligoo-ad-text-1').select(
						'#google-ad-link-item-3')[0]) {
					$('bligoo-ad-text-1').select(
							'#google-ad-link-item-3')[0]
							.remove();
				}
			}
			if (textw > 90) {
				if (textw < 235
						&& $('bligoo-ad-text-1').select(
								'#google-ad-link-item-4')[0]) {
					$('bligoo-ad-text-1').select(
							'#google-ad-link-item-4')[0]
							.remove();
				}
				if (textw < 190
						&& $('bligoo-ad-text-1').select(
								'#google-ad-link-item-3')[0]) {
					$('bligoo-ad-text-1').select(
							'#google-ad-link-item-3')[0]
							.remove();
				}
				if (textw < 135
						&& $('bligoo-ad-text-1').select(
								'#google-ad-link-item-2')[0]) {
					$('bligoo-ad-text-1').select(
							'#google-ad-link-item-2')[0]
							.remove();
				}
			}
			$('bligoo-ad-text-1').setStyle('display: block;');

		}
	},
	initToggleCheckBoxes : function() {
		$$('.toggle-check').each(function(e) {
			if (e.hasClassName('toggle-check-enable')) {
				var id = e.id.substring(13);
				var selector = '#' + id + ' input';
				e.observe('click', function(event) {
					$$(selector).each(function(check) {
						check.checked = true;
					});
				});
			} else if (e.hasClassName('toggle-check-disable')) {
				var id = e.id.substring(16);
				var selector = '#' + id + ' input';
				e.observe('click', function(event) {
					$$(selector).each(function(check) {
						check.checked = false;
					});
				});
			}
		});
	},
	onWizardStepLoaded: function(event) {
		if ($('close-messages-link') != null) {
			$('close-messages-link').observe('click', closeBligooMessages.bindAsEventListener(this));
		}
	}
});

PluginManager.add(new CorePluginClass());


var windowsZIndex = 200;

var BligooWindow = Class.create({
	initialize: function(name, config) {
			if (isIE6()) {
				this.selects = new Array();
				var i = 0;
				$$('select').each(function(select) {
					if (select.visible()) {
						this.selects[i] = select;
						i++;
						select.hide();
					}
				}.bind(this));
			}
			this.zIndex = windowsZIndex;
			windowsZIndex += 2;
			this.name = name;
			this.updateConfig(config);
			this.createWindow(name);
			this.setSize(config.width, config.height);
			this.callFirst();
			
			if (isIE6()) {
				Event.observe(window, 'scroll', this.updatePosition.bindAsEventListener(this));
			}
	}, 
	updateConfig: function(config) {
			this.config = config;
			this.width = config.width;
			this.height = config.height;
			this.encType = config.encType;
			this.target = config.target;
			this.action = config.action;
			this.showLogo = config.showLogo;
			this.help = config.help;
			this.cancelMessage = config.cancelMessage;
			if ( this.config.parameters != null ){
				this.extraParameters = this.config.parameters;
			}
	}, 
	createWindow: function(name) {
			var win = '<div class="bligoo-fixed-element glass-layer" id="glass-layer-' + this.name + '"></div>'
				+ '<div class="bligoo-fixed-element bligoo-window-wrapper" id="bligoo-window-wrapper-' + this.name + '">'
				+ '<div class="bligoo-window" id="bligoo-window-' + this.name + '" style="-moz-border-radius: 8px; -webkit-border-radius: 8px;">'
				+ '<form id="bligoo-window-form-' + this.name + '"' 
					+ (this.encType != null? ' enctype="' + this.encType + '"': '') 
					+ (this.target != null? ' target="' + this.target + '"': '') 
					+ (this.action != null? ' action="' + this.action + '" method="post"': '') 
					+'>'
				+ '<div class="bligoo-window-content" id="bligoo-window-content-' + this.name + '"></div>'
				+ '</form>'
				+ '</div>';
				
			if ($('bligoo-wrapper') != null) {
				$('bligoo-wrapper').insert(win);
			} else {
				$(document.body).insert(win);
			}
			this.content = $('bligoo-window-content-' + this.name);
			this.window = $('bligoo-window-' + this.name);
			this.form = $('bligoo-window-form-' + this.name);
			this.glass = $('glass-layer-' + this.name);
			this.wrapper = $('bligoo-window-wrapper-' + this.name);
			
			this.glass.setStyle({zIndex: this.zIndex});
			this.wrapper.setStyle({zIndex: 	this.zIndex + 1});
			this.setSpinner();
	},
	callFirst: function(){
			if ( this.config.module && this.config.first ){
				var params = $H({method: 'bligooWindow', module: this.config.module, next: this.config.first});
				if (this.config.parameters != null) { 
					var cparams = $H(this.config.parameters);
					params = params.merge(cparams);
				}
				this.lastParams = params;
				new Ajax.Request('/bligoo/ajaxproxy', {
								parameters: params
								, onSuccess: this.process.bind(this)
								, onFailure: function(transport) {
									alert('Ha ocurrido un error. Por favor intente mas tarde');
								}
							});
			}
	},
	submit: function() {
		if (this.form != null) {
			this.form.submit();
		}
	},
	setSpinner: function() {
		this.setContent('<div class="bligoo-window-spinner" id="bligoo-window-spinner-' + this.name + '"></div>');
		var spinner = $('bligoo-window-spinner-' + this.name);
		if (spinner != null) {
			var height = this.height ? this.height : this.window.getHeight();
			spinner.setStyle({width: this.width + 'px', height: height + 'px'});
		}
	},
	process: function(transport) {
		if (transport.responseText.indexOf('jump-to') > -1) {
			document.location.href= transport.responseText.substring(8);
			return;
		}
	
	    if(this.config.skipScripts){
	    	this.content.innerHTML = transport.responseText;
	    } else {
			this.content.update(transport.responseText);
		}
		
		this.content.select('input.get-focus').each(function(input) {
			input.focus();
		});
		this.content.fire("bligoowindow:content-replaced", this);
		this.enableEditors();
		new SubmitStopperClass('bligoo-window-form-' + this.name);
		if (this.windowConfig('redirect')) {
			document.location.href = this.windowConfig('redirect').value;
		}
		if (this.windowConfig('final')) {
			this.close();
			if (this.config.finalFunction != null) {
				this.config.finalFunction();
				return;
			}
		}
		
		this.buttons = $$('#bligoo-window-content-' + this.name+' div.bligoo-window-buttons').first();
		this.toolbar = $$('#bligoo-window-content-' + this.name+' div.bligoo-window-buttons div.bligoo-window-buttons-toolbar').first();
		var button = $$('#' + this.content.id + ' .bligoo-button-next').first();
		var skipLinks = $$('#' + this.content.id + ' .bligoo-window-skip-link');
		this.next = $$('#' + this.content.id + ' .bligoo-window-config-next').first();
		this.module = $$('#' + this.content.id + ' .bligoo-window-config-module').first();
		var buttonBack = $$('#' + this.content.id + ' .bligoo-button-back').first();
		var backStep = $$('#' + this.content.id + ' .bligoo-window-config-back').first();
		var backModule = $$('#' + this.content.id + ' .bligoo-window-config-back-module').first();
		var customNextButtos = this.content.select('.bligoo-custom-button-next');
		
		var close = $$('#' + this.content.id + ' .bligoo-button-close').first();
		if (close) {
			close.observe('click', this.closeWrapper.bind(this));
		}
		
		
		if (skipLinks != null && skipLinks.length > 0) {
			if (this.next && this.module) {
				var click = this.callNext.bind(this, this.next.value, this.module.value);
				skipLinks.each(function(link) {
						link.observe('click', click);
					}.bind(this));
			} else {
				var click = this.callFunction.bind(this);
				skipLinks.each(function(link) {
						link.observe('click', click);
					}.bind(this));
			}
		}
		
		if (button) {
			button.stopObserving('click');
			if (this.next && this.module) {
				button.onclick = this.callNext.bind(this, this.next.value, this.module.value);
			} else {
				button.onclick = this.callFunction.bind(this);
			}
		}
		
		customNextButtos.each(function (button){
			var cusNext = button.getAttribute('data-next');
			var cusModule = button.getAttribute('data-module');
			if ( cusModule != null && cusModule != '' ){
				button.observe('click', this.callNext.bind(this, cusNext, cusModule));
			}else{
				button.observe('click', this.callFunction.bind(this));
			}
		}.bind(this));
		
		
		if (buttonBack && backStep && backModule) {
		    buttonBack.stopObserving('click');
		    buttonBack.show();
			buttonBack.observe('click', this.callNext.bind(this, backStep.value, backModule.value));
		}
		
		var upper = $$('#' + this.content.id + ' .bligoo-window-upper').first();
		
		if (upper) {
			upper.setStyle({ height: (this.height - this.getDelta()) + 'px'});
		}
		if(this.config.onComplete){
			this.config.onComplete();
		}
		var height = this.windowConfig('height');
		if (height && parseInt(height.value) > 0) {
			this.setSize(this.width, height.value);
		}
		
		if (this.windowConfig('listen-oauth')){
			document.stopObserving('bligoo-oauth:reload-ok');
			document.stopObserving('bligoo-oauth:reload-fail');
			document.observe('bligoo-oauth:reload-ok', this.reload.bindAsEventListener(this));
			document.observe('bligoo-oauth:reload-fail', this.oauthFail.bindAsEventListener(this));
		}
	},
	reload: function(event) {
		this.triggerEditorsSave();
		this.disableEditors();
		this.setSpinner();
		new Ajax.Request('/bligoo/ajaxproxy', {
				parameters: this.lastParams
				, onSuccess: this.process.bind(this)
				, onFailure: function(transport) {
					alert('Ha ocurrido un error. Por favor intente mas tarde');
				}
		});
	},
	oauthFail: function(event) {	
		alert(' :( ');
	},
	setTitle: function(title) {
		var header = Builder.node('div', {'class': 'bligoo-window-header'});
		header.appendChild(Builder.node('div', {'class': 'bligoo-window-header-title'}, title));
		var help = Builder.node('div', {'class': 'use-editor-toolbar-sprite form-item-help'}, this.help);
		var wrapper = Builder.node('div', {'class': 'form-item-help-wrapper'}, help);
		var helpWrapper = new Element('div').addClassName('bligoo-window-header-help ');
		helpWrapper.appendChild(wrapper);
		help.hide();
		header.appendChild(helpWrapper);
		if (this.showLogo) {
			header.appendChild(Builder.node('div', {'class': 'bligoo-window-header-logo'}));
		}
		$(this.content).insert({top: header});
		this.header = header;
	},
	setHelp: function(help, width) {
		var wrapper = this.header.select('.form-item-help-wrapper .form-item-help').first();
		if (wrapper) {
			if (width == ''){
				width = 100;
			}
			new BligooTooltipClass(wrapper, help, {
				width: width
				, direction: BligooTooltipClass.VERTICAL
				, type: 'tooltip'
			});
			wrapper.show();
		}
	},
	closeWrapper: function() {
		if (this.cancelMessage) {
			if (!confirm(this.cancelMessage)) {
				return;
			}
		}
		this.close();
	},
	getDelta: function() {
		if ( this.extraParameters != null ){
			if ( this.extraParameters.delta != null ) {
				return parseInt(this.extraParameters.delta);
			}
		}
        return 70;
	},
	goNext: function(){
		if (this.next && this.module) {
			this.callNext(this.next.value, this.module.value);
		}
	},
	windowConfig: function (key) {
		return $$('#' + this.content.id + ' .bligoo-window-config-' + key).first();
	},
	callFunction: function() {
		if (this.config.endFunction != null ) {
			this.triggerEditorsSave();
			this.disableEditors();
			this.config.endFunction();
		}
	}, 
	callNext: function(next, module) {
		this.triggerEditorsSave();
		this.disableEditors();
		var params = $H(this.form.serialize(true));
        params = params.merge($H({method: 'bligooWindow', module: module, next: next}));
        this.lastParams = params;
		this.setSpinner();
		new Ajax.Request('/bligoo/ajaxproxy', {
							parameters: params
							, onSuccess: this.process.bind(this)
							, onFailure: function(transport) {
								alert('Ha ocurrido un error. Por favor intente mas tarde');
							}
						});
	},
	enableEditors: function(){
		var tmces = $$('#' + this.content.id + ' .rich-text-area');
		for ( var i =0; i<tmces.length ; i++ ){
			tinymce.dom.Event.domLoaded = true;
			if (tmces[i].hasClassName('window-rich-text-area') ){
				if(tmces[i].getAttribute('editor-bar-type') != null && tmces[i].getAttribute('editor-bar-type') != '') {
					tinyMCE.settings = getTinyMCEConfig(tmces[i].getAttribute('editor-bar-type'));
				} else {				
					tinyMCE.settings = getTinyMCEConfig('genericWindow');
				}
				if(tmces[i].getAttribute('editor-width') != null && tmces[i].getAttribute('editor-width') != '') {
					tinyMCE.settings.width = tmces[i].getAttribute('editor-width');
				}
				if(tmces[i].getAttribute('editor-height') != null && tmces[i].getAttribute('editor-height') != '') {
					tinyMCE.settings.height = tmces[i].getAttribute('editor-height');
				}
			}else{
				tinyMCE.settings = getTinyMCEConfig('blidgets');
			}
			tinyMCE.execCommand('mceAddControl',false, tmces[i].id);
		}
	},
	disableEditors: function(){
		var tmces = $$('#' + this.content.id + ' .rich-text-area');
		for ( var i =0; i<tmces.length ; i++ ){
			if ( tinyMCE.get(tmces[i].id) != null ){
				tinyMCE.execCommand('mceRemoveControl',false,tmces[i].id);
			}
		}
	},
	triggerEditorsSave: function(){
		var tinymceEditor = $$('#' + this.content.id + ' .rich-text-area');
		if ( tinymceEditor.length > 0 ){
			tinyMCE.triggerSave(true,true);
		}
	},
	setSize: function(width, height) {
			this.width = width;
			this.height = parseInt(height);
			if (this.height > document.viewport.getHeight()) {
				this.height = document.viewport.getHeight() - this.getDelta();
			}
			/*
			this.glass.setStyle({
									top: 0  + 'px'
									, left: 0 + 'px'
									, position: 'fixed'
									, width: '100%'
									, height: '100%'
									, background: '#FFFFFF'
									, opacity: 0.8
									, zIndex: this.zIndex
								});
			*/
			this.glass.setStyle({
				top: 0  + 'px'
				, left: 0 + 'px'
				, position: 'fixed'
				, width: '100%'
				, height: '100%'
				, background: '#000000'
				, opacity: 0.2
				, zIndex: this.zIndex
			});
			var errorsHeight = 0;
			this.wrapper.select('#errors').each(function(div) {
				errorsHeight += div.getHeight();
			});
					
			var wrapperHeight = this.height + this.getDelta() + errorsHeight;
			
			var top =  wrapperHeight > document.viewport.getHeight() ? 
									document.viewport.getHeight() - wrapperHeight - 25 : 
									(document.viewport.getHeight() - wrapperHeight) / 2;
									
			var left = (document.viewport.getWidth() - width) / 2;
			this.wrapper.setStyle({
										width: 		'100%'
										, height: 	wrapperHeight + 'px'
										, top: 		top + 'px'
										, left: 	'0px'
										, position:	'fixed'
										, zIndex: 	this.zIndex + 1
			});
			this.window.setStyle({
									width: 		width + 'px'
									//, height:		'100%'
									, height:		'auto'
									, margin:		'auto'
			});
			
			new Effect.Morph(this.window, {'style': 'width: ' + width + 'px;',duration: 0.1, transition: Effect.Transitions.sinoidal} );
			var upper = $$('#' + this.content.id + ' .bligoo-window-upper').first();
			if (upper) {
				if ( upper.getAttribute('data-header-enabled') == 'true' ){
					upper.setStyle({ height: (this.height - this.getDelta()) + 'px'});
				} else {
					upper.setStyle({ height: (this.height) + 'px'});
				}
			}
			//this.content.setStyle({ height: (this.height - 5) + 'px'});
			this.content.setStyle({ height: 'auto'});
			if (isIE6()) {
				this.updatePosition();
			}
	},
	setContent: function(content) {
		this.content.update(content);
		this.content.fire("bligoowindow:content-setted", this);
	},
	addButton: function(name, value, type) {
		if(isIE6()){
			this.content.select('select').each(function(select) {
				select.show();
			});
		}
		if (!this.buttons) {
			this.buttons = Builder.node('div', {'id': 'input-window-buttons', 'class': 'bligoo-window-buttons clearfix'});
			this.content.appendChild(this.buttons);
		}
		this.buttons.insert('<div class="form-item"><input class="bligoo-window-button ' + (type ? 'bligoo-window-button-' + type: '') + ' form-button" id="bligoo-window-button-' + this.name + '-' + name + '" type="button" value="' + value + '"></div>');
		return $('bligoo-window-button-' + this.name + '-' + name);
	},
	toggleButtons: function() {
		this.buttons.toggle();
	},
	hideButtons: function() {
		this.buttons.hide();
	},
	showButtons: function() {
		this.buttons.show();
	},
	close: function() {
		this.disableEditors();
		if (this.config.onClose) {
			this.config.onClose();
		}
		//if (isIE6()) {
		//	this.showSelects();
		//}
		this.destroy();
		// this.glass.hide();
		// this.wrapper.hide();
	},
	show: function() {
		// if (isIE6()) {
		// 	this.hideSelects();
		// }
		this.wrapper.show();
		this.glass.show();
	},
	hideSelects: function() {
		$$('div#bligoo-panel-wrapper select').each(function(select) { this.toggleSelect(select); }.bind(this));
		$$('table#main select').each(function(select) { this.toggleSelect(select); }.bind(this));
	}, 
	toggleSelect: function(select) {
		if (select.visible()) {
			select.addClassName('hidden-select');
			select.hide();
		} else {
			select.removeClassName('hidden-select');
			select.show();
		}
	},
	showSelects: function() {
		$$('select.select').each(function(select) { this.toggleSelect(select); }.bind(this));
	}, 
	destroy: function() {
		if (this.wrapper && this.wrapper.parentNode) {
			this.wrapper.remove();
		}
		if (this.glass && this.glass.parentNode) {
			this.glass.remove();
		}
		if(isIE6()){
			this.selects.each(function(select) {
				select.show();
			}.bind(this));
		}
	},
	getFormContent: function () {
		return this.form.serialize();
	},
	getForm: function() {
		return this.form;
	},
	updatePosition: function(event) {
		var offsets =  document.viewport.getScrollOffsets();
		this.glass.absolutize();
	    this.glass.setStyle({top: offsets[1] + 'px'
	    					, left: offsets[0] + 'px'
	    					, width: document.viewport.getWidth() + 'px'
	    					, height: document.viewport.getHeight() + 'px'});
	 	this.wrapper.absolutize();
	    var height = this.wrapper.getHeight();
	    var top =  height > document.viewport.getHeight() ?
	                   offsets[1] + document.viewport.getHeight() - height - 25 :
	                   offsets[1] + (document.viewport.getHeight() - height) / 2;
	    this.wrapper.setStyle({top:  top + 'px', left: offsets[0] + 'px', width: '100%', height: '100%'});
	    
	},
	getToolbarArea: function(){
		return this.toolbar;
	},
	addToolbarButton: function(name, value) {
		this.toolbar.insert('<div class="form-item"><input class="bligoo-window-button form-button" id="bligoo-window-button-' + this.name + '-' + name + '" type="button" value="' + value + '"></div>');
		return $('bligoo-window-button-' + this.name + '-' + name);
	},
	addToolbarItem: function(item){
		this.toolbar.insert('<div class="form-item">'+item+'</div>');
	},
	getContent: function(){
		return this.content;
	},
	getFrame: function() {
		return this.window;
	}
});

BligooWindow.BUTTON_TYPE_CANCEL = 'cancel';
BligooWindow.BUTTON_TYPE_CLOSE = 'close';
BligooWindow.BUTTON_TYPE_OK = 'ok';

var BligooWindowLink = Class.create({
	initialize: function(button) {
		this.button = button;
		this.parameters = {
            first: button.getAttribute('data-method')
            , module: button.getAttribute('data-module')
		};
		this.name = this.button.getAttribute('data-name');
		var width = parseInt(button.getAttribute('data-width'));
		var height = parseInt(button.getAttribute('data-height'));
		if (width > 0) {
            this.parameters.width = width;
		}
		if (height > 0) {
		        this.parameters.height = height;
		}
		
		if ( button.getAttribute('data-parameters') != null ){
			this.parameters.parameters = button.getAttribute('data-parameters').evalJSON();
		}
		
		if ( button.getAttribute('bligooFormTarget') != null ){
			this.parameters.target = button.getAttribute('bligooFormTarget');
		}
		if ( button.getAttribute('bligooEncType') != null ){
			this.parameters.encType = button.getAttribute('bligooEncType');
		}
		if ( button.getAttribute('bligooFormAction') != null ){
			this.parameters.action = button.getAttribute('bligooFormAction');
		}
		
		if ( button.getAttribute('data-end-function') != null ) {
			this.parameters.endFunction = eval(button.getAttribute('data-end-function') + '.bind(this)');
		}
		if ( button.getAttribute('data-final-function') != null ) {
			this.parameters.finalFunction = eval(button.getAttribute('data-final-function') + '.bind(this)');
		}
		
		
		button.observe('click', this.click.bindAsEventListener(this));
	}, 
	click: function(event) {
		this.window = new BligooWindow(this.name, this.parameters);
		this.window.show();
		BligooWindowLink.lastWindow = this.window;
	}
});

BligooWindowLink.lastWindow = null;

var BligooInputWindow = Class.create({
	initialize: function(name, params){
		this.window = new BligooWindow(name, { width: params.width, height: params.height });
		
		
		this.windowContent = this.window.getContent();

        var header = Builder.node('div', {'class': 'bligoo-window-header'});
        header.appendChild(Builder.node('div', {'class': 'bligoo-window-header-title'}, params.title));
        header.appendChild(Builder.node('div', {'class': 'bligoo-window-header-logo'}));
        
        var div = Builder.node('div', {'id': 'input-window-content'});
        div.appendChild(header);
        
        var content = Builder.node('div', {'class': 'bligoo-window-upper'}, params.message);
        
		
		
		this.onOkClick = params.onOkClick;
		this.input = Builder.node('input', {'id': 'data-input', 'name': 'data-input', 'type': 'text'});
		this.input.stopObserving('keydown');
		this.input.setStyle({'width': '97%'});
		this.input.observe('keydown', this.testEnter.bindAsEventListener(this));
		content.appendChild(this.input);
		if (params.defaultInputVal != null ){
			this.input.value = params.defaultInputVal;
		}
		div.appendChild(content);
		var saveAsButton = Builder.node('input', {'value': params.okLabel, 'type': 'button', 'class': 'form-button'});
		var cancelButton = Builder.node('input', {'value': params.cancelLabel, 'type': 'button', 'class': 'form-button'});
		
		saveAsButton.observe('click', params.onOkClick);
		cancelButton.observe('click', params.onCancelClick); 
		
		var buttonsDiv = Builder.node('div', {'id': 'input-window-buttons', 'class': 'bligoo-window-buttons clearfix'});
		
		buttonsDiv.appendChild(Builder.node('div', {'class': 'form-item'}, cancelButton));
		buttonsDiv.appendChild(Builder.node('div', {'class': 'form-item'}, saveAsButton));
		div.appendChild(buttonsDiv);
		this.windowContent.update(div);
	},
	testEnter: function(event) {
		if (event.keyCode == 13) { 
			this.onOkClick(); 
			event.stop();
		}
	},
	getValue: function(){
 		return this.input.value;
 	},
 	destroy: function() {
 		this.input = null;
 		if (this.window != null) {
	 		this.window.destroy();
	 	}
	 	this.window = null;
 	}
});
var BligooTooltipClass = Class.create();

BligooTooltipClass.VERTICAL = 'vertical';
BligooTooltipClass.HORIZONTAL = 'horizontal';
BligooTooltipClass.FLOAT = 'float';

BligooTooltipClass.prototype = {
	initialize: function(element, content, params) {
		this.element = element;
		this.direction = params.direction ? params.direction : BligooTooltipClass.VERTICAL;
		this.type = params.type;
	
		var width = isNaN(params.width) ?120: params.width;
		
		this.tooltip = new Element('div').addClassName('bligoo-tooltip');
		this.tooltip.setStyle('width: '+width+'px;');

		this.body = new Element('div').addClassName('bligoo-tooltip-body');
		this.body.update(content);
		this.tooltip.appendChild(this.body);
		
		this.tip = new Element('div').addClassName('bligoo-tooltip-tip').addClassName('bligoo-tooltip-tip-' + this.direction);
		this.tooltip.appendChild(this.tip);
		if ( this.direction == BligooTooltipClass.FLOAT){
			this.observingMove = false;
		}
		if (this.type == 'tooltip') {
			this.element.observe('mouseover', this.mouseOver.bindAsEventListener(this));
			this.element.observe('mouseout', this.mouseOut.bindAsEventListener(this));
			this.element.observe('mousemove', this.mouseMove.bindAsEventListener(this));
			this.tooltip.hide();
		} else { 
			this.element.observe('click', this.closeHint.bindAsEventListener(this));
		}
		element.insert({after: this.tooltip});
		this.calculatePositions();
	},
	mouseMove: function(event){
		if ( this.observingMove == true ){
			mouseX = Event.pointerX(event);
			mouseY = Event.pointerY(event);
			mouseX = mouseX + 5;
			this.tooltip.setStyle({'top': mouseY+'px','left': mouseX+'px'});
		}
	},
	mouseOut: function(event) {
		if ( this.direction == BligooTooltipClass.FLOAT ){
			this.observingMove = false;
		}
		this.tooltip.hide();
	},
	mouseOver: function(event) {
		if ( this.direction == BligooTooltipClass.FLOAT ){
			this.observingMove = true;
		}
		this.tooltip.show();
	},
	calculatePositions: function(){
		var element = this.element;
		while (element.getWidth() < 1) {
			element = element.up();
		}
		var offset = element.positionedOffset();
		var left = 0;
		var top = 0;
		var bgleft = 0;
		var bgtop = 0;
		switch (this.direction) {
			case BligooTooltipClass.VERTICAL: 
				left = offset.left + (element.getWidth() / 2) - (this.tooltip.getWidth() / 2);	
				top = offset.top - this.tooltip.getHeight() - this.tip.getHeight() - 7;
				bgleft = (this.tooltip.getWidth() / 2) - 5;
				break;
			case BligooTooltipClass.LEFT: 
				left = offset.left + element.getWidth() + this.tip.getWidth();	
				top = offset.top + (element.getHeight() / 2) - (this.tooltip.getHeight() / 2);
				bgtop = (this.tooltip.getHeight() / 2) - 5;
				break;
			case BligooTooltipClass.FLOAT:
				left = offset.left + element.getWidth() + this.tip.getWidth();	
				top = offset.top + (element.getHeight() / 2) - (this.tooltip.getHeight() / 2);
				bgtop = (this.tooltip.getHeight() / 2) - 5;
				break;
		}
		this.tooltip.setStyle({'left' : left + 'px', 'top': top + 'px'});
		this.tip.setStyle({'backgroundPosition': bgleft + 'px ' + bgtop + 'px'});
	},
	closeHint: function(e){
		if ( this.element.hasClassName('notify-close-hint')){
			new Ajax.Request('/bligoo/ajaxproxy', {method: 'notifyHintClose',	parameters: {key: this.element.getAttribute("bligooHintKey")}});
		}
		this.tooltip.remove();
	}
}


var BligooTooltipPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		$$('.has-bligoo-tooltip').each(function(item){
			new BligooTooltipClass(item, item.getAttribute('data-bligoo-tooltip-text'), {
					width: item.getAttribute('data-bligoo-tooltip-width')
					, direction: item.getAttribute('data-bligoo-tooltip-direction')
					, type: 'tooltip'
				});
		});
		$$('.form-item-help').each(function(item){
			new BligooTooltipClass(item, item.getAttribute('data-bligoo-tooltip-text'), {
					width: item.getAttribute('data-bligoo-tooltip-width')
					, direction: item.getAttribute('data-bligoo-tooltip-direction')
					, type: 'tooltip'
				});
		});
	},
	onDashboardLoaded: function(event){
		$$('.has-bligoo-tooltip').each(function(item){
			new BligooTooltipClass(item, item.getAttribute('data-bligoo-tooltip-text'), {
					width: item.getAttribute('data-bligoo-tooltip-width')
					, direction: item.getAttribute('data-bligoo-tooltip-direction')
					, type: 'tooltip'
				});
		});
		$$('.form-item-help').each(function(item){
			new BligooTooltipClass(item, item.getAttribute('data-bligoo-tooltip-text'), {
					width: item.getAttribute('data-bligoo-tooltip-width')
					, direction: item.getAttribute('data-bligoo-tooltip-direction')
					, type: 'tooltip'
				});
		});
	},
	onWindowContentReplaced: function(event) {
		event.memo.window.select('.form-item-help').each(function(item) {
		 	new BligooTooltipClass(item, item.getAttribute('data-bligoo-tooltip-text'), {
				width: item.getAttribute('data-bligoo-tooltip-width')
				, direction: item.getAttribute('data-bligoo-tooltip-direction')
				, type: 'tooltip'
			});
		});
	}
});
PluginManager.add(new BligooTooltipPluginClass());var BlocksPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		initMetaBlockTabs('');
		$$('.bligoo-block-placeholder').each(function(item) {
			var configId;
			item.classNames().each(function(classname){
				if ( classname.indexOf('bligoo-block-id-') > -1 ){
					configId = classname.split('-')[3];
				}
			});
			if ( configId ) {
				var loc = document.location.href;
				loc = loc.substring(loc.indexOf('//') + 2, loc.length);
				loc = loc.substring(loc.indexOf('/') + 1, loc.length);
				var path = '';
				if  (loc.length > 0) {
					path = loc;
				}
					
				new Ajax.Request('/bligoo/ajaxproxy', {	
					method: 'getBligooBlock'
					, parameters: {configId: configId, path: path}
					, onComplete: function (transport){
						var placeholder = $('bligoo-placeholder-id-' + configId);
						placeholder.update(transport.responseText);
						new BligooBlock(placeholder.descendants().first());
					}
				});
			}
		});
		$$('.bligoo-block-pager').each(function(block) {
			new BligooBlock(block);
		});
	}
});
 
PluginManager.add(new BlocksPluginClass());

function initMetaBlockTabs(container) {
	$$(container + ' .meta-block-tab').each(function(tab){
		new HoverClass(tab, 'mouse-over');
    	var index = parseInt(tab.id.split('-')[3]);
        tab.observe('click', function(event) {
	        var wrapper = tab.ancestors()[3];
	        wrapper.setStyle('height: ' + wrapper.getHeight() + 'px;');
	        wrapper.startWaiting('waiting', 0);
	        var configId = wrapper.id.split('-')[4];
	        if ( configId ){
	        	wrapper.update('<div class="clear"></div><div class="meta-block-spinner"></div>');
	        	new Ajax.Request('/bligoo/ajaxproxy',
	            	{
	                	method: 'getBligooBlock'
	                    , parameters: {configId: configId, index: index}
	                    , onComplete: function (transport){
	                    	wrapper.update(transport.responseText);
	                  		wrapper.stopWaiting();
	                    	wrapper.fire("bligooBox:reloaded");
					        wrapper.setStyle('height: auto;');	           
					        var block = wrapper.descendants().first();
					        block.fire("bligooblock:content-replaced", block);
	                        new BligooBlock(block);
	                        initMetaBlockTabs('#' + wrapper.id);
						}
					});
			}
		});
	});
}


var BligooBlock = Class.create( {
	initialize: function(element) {
		this.page = 1;
		this.element = element;
		this.initPager();
		this.hideButtons();
		this.startObservers();
		this.element.observe('mouseover', this.showPager.bindAsEventListener(this));
	},
	initPager: function() {
				this.index = 0;
                this.configId = this.element.id.split('-')[2];
                this.buttonUp = $$('#' + this.element.id + ' .bligoo-pager-up').first();
                this.buttonDown = $$('#' + this.element.id + ' .bligoo-pager-down').first();
                this.buttonUpDisabled = $$('#' + this.element.id + ' .bligoo-pager-up-disabled').first();
                this.buttonDownDisabled = $$('#' + this.element.id + ' .bligoo-pager-down-disabled').first();
                this.upHandler = this.moveUp.bind(this);
                this.downHandler = this.moveDown.bind(this);
                this.content = $$('#' + this.element.id + ' div.bligoo-block-page').first();
                var tab = $$('#' + this.element.id + ' div.meta-block-tab-selected').first();
				if (tab != null) {
					this.index = parseInt(tab.id.split('-')[3]);
				}

                this.page2 = $$('div#' + this.element.id + ' div.bligoo-block-page-2').first();
                this.page2.classNames().each(function (name) {
                        if (name.indexOf('bligoo-block-page-count') > -1) {
                                this.pageCount2 = parseInt(name.split('-')[4]);
                        }
                }.bind(this));
                this.content.classNames().each(function(name) {
                                if (name.indexOf('bligoo-block-page-count') > -1) {
                                        this.pageCount = parseInt(name.split('-')[4]);
                                } else if (name.indexOf('bligoo-block-page-total') > -1) {
                                        this.itemsPerPage = parseInt(name.split('-')[4]);
                                }
                        }.bind(this));
                this.pages = {};
                this.pages[1] = this.content.innerHTML;
                if (this.pageCount2 > 0) {
	                this.pages[2] = this.page2.innerHTML;
	            }
                this.pagesLength = {};
                this.pagesLength[1] = this.pageCount;
                this.pagesLength[2] = this.pageCount2;
                this.donePaging = this.pageCount2 < this.itemsPerPage;
	},
	startObservers: function() {
		if (this.page > 1) {
			this.buttonUp.observe('click', this.upHandler);
			this.buttonUp.show();
			this.buttonUpDisabled.hide();	
		}
		if (this.pages[this.page + 1] != null) {
			this.buttonDown.observe('click', this.downHandler);
			this.buttonDown.show();
	        this.buttonDownDisabled.hide();
		}
		if(this.buttonUp.visible() || this.buttonDown.visible()){
			if(!this.buttonUp.visible()){
				this.buttonUpDisabled.show();
			}
			if(!this.buttonDown.visible()){
				this.buttonDownDisabled.show();
			}
		}
	}, 
	hidePager: function (event) {
		this.element.select('.bligoo-block-updown-pager').each(function (pager) { Effect.Fade(pager, { duration: 0.1 }); });
	},
	showPager: function (event) {
		this.element.select('.bligoo-block-updown-pager').each(function (pager) { Effect.Appear(pager, { duration: 0.1 }); });
		if (this.periodical) {
				this.periodical.stop();
		}
		this.periodical = new PeriodicalExecuter(this.hidePager.bind(this), 5);
	},
	stopObservers: function() {
		this.buttonUp.stopObserving('click', this.upHandler);
		this.buttonDown.stopObserving('click', this.downHandler);
		this.buttonUpDisabled.show();
        this.buttonDownDisabled.show();
		this.buttonUp.hide();
		this.buttonDown.hide();
	},
	hideButtons: function() {
		this.buttonUpDisabled.hide();
        this.buttonDownDisabled.hide();
		this.buttonUp.hide();
		this.buttonDown.hide();
	},
	moveUp: function() {
		this.stopObservers();		
		this.page--;
		this.updatePage();
		this.startObservers();
	},
	updatePage: function() {
		new Effect.Opacity(this.content.id, { from: 1, to: 0, duration: 0.1, afterFinish: function() {
				this.content.update(this.pages[this.page]);
				this.content.fire("bligooBox:reloaded");
				new Effect.Opacity(this.content.id, { from: 0, to: 1, duration: 0.1 });
			}.bind(this) 
		});
	},
	moveDown: function() {
		this.stopObservers();		
		this.page++;
		this.updatePage();
		
		if (!this.donePaging) {
			this.getNextPage();
		} else {
			this.startObservers();
		}
	},
	getNextPage: function() {
		new Ajax.Request('/bligoo/ajaxproxy', {
			method: 'getBligooBlock'
			, parameters: {configId: this.configId, ajaxPage: this.page + 1, index: this.index}
			, onComplete: this.onNextPageComplete.bind(this)
		});
	},
	onNextPageComplete: function(transport) {
		this.page2.update(transport.responseText);
		var page = this.page2.descendants().first();
		if (page != null) {
			 var count = 0;
			 page.classNames().each(function (name) {
                        if (name.indexOf('bligoo-block-page-count') > -1) {
                               count = parseInt(name.split('-')[4]);
                        }
            });
            if (count > 0) {
             	this.pages[this.page + 1] = page.innerHTML;
            }
         	if (count < this.itemsPerPage) {
         		this.donePaging = false;
         	}
		}
		this.startObservers();
	}
});
var FloatingObject = Class.create({
	initialize: function(element) {
            this.element = element;
            this.queue = 'floating-object-' + this.element.id;
            if (this.element.hasClassName('float-far')) {
                    this.factor = 8;
                    this.offset = 60;
            } else if (this.element.hasClassName('float-medium')) {
                    this.factor = 4;
                    this.offset = 30;
            } else {
                    this.factor = 2;
                    this.offset = 10;
            }
            if (this.element.hasClassName('float-left')) {
                    this.position = 'left';
            } else {
                    this.position = 'right';
            }
            this.parent = $('layout-wrapper');
            Event.observe(window, 'resize', this.updatePosition.bind(this));
            this.updatePosition();
            this.element.show();
            this.originalTop = this.element.cumulativeOffset()[1]
            Event.observe(window, 'scroll', this.scroll.bindAsEventListener(this));
	},
	scroll: function(event) {
		var yoff = this.parent.cumulativeScrollOffset()[1];
	 
		var newpos = this.originalTop - yoff / this.factor;
		var queue = Effect.Queues.get(this.queue);
		queue.each(function(effect) { effect.cancel(); });
		new Effect.Morph(this.element.id, {
							style: 'top: '+ newpos +'px;'
							, mode: 'relative'
							, duration: 5
							, queue: { position: 'end', scope: this.queue 
						}});
	}, 
	updatePosition: function(event){
		if (this.position == 'left') {
			this.element.setStyle({'left': (this.parent.cumulativeOffset()[0] - this.element.getWidth() - this.offset) + 'px'});
		} else {
			this.element.setStyle({'left': (this.parent.cumulativeOffset()[0] + this.parent.getWidth() + this.offset) + 'px'});
		}
	}
});


var EffectsPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		if (!isIE6()) {
			if ($('layout-wrapper') != null) {
				$$('.floating-object').each(function(object) {
					object.setStyle({'position': 'fixed'});
					new FloatingObject(object);
				});
			}
		}
	}
});

PluginManager.add(new EffectsPluginClass());

var iSlideShow = new Class.create();
iSlideShow.prototype = {
    initialize : function (oArgs){
        this.wait       = oArgs.wait ? oArgs.wait : 4000;
        this.duration       = oArgs.duration ? oArgs.duration : 0.5;
        this.container      = oArgs.container ? oArgs.container : 'websites-images';
        this.imgWrapper     = oArgs.imgWrapper? oArgs.imgWrapper : 'websites-images-item';
        this.findSlides();
        this.start      = 0;
        this.counter        = oArgs.counter;
        this.caption        = oArgs.caption;
        this.iImageId       = this.start;
        this.startSlideShow();
        $(this.container).observe('mouseover', this.stop.bind(this));
        $(this.container).observe('mouseout', function(e){
        	this.startSlideShow();
        }.bind(this));
    },
    findSlides: function(){
        var slidesAux = $(this.container).select('.'+this.imgWrapper);
        this.slides = new Array();
        for (var i = 0; i < slidesAux.length; i++){
            var aux = slidesAux[i];
            this.slides[(slidesAux.length -1 )- i] = aux.id;    
        }
        this.numOfImages = this.slides.length;
    },  
    swapImage: function (x,y) {     
        $(this.slides[x]) && $(this.slides[x]).appear({ duration: this.duration });
        $(this.slides[y]) && $(this.slides[y]).fade({duration: this.duration });
    },
    startSlideShow: function () {
        this.play2 = setInterval(this.play.bind(this),this.wait);
    },
    play: function () {
        
        var imageShow, imageHide;
    
        imageShow = this.iImageId+1;
        imageHide = this.iImageId;
        
        if (imageShow == this.numOfImages) {
            this.swapImage(0,imageHide);    
            this.iImageId = 0;                  
        } else {
            this.swapImage(imageShow,imageHide);            
            this.iImageId++;
        }
        
        this.textIn = this.iImageId+1 + ' of ' + this.numOfImages;
        this.updatecounter(imageShow == this.numOfImages?1:imageShow+1, imageHide+1);
    },
    
    stop: function  () {
        clearInterval(this.play2);               
    },
    
    goNext: function () {
        clearInterval(this.play2);
        
        var imageShow, imageHide;
    
        imageShow = this.iImageId+1;
        imageHide = this.iImageId;
        
        if (imageShow == this.numOfImages) {
            this.swapImage(0,imageHide);    
            this.iImageId = 0;                  
        } else {
            this.swapImage(imageShow,imageHide);            
            this.iImageId++;
        }
    
        this.updatecounter();
    },
    
    goPrevious: function () {
        clearInterval(this.play);
    
        var imageShow, imageHide;
                    
        imageShow = this.iImageId-1;
        imageHide = this.iImageId;
        
        if (this.iImageId == 0) {
            this.swapImage(this.numOfImages-1,imageHide);   
            this.iImageId = this.numOfImages-1;     
        } else {
            this.swapImage(imageShow,imageHide);            
            this.iImageId--;
        }
        
        this.updatecounter();
    },
    
    updatecounter: function (imageShow, imageHide) {
        if ($('dot-item-'+imageShow)){
            $('dot-item-'+imageShow).removeClassName('image-dot-inactive');
            $('dot-item-'+imageShow).addClassName('image-dot-active');
        }
        if ($('dot-item-'+imageHide)){
            $('dot-item-'+imageHide).removeClassName('image-dot-active');
            $('dot-item-'+imageHide).addClassName('image-dot-inactive');
        }
    }
}

var LimitedCheckeables  = Class.create({
	initialize: function(element){
		this.element = element;
		this.counter = 0;
		this.limit = this.element.getAttribute('data-limit');
        $$('#' + element.id + ' input[type="checkbox"]').each(function (check) { 
        		check.observe('click', this.updateCounter.bindAsEventListener(this, check));
        }.bind(this));
	},
    updateCounter: function(event, check) {
            if (check.checked) {
                    this.counter++;
            } else {
                    this.counter--;
            }
            if (this.limit > 0) {
                    if (this.counter >= this.limit) {
                            this.disableUnchecked();
                    } else {
                            this.enableAll();
                    }
            }
    },
    enableAll: function() {
            $$('#' + this.element.id + ' input[type="checkbox"]').each(function (check) { check.disabled = false; });
    },
    disableUnchecked: function() {
            $$('#' + this.element.id + ' input[type="checkbox"]').each(function (check) { if (!check.checked) { check.disabled = true;} });
    }
});



var BarOptionsSubmitButton = Class.create({
	initialize: function(container){
		this.container = container;
		this.optionsContainer = container.select('div.options-button-container-options').first();
		this.button = container.select('input.form-button').first();
		this.hiddenVal = this.container.select('input.hidden-val').first();
		if ( this.optionsContainer != null ){
			this.enableButton();
			this.enableOptions();
		}
	},
	enableButton: function(){
		this.button.observe('click', this.toggleOptionsVisible.bind(this));
	},
	enableOptions: function(){
		var submitOption = this.submitOption.bindAsEventListener(this);
		this.optionsContainer.select('div.options-button-container-options-option a').each(function(e){
			e.observe('click', submitOption);
		}.bind(this));
	},
	submitOption: function(event){
		var id = event.target.id;
		var idSplit = id.split('|');
		if (this.hiddenVal != null ){
			this.hiddenVal.value = idSplit[1];
		}
		BligooBar.openCallBack(idSplit[0],{});
	},
	toggleOptionsVisible: function(){	
		$$('div.options-button-container-options').each(function (e){
			if ( e.visible() && e.id != this.optionsContainer.id){
				Effect.Fade(e, { duration: 0.1 });
			}
		}.bind(this));
		this.optionsContainer.setStyle({position: 'absolute', top: '-'+ (this.optionsContainer.getHeight() + 5) + 'px', left: '3px'});
		if(this.optionsContainer.visible()){
			Effect.Fade(this.optionsContainer, { duration: 0.1 });
		}	else {
		    this.optionsContainer.show();
	    }
	}
});



var DropDownMenuClass = Class.create({
        initialize: function(element) {
                this.element = element;
                this.menu = element.select('.dropdown-menu-content')[0];
                this.button = element.select('.dropdown-button')[0];
                this.menu.setStyle({'position': 'absolute', 'top': this.button.getHeight() + 'px', 'left': 0, 'width': '200px', 'heigth': '300px'});
                this.button.observe('click', this.click.bindAsEventListener(this));
                this.button.observe('mouseover', this.mouseOver.bindAsEventListener(this));
                this.button.observe('mouseout', this.mouseOut.bindAsEventListener(this));
                
				this.menu.observe('click', function(event) {
                	if (event.target.nodeName != 'A') {
                    	event.stop();
					}
				});     
				document.observe('click', this.close.bindAsEventListener(this));
        },
        addClass: function(element, clazz){
                if (!element.hasClassName(clazz)) {
                        element.addClassName(clazz);
                }
        },
        removeClass: function(element, clazz) {
                if (element.hasClassName(clazz)) {
                       	element.removeClassName(clazz);
                }
        },
        mouseOver: function(event) {
                this.addClass(this.button, 'dropdown-button-over');
        },
        mouseOut: function(event) {
                this.removeClass(this.button, 'dropdown-button-over');
        },
        click: function(event) {
                if (this.menu.visible()) {
                        Effect.Fade(this.menu, { duration: 0.2 });
                        this.button.removeClassName('menu-pushed');
                } else {
                        Effect.Appear(this.menu, { duration: 0.2 });
                        this.button.addClassName('menu-pushed');
                }
        },
        close: function(event) {
                if (this.menu.visible()) {
                        Effect.Fade(this.menu, { duration: 0.2 });
                        this.button.removeClassName('menu-pushed');
                }
        }
});

var HoverClass = Class.create({
		initialize: function(element, clazz) {
			this.clazz = clazz;
			this.element = element;
			this.element.observe('mouseover', this.mouseOver.bindAsEventListener(this));
			this.element.observe('mouseout', this.mouseOut.bindAsEventListener(this));
		},
	    removeClass: function(element, clazz) {
                if (element.hasClassName(clazz)) {
                       	element.removeClassName(clazz);
                }
        },
        addClass: function(element, clazz){
                if (!element.hasClassName(clazz)) {
                        element.addClassName(clazz);
                }
        },
        mouseOver: function(event) {
                this.addClass(this.element, this.clazz);
        },
        mouseOut: function(event) {
                this.removeClass(this.element, this.clazz);
        }
});

var BligooTabbedPane = Class.create({
	initialize: function(item) {
		this.item = item;
		this.tabs = this.item.select('.bligoo-tabbed-tab');
		this.items = this.item.select('.bligoo-tabbed-item-wrapper');
		var click = this.click.bindAsEventListener(this);
		this.tabs.each(function(tab) {
			tab.observe('click', click);
			new HoverClass(tab, 'bligoo-tabbed-tab-over');
		}.bind(this));
	}, 
	click: function(event) {
		this.tabs.each(function(tab) {
			tab.removeClassName('bligoo-tabbed-tab-selected');
		});
		event.target.addClassName('bligoo-tabbed-tab-selected');
		var id = event.target.getAttribute('data-item-id');
		this.items.each(function(item) {
			item.hide();
		});
		this.items.each(function(item) {
			if (item.id == 'bligoo-tabbed-item-wrapper-' + id) {
				item.show();
			}
		});
	}
});

var PasswordCheckerClass = Class.create({
	initialize: function(password1, password2) {
		if (password1 != null && password2 != null ) {
			this.password1 = password1;
			this.password2 = password2;
			this.password1.observe('keyup', this.keyUp.bindAsEventListener(this));
			this.password2.observe('keyup', this.keyUp.bindAsEventListener(this));
		}
	}, 
	keyUp: function(event) {
		var pass1 = this.password1.value;
		var pass2 = this.password2.value;
		if ( pass1 != '' && pass2 != '' ){
			if ( pass1 != pass2 ){
				this.setInvalid();			
			} else {
				this.setValid();
			}
		} else {
			this.clean();
		}
	}, 
	clean: function() {
		this.password1.removeClassName('notvalid');
		this.password1.removeClassName('valid');		
		this.password2.removeClassName('notvalid');
		this.password2.removeClassName('valid');		
	}, 
	setValid: function() {
		this.password2.removeClassName('notvalid');
		this.password2.addClassName('valid');		
	}, 
	setInvalid: function() {
		this.password2.removeClassName('valid');
		this.password2.addClassName('notvalid');
	}
});

var LineNumberDisplayClass = Class.create({
        initialize: function(area, display) {
                this.area = area;
                this.display = display;
                this.area.observe('keyup', this.helper.bind(this));
                this.area.observe('click', this.helper.bind(this));
                this.display.update('0');
        },
        helper: function(event) {
                if (this.pe != null) {
                        pe.stop();
                }
                pe = new PeriodicalExecuter(this.update.bind(this), 1);
        },
        update: function(pe) {
                pe.stop();
                this.updateLine();
        },
        reset: function() {
            this.display.update(1);
        },
        updateLine: function() {
                var text = this.area.value;
                if (text == null) {
                        this.reset();
                }
                var caret = this.getCaret(this.area);
                var line = 0;
                var i = 0;
                var c;
                for (; i < text.length && i < caret; i++) {
                        c = text.charAt(i);
                        if (c == "\n" ||  c == "\r") {
                        	line++;
                        }
                }
                this.display.update((line + 1));
                
        },
        getCaret: function(area) {
			if (area.selectionStart) { 
				return area.selectionStart; 
			} else if (document.selection) { 
			    area.focus(); 
				var r = document.selection.createRange(); 
			    if (r == null) { 
					return 0; 
			    } 
				var re = area.createTextRange(), 
				rc = re.duplicate(); 
				re.moveToBookmark(r.getBookmark()); 
				rc.setEndPoint('EndToStart', re); 
				return rc.text.length; 
			}  
			return 0; 
        }
});

function enableColorPicker(selector){
	$$(selector).each(
		function(e){
			var options = {};
			if($(e.id+'-swatch') != null){
				options = {swatch: e.id+'-swatch'};
			}
			var picker = new Control.ColorPicker(e.id, options);
			if ( $('button-enviar') != null ){
				Event.observe($('button-enviar'), "click", function(e){ if(picker.isOpen) {	picker.close(e); } });
			}
		}
	);
}


var ReadMoreWidget = Class.create({
	initialize: function(item) {
		this.element = $(item);
		var seq = this.element.getAttribute("data-seq");
		this.more = this.element.select("#display-more-more-" + seq)[0];
		if (this.more) {
			this.less = this.element.select("#display-more-less-" + seq)[0];
			
			this.less.observe('click', this.doLess.bindAsEventListener(this));
			this.more.observe('click', this.doMore.bindAsEventListener(this));
			this.display = this.element.select("#display-more-" + seq)[0];
			this.teaser = this.element.select("#display-more-teaser-" + seq)[0];
			this.body = this.element.select("#display-more-body-" + seq)[0];
		}
	},
	doMore: function(event) {
		var height = this.display.getHeight();
		this.more.hide();		
		this.display.update(this.body.innerHTML);
		this.less.show();
	},
	doLess: function(event) {
		this.less.hide();
		this.display.update(this.teaser.innerHTML);		
		this.more.show();		
	}
});


var ExampleTextInput = Class.create({
	initialize: function(element) {
		this.button = element.select('input[type="button"]')[0];
		this.input = element.select('input[type="text"]')[0];
		this.input.addClassName('example-text-focused');
		this.button.disabled = true;
		this.text = this.input.value;
		this.input.observe('focus', this.focus.bindAsEventListener(this));
		this.input.observe('blur', this.blur.bindAsEventListener(this));
	},
	focus: function(event) {
		if (this.button.disabled) {
			this.input.value = '';
			if (this.input.hasClassName('example-text-focused')) {
				this.input.removeClassName('example-text-focused');
			}
			this.button.disabled = false;
		} 
	},
	blur: function(event) {
		if (this.input.value == null || (this.input.value != null && this.input.value.strip() == '')) {
			this.button.disabled = true;
			this.input.value = this.text;
			if (!this.input.hasClassName('example-text-focused')) {
				this.input.addClassName('example-text-focused');
			}
		}
	}
});


var WidgetsPluginClass = Class.create(BligooPluginClass, {
	onBarLeafReplaced: function(event) {
		$$('div.options-button-container').each(function(e) {
			new BarOptionsSubmitButton(e);
		});
	},
	onWindowContentReplaced: function(event) {
		event.memo.window.select('.bligoo-tabbed-pane').each(function (pane) {
				new BligooTabbedPane(pane);
		});
		$$('.limited-checkeables-inputs').each(function (e) {
			new LimitedCheckeables(e);
		});
	},
	onPageLoaded: function(event) {
	 	if ($('bligoo-login-submit-button') != null) {
	 		new HoverClass($('bligoo-login-submit-button'), 'login-button-hover');
	 	}
		$$('.dropdown-menu').each(function(item) {
		    new DropDownMenuClass(item);
		});
		
		$$('.open-bligoo-window-link').each(function(item) {
			new BligooWindowLink(item);
		});

		$$('.read-more-widget').each(function(item) {
			new ReadMoreWidget(item);
		});
	},
	onDashboardLoaded: function(event){
		$$('.open-bligoo-window-link').each(function(item) {
			new BligooWindowLink(item);
		});
	},	
	onDashboardPageChanged: function(event){
		$$('.open-bligoo-window-link').each(function(item) {
			new BligooWindowLink(item);
		});
	},
	onWizardStepLoaded: function(event) {
		$$('.bligoo-example-text-input').each(function(item) {
			new ExampleTextInput(item);
		});
	}
	
});


PluginManager.add(new WidgetsPluginClass());
var BlidgetsPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		this.loadAjaxBlidgets();
	},
	loadAjaxBlidgets: function(){
		var ids = $A();
		var ajaxPath = '';
		$$('.blidget-placeholder').each(function(item){
			ids.push(item.getAttribute('data-id')+'|'+item.getAttribute('data-module')+"|"+item.getAttribute('data-name'));
			ajaxPath = item.getAttribute('data-path');
		}.bind(this));
		if ( ids.length > 0 ){			
			new Ajax.Request('/bligoo/ajaxproxy', {	
					method: 'getAjaxBlidgets'
					, parameters: {ids: ids, 'ajax-path': ajaxPath }
					, onComplete: function (transport){
						var jsonData = transport.responseText.evalJSON();
						var blidget;
						jsonData.each(function(data){
							$("blidget-placeholder-"+data.id).update(data.content);
						});
					}
			});
		}
	}
});

PluginManager.add(new BlidgetsPluginClass());

var AdsPluginClass = Class.create(BligooPluginClass, {
  onPageLoaded: function(event) {
		if ($('advertising-explanation') != null) {
			$('advertising-explanation').observe('click', function(e) {
				var win = new BligooWindow('ads-explanation', {
					first: 'windowAdvertisingExplanation'
					, module: 'Ads'
					, width: 500
					, height: 250
				});
				win.show();
			});
		}
  }
});
  
PluginManager.add(new AdsPluginClass());

function enableExtraInfoLink(id){
	if ( $(id) != null ){
		$(id).observe('click', function(e){
			var win = new BligooWindow('ads-explanation', {
				first:'windowAdvertisingHowToBuy'
				,module:  'Ads'
				, width: 500
				, height: 250
			});
			win.show();
		});
	}
}

function enableMorePlansLink(id, hiddenSectionId){
	if ( $(id) != null ){
		$(id).observe('click', function(e){
			if ( $(hiddenSectionId) != null ){
				 $(hiddenSectionId).toggle();
			}
		});
	}
}
var ImageEditor = Class.create({
initialize: function(imageId, endFunction, width, height, imageUrl, imageType, params){
		this.imageId = imageId;
		this.endFunction = endFunction;
		this.imageWidth = width;
		this.imageHeight = height;
		this.imageUrl = imageUrl;
		this.imageType = imageType;
		this.isWaiting = false;
		this.params = Object.extend({
				recWidth: 470,
				recHeight: 1000,
				maxWidth: width,
				maxHeight: height,
				minWidth: 20,
				minHeight: 20
			}, 
			params || {}
		);
		this.createBligooWindow();
	},
	createBligooWindow: function(){
		this.window = new BligooWindow("image-editor", {
			first: 'windowImageEditor'
			, module: 'ImageUpload'
			, parameters: {imageUrl: this.imageUrl, imageType: this.imageType, recWidth: this.params.recWidth, recHeight: this.params.recHeight}
			, onComplete: this.initTools.bind(this)
			, finalFunction: this.afterSaveImage.bind(this)
			, width: 600
			, height: 400
		});
	},
	initTools: function(){
		this.startPageUpdater();
		this.imageEditorContainer = $('image-editor-outer-container');
		this.resizer = new ResizeTool(this.imageId, this.window, this);
		this.postOnLoad = this.resizer.setPreferredWidth.bind(this.resizer,this.params.recWidth);
		this.selectionTool = new SelectionTool(this.imageId, this.window, this);
		this.saveButton = $('image-editor-button-save');
		if(this.saveButton!=null){
			this.saveButton.observe('click', this.saveImage.bind(this));
		}
		this.cancel = $$('#bligoo-window-content-image-editor .bligoo-button-close').first();
		
		if (this.cancel != null) {
			this.cancel.observe('click', this.onBeforeClose.bindAsEventListener(this));
		}
		this.image = $('image-for-edit');
		if (this.imageWidth == 0 ){
			this.imageWidth = this.image.getWidth();
		}
		if ( this.imageHeight == 0 ){
			this.imageHeight = this.image.getHeight();
		}
	},
	
	onBeforeClose: function(event) {
		this.endPeriodical();
		this.selectionTool.onBeforeClose();
		this.resizer.onBeforeClose();
	},
	stopSpinner: function(){
			this.imageEditorContainer.stopWaiting();
	}
	, startSpinner: function() {
			this.imageEditorContainer.startWaiting('bigBlackWaiting');
	},
	recreateImage: function(newImageSrc){
		if ( this.selectionTool != null ){
			this.selectionTool.cleanAll();
		}
		if ( this.resizer != null ){
			this.resizer.cleanAll();
		}
		var img = "<img src='" + newImageSrc + "?v=" + (new Date().valueOf()) + "' id='image-for-edit'/>";
		$('image-editor-container').update(img);
		this.image = $('image-for-edit');
	},
	setImageDirty: function(info){
		if ( info.width != null  && info.width > 0 ){
			this.imageWidth = info.width;
		}
		if ( info.height != null && info.height > 0 ){
			this.imageHeight = info.height;
		}
		this.selectionTool.update(info);
		this.resizer.update(info);
		this.stopSpinner();
	},
	cleanImgSrc: function(src){
		return src.split('?')[0];
	},
	afterSaveImage: function(){
		this.onBeforeClose();
		if ( this.endFunction != null ){
			this.endFunction();
		}
	},
	startPageUpdater: function(){
		if ( this.periodical == null ){
			this.periodical = new PeriodicalExecuter(this.scrollMainWindow.bind(this), 1);
			var close = $$('#' + this.window.content.id + ' .bligoo-button-close').first();
			if ( close != null ){
				close.observe('click', this.endPeriodical.bind(this));
			}
		}
	},
	scrollMainWindow: function(){
		if ( this.selectionTool != null ){
			$(document.body).scrollTo();
		}
	},
	endPeriodical: function(){
		if (this.periodical != null ){
			this.periodical.stop();
		}
	}
});

var SelectionTool = Class.create({
	initialize: function(imageId, window, editor){
		this.window = window;
		this.imageId = imageId;
		this.editor = editor;
		this.image = $(imageId);
		this.imageSrc = this.image.src;
		this.selectAllButton = $('image-editor-selection-tool-maximize-button');
		this.restoreSelectionButton = $('image-editor-selection-tool-restore-button');
		this.x1 = $('image-editor-selection-tool-x1');
		this.y1 = $('image-editor-selection-tool-y1');
		this.x2 = $('image-editor-selection-tool-x2');
		this.y2 = $('image-editor-selection-tool-y2');
		this.selectAllLink = $('bligoo-image-editor-select-all-link');
		if ( this.selectAllLink ){
			this.selectAllLink.observe('click', this.selectAll.bind(this));
		}
		this.enableCropper();		
		if ( this.selectAllButton ){
			this.selectAllButton.observe('click', this.selectAll.bind(this));
		}
		if ( this.restoreSelectionButton ){
			this.restoreSelectionButton.observe('click', this.restoreRecommendedSelection.bind(this));
		}
	},
	selectAll: function() {
		this.cropper.setAreaCoords( { x1: 0, y1: 0, x2: this.editor.imageWidth, y2: this.editor.imageHeight }, false, false, null );
		this.cropper.drawArea();
	},
	restoreRecommendedSelection: function(){
		this.cropper.setAreaCoords( { x1: 0, y1: 0, x2: this.editor.params.recWidth, y2: this.editor.params.recHeight }, false, false, null );
		this.cropper.drawArea();
	},
	enableCropper: function(){
		if (this.cropper) {
			this.cropper.remove();
		}
		this.cropper = new Cropper.Img(this.imageId, { 
							onEndCrop: this.onEndCrop.bind(this)
							, scrollWrapper: this.editor.imageEditorContainer
							, onloadCoords: {x1: 0, y1: 0, x2: this.editor.params.recWidth, y2: this.editor.params.recHeight}
							, minWidth: this.editor.params.minWidth
							, minHeight: this.editor.params.minHeight
							, maxWidth: this.editor.params.maxWidth
							, maxHeight: this.editor.params.maxHeight
							, displayOnInit: true
							, postOnLoad: this.editor.postOnLoad
						}
						, this.editor.imageWidth
						, this.editor.imageHeight);	
	},
	onEndCrop: function(coords, dimensions) {
		this.x1.value = coords.x1;
		this.y1.value = coords.y1;
		this.x2.value = coords.x2;
		this.y2.value = coords.y2;
		this.width = dimensions.width;
		this.height= dimensions.height;
	},
	cleanAll: function(){
		if ( this.cropper != null ){
			this.cropper.remove();
		}
	},
	update: function(info){
		if (!info.preview){
			this.enableCropper();
		}else{
			this.cropper.setImageSize(info.width,info.height);			
		}
	},
	onBeforeClose: function() {
		if (this.cropper != null) {
			this.cropper.remove();
		}
	}
});

var ResizeTool = Class.create({
	initialize: function(imageId, window, editor){
		this.window = window;
		this.imageId = imageId;
		this.editor = editor;
		this.image = $(imageId);
		this.slider = null;
		this.imageSrc = this.image.src;
		this.imageRatio = true;
		this.resizeWidth = $('image-editor-resizer-tool-width');
		this.resizeHeight = $('image-editor-resizer-tool-height');
		this.resizeWidth.value = this.editor.imageWidth;
		this.resizeHeight.value = this.editor.imageHeight;
		this.originalHeight = this.editor.imageHeight;
		this.originalWidth = this.editor.imageWidth;
		this.originalAspectRatio = this.originalWidth/this.originalHeight;
		this.resizeToolArea  = $('image-editor-resizer-tool');
		this.resizeToolAreaSlider = $('resize-tool-slider');
		if ( this.editor.imageWidth < this.editor.imageHeight ){
			this.minSliderVal = this.editor.params.minWidth;
		}else{
			this.minSliderVal = Math.ceil(this.editor.params.minWidth / ( this.editor.imageHeight / this.editor.imageWidth ));
		}
		this.addSlider();
		this.enableImageRatioFunctions();
	},
	addSlider: function(){
		if ( !this.slider ){
			var id = 'resizer-tool-id';
			this.slider = Builder.node('div', { 'id': id, 'style': 'width: 140px; height: 9px; background: transparent url(/static/images/slider-images-track-right.png) no-repeat scroll right top;float:left;margin-top:9px;margin-right:5px;'});
			this.slider.appendChild(Builder.node('div', {'id': id+'-left'}));
			var handlerId = id + '-handle';
			var imgSlider  = Builder.node('div', {'id': handlerId, 'class':'selected', 'style':'width: 19px; height: 20px; left: 0px; position: relative;'});
			imgSlider.appendChild(Builder.node('img', {'style':'float: left;', 'alt':'' ,'src':'/static/images/slider-images-handle.png'}));
			this.slider.appendChild(imgSlider);
			this.resizeToolAreaSlider.insert({top: this.slider});
			
			this.sliderControl = new Control.Slider(handlerId, id, {
 			 onSlide: function(v) { this.scalePreview(v) }.bind(this),
			 range: $R(this.minSliderVal, this.editor.imageWidth),
			 values: $R(this.minSliderVal, this.editor.imageWidth),
			 sliderValue: this.editor.imageWidth,
			 increment: 1
		 });
		}
	},
	setPreferredWidth: function(width){
	    if(width < this.originalWidth){
			this.resizeWidth.value = width;
			this.scalePreview(this.resizeWidth.value, 0);
		}
	},
	scalePreview: function(width, height){
		if(width==0){
			width = Math.ceil(height * this.image.getWidth() / this.image.getHeight());
		}
		if ( width < this.minSliderVal ){
			width = this.minSliderVal;
		}
		this.sliderControl.setValue(width);
		this.image.setStyle('width: '+width+'px;');
		var imageH = this.image.getHeight();
		this.resizeWidth.value = width;
		this.resizeHeight.value = imageH;
		this.editor.setImageDirty({width: width, height: imageH, preview: true});
	},
	onBeforeClose: function() {
	},
	enableImageRatioFunctions: function(){
		this.resizeWidth.observe('blur',this.adjustImageHeight.bind(this));
		this.resizeHeight.observe('blur', this.adjustImageWidth.bind(this));
		this.resizeWidth.observe('keydown',this.adjustImageHeightKey.bind(this));
		this.resizeHeight.observe('keydown',this.adjustImageHeightKey.bind(this));
	},
	adjustImageHeightKey: function(e){
		if (e.keyCode == 13){
			this.adjustImageHeight();
		}
	},
	adjustImageWidthKey: function(e){
		if (e.keyCode == 13){
			this.adjustImageWidth();
		}	
	},
	adjustImageHeight: function(e){
		if ( parseInt(this.resizeWidth.value) > parseInt(this.originalWidth) ){
			this.resizeWidth.value = this.originalWidth;
		}
		this.scalePreview(this.resizeWidth.value, 0);
	},
	adjustImageWidth: function(e){
		if ( parseInt(this.resizeHeight.value) > parseInt(this.originalHeight) ){
			this.resizeHeight.value = this.originalHeight;
		}
		this.scalePreview(0, this.resizeHeight.value);
	},
	update: function(info){
		if ( info.width != null && info.width > 0 ){
			this.resizeWidth.value = info.width;
		}
		if ( info.height != null && info.height > 0 ){
			this.resizeHeight.value = info.height;
		}
		if ( info.width != null && info.width > 0 && info.height != null && info.height > 0 ){
			this.originalAspectRatio = info.width/info.height;
		}
	}
	,cleanAll: function(){
	}
});var globalImageHelper;
var ImageUploadHelper = Class.create({
	initialize: function(editor){
		this.editor = editor;
		this.imageListPage = 1;
		this.blogFilter = 0;
		globalImageHelper = this;
		
		if (this.editor.selection.getNode() != null && this.editor.selection.getNode().nodeName == 'IMG') {
			this.openConfigWindow(this.editor.selection.getNode());
		} else {
			this.openUploadWindow();
		}
	}
	, openConfigWindow: function(node) {
		this.editingNode = node;
		this.window = new BligooWindow("image-config",	{
					first: 'windowImageConfig'
					, module: 'ImageUpload'
					, width: 450
					, height: 400
					, parameters: {align: this.getAttrib(node, 'align'), border: this.getAttrib(node, 'border'), width: this.getAttrib(node, 'width'), height: this.getAttrib(node, 'height'), vmargin: this.getAttrib(node, 'vspace'), hmargin: this.getAttrib(node, 'hspace'), url: this.getAttrib(node, 'src'), title: this.getAttrib(node, 'title'),alt: this.getAttrib(node, 'alt') }
					, onComplete: this.initImageConfig.bind(this)
				});
	}
	, getAttrib : function(e, at) {
		var ed = this.editor, dom = ed.dom, v, v2;

		if (ed.settings.inline_styles) {
			switch (at) {
				case 'align':
					if (v = dom.getStyle(e, 'float'))
						return v;

					if (v = dom.getStyle(e, 'vertical-align'))
						return v;

					break;

				case 'hspace':
					v = dom.getStyle(e, 'margin-left')
					v2 = dom.getStyle(e, 'margin-right');
					if (v && v == v2)
						return parseInt(v.replace(/[^0-9]/g, ''));

					break;

				case 'vspace':
					v = dom.getStyle(e, 'margin-top')
					v2 = dom.getStyle(e, 'margin-bottom');
					if (v && v == v2)
						return parseInt(v.replace(/[^0-9]/g, ''));

					break;

				case 'border':
					v = 0;

					tinymce.each(['top', 'right', 'bottom', 'left'], function(sv) {
						sv = dom.getStyle(e, 'border-' + sv + '-width');

						// False or not the same as prev
						if (!sv || (sv != v && v !== 0)) {
							v = 0;
							return false;
						}

						if (sv)
							v = sv;
					});

					if (v)
						return parseInt(v.replace(/[^0-9]/g, ''));

					break;
			}
		}

		if (v = dom.getAttrib(e, at))
			return v;

		return '';
	}
	, initImageConfig: function(){
		this.imageEditSrc = $('image-config-url');
		this.imageEditDesc = $('image-config-desc');
		this.imageEditAlign = $('image-config-align');
		this.imageEditWidth = $('image-config-size-width');
		this.imageEditHeight = $('image-config-size-height');
		this.imageEditBorder = $('image-config-border');
		this.imageEditVMargin = $('image-config-vmargin');
		this.imageEditHMargin = $('image-config-hmargin');
		this.imageEditAlt = $('image-config-alt');
		this.applyConfigChangesButton = $('bligoo-image-config-apply-button');
		this.applyConfigChangesButton.observe('click', this.applyConfigChanges.bind(this));
	}
	,serializeStyle : function(o) {
			var s = '';
			var oHash = $H(o);
			oHash.each(function(pair) {
				if (pair.key != '' && pair.value != '') {
					value = pair.value;
					switch (pair.key) {
						case 'margin-left':
						case 'margin-right':
						case 'margin-top':
						case 'margin-bottom':
						case 'margin':
						case 'border':
						case 'float':
						case 'vertical-align':
							s += (s ? ' ' : '') + pair.key + ': ' + value + ';';							
							break;
					}
				}
			});
			return s;
	}
	, applyConfigChanges: function(){
		args = {};
		var styles = new Array();
		if ( this.imageEditHMargin.value != '' ){
			styles['margin-left'] = this.imageEditHMargin.value + 'px';
			styles['margin-right'] = this.imageEditHMargin.value + 'px';
		}
		if ( this.imageEditVMargin.value != '' ){
			styles['margin-top'] = this.imageEditVMargin.value + 'px';
			styles['margin-bottom'] = this.imageEditVMargin.value + 'px';
		}

		if ( this.imageEditBorder.value != '' && !isNaN(this.imageEditBorder.value) ){
			if ( this.imageEditBorder.value == '0' ){
				styles['border'] = '0';
			}else{
				styles['border'] = this.imageEditBorder.value + 'px solid black';
			}
		}
		
		if ( this.imageEditAlign.value != 'none'){
			if ( this.imageEditAlign.value == 'left' || this.imageEditAlign.value == 'right' ){
				styles['float'] = this.imageEditAlign.value;
			}else{
				styles['vertical-align'] = this.imageEditAlign.value;;
			}
		}
		styles = this.editor.dom.parseStyle(this.serializeStyle(styles));
		args.style = this.serializeStyle(styles);
		if ( this.imageEditWidth.value != '' ){
			args.width = this.imageEditWidth.value;
		}
		if ( this.imageEditHeight.value != '' ){
			args.height = this.imageEditHeight.value;
		}
		if ( this.imageEditSrc.value != '' ){
			args.src = this.imageEditSrc.value;
		}
		args.title = this.imageEditDesc.value;
		args.alt = this.imageEditAlt.value;
		
		this.editor.dom.setAttribs(this.editingNode, args);
		this.window.close();
	}
	, openUploadWindow: function() {
		this.window = new BligooWindow("tmce-image-uploader",	{
					first: 'windowImageInsert'
					, module: 'ImageUpload'
					, parameters: {}
					, target: 'window_target_upload'
					, action: '/bligoo/bligoo?path=image/save'
					, encType: 'multipart/form-data'
					, onComplete: this.init.bind(this)
					, width: 450
					, height: 250
				});
	}
	, init: function() {
		this.openGalleryLink = $('open-image-gallery-link');
		this.galleryArea = $('bligoo-image-insert-uploaded');
		this.uploadArea = $('bligoo-image-insert-default');
		this.openGalleryLink.observe('click', function(e){
			this.uploadArea.hide();
			this.galleryArea.show();
		}.bind(this));
		this.initButtons();
		this.updateImageList();
	}
	, initButtons: function(){
		if ($('bligoo-window-submit-extern')) {
			$('bligoo-window-submit-extern').observe('click', this.insertExtern.bindAsEventListener(this));
		}
		if ($('bligoo-window-submit-upload')) {
			$('bligoo-window-submit-upload').observe('click', this.insertUploadImage.bindAsEventListener(this));
		}
	}
	, insertUploadImage: function(event) {
		if (uploadChecker != null) {
			uploadChecker.stop();
		}
		uploadChecker = new UploadCheckerClass();
		uploadChecker.start();
		this.window.submit();
	}
	, insertExtern: function(event) {
		var name = $('image-url').value;
		this.insert(name, name);
	}
	, edit: function(src, title, width, height) {
		this.window.close();
		new ImageEditor('image-for-edit', this.insert.bind(this, src, title), width, height, src, 'image-upload');
	}
	, editAndBack: function(src, title, width, height, imageId) {
		this.window.close();
		new ImageEditor('image-for-edit', this.openUploadWindow.bind(this), width, height, src, 'image-edit');
	}
	, getFileName: function(src){
		if ( src == '' || src == null ){
			return '';
		}
		var lastSlash = src.lastIndexOf('/');
		if ( lastSlash > -1 && lastSlash < src.length-1 ){
			return src.substring(lastSlash+1);
		}
		return src;
	}
	, insert: function(src, title, data) {
		var args = {src: src + '?v=' + new Date().valueOf(), title: '', alt: this.getFileName(src), style: 'margin-left: 4px; margin-right: 4px; margin-top: 4px; margin-bottom: 4px; border: 0'};
		if (data!= null) {
			if (data.width > 0) {
				args.width = data.width;
			}
			if (data.height > 0) {
				args.height = data.height;
			}
		}
		this.editor.execCommand('mceInsertContent', false, '<img id="__mce_tmp" src="javascript:;" />', {skip_undo : 1});
		this.editor.dom.setAttribs('__mce_tmp', args);
		this.editor.dom.setAttrib('__mce_tmp', 'id', '');
		this.editor.undoManager.add();
		this.window.close();
	}
	, updateImageList: function() {
		if ($('bligoo-image-insert-list')) {
			$('bligoo-image-insert-list').startWaiting('bigWaiting');
			new Ajax.Updater('bligoo-image-insert-list'
				, '/bligoo/ajaxproxy', {
					 method: 'updateImageList'
					,parameters: {page: this.imageListPage, blogFilter: this.blogFilter}
					,onComplete: this.postUpdateList.bind(this)
			});
		}
	}
	, postUpdateList: function(){
		this.openUploadLink = $('open-image-upload-options');
		this.openUploadLink.observe('click', function(e){
			this.galleryArea.hide();
			this.uploadArea.show();
		}.bind(this));
	
		if ( $('image-upload-image-list-pager-prev') != null ){	
			$('image-upload-image-list-pager-prev').observe('click', this.imageListPrevPage.bind(this));
		}
		if ( $('image-upload-image-list-pager-next') != null ){
			$('image-upload-image-list-pager-next').observe('click', this.imageListNextPage.bind(this));
		}
		if ( $('image-upload-image-list-blog-filter') != null ){
			$('image-upload-image-list-blog-filter').observe('change', this.updateBlogFilter.bind(this));
		}
		$('bligoo-image-insert-list').select('.insertable-image').each(function(div) {
			var id = div.select('.image-info-id').first().value;
			var src = div.select('.image-info-src').first().value;
			var width = div.select('.image-info-width').first().value;
			var height = div.select('.image-info-height').first().value;
			var insert = div.select('.image-link-insert').first();
			var img = div.select('img').first();
			var del = div.select('.image-link-delete').first();
			var edit = div.select('.image-link-edit').first();
			insert.observe('click', this.insert.bind(this, src, src, {width: width, height: height}));
			img.observe('click', this.insert.bind(this, src, src, {width: width, height: height}));
			
			del.observe('click', this.deleteImage.bind(this, id));
			
			edit.observe('click', this.editAndBack.bind(this, src, src, width, height, id));
		}.bind(this));
		$('bligoo-image-insert-list').stopWaiting();
	}
	, deleteImage: function(imageId) {
		if(confirm(tr('ImageUploadBean.message.image.delete.confirm'))){
			new Ajax.Request("/bligoo/ajaxproxy", {
				method: 'imageDelete' 
				, parameters: {imageId: imageId}
				, onComplete: this.postDeleteImage.bind(this, imageId)
			});
		}
	}
	, postDeleteImage: function(imageId) {
		var image = $('insertable-image-' + imageId);
		if (image != null) {
			this.updateImageList();
		}
	}
	, updateBlogFilter: function(){
		if ( $('image-upload-image-list-blog-filter').value != this.blogFilter ){
			this.imageListPage = 1;
			this.blogFilter = $('image-upload-image-list-blog-filter').value;
		}
		this.updateImageList();
	}
	, imageListNextPage: function(){
		this.imageListPage++;
		this.updateImageList();
	}
	, imageListPrevPage: function(){
		this.imageListPage--;
		this.updateImageList();
	}
});

var ImageEditorHelperClass = Class.create({
	initialize: function() {
	},
	edit: function(width, height, fileId, type) {
		new ImageEditor('image-for-edit', null, width, height, fileId, 'image-save', type);
	}
})

var ImageEditorHelper = new ImageEditorHelperClass();

var AvatarUploadHelper = Class.create({
	initialize: function(bligooWindow){
		if ( bligooWindow == null ){
			return;
		}
		this.window = bligooWindow;
		this.enableWindowButtons();
	},
	enableWindowButtons: function(){
		this.uploadButton = $('bligoo-window-submit-upload-avatar');
		this.uploadButton.observe('click', this.uploadAvatar.bind(this));
	},
	uploadAvatar: function(){
		this.uploadButton.startWaiting('waiting');
		/*
		if (uploadChecker != null) {
			uploadChecker.stop();
		}
		uploadChecker = new UploadCheckerClass();
		uploadChecker.start();
		*/
		this.window.submit();
	}
});





var ImageUploadPluginClass = Class.create(BligooPluginClass, {
	init: function(){
	},
	onFileUpload: function(event){
		if (event.memo.id == 'bar-upload-image') {
			if (event.memo.error != null && $('upload-messages') != null) {
				$('upload-messages').update(event.memo.error);
				$('upload-messages').show();
			} else if (event.memo.message != null && $('upload-messages') != null) {
				BligooBar.panel.stopWaiting();
				$('upload-messages').update(event.memo.message);
				$('upload-messages').show();
				$('bligoo-quota-percent').update(event.memo.quotaPercent);
				$('bligoo-quota-used').update(event.memo.quotaUsed);
				$('bligoo-quota-total').update(event.memo.quotaTotal);
				$('bligoo-bar-progress-bar-ammount').setStyle({ 'width' : event.memo.quotaPercent + '%' });
			}
		} else if (event.memo.id == 'tmce-upload-image') {
			if (event.memo.error != null && $('upload-messages') != null) {
				$('upload-messages').update(event.memo.error);
				$('upload-messages').show();
			} else {
				if (event.memo.image == true) {
					globalImageHelper.edit(event.memo.url, event.memo.filename, event.memo.width, event.memo.height);
				}
			}
		} else if (event.memo.id == 'upload-avatar' ){
			if ( event.memo.error != null ){
				alert(event.memo.error);
			}else{
				if ($('bligoo-window-edit-avatar-picture') != null){
					if (event.memo.editable) {
						new ImageEditor('image-for-edit', this.refreshAvatar.bind(this, event.memo.url), event.memo.width, event.memo.height, event.memo.url, 'avatar', {recWidth: 84, recHeight: 84, maxWidth: 84, minWidth: 84, maxHeight: 84, minHeight: 84});
					} else {
						this.refreshAvatar(event.memo.url);
					}
				}
			}
			if ($('bligoo-window-submit-upload-avatar') != null ){
				$('bligoo-window-submit-upload-avatar').stopWaiting();
			}
		} else if (event.memo.id == 'avatar-tmp-upload' ){
			if (event.memo.error != null) {
				alert(event.memo.error);
			}else{
				var filename = event.memo.avatar;
				if ($('bligoo-window-tmp-avatar-picture') != null ){
					$('bligoo-window-tmp-avatar-picture').src = filename;
				}
			}
			enableButtons();
		}
	},
	onWindowContentReplaced: function(event) {
		if ( $('bligoo-window-submit-upload-avatar') != null ){
			new AvatarUploadHelper(event.memo);
		}
	},
	refreshAvatar: function(url) {
		if ( url.indexOf('?ver') > -1 ){
			$('bligoo-window-edit-avatar-picture').src = url;
		}else{
			$('bligoo-window-edit-avatar-picture').src = url + "?ver=" +  new Date().valueOf();
		}
	},
	onPageLoaded: function(event) {
		if ($('edit-content-form')) {
			new InsertImageButton($('content-form-tinymce-image'));
		}   	
	}
});

PluginManager.add(new ImageUploadPluginClass());


var InsertImageButton = Class.create(TmcePlugin, {
	initialize: function(item) {
		this.item = item;
		this.width = 400;
		this.height = 300;
		this.item.observe('click', this.openWindow.bindAsEventListener(this));
	},
	openWindow: function(event) {
		this.editor = this.findEditor();
		this.helper = new ImageUploadHelper(this.editor);
	}
});function confirmFileDelete(question, fileId){
	var answer = confirm(question);
	var fileId = fileId;
	if(answer){
		var myAjax = new Ajax.Request(
		"/bligoo/ajaxproxy", 
		{
			method: 'get' 
			, parameters: "method=fileDelete&fileId=" + fileId
			, onComplete: function(request){
					new Effect.Fade('file-info-' + fileId);
				}
		});
	}
}

document.observe("bligoo:file-uploaded", function(event) {
	if (event.memo.id == 'bar-upload-file') {
		if (event.memo.error != null && $('upload-messages') != null) {
			$('upload-messages').update(event.memo.error);
			$('upload-messages').show();
		} else if (event.memo.message != null && $('upload-messages') != null) {
			$('upload-messages').update(event.memo.message);
			$('upload-messages').show();
			$('bligoo-quota-percent').update(event.memo.quotaPercent);
			$('bligoo-quota-used').update(event.memo.quotaUsed);
			$('bligoo-quota-total').update(event.memo.quotaTotal);
//			$('bligoo-bar-progress-bar-ammount').setStyle({ 'width' : event.memo.quotaPercent + '%' });
		}
		BligooBar.panel.stopWaiting();
	}/* 
	else if (event.memo.id == 'tmce-upload-file-full') {
		if (event.memo.error != null && $('upload-messages') != null) {
			alert(event.memo.error);
		} else if (event.memo.message != null && $('upload-messages') != null) {
			alert(event.memo.message);
		}
	}
	*/
});

var globalFileHelper = null;
var FileUploadHelper = Class.create({
	initialize: function(editor){
		this.editor = editor;
		this.page = 1;
		this.blogFilter = 0;
		globalFileHelper = this;
		this.openUploadWindow();
	},
	openUploadWindow: function() {
		this.window = new BligooWindow("tmce-file-uploader",	{
					first: 'windowFileInsert'
					, module: 'FileUpload'
					, parameters: {}
					, target: 'window_target_upload'
					, action: '/bligoo/bligoo?path=file/save/callback'
					, encType: 'multipart/form-data'
					, onComplete: this.init.bind(this)
					, width: 450
					, height: 250
				});
	},
	init: function() {
		this.openGalleryLink = $('open-file-gallery-link');
		this.galleryArea = $('bligoo-file-insert-uploaded');
		this.uploadArea = $('bligoo-file-insert-upload');
		this.openGalleryLink.observe('click', function(e){
			this.uploadArea.hide();
			this.galleryArea.show();
		}.bind(this));
		if ($('bligoo-window-submit-upload')) {
			$('bligoo-window-submit-upload').observe('click', this.upload.bindAsEventListener(this));
		}
		this.updateList();
	},
	upload: function(event) {
		if (uploadChecker != null) {
			uploadChecker.stop();
		}
		uploadChecker = new UploadCheckerClass();
		uploadChecker.start();
		this.window.submit();
	},
	updateList: function() {
		if ($('bligoo-file-insert-list')) {
			this.fileListArea = $('bligoo-file-insert-list');
			this.fileListArea.startWaiting('bigWaiting');
			new Ajax.Updater('bligoo-file-insert-list'
				, '/bligoo/ajaxproxy', {
					 method: 'updateFileList'
					, parameters: {page: this.page, blogFilter: this.blogFilter}
					, onComplete: this.postUpdateList.bind(this)
			});
		}
	},
	postUpdateList: function(){
		this.openUploadLink = $('open-file-upload-link');
		this.openUploadLink.observe('click', function(e){
			this.galleryArea.hide();
			this.uploadArea.show();
		}.bind(this));
		
		if ( $('file-upload-file-list-pager-prev') != null ){	
			$('file-upload-file-list-pager-prev').observe('click', this.prevPage.bind(this));
		}
		if ( $('file-upload-file-list-pager-next') != null ){
			$('file-upload-file-list-pager-next').observe('click', this.nextPage.bind(this));
		}
		if ( $('file-upload-file-list-blog-filter') != null ){
			$('file-upload-file-list-blog-filter').observe('change', this.updateBlogFilter.bind(this));
		}
		
		this.fileListArea.select('.insertable-file').each(function(div) {
			var id = div.getAttribute('data-file-id');
			var src = div.getAttribute('data-file-src');
			var desc = div.getAttribute('data-file-desc');
			
			var insert = div.select('.file-link-insert').first();
			var del = div.select('.file-link-delete').first();
			insert.observe('click', this.insert.bind(this, src, desc));
			del.observe('click', this.deleteFile.bind(this, id));
		}.bind(this));
		this.fileListArea.stopWaiting();
	}, 
	updateBlogFilter: function(){
		if ( $('file-upload-file-list-blog-filter').value != this.blogFilter ){
			this.page = 1;
			this.blogFilter = $('file-upload-file-list-blog-filter').value;
		}
		this.updateList();
	}, 
	nextPage: function(){
		this.page++;
		this.updateList();
	}, 
	prevPage: function(){
		this.page--;
		this.updateList();
	},
	deleteFile: function(fileId) {
		if(confirm(tr('FileUploadBean.message.delete.confirm'))){
			new Ajax.Request("/bligoo/ajaxproxy", {
				method: 'fileDelete' 
				, parameters: {fileId: fileId}
				, onComplete: function(e){
					this.updateList();
				}.bind(this)
			});
		}
	},
	insert: function(src, desc) {
		var fileName = this.getFileName(src);
		
		var textLink = fileName;
		if ( desc != '' && desc != null ){
			textLink = desc;
		}
		var html = '<a href="' + src + '" alt="'+textLink+'">' + textLink + '</a>';
	    this.editor.execCommand("mceInsertContent", true, html);
		this.window.close();
	},
	getFileName: function(src){
		if ( src == '' || src == null ){
			return '';
		}
		var lastSlash = src.lastIndexOf('/');
		if ( lastSlash > -1 && lastSlash < src.length-1 ){
			return src.substring(lastSlash+1);
		}
		return src;
	}
});

var InsertFileButton = Class.create(TmcePlugin, {
	initialize: function(item) {
		this.item = item;
		this.item.observe('click', this.openWindow.bindAsEventListener(this));
	},
	openWindow: function(event) {
		this.editor = this.findEditor();
		this.helper = new FileUploadHelper(this.editor, null);
	}
});

var globalFlashHelper = null;
var FlashUploadHelper = Class.create({
	initialize: function(editor, node){
		this.editor = editor;
		this.node = node;
		this.page = 1;
		this.blogFilter = 0;
		if ( this.node != null ){
			this.openEditWindow();
		}else{
			globalFlashHelper = this;
			this.openUploadWindow();	
		}
	}, 
	getEncodedData: function(){
		var auxbutton = $('content-form-tinymce-flash');
		this.title = auxbutton.getAttribute('data-title');
		this.okLabel = auxbutton.getAttribute('data-txt-ok');
		this.cancelLabel = auxbutton.getAttribute('data-txt-cancel');
		this.closeLabel = auxbutton.getAttribute('data-txt-close');
		this.confirmText = auxbutton.getAttribute('data-txt-confirm');
		this.width = auxbutton.getAttribute('data-width');
		this.height = auxbutton.getAttribute('data-height');
		this.widthLabel = auxbutton.getAttribute('data-label-width');
		this.heightLabel = auxbutton.getAttribute('data-label-height');
		this.urlLabel = auxbutton.getAttribute('data-label-url');
	},
	openEditWindow: function(){
		this.getEncodedData();
		this.window = new BligooWindow('flash-edit-plugin', {  width: this.width, height: this.height });
		this.content = this.window.getContent();
		this.content.update('');
		
		var wrapper = Builder.node('div', {'class': 'bligoo-window-upper', 'data-header-enabled': 'true'});
		
		this.url = drawFieldText('flash-url', 'flash-url', '', this.editor.dom.getAttrib(this.node, 'alt'), this.urlLabel, 255, 20);
		wrapper.appendChild(this.url);

		this.fewidth = drawFieldText('fewidth', 'fewidth', '', this.editor.dom.getAttrib(this.node, 'width'), this.widthLabel, 6, 4);
		this.feheight = drawFieldText('feheight', 'feheight', '', this.editor.dom.getAttrib(this.node, 'height'), this.heightLabel, 6, 4);
		wrapper.appendChild(this.fewidth);
		wrapper.appendChild(this.feheight);
		this.content.appendChild(wrapper);

		var button = this.window.addButton('ok', this.okLabel, BligooWindow.BUTTON_TYPE_OK);
		button.observe('click', this.close.bindAsEventListener(this));
		var cancel = this.window.addButton('cancel', this.cancelLabel, BligooWindow.BUTTON_TYPE_CANCEL);
		cancel.observe('click', this.cancel.bindAsEventListener(this));
		this.window.setTitle(this.title);
		this.window.setSize(this.width, this.height);
	},
	close: function(event) {
		this.insert(this.url.select('input').first().value, '', this.fewidth.select('input').first().value, this.feheight.select('input').first().value);
	},
	cancel: function(event){
		globalFlashHelper = null;
		this.window.destroy();
	},
	openUploadWindow: function() {
		this.window = new BligooWindow("tmce-file-uploader",	{
					first: 'windowFlashInsert'
					, module: 'FileUpload'
					, parameters: {}
					, target: 'window_target_upload'
					, action: '/bligoo/bligoo?path=file/save/callback'
					, encType: 'multipart/form-data'
					, onComplete: this.init.bind(this)
					, width: 450
					, height: 250
				});
	},
	init: function() {
		if ($('bligoo-window-submit-upload')) {
			$('bligoo-window-submit-upload').observe('click', this.upload.bindAsEventListener(this));
		}
		this.openGalleryLink = $('open-flash-gallery-link');
		this.galleryArea = $('bligoo-flash-insert-uploaded');
		this.uploadArea = $('bligoo-flash-insert-upload-area');
		this.openGalleryLink.observe('click', function(e){
			this.uploadArea.hide();
			this.galleryArea.show();
		}.bind(this));
		this.flashUploadW = 450;
		this.flashUploadH = 300;
		this.updateList();
	},
	upload: function(event) {
		if (uploadChecker != null) {
			uploadChecker.stop();
		}
		uploadChecker = new UploadCheckerClass();
		uploadChecker.start();
		this.fwidth = this.flashUploadW;
		this.fheight = this.flashUploadH;
		this.window.submit();
	},
	updateList: function() {
		if ($('bligoo-flash-insert-list')) {
			this.fileListArea = $('bligoo-flash-insert-list');
			this.fileListArea.startWaiting('bigWaiting');
			new Ajax.Updater('bligoo-flash-insert-list'
				, '/bligoo/ajaxproxy', {
					 method: 'updateFlashList'
					,parameters: {page: this.page, blogFilter: this.blogFilter}
					,onComplete: this.postUpdateList.bind(this)
			});
		}
	},
	postUpdateList: function(){
		this.openUploadLink = $('open-flash-upload-link');
		this.openUploadLink.observe('click', function(e){
			this.galleryArea.hide();
			this.uploadArea.show();
		}.bind(this));
	
		if ( $('flash-upload-flash-list-pager-prev') != null ){	
			$('flash-upload-flash-list-pager-prev').observe('click', this.prevPage.bind(this));
		}
		if ( $('flash-upload-flash-list-pager-next') != null ){
			$('flash-upload-flash-list-pager-next').observe('click', this.nextPage.bind(this));
		}
		if ( $('flash-upload-flash-list-blog-filter') != null ){
			$('flash-upload-flash-list-blog-filter').observe('change', this.updateBlogFilter.bind(this));
		}
		
		this.fileListArea.select('.insertable-file').each(function(div) {
			var id = div.getAttribute('data-file-id');
			var src = div.getAttribute('data-file-src');
			var desc = div.getAttribute('data-file-desc');
			
			var insert = div.select('.file-link-insert').first();
			var del = div.select('.file-link-delete').first();
			var width = div.getAttribute('data-flash-width');
			var height = div.getAttribute('data-flash-height');
			insert.observe('click', this.insert.bind(this, src, desc, width, height));
			del.observe('click', this.deleteFile.bind(this, id));
		}.bind(this));
		this.fileListArea.stopWaiting();
	}, 
	updateBlogFilter: function(){
		if ( $('flash-upload-flash-list-blog-filter').value != this.blogFilter ){
			this.page = 1;
			this.blogFilter = $('flash-upload-flash-list-blog-filter').value;
		}
		this.updateList();
	}, 
	nextPage: function(){
		this.page++;
		this.updateList();
	}, 
	prevPage: function(){
		this.page--;
		this.updateList();
	},
	deleteFile: function(fileId) {
		if(confirm(tr('FileUploadBean.message.delete.confirm'))){
			new Ajax.Request("/bligoo/ajaxproxy", {
				method: 'fileDelete' 
				, parameters: {fileId: fileId}
				, onComplete: function(e){
					this.updateList();
				}.bind(this)
			});
		}
	},
	insert: function(src, desc, w, h) {
		var width = this.fwidth;
		var height = this.fheight;
		if (w != null && w != ''){
			width = w;
		}
		if (h != null && h != '' ){
			height = h;
		}
		if (width == '' || width == null){
			width = 425;
		}
		if (height == '' || height == null){
			height = 350;
		}
		var imgSrc = this.editor.baseURI.path+'/plugins/flash/img/trans.gif';
		var html = ''	
			+ '<img class="mceFlash mceItem" src="' + imgSrc + '" mce_src="' + imgSrc + '" '		
			+ 'width="' + width + '" height="' + height + '" '
			+ 'border="0" alt="' + src + '" title="' + src + '" />';

		this.editor.execCommand('mceInsertContent', false, html);
		globalFlashHelper == null;
		this.window.destroy();
	},
	getFileName: function(src){
		if ( src == '' || src == null ){
			return '';
		}
		var lastSlash = src.lastIndexOf('/');
		if ( lastSlash > -1 && lastSlash < src.length-1 ){
			return src.substring(lastSlash+1);
		}
		return src;
	}
});

var InsertFlashButton = Class.create(TmcePlugin, {
	initialize: function(item) {
		this.item = item;
		this.item.observe('click', this.openWindow.bindAsEventListener(this));
	},
	openWindow: function(event) {
		this.editor = this.findEditor();
		this.helper = new FlashUploadHelper(this.editor, null);
	}
});

var FilePluginClass = Class.create(BligooPluginClass, {
    onPageLoaded: function(event) {
		if ($('edit-content-form')) {
			new	InsertFileButton($('content-form-tinymce-files')); 
			new	InsertFlashButton($('content-form-tinymce-flash'));
		}   	
	},
	onFileUpload: function(event){
		if (event.memo.id == 'tmce-upload-file') {
			if (event.memo.error != null && $('upload-messages') != null) {
				$('upload-messages').update(event.memo.error);
				$('upload-messages').show();
			} else {
				var file = event.memo.url;
				if ( file.toLowerCase().indexOf('.swf')  != -1  && globalFlashHelper != null){
					globalFlashHelper.insert(file, event.memo.description, null, null);
				}else{
					globalFileHelper.insert(file, event.memo.description);
				}
			}	
		}
	}
});

PluginManager.add(new FilePluginClass());

var UploadCheckerClass = Class.create({
	initialize: function() {
		this.updater = null;
	},
	start: function() {
		$("upload-messages").innerHTML = "";
		$("upload-messages").show();
	    this.updater = new Ajax.PeriodicalUpdater(
                            'upload-messages',
                            '/bligoo/ajaxproxy', {
	                            asynchronous:true
	                            , frequency:2
	                            , method: 'checkUploadStatus'
	                            , onFailure: this.error.bind(this)
	                        });
	},
	stop: function(msg) {
		if (this.updater != null) {
	    	this.updater.stop();
	    }
		if (msg != null && msg != '') {
			$("upload-messages").update(msg);
			$("upload-messages").show();
		} else {
			$("upload-messages").update('');
			$("upload-messages").hide();
		}
	},
	error: function(response) {
	    this.stop("Error communicating with server. Please try again.");
	}
});

var uploadChecker = null;

function fireUpload(args) {
	if (uploadChecker != null ) {
		uploadChecker.stop();
		uploadChecker = null;
	}
	this.document.fire('bligoo:file-uploaded', args);
}

var CaptchaClass = Class.create({
	initialize: function(element) {
		this.element = element;
		this.image = this.element.select('.captcha-image')[0];
		this.link = this.element.select('a.reset-captcha')[0];
		this.link.observe('click', this.click.bindAsEventListener(this));
	},
	click: function(event) {
		this.image.src='/bligoo/captcha?' + new Date().getTime();
	}
});


var CaptchaPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		$$('.captcha-item').each(function(item) {
			new CaptchaClass(item);
		});
	},
	onWindowContentReplaced: function(event) {
		$$('#' + event.memo.window.id + ' .captcha-item').each(function(item) {
			new CaptchaClass(item);
		});
	},
	onBarLeafReplaced: function(event) {
		$$('#bligoo-bar-item-content .captcha-item').each(function(item) {
				new CaptchaClass(item);
		});
	}
});

PluginManager.add(new CaptchaPluginClass());var GoogleAddressSelector = Class.create({
	initialize: function(element){
		this.element = element;
		google.load('maps', '3', {"other_params": "sensor=false&language="+userLanguage, "callback" : function(e){this.afterGoogleLoad();}.bind(this)});
	},
	afterGoogleLoad: function(){
		this.geocoder = new google.maps.Geocoder();		
		this.element.observe('keyup', this.onKeyUp.bindAsEventListener(this));
		this.element.observe('keydown', this.onKeyDown.bindAsEventListener(this));
		this.element.insert({after: '<div class="bligoo-option-list-selector" id="option-list-' + this.element.id + '"></div>'});
		this.elementxy = $(this.element.id+"-xy");
		this.elementIndicator = $('bligoo-address-selector-wapper-'+this.element.id);
		this.elementIndicator.observe('click', this.openMiniGoogleMaps.bind(this));
		this.list = $('option-list-' + this.element.id);
		this.list.setStyle({left: '0px'});
		this.list.hide();
		this.index = -1;
		this.disabled = false;
		this.element.enable();
	},
	disable: function(){
		this.disabled = true;
		this.element.disable();
		this.element.value = '';
		this.elementxy.value = '';
		this.elementIndicator.removeClassName("not-found");
		this.elementIndicator.addClassName("not-found");
	},
	enable: function(){
		this.disabled = false;
		this.element.enable();
		this.elementIndicator.removeClassName("not-found");
		this.elementIndicator.addClassName("not-found");
		this.elementIndicator.stopObserving('click');
	},
	openHelpMap: function(){
		this.helpWindow = null;
	},
	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			event.stop();
		}
	},
	onKeyUp: function(event){
		if (event.keyCode == 13) {
			event.stop();
		} 
		if (this.periodical) {
			this.periodical.stop();
		}
		this.elementIndicator.removeClassName("not-found");
		this.elementIndicator.addClassName("not-found");
		this.periodical = new PeriodicalExecuter(this.getGoogleGEOCode.bind(this), 1);
	},
	hideList: function() {
		this.list.hide();
		this.index = -1;
		this.list.update('');
	},
	nothingFound: function(){
		this.elementIndicator.removeClassName("not-found");
		this.elementIndicator.addClassName("not-found");
		this.elementIndicator.removeClassName("working");
	},
	setResponseFromGoogle: function(results, status){
		if (status != google.maps.GeocoderStatus.OK) {
   			this.nothingFound();
   			return;
		} else {
			var content = "<ul>";
			this.validItems = results;
			for(j=0; j < results.length; j++){
				var result = results[j];
				content += '<li id="autocomplete-item-' + j + '" class="geotype-'+result.types[0]+'">' + result.formatted_address + '</li>'; 
			}
			content += "</ul>";
			this.list.innerHTML = content;
			var element = this.element;
			var elementIndicator = this.elementIndicator;
			var elementxy = this.elementxy;
			var position = this.element.cumulativeOffset();
			var parent = this.element.ancestors()[0];
			this.list.setStyle({position: 'absolute'
								, top: parent.getHeight() + 'px'
								, width: parent.getWidth() + 'px'});
			this.list.show();
			var i = true;
			this.index = 0;
			var index = this.index;
			var itemIndex = 0;
			var list = this.list;
			var parent = this;
			$$('#' + this.list.id + ' li').each(function(li) {
					if (itemIndex == index) {
						li.addClassName('selected-item');
					} else {
						li.addClassName('unselected-item');
					}
					itemIndex++;
					if (i) {
						li.addClassName('even');
					} else {
						li.addClassName('odd');
					}
					i = !i;
					li.observe('mouseover', function(event) { event.target.removeClassName('unselected-item'); event.target.addClassName('selected-item'); });
					li.observe('mouseout', function(event) { event.target.removeClassName('selected-item'); event.target.addClassName('unselected-item'); });
					li.observe('click', function(event) { 
						var e = $(event.target);
						while (e.tagName != 'LI') {
							e = e.ancestors()[0];
						}
						var index = e.id.split('-')[2];
						element.value = e.innerHTML; 
						elementIndicator.removeClassName("not-found");
						elementIndicator.removeClassName("working");
						var point = this.validItems[index].geometry.location;
						elementxy.value = point.lng() +','+ point.lat();
						list.hide(); 
					}.bind(this));
				}.bind(this));
		}
	},
	getGoogleGEOCode: function(pe){
		pe.stop();
		this.elementIndicator.removeClassName("not-found");
		this.elementIndicator.addClassName("working");
		this.elementxy.value = '';
		this.hideList();
		if (this.element.value.strip() != '' && this.geocoder ) {
			this.geocoder.geocode( { 'address': this.element.value.strip()}, this.setResponseFromGoogle.bind(this));
		}else{
			this.nothingFound();
		}	
	},
	openMiniGoogleMaps: function(){
		new GoogleMiniMap(this);
	}
});

var GoogleMiniMap = Class.create({
	initialize: function(opener){
		this.opener = opener;
		this.elementxy = '';
		this.geocoder = new google.maps.Geocoder();
		this.window = new BligooWindow("mini-google-maps",{
			  first: 'windowMiniMap'
		  	, module: 'Menu'
			, parameters: {userSearch: this.opener.element.value.strip()}
			, onComplete: this.postInitiliaze.bind(this)
			, width: 490
			, height: 510
		});
	},
	postInitiliaze: function(){
		this.windowContent = this.window.getContent();
		this.acceptButton = $('minimap_search_acceptbutton');
		this.acceptButton.disable();
		this.acceptButton.observe('click', this.acceptButtonClick.bind(this));
		this.minimapCanvas = $('minimap_canvas');
		this.minimapSearch = $('minimap_search_field');
		
		this.minimapSearch.insert({after: '<div class="bligoo-option-list-selector" id="option-list-' + this.minimapSearch.id + '"></div>'});
		this.list = $('option-list-' + this.minimapSearch.id);
		this.list.setStyle({left: '0px'});
		this.list.hide();
		
		this.minimapSearchContainer = $('minimap_search_container');
		this.minimapSearch.observe('keyup', this.onKeyUp.bindAsEventListener(this));
		this.minimapSearch.observe('keydown', this.onKeyDown.bindAsEventListener(this));
		this.minimapCanvas.setStyle('width: 100%;height:90%;');
		var userInput = this.opener.element.value.strip();
		var latlng = new google.maps.LatLng(14.1001326, 13.6915377);
		var zoom = 1;
		if ( userInput != null && this.opener.elementxy.value != ''){
			var split = this.opener.elementxy.value.split(',');
			latlng = new google.maps.LatLng(split[1], split[0]);
			zoom = 12;
		}
    	var myOptions = {
      		zoom: zoom,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false	
		};
	    this.minimap = new google.maps.Map(this.minimapCanvas, myOptions);	   
	    if ( this.opener.elementxy.value != '' ){
	    	var split = this.opener.elementxy.value.split(',');
	    	this.updateMap(split[0], split[1], null);
	    	this.acceptButton.enable();
	    }
	},
	onKeyUp: function(event){
		if (event.keyCode == 13) {
			event.stop();
		} 
		if (this.periodical) {
			this.periodical.stop();
		}
		this.minimapSearchContainer.removeClassName("not-found");
		this.minimapSearchContainer.addClassName("not-found");
		this.periodical = new PeriodicalExecuter(this.getGoogleGEOCode.bind(this), 1);
	},
	onKeyDown: function(event){
		if (event.keyCode == 13) {
			event.stop();
		}
	},
	getGoogleGEOCode: function(pe){
		pe.stop();
		this.minimapSearchContainer.removeClassName("not-found");
		this.minimapSearchContainer.addClassName("working");
		this.elementxy = '';
		this.hideList();
		if (this.minimapSearch.value.strip() != '' && this.geocoder ) {
			this.geocoder.geocode( { 'address': this.minimapSearch.value.strip()}, this.setResponseFromGoogle.bind(this));
		}else{
			this.nothingFound();
		}	
	},
	setResponseFromGoogle: function(results, status){
		if (status != google.maps.GeocoderStatus.OK) {
   			this.nothingFound();
   			return;
		} else {
			var content = "<ul>";
			this.validItems = results;
			for(j=0; j < results.length; j++){
				var result = results[j];
				content += '<li id="autocomplete-item-' + j + '" class="geotype-'+result.types[0]+'">' + result.formatted_address + '</li>'; 
			}
			content += "</ul>";
			this.list.innerHTML = content;
			var element = this.minimapSearch;
			var elementIndicator = this.minimapSearchContainer;
			var elementxy = this.elementxy;
			var position = this.minimapSearch.cumulativeOffset();
			var parent = this.minimapSearch.ancestors()[0];
			this.list.setStyle({position: 'absolute'
								, top: parent.getHeight() + 'px'
								, width: parent.getWidth() + 'px'});
			this.list.show();
			var i = true;
			this.index = 0;
			var index = this.index;
			var itemIndex = 0;
			var list = this.list;
			var parent = this;
			$$('#' + this.list.id + ' li').each(function(li) {
				if (itemIndex == index) {
					li.addClassName('selected-item');
				} else {
					li.addClassName('unselected-item');
				}
				itemIndex++;
				if (i) {
					li.addClassName('even');
				} else {
					li.addClassName('odd');
				}
				i = !i;
				li.observe('mouseover', function(event) { event.target.removeClassName('unselected-item'); event.target.addClassName('selected-item'); });
				li.observe('mouseout', function(event) { event.target.removeClassName('selected-item'); event.target.addClassName('unselected-item'); });
				li.observe('click', function(event) { 
					var e = $(event.target);
					while (e.tagName != 'LI') {
						e = e.ancestors()[0];
					}
					var index = e.id.split('-')[2];
					element.value = e.innerHTML; 
					elementIndicator.removeClassName("not-found");
					elementIndicator.removeClassName("working");
					var point = this.validItems[index].geometry.location;
					elementxy = point.lng() +','+ point.lat();
					list.hide(); 
					this.updateMap(point.lng(), point.lat(), this.validItems[index].geometry.viewport);
				}.bind(this));
			}.bind(this));
		}
	},
	updateMap: function(lng, lat, viewport){
		this.acceptButton.enable();
		var latlng = new google.maps.LatLng(lat, lng);
		this.elementxy = lng+","+lat;
		this.minimap.setCenter(latlng);
		if (viewport != null ){
  			this.minimap.fitBounds(viewport);		
		}
		if ( this.marker == null ){
		
			this.marker = new google.maps.Marker({
      			position: latlng, 
				map: this.minimap, 
				draggable: true,
      			title: this.minimapSearch.value,
      			icon: new google.maps.MarkerImage('/static/images/event-marker.png',
      											new google.maps.Size(20, 27),
      											new google.maps.Point(0,0),
      											new google.maps.Point(10, 27)),
      			shadow: new google.maps.MarkerImage('/static/images/event-marker-shadow.png',
      											new google.maps.Size(22, 20),
      											new google.maps.Point(0,0),
      											new google.maps.Point(6, 20))
  			});   
			google.maps.event.addListener(this.marker, 'dragend', function() {
				this.minimapSearch.disable();
				this.geocodePosition(this.marker.getPosition());
  			}.bind(this));
		}else{
			this.marker.setPosition(latlng);
			this.marker.setTitle(this.minimapSearch.value);
		}		
	},
	geocodePosition: function(pos) {
  		this.geocoder.geocode(
  			{latLng: pos}, 
  			function(responses) {
	    		if (responses && responses.length > 0) {
	    		    this.minimapSearch.enable();
	    			this.minimapSearch.value = responses[0].formatted_address;
	    			this.marker.setTitle(responses[0].formatted_address);
	    			this.elementxy = responses[0].geometry.location.lng()+","+responses[0].geometry.location.lat();
	    			this.marker.setPosition(responses[0].geometry.location);
	    			this.minimap.setCenter(responses[0].geometry.location);
	    			this.minimap.fitBounds(responses[0].geometry.viewport);	
	    			this.acceptButton.enable();	
	    		} else {
	      			this.minimapSearch.value = '';
	      			this.marker.setTitle('');
	      			this.elementxy = '';
	    		}
  			}.bind(this)
  		);
	},
	nothingFound: function(){
		this.minimapSearchContainer.removeClassName("not-found");
		this.minimapSearchContainer.addClassName("not-found");
		this.minimapSearchContainer.removeClassName("working");
	},
	hideList: function(){
		this.list.hide();
		this.index = -1;
		this.list.update('');
	},
	acceptButtonClick: function(){
		if ( this.elementxy != '' ){		
			this.opener.element.value = this.minimapSearch.value;
			this.opener.elementxy.value = this.elementxy;
			this.destroy();
		}
	},
	destroy: function(){
		this.window.destroy();
	}
});

var GoogleEventAddressController = Class.create({
	initialize: function(button){
		this.button = button;
		this.minimapSearchContainer = $('event-map-address-container');
		this.address = $('event-address');
		this.addressxy = $('event-address-xy');
		this.canvas = $('event-map-canvas');
		this.canvas.setStyle('width: 100%;height:290px;');
		this.opened = false;
		
		this.eventAddAddressLink = $('event-add-address');
		if (!this.eventAddAddressLink) {
			return;
		}
		this.changeTxt = this.eventAddAddressLink.getAttribute('data-text-change');
		this.eventAddAddressLink.observe('click', function(e){
			this.button.openWindow();
		}.bind(this));
	},
	open: function(){
		this.canvas.startWaiting();
		google.load('maps', '3', {"other_params": "sensor=false&language="+userLanguage, "callback" : function(e){ this.postInitialize();}.bind(this)});
	},
	postInitialize: function(){
		this.marker = null;
		this.geocoder = new google.maps.Geocoder();
		this.address.enable();
		this.address.insert({after: '<div class="bligoo-option-list-selector bligoo-dropdown-list" id="option-list-' + this.address.id + '"></div>'});
		this.list = $('option-list-' + this.address.id);
		this.list.setStyle({left: '0px'});
		this.list.hide();
		
		this.address.observe('keyup', this.onKeyUp.bindAsEventListener(this));
		this.address.observe('keydown', this.onKeyDown.bindAsEventListener(this));
		this.canvas.setStyle('width: 100%;height:290px;');
		
		var clocation = google.loader.ClientLocation;
		var latlng = new google.maps.LatLng(29.5328037, -34.508523);
		if ( clocation != null ){
			latlng = new google.maps.LatLng(clocation.latitude, clocation.longitude);
		}
		var zoom = 1;
		if ( this.address.value != '' && this.addressxy.value != ''){
			var split = this.addressxy.value.split(',');
			latlng = new google.maps.LatLng(split[1], split[0]);
			zoom = 12;
		}else{
			if ( clocation != null ){
				this.address.value = clocation.address.city + ", "+clocation.address.country;
				this.addressxy.value = clocation.longitude+","+clocation.latitude;
			}
		}
    	var myOptions = {
      		zoom: zoom,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false	
		};
		this.canvas.stopWaiting();
	    this.minimap = new google.maps.Map(this.canvas, myOptions);	  
	    this.addInitialMarker(latlng);
	},
	addInitialMarker: function(latlng){
		if ( this.marker == null ){
			this.marker = new google.maps.Marker({
      			position: latlng, 
				map: this.minimap, 
				draggable: true,
      			title: this.address.value,
      			icon: new google.maps.MarkerImage('/static/images/event-marker.png',
      											new google.maps.Size(20, 27),
      											new google.maps.Point(0,0),
      											new google.maps.Point(10, 27)),
      			shadow: new google.maps.MarkerImage('/static/images/event-marker-shadow.png',
      											new google.maps.Size(22, 20),
      											new google.maps.Point(0,0),
      											new google.maps.Point(6, 20))
  			});   
			google.maps.event.addListener(this.marker, 'dragend', function() {
				this.address.disable();
				this.geocodePosition(this.marker.getPosition());
  			}.bind(this));
		}else{
			this.marker.setPosition(latlng);
			this.marker.setTitle(this.address.value);
		}		
	},
	onKeyUp: function(event){
		if (event.keyCode == 13) {
			event.stop();
		} 
		if (this.periodical) {
			this.periodical.stop();
		}
		this.address.removeClassName("not-found");
		this.address.addClassName("not-found");
		this.periodical = new PeriodicalExecuter(this.getGoogleGEOCode.bind(this), 1);
	},
	onKeyDown: function(event){
		if (event.keyCode == 13) {
			event.stop();
		}
	},
	getGoogleGEOCode: function(pe){
		pe.stop();
		this.address.removeClassName("not-found");
		this.address.addClassName("working");
		this.addressxy.value = '';
		this.hideList();
		if (this.address.value.strip() != '' && this.geocoder ) {
			this.geocoder.geocode( { 'address': this.address.value.strip()}, this.setResponseFromGoogle.bind(this));
		}else{
			this.nothingFound();
		}	
	},
	setResponseFromGoogle: function(results, status){
		if (status != google.maps.GeocoderStatus.OK) {
   			this.nothingFound();
   			return;
		} else {
			var content = "<ul>";
			this.validItems = results;
			for(j=0; j < results.length; j++){
				var result = results[j];
				content += '<li id="autocomplete-item-' + j + '" class="geotype-'+result.types[0]+'">' + result.formatted_address + '</li>'; 
			}
			content += "</ul>";
			this.list.innerHTML = content;
			var element = this.address;
			var elementIndicator = this.minimapSearchContainer;
			var elementxy = this.addressxy;
			var position = this.address.cumulativeOffset();
			var parent = this.address.ancestors()[0];
			this.list.setStyle({position: 'absolute'
								, top: parent.getHeight() + 'px'
								, width: parent.getWidth() + 'px'});
			this.list.show();
			var i = true;
			this.index = 0;
			var index = this.index;
			var itemIndex = 0;
			var list = this.list;
			var parent = this;
			$$('#' + this.list.id + ' li').each(function(li) {
				if (itemIndex == index) {
					li.addClassName('selected-item');
				} else {
					li.addClassName('unselected-item');
				}
				itemIndex++;
				if (i) {
					li.addClassName('even');
				} else {
					li.addClassName('odd');
				}
				i = !i;
				li.observe('mouseover', function(event) { event.target.removeClassName('unselected-item'); event.target.addClassName('selected-item'); });
				li.observe('mouseout', function(event) { event.target.removeClassName('selected-item'); event.target.addClassName('unselected-item'); });
				li.observe('click', function(event) { 
					var e = $(event.target);
					while (e.tagName != 'LI') {
						e = e.ancestors()[0];
					}
					var index = e.id.split('-')[2];
					element.value = e.innerHTML; 
					element.removeClassName("not-found");
					element.removeClassName("working");
					var point = this.validItems[index].geometry.location;
					elementxy = point.lng() +','+ point.lat();
					list.hide(); 
					this.updateMap(point.lng(), point.lat(), this.validItems[index].geometry.viewport);
				}.bind(this));
			}.bind(this));
		}
	},
	updateMap: function(lng, lat, viewport){
		this.address.enable();
		var latlng = new google.maps.LatLng(lat, lng);
		this.addressxy.value = lng+","+lat;
		this.minimap.setCenter(latlng);
		if (viewport != null ){
  			this.minimap.fitBounds(viewport);		
		}
		if ( this.marker == null ){
			this.marker = new google.maps.Marker({
      			position: latlng, 
				map: this.minimap, 
				draggable: true,
      			title: this.address.value,
      			icon: new google.maps.MarkerImage('/static/images/event-marker.png',
      											new google.maps.Size(20, 27),
      											new google.maps.Point(0,0),
      											new google.maps.Point(10, 27)),
      			shadow: new google.maps.MarkerImage('/static/images/event-marker-shadow.png',
      											new google.maps.Size(22, 20),
      											new google.maps.Point(0,0),
      											new google.maps.Point(6, 20))
  			});   
			google.maps.event.addListener(this.marker, 'dragend', function() {
				this.address.disable();
				this.geocodePosition(this.marker.getPosition());
  			}.bind(this));
		}else{
			this.marker.setPosition(latlng);
			this.marker.setTitle(this.address.value);
		}		
	},
	geocodePosition: function(pos) {
  		this.geocoder.geocode(
  			{latLng: pos}, 
  			function(responses) {
	    		if (responses && responses.length > 0) {
	    		    this.address.enable();
	    			this.address.value = responses[0].formatted_address;
	    			this.marker.setTitle(responses[0].formatted_address);
	    			this.addressxy.value = responses[0].geometry.location.lng()+","+responses[0].geometry.location.lat();
	    			this.marker.setPosition(responses[0].geometry.location);
	    			this.minimap.setCenter(responses[0].geometry.location);
	    			this.minimap.fitBounds(responses[0].geometry.viewport);	
	    		} else {
	      			this.address.value = '';
	      			this.marker.setTitle('');
	      			this.addressxy.value = '';
	    		}
  			}.bind(this)
  		);
	},
	nothingFound: function(){
		this.address.removeClassName("not-found");
		this.address.addClassName("not-found");
		this.address.removeClassName("working");
	},
	hideList: function(){
		this.list.hide();
		this.index = -1;
		this.list.update('');
	},
	parentClose: function(){
		if (this.addressxy.value != '' &&  this.address.value != '' && this.eventAddAddressLink != null ){
			this.eventAddAddressLink.innerHTML = this.address.value + ' ' + this.changeTxt ;
		}
	}
});

function manualEnableAddressSelector(){
	if ( $('bligoo-address-selector-input-address') != null ){
		new GoogleAddressSelector($('bligoo-address-selector-input-address'));
	}
}


var GoogleCitySelectorPluginClass = Class.create(BligooPluginClass, {
    onWindowContentReplaced: function(event) {
		if ( $('bligoo-address-selector-input-content-map-address') != null ){
			new GoogleAddressSelector($('bligoo-address-selector-input-content-map-address'));
		}
		if ( $('bligoo-address-selector-input-profile-geolocalization_link') != null ){
			new GoogleAddressController($('bligoo-address-selector-input-profile-geolocalization_link'));
		}
		if ( $('bligoo-address-selector-input-content-map-address_link') != null ){
			new GoogleAddressController($('bligoo-address-selector-input-content-map-address_link'));
		}
	},
	onPageLoaded: function(event) {
		if ( $('bligoo-address-selector-input-profile-geolocalization') != null ){
			new GoogleAddressSelector($('bligoo-address-selector-input-profile-geolocalization'));
		}
		if ( $('bligoo-address-selector-input-profile-geolocalization_link') != null ){
			new GoogleAddressController($('bligoo-address-selector-input-profile-geolocalization_link'));
		}
	}
});

PluginManager.add(new GoogleCitySelectorPluginClass());


var GoogleAddressController = Class.create({
	initialize: function(link){
		this.link = link;
		this.idSeed = link.id.split('_')[0];
		this.hiddenAddress = $(this.idSeed + '-address');
		this.hiddenDescription = $(this.idSeed + '-description');
		this.hiddenxy = $(this.idSeed+'-xy');
		this.label = $(this.idSeed+'_span');
		this.opened = false;
		this.getLabels();
		this.link.observe('click', this.openWindow.bind(this));
	},
	getLabels: function(){
		this.cancelLabel = this.link.getAttribute('data-cancel-label');
		this.okLabel = this.link.getAttribute('data-close-label');
		this.title = this.link.getAttribute('data-title');
		this.windowDescription = '';
		this.windowDescriptionWidth = 120;
		this.width = 400;
		this.height = 450;
	},
	openWindow: function(){
		this.window = new BligooWindow('video-plugin', {  width: this.width, height: this.height });
		this.content = this.window.getContent();
		this.content.update('');
		
		var wrapper = Builder.node('div', {'class': 'bligoo-window-upper', 'data-header-enabled': 'true'});
		
		this.mapAddressContainer = new Element('div', {'id': 'google-map-address-container', 'class': 'bligoo-dropdown-list-wrapper', 'style': 'position: relative;'});
		//var formItem = new Element('div', {'class': 'form-item'});
		this.address = new Element('input', {'size': '20', 'maxlength': '255', 'class': 'text-field', 'type': 'text'});
		this.address.value = this.hiddenAddress.value;
		//formItem.appendChild(this.address);
		//this.mapAddressContainer.appendChild(formItem);
		this.mapAddressContainer.appendChild(this.address);
		wrapper.appendChild(this.mapAddressContainer);
		
		this.addressxy = new Element('input', {'id':'google-map-address-xy', 'type': 'hidden'});
		this.addressxy.value = this.hiddenxy.value;
		wrapper.appendChild(this.addressxy);
		
		this.canvas = new Element('div',{'id': 'event-map-canvas', 'style': 'width: 100%;height:290px;'});
		wrapper.appendChild(this.canvas);

		if (this.hiddenDescription) {
			var description = new Element('div', {'class': 'google-map-description description'});
			description.update(this.hiddenDescription.value);
			wrapper.appendChild(description);
		}
		
		
		this.content.appendChild(wrapper);
		
		var cancel = this.window.addButton('cancel', this.cancelLabel, BligooWindow.BUTTON_TYPE_CANCEL);
		cancel.observe('click', this.cancel.bindAsEventListener(this));
		var button = this.window.addButton('ok', this.okLabel, BligooWindow.BUTTON_TYPE_OK);
		button.observe('click', this.close.bindAsEventListener(this));
		
		this.window.setTitle(this.title);
		this.window.setHelp(this.windowDescription, this.windowDescriptionWidth * 2);
		this.window.setSize(this.width, this.height);
		this.enableMap();
	},	
	cancel: function(){
		this.opened = false;
		this.marker = null;
		this.window.destroy();
	},
	close: function(){
		if ( this.addressxy.value != '' && this.address.value != '' ){
			this.hiddenAddress.value = this.address.value;
			this.hiddenxy.value = this.addressxy.value;
			this.label.innerHTML = this.address.value+ " - ";
			this.window.destroy();
			this.opened = false;
			this.marker = null;
			return;
		}
		this.cancel();
	},	
	enableMap: function(){
		this.canvas.startWaiting();
		google.load('maps', '3', {"other_params": "sensor=false", "callback" : function(e){ this.postInitialize();}.bind(this)});
	},	
	postInitialize: function(){
		this.geocoder = new google.maps.Geocoder();
		this.address.insert({after: '<div class="bligoo-dropdown-list bligoo-option-list-selector" id="option-list-' + this.address.id + '"></div>'});
		this.list = $('option-list-' + this.address.id);
		this.list.setStyle({left: '0px'});
		this.list.hide();
		
		this.address.observe('keyup', this.onKeyUp.bindAsEventListener(this));
		this.address.observe('keydown', this.onKeyDown.bindAsEventListener(this));
		
		var clocation = google.loader.ClientLocation;
		var latlng = new google.maps.LatLng(29.5328037, -34.508523);
		if (clocation != null){
			latlng = new google.maps.LatLng(clocation.latitude, clocation.longitude);
		}
		
		var zoom = 1;
		if ( this.address.value != '' && this.addressxy.value != ''){
			var split =  this.addressxy.value.split(',');
			latlng = new google.maps.LatLng(split[1], split[0]);
			zoom = 12;
		}else{
			if ( clocation ) {
				this.address.value = clocation.address.city + ", "+clocation.address.country;
				this.addressxy.value = clocation.longitude+","+clocation.latitude;
			}
		}
    	var myOptions = {
      		zoom: zoom,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false	
		};
		this.canvas.stopWaiting();
	    this.minimap = new google.maps.Map(this.canvas, myOptions);	  
		this.addInitialMarker(latlng);
	},
	addInitialMarker: function(latlng){
		if ( this.marker == null ){
			this.marker = new google.maps.Marker({
      			position: latlng, 
				map: this.minimap, 
				draggable: true,
      			title: this.address.value,
      			icon: new google.maps.MarkerImage('/static/images/event-marker.png',
      											new google.maps.Size(20, 27),
      											new google.maps.Point(0,0),
      											new google.maps.Point(10, 27)),
      			shadow: new google.maps.MarkerImage('/static/images/event-marker-shadow.png',
      											new google.maps.Size(22, 20),
      											new google.maps.Point(0,0),
      											new google.maps.Point(6, 20))
  			});   
			google.maps.event.addListener(this.marker, 'dragend', function() {
				this.address.disable();
				this.geocodePosition(this.marker.getPosition());
  			}.bind(this));
		}else{
			this.marker.setPosition(latlng);
			this.marker.setTitle(this.address.value);
		}		
	},
	onKeyUp: function(event){
		if (event.keyCode == 13) {
			event.stop();
		} 
		if (this.periodical) {
			this.periodical.stop();
		}
		this.address.removeClassName("not-found");
		this.address.addClassName("not-found");
		this.periodical = new PeriodicalExecuter(this.getGoogleGEOCode.bind(this), 1);
	},
	onKeyDown: function(event){
		if (event.keyCode == 13) {
			event.stop();
		}
	},
	getGoogleGEOCode: function(pe){
		pe.stop();
		this.address.removeClassName("not-found");
		this.address.addClassName("working");
		this.addressxy.value = '';
		this.hideList();
		if (this.address.value.strip() != '' && this.geocoder ) {
			this.geocoder.geocode( { 'address': this.address.value.strip()}, this.setResponseFromGoogle.bind(this));
		}else{
			this.nothingFound();
		}	
	},
	setResponseFromGoogle: function(results, status){
		if (status != google.maps.GeocoderStatus.OK) {
   			this.nothingFound();
   			return;
		} else {
			var content = "<ul>";
			this.validItems = results;
			for(j=0; j < results.length; j++){
				var result = results[j];
				content += '<li id="autocomplete-item-' + j + '" class="geotype-'+result.types[0]+'">' + result.formatted_address + '</li>'; 
			}
			content += "</ul>";
			this.list.innerHTML = content;
			var element = this.address;
			var elementxy = this.addressxy;
			var position = this.address.cumulativeOffset();
			var parent = this.address.ancestors()[0];
			this.list.setStyle({position: 'absolute'
								, top: parent.getHeight() + 'px'
								, width: parent.getWidth() + 'px'});
			this.list.show();
			var i = true;
			this.index = 0;
			var index = this.index;
			var itemIndex = 0;
			var list = this.list;
			var parent = this;
			$$('#' + this.list.id + ' li').each(function(li) {
				if (itemIndex == index) {
					li.addClassName('selected-item');
				} else {
					li.addClassName('unselected-item');
				}
				itemIndex++;
				if (i) {
					li.addClassName('even');
				} else {
					li.addClassName('odd');
				}
				i = !i;
				li.observe('mouseover', function(event) { event.target.removeClassName('unselected-item'); event.target.addClassName('selected-item'); });
				li.observe('mouseout', function(event) { event.target.removeClassName('selected-item'); event.target.addClassName('unselected-item'); });
				li.observe('click', function(event) { 
					var e = $(event.target);
					while (e.tagName != 'LI') {
						e = e.ancestors()[0];
					}
					var index = e.id.split('-')[2];
					element.value = e.innerHTML; 
					element.removeClassName("not-found");
					element.removeClassName("working");
					var point = this.validItems[index].geometry.location;
					elementxy = point.lng() +','+ point.lat();
					list.hide(); 
					this.updateMap(point.lng(), point.lat(), this.validItems[index].geometry.viewport);
				}.bind(this));
			}.bind(this));
		}
	},
	updateMap: function(lng, lat, viewport){
		var latlng = new google.maps.LatLng(lat, lng);
		this.addressxy.value = lng+","+lat;
		this.minimap.setCenter(latlng);
		if (viewport != null ){
  			this.minimap.fitBounds(viewport);		
		}
		if ( this.marker == null ){
			this.marker = new google.maps.Marker({
      			position: latlng, 
				map: this.minimap, 
				draggable: true,
      			title: this.address.value,
      			icon: new google.maps.MarkerImage('/static/images/event-marker.png',
      											new google.maps.Size(20, 27),
      											new google.maps.Point(0,0),
      											new google.maps.Point(10, 27)),
      			shadow: new google.maps.MarkerImage('/static/images/event-marker-shadow.png',
      											new google.maps.Size(22, 20),
      											new google.maps.Point(0,0),
      											new google.maps.Point(6, 20))
  			});   
			google.maps.event.addListener(this.marker, 'dragend', function() {
				this.address.disable();
				this.geocodePosition(this.marker.getPosition());
  			}.bind(this));
		}else{
			this.marker.setPosition(latlng);
			this.marker.setTitle(this.address.value);
		}		
	},
	geocodePosition: function(pos) {
  		this.geocoder.geocode(
  			{latLng: pos}, 
  			function(responses) {
  				this.address.enable();
	    		if (responses && responses.length > 0) {
	    			this.address.value = responses[0].formatted_address;
	    			this.marker.setTitle(responses[0].formatted_address);
	    			this.addressxy.value = responses[0].geometry.location.lng()+","+responses[0].geometry.location.lat();
	    			this.marker.setPosition(responses[0].geometry.location);
	    			this.minimap.setCenter(responses[0].geometry.location);
	    			this.minimap.fitBounds(responses[0].geometry.viewport);	
	    		} else {
	      			this.address.value = '';
	      			this.marker.setTitle('');
	      			this.addressxy.value = '';
	    		}
  			}.bind(this)
  		);
	},
	nothingFound: function(){
		this.address.removeClassName("not-found");
		this.address.addClassName("not-found");
		this.address.removeClassName("working");
	},
	hideList: function(){
		this.list.hide();
		this.index = -1;
		this.list.update('');
	}
});
var DomainChecker  = new Class.create({
	initialize: function(domain) {
		this.domain = domain;
		this.button = $('button-go');
		this.button.startWaiting();
		this.button.observe('click', this.close.bindAsEventListener(this));
		this.periodical = new PeriodicalExecuter(this.checkDnsReady.bind(this), 10);
	},
	checkDnsReady: function() {
		this.periodical.stop();
		new Ajax.Request('/bligoo/ajaxproxy', {
			method: 'isOPENSRSDnsReady'
			, parameters: {domain: this.domain}
			, onSuccess: this.parseRequest.bind(this)
		});
	},
	parseRequest: function(transport) {
		var object = transport.responseText.evalJSON();
		if (object.status == 'ok') {
			setTimeout('showDomainReadyButton()', 60000);
		} else {
			this.periodical = new PeriodicalExecuter(this.checkDnsReady.bind(this), 5);
		}
	},
	close: function(event) {
		if (window.opener) {
			window.opener.document.location.href = 'http://' + this.domain + '/jsredirect/editor/config';
			window.close();
		} else {
			document.location.href = 'http://' + this.domain + '/jsredirect/editor/config';
		}
	}
});


var WizardDomainChecker  = new Class.create({
	initialize: function(domain) {
		this.domain = domain;
		this.button = $('button-go');
		this.button.startWaiting();
		this.button.observe('click', this.close.bindAsEventListener(this));
		this.periodical = new PeriodicalExecuter(this.checkDnsReady.bind(this), 10);
	},
	checkDnsReady: function() {
		this.periodical.stop();
		new Ajax.Request('/bligoo/ajaxproxy', {
			method: 'isOPENSRSDnsReady'
			, parameters: {domain: this.domain}
			, onSuccess: this.parseRequest.bind(this)
		});
	},
	parseRequest: function(transport) {
		var object = transport.responseText.evalJSON();
		if (object.status == 'ok') {
			setTimeout('showDomainReadyButton()', 60000);
		} else {
			this.periodical = new PeriodicalExecuter(this.checkDnsReady.bind(this), 5);
		}
	},
	close: function(event) {
		window.opener.location.reload()
		window.close();
	}
});


function showDomainReadyButton() {
	var button = $('button-go');
	button.stopWaiting();
}


var BlogPluginClass = Class.create(BligooPluginClass, {
	onWindowContentReplaced: function(event) {
		if (event.memo.window.id == 'bligoo-window-theme-choose' || event.memo.window.id == 'bligoo-window-new-blog-wizard') {
                this.observeRadio(event.memo.window, '.edit-site-theme-details');
                this.observeRadio(event.memo.window, '.layout-item');
                
                if (event.memo.window.id == 'bligoo-window-new-blog-wizard') {
					event.memo.window.select('#theme-layout-selector .layout-item-image').each(function(div) {
						div.observe('click', function(event) {
							var target = event.target;
							var layout = target.getAttribute('bligooLayout');
							$('new-blog-layout').value = layout;
							$$('#theme-layout-selector .layout-item-image').each(function(div) { 
								div.removeClassName('layout-item-' + div.getAttribute('bligooLayout') + '-active');
								div.addClassName('layout-item-' + div.getAttribute('bligooLayout') + '-inactive');
							});
							target.removeClassName('layout-item-' + layout + '-inactive');
							target.addClassName('layout-item-' + layout + '-active');
							
							$$('#theme-layout-selector .layout-description').each(function(div) { 
								if (div.id == 'layout-description-' + layout) {
									div.show();
								} else {
									div.hide();
								}
							});
						});
					});
                }
        }
    },
    observeRadio: function(container, clazz) {
    	container.select(clazz).each(function(thumb) {
    		var radio;
            thumb.select('input').each(function(input) {
            	radio = input;
            });     
            if (radio != null) { 
            	thumb.observe('click', function(event) {
                     radio.checked = true;
                     container.select(clazz).each(function(t) {
                    	 t.up().removeClassName('selected');
                     });
                     $(thumb).up().addClassName('selected');  
                });     
            }       
    	}.bind(this));
    },
	onBarInit: function(event) {
	
		var JumpToAppletClass = Class.create();
		JumpToAppletClass.prototype = {
			initialize: function(link, div, bar) {
				this.div = div;
				this.divContent = this.div.select('#bligoo-bar-blog-jumpto-links-content').first();
				this.divContentBotL = this.div.select('.bligoo-bar-applet-links-dl').first();
				this.divContentBotR = this.div.select('.bligoo-bar-applet-links-dr').first();
				this.link = link;
				this.bar = bar;
				if (div != null) {
					var links = div.select('a');
					if (links.length > 0) {
						this.link.observe('click', this.toggle.bindAsEventListener(this));
						document.observe('click', this.close.bindAsEventListener(this));
					}
				}
				this.alreadyOpened = false;
			},
			close: function(event) {
				
				if (event.target.id != this.link.id && $(event.target).up() != null && this.link.id != $(event.target).up().id) {				
					this.div.hide();
					this.link.removeClassName('bligoo-bar-jumpto-applet-pushed');
				}
			},
			toggle: function(event) {
				if (this.link.hasClassName('bligoo-bar-jumpto-applet-pushed')) {
					this.link.removeClassName('bligoo-bar-jumpto-applet-pushed');
				} else {
					this.bar.closePanel();
					this.link.addClassName('bligoo-bar-jumpto-applet-pushed');
					var linkWidth = this.link.getWidth()-2;
					this.divContentBotL.setStyle('width:'+linkWidth+'px;float:left;');
					var newBgPosition = '-'+(416-(150-linkWidth))+'px -356px';
					this.divContentBotR.setStyle('width:'+(150-linkWidth)+'px;float:left;background-position: '+newBgPosition+';');
				}
				this.div.toggle();
				if ( this.div.visible() && !this.alreadyOpened ){
					this.getMoreLinks();
				}
			},
			goTo: function(event, src) {
				if (src != undefined) {
					document.location.href = src;
					return;
				}
			},
			getMoreLinks: function(){
				this.loadingDiv = Builder.node('div', {'id': 'bligoo-bar-jumpto-links-waiting'});
				this.loadingDiv.setStyle('height: 20px; width: 100%;');
				this.divContent.insert({top: this.loadingDiv}); 
				$('bligoo-bar-jumpto-links-waiting').startWaiting('blackWaiting');
				new Ajax.Request(
					'/bligoo/ajaxproxy', {
					method: 'getJumptoAppletLinks'
					, onSuccess: function(transport){
									var responseJSON = transport.responseText.evalJSON();
									this.alreadyOpened = true;
									$('bligoo-bar-jumpto-links-waiting').stopWaiting();
									this.loadingDiv.remove();
									if ( responseJSON.myBlogs != null ){
										this.divContent.insert({top: responseJSON.myBlogs});
									}
									if ( responseJSON.mySubscriptions != null ){
										this.divContent.insert({top: responseJSON.mySubscriptions});
									}
								}.bind(this)
					, onFailure: function(transport) {
						//NADA
								}.bind(this)
				});
			}
		}
		
		if ($('bligoo-bar-applet-blog-jumpto')) {
			new JumpToAppletClass($('bligoo-bar-applet-blog-jumpto'), $('bligoo-bar-blog-jumpto-links'), event.memo);
		}
	}
});

PluginManager.add(new BlogPluginClass());var ContactFormPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		$$('.contact-form-block').each(function(e) {
			e.observe('click', function(event) {
				event.stop();
				document.location.href='/contact#contact-form';
			});
		});
	}
});

PluginManager.add(new ContactFormPluginClass());var ContactSelector = Class.create({
	initialize: function(element){
		this.element = element;
		this.uploadCsvListener = this.uploadCsv.bindAsEventListener(this)
		this.uploadedCsv = this.csvUploaded.bindAsEventListener(this);
		document.observe("bligoo:file-uploaded", this.uploadedCsv);
		document.observe("bligoowindow:content-replaced", this.initCsvContent.bind(this));
		this.parseConfig();
		this.acceptEmails = this.setting('emails') == 'true';
		this.limit = parseInt(this.setting('limit'))
		var parent = this.element.ancestors()[0];
        parent.setStyle({ 'cursor': 'text', 'border': '1px solid #999' });
        parent.observe('click', function(event) { element.focus(); });
        this.wrapper = parent;
		this.counter = 0;
		this.elements = 0;
		this.element.observe('keyup', this.onKeyUp.bindAsEventListener(this));
		this.element.observe('keydown', this.onKeyDown.bindAsEventListener(this));
		this.element.size = this.element.value.length + 2;
		this.list = Builder.node('div', {'id': 'option-list-' + this.element.id, 'class': 'bligoo-dropdown-list bligoo-contact-selector-option-list'});
		this.list.setStyle({left: '0px'});
		this.list.hide();
		this.element.insert({after: this.list});
		this.fieldName = this.element.id.substring(30);
		this.index = -1;
		if (this.setting('popup') == 'true') {
 			$$(".bligoo-select-contacts-" + this.element.id).each(function(link){
 				link.observe('click', this.openPopup.bindAsEventListener(this, link));
 			}.bind(this));
 			var csv = $("bligoo-email-selector-csv-" + this.element.id);
 			if (csv) {
 				csv.observe('click', this.openCsvPopup.bindAsEventListener(this));
 			}
		}
		this.parseDefaultValues();
	},
	openPopup: function(event, link) {
		var window = new BligooWindow(this.element.id, {
			first: link.getAttribute('data-next')
			, module: link.getAttribute('data-module')
			, endFunction: this.selectEmails.bind(this)
			, width: 400
			, height: 150
		});
		this.window = window;
		this.window.show();
	},
	parseConfig: function () {
		var parent = this.element.ancestors()[1];
		var config = new Hash();
		$$('#' + parent.id + ' .bligoo-contact-selector-config').each(function(e) {
			config.set(e.name, e.value);
		});
		this.config = config;
	},
	parseDefaultValues: function () {
		var parent = this.element.ancestors()[1];
		var values = $$('#' + parent.id + ' .bligoo-contact-select-default-value');
		var i = 0;
		for (; i < values.length ; i++) {
			this.addTag(values[i].value, values[i].name);
		};
	}, 
	openCsvPopup: function(event) {
		var window = new BligooWindow(this.element.id,
			{
				first: 'windowUserUploadCsv'
				, module: 'UserInterface'
				, width: 400
				, height: 330
				, target: 'window_target_upload'
				, encType: 'multipart/form-data'
				, action: '/file/csv/upload'
				, onComplete: this.initCsvUpload.bind(this)
			});
		//	 	, endFunction: this.selectEmails.bind(this)
		this.csvWindow = window;
		this.csvWindow.show();
	}, 
	initCsvUpload: function() {
		if ($('upload-csv-file')) {
			$('upload-csv-file').stopObserving('click', this.uploadCsvListener);
			$('upload-csv-file').observe('click', this.uploadCsvListener);
		}
	},
	uploadCsv: function(event) {
		if (uploadChecker != null) {
			uploadChecker.stop();
		}
		uploadChecker = new UploadCheckerClass();
		uploadChecker.start();
		this.csvWindow.submit();
	},	
	csvUploaded: function(event) {
		if (event.memo.id == 'upload-csv') {
			if (event.memo.error != null && $('upload-messages') != null) {
				$('upload-messages').update(event.memo.error);
				$('upload-messages').show();
			} else if (this.csvWindow) {
				this.csvWindow.goNext();
			}	
		}
	},
	initCsvContent: function(event) {
		if ($(event.memo).content) {
			var content = $(event.memo).content.select('#csv-content').first();
			if (content) {
				this.updateCsvContent();
				$('use-selected-emails').observe('click', this.useSelectedCsvEmails.bindAsEventListener(this));
				$('csv-select-all').observe('click', this.selectAllCsv.bindAsEventListener(this));
			}
		}
	},
	selectAllCsv: function() {
		var value = this.element.value;
		$$('#' + this.csvWindow.getForm().id + ' input').each(function(e) {
			e.checked = true;
		});
	},
	useSelectedCsvEmails: function(event) {
		var value = this.element.value;
		$$('#' + this.csvWindow.getForm().id + ' input').each(function(e) {
			if (e.checked) { 
				this.addTag(e.value, e.value); 
			} 
		}.bind(this));
		this.csvWindow.close();
		this.element.value = value;
	},
	updateCsvContent: function() {
		new Ajax.Request('/bligoo/ajaxproxy', {
			method: 'csvContent'
			, parameters: {}
			, onSuccess: this.processCsvContent.bind(this)
		});
	},
	processCsvContent: function(transport) {
		var object = transport.responseText.evalJSON();
		$('csv-content').update(object.content);
		this.initCsvPage(object.page);
	},
	initCsvPage: function(page) {
		var left = $("csv-pager-left");
		var right = $("csv-pager-right");
		if (left) {
			left.observe('click', this.csvPage.bindAsEventListener(this, page - 1));
		}
		if (right) {
			right.observe('click', this.csvPage.bindAsEventListener(this, page + 1));
		}
	},
	csvPage: function(event, page) {
		new Ajax.Request('/bligoo/ajaxproxy', {
			method: 'csvContent'
			, parameters: {page: page}
			, onSuccess: this.processCsvContent.bind(this)
		});
	},
	nextEmailStep: function(event) {
		this.next.toggle();
		this.close.toggle();
		
		var text = this.window.getFormContent();
		this.window.setContent('actualizando');
		var params = text.toQueryParams();
		params['method'] = 'windowUserContactEmailsSelect';
		var win = this.window;
		var error = false;
		new Ajax.Request('/bligoo/ajaxproxy', {
							parameters: params
							, asynchronous: false
							, onSuccess: function (transport) {
								if (!transport.responseText.startsWith('error:') ){
									win.setContent(transport.responseText);
								} else {
									win.setContent(transport.responseText.substring(6));
									error = true;
								}
							}
						}); // */
		if(!error){
			this.choose.toggle();
		}		
		this.close.toggle();
	},
	selectEmails: function () {
		var t = this;
		var value = this.element.value;
		$$('#' + this.window.getForm().id + ' input').each(function(e) { if (e.checked) { t.addTag(e.value, e.value); } });
		this.closeWindow();
		this.element.value = value;
	}, 
	closeWindow: function() {
		this.window.close();
	},
	addTag: function(hidden, text) {
		if (text == null || text == '' || text.strip() == '') {
			return;
		}
		text = text.replace('/,/g', "").strip().stripTags().stripScripts();
		this.element.value = '';
		this.hideList();
		if (text.length > 0 && this.elements < this.limit) {
			var crossId = 'cross-' + this.element.id + '-' + this.counter;
			var tagId = 'tag-wrap-' + crossId;
			
			var img = Builder.node('img');
			var cross = Builder.node('span', {'class': 'cross', 'id': crossId});
			cross.appendChild(img);
			var value = Builder.node('span', {'class': 'value'}, text);
			var input = Builder.node('input', {'class': 'bligoo-contact-selector-value'
									, 'value': hidden
									, 'name': 'edit[' + this.fieldName + ']'
									, 'type': 'hidden'});
			var newTag = Builder.node('span', {'class': 'label', 'id': tagId}); 
			newTag.appendChild(value);
			newTag.appendChild(input);
			newTag.appendChild(cross);
			this.element.insert({before: newTag});
			
			new CrossImage(img);
			img.observe('click', this.closeTagHandler.bindAsEventListener(this));

			this.counter++;
			this.elements++;
			this.element.size = 2;
			this.index = -1;
			this.updateTextFieldVisibility();
		}
	},
	setting: function(key) {
		return this.config.get(key);
	},
	updateTextFieldVisibility: function () {
                var parent = this.element.ancestors()[1];
                if (this.elements >= this.limit) { //$$('#' + parent.id + ' .bligoo-contact-selector-value').size() >= limit) {
                        if (this.limit == 1) {
                        	this.wrapper.setStyle({ 'border': '0' });
                        }
                        this.element.hide();
                } else {
                        if (this.limit == 1) {
                        	this.wrapper.setStyle({ 'border': '1px solid #999' });
                        }
                        this.element.show();
                }
	},
	onKeyDown: function(event) {
		if (event.keyCode == 13) {
			event.stop();
		}
	},
	onKeyUp: function(event){
        if(event.keyCode == Event.KEY_TAB){
                // this.addTag();
        } else if (event.keyCode == 188 || event.keyCode == 13 || event.keyCode == 32) {
        	event.stop();
            if (event.keyCode == 188) {
                    var val = this.element.value;
                    val = val.substring(0, val.length - 1);
                    this.element.value = val;
            }
			if (this.acceptEmails && isEmail(this.element.value)) {
				this.addTag(this.element.value, this.element.value);
			} else if (this.index > -1) {
				this.addTag(this.keys[this.index], this.values[this	.index]);
			}
		} else if (event.keyCode == 38) {
			if (this.index > 0) {
				this.index--;
				this.updateSelected();
			}
		} else if (event.keyCode == 40) {
			if (this.keys && this.index < this.keys.length - 1) {
				this.index++;
				this.updateSelected();
			}
		} else { 
			if (this.periodical) {
				this.periodical.stop();
			}
			this.periodical = new PeriodicalExecuter(this.updateOptions.bind(this), 1);
			if (!this.wrapper.hasClassName('bligoo-input-working')) {
				this.wrapper.addClassName('bligoo-input-working');
			}
			if (!this.wrapper.hasClassName('working')) {
				this.wrapper.addClassName('working');
			}
		}  
		if(this.element.value.length > 0){
			this.element.size = this.element.value.length;
		}
		
	},
	updateSelected: function(){
		var i = 0;
		var index = this.index;
		$$('#' + this.list.id + ' li').each(function(li) {
			if (i == index) {
				li.removeClassName('unselected-item'); li.addClassName('selected-item');
			} else {
				li.removeClassName('selected-item'); li.addClassName('unselected-item');
			}
			i++;
		});
	},
	hideList: function() {
		this.list.hide();
		this.index = -1;
		this.list.update('');
	},
	closeTagHandler: function(event){
			var id = event.target.ancestors()[1].id;
			this.removeTag(id);
			this.elements--;
			this.updateTextFieldVisibility();
	},
	removeTag: function(id){
		// Effect.Fade(id, { duration: 0.3, afterFinish : function(element){ $(id).remove();} });
		$(id).remove();
	},
	updateOptions: function(pe) {
	    pe.stop();
	    this.wrapper.removeClassName('bligoo-input-working');
	    this.wrapper.removeClassName('working');
	    if (this.element.value.strip() != '') {
	    	if (isEmail(this.element.value)) {
	    		this.hideList();
	    		return;
	    	}
	    	if (this.setting('autocomplete') == 'false') {
	    		return;
	    	}
	    	
	    	var ret;
        	new Ajax.Request('/bligoo/ajaxproxy', 
				{	method: 'userFindAsType'
				,	parameters: {pattern: this.element.value.strip(), alternateFunction: this.setting('alternateFunction'), alternateParameter: this.setting('alternateParameter')}
				, 	asynchronous: false
				, 	onComplete: function(transport){
		                ret = transport.responseText.evalJSON();
					}
				});
            if (ret == null || ret.keys == null || ret.keys.length < 1) {
				this.hideList();
				return;
            } 

			this.keys = ret.keys;
			this.values = ret.values;
			this.avatars = ret.avatars;
			var j = 0;
			var text = this.element.value;
			if( this.values && text != '' && text != null) {
				var ul = Builder.node('ul');
				for( ; j < this.values.length ; j++) {
					var val = this.values[j];
					var li = Builder.node('li', {'id': 'autocomplete-item-' + j});
					li.appendChild(Builder.node('img', {'src': this.avatars[j], 'title': this.values[j]}));
					li.appendChild(Builder.node('div', {'class': 'contact-name'}, val));
					
					li.appendChild(Builder.node('div', {'class': 'clear'}));
					ul.appendChild(li);
				}
				this.list.update(ul);
				
				
				var position = this.element.cumulativeOffset();
				var parent = this.element.ancestors()[0];
				var listParent = this.list.ancestors()[0];
				this.list.setStyle({position: 'absolute'
									, top: listParent.getHeight() + 'px'
									, width: listParent.getWidth() + 'px'});
				this.list.show();
				document.observe('click', function(event) { this.list.hide(); }.bind(this));
					
				var i = true;
				this.index = 0;
				$$('#' + this.list.id + ' li').each(function(li, itemIndex) {
						if (itemIndex == this.index) {
							li.addClassName('selected-item');
						} else {
							li.addClassName('unselected-item');
						}
						itemIndex++;
						if (i) {
							li.addClassName('even');
						} else {
							li.addClassName('odd');
						}
						i = !i;
						li.observe('mouseover', function(event) { event.target.removeClassName('unselected-item'); event.target.addClassName('selected-item'); });
						li.observe('mouseout', function(event) { event.target.removeClassName('selected-item'); event.target.addClassName('unselected-item'); });
						li.observe('click', this.clickElement.bindAsEventListener(this));
					}.bind(this));
			}
		}
	},
	clickElement: function(event) {
		var e = $(event.target);
		event.stop();
		while (e.tagName != 'LI') {
			e = e.ancestors()[0];
		}
		this.element.value = e.innerHTML; 
		var index = e.id.split('-')[2];
		this.list.hide(); 
		this.addTag(this.keys[index], this.values[index]); 
	},
	insertEmails: function(emails) {
		if (emails) {
			for( var i = 0; i < emails.length; i++) {
				this.addTag(emails[i], emails[i]);
			}
		}
	}
});

var ContactSelectorPluginClass = Class.create(BligooPluginClass, {
	init: function() {
	},
	onPageLoaded: function(event) {
		this.initContactSelectors('body');
	},
	onWindowContentReplaced: function(event) {
		this.initContactSelectors('#' + event.memo.window.id);
	},
	onBarLeafReplaced: function(event) {
		this.initContactSelectors('#bligoo-bar-item-header');
		this.initContactSelectors('#bligoo-bar-item-content');
	},
	initContactSelectors: function(wrapper) {
		$$(wrapper + " .bligoo-contact-selector-input").each(function (e) { new ContactSelector(e); });
	}
});

PluginManager.add(new ContactSelectorPluginClass());

function googleSearchInit(noresults, site, keywords) {
	var searchControl = new google.search.SearchControl();
	var searcherOptions = new google.search.SearcherOptions();
	searcherOptions.setNoResultsString(noresults);

	var webSearch = new google.search.WebSearch();
	webSearch.setSiteRestriction(site);
	searchControl.addSearcher(webSearch, searcherOptions);

	var drawOptions = new google.search.DrawOptions();
	drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
	
	searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
	searchControl.draw(document.getElementById('google-search'), drawOptions);
	searchControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
	
	searchControl.execute(keywords);
}

function addContentGeoLocalizationAutoData(){
	var item = google.loader.ClientLocation;
	if ( item != null ){
		$('geolocAddress').value = item.address.country_code+", "+item.address.country+", "+item.address.region+", "+item.address.city;
		$('geolocCountryCode').value = item.address.country_code;
		$('geolocLatitude').value = item.latitude;
		$('geolocLongitude').value = item.longitude;
	}
}

var ContentGeolocalizatedMap = Class.create({
	initialize: function( contentId, x, y, baseUrl ) {
		this.contentId = contentId;
		this.baseUrl = baseUrl;
		this.pinx = x;
		this.piny = y;
		this.contentBody = $('body-' + contentId);
		this.mapDisplay = $('content-geolocalization-' + contentId);
		this.mapViewLink = this.contentBody.select('a.view-map-link')[0];
		this.mapViewLink.observe('click', this.goToMapPin.bindAsEventListener(this));
	},
	goToMapPin: function(e){
		var newIframeSrc = 'http://www.bligoo.com/bligoo/map';
		var pinsVar = this.pinx+"|"+this.piny;
		var currentDate = new Date();
		if ( $('content-geolocalizated-map-'+this.contentId) != null ){
			$('content-geolocalizated-map-'+this.contentId).remove();
		}
		newIframeSrc+= '?action=nextEventBlidgetsMap&pins='+pinsVar+'&configId='+this.blidgetId+'&ver='+currentDate.valueOf();
		var content = "<iframe id='content-geolocalizated-map-"+this.contentId+"' src='"+newIframeSrc+"' frameborder='0' class='content-geolocalizated-map'></iframe>";
		this.mapDisplay.insert({after: content});
	}
});

var ContentPluginClass = Class.create(BligooPluginClass, {
    onPageLoaded: function(event) {
		this.addMP3Players();
		//$$('#highlighted-primary .highlight-body, #highlighted-primary h3').each(function(element) {
		//	element.setOpacity(0.8);
		//});
	}, 
	addMP3Players: function() {
		var i = 0;
		$$('#bligoo-site-wrapper .content-body a').each(function(link) {
			var match = /\.mp3$/i.exec(link.href);
		    if (match != null && match.length > 0) {
		    	 var id = 'flash-mp3-player-' + i;
	                var span = new Element('span');
	                span.update('<object class="bligoo-mp3-button-player" type="application/x-shockwave-flash" width="20" height="20" data="/static/swf/musicplayer.swf?song_url=' + link.href + '">'     
	                            + '<param name="movie" value="/static/swf/musicplayer.swf?song_url=' + link.href + '" />'
								+ '<param name="wmode" value="transparent"></param>'
								+ '<embed class="bligoo-mp3-button-player" src="/static/swf/musicplayer.swf?song_url=' 
									+ link.href + '" wmode="transparent" type="application/x-shockwave-flash" width="20" height="20"></embed>'
	                            + '</object>');
	
	                link.insert({before: span});
	                i++;
		    }
		});
	}
});


function enableContentMap(contentId, x, y, baseUrl){
	new ContentGeolocalizatedMap(contentId, x, y, baseUrl);
}


PluginManager.add(new ContentPluginClass());
var SpreadAppletClass = Class.create({
	initialize: function(applet, bar) {
		applet.observe('click', function(e) {
			var window = new BligooWindow('diffusion-site', {
					first: 'windowDiffusionSite'
					, module: 'Diffusion'
					, width: 520
					, height: 150
				});
				window.show();
			//document.location.href='/bligoo/bligoo?path=diffusion/site#diffusion-form'
		});
    }
});
var DiffusionPluginClass = Class.create(BligooPluginClass, {
  onBarLeafReplaced: function(event) {
  	if (event.memo == 'mybligoo') {
  		this.observeClick($('mybligoo-action-spread'));
  	}
  }, 
  observeClick: function(item) {
	if ( item != null) {
		item.observe('click', function(e) {
			var window = new BligooWindow('diffusion-site', {
				first: 'windowDiffusionSite'
				, module: 'Diffusion'
				, width: 520
				, height: 150
			});
			window.show();
		});
	}
  },
  onBarInit: function(event) {
	if ($('bligoo-bar-applet-diffusion-spread')) {
		new SpreadAppletClass($('bligoo-bar-applet-diffusion-spread'), event.memo);
	}
  },
  onPageLoaded: function(event) {
	$$('.diffusion-site-block').each(function(e) {
		e.observe('click', function(event) {
			event.stop();
			document.location.href='/diffusion/site#diffusion-form';
		});
	});
  },
  onWindowContentReplaced: function(event) {
	  if (event.memo.window.id == 'bligoo-window-diffusion-post') {
		  if ($('annon-facebook-share')) {
			  $('annon-facebook-share').observe('click', this.openExternalWindow.bindAsEventListener(this, $('annon-facebook-share').getAttribute('data-url')));
		  }
		  if ( $('annon-twitter-share')){
			  $('annon-twitter-share').observe('click', this.openExternalWindow.bindAsEventListener(this, $('annon-twitter-share').getAttribute('data-url')));
		  }
	  }
  },
  openExternalWindow: function(event, url){
	  this.window = window.open(url,'externalservice','width=780,height=400');
  }
});

PluginManager.add(new DiffusionPluginClass());

function openDiffusionSiteWindow(){
	var window = new BligooWindow('diffusion-site', {
		first: 'windowDiffusionSite'
		, module: 'Diffusion'
		, width: 520
		, height: 150
	});
	window.show();
} function copyValuesFromStartToEndDate(){
    $('end-date-disabled-combo').toggle();
    $('end-date-combo').toggle();
    $('has-end-date').value='true';
    
 	var smonth    = $('start-date-combo').getElementsBySelector('[name="edit[start-date-month]"]')[0];
 	var sday      = $('start-date-combo').getElementsBySelector('[name="edit[start-date-day]"]')[0];
 	var syear     = $('start-date-combo').getElementsBySelector('[name="edit[start-date-year]"]')[0];
 	var shour     = $('start-date-combo').getElementsBySelector('[name="edit[start-date-hour]"]')[0];
 	var sminute   = $('start-date-combo').getElementsBySelector('[name="edit[start-date-minute]"]')[0];
 	
 	var emonth  = $('end-date-combo').getElementsBySelector('[name="edit[end-date-month]"]')[0];
 	var eday    = $('end-date-combo').getElementsBySelector('[name="edit[end-date-day]"]')[0];
 	var eyear   = $('end-date-combo').getElementsBySelector('[name="edit[end-date-year]"]')[0];
 	var ehour   = $('end-date-combo').getElementsBySelector('[name="edit[end-date-hour]"]')[0];
  	var eminute = $('end-date-combo').getElementsBySelector('[name="edit[end-date-minute]"]')[0];

  	emonth.value = smonth.value;
 	eday.value = sday.value;
  	eyear.value = syear.value;
  	if ( shour.value < 23 ){
     	var newH = parseInt(shour.value)+1;
  		ehour.value = newH;
  		eminute.value = sminute.value; 
  	}else{
	  	ehour.value = shour.value;
	  	eminute.value = 59; 
  	}
  	return false;
 }
 
 function disableEndDateCombo(){
 	$('end-date-disabled-combo').toggle();
 	$('end-date-combo').toggle();
 	$('has-end-date').value='false';
 	return false;
 }
 
var EventOnBlidget = Class.create({
	initialize: function( blidgetId, x, y, eventDiv, baseUrl ) {
		this.blidgetId = blidgetId;
		this.baseUrl = baseUrl;
		this.pinx = x;
		this.piny = y;
		this.block = $('block-'+blidgetId);
		this.eventDiv = eventDiv;
		this.eventDiv.observe('click', this.goToMapPin.bindAsEventListener(this));
	},
	goToMapPin: function(e){
		var newIframeSrc = 'http://www.bligoo.com/bligoo/map';
		var pinsVar = this.pinx+"|"+this.piny;
		var currentDate = new Date();
		if ( $('next-event-blidget-'+this.blidgetId+'-map') != null ){
			$('next-event-blidget-'+this.blidgetId+'-map').remove();
		}
		newIframeSrc+= '?action=nextEventBlidgetsMap&pins='+pinsVar+'&configId='+this.blidgetId+'&ver='+currentDate.valueOf();
		var content = "<iframe id='next-event-blidget-"+this.blidgetId+"-map' src='"+newIframeSrc+"' frameborder='0'></iframe>";
		this.eventDiv.insert({after: content});
		this.enableThisEventDiv();
	},
	enableThisEventDiv: function(){
		var eventsDivList = this.block.select('.event-row');
		if ( eventsDivList != null ){
			for (i=0; i<eventsDivList.length; i++){
				var eventDiv = eventsDivList[i];
				if ( eventDiv.id == 'pin:'+this.pinx+"|"+this.piny ){
					eventDiv.select('a.view-map-link')[0].hide();
				}else{
					eventDiv.select('a.view-map-link')[0].show();
				}
			}
		}
	}
});
 
function enableNextEventsMapNavigation(blidgetId, baseUrl){
	var blidget = $('block-'+blidgetId);
 	if ( blidget == null ){
 		return;
 	} 	
 	blidget.select('div.event-row a.view-map-link').each(function (item){
 		var eventId = item.id;
 		var eventIdSplit = eventId.split(':');
 		var pin = eventIdSplit[1];
 		var pinSplit = pin.split('|');
 		new EventOnBlidget(blidgetId, pinSplit[0], pinSplit[1], item, baseUrl);
 	});
}
 
var NextEventsBligooBlockClass = Class.create({
	initialize: function( divArea, posibleLocationsArea ) {
		this.divArea = divArea;
		this.posibleLocationsArea = posibleLocationsArea;
		this.eventCount = this.divArea.getAttribute('bligoo-event-count');
		this.divArea.setStyle('height: 300px; width: 100%;');
		this.map = new GMap2(this.divArea, {mapTypes:[G_NORMAL_MAP]});
      	this.map.setCenter(new GLatLng(34, 0), 1);
      	this.map.addControl(new GSmallMapControl());
		if ( divArea != null ){
			if ( divArea.getAttribute("bligoo-google-location") != null ){
				this.param = divArea.getAttribute("bligoo-google-location");
				this.mode = 'googlelocation';
			}
			if ( divArea.getAttribute("bligoo-tag") != null ) {
				this.param = divArea.getAttribute("bligoo-tag");
				this.mode = 'tag';
			}
			if ( divArea.getAttribute("bligoo-country") != null ){
				this.param = divArea.getAttribute("bligoo-country");
				this.mode = 'country';
			}
			this.initWork();
	    }
	},
	initWork: function(){
		if ( this.mode == 'country' || this.mode == 'tag'){
			geocoder = new GClientGeocoder();
	      	geocoder.getLocations(this.param, this.parseBligooResponse.bind(this));
	      	return;
		}
		auxLocations = this.param.split(',');
		this.mapCenterLatitude = auxLocations[0];
		this.mapCenterLongitude = auxLocations[1];
		this.mapZoom = this.calculateZoom(auxLocations[2]);
		this.drawMap();
	},
	parseBligooResponse: function(response){
		if (!response || response.Status.code != 200) {
			this.drawWorldView();
		}else{
			if ( this.mode == 'country' ){
				var country = null;
				for ( var i=0; i<response.Placemark.length; i++){
					var place = response.Placemark[i];
					if ( place.AddressDetails.Accuracy == 1 ){
						this.mapCenterLatitude = place.Point.coordinates[1];
						this.mapCenterLongitude = place.Point.coordinates[0];
						this.mapZoom = 3;
						this.drawMap();
						return;
					}
				}
				this.drawWorldView();
			}else if ( this.mode == 'tag' ) {
				var posibleLocations = Builder.node('div', {'id': 'bligoo-next-event-posible-locations'});
				var first = true;
				this.tagLocationSelected = false;
				for ( var i=0; i<response.Placemark.length; i++){
					var place = response.Placemark[i];
					if ( place.AddressDetails.Accuracy <= 4 ){
						if ( first == true ){
							first = false;
							this.mapCenterLatitude = place.Point.coordinates[1];
							this.mapCenterLongitude = place.Point.coordinates[0];
							this.mapZoom = this.calculateZoom(place.AddressDetails.Accuracy);
							this.tagLocationSelected = true;
						}
						link = Builder.node('a', {'href': location.href+'&bligoo-tags-location='+place.Point.coordinates[1]+','+place.Point.coordinates[0]+','+place.AddressDetails.Accuracy}, place.address);
						pageBreak = Builder.node('br', {'class': 'clear'});
						posibleLocations.appendChild(link);
						posibleLocations.appendChild(pageBreak);
					}
				}
				if ( this.tagLocationSelected == true ){
					this.posibleLocationsArea.appendChild(posibleLocations);
					this.drawMap();
				}else{
					this.drawWorldView();
				}
				return;
			}
		}
	},
	drawWorldView: function(){
		this.map.setCenter(new GLatLng(0, 0), 0);
		this.getGeolocalizedContentAround();
	},
	drawFailCountry: function(){
		alert('No encontre el pais! '+this.param);
	},
	drawMap: function(){
		var point = new GLatLng(this.mapCenterLatitude, this.mapCenterLongitude );
		this.map.setCenter(point, this.mapZoom);
		this.getGeolocalizedContentAround();
	},
	calculateZoom: function (acc){
		if ( acc == 1 ){
			return 3;
		}else{
			if ( acc + 3 <= 14 ){
				return acc+3;
			}
			return 14;
		}	
	},
	getGeolocalizedContentAround: function(){
    	var bounds = this.map.getBounds();
		var southWest = bounds.getSouthWest();
		var northEast = bounds.getNorthEast();
		
		var maxLongitude = northEast.lng();
		var maxLatitude = northEast.lat();
		var minLongitude = southWest.lng();
		var minLatitude = southWest.lat();
		
		new Ajax.Request('/bligoo/ajaxproxy', 
    				{	
    					method: 'getGeolocalizedContent'
    					, parameters: {minLatitude: minLatitude, maxLatitude: maxLatitude, minLongitude: minLongitude, maxLongitude: maxLongitude, mapBlogId: 0, mapContentType: 'Event', mapTag: '', itemCount: this.eventCount}
    					, onComplete: this.addMarkers.bind(this)
    				});
		return;	
    },
    addMarkers: function(transport){
    	var a = transport.responseText.evalJSON();
    	var eventCount = 0;
   		var eventContent = "";    	
    	for (var i=0; i<a.length; i++){
    		var event = a[i];
    		this.addPinToMap(event.x, event.y, event.title, false);
    	}
    },
    addPinToMap: function(x,y,title, centerOnThis){
		var point = new GLatLng(x,y);
		if ( centerOnThis == 1 ){
			this.map.setCenter(point, 11);
		}
		var tinyIcon = new GIcon();
		tinyIcon.image = "/static/images/event-marker.png";		
		tinyIcon.shadow = "/static/images/event-marker-shadow.png";
		tinyIcon.iconSize = new GSize(20, 27);
		tinyIcon.shadowSize = new GSize(32, 20);
		tinyIcon.iconAnchor = new GPoint(6, 20);
		tinyIcon.infoWindowAnchor = new GPoint(5, 1);
		
		var marker = new GMarker(point, { icon:tinyIcon });
		GEvent.addListener(marker, "click", function() {
        	var modHtml = unescape(title);
        	modHtml = modHtml.replace(/\+/g, ' ');
        	modHtml = modHtml.replace(/http:\//g,'http://');
          	marker.openInfoWindowHtml(modHtml);
        });
		this.map.addOverlay(marker);		
    }
});

var EventPluginController = Class.create({
	initialize: function(button){
		this.button = button;
		this.title = $('event-title');
	},
	open: function() {
	},
	parentClose: function(){
		var title = $('input-title');
		if (title && this.title && title.value == '') {
			title.value = this.title.value;
		}
	}
});

var EventsPluginClass = Class.create(BligooPluginClass, {
	onPageLoaded: function(event) {
		if ($('bligoo-next-event-block') != null ){
			new NextEventsBligooBlockClass($('bligoo-next-event-block'), $('bligoo-next-event-posiblelocations'));
		}
	},
	onWindowContentReplaced: function(event) {
		if (event.memo.window.id == 'activate-event') {
			//event.memo.window.select('.bligoo-tabbed-pane').each(function (pane) {
			//	new BligooTabbedPane(pane);
		}
	}
});

PluginManager.add(new EventsPluginClass());
var SubscribeAppletClass = Class.create({
	initialize: function(link, bar) {
		link.observe('click', this.click.bindAsEventListener(this));
	},
	click: function(event) {
		Profile.communitySubscribe({ email: '', url: '', userId: ''});
	}
});

function initPermits() {
	$$('#bligoo-bar-menu-item-people-groups-groups-edit .parent-permit-check').each(function(check) {
			var checkId = check.id.substring(22);
			if ($('parent-permit-' + checkId)) {
	  			if (check.checked) {
	  				$('parent-permit-' + checkId).show();
	  			} else {
	  				$('parent-permit-' + checkId).hide();
	  			}
  			}
	  		check.observe('click', function(e) {
				var id = e.target.id.substring(20);
				if ($('parent-permit-' + id)) {
					$('parent-permit-' + id).toggle(); 
				}
				if (!e.target.checked) {
					$$('.child-permit-check-' + id).each(function(child) { 
							child.checked = false; 
							child.disabled = true;
						});
				} else {
					$$('.child-permit-check-' + id).each(function(child) { 
							child.disabled = false;
						});
				}
	  		});
	  });
}


var MembersManager = Class.create({
	initialize: function() {
		if ($('bligoo-filter-mark-all') != null ) {
			$('bligoo-filter-mark-all').observe('click', this.markAll.bindAsEventListener(this));
		}
		if ($('bligoo-filter-mark-none') != null) {
			$('bligoo-filter-mark-none').observe('click', this.markNone.bindAsEventListener(this));
		}
	},
	markAll: function() {
		$$('.manage-member-user-list-item input').each(function(e) { e.checked = true; }); 
	},
	markNone: function() {
		$$('.manage-member-user-list-item input').each(function(e) { e.checked = false; }); 
	}
});


var CommunityPeopleSearch = Class.create({
	initialize: function(userSelectables, bligooBar) {
		this.itemsList = $$('#bligoo-bar-item-content .bligoo-bar-user-itemwrapper');
		this.items = new Array();
		this.userSelectables = userSelectables;
		if ( this.itemsList != null ){
			var i=0;
			this.itemsList.each(function (item){
				this.items[i] = new CommunityPeopleItem(item,this.userSelectables, bligooBar);
				i++;
			}.bind(this));
		}
	}
});

var CommunityPeopleItem = Class.create({
	initialize: function(item, userSelectables, bligooBar) {
		this.item = item;
		this.bligooBar = bligooBar;
		this.userSelectables = userSelectables;
		this.userId = item.getAttribute('bligooUserId');
		this.enableCheckbox();
		this.selected = this.item.hasClassName('bligoo-bar-user-itemwrapper-selected');
		this.searchForLinks();	
		this.searchForIcon();
		if (this.userSelectables && this.addChk != null && this.remChk != null){
			this.item.observe('mouseover', this.over.bind(this));
			this.item.observe('mouseout', this.out.bind(this));
			this.item.observe('click', this.click.bind(this));
		}
		this.busy = false;
	},
	searchForIcon: function(){
		var icon = this.item.select('.members-user-item-icon').first();
		if (icon != null ){
			this.icon = icon;
			if ( this.selected ){
				this.icon.show();
			}
		}
	},
	enableCheckbox: function(){
		var addChk = this.item.select('input.add').first();
		if ( addChk != null ){
			this.addChk = addChk;
		}else{
			this.addChk = null;
		}
		var remChk = this.item.select('input.remove').first();
		if ( remChk != null ){
			this.remChk = remChk;
		}else{
			this.remChk = null;
		}
	},
	out: function(event){
		this.item.removeClassName('bligoo-bar-user-itemwrapper-over');
	},
	over: function(event){
		this.item.addClassName('bligoo-bar-user-itemwrapper-over');
	},
	click: function(event){
		if ( this.selected ){
			this.selected = false;
			this.item.removeClassName('bligoo-bar-user-itemwrapper-selected');
			if ( this.addChk != null ){
				this.addChk.checked = false;
			}
			if ( this.remChk != null ){
				this.remChk.checked = true;
			}
			if ( this.icon != null ){
				this.icon.hide();
			}
			
		}else{
			this.selected = true;
			this.item.addClassName('bligoo-bar-user-itemwrapper-selected');
			if ( this.addChk != null ){
				this.addChk.checked = true;
			}
			if ( this.remChk != null ){
				this.remChk.checked = false;
			}
			if ( this.icon != null ){
				this.icon.show();
			}
		}
	},
	searchForLinks: function(){
		this.item.select('.profile-view-actions .members-user-item-action').each(function (action){
			if ( action.hasClassName('members-user-action-contact-remove' )){
				action.observe('click', this.removeContact.bind(this));
			}
			if ( action.hasClassName('members-user-action-contact-add' )){
				action.observe('click', this.addContact.bind(this));
			}
			if ( action.hasClassName('members-user-action-write-message' )){
				action.observe('click', this.composeMessage.bind(this));
			}
			if ( action.hasClassName('members-user-action-view-profile')){
				action.observe('click', this.viewProfile.bindAsEventListener(this, action));
			}
		}.bind(this));
	},
	removeContact: function(){	
		if ( !this.busy ){
			this.busy = true;
			this.item.startWaiting('waiting');				
			new Ajax.Request(
				'/bligoo/ajaxproxy', {
					method: 'userContactRemove'
					, parameters: {userId: this.userId}
					, onSuccess: this.refreshActions.bind(this)});
		}
	},
	addContact: function(){
		if ( !this.busy ){
			this.busy = true;
			this.item.startWaiting('waiting');		
			new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'userContactAdd'
				, parameters: {userId: this.userId}
				, onSuccess: this.refreshActions.bind(this)});
		}
	},
	composeMessage: function(){
		BligooBar.openPath('messages', $H({'reply-userId': this.userId, 'return-to': 'people/search'}));
	},
	refreshActions: function(transport){
		actionsArea = this.item.select('.profile-view-actions').first();
		if ( actionsArea != null ){
			actionsArea.update(transport.responseText);
		}
		this.searchForLinks();	
		this.item.stopWaiting();
		new Effect.Highlight(this.item, { startcolor: '#88b6da',endcolor: '#ffffff', afterFinish: function(){
			this.busy = false;
		}.bind(this)});
	},
	viewProfile: function(e, actionItem){
		this.bligooBar.panel.startWaiting();
		location.href = actionItem.getAttribute("urlLink");
	}
});

var GroupPluginClass = Class.create(BligooPluginClass, {
	onBarLeafReplaced: function(event) {
		if (event.memo == 'people/groups/groups/edit') {
			initPermits();
		} else if (event.memo == 'people/groups/groups') {
			new DeleteItemHelperClass('bligoo-bar-menu-item-people-groups-groups', 'people/groups/groups/delete');
		} else if (event.memo == 'mybligoo') {
			if ($('mybligoo-action-community-subscribe') != null) {
				$('mybligoo-action-community-subscribe').observe('click', function(e) {Profile.communitySubscribe({ email: '', url: '', userId: ''});});
			} else if ($('mybligoo-action-community-unsubscribe') != null) {
				$('mybligoo-action-community-unsubscribe').observe('click', function(e) {
					var text = $('mybligoo-action-community-unsubscribe').getAttribute("bligooText");
					var button = $('mybligoo-action-community-unsubscribe').getAttribute("bligooOkButton");
					var window = new BligooWindow('community-unsubscribe', {
						first: 'communityUnsubscribeWindow'
						, module: 'Group'
						, width: 460
						, height: 300
						, finalFunction: function () {
							new BligooSiteReloaderClass('/', 60, text, button, '');
						}
					});
					window.show();
				});
			}
		} else if (event.memo == 'people/search'){
			new CommunityPeopleSearch(false, BligooBar);
		} else if (event.memo == 'people/manage/suspended' 
					|| event.memo == 'people/manage/authors' 
					|| event.memo == 'people/manage/editors' 
					|| event.memo == 'people/manage/administrators'){
			new CommunityPeopleSearch(true, BligooBar);
		} 
	},
	onBarInit: function(event) {
		if ($('bligoo-bar-applet-subscribe')) {
			new SubscribeAppletClass($('bligoo-bar-applet-subscribe'), event.memo);
		}
	}
	/*,
	onPageLoaded: function() {
		$$('#explora-page-center tr').each(function(element){
			element.observe('mouseover', this.showActions.bindAsEventListener(this, element));
			element.observe('mouseout', this.hideActions.bindAsEventListener(this, element));
		}.bind(this));
	},
	showActions: function(event, element) {
		$(element).select('.profile-view-actions')[0].show();
	},
	hideActions: function(event, element) {
		$(element).select('.profile-view-actions')[0].hide();
	}*/
	
});

PluginManager.add(new GroupPluginClass());var LogoutAppletClass = Class.create({
	initialize: function(applet, bar) {
		applet.observe('click', function(e) {document.location.href='/bligoo/bligoo?path=logout'});
    }
});

var BligooCTA = Class.create({
	initialize: function(element) {
		this.element = element;
		this.language = element.getAttribute('bligooLang');
		this.imageId = element.getAttribute('bligooImageId');
		this.prefix = element.getAttribute('bligooPrefix');
		this.element.observe('mouseover', this.mouseOver.bindAsEventListener(this));
		this.element.observe('mouseout', this.mouseOut.bindAsEventListener(this));
	},
	mouseOver: function(event) {
		this.element.removeClassName(this.prefix + '-' + this.imageId + '-' + this.language);
		this.element.addClassName(this.prefix + '-' + this.imageId + '-' + this.language + '-hover');
	},
	mouseOut: function(event) {
		this.element.removeClassName(this.prefix + '-' + this.imageId + '-' + this.language + '-hover');
		this.element.addClassName(this.prefix + '-' + this.imageId + '-' + this.language);
	}
});

var MenuPluginClass = Class.create(BligooPluginClass, {
	onBarInit: function(event){
		if ($('bligoo-bar-applet-logout')) {
			new LogoutAppletClass($('bligoo-bar-applet-logout'), event.memo);
		}
	},
	onPageLoaded: function(event) {
	 	$$('.country-selector-menu-item').each(function(item) {
	 		new HoverClass(item, 'country-selector-menu-item-over');
	    });
	    if ($('bligoo-login-banner-cta')) {
	    	new BligooCTA($('bligoo-login-banner-cta'));
	    }
	    if ($('bligoo-login-banner-register-cta')) {
	    	new BligooCTA($('bligoo-login-banner-register-cta'));
	    }
	    var exploraMenu = $$('.bligoo-explore-side-menu').first();
	    if (exploraMenu != null ){
	    	this.markSelectedExploraMenu(exploraMenu);
	    }
	    if ( $('bligoo-footer-container') ){
	    	this.drawExploraFooter($('bligoo-footer-container'));
	    }
	    //this.initTalkiBlocks();
	},
	drawExploraFooter: function(box){
		new Ajax.Request('/bligoo/ajaxproxy', {
			method : "drawTranslation"
			, parameters : {key: 'MenuBean.text.explore.footer', lang: userLanguage}
			, onSuccess : function(transport){
				box.update(transport.responseText);
			}.bindAsEventListener(this, box)
		});	
	},
	onBarLeafReplaced: function(event) {
		if (event.memo == 'mybligoo') {
			$$('.mybligoo-action').each(function(button) {
				new HoverClass(button, 'mybligoo-action-hover');
			});
		}
	},
	markSelectedExploraMenu: function(menuWrapper){
		var actualPath = location.pathname;
		menuWrapper.select('li a').each(function(link){
			//link.removeClassName('selected');
			if (link.pathname == actualPath ){
				link.addClassName('selected');
			}
		}.bind(this));
	}
});

PluginManager.add(new MenuPluginClass());

/* ****************** MENU HORIZONTAL ***************** */
var Menu = Class.create({
	initialize: function(idOrElement, closeDelayTime) {
		if ( $(idOrElement) == null ){
			return;
		}
		this.type = "menu";
		this.closeDelayTimer = null;
		this.closingMenuItem = null;
		this.closeDelayTime = closeDelayTime;
		this.collapseBorders = true;
		this.quickCollapse = true;
		this.rootContainer = new MenuContainer(idOrElement, this);
		if ( this.openChild ) {
			this.openChild.openItemBack();
		}
	}
});

var MenuContainer = Class.create({
	initialize: function(idOrElement, parent) {
		this.type = "menuContainer";
  		this.menuItems = [];
		this.init(idOrElement, parent);
	},
	init: function(idOrElement, parent) {
		this.element = $(idOrElement);
		this.parent = parent;
		this.parentMenu = (this.type == "menuContainer") ? ((parent) ? parent.parent : null) : parent;
		this.root = parent instanceof Menu ? parent : parent.root;
		this.id = this.element.id;

		if (this.type == "menuContainer") {
			if (this.element.hasClassName("level1")) this.menuType = "horizontal";
			else if (this.element.hasClassName("level2")) this.menuType = "dropdown";
			else this.menuType = "flyout";

	    	if (this.menuType == "flyout" || this.menuType == "dropdown") {
	      		this.isOpen = false;
		  		Element.setStyle(this.element,{
	      			position: "absolute",
			      	top: "0px",
	    		  	left: "0px",
	      			visibility: "hidden"});
		    } else {
				this.isOpen = true;
			}
		} else {
	    	this.isOpen = this.parentMenu.isOpen;
		}

		var childNodes = this.element.childNodes;
		if (childNodes == null) return;
		
		for (var i = 0; i < childNodes.length; i++) {
			var node = childNodes[i];
		    if (node.nodeType == 1) {
		    	if (this.type == "menuContainer") {
		        	if (node.tagName.toLowerCase() == "li") {
		         		this.menuItems.push(new MenuItem(node, this));
		        	}
		      	} else {
		        	if (node.tagName.toLowerCase() == "ul") {
		          		this.subMenu = new MenuContainer(node, this);
		        	}
				}
		    }
		}
	},
	getBorders: function(element) {
	  var ltrb = ["Left","Top","Right","Bottom"];
	  var result = {};
	  for (var i = 0; i < ltrb.length; ++i) {
	    if (this.element.currentStyle)
	      var value = parseInt(this.element.currentStyle["border"+ltrb[i]+"Width"]);
	    else if (window.getComputedStyle)
	      var value = parseInt(window.getComputedStyle(this.element, "").getPropertyValue("border-"+ltrb[i].toLowerCase()+"-width"));
	    else
	      var value = parseInt(this.element.style["border"+ltrb[i]]);
	    result[ltrb[i].toLowerCase()] = isNaN(value) ? 0 : value;
	  }
	  return result;
	},

	open: function() {
	  if (this.root.closeDelayTimer) window.clearTimeout(this.root.closeDelayTimer);
	  this.parentMenu.closeAll(this);
	  this.isOpen = true;
	  if (this.menuType == "dropdown") {
		Element.setStyle(this.element,{
			left: (Position.positionedOffset(this.parent.element)[0]) + "px",
			top: (Position.positionedOffset(this.parent.element)[1] + Element.getHeight(this.parent.element)) + "px"
		});
	  } else if (this.menuType == "flyout") {
	    var parentMenuBorders = this.parentMenu ? this.parentMenu.getBorders() : new Object();
	    var thisBorders = this.getBorders();
		Element.setStyle(this.element,{
    		left: (this.parentMenu.element.offsetWidth - parentMenuBorders["left"] - (this.root.collapseBorders ?  Math.min(parentMenuBorders["right"], thisBorders["left"]) : 0)) + "px"
		});
		if ( this.menuItems[0] != null && this.menuItems[0].element != null ){
			Element.setStyle(this.element,{
		    	top: (this.parent.element.offsetTop - parentMenuBorders["top"] - this.menuItems[0].element.offsetTop) + "px"
			});
		}
	  }
	  Element.setStyle(this.element,{visibility: "visible"});
	},
	close: function() {
		Element.setStyle(this.element,{visibility: "hidden"});
		this.isOpen = false;
		this.closeAll();
	},
	closeAll: function(trigger) {
		for (var i = 0; i < this.menuItems.length; ++i) {
			this.menuItems[i].closeItem(trigger);
		}
	},
	openBack: function(){
		this.open();
		if (this.parent ){
			if (this.parent.type == 'menuContainer'){
				this.parent.openBack();
			}else if (this.parent.type == 'menuItem'){
				this.parent.openItemBack();
			}
		}		
	}
});

var MenuItem = Class.create(MenuContainer, {
	initialize: function(idOrElement, parent) {
		var menuItem = this;
		this.type = "menuItem";
		this.subMenu;
		this.init(idOrElement, parent);
		if (this.subMenu) {
			this.element.onmouseover = function() {
				menuItem.subMenu.open();
			}
		} else {
			if (this.root.quickCollapse) {
				this.element.observe('mouseover', function(e){this.parentMenu.closeAll();}.bind(this));
			}
		}
		var linkTag = this.element.getElementsByTagName("A")[0];
		if (linkTag) {
			linkTag.onfocus = this.element.onmouseover;
			this.link = linkTag;
			this.text = linkTag.text;
			this.checkCurrentUrl(linkTag.href);
		}
		if (this.subMenu) {
			this.element.observe('mouseout', function(e){
				if (menuItem.root.openDelayTimer){
					window.clearTimeout(menuItem.root.openDelayTimer);
				}
		  		if (menuItem.root.closeDelayTimer){
		  			window.clearTimeout(menuItem.root.closeDelayTimer);
		  		}
		  		menuItem.root.closingMenuItem = this;
		  		menuItem.root.closeDelayTimer = window.setTimeout(function(e){
		  				this.subMenu.close();
		  			}.bind(this), menuItem.root.closeDelayTime);
			}.bind(this));
		}
	},
	checkCurrentUrl: function(url){
		/*
		var fullUrl = location.href;
		var i = fullUrl.indexOf('//');
		var strippedUrl = fullUrl.substring(i+2);
		i = strippedUrl.indexOf('/');
		var path = '/';
		if ( i >= 0 ){
			path = strippedUrl.substring(i+1);
		}*/
		if ( location.href == url ){
			this.element.addClassName('menu-item-active');
			this.root.openChild = this.menuItem;
		}
	},
	openItem: function() {
	  this.isOpen = true;
	  if (this.subMenu) { this.subMenu.open(); }
	},
	closeItem: function(trigger) {
	  this.isOpen = false;
	  if (this.subMenu) {
	    if (this.subMenu != trigger) this.subMenu.close();
	  }
	},
	openItemBack: function(){
	  if ( this.parent != this.root ){
		  this.parent.openBack();
	  }else{
		  this.element.addClassName('menu-item-selected');
	  }
	}
});
/* ****************** FIN MENU HORIZONTAL ***************** */

/* ****************** MENU VERTICAL ***************** */
var VMenu = Class.create({
	initialize: function(idOrElement) {
		if ( $(idOrElement) == null ){
			return;
		}
		this.type = "menu";
		this.closingMenuItem = null;
		this.collapseBorders = true;
		this.quickCollapse = true;
		this.rootContainer = new VMenuContainer(idOrElement, this);
		if ( this.openChild ) {
			this.openChild.openItemBack();
		}
	}
});

var VMenuContainer = Class.create({
	initialize: function(idOrElement, parent) {
		this.type = "menuContainer";
  		this.menuItems = [];
		this.init(idOrElement, parent);
	},
	init: function(idOrElement, parent) {
		this.element = $(idOrElement);
		this.parent = parent;
		this.parentMenu = (this.type == "menuContainer") ? ((parent) ? parent.parent : null) : parent;
		this.root = parent instanceof VMenu ? parent : parent.root;
		this.id = this.element.id;

		if (this.type == "menuContainer") {
			if (this.element.hasClassName("level1")) this.menuType = "firstLevel";
			else this.menuType = "subLevel";

	    	if (this.menuType == "subLevel") {
	      		this.isOpen = false;
	      		this.element.hide();
		    } else {
				this.isOpen = true;
			}
		} else {
	    	this.isOpen = this.parentMenu.isOpen;
		}

		var childNodes = this.element.childNodes;
		if (childNodes == null) return;
		
		for (var i = 0; i < childNodes.length; i++) {
			var node = childNodes[i];
		    if (node.nodeType == 1) {
		    	if (this.type == "menuContainer") {
		        	if (node.tagName.toLowerCase() == "li") {
		         		this.menuItems.push(new VMenuItem(node, this));
		        	}
		      	} else {
		        	if (node.tagName.toLowerCase() == "ul") {
		          		this.subMenu = new VMenuContainer(node, this);
		        	}
				}
		    }
		}
	},
	openBack: function(){
		this.open();
		if (this.parent ){
			if (this.parent.type == 'menuContainer'){
				this.parent.openBack();
			}else if (this.parent.type == 'menuItem'){
				this.parent.openItemBack();
			}
		}		
	},
	open: function() {
	  	this.isOpen = true;
	  	if (this.menuType == "subLevel") {
			this.element.show();
		}
	},
	close: function() {
		this.element.hide();
		this.isOpen = false;
	},
	closeAll: function(trigger) {
		for (var i = 0; i < this.menuItems.length; ++i) {
			this.menuItems[i].closeItem(trigger);
		}
	}

});

var VMenuItem = Class.create(VMenuContainer, {
	initialize: function(idOrElement, parent) {
		var menuItem = this;
		this.menuItem = this;
		this.type = "menuItem";
		this.subMenu;
		this.init(idOrElement, parent);
		if (this.subMenu) {
			this.openSign();
		} 		
		var linkTag = this.element.getElementsByTagName("A")[0];
		if (linkTag) {
			linkTag.onfocus = this.element.onmouseover;
			this.link = linkTag;
			this.text = linkTag.text;
			this.checkCurrentUrl(linkTag.href);
		}
	},
	checkCurrentUrl: function(url){
		//if (location.href.indexOf(url) > -1 ){
		if ( location.href == url ){
			this.element.addClassName('vmenu-item-active');
			this.root.openChild = this.menuItem;
		}
	},
	openSign: function(){
		this.element.stopObserving('click');
		this.element.removeClassName('vmenu-item-expanded');
		this.element.addClassName('vmenu-item-closed');
		this.element.observe('click', function(e){
			if ($(e.target).tagName.toLowerCase() == "span" &&  $(e.target).up().tagName.toLowerCase() == "a"){
				return;
			}
			e.stop();
			this.menuItem.subMenu.open();
			this.menuItem.closeSign();
		}.bind(this));
	},
	closeSign: function(){
		this.element.stopObserving('click');
		this.element.addClassName('vmenu-item-expanded');
		this.element.removeClassName('vmenu-item-closed');
		this.element.observe('click', function(e){
			if ($(e.target).tagName.toLowerCase() == "span" &&  $(e.target).up().tagName.toLowerCase() == "a"){
				return;
			}
			e.stop();
			this.menuItem.subMenu.close();
			this.menuItem.openSign();
		}.bind(this));	
	},
	openItemBack: function(){
	  this.isOpen = true;
	  if (this.subMenu){
		  this.closeSign();
	  }
	  this.parent.openBack();
	},
	openItem: function() {
	  this.isOpen = true;
	  if (this.subMenu) { 
	  	this.subMenu.open(); 
	  }
	},
	closeItem: function(trigger) {
	  this.isOpen = false;
	  if ( this.sign ){
	  	this.openSign();
	  }
	  if (this.subMenu) {
	    if (this.subMenu != trigger) this.subMenu.close();
	  }
	}
});
/* ****************** FIN MENU VERTICAL ***************** */
ProfileClass = Class.create({
	initialize: function() {
	},
	loadProfileBox: function (id, userId){
	    var placeholder = 'placeholder-' + id;
		new Ajax.Request('/bligoo/ajaxproxy', {
					method: 'getProfileBox'
					, parameters: { configId : id , userId: userId }
					, onSuccess: function(transport){
							if(transport.responseText && transport.responsetText != ''){
								$(placeholder).innerHTML = transport.responseText;
								transport.responseText.evalScripts();
								$(placeholder).ancestors()[2].toggle();
							}
						}
				});
	},
	communitySubscribe: function(params) {
		var window = new BligooWindow('community-subscribe', {
				first: 'windowCommunitySubscribe'
				, module: 'Profile'
				, width: 400
				, height: 400
				, parameters: params
			});
		window.show();
	},
	endSubscription: function(params) {
		if (params) {
			new BligooWindow('community-subscribed', {
				first: 'windowCommunitySubscribeEnd'
				, module: 'Profile'
				, width: 400
				, height: 400
				, parameters: {code: params.code}
			});
		}
	}
});

var Profile = new ProfileClass();

function unconfirmedUserResendCode() {
	var window = new BligooWindow('new-user-wizard',
		{
			first: 'windowUnconfirmedUserAskEmail'
			, module: 'Profile'
			, width: 450
			, height: 400
			, parameters: {}
			, finalFunction: function() { document.location.href='/home'; }
		});
	window.show();
}

function activateCloseAndReload(){
	$$('div#bligoo-window-content-new-user-wizard .bligoo-button-close').first().observe('click', function(){document.location.href='/home';});
}


var ProfileFormManagerClass = Class.create({
	initialize: function(text, ok, cancel) {
		new DeleteItemHelperClass('bligoo-bar-field-list', 'people/profileform/delete');
		var moveDown = this.moveDown.bindAsEventListener(this);
		var moveUp = this.moveUp.bindAsEventListener(this)
		$$('.profile-field-down a').each( function (link){
			link.observe('click', moveDown);
		});
		$$('.profile-field-up a').each( function (link){
			link.observe('click', moveUp);
		});
	},
	moveUp: function(event) {
		var link = event.target;
		var idLink  = event.target.id;
		var idField = idLink.split('-')[1];
		BligooBar.openCallBack('people/profileform/up',{profileFieldId: idField});
	},
	moveDown: function(event) {
		var link = event.target;
		var idLink  = event.target.id;
		var idField = idLink.split('-')[1];
		BligooBar.openCallBack('people/profileform/down',{profileFieldId: idField});
	}
});

var ProfileFieldFormManagerClass = Class.create({
	initialize: function() {
		this.updateFilterCheckbox();
		var change = this.updateFilterCheckbox.bindAsEventListener(this);
		$$('select#profile-field-visibility').each(function(select) { select.observe('change', change);	});
	}, 
	updateFilterCheckbox: function() {
		$$('select#profile-field-visibility').each(function(select) { 
			$$('div#profile-field-filter').each(function(check) {
				if (select.value == 0) {
					check.show();
				} else{
					check.hide();
				}
			});
		});
	}
});


function refreshUserMenu() {
	if ( $('user-menu-wrapper') ){
		$('user-menu-wrapper').startWaiting('bigWaiting');
		new Ajax.Updater('user-menu-wrapper'
			, '/bligoo/ajaxproxy', {
				 method: 'getUserMenu'
				 , onComplete: function(transport) {
				 		$$('#user-menu-wrapper .open-bligoo-window-link').each(function(item) {
							new BligooWindowLink(item);
						});
						$('user-menu-wrapper').stopWaiting();
						new BligooUploadAvatarMessage($('bligoo-avatar-wrapper'), $('bligoo-change-avatar-link'));
				 }
		});
	}
	if ( $('profile-view-account-avatar') ){
		$('profile-view-account-avatar').src = $('profile-view-account-avatar').src+'1';
	}
	if (BligooWindowLink.lastWindow != null) {
		BligooWindowLink.lastWindow.close();
	}
}



function refreshBligooAccount() {
	$('profile-bligoo-account').startWaiting('bigWaiting');
	new Ajax.Updater('profile-bligoo-account'
		, '/bligoo/ajaxproxy', {
			 method: 'profileBligooAccount'
			 , onComplete: function(transport) {
			 		$$('.open-bligoo-window-link').each(function(item) {
						new BligooWindowLink(item);
					});
					$('profile-bligoo-account').stopWaiting();
			 }
	});
	if (BligooWindowLink.lastWindow != null) {
		BligooWindowLink.lastWindow.close();
	}
}

var BligooUploadAvatarMessage = Class.create({
	initialize: function(wrapper, message) {
		this.message = message;
		wrapper.observe('mouseover', this.mouseOver.bindAsEventListener(this));
	    wrapper.observe('mouseout', this.mouseOut.bindAsEventListener(this));
	},
	mouseOver: function(event) {
		this.message.show();
	},
	mouseOut: function(event) {
		this.message.hide();
	}
})

var ProfilePluginClass = Class.create(BligooPluginClass, {
	onBarInit: function(event) {
		var UnconfirmedAppletClass = Class.create({
		initialize: function(link, bar) {
				this.bar = bar;
				link.observe('click', this.open.bindAsEventListener(this));
			},
			open: function(event) {
				this.bar.openPath('unconfirmed');
			}
		});
		
		if ($('bligoo-bar-applet-unconfirmed')) {
			new UnconfirmedAppletClass($('bligoo-bar-applet-unconfirmed'), event.memo);
		}
	},
 	onWindowContentReplaced: function(event) {
	 	if (event.memo.window.id == 'bligoo-window-profile-edit-password' 
	 		|| event.memo.window.id == 'bligoo-window-new-blog-wizard'
			|| event.memo.window.id == 'bligoo-window-new-user-wizard' 
			|| event.memo.window.id == 'bligoo-window-community-subscribe') {
			if ($('new-password-1') != null) {
				new PasswordCheckerClass($('new-password-1'), $('new-password-2'));
			}
		} 
	 	
	 	if (event.memo.window.id == 'bligoo-window-new-blog-wizard') {
			var div = $('author-type-descriptions');
			if (div) {
				new ArrowDescription('author-type-', $('new-blog-author-type-select'), div);
			}
		} 
	 	
	 	if (event.memo.window.id == 'bligoo-window-welcome-window') {
	            if ($('close-welcome-window')) {
	            	$('close-welcome-window').observe('click', function(e, window) {
	                    window.close();            
		            }.bindAsEventListener(this, event.memo));
		        }
	    } 
	 	
	 	if (event.memo.window.id == 'bligoo-window-community-subscribe') {
		 	if ($('profile-geolocalization-googlexy')) {
		    	google.load('maps', '3', {"other_params": "sensor=false&language=" + $('hidden-language').value, "callback" : function(e) {
		    		this.updateGoogleXY();
		    	}.bind(this)});
		 	}
	    } 
 	},
 	updateGoogleXY: function() {
		var googlexy = $('profile-geolocalization-googlexy');
 		var item = google.loader.ClientLocation;
 		if ( item != null ){
 			googlexy.value = item.longitude+","+item.latitude;
 		}
 	},
 	initSubscribeLinks: function() {
		$$('.register-link').each(function(link){
			link.observe('click', this.openRegisterWindow.bindAsEventListener());
		}.bind(this));
 	},
 	onPageLoaded: function(event) {
		this.initSuscribeBlocks();
		this.updateProfile();
		this.initSubscribeLinks();
		if ( $('open-register-window')){
			this.openRegisterWindow();
		}

		if ($('bligoo-new-blog-button') != null ){
			new BligooBlogForm($('new-blog-url'), $('new-blog-domain'), $('bligoo-new-blog-button'), $('bligoo-register-validate-message'));
		}

	    if ($('bligoo-user-action-select')) {
			$('bligoo-user-action-select').observe('change', this.bligooActionChange.bindAsEventListener(this));
	    }
	    if ($('bligoo-change-avatar-link') && !$('bligoo-change-avatar-link').visible()) {
	    	new BligooUploadAvatarMessage($('bligoo-avatar-wrapper'), $('bligoo-change-avatar-link'));
	    }
		
		if ($('bligoo-unconfirmed-user-mark') != null ){
			unconfirmedUserResendCode();
		}
		if ( $('unconfirmed-user-resend-code-button') != null ){
			$('unconfirmed-user-resend-code-button').enable();
			$('unconfirmed-user-resend-code-button').observe('click', function (e){
				unconfirmedUserResendCode();
			});
		}
		if ( $('explore-login-link') != null ){
			$('explore-login-link').observe('click', this.openExploreLoginArea.bindAsEventListener(this, $('explore-login-link')));
		}
		$$('.bligoo-ajax-box').each(function(box){
			this.getAjaxBox(box);
		}.bind(this));
		
		
	},
	getAjaxBox: function(box){
		var count = box.getAttribute('data-count');
		var method = box.getAttribute('data-method');
		if ( method != '' && count != '' ){
			new Ajax.Request('/bligoo/ajaxproxy', {
				method : method
				, parameters : {count : count}
				, onSuccess : this.drawAjaxBox.bindAsEventListener(this, box )
			});
		}
	},
	drawAjaxBox: function(transport, box) {
		var object = transport.responseText.evalJSON();
		box.update(object.full);
	},
	openExploreLoginArea: function(e, link){
		var loginArea = $('login-menu');
		if ( loginArea ){
			if ( !loginArea.visible()){
				link.addClassName('active');
				Effect.BlindDown(loginArea, { duration: 0.3 });
			}else{
				link.removeClassName('active');
				loginArea.hide();
			}
		}
	},
	initSuscribeBlocks: function(wrapper) {
		$$('.suscribe-block').each(function(e) {
			e.observe('click', function(event) {
				event.stop();
				document.location.href='community/sign';
			});
		});
	},
	updateProfile: function() {
		if ($('bligoo-profile-follow-info')) {
			new Ajax.Request('/bligoo/ajaxproxy', {
				 method: 'getProfileFollowInfo'
				 , parameters: {userId: $('bligoo-profile-follow-info').getAttribute('data-user-id'), lang: $('bligoo-profile-follow-info').getAttribute('lang')}
				 , onComplete: this.postUpdateProfile.bind(this)
			 	}
			 );
		}
		if ( $('profile-last-twitter') != null ){
			var box = $('profile-last-twitter');
			var twitterId = box.getAttribute('data-user-twitterid');
			if ( twitterId != null && twitterId != '' ){
				box.update(new Element('script', {src: 'http://twitter.com/statuses/user_timeline/'+twitterId+'.json?callback=drawLastTwitter&amp;count=5'}));
			}
		}
	},
	postUpdateProfile: function(transport) {
		$('bligoo-profile-follow-info').update(transport.responseText);	
		if ($('find-followers-diffusion')) {
			$('find-followers-diffusion').observe('click', function(e) {
				var window = new BligooWindow('diffusion-site', {
					first: 'windowDiffusionSite'
					, module: 'Diffusion'
					, width: 460
					, height: 440
				});
				window.show();
			});
		}
	},
	bligooActionChange: function(event) {
		if (event.target.value == 0 || event.target.value == '0') {
			return;
		}
		document.location.href = '/' + event.target.value;
	},
	openRegisterWindow: function(event) {
		var window = new BligooWindow('new-user-wizard', {
				first: 'windowNewUserWizardStart'
				, module: 'Profile'
				, width: 400
				, height: 150
				, cancelMessage: $('bligoo-register-cancel-message').value
				, finalFunction: function() { document.location.href='/home'; }
			});
		window.show();
		if (event) {
			event.stop();
		}
	}
});

function drawLastTwitter(jsonObject){
	if ( jsonObject.length > 0 ){
		var obj = jsonObject[0];
		var txt = obj.text;
		var tdate = obj.created_at;
		var splitDate = tdate.split(' ');
		
		var day = splitDate[2];
		var monthNum = '';
		var month = monthToNumbers[splitDate[1]];
		var year = splitDate[5];
		var timeSplit = splitDate[3].split(':');
		var hour = timeSplit[0];
		var minutes = timeSplit[1];
		
		var ptwms = Date.UTC(year, month, day, hour, minutes, 0);
		//var ptwms = Date.parse(tdate);
		
		var twitt = txt + ', <span class="last-twitter-date"><a href="http://www.twitter.com/'+obj.user.screen_name+'">'+formatTimeAgo(ptwms)+'</a></span>';
		$('profile-last-twitter').update(twitt);
		$('profile-last-twitter-wrapper').addClassName('enabled');
		$('profile-last-twitter-wrapper').show();
	}
}

var ArrowDescription = Class.create({
	initialize: function(prefix, select, div) {
		this.select = select;
		this.prefix = prefix;
		this.tips = div.select('.description-text-wrapper');
		this.select.observe('change', this.change.bindAsEventListener(this));
	},
	change: function(event) {
		var value = this.select.value;
		this.tips.each(function(tip) {
			if (tip.id == 'description-' + this.prefix + value) {
				tip.show();
			} else {
				tip.hide();
			}
		}.bind(this));
	}
});


var BligooBlogForm = Class.create({
	initialize: function(input, select, button, message ){
		this.input = input;
		this.select = select;
		this.button = button;
		this.message = message;
		this.input.focus();
		this.input.observe('keyup', this.keyUp.bindAsEventListener(this));
		this.select.observe('change', this.keyUp.bindAsEventListener(this));
		this.button.observe('click', this.check.bindAsEventListener(this));
	},
	keyUp: function(event) {
		if (event.keyCode == 13) {
			this.check();
			return;
		}
		this.input.setStyle({'background': '#ffffff'});
		this.button.enable();
		this.input.removeClassName('checking-field');
		this.message.update('');
	},
	check: function() {
		this.input.removeClassName('checking-field');
		this.input.removeClassName('field-error');
		if (this.input.value == null || this.input.value.strip() == '') {
			return;
		}
		this.input.addClassName('checking-field');
		this.button.startWaiting();
		new Ajax.Request('/bligoo/ajaxproxy', {
					method: 'testBlogAddress'
					, parameters: { url: this.input.value, domain: this.select.value }
					, onSuccess: this.processResponse.bind(this)
				});
	},
	processResponse: function(transport){
		this.button.stopWaiting();
		this.message.update('');
		this.input.removeClassName('checking-field');
		this.input.removeClassName('field-error');
		var result = transport.responseText.evalJSON();
		this.button.disable();
		if (result.error == null) {
			this.newBlogWizardSkip(this);
			this.button.enable();
		} else {
			this.message.update(result.error);
			this.input.addClassName('field-error');
		}
	},
	newBlogWizardSkip: function() {
		var url = this.input.value;
		var domain = this.select.value;
		var window = new BligooWindow('new-blog-wizard', {
			first: 'windowNewBlogWizardRequiredInfo'
			, module: 'Blog'
			, width: 500
			, height: 380
			, cancelMessage: $('bligoo-register-cancel-message').value
			, parameters: {'window-error-back-step': 'windowNewBlogWizardBasicInfo', 'new-blog-url': url, 'new-blog-domain': domain}
			, finalFunction: function() { document.location.href='/home'; }
		});
		window.show();
	}
	
});


var profilePlugin = new ProfilePluginClass();
PluginManager.add(profilePlugin);


function manualOpenRegisterWindow(lang){
	var window = new BligooWindow('new-user-wizard', {
		first: 'windowNewUserWizardStart'
		, module: 'Profile'
		, width: 400
		, height: 150
		, finalFunction: function() { document.location.href='/'; }
	});
	window.show();
}
function getFeedForBlidget(blidgetId, url, numEntries) {
	var container = document.getElementById('rss-box-content-'+blidgetId);
	var feedControl = new google.feeds.FeedControl();
	feedControl.addFeed(url, "");
	feedControl.setNumEntries(numEntries);
	feedControl.draw(container);
}


function updateEventDiv(content, divId){
	if ( $(divId) != null ){
		$(divId).innerHTML = content;
	}
}

var VocabularyHelperClass = Class.create({
	initialize: function(id, terms) {
		this.element = $(id);
		this.check = $('inFrontPage');
		if (this.element != null && this.check != null) {
			this.element.observe('change', this.change.bindAsEventListener(this));
			this.terms = terms;
		}
	}, 
	change: function() {
		var options = this.element.options;
		var i = 0;
		for (; i < options.length; i++) {
			var j = 0;
			for (; j < this.terms.length; j++) {
				if (options[i].value == this.terms[j] && options[i].selected) {
					this.check.checked = true;
					return;
				}
			}
		}
	}
});

var ContentCategoriesHelperClass = Class.create({
	initialize: function(confirmTxt) {
		this.confirmTxt = confirmTxt;
		this.listArea = $('bligoo-bar-category-list');
		this.enableSingleDeleteButtons();
	},
	enableSingleDeleteButtons: function(){
		this.listArea.select('.bligoo-bar-category-list-item .bligoo-bar-category-list-item-buttons img').each(function (image){
			new CrossImage(image, this.categoryDelete.bindAsEventListener(this));
		}.bindAsEventListener(this));
	},
	categoryDelete: function(e){
		if ( confirm(this.confirmTxt) ){
			var img = $(e.target);
			var idSplit = img.id.split('-');
			var categoryId = idSplit[idSplit.length-1];
			BligooBar.openCallBack('content/category/delete',{categoryId: categoryId});
		}
	}
});

var ContentCategorieTermsHelperClass = Class.create({
	initialize: function(confirmTxt) {
		this.confirmTxt = confirmTxt;
		this.listArea = $('bligoo-bar-category-terms');
		this.enableSingleDeleteButtons();
	},
	enableSingleDeleteButtons: function(){
		this.listArea.select('.bligoo-bar-category-terms-term img').each(function (image){
			new CrossImage(image, this.termDelete.bindAsEventListener(this));
		}.bindAsEventListener(this));
	},
	termDelete: function(e){
		if ( confirm(this.confirmTxt) ){
			var img = $(e.target);
			var idSplit = img.id.split('-');
			var termId = idSplit[idSplit.length-1];
			BligooBar.openCallBack('content/category/edit/deleteterm',{termId: termId});
		}
	}
});

var TagImageCarrouselClass = Class.create({
	initialize: function(blockId, data, autoSlideDelay, height){
		this.blockId = blockId;
		this.data = data;
		this.autoSlideDelay = autoSlideDelay;
		this.height = height;
		this.contentContainer = $('carrousel-main-content-'+this.blockId);
		this.contentContainer.setStyle('height: '+this.height+'px;');
		this.leftArrow =  $('carrousel-left-arrow-'+this.blockId);
		this.rightArrow =  $('carrousel-right-arrow-'+this.blockId);
		this.imageIndex = $('carrousel-index-'+this.blockId);
		this.useArrows = true;
		if ( this.imageIndex != null ){ 
			this.useArrows = false;
		}
		this.contentContainerWidth = this.contentContainer.getWidth();
		this.contentContainerHeight = height;
		this.currentContent = 0;
		this.isBusy = false;
		if ( data != null ){
			this.contentArray = new Array();
			this.processData();
			if ( this.useArrows){ 
				this.enableArrows();
			}else{
				this.enableIndex();
			}
			if ( data.length > 0 ){			
				if ( this.autoSlideDelay > 0 ){
					this.periodical = new PeriodicalExecuter(this.autoSlide.bind(this), this.autoSlideDelay);
					this.contentContainer.observe('mouseover', this.stopAutoSlide.bind(this));
			        this.contentContainer.observe('mouseout', this.resetDelay.bind(this));
				}
			}
		}
	},
	processData: function(){
		var i =0;
		this.contentContainer.setStyle('overflow: hidden;position: relative;background:#000;');
		this.imageList = new Array();
		//this.width = $$('#block-'+this.blockId+' div.blidget-content').first().getWidth();
		this.width = $('carrousel-content-'+this.blockId).getWidth();
		
		
		this.data.each(function (item){
			var container = Builder.node('div', {'id': 'carrousel-'+this.blockId+'-content-container'+item.contentId, 'class': 'carrousel-content-container carrousel-content-container'+this.blockId});
			container.setStyle('position: absolute;top: 0;background: #000;width:100%;overflow: hidden;height:100%;cursor:pointer;');
			if (i == 0 ){
				container.setStyle('left: 0;');
			}else{
				if (this.useArrows){
					container.setStyle('left:5000px;');
				}else{
					container.hide();
				}
			}
			var content = Builder.node('div', {'class': 'carrousel-content-content'});
			content.setStyle('position: relative;height: 100%;width: 100%;');
			container.appendChild(content);
			var contentTitle = Builder.node('div', {'class': 'carrousel-content-title'});
			contentTitle.setStyle('position: absolute;bottom: 0; left:0;width: 100%;background:#000;color:#fff; font-size: 1.1em;font-weight: bold;z-index:10;');
			contentTitle.setOpacity(0.7);
			var contentTitleDiv = Builder.node('div', {'class': 'carrousel-content-title-div'}, item.title);
			contentTitleDiv.setStyle('padding: 5px;');
			contentTitle.appendChild(contentTitleDiv);
			if ( item.body != null ){
				var contentSubTitleDiv = Builder.node('div', {'class': 'carrousel-content-subtitle-div'});
				contentSubTitleDiv.update(item.body);
				contentSubTitleDiv.setStyle('padding: 5px;font-size: 0.8em;');
				contentTitle.appendChild(contentSubTitleDiv);
			}
			content.appendChild(contentTitle);
			var contentImage = Builder.node('div', {'class': 'carrousel-content-image'});
			var objImage = new Image();
			objImage.onload = this.placeImage.bindAsEventListener(this, contentImage, objImage);
			objImage.src=item.imageUrl;			
			contentImage.setStyle('position:absolute; top: 0; left:0;height:100%;overflow:hidden;text-align: center;width:100%;');
			content.appendChild(contentImage);
			this.contentContainer.appendChild(container);
			this.contentArray[i] = container;
			this.contentArray[i].observe('click', this.openContent.bindAsEventListener(this, item.contentLink));
			i++;
		}.bind(this));
		this.contentNumber = i - 1;
	},
	placeImage: function(e, contentImage, objImage){
		var imageItem = Builder.node('img', {src: objImage.src});
		var ratioX = objImage.width/this.width;
		var ratioY = objImage.height/this.height;
		var newHeight = objImage.height;
		
		
		if(ratioX > 1 && ratioY > ratioX){
			imageItem.setAttribute("width",this.width);
			var newHeight = objImage.height / ratioX;	
		} else if (ratioY > 1 && ratioX > ratioY){
			imageItem.setAttribute("height",this.height);
			var newHeight = this.height;	
		}
		imageItem.setStyle("margin-top: "+ (this.height - newHeight)/2 +"px");
		contentImage.appendChild(imageItem);
	},
	openContent: function(e, link){
		location.href = link;
	},
	enableArrows: function(){
		var topPosition = (this.contentContainerHeight - this.rightArrow.getHeight())/2;
		if ( topPosition == 0 ) {
			topPosition = 5;
		}
		this.rightArrow.setStyle('position: absolute; top: '+topPosition+'px; right: 5px;z-index: 5;cursor:pointer;');
		this.rightArrow.setOpacity(0.3);
		if ( this.data.length > 0 ){
			this.rightArrow.observe('click', this.nextContent.bindAsEventListener(this));
		}
		this.rightArrow.observe('mouseover', this.setMouseOver.bindAsEventListener(this, this.rightArrow));
        this.rightArrow.observe('mouseout', this.setMouseOut.bindAsEventListener(this, this.rightArrow));
        this.leftArrow.setStyle('position: absolute; top: '+topPosition+'px; left: 5px;z-index: 5;cursor:pointer;');
   		this.leftArrow.setOpacity(0.3);
		if ( this.data.length > 0 ){
    	    this.leftArrow.observe('click', this.prevContent.bindAsEventListener(this));
    	}
		this.leftArrow.observe('mouseover', this.setMouseOver.bindAsEventListener(this, this.leftArrow));
        this.leftArrow.observe('mouseout', this.setMouseOut.bindAsEventListener(this, this.leftArrow));
	},
	enableIndex:function(){
		this.imageIndex.setStyle("position: absolute;top:0;z-index:2;right: 0;");
		var idxElements= new Array();
		for(var j=0; j<=this.contentNumber;j++){
			var indexDiv = null;
			if ( j==0 ){
				indexDiv = Builder.node('div', {'class': 'carrousel-index-item-selected','style': 'float:left;cursor:pointer;'}, j+1);
				indexDiv.setOpacity(1.0);
			}else{
				indexDiv = Builder.node('div', {'class': 'carrousel-index-item','style': 'float:left;cursor:pointer;'}, j+1);
				indexDiv.setOpacity(0.5);
			}
			indexDiv.observe('mouseover', this.gotoPost.bindAsEventListener(this, j));
			idxElements[j] = indexDiv;
			this.imageIndex.appendChild(indexDiv);
		}
		this.indexElementArray = idxElements;
		this.imageIndex.appendChild(Builder.node('div', {'class': 'clear'}));
	},
	gotoPost: function(e, index){
		if ( index != this.currentContent ){
			this.switchToPost(index, 0.3);
		}
	},
	switchToPost: function(index, speed){
		this.indexElementArray[this.currentContent].removeClassName('carrousel-index-item-selected');
		this.indexElementArray[this.currentContent].addClassName('carrousel-index-item');
		this.indexElementArray[this.currentContent].setOpacity(0.5);
		
		this.indexElementArray[index].addClassName('carrousel-index-item-selected');
		this.indexElementArray[index].setOpacity(1.0);
		
		new Effect.Fade(this.contentArray[this.currentContent], {duration: speed});
		new Effect.Appear(this.contentArray[index], {duration: speed});
		this.currentContent = index;	
	},
	setMouseOver: function(e, arrow){
		arrow.setOpacity(0.7);
	},
	setMouseOut: function(e, arrow){
		arrow.setOpacity(0.3);
	},
	nextContent: function(e){
		e.stop();
		if ( this.isBusy ){
			return;
		}
		this.slideNext();
	},
	slideNext: function(){
		this.isBusy = true;		
		var nextContent = this.currentContent + 1;
		if ( nextContent > this.contentNumber ){
			nextContent = 0;
		}
		this.contentArray[nextContent].setStyle('left: '+this.contentContainer.getWidth()+'px;');
		new Effect.Move(this.contentArray[nextContent],{x:-(this.contentContainer.getWidth()), y:0, mode:'relative', transition: Effect.Transitions.sinoidal, duration: 0.5 , queue: {position: 'end', scope: 'carrousel-queue-2-'+this.blockId, limit:1}});
		new Effect.Move(this.contentArray[this.currentContent],{x:-(this.contentContainer.getWidth()), y:0, mode:'relative', transition: Effect.Transitions.sinoidal, duration: 0.5 , queue: {position: 'end', scope: 'carrousel-queue-1-'+this.blockId,limit:1}, afterFinish: function(){this.isBusy = false;}.bind(this)});
		this.currentContent = nextContent;
	},
	prevContent: function(e){
		e.stop();
		if ( this.isBusy ){
			return;
		}
		this.isBusy = true;
		var prevContent = this.currentContent - 1;
		if ( prevContent < 0){
			prevContent = this.contentNumber;
		}
		this.contentArray[prevContent].setStyle('left: -'+this.contentContainer.getWidth()+'px;');
		new Effect.Move(this.contentArray[prevContent],{x:this.contentContainer.getWidth(), y:0, mode:'relative', transition: Effect.Transitions.sinoidal, duration: 0.5 , queue: {position: 'end', scope: 'carrousel-queue-2-'+this.blockId, limit:1}});
		new Effect.Move(this.contentArray[this.currentContent],{x:this.contentContainer.getWidth(), y:0, mode:'relative', transition: Effect.Transitions.sinoidal, duration: 0.5 , queue: {position: 'end', scope: 'carrousel-queue-1-'+this.blockId, limit:1}, afterFinish: function(){this.isBusy = false;}.bind(this)});
		this.currentContent = prevContent;
	},
	resetDelay: function(){
		if (this.autoSlideDelay > 0 ){
			this.periodical.stop();
			this.periodical = new PeriodicalExecuter(this.autoSlide.bind(this), this.autoSlideDelay);
		}
	},
	autoSlide: function(){
		if ( this.isBusy ){
			return;
		}
		if (this.useArrows){
			this.slideNext();
		}else{
			var nextContent = this.currentContent + 1;
			if ( nextContent > this.contentNumber){
				nextContent = 0;
			}
			this.switchToPost(nextContent, 1.0);
		}
	},
	stopAutoSlide: function(){
		if ( this.periodical != null ){
			this.periodical.stop();
		}
	}
});


var TagPluginClass = Class.create(BligooPluginClass, {
    onPageLoaded: function(event) {
    	$$('.youtube-video-container').each(this.initYoutube.bind(this));
    },
    initYoutube: function(item) {
    	var id = item.getAttribute('data-config-id');
    	var username = item.getAttribute('data-username');
    	if (username == '' || username == null ){
    		return;
    	}
    	var max = item.getAttribute('data-max');
    	item.update(new Element('script', {src: 'http://gdata.youtube.com/feeds/base/users/' + username + '/uploads?orderby=updated&callback=updateYoutube' + id + '&alt=json-in-script&max-results=' + max}));
    }
});

PluginManager.add(new TagPluginClass());
/* SWFObject v2.1 <http://code.google.com/p/swfobject/>
	Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var swfobject=function(){var b="undefined",Q="object",n="Shockwave Flash",p="ShockwaveFlash.ShockwaveFlash",P="application/x-shockwave-flash",m="SWFObjectExprInst",j=window,K=document,T=navigator,o=[],N=[],i=[],d=[],J,Z=null,M=null,l=null,e=false,A=false;var h=function(){var v=typeof K.getElementById!=b&&typeof K.getElementsByTagName!=b&&typeof K.createElement!=b,AC=[0,0,0],x=null;if(typeof T.plugins!=b&&typeof T.plugins[n]==Q){x=T.plugins[n].description;if(x&&!(typeof T.mimeTypes!=b&&T.mimeTypes[P]&&!T.mimeTypes[P].enabledPlugin)){x=x.replace(/^.*\s+(\S+\s+\S+$)/,"$1");AC[0]=parseInt(x.replace(/^(.*)\..*$/,"$1"),10);AC[1]=parseInt(x.replace(/^.*\.(.*)\s.*$/,"$1"),10);AC[2]=/r/.test(x)?parseInt(x.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof j.ActiveXObject!=b){var y=null,AB=false;try{y=new ActiveXObject(p+".7")}catch(t){try{y=new ActiveXObject(p+".6");AC=[6,0,21];y.AllowScriptAccess="always"}catch(t){if(AC[0]==6){AB=true}}if(!AB){try{y=new ActiveXObject(p)}catch(t){}}}if(!AB&&y){try{x=y.GetVariable("$version");if(x){x=x.split(" ")[1].split(",");AC=[parseInt(x[0],10),parseInt(x[1],10),parseInt(x[2],10)]}}catch(t){}}}}var AD=T.userAgent.toLowerCase(),r=T.platform.toLowerCase(),AA=/webkit/.test(AD)?parseFloat(AD.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,q=false,z=r?/win/.test(r):/win/.test(AD),w=r?/mac/.test(r):/mac/.test(AD);/*@cc_on q=true;@if(@_win32)z=true;@elif(@_mac)w=true;@end@*/return{w3cdom:v,pv:AC,webkit:AA,ie:q,win:z,mac:w}}();var L=function(){if(!h.w3cdom){return }f(H);if(h.ie&&h.win){try{K.write("<script id=__ie_ondomload defer=true src=//:><\/script>");J=C("__ie_ondomload");if(J){I(J,"onreadystatechange",S)}}catch(q){}}if(h.webkit&&typeof K.readyState!=b){Z=setInterval(function(){if(/loaded|complete/.test(K.readyState)){E()}},10)}if(typeof K.addEventListener!=b){K.addEventListener("DOMContentLoaded",E,null)}R(E)}();function S(){if(J.readyState=="complete"){J.parentNode.removeChild(J);E()}}function E(){if(e){return }if(h.ie&&h.win){var v=a("span");try{var u=K.getElementsByTagName("body")[0].appendChild(v);u.parentNode.removeChild(u)}catch(w){return }}e=true;if(Z){clearInterval(Z);Z=null}var q=o.length;for(var r=0;r<q;r++){o[r]()}}function f(q){if(e){q()}else{o[o.length]=q}}function R(r){if(typeof j.addEventListener!=b){j.addEventListener("load",r,false)}else{if(typeof K.addEventListener!=b){K.addEventListener("load",r,false)}else{if(typeof j.attachEvent!=b){I(j,"onload",r)}else{if(typeof j.onload=="function"){var q=j.onload;j.onload=function(){q();r()}}else{j.onload=r}}}}}function H(){var t=N.length;for(var q=0;q<t;q++){var u=N[q].id;if(h.pv[0]>0){var r=C(u);if(r){N[q].width=r.getAttribute("width")?r.getAttribute("width"):"0";N[q].height=r.getAttribute("height")?r.getAttribute("height"):"0";if(c(N[q].swfVersion)){if(h.webkit&&h.webkit<312){Y(r)}W(u,true)}else{if(N[q].expressInstall&&!A&&c("6.0.65")&&(h.win||h.mac)){k(N[q])}else{O(r)}}}}else{W(u,true)}}}function Y(t){var q=t.getElementsByTagName(Q)[0];if(q){var w=a("embed"),y=q.attributes;if(y){var v=y.length;for(var u=0;u<v;u++){if(y[u].nodeName=="DATA"){w.setAttribute("src",y[u].nodeValue)}else{w.setAttribute(y[u].nodeName,y[u].nodeValue)}}}var x=q.childNodes;if(x){var z=x.length;for(var r=0;r<z;r++){if(x[r].nodeType==1&&x[r].nodeName=="PARAM"){w.setAttribute(x[r].getAttribute("name"),x[r].getAttribute("value"))}}}t.parentNode.replaceChild(w,t)}}function k(w){A=true;var u=C(w.id);if(u){if(w.altContentId){var y=C(w.altContentId);if(y){M=y;l=w.altContentId}}else{M=G(u)}if(!(/%$/.test(w.width))&&parseInt(w.width,10)<310){w.width="310"}if(!(/%$/.test(w.height))&&parseInt(w.height,10)<137){w.height="137"}K.title=K.title.slice(0,47)+" - Flash Player Installation";var z=h.ie&&h.win?"ActiveX":"PlugIn",q=K.title,r="MMredirectURL="+j.location+"&MMplayerType="+z+"&MMdoctitle="+q,x=w.id;if(h.ie&&h.win&&u.readyState!=4){var t=a("div");x+="SWFObjectNew";t.setAttribute("id",x);u.parentNode.insertBefore(t,u);u.style.display="none";var v=function(){u.parentNode.removeChild(u)};I(j,"onload",v)}U({data:w.expressInstall,id:m,width:w.width,height:w.height},{flashvars:r},x)}}function O(t){if(h.ie&&h.win&&t.readyState!=4){var r=a("div");t.parentNode.insertBefore(r,t);r.parentNode.replaceChild(G(t),r);t.style.display="none";var q=function(){t.parentNode.removeChild(t)};I(j,"onload",q)}else{t.parentNode.replaceChild(G(t),t)}}function G(v){var u=a("div");if(h.win&&h.ie){u.innerHTML=v.innerHTML}else{var r=v.getElementsByTagName(Q)[0];if(r){var w=r.childNodes;if(w){var q=w.length;for(var t=0;t<q;t++){if(!(w[t].nodeType==1&&w[t].nodeName=="PARAM")&&!(w[t].nodeType==8)){u.appendChild(w[t].cloneNode(true))}}}}}return u}function U(AG,AE,t){var q,v=C(t);if(v){if(typeof AG.id==b){AG.id=t}if(h.ie&&h.win){var AF="";for(var AB in AG){if(AG[AB]!=Object.prototype[AB]){if(AB.toLowerCase()=="data"){AE.movie=AG[AB]}else{if(AB.toLowerCase()=="styleclass"){AF+=' class="'+AG[AB]+'"'}else{if(AB.toLowerCase()!="classid"){AF+=" "+AB+'="'+AG[AB]+'"'}}}}}var AD="";for(var AA in AE){if(AE[AA]!=Object.prototype[AA]){AD+='<param name="'+AA+'" value="'+AE[AA]+'" />'}}v.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+AF+">"+AD+"</object>";i[i.length]=AG.id;q=C(AG.id)}else{if(h.webkit&&h.webkit<312){var AC=a("embed");AC.setAttribute("type",P);for(var z in AG){if(AG[z]!=Object.prototype[z]){if(z.toLowerCase()=="data"){AC.setAttribute("src",AG[z])}else{if(z.toLowerCase()=="styleclass"){AC.setAttribute("class",AG[z])}else{if(z.toLowerCase()!="classid"){AC.setAttribute(z,AG[z])}}}}}for(var y in AE){if(AE[y]!=Object.prototype[y]){if(y.toLowerCase()!="movie"){AC.setAttribute(y,AE[y])}}}v.parentNode.replaceChild(AC,v);q=AC}else{var u=a(Q);u.setAttribute("type",P);for(var x in AG){if(AG[x]!=Object.prototype[x]){if(x.toLowerCase()=="styleclass"){u.setAttribute("class",AG[x])}else{if(x.toLowerCase()!="classid"){u.setAttribute(x,AG[x])}}}}for(var w in AE){if(AE[w]!=Object.prototype[w]&&w.toLowerCase()!="movie"){F(u,w,AE[w])}}v.parentNode.replaceChild(u,v);q=u}}}return q}function F(t,q,r){var u=a("param");u.setAttribute("name",q);u.setAttribute("value",r);t.appendChild(u)}function X(r){var q=C(r);if(q&&(q.nodeName=="OBJECT"||q.nodeName=="EMBED")){if(h.ie&&h.win){if(q.readyState==4){B(r)}else{j.attachEvent("onload",function(){B(r)})}}else{q.parentNode.removeChild(q)}}}function B(t){var r=C(t);if(r){for(var q in r){if(typeof r[q]=="function"){r[q]=null}}r.parentNode.removeChild(r)}}function C(t){var q=null;try{q=K.getElementById(t)}catch(r){}return q}function a(q){return K.createElement(q)}function I(t,q,r){t.attachEvent(q,r);d[d.length]=[t,q,r]}function c(t){var r=h.pv,q=t.split(".");q[0]=parseInt(q[0],10);q[1]=parseInt(q[1],10)||0;q[2]=parseInt(q[2],10)||0;return(r[0]>q[0]||(r[0]==q[0]&&r[1]>q[1])||(r[0]==q[0]&&r[1]==q[1]&&r[2]>=q[2]))?true:false}function V(v,r){if(h.ie&&h.mac){return }var u=K.getElementsByTagName("head")[0],t=a("style");t.setAttribute("type","text/css");t.setAttribute("media","screen");if(!(h.ie&&h.win)&&typeof K.createTextNode!=b){t.appendChild(K.createTextNode(v+" {"+r+"}"))}u.appendChild(t);if(h.ie&&h.win&&typeof K.styleSheets!=b&&K.styleSheets.length>0){var q=K.styleSheets[K.styleSheets.length-1];if(typeof q.addRule==Q){q.addRule(v,r)}}}function W(t,q){var r=q?"visible":"hidden";if(e&&C(t)){C(t).style.visibility=r}else{V("#"+t,"visibility:"+r)}}function g(s){var r=/[\\\"<>\.;]/;var q=r.exec(s)!=null;return q?encodeURIComponent(s):s}var D=function(){if(h.ie&&h.win){window.attachEvent("onunload",function(){var w=d.length;for(var v=0;v<w;v++){d[v][0].detachEvent(d[v][1],d[v][2])}var t=i.length;for(var u=0;u<t;u++){X(i[u])}for(var r in h){h[r]=null}h=null;for(var q in swfobject){swfobject[q]=null}swfobject=null})}}();return{registerObject:function(u,q,t){if(!h.w3cdom||!u||!q){return }var r={};r.id=u;r.swfVersion=q;r.expressInstall=t?t:false;N[N.length]=r;W(u,false)},getObjectById:function(v){var q=null;if(h.w3cdom){var t=C(v);if(t){var u=t.getElementsByTagName(Q)[0];if(!u||(u&&typeof t.SetVariable!=b)){q=t}else{if(typeof u.SetVariable!=b){q=u}}}}return q},embedSWF:function(x,AE,AB,AD,q,w,r,z,AC){if(!h.w3cdom||!x||!AE||!AB||!AD||!q){return }AB+="";AD+="";if(c(q)){W(AE,false);var AA={};if(AC&&typeof AC===Q){for(var v in AC){if(AC[v]!=Object.prototype[v]){AA[v]=AC[v]}}}AA.data=x;AA.width=AB;AA.height=AD;var y={};if(z&&typeof z===Q){for(var u in z){if(z[u]!=Object.prototype[u]){y[u]=z[u]}}}if(r&&typeof r===Q){for(var t in r){if(r[t]!=Object.prototype[t]){if(typeof y.flashvars!=b){y.flashvars+="&"+t+"="+r[t]}else{y.flashvars=t+"="+r[t]}}}}f(function(){U(AA,y,AE);if(AA.id==AE){W(AE,true)}})}else{if(w&&!A&&c("6.0.65")&&(h.win||h.mac)){A=true;W(AE,false);f(function(){var AF={};AF.id=AF.altContentId=AE;AF.width=AB;AF.height=AD;AF.expressInstall=w;k(AF)})}}},getFlashPlayerVersion:function(){return{major:h.pv[0],minor:h.pv[1],release:h.pv[2]}},hasFlashPlayerVersion:c,createSWF:function(t,r,q){if(h.w3cdom){return U(t,r,q)}else{return undefined}},removeSWF:function(q){if(h.w3cdom){X(q)}},createCSS:function(r,q){if(h.w3cdom){V(r,q)}},addDomLoadEvent:f,addLoadEvent:R,getQueryParamValue:function(v){var u=K.location.search||K.location.hash;if(v==null){return g(u)}if(u){var t=u.substring(1).split("&");for(var r=0;r<t.length;r++){if(t[r].substring(0,t[r].indexOf("="))==v){return g(t[r].substring((t[r].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(A&&M){var q=C(m);if(q){q.parentNode.replaceChild(M,q);if(l){W(l,true);if(h.ie&&h.win){M.style.display="block"}}M=null;l=null;A=false}}}}}();function voteContentDown(linkId, id, msg){
	$('vote-links-content-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'voteContentDown'
				, parameters: {contentId: id}
				, onSuccess: function(transport){
								$('vote-links-content-'+id).up().innerHTML = transport.responseText;
								//$('vote-links-content-'+id).innerHTML= transport.responseText;
							}
	});
}
function voteContentUp(linkId, id, msg){
	$('vote-links-content-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'voteContentUp'
				, parameters: {contentId: id}
				, onSuccess: function(transport){
								$('vote-links-content-'+id).up().innerHTML= transport.responseText;
								//$('vote-links-content-'+id).innerHTML= transport.responseText;
							}
	});
}
function nullVoteContent(linkId, id, msg){
	$('vote-links-content-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'nullcontentvote'
				, parameters: {contentId: id}
				, onSuccess: function(transport){
								$('vote-links-content-'+id).up().innerHTML= transport.responseText;
								//$('vote-links-content-'+id).innerHTML= transport.responseText;
							}
	});
}
//////////////////////////////////////////////////////////////
//  Voto de comentarios //////////////////////////////////////
//////////////////////////////////////////////////////////////
function voteCommentDown(linkId, id, msg){
	$('vote-links-comment-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'voteCommentDown'
				, parameters: {commentId: id}
				, onSuccess: function(transport){
								$('vote-links-comment-'+id).up().innerHTML= transport.responseText;
								//$('vote-links-comment-'+id).innerHTML= transport.responseText;
							}
	});
}
function voteCommentUp(linkId, id, msg){
	$('vote-links-comment-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'voteCommentUp'
				, parameters: {commentId: id}
				, onSuccess: function(transport){
								$('vote-links-comment-'+id).up().innerHTML= transport.responseText;
								//$('vote-links-comment-'+id).innerHTML= transport.responseText;
							}
	});
}
function nullVoteComment(linkId, id, msg){
	$('vote-links-comment-'+id).innerHTML= msg;
	new Ajax.Request(
			'/bligoo/ajaxproxy', {
				method: 'nullcommentvote'
				, parameters: {commentId: id}
				, onSuccess: function(transport){
								$('vote-links-comment-'+id).up().innerHTML= transport.responseText;
								//$('vote-links-comment-'+id).innerHTML= transport.responseText;
							}
	});
}




var VotePluginClass = Class.create(BligooPluginClass, {
	init: function(message) {
  	},
  	onPageLoaded: function(event) {
  	    var commentsToCollapse = $$('span.comment-to-collapse');
	    for ( var i=0; i<commentsToCollapse.length; i++){
			var linkId = commentsToCollapse[i].id;
			var msgId = linkId.substring(19);
			$('comment-collapsed-' + msgId).show();
			var commentContainer = $('comment-'+msgId);
			commentContainer.select('div.comment')[0].hide();
			commentContainer.select('div.links')[0].hide();
			$('expand-'+msgId).observe('click', this.expandComment.bindAsEventListener(this, msgId));
	    }
  	},
  	expandComment: function (event, msgId){
		var commentContainer = $('comment-' + msgId);
	    $('comment-collapsed-' + msgId).hide();
	    commentContainer.select('div.comment')[0].show();
	    commentContainer.select('div.links')[0].show();
	}
});
 
PluginManager.add(new VotePluginClass());

var OnOffSwitchClass = Class.create({
	initialize: function(wrapper) {
		this.wrapper = wrapper;
		this.item = this.wrapper.select('.bligoo-switch').first();
		this.wrapper.observe('click', this.click.bindAsEventListener(this));
		this.val = this.wrapper.select('input[type="hidden"]').first();
	}, 
	click: function() {
		if (this.item.hasClassName('bligoo-switch-false')) {
			this.item.removeClassName('bligoo-switch-false');
			this.item.addClassName('bligoo-switch-true');
		} else {
			this.item.addClassName('bligoo-switch-false');
			this.item.removeClassName('bligoo-switch-true');
		}
		if (this.val.value == 'true') {
			this.val.value = 'false';
		} else {
			this.val.value = 'true';
		}
	}
});


var WizardSwitchPluginClass = Class.create(BligooPluginClass, {
	onWizardStepLoaded: function(event){
		$$('.bligoo-switch-wrapper').each(function(item) {
			new OnOffSwitchClass(item);
		});
	}	
});

PluginManager.add(new WizardSwitchPluginClass());