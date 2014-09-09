(function DetectVendorPrefixScope(global) {
  'use strict';

  var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  })();

  global.utils = global.utils || {};
  global.utils.prefix = prefix;

})(window);
/*
---

script: Core.js

description: The core of MooTools, contains all the base functions and the Native and Hash implementations. Required by all the other scripts.

license: MIT-style license.

copyright: Copyright (c) 2006-2008 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
- Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
- Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Mootools, Native, Hash.base, Array.each, $util]

...
*/

/**
 * FIX dla mootools < 1.2.6 i ES6 (wystepuje w FF >= 17).
 * ES6 posiada wlasna metode String.prototype.contains niekompatybilna z mootoolsowa (mootools jej nie nadpisuje)
 */
delete String.prototype.contains;

var MooTools = {
	'version': '1.2.4',
	'build': '0d9113241a90b9cd5643b926795852a2026710d4'
};

var Native = function(options){
	options = options || {};
	var name = options.name;
	var legacy = options.legacy;
	var protect = options.protect;
	var methods = options.implement;
	var generics = options.generics;
	var initialize = options.initialize;
	var afterImplement = options.afterImplement || function(){};
	var object = initialize || legacy;
	generics = generics !== false;

	object.constructor = Native;
	object.$family = {name: 'native'};
	if (legacy && initialize) object.prototype = legacy.prototype;
	object.prototype.constructor = object;

	if (name){
		var family = name.toLowerCase();
		object.prototype.$family = {name: family};
		Native.typize(object, family);
	}

	var add = function(obj, name, method, force){
		if (!protect || force || !obj.prototype[name]) obj.prototype[name] = method;
		if (generics) Native.genericize(obj, name, protect);
		afterImplement.call(obj, name, method);
		return obj;
	};

	object.alias = function(a1, a2, a3){
		if (typeof a1 == 'string'){
			var pa1 = this.prototype[a1];
			if ((a1 = pa1)) return add(this, a2, a1, a3);
		}
		for (var a in a1) this.alias(a, a1[a], a2);
		return this;
	};

	object.implement = function(a1, a2, a3){
		if (typeof a1 == 'string') return add(this, a1, a2, a3);
		for (var p in a1) add(this, p, a1[p], a2);
		return this;
	};

	if (methods) object.implement(methods);

	return object;
};

Native.genericize = function(object, property, check){
	if ((!check || !object[property]) && typeof object.prototype[property] == 'function') object[property] = function(){
		var args = Array.prototype.slice.call(arguments);
		return object.prototype[property].apply(args.shift(), args);
	};
};

Native.implement = function(objects, properties){
	for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

Native.typize = function(object, family){
	if (!object.type) object.type = function(item){
		return ($type(item) === family);
	};
};

(function(){
	var natives = {'Array': Array, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String};
	for (var n in natives) new Native({name: n, initialize: natives[n], protect: true});

	var types = {'boolean': Boolean, 'native': Native, 'object': Object};
	for (var t in types) Native.typize(types[t], t);

	var generics = {
		'Array': ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
		'String': ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
	};
	for (var g in generics){
		for (var i = generics[g].length; i--;) Native.genericize(natives[g], generics[g][i], true);
	}
})();

var Hash = new Native({

	name: 'Hash',

	initialize: function(object){
		if ($type(object) == 'hash') object = $unlink(object.getClean());
		for (var key in object) this[key] = object[key];
		return this;
	}

});

Hash.implement({

	forEach: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key)) fn.call(bind, this[key], key, this);
		}
	},

	getClean: function(){
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	},

	getLength: function(){
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	}

});

Hash.alias('forEach', 'each');

Array.implement({

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++) fn.call(bind, this[i], i, this);
	}

});

Array.alias('forEach', 'each');

function $A(iterable){
	if (iterable.item){
		var l = iterable.length, array = new Array(l);
		while (l--) array[l] = iterable[l];
		return array;
	}
	return Array.prototype.slice.call(iterable);
};

function $arguments(i){
	return function(){
		return arguments[i];
	};
};

function $chk(obj){
	return !!(obj || obj === 0);
};

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

function $defined(obj){
	return (obj != undefined);
};

function $each(iterable, fn, bind){
	var type = $type(iterable);
	((type == 'arguments' || type == 'collection' || type == 'array') ? Array : Hash).each(iterable, fn, bind);
};

function $empty(){};

function $extend(original, extended){
	for (var key in (extended || {})) original[key] = extended[key];
	return original;
};

function $H(object){
	return new Hash(object);
};

function $lambda(value){
	return ($type(value) == 'function') ? value : function(){
		return value;
	};
};

function $merge(){
	var args = Array.slice(arguments);
	args.unshift({});
	return $mixin.apply(null, args);
};

function $mixin(mix){
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		if ($type(object) != 'object') continue;
		for (var key in object){
			var op = object[key], mp = mix[key];
			mix[key] = (mp && $type(op) == 'object' && $type(mp) == 'object') ? $mixin(mp, op) : $unlink(op);
		}
	}
	return mix;
};

function $pick(){
	for (var i = 0, l = arguments.length; i < l; i++){
		if (arguments[i] != undefined) return arguments[i];
	}
	return null;
};

function $random(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function $splat(obj){
	var type = $type(obj);
	return (type) ? ((type != 'array' && type != 'arguments') ? [obj] : obj) : [];
};

var $time = Date.now || function(){
	return +new Date;
};

function $try(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

function $type(obj){
	if (obj == undefined) return false;
	if (obj.$family) return (obj.$family.name == 'number' && !isFinite(obj)) ? false : obj.$family.name;
	if (obj.nodeName){
		switch (obj.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof obj.length == 'number'){
		if (obj.callee) return 'arguments';
		else if (obj.item) return 'collection';
	}
	return typeof obj;
};

function $unlink(object){
	var unlinked;
	switch ($type(object)){
		case 'object':
			unlinked = {};
			for (var p in object) unlinked[p] = $unlink(object[p]);
		break;
		case 'hash':
			unlinked = new Hash(object);
		break;
		case 'array':
			unlinked = [];
			for (var i = 0, l = object.length; i < l; i++) unlinked[i] = $unlink(object[i]);
		break;
		default: return object;
	}
	return unlinked;
};


/*
---

script: Browser.js

description: The Browser Core. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: 
- /Native
- /$util

provides: [Browser, Window, Document, $exec]

...
*/

var Browser = $merge({

	Engine: {name: 'unknown', version: 0},

	Platform: {name: (window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()},

	Features: {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)},

	Plugins: {},

	Engines: {

		presto: function(){
			return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
		},

		trident: function(){
			return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
		},

		webkit: function(){
			return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
		},

		gecko: function(){
			return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
		}

	}

}, Browser || {});

Browser.Platform[Browser.Platform.name] = true;

Browser.detect = function(){

	for (var engine in this.Engines){
		var version = this.Engines[engine]();
		if (version){
			this.Engine = {name: engine, version: version};
			this.Engine[engine] = this.Engine[engine + version] = true;
			break;
		}
	}

	return {name: engine, version: version};

};

Browser.detect();

Browser.Request = function(){
	return $try(function(){
		return new XMLHttpRequest();
	}, function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	}, function(){
		return new ActiveXObject('Microsoft.XMLHTTP');
	});
};

Browser.Features.xhr = !!(Browser.Request());

Browser.Plugins.Flash = (function(){
	var version = ($try(function(){
		return navigator.plugins['Shockwave Flash'].description;
	}, function(){
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
	}) || '0 r0').match(/\d+/g);
	return {version: parseInt(version[0] || 0 + '.' + version[1], 10) || 0, build: parseInt(version[2], 10) || 0};
})();

function $exec(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script[(Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerText' : 'text'] = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};

Native.UID = 1;

var $uid = (Browser.Engine.trident) ? function(item){
	return (item.uid || (item.uid = [Native.UID++]))[0];
} : function(item){
	return item.uid || (item.uid = Native.UID++);
};

var Window = new Native({

	name: 'Window',

	legacy: (Browser.Engine.trident) ? null: window.Window,

	initialize: function(win){
		$uid(win);
		if (!win.Element){
			win.Element = $empty;
			if (Browser.Engine.webkit) win.document.createElement("iframe"); //fixes safari 2
			win.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
		}
		win.document.window = win;
		return $extend(win, Window.Prototype);
	},

	afterImplement: function(property, value){
		window[property] = Window.Prototype[property] = value;
	}

});

Window.Prototype = {$family: {name: 'window'}};

new Window(window);

var Document = new Native({

	name: 'Document',

	legacy: (Browser.Engine.trident) ? null: window.Document,

	initialize: function(doc){
		$uid(doc);
		doc.head = doc.getElementsByTagName('head')[0];
		doc.html = doc.getElementsByTagName('html')[0];
		if (Browser.Engine.trident && Browser.Engine.version <= 4) $try(function(){
			doc.execCommand("BackgroundImageCache", false, true);
		});
		if (Browser.Engine.trident) doc.window.attachEvent('onunload', function(){
			doc.window.detachEvent('onunload', arguments.callee);
			doc.head = doc.html = doc.window = null;
		});
		return $extend(doc, Document.Prototype);
	},

	afterImplement: function(property, value){
		document[property] = Document.Prototype[property] = value;
	}

});

Document.Prototype = {$family: {name: 'document'}};

new Document(document);


/*
---

script: Array.js

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires:
- /$util
- /Array.each

provides: [Array]

...
*/

Array.implement({

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	clean: function(){
		return this.filter($defined);
	},

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++) results[i] = fn.call(bind, this[i], i, this);
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	extend: function(array){
		for (var i = 0, j = array.length; i < j; i++) this.push(array[i]);
		return this;
	},
	
	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[$random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--; i){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = $type(this[i]);
			if (!type) continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments') ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});


/*
---

script: Function.js

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires:
- /Native
- /$util

provides: [Function]

...
*/

Function.implement({

	extend: function(properties){
		for (var property in properties) this[property] = properties[property];
		return this;
	},

	create: function(options){
		var self = this;
		options = options || {};
		return function(event){
			var args = options.arguments;
			args = (args != undefined) ? $splat(args) : Array.slice(arguments, (options.event) ? 1 : 0);
			if (options.event) args = [event || window.event].extend(args);
			var returns = function(){
				return self.apply(options.bind || null, args);
			};
			if (options.delay) return setTimeout(returns, options.delay);
			if (options.periodical) return setInterval(returns, options.periodical);
			if (options.attempt) return $try(returns);
			return returns();
		};
	},

	run: function(args, bind){
		return this.apply(bind, $splat(args));
	},

	pass: function(args, bind){
		return this.create({bind: bind, arguments: args});
	},

	bind: function(bind, args){
		return this.create({bind: bind, arguments: args});
	},

	bindWithEvent: function(bind, args){
		return this.create({bind: bind, arguments: args, event: true});
	},

	attempt: function(args, bind){
		return this.create({bind: bind, arguments: args, attempt: true})();
	},

	delay: function(delay, bind, args){
		return this.create({bind: bind, arguments: args, delay: delay})();
	},

	periodical: function(periodical, bind, args){
		return this.create({bind: bind, arguments: args, periodical: periodical})();
	}

});


/*
---

script: Number.js

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires:
- /Native
- /$util

provides: [Number]

...
*/

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('times', 'each');

(function(math){
	var methods = {};
	math.each(function(name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat($A(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---

script: String.js

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires:
- /Native

provides: [String]

...
*/

String.implement({

	test: function(regex, params){
		return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	stripScripts: function(option){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (option === true) $exec(scripts);
		else if ($type(option) == 'function') option(scripts, text);
		return text;
	},

	substitute: function(object, regexp){
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name] : '';
		});
	}

});


/*
---

script: Hash.js

description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

license: MIT-style license.

requires:
- /Hash.base

provides: [Hash]

...
*/

Hash.implement({

	has: Object.prototype.hasOwnProperty,

	keyOf: function(value){
		for (var key in this){
			if (this.hasOwnProperty(key) && this[key] === value) return key;
		}
		return null;
	},

	hasValue: function(value){
		return (Hash.keyOf(this, value) !== null);
	},

	extend: function(properties){
		Hash.each(properties || {}, function(value, key){
			Hash.set(this, key, value);
		}, this);
		return this;
	},

	combine: function(properties){
		Hash.each(properties || {}, function(value, key){
			Hash.include(this, key, value);
		}, this);
		return this;
	},

	erase: function(key){
		if (this.hasOwnProperty(key)) delete this[key];
		return this;
	},

	get: function(key){
		return (this.hasOwnProperty(key)) ? this[key] : null;
	},

	set: function(key, value){
		if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
		return this;
	},

	empty: function(){
		Hash.each(this, function(value, key){
			delete this[key];
		}, this);
		return this;
	},

	include: function(key, value){
		if (this[key] == undefined) this[key] = value;
		return this;
	},

	map: function(fn, bind){
		var results = new Hash;
		Hash.each(this, function(value, key){
			results.set(key, fn.call(bind, value, key, this));
		}, this);
		return results;
	},

	filter: function(fn, bind){
		var results = new Hash;
		Hash.each(this, function(value, key){
			if (fn.call(bind, value, key, this)) results.set(key, value);
		}, this);
		return results;
	},

	every: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key) && !fn.call(bind, this[key], key)) return false;
		}
		return true;
	},

	some: function(fn, bind){
		for (var key in this){
			if (this.hasOwnProperty(key) && fn.call(bind, this[key], key)) return true;
		}
		return false;
	},

	getKeys: function(){
		var keys = [];
		Hash.each(this, function(value, key){
			keys.push(key);
		});
		return keys;
	},

	getValues: function(){
		var values = [];
		Hash.each(this, function(value){
			values.push(value);
		});
		return values;
	},

	toQueryString: function(base){
		var queryString = [];
		Hash.each(this, function(value, key){
			if (base) key = base + '[' + key + ']';
			var result;
			switch ($type(value)){
				case 'object': result = Hash.toQueryString(value, key); break;
				case 'array':
					var qs = {};
					value.each(function(val, i){
						qs[i] = val;
					});
					result = Hash.toQueryString(qs, key);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != undefined) queryString.push(result);
		});

		return queryString.join('&');
	}

});

Hash.alias({keyOf: 'indexOf', hasValue: 'contains'});


/*
---

script: Event.js

description: Contains the Event Class, to make the event object cross-browser.

license: MIT-style license.

requires:
- /Window
- /Document
- /Hash
- /Array
- /Function
- /String

provides: [Event]

...
*/

var Event = new Native({

	name: 'Event',

	initialize: function(event, win){
		win = win || window;
		var doc = win.document;
		event = event || win.event;
		if (event.$extended) return event;
		this.$extended = true;
		var type = event.type;
		var target = event.target || event.srcElement;
		while (target && target.nodeType == 3) target = target.parentNode;

		if (type.test(/key/)){
			var code = event.which || event.keyCode;
			var key = Event.Keys.keyOf(code);
			if (type == 'keydown'){
				var fKey = code - 111;
				if (fKey > 0 && fKey < 13) key = 'f' + fKey;
			}
			key = key || String.fromCharCode(code).toLowerCase();
		} else if (type.match(/(click|mouse|menu)/i)){
			doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
			var page = {
				x: event.pageX || event.clientX + doc.scrollLeft,
				y: event.pageY || event.clientY + doc.scrollTop
			};
			var client = {
				x: (event.pageX) ? event.pageX - win.pageXOffset : event.clientX,
				y: (event.pageY) ? event.pageY - win.pageYOffset : event.clientY
			};
			if (type.match(/DOMMouseScroll|mousewheel/)){
				var wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
			}
			var rightClick = (event.which == 3) || (event.button == 2);
			var related = null;
			if (type.match(/over|out/)){
				switch (type){
					case 'mouseover': related = event.relatedTarget || event.fromElement; break;
					case 'mouseout': related = event.relatedTarget || event.toElement;
				}
				if (!(function(){
					while (related && related.nodeType == 3) related = related.parentNode;
					return true;
				}).create({attempt: Browser.Engine.gecko})()) related = false;
			}
		}

		return $extend(this, {
			event: event,
			type: type,

			page: page,
			client: client,
			rightClick: rightClick,

			wheel: wheel,

			relatedTarget: related,
			target: target,

			code: code,
			key: key,

			shift: event.shiftKey,
			control: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey
		});
	}

});

Event.Keys = new Hash({
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
});

Event.implement({

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});


/*
---

script: Class.js

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires:
- /$util
- /Native
- /Array
- /String
- /Function
- /Number
- /Hash

provides: [Class]

...
*/

function Class(params){
	
	if (params instanceof Function) params = {initialize: params};
	
	var newClass = function(){
		Object.reset(this);
		if (newClass._prototyping) return this;
		this._current = $empty;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		delete this._current; delete this.caller;
		return value;
	}.extend(this);
	
	newClass.implement(params);
	
	newClass.constructor = Class;
	newClass.prototype.constructor = newClass;

	return newClass;

};

Function.prototype.protect = function(){
	this._protected = true;
	return this;
};

Object.reset = function(object, key){
		
	if (key == null){
		for (var p in object) Object.reset(object, p);
		return object;
	}
	
	delete object[key];
	
	switch ($type(object[key])){
		case 'object':
			var F = function(){};
			F.prototype = object[key];
			var i = new F;
			object[key] = Object.reset(i);
		break;
		case 'array': object[key] = $unlink(object[key]); break;
	}
	
	return object;
	
};

new Native({name: 'Class', initialize: Class}).extend({

	instantiate: function(F){
		F._prototyping = true;
		var proto = new F;
		delete F._prototyping;
		return proto;
	},
	
	wrap: function(self, key, method){
		if (method._origin) method = method._origin;
		
		return function(){
			if (method._protected && this._current == null) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this._current;
			this.caller = current; this._current = arguments.callee;
			var result = method.apply(this, arguments);
			this._current = current; this.caller = caller;
			return result;
		}.extend({_owner: self, _origin: method, _name: key});

	}
	
});

Class.implement({
	
	implement: function(key, value){
		
		if ($type(key) == 'object'){
			for (var p in key) this.implement(p, key[p]);
			return this;
		}
		
		var mutator = Class.Mutators[key];
		
		if (mutator){
			value = mutator.call(this, value);
			if (value == null) return this;
		}
		
		var proto = this.prototype;

		switch ($type(value)){
			
			case 'function':
				if (value._hidden) return this;
				proto[key] = Class.wrap(this, key, value);
			break;
			
			case 'object':
				var previous = proto[key];
				if ($type(previous) == 'object') $mixin(previous, value);
				else proto[key] = $unlink(value);
			break;
			
			case 'array':
				proto[key] = $unlink(value);
			break;
			
			default: proto[key] = value;

		}
		
		return this;

	}
	
});

Class.Mutators = {
	
	Extends: function(parent){

		this.parent = parent;
		this.prototype = Class.instantiate(parent);

		this.implement('parent', function(){
			var name = this.caller._name, previous = this.caller._owner.parent.prototype[name];
			if (!previous) throw new Error('The method "' + name + '" has no parent.');
			return previous.apply(this, arguments);
		}.protect());

	},

	Implements: function(items){
		$splat(items).each(function(item){
			if (item instanceof Function) item = Class.instantiate(item);
			this.implement(item);
		}, this);

	}
	
};


/*
---

script: Class.Extras.js

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires:
- /Class

provides: [Chain, Events, Options]

...
*/

var Chain = new Class({

	$chain: [],

	chain: function(){
		this.$chain.extend(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});

var Events = new Class({

	$events: {},

	addEvent: function(type, fn, internal){
		type = Events.removeOn(type);
		if (fn != $empty){
			this.$events[type] = this.$events[type] || [];
			this.$events[type].include(fn);
			if (internal) fn.internal = true;
		}
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = Events.removeOn(type);
		if (!this.$events || !this.$events[type]) return this;
		this.$events[type].each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = Events.removeOn(type);
		if (!this.$events[type]) return this;
		if (!fn.internal) this.$events[type].erase(fn);
		return this;
	},

	removeEvents: function(events){
		var type;
		if ($type(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = Events.removeOn(events);
		for (type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--; i) this.removeEvent(type, fns[i]);
		}
		return this;
	}

});

Events.removeOn = function(string){
	return string.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
};

var Options = new Class({

	setOptions: function(){
		this.options = $merge.run([this.options].extend(arguments));
		if (!this.addEvent) return this;
		for (var option in this.options){
			if ($type(this.options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, this.options[option]);
			delete this.options[option];
		}
		return this;
	}

});


/*
---

script: Element.js

description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

license: MIT-style license.

requires:
- /Window
- /Document
- /Array
- /String
- /Function
- /Number
- /Hash

provides: [Element, Elements, $, $$, Iframe]

...
*/

var Element = new Native({

	name: 'Element',

	legacy: window.Element,

	initialize: function(tag, props){
		var konstructor = Element.Constructors.get(tag);
		if (konstructor) return konstructor(props);
		if (typeof tag == 'string') return document.newElement(tag, props);
		return document.id(tag).set(props);
	},

	afterImplement: function(key, value){
		Element.Prototype[key] = value;
		if (Array[key]) return;
		Elements.implement(key, function(){
			var items = [], elements = true;
			for (var i = 0, j = this.length; i < j; i++){
				var returns = this[i][key].apply(this[i], arguments);
				items.push(returns);
				if (elements) elements = ($type(returns) == 'element');
			}
			return (elements) ? new Elements(items) : items;
		});
	}

});

Element.Prototype = {$family: {name: 'element'}};

Element.Constructors = new Hash;

var IFrame = new Native({

	name: 'IFrame',

	generics: false,

	initialize: function(){
		var params = Array.link(arguments, {properties: Object.type, iframe: $defined});
		var props = params.properties || {};
		var iframe = document.id(params.iframe);
		var onload = props.onload || $empty;
		delete props.onload;
		props.id = props.name = $pick(props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + $time());
		iframe = new Element(iframe || 'iframe', props);
		var onFrameLoad = function(){
			var host = $try(function(){
				return iframe.contentWindow.location.host;
			});
			if (!host || host == window.location.host){
				var win = new Window(iframe.contentWindow);
				new Document(iframe.contentWindow.document);
				$extend(win.Element.prototype, Element.Prototype);
			}
			onload.call(iframe.contentWindow, iframe.contentWindow.document);
		};
		var contentWindow = $try(function(){
			return iframe.contentWindow;
		});
		((contentWindow && contentWindow.document.body) || window.frames[props.id]) ? onFrameLoad() : iframe.addListener('load', onFrameLoad);
		return iframe;
	}

});

var Elements = new Native({

	initialize: function(elements, options){
		options = $extend({ddup: true, cash: true}, options);
		elements = elements || [];
		if (options.ddup || options.cash){
			var uniques = {}, returned = [];
			for (var i = 0, l = elements.length; i < l; i++){
				var el = document.id(elements[i], !options.cash);
				if (options.ddup){
					if (uniques[el.uid]) continue;
					uniques[el.uid] = true;
				}
				if (el) returned.push(el);
			}
			elements = returned;
		}
		return (options.cash) ? $extend(elements, this) : elements;
	}

});

Elements.implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeof filter == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}

});

Document.implement({

	newElement: function(tag, props){
		return document.id(this.createElement(tag)).set(props);
	},

	newTextNode: function(text){
		return this.createTextNode(text);
	},

	getDocument: function(){
		return this;
	},

	getWindow: function(){
		return this.window;
	},
	
	id: (function(){
		
		var types = {

			string: function(id, nocash, doc){
				id = doc.getElementById(id);
				return (id) ? types.element(id, nocash) : null;
			},
			
			element: function(el, nocash){
				$uid(el);
				if (!nocash && !el.$family && !(/^object|embed$/i).test(el.tagName)){
					var proto = Element.Prototype;
					for (var p in proto) el[p] = proto[p];
				};
				return el;
			},
			
			object: function(obj, nocash, doc){
				if (obj.toElement) return types.element(obj.toElement(doc), nocash);
				return null;
			}
			
		};

		types.textnode = types.whitespace = types.window = types.document = $arguments(0);
		
		return function(el, nocash, doc){
			if (el && el.$family && el.uid) return el;
			var type = $type(el);
			return (types[type]) ? types[type](el, nocash, doc || document) : null;
		};

	})()

});

if (window.$ == null) Window.implement({
	$: function(el, nc){
		return document.id(el, nc, this.document);
	}
});

Window.implement({

	$$: function(selector){
		if (arguments.length == 1 && typeof selector == 'string') return this.document.getElements(selector);
		var elements = [];
		var args = Array.flatten(arguments);
		for (var i = 0, l = args.length; i < l; i++){
			var item = args[i];
			switch ($type(item)){
				case 'element': elements.push(item); break;
				case 'string': elements.extend(this.document.getElements(item, true));
			}
		}
		return new Elements(elements);
	},

	getDocument: function(){
		return this.document;
	},

	getWindow: function(){
		return this;
	}

});

Native.implement([Element, Document], {

	getElement: function(selector, nocash){
		return document.id(this.getElements(selector, true)[0] || null, nocash);
	},

	getElements: function(tags, nocash){
		tags = tags.split(',');
		var elements = [];
		var ddup = (tags.length > 1);
		tags.each(function(tag){
			var partial = this.getElementsByTagName(tag.trim());
			(ddup) ? elements.extend(partial) : elements = partial;
		}, this);
		return new Elements(elements, {ddup: ddup, cash: !nocash});
	}

});

(function(){

var collected = {}, storage = {};
var props = {input: 'checked', option: 'selected', textarea: (Browser.Engine.webkit && Browser.Engine.version < 420) ? 'innerHTML' : 'value'};

var get = function(uid){
	return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item, retain){
	if (!item) return;
	var uid = item.uid;
	if (Browser.Engine.trident){
		if (item.clearAttributes){
			var clone = retain && item.cloneNode(false);
			item.clearAttributes();
			if (clone) item.mergeAttributes(clone);
		} else if (item.removeEvents){
			item.removeEvents();
		}
		if ((/object/i).test(item.tagName)){
			for (var p in item){
				if (typeof item[p] == 'function') item[p] = $empty;
			}
			Element.dispose(item);
		}
	}	
	if (!uid) return;
	collected[uid] = storage[uid] = null;
};

var purge = function(){
	Hash.each(collected, clean);
	if (Browser.Engine.trident) $A(document.getElementsByTagName('object')).each(clean);
	if (window.CollectGarbage) CollectGarbage();
	collected = storage = null;
};

var walk = function(element, walk, start, match, all, nocash){
	var el = element[start || walk];
	var elements = [];
	while (el){
		if (el.nodeType == 1 && (!match || Element.match(el, match))){
			if (!all) return document.id(el, nocash);
			elements.push(el);
		}
		el = el[walk];
	}
	return (all) ? new Elements(elements, {ddup: false, cash: !nocash}) : null;
};

var attributes = {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'defaultValue': 'defaultValue',
	'text': (Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)) ? 'innerText' : 'textContent'
};
var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readonly', 'multiple', 'selected', 'noresize', 'defer'];
var camels = ['value', 'type', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap'];

bools = bools.associate(bools);

Hash.extend(attributes, bools);
Hash.extend(attributes, camels.associate(camels.map(String.toLowerCase)));

var inserters = {

	before: function(context, element){
		if (element.parentNode) element.parentNode.insertBefore(context, element);
	},

	after: function(context, element){
		if (!element.parentNode) return;
		var next = element.nextSibling;
		(next) ? element.parentNode.insertBefore(context, next) : element.parentNode.appendChild(context);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		var first = element.firstChild;
		(first) ? element.insertBefore(context, first) : element.appendChild(context);
	}

};

inserters.inside = inserters.bottom;

Hash.each(inserters, function(inserter, where){

	where = where.capitalize();

	Element.implement('inject' + where, function(el){
		inserter(this, document.id(el, true));
		return this;
	});

	Element.implement('grab' + where, function(el){
		inserter(document.id(el, true), this);
		return this;
	});

});

Element.implement({

	set: function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				var property = Element.Properties.get(prop);
				(property && property.set) ? property.set.apply(this, Array.slice(arguments, 1)) : this.setProperty(prop, value);
		}
		return this;
	},

	get: function(prop){
		var property = Element.Properties.get(prop);
		return (property && property.get) ? property.get.apply(this, Array.slice(arguments, 1)) : this.getProperty(prop);
	},

	erase: function(prop){
		var property = Element.Properties.get(prop);
		(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
		return this;
	},

	setProperty: function(attribute, value){
		var key = attributes[attribute];
		if (value == undefined) return this.removeProperty(attribute);
		if (key && bools[attribute]) value = !!value;
		(key) ? this[key] = value : this.setAttribute(attribute, '' + value);
		return this;
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
	},

	getProperty: function(attribute){
		var key = attributes[attribute];
		var value = (key) ? this[key] : this.getAttribute(attribute, 2);
		return (bools[attribute]) ? !!value : (key) ? value : value || null;
	},

	getProperties: function(){
		var args = $A(arguments);
		return args.map(this.getProperty, this).associate(args);
	},

	removeProperty: function(attribute){
		var key = attributes[attribute];
		(key) ? this[key] = (key && bools[attribute]) ? false : '' : this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	},

	hasClass: function(className){
		return this.className.contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className){
		return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	},

	adopt: function(){
		Array.flatten(arguments).each(function(element){
			element = document.id(element, true);
			if (element) this.appendChild(element);
		}, this);
		return this;
	},

	appendText: function(text, where){
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	grab: function(el, where){
		inserters[where || 'bottom'](document.id(el, true), this);
		return this;
	},

	inject: function(el, where){
		inserters[where || 'bottom'](this, document.id(el, true));
		return this;
	},

	replaces: function(el){
		el = document.id(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	wraps: function(el, where){
		el = document.id(el, true);
		return this.replaces(el).grab(el, where);
	},

	getPrevious: function(match, nocash){
		return walk(this, 'previousSibling', null, match, false, nocash);
	},

	getAllPrevious: function(match, nocash){
		return walk(this, 'previousSibling', null, match, true, nocash);
	},

	getNext: function(match, nocash){
		return walk(this, 'nextSibling', null, match, false, nocash);
	},

	getAllNext: function(match, nocash){
		return walk(this, 'nextSibling', null, match, true, nocash);
	},

	getFirst: function(match, nocash){
		return walk(this, 'nextSibling', 'firstChild', match, false, nocash);
	},

	getLast: function(match, nocash){
		return walk(this, 'previousSibling', 'lastChild', match, false, nocash);
	},

	getParent: function(match, nocash){
		return walk(this, 'parentNode', null, match, false, nocash);
	},

	getParents: function(match, nocash){
		return walk(this, 'parentNode', null, match, true, nocash);
	},
	
	getSiblings: function(match, nocash){
		return this.getParent().getChildren(match, nocash).erase(this);
	},

	getChildren: function(match, nocash){
		return walk(this, 'nextSibling', 'firstChild', match, true, nocash);
	},

	getWindow: function(){
		return this.ownerDocument.window;
	},

	getDocument: function(){
		return this.ownerDocument;
	},

	getElementById: function(id, nocash){
		var el = this.ownerDocument.getElementById(id);
		if (!el) return null;
		for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			if (!parent) return null;
		}
		return document.id(el, nocash);
	},

	getSelected: function(){
		return new Elements($A(this.options).filter(function(option){
			return option.selected;
		}));
	},

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var computed = this.getDocument().defaultView.getComputedStyle(this, null);
		return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea', true).each(function(el){
			if (!el.name || el.disabled || el.type == 'submit' || el.type == 'reset' || el.type == 'file') return;
			var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
			$splat(value).each(function(val){
				if (typeof val != 'undefined') queryString.push(el.name + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	clone: function(contents, keepid){
		contents = contents !== false;
		var clone = this.cloneNode(contents);
		var clean = function(node, element){
			if (!keepid) node.removeAttribute('id');
			if (Browser.Engine.trident){
				node.clearAttributes();
				node.mergeAttributes(element);
				node.removeAttribute('uid');
				if (node.options){
					var no = node.options, eo = element.options;
					for (var j = no.length; j--;) no[j].selected = eo[j].selected;
				}
			}
			var prop = props[element.tagName.toLowerCase()];
			if (prop && element[prop]) node[prop] = element[prop];
		};

		if (contents){
			var ce = clone.getElementsByTagName('*'), te = this.getElementsByTagName('*');
			for (var i = ce.length; i--;) clean(ce[i], te[i]);
		}

		clean(clone, this);
		return document.id(clone);
	},

	destroy: function(){
		Element.empty(this);
		Element.dispose(this);
		clean(this, true);
		return null;
	},

	empty: function(){
		$A(this.childNodes).each(function(node){
			Element.destroy(node);
		});
		return this;
	},

	dispose: function(){
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	hasChild: function(el){
		el = document.id(el, true);
		if (!el) return false;
		if (Browser.Engine.webkit && Browser.Engine.version < 420) return $A(this.getElementsByTagName(el.tagName)).contains(el);
		return (this.contains) ? (this != el && this.contains(el)) : !!(this.compareDocumentPosition(el) & 16);
	},

	match: function(tag){
		return (!tag || (tag == this) || (Element.get(this, 'tag') == tag));
	}

});

Native.implement([Element, Window, Document], {

	addListener: function(type, fn){
		if (type == 'unload'){
			var old = fn, self = this;
			fn = function(){
				self.removeListener('unload', fn);
				old();
			};
		} else {
			collected[this.uid] = this;
		}
		if (this.addEventListener) this.addEventListener(type, fn, false);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, false);
		else this.detachEvent('on' + type, fn);
		return this;
	},

	retrieve: function(property, dflt){
		var storage = get(this.uid), prop = storage[property];
		if (dflt != undefined && prop == undefined) prop = storage[property] = dflt;
		return $pick(prop);
	},

	store: function(property, value){
		var storage = get(this.uid);
		storage[property] = value;
		return this;
	},

	eliminate: function(property){
		var storage = get(this.uid);
		delete storage[property];
		return this;
	}

});

window.addListener('unload', purge);

})();

Element.Properties = new Hash;

Element.Properties.style = {

	set: function(style){
		this.style.cssText = style;
	},

	get: function(){
		return this.style.cssText;
	},

	erase: function(){
		this.style.cssText = '';
	}

};

Element.Properties.tag = {

	get: function(){
		return this.tagName.toLowerCase();
	}

};

Element.Properties.html = (function(){
	var wrapper = document.createElement('div');

	var translations = {
		table: [1, '<table>', '</table>'],
		select: [1, '<select>', '</select>'],
		tbody: [2, '<table><tbody>', '</tbody></table>'],
		tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};
	translations.thead = translations.tfoot = translations.tbody;

	var html = {
		set: function(){
			var html = Array.flatten(arguments).join('');
			var wrap = Browser.Engine.trident && translations[this.get('tag')];
			if (wrap){
				var first = wrapper;
				first.innerHTML = wrap[1] + html + wrap[2];
				for (var i = wrap[0]; i--;) first = first.firstChild;
				this.empty().adopt(first.childNodes);
			} else {
				this.innerHTML = html;
			}
		}
	};

	html.erase = html.set;

	return html;
})();

if (Browser.Engine.webkit && Browser.Engine.version < 420) Element.Properties.text = {
	get: function(){
		if (this.innerText) return this.innerText;
		var temp = this.ownerDocument.newElement('div', {html: this.innerHTML}).inject(this.ownerDocument.body);
		var text = temp.innerText;
		temp.destroy();
		return text;
	}
};


/*
---

script: Element.Event.js

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events.

license: MIT-style license.

requires: 
- /Element
- /Event

provides: [Element.Event]

...
*/

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

Native.implement([Element, Window, Document], {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		events[type] = events[type] || {'keys': [], 'values': []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type, custom = Element.Events.get(type), condition = fn, self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event)) return fn.call(this, event);
					return true;
				};
			}
			realType = custom.base || realType;
		}
		var defn = function(){
			if(fn.call) {
        return fn.call(self);
      }
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new Event(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn);
		}
		events[type].values.push(defn);
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var pos = events[type].keys.indexOf(fn);
		if (pos == -1) return this;
		events[type].keys.splice(pos, 1);
		var value = events[type].values.splice(pos, 1)[0];
		var custom = Element.Events.get(type);
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn);
			type = custom.base || type;
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(events){
		var type;
		if ($type(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) return this;
		if (!events){
			for (type in attached) this.removeEvents(type);
			this.eliminate('events');
		} else if (attached[events]){
			while (attached[events].keys[0]) this.removeEvent(events, attached[events].keys[0]);
			attached[events] = null;
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		events[type].keys.each(function(fn){
			fn.create({'bind': this, 'delay': delay, 'arguments': args})();
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = document.id(from);
		var fevents = from.retrieve('events');
		if (!fevents) return this;
		if (!type){
			for (var evType in fevents) this.cloneEvents(from, evType);
		} else if (fevents[type]){
			fevents[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
};

(function(){

var $check = function(event){
	var related = event.relatedTarget;
	if (related == undefined) return true;
	if (related === false) return false;
	return ($type(this) != 'document' && related != this && related.prefix != 'xul' && !this.hasChild(related));
};

Element.Events = new Hash({

	mouseenter: {
		base: 'mouseover',
		condition: $check
	},

	mouseleave: {
		base: 'mouseout',
		condition: $check
	},

	mousewheel: {
		base: (Browser.Engine.gecko) ? 'DOMMouseScroll' : 'mousewheel'
	}

});

})();


/*
---

script: Element.Style.js

description: Contains methods for interacting with the styles of Elements in a fashionable way.

license: MIT-style license.

requires:
- /Element

provides: [Element.Style]

...
*/

Element.Properties.styles = {set: function(styles){
	this.setStyles(styles);
}};

Element.Properties.opacity = {

	set: function(opacity, novisibility){
		if (!novisibility){
			if (opacity == 0){
				if (this.style.visibility != 'hidden') this.style.visibility = 'hidden';
			} else {
				if (this.style.visibility != 'visible') this.style.visibility = 'visible';
			}
		}
		if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
		if (Browser.Engine.trident) this.style.filter = (opacity == 1) ? '' : 'alpha(opacity=' + opacity * 100 + ')';
		this.style.opacity = opacity;
		this.store('opacity', opacity);
	},

	get: function(){
		return this.retrieve('opacity', 1);
	}

};

Element.implement({

	setOpacity: function(value){
		return this.set('opacity', value, true);
	},

	getOpacity: function(){
		return this.get('opacity');
	},

	setStyle: function(property, value){
		switch (property){
			case 'opacity': return this.set('opacity', parseFloat(value));
			case 'float': property = (Browser.Engine.trident) ? 'styleFloat' : 'cssFloat';
		}

		property = property.camelCase();
		if ($type(value) != 'string'){
			var map = (Element.Styles.get(property) || '@').split(' ');
			value = $splat(value).map(function(val, i){
				if (!map[i]) return '';
				return ($type(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
			}).join(' ');
		} else if (value == String(Number(value))){
			value = Math.round(value);
		}
		this.style[property] = value;
		return this;
	},

	getStyle: function(property){
		switch (property){
			case 'opacity': return this.get('opacity');
			case 'float': property = (Browser.Engine.trident) ? 'styleFloat' : 'cssFloat';
		}
		property = property.camelCase();
		var result = this.style[property];
		if (!$chk(result)){
			result = [];
			for (var style in Element.ShortStyles){
				if (property != style) continue;
				for (var s in Element.ShortStyles[style]) result.push(this.getStyle(s));
				return result.join(' ');
			}
			result = this.getComputedStyle(property);
		}
		if (result){
			result = String(result);
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(result, 10)))){
			if (property.test(/^(height|width)$/)){
				var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
				values.each(function(value){
					size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
				}, this);
				return this['offset' + property.capitalize()] - size + 'px';
			}
			if ((Browser.Engine.presto) && String(result).test('px')) return result;
			if (property.test(/(border(.+)Width|margin|padding)/)) return '0px';
		}
		return result;
	},

	setStyles: function(styles){
		for (var style in styles) this.setStyle(style, styles[style]);
		return this;
	},

	getStyles: function(){
		var result = {};
		Array.flatten(arguments).each(function(key){
			result[key] = this.getStyle(key);
		}, this);
		return result;
	}

});

Element.Styles = new Hash({
	left: '@px', top: '@px', bottom: '@px', right: '@px',
	width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
	backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
	fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
	margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
	borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
	zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
});

Element.ShortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
	var Short = Element.ShortStyles;
	var All = Element.Styles;
	['margin', 'padding'].each(function(style){
		var sd = style + direction;
		Short[style][sd] = All[sd] = '@px';
	});
	var bd = 'border' + direction;
	Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	Short[bd] = {};
	Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
	Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
	Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});


/*
---

script: Element.Dimensions.js

description: Contains methods to work with size, scroll, or positioning of Elements and the window object.

license: MIT-style license.

credits:
- Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
- Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).

requires:
- /Element

provides: [Element.Dimensions]

...
*/

(function(){

Element.implement({

	scrollTo: function(x, y){
		if (isBody(this)){
			this.getWindow().scrollTo(x, y);
		} else {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
		return this;
	},

	getSize: function(){
		if (isBody(this)) return this.getWindow().getSize();
		return {x: this.offsetWidth, y: this.offsetHeight};
	},

	getScrollSize: function(){
		if (isBody(this)) return this.getWindow().getScrollSize();
		return {x: this.scrollWidth, y: this.scrollHeight};
	},

	getScroll: function(){
		if (isBody(this)) return this.getWindow().getScroll();
		return {x: this.scrollLeft, y: this.scrollTop};
	},

	getScrolls: function(){
		var element = this, position = {x: 0, y: 0};
		while (element && !isBody(element)){
			position.x += element.scrollLeft;
			position.y += element.scrollTop;
			element = element.parentNode;
		}
		return position;
	},

	getOffsetParent: function(){
		var element = this;
		if (isBody(element)) return null;
		if (!Browser.Engine.trident) return element.offsetParent;
		while ((element = element.parentNode) && !isBody(element)){
			if (styleString(element, 'position') != 'static') return element;
		}
		return null;
	},

	getOffsets: function(){
		if (this.getBoundingClientRect){
			var bound = this.getBoundingClientRect(),
				html = document.id(this.getDocument().documentElement),
				htmlScroll = html.getScroll(),
				elemScrolls = this.getScrolls(),
				elemScroll = this.getScroll(),
				isFixed = (styleString(this, 'position') == 'fixed');

			return {
				x: bound.left.toInt() + elemScrolls.x - elemScroll.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
				y: bound.top.toInt()  + elemScrolls.y - elemScroll.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
			};
		}

		var element = this, position = {x: 0, y: 0};
		if (isBody(this)) return position;

		while (element && !isBody(element)){
			position.x += element.offsetLeft;
			position.y += element.offsetTop;

			if (Browser.Engine.gecko){
				if (!borderBox(element)){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
				var parent = element.parentNode;
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.x += leftBorder(parent);
					position.y += topBorder(parent);
				}
			} else if (element != this && Browser.Engine.webkit){
				position.x += leftBorder(element);
				position.y += topBorder(element);
			}

			element = element.offsetParent;
		}
		if (Browser.Engine.gecko && !borderBox(this)){
			position.x -= leftBorder(this);
			position.y -= topBorder(this);
		}
		return position;
	},

	getPosition: function(relative){
		if (isBody(this)) return {x: 0, y: 0};
		var offset = this.getOffsets(),
				scroll = this.getScrolls();
		var position = {
			x: offset.x - scroll.x,
			y: offset.y - scroll.y
		};
		var relativePosition = (relative && (relative = document.id(relative))) ? relative.getPosition() : {x: 0, y: 0};
		return {x: position.x - relativePosition.x, y: position.y - relativePosition.y};
	},

	getCoordinates: function(element){
		if (isBody(this)) return this.getWindow().getCoordinates();
		var position = this.getPosition(element),
				size = this.getSize();
		var obj = {
			left: position.x,
			top: position.y,
			width: size.x,
			height: size.y
		};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},

	computePosition: function(obj){
		return {
			left: obj.x - styleNumber(this, 'margin-left'),
			top: obj.y - styleNumber(this, 'margin-top')
		};
	},

	setPosition: function(obj){
		return this.setStyles(this.computePosition(obj));
	}

});


Native.implement([Document, Window], {

	getSize: function(){
		if (Browser.Engine.presto || Browser.Engine.webkit){
			var win = this.getWindow();
			return {x: win.innerWidth, y: win.innerHeight};
		} 
		var doc = getCompatElement(this);
		return {x: doc.clientWidth, y: doc.clientHeight};
	},

	getScroll: function(){
		var win = this.getWindow(), doc = getCompatElement(this);
		return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
	},

	getScrollSize: function(){
		var doc = getCompatElement(this), min = this.getSize();
		return {x: Math.max(doc.scrollWidth, min.x), y: Math.max(doc.scrollHeight, min.y)};
	},

	getPosition: function(){
		return {x: 0, y: 0};
	},

	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
	}

});

// private methods

var styleString = Element.getComputedStyle;

function styleNumber(element, style){
	return styleString(element, style).toInt() || 0;
};

function borderBox(element){
	return styleString(element, '-moz-box-sizing') == 'border-box';
};

function topBorder(element){
	return styleNumber(element, 'border-top-width');
};

function leftBorder(element){
	return styleNumber(element, 'border-left-width');
};

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

function getCompatElement(element){
	var doc = element.getDocument();
	return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
};

})();

//aliases
Element.alias('setPosition', 'position'); //compatability

Native.implement([Window, Document, Element], {

	getHeight: function(){
		return this.getSize().y;
	},

	getWidth: function(){
		return this.getSize().x;
	},

	getScrollTop: function(){
		return this.getScroll().y;
	},

	getScrollLeft: function(){
		return this.getScroll().x;
	},

	getScrollHeight: function(){
		return this.getScrollSize().y;
	},

	getScrollWidth: function(){
		return this.getScrollSize().x;
	},

	getTop: function(){
		return this.getPosition().y;
	},

	getLeft: function(){
		return this.getPosition().x;
	}

});


/*
---

script: Selectors.js

description: Adds advanced CSS-style querying capabilities for targeting HTML Elements. Includes pseudo selectors.

license: MIT-style license.

requires:
- /Element

provides: [Selectors]

...
*/

Native.implement([Document, Element], {

	getElements: function(expression, nocash){
		expression = expression.split(',');
		var items, local = {};
		for (var i = 0, l = expression.length; i < l; i++){
			var selector = expression[i], elements = Selectors.Utils.search(this, selector, local);
			if (i != 0 && elements.item) elements = $A(elements);
			items = (i == 0) ? elements : (items.item) ? $A(items).concat(elements) : items.concat(elements);
		}
		return new Elements(items, {ddup: (expression.length > 1), cash: !nocash});
	}

});

Element.implement({

	match: function(selector){
		if (!selector || (selector == this)) return true;
		var tagid = Selectors.Utils.parseTagAndID(selector);
		var tag = tagid[0], id = tagid[1];
		if (!Selectors.Filters.byID(this, id) || !Selectors.Filters.byTag(this, tag)) return false;
		var parsed = Selectors.Utils.parseSelector(selector);
		return (parsed) ? Selectors.Utils.filter(this, parsed, {}) : true;
	}

});

var Selectors = {Cache: {nth: {}, parsed: {}}};

Selectors.RegExps = {
	id: (/#([\w-]+)/),
	tag: (/^(\w+|\*)/),
	quick: (/^(\w+|\*)$/),
	splitter: (/\s*([+>~\s])\s*([a-zA-Z#.*:\[])/g),
	combined: (/\.([\w-]+)|\[(\w+)(?:([!*^$~|]?=)(["']?)([^\4]*?)\4)?\]|:([\w-]+)(?:\(["']?(.*?)?["']?\)|$)/g)
};

Selectors.Utils = {

	chk: function(item, uniques){
		if (!uniques) return true;
		var uid = $uid(item);
		if (!uniques[uid]) return uniques[uid] = true;
		return false;
	},

	parseNthArgument: function(argument){
		if (Selectors.Cache.nth[argument]) return Selectors.Cache.nth[argument];
		var parsed = argument.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
		if (!parsed) return false;
		var inta = parseInt(parsed[1], 10);
		var a = (inta || inta === 0) ? inta : 1;
		var special = parsed[2] || false;
		var b = parseInt(parsed[3], 10) || 0;
		if (a != 0){
			b--;
			while (b < 1) b += a;
			while (b >= a) b -= a;
		} else {
			a = b;
			special = 'index';
		}
		switch (special){
			case 'n': parsed = {a: a, b: b, special: 'n'}; break;
			case 'odd': parsed = {a: 2, b: 0, special: 'n'}; break;
			case 'even': parsed = {a: 2, b: 1, special: 'n'}; break;
			case 'first': parsed = {a: 0, special: 'index'}; break;
			case 'last': parsed = {special: 'last-child'}; break;
			case 'only': parsed = {special: 'only-child'}; break;
			default: parsed = {a: (a - 1), special: 'index'};
		}

		return Selectors.Cache.nth[argument] = parsed;
	},

	parseSelector: function(selector){
		if (Selectors.Cache.parsed[selector]) return Selectors.Cache.parsed[selector];
		var m, parsed = {classes: [], pseudos: [], attributes: []};
		while ((m = Selectors.RegExps.combined.exec(selector))){
			var cn = m[1], an = m[2], ao = m[3], av = m[5], pn = m[6], pa = m[7];
			if (cn){
				parsed.classes.push(cn);
			} else if (pn){
				var parser = Selectors.Pseudo.get(pn);
				if (parser) parsed.pseudos.push({parser: parser, argument: pa});
				else parsed.attributes.push({name: pn, operator: '=', value: pa});
			} else if (an){
				parsed.attributes.push({name: an, operator: ao, value: av});
			}
		}
		if (!parsed.classes.length) delete parsed.classes;
		if (!parsed.attributes.length) delete parsed.attributes;
		if (!parsed.pseudos.length) delete parsed.pseudos;
		if (!parsed.classes && !parsed.attributes && !parsed.pseudos) parsed = null;
		return Selectors.Cache.parsed[selector] = parsed;
	},

	parseTagAndID: function(selector){
		var tag = selector.match(Selectors.RegExps.tag);
		var id = selector.match(Selectors.RegExps.id);
		return [(tag) ? tag[1] : '*', (id) ? id[1] : false];
	},

	filter: function(item, parsed, local){
		var i;
		if (parsed.classes){
			for (i = parsed.classes.length; i--; i){
				var cn = parsed.classes[i];
				if (!Selectors.Filters.byClass(item, cn)) return false;
			}
		}
		if (parsed.attributes){
			for (i = parsed.attributes.length; i--; i){
				var att = parsed.attributes[i];
				if (!Selectors.Filters.byAttribute(item, att.name, att.operator, att.value)) return false;
			}
		}
		if (parsed.pseudos){
			for (i = parsed.pseudos.length; i--; i){
				var psd = parsed.pseudos[i];
				if (!Selectors.Filters.byPseudo(item, psd.parser, psd.argument, local)) return false;
			}
		}
		return true;
	},

	getByTagAndID: function(ctx, tag, id){
		if (id){
			var item = (ctx.getElementById) ? ctx.getElementById(id, true) : Element.getElementById(ctx, id, true);
			return (item && Selectors.Filters.byTag(item, tag)) ? [item] : [];
		} else {
			return ctx.getElementsByTagName(tag);
		}
	},

	search: function(self, expression, local){
		var splitters = [];

		var selectors = expression.trim().replace(Selectors.RegExps.splitter, function(m0, m1, m2){
			splitters.push(m1);
			return ':)' + m2;
		}).split(':)');

		var items, filtered, item;

		for (var i = 0, l = selectors.length; i < l; i++){

			var selector = selectors[i];

			if (i == 0 && Selectors.RegExps.quick.test(selector)){
				items = self.getElementsByTagName(selector);
				continue;
			}

			var splitter = splitters[i - 1];

			var tagid = Selectors.Utils.parseTagAndID(selector);
			var tag = tagid[0], id = tagid[1];

			if (i == 0){
				items = Selectors.Utils.getByTagAndID(self, tag, id);
			} else {
				var uniques = {}, found = [];
				for (var j = 0, k = items.length; j < k; j++) found = Selectors.Getters[splitter](found, items[j], tag, id, uniques);
				items = found;
			}

			var parsed = Selectors.Utils.parseSelector(selector);

			if (parsed){
				filtered = [];
				for (var m = 0, n = items.length; m < n; m++){
					item = items[m];
					if (Selectors.Utils.filter(item, parsed, local)) filtered.push(item);
				}
				items = filtered;
			}

		}

		return items;

	}

};

Selectors.Getters = {

	' ': function(found, self, tag, id, uniques){
		var items = Selectors.Utils.getByTagAndID(self, tag, id);
		for (var i = 0, l = items.length; i < l; i++){
			var item = items[i];
			if (Selectors.Utils.chk(item, uniques)) found.push(item);
		}
		return found;
	},

	'>': function(found, self, tag, id, uniques){
		var children = Selectors.Utils.getByTagAndID(self, tag, id);
		for (var i = 0, l = children.length; i < l; i++){
			var child = children[i];
			if (child.parentNode == self && Selectors.Utils.chk(child, uniques)) found.push(child);
		}
		return found;
	},

	'+': function(found, self, tag, id, uniques){
		while ((self = self.nextSibling)){
			if (self.nodeType == 1){
				if (Selectors.Utils.chk(self, uniques) && Selectors.Filters.byTag(self, tag) && Selectors.Filters.byID(self, id)) found.push(self);
				break;
			}
		}
		return found;
	},

	'~': function(found, self, tag, id, uniques){
		while ((self = self.nextSibling)){
			if (self.nodeType == 1){
				if (!Selectors.Utils.chk(self, uniques)) break;
				if (Selectors.Filters.byTag(self, tag) && Selectors.Filters.byID(self, id)) found.push(self);
			}
		}
		return found;
	}

};

Selectors.Filters = {

	byTag: function(self, tag){
		return (tag == '*' || (self.tagName && self.tagName.toLowerCase() == tag));
	},

	byID: function(self, id){
		return (!id || (self.id && self.id == id));
	},

	byClass: function(self, klass){
		return (self.className && self.className.contains && self.className.contains(klass, ' '));
	},

	byPseudo: function(self, parser, argument, local){
		return parser.call(self, argument, local);
	},

	byAttribute: function(self, name, operator, value){
		var result = Element.prototype.getProperty.call(self, name);
		if (!result) return (operator == '!=');
		if (!operator || value == undefined) return true;
		switch (operator){
			case '=': return (result == value);
			case '*=': return (result.contains(value));
			case '^=': return (result.substr(0, value.length) == value);
			case '$=': return (result.substr(result.length - value.length) == value);
			case '!=': return (result != value);
			case '~=': return result.contains(value, ' ');
			case '|=': return result.contains(value, '-');
		}
		return false;
	}

};

Selectors.Pseudo = new Hash({

	// w3c pseudo selectors

	checked: function(){
		return this.checked;
	},
	
	empty: function(){
		return !(this.innerText || this.textContent || '').length;
	},

	not: function(selector){
		return !Element.match(this, selector);
	},

	contains: function(text){
		return (this.innerText || this.textContent || '').contains(text);
	},

	'first-child': function(){
		return Selectors.Pseudo.index.call(this, 0);
	},

	'last-child': function(){
		var element = this;
		while ((element = element.nextSibling)){
			if (element.nodeType == 1) return false;
		}
		return true;
	},

	'only-child': function(){
		var prev = this;
		while ((prev = prev.previousSibling)){
			if (prev.nodeType == 1) return false;
		}
		var next = this;
		while ((next = next.nextSibling)){
			if (next.nodeType == 1) return false;
		}
		return true;
	},

	'nth-child': function(argument, local){
		argument = (argument == undefined) ? 'n' : argument;
		var parsed = Selectors.Utils.parseNthArgument(argument);
		if (parsed.special != 'n') return Selectors.Pseudo[parsed.special].call(this, parsed.a, local);
		var count = 0;
		local.positions = local.positions || {};
		var uid = $uid(this);
		if (!local.positions[uid]){
			var self = this;
			while ((self = self.previousSibling)){
				if (self.nodeType != 1) continue;
				count ++;
				var position = local.positions[$uid(self)];
				if (position != undefined){
					count = position + count;
					break;
				}
			}
			local.positions[uid] = count;
		}
		return (local.positions[uid] % parsed.a == parsed.b);
	},

	// custom pseudo selectors

	index: function(index){
		var element = this, count = 0;
		while ((element = element.previousSibling)){
			if (element.nodeType == 1 && ++count > index) return false;
		}
		return (count == index);
	},

	even: function(argument, local){
		return Selectors.Pseudo['nth-child'].call(this, '2n+1', local);
	},

	odd: function(argument, local){
		return Selectors.Pseudo['nth-child'].call(this, '2n', local);
	},
	
	selected: function(){
		return this.selected;
	},
	
	enabled: function(){
		return (this.disabled === false);
	}

});


/*
---

script: DomReady.js

description: Contains the custom event domready.

license: MIT-style license.

requires:
- /Element.Event

provides: [DomReady]

...
*/

Element.Events.domready = {

	onAdd: function(fn){
		if (Browser.loaded) fn.call(this);
	}

};

(function(){

	var domready = function(){
		if (Browser.loaded) return;
		Browser.loaded = true;
		window.fireEvent('domready');
		document.fireEvent('domready');
	};
	
	window.addEvent('load', domready);

	if (Browser.Engine.trident){
		var temp = document.createElement('div');
		(function(){
			($try(function(){
				temp.doScroll(); // Technique by Diego Perini
				return document.id(temp).inject(document.body).set('html', 'temp').dispose();
			})) ? domready() : arguments.callee.delay(50);
		})();
	} else if (Browser.Engine.webkit && Browser.Engine.version < 525){
		(function(){
			(['loaded', 'complete'].contains(document.readyState)) ? domready() : arguments.callee.delay(50);
		})();
	} else {
		document.addEvent('DOMContentLoaded', domready);
	}

})();


/*
---

script: JSON.js

description: JSON encoder and decoder.

license: MIT-style license.

See Also: <http://www.json.org/>

requires:
- /Array
- /String
- /Number
- /Function
- /Hash

provides: [JSON]

...
*/

var JSON = new Hash(this.JSON && {
	stringify: JSON.stringify,
	parse: JSON.parse
}).extend({
	
	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return JSON.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: function(obj){
		switch ($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.$replaceChars) + '"';
			case 'array':
				return '[' + String(obj.map(JSON.encode).clean()) + ']';
			case 'object': case 'hash':
				var string = [];
				Hash.each(obj, function(value, key){
					var json = JSON.encode(value);
					if (json) string.push(JSON.encode(key) + ':' + json);
				});
				return '{' + string + '}';
			case 'number': case 'boolean': return String(obj);
			case false: return 'null';
		}
		return null;
	},

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

});

Native.implement([Hash, Array, String, Number], {

	toJSON: function(){
		return JSON.encode(this);
	}

});


/*
---

script: Cookie.js

description: Class for creating, reading, and deleting browser Cookies.

license: MIT-style license.

credits:
- Based on the functions by Peter-Paul Koch (http://quirksmode.org).

requires:
- /Options

provides: [Cookie]

...
*/

var Cookie = new Class({

	Implements: Options,

	options: {
		path: false,
		domain: false,
		duration: false,
		secure: false,
		document: document
	},

	initialize: function(key, options){
		this.key = key;
		this.setOptions(options);
	},

	write: function(value){
		value = encodeURIComponent(value);
		if (this.options.domain) value += '; domain=' + this.options.domain;
		if (this.options.path) value += '; path=' + this.options.path;
		if (this.options.duration){
			var date = new Date();
			date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (this.options.secure) value += '; secure';
		this.options.document.cookie = this.key + '=' + value;
		return this;
	},

	read: function(){
		var value = this.options.document.cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},

	dispose: function(){
		new Cookie(this.key, $merge(this.options, {duration: -1})).write('');
		return this;
	}

});

Cookie.write = function(key, value, options){
	return new Cookie(key, options).write(value);
};

Cookie.read = function(key){
	return new Cookie(key).read();
};

Cookie.dispose = function(key, options){
	return new Cookie(key, options).dispose();
};


/*
---

script: Swiff.js

description: Wrapper for embedding SWF movies. Supports External Interface Communication.

license: MIT-style license.

credits: 
- Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.

requires:
- /Options
- /$util

provides: [Swiff]

...
*/

var Swiff = new Class({

	Implements: [Options],

	options: {
		id: null,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'transparent',
			swLiveConnect: true
		},
		callBacks: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
		this.instance = 'Swiff_' + $time();

		this.setOptions(options);
		options = this.options;
		var id = this.id = options.id || this.instance;
		var container = document.id(options.container);

		Swiff.CallBacks[this.instance] = {};

		var params = options.params, vars = options.vars, callBacks = options.callBacks;
		var properties = $extend({height: options.height, width: options.width}, options.properties);

		var self = this;

		for (var callBack in callBacks){
			Swiff.CallBacks[this.instance][callBack] = (function(option){
				return function(){
					return option.apply(self.object, arguments);
				};
			})(callBacks[callBack]);
			vars[callBack] = 'Swiff.CallBacks.' + this.instance + '.' + callBack;
		}

		params.flashVars = Hash.toQueryString(vars);
		if (Browser.Engine.trident){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
			properties.data = path;
		}
		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params){
			if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
		}
		build += '</object>';
		this.object = ((container) ? container.empty() : new Element('div')).set('html', build).firstChild;
	},

	replaces: function(element){
		element = document.id(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		document.id(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(){
		return Swiff.remote.apply(Swiff, [this.toElement()].extend(arguments));
	}

});

Swiff.CallBacks = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};


/*
---

script: Fx.js

description: Contains the basic animation logic to be extended by all other Fx Classes.

license: MIT-style license.

requires:
- /Chain
- /Events
- /Options

provides: [Fx]

...
*/

var Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: $empty,
		onCancel: $empty,
		onComplete: $empty,
		*/
		fps: 50,
		unit: false,
		duration: 500,
		link: 'ignore'
	},

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
		this.options.duration = Fx.Durations[this.options.duration] || this.options.duration.toInt();
		var wait = this.options.wait;
		if (wait === false) this.options.link = 'cancel';
	},

	getTransition: function(){
		return function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function(){
		var time = $time();
		if (time < this.time + this.options.duration){
			var delta = this.transition((time - this.time) / this.options.duration);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},

	set: function(now){
		return now;
	},

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.timer) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.time = 0;
		this.transition = this.getTransition();
		this.startTimer();
		this.onStart();
		return this;
	},

	complete: function(){
		if (this.stopTimer()) this.onComplete();
		return this;
	},

	cancel: function(){
		if (this.stopTimer()) this.onCancel();
		return this;
	},

	onStart: function(){
		this.fireEvent('start', this.subject);
	},

	onComplete: function(){
		this.fireEvent('complete', this.subject);
		if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
	},

	onCancel: function(){
		this.fireEvent('cancel', this.subject).clearChain();
	},

	pause: function(){
		this.stopTimer();
		return this;
	},

	resume: function(){
		this.startTimer();
		return this;
	},

	stopTimer: function(){
		if (!this.timer) return false;
		this.time = $time() - this.time;
		this.timer = $clear(this.timer);
		return true;
	},

	startTimer: function(){
		if (this.timer) return false;
		this.time = $time() - this.time;
		this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
		return true;
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};


/*
---

script: Fx.CSS.js

description: Contains the CSS animation logic. Used by Fx.Tween, Fx.Morph, Fx.Elements.

license: MIT-style license.

requires:
- /Fx
- /Element.Style

provides: [Fx.CSS]

...
*/

Fx.CSS = new Class({

	Extends: Fx,

	//prepares the base from/to object

	prepare: function(element, property, values){
		values = $splat(values);
		var values1 = values[1];
		if (!$chk(values1)){
			values[1] = values[0];
			values[0] = element.getStyle(property);
		}
		var parsed = values.map(this.parse);
		return {from: parsed[0], to: parsed[1]};
	},

	//parses a value into an array

	parse: function(value){
		value = $lambda(value)();
		value = (typeof value == 'string') ? value.split(' ') : $splat(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Fx.CSS.Parsers.each(function(parser, key){
				if (found) return;
				var parsed = parser.parse(val);
				if ($chk(parsed)) found = {value: parsed, parser: parser};
			});
			found = found || {value: val, parser: Fx.CSS.Parsers.String};
			return found;
		});
	},

	//computes by a from and to prepared objects, using their parsers.

	compute: function(from, to, delta){
		var computed = [];
		(Math.min(from.length, to.length)).times(function(i){
			computed.push({value: from[i].parser.compute(from[i].value, to[i].value, delta), parser: from[i].parser});
		});
		computed.$family = {name: 'fx:css:value'};
		return computed;
	},

	//serves the value as settable

	serve: function(value, unit){
		if ($type(value) != 'fx:css:value') value = this.parse(value);
		var returned = [];
		value.each(function(bit){
			returned = returned.concat(bit.parser.serve(bit.value, unit));
		});
		return returned;
	},

	//renders the change to an element

	render: function(element, property, value, unit){
		element.setStyle(property, this.serve(value, unit));
	},

	//searches inside the page css to find the values for a selector

	search: function(selector){
		if (Fx.CSS.Cache[selector]) return Fx.CSS.Cache[selector];
		var to = {};
		Array.each(document.styleSheets, function(sheet, j){
			var href = sheet.href;
			if (href && href.contains('://') && !href.contains(document.domain)) return;
			var rules = sheet.rules || sheet.cssRules;
			Array.each(rules, function(rule, i){
				if (!rule.style) return;
				var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function(m){
					return m.toLowerCase();
				}) : null;
				if (!selectorText || !selectorText.test('^' + selector + '$')) return;
				Element.Styles.each(function(value, style){
					if (!rule.style[style] || Element.ShortStyles[style]) return;
					value = String(rule.style[style]);
					to[style] = (value.test(/^rgb/)) ? value.rgbToHex() : value;
				});
			});
		});
		return Fx.CSS.Cache[selector] = to;
	}

});

Fx.CSS.Cache = {};

Fx.CSS.Parsers = new Hash({

	Color: {
		parse: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},
		compute: function(from, to, delta){
			return from.map(function(value, i){
				return Math.round(Fx.compute(from[i], to[i], delta));
			});
		},
		serve: function(value){
			return value.map(Number);
		}
	},

	Number: {
		parse: parseFloat,
		compute: Fx.compute,
		serve: function(value, unit){
			return (unit) ? value + unit : value;
		}
	},

	String: {
		parse: $lambda(false),
		compute: $arguments(1),
		serve: $arguments(0)
	}

});


/*
---

script: Fx.Tween.js

description: Formerly Fx.Style, effect to transition any CSS property for an element.

license: MIT-style license.

requires: 
- /Fx.CSS

provides: [Fx.Tween, Element.fade, Element.highlight]

...
*/

Fx.Tween = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
	},

	set: function(property, now){
		if (arguments.length == 1){
			now = property;
			property = this.property || this.options.property;
		}
		this.render(this.element, property, now, this.options.unit);
		return this;
	},

	start: function(property, from, to){
		if (!this.check(property, from, to)) return this;
		var args = Array.flatten(arguments);
		this.property = this.options.property || args.shift();
		var parsed = this.prepare(this.element, this.property, args);
		return this.parent(parsed.from, parsed.to);
	}

});

Element.Properties.tween = {

	set: function(options){
		var tween = this.retrieve('tween');
		if (tween) tween.cancel();
		return this.eliminate('tween').store('tween:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('tween')){
			if (options || !this.retrieve('tween:options')) this.set('tween', options);
			this.store('tween', new Fx.Tween(this, this.retrieve('tween:options')));
		}
		return this.retrieve('tween');
	}

};

Element.implement({

	tween: function(property, from, to){
		this.get('tween').start(arguments);
		return this;
	},

	fade: function(how){
		var fade = this.get('tween'), o = 'opacity', toggle;
		how = $pick(how, 'toggle');
		switch (how){
			case 'in': fade.start(o, 1); break;
			case 'out': fade.start(o, 0); break;
			case 'show': fade.set(o, 1); break;
			case 'hide': fade.set(o, 0); break;
			case 'toggle':
				var flag = this.retrieve('fade:flag', this.get('opacity') == 1);
				fade.start(o, (flag) ? 0 : 1);
				this.store('fade:flag', !flag);
				toggle = true;
			break;
			default: fade.start(o, arguments);
		}
		if (!toggle) this.eliminate('fade:flag');
		return this;
	},

	highlight: function(start, end){
		if (!end){
			end = this.retrieve('highlight:original', this.getStyle('background-color'));
			end = (end == 'transparent') ? '#fff' : end;
		}
		var tween = this.get('tween');
		tween.start('background-color', start || '#ffff88', end).chain(function(){
			this.setStyle('background-color', this.retrieve('highlight:original'));
			tween.callChain();
		}.bind(this));
		return this;
	}

});


/*
---

script: Fx.Morph.js

description: Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules, or CSS based selector rules.

license: MIT-style license.

requires:
- /Fx.CSS

provides: [Fx.Morph]

...
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
	},

	set: function(now){
		if (typeof now == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.options.unit);
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		if (typeof properties == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.Properties.morph = {

	set: function(options){
		var morph = this.retrieve('morph');
		if (morph) morph.cancel();
		return this.eliminate('morph').store('morph:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('morph')){
			if (options || !this.retrieve('morph:options')) this.set('morph', options);
			this.store('morph', new Fx.Morph(this, this.retrieve('morph:options')));
		}
		return this.retrieve('morph');
	}

};

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	}

});


/*
---

script: Fx.Transitions.js

description: Contains a set of advanced transitions to be used with any of the Fx Classes.

license: MIT-style license.

credits:
- Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.

requires:
- /Fx

provides: [Fx.Transitions]

...
*/

Fx.implement({

	getTransition: function(){
		var trans = this.options.transition || Fx.Transitions.Sine.easeInOut;
		if (typeof trans == 'string'){
			var data = trans.split(':');
			trans = Fx.Transitions;
			trans = trans[data[0]] || trans[data[0].capitalize()];
			if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
		}
		return trans;
	}

});

Fx.Transition = function(transition, params){
	params = $splat(params);
	return $extend(transition, {
		easeIn: function(pos){
			return transition(pos, params);
		},
		easeOut: function(pos){
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos){
			return (pos <= 0.5) ? transition(2 * pos, params) / 2 : (2 - transition(2 * (1 - pos), params)) / 2;
		}
	});
};

Fx.Transitions = new Hash({

	linear: $arguments(0)

});

Fx.Transitions.extend = function(transitions){
	for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

	Pow: function(p, x){
		return Math.pow(p, x[0] || 6);
	},

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	Back: function(p, x){
		x = x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	Elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	Fx.Transitions[transition] = new Fx.Transition(function(p){
		return Math.pow(p, [i + 2]);
	});
});


/*
---

script: Request.js

description: Powerful all purpose Request Class. Uses XMLHTTPRequest.

license: MIT-style license.

requires:
- /Element
- /Chain
- /Events
- /Options
- /Browser

provides: [Request]

...
*/

var Request = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: $empty,
		onComplete: $empty,
		onCancel: $empty,
		onSuccess: $empty,
		onFailure: $empty,
		onException: $empty,*/
		url: '',
		data: '',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		},
		async: true,
		format: false,
		method: 'post',
		link: 'ignore',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		evalScripts: false,
		evalResponse: false,
		noCache: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.headers = new Hash(this.options.headers);
	},

	onStateChange: function(){
		if (this.xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		$try(function(){
			this.status = this.xhr.status;
		}.bind(this));
		this.xhr.onreadystatechange = $empty;
		if (this.options.isSuccess.call(this, this.status)){
			this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};
			this.success(this.response.text, this.response.xml);
		} else {
			this.response = {text: null, xml: null};
			this.failure();
		}
	},

	isSuccess: function(){
		return ((this.status >= 200) && (this.status < 300));
	},

	processScripts: function(text){
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	},

	success: function(text, xml){
		this.onSuccess(this.processScripts(text), xml);
	},

	onSuccess: function(){
		this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain();
	},

	failure: function(){
		this.onFailure();
	},

	onFailure: function(){
		this.fireEvent('complete').fireEvent('failure', this.xhr);
	},

	setHeader: function(name, value){
		this.headers.set(name, value);
		return this;
	},

	getHeader: function(name){
		return $try(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	send: function(options){
		if (!this.check(options)) return this;
		this.running = true;

		var type = $type(options);
		if (type == 'string' || type == 'element') options = {data: options};

		var old = this.options;
		options = $extend({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = String(options.url), method = options.method.toLowerCase();

		switch ($type(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Hash.toQueryString(data);
		}

		if (this.options.format){
			var format = 'format=' + this.options.format;
			data = (data) ? format + '&' + data : format;
		}

		if (this.options.emulation && !['get', 'post'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.options.urlEncoded && method == 'post'){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.headers.set('Content-type', 'application/x-www-form-urlencoded' + encoding);
		}

		if (this.options.noCache){
			var noCache = 'noCache=' + new Date().getTime();
			data = (data) ? noCache + '&' + data : noCache;
		}

		var trimPosition = url.lastIndexOf('/');
		if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) url = url.substr(0, trimPosition);

		if (data && method == 'get'){
			url = url + (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		this.xhr.open(method.toUpperCase(), url, this.options.async);

		this.xhr.onreadystatechange = this.onStateChange.bind(this);

		this.headers.each(function(value, key){
			try {
				this.xhr.setRequestHeader(key, value);
			} catch (e){
				this.fireEvent('exception', [key, value]);
			}
		}, this);

		this.fireEvent('request');
		this.xhr.send(data);
		if (!this.options.async) this.onStateChange();
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		this.xhr.onreadystatechange = $empty;
		this.xhr = new Browser.Request();
		this.fireEvent('cancel');
		return this;
	}

});

(function(){

var methods = {};
['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(){
		var params = Array.link(arguments, {url: String.type, data: $defined});
		return this.send($extend(params, {method: method}));
	};
});

Request.implement(methods);

})();

Element.Properties.send = {

	set: function(options){
		var send = this.retrieve('send');
		if (send) send.cancel();
		return this.eliminate('send').store('send:options', $extend({
			data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
		}, options));
	},

	get: function(options){
		if (options || !this.retrieve('send')){
			if (options || !this.retrieve('send:options')) this.set('send', options);
			this.store('send', new Request(this.retrieve('send:options')));
		}
		return this.retrieve('send');
	}

};

Element.implement({

	send: function(url){
		var sender = this.get('send');
		sender.send({data: this, url: url || sender.options.url});
		return this;
	}

});


/*
---

script: Request.HTML.js

description: Extends the basic Request Class with additional methods for interacting with HTML responses.

license: MIT-style license.

requires:
- /Request
- /Element

provides: [Request.HTML]

...
*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		append: false,
		evalScripts: true,
		filter: false
	},

	processHTML: function(text){
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		text = (match) ? match[1] : text;

		var container = new Element('div');

		return $try(function(){
			var root = '<root>' + text + '</root>', doc;
			if (Browser.Engine.trident){
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = false;
				doc.loadXML(root);
			} else {
				doc = new DOMParser().parseFromString(root, 'text/xml');
			}
			root = doc.getElementsByTagName('root')[0];
			if (!root) return null;
			for (var i = 0, k = root.childNodes.length; i < k; i++){
				var child = Element.clone(root.childNodes[i], true, true);
				if (child) container.grab(child);
			}
			return container;
		}) || container.set('html', text);
	},

	success: function(text){
		var options = this.options, response = this.response;

		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});

		var temp = this.processHTML(response.html);

		response.tree = temp.childNodes;
		response.elements = temp.getElements('*');

		if (options.filter) response.tree = response.elements.filter(options.filter);
		if (options.update) document.id(options.update).empty().set('html', response.html);
		else if (options.append) document.id(options.append).adopt(temp.getChildren());
		if (options.evalScripts) $exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

Element.Properties.load = {

	set: function(options){
		var load = this.retrieve('load');
		if (load) load.cancel();
		return this.eliminate('load').store('load:options', $extend({data: this, link: 'cancel', update: this, method: 'get'}, options));
	},

	get: function(options){
		if (options || ! this.retrieve('load')){
			if (options || !this.retrieve('load:options')) this.set('load', options);
			this.store('load', new Request.HTML(this.retrieve('load:options')));
		}
		return this.retrieve('load');
	}

};

Element.implement({

	load: function(){
		this.get('load').send(Array.link(arguments, {data: Object.type, url: String.type}));
		return this;
	}

});


/*
---

script: Request.JSON.js

description: Extends the basic Request Class with additional methods for sending and receiving JSON data.

license: MIT-style license.

requires:
- /Request JSON

provides: [Request.HTML]

...
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		this.headers.extend({'Accept': 'application/json', 'X-Request': 'JSON'});
	},

	success: function(text){
		this.response.json = JSON.decode(text, this.options.secure);
		this.onSuccess(this.response.json, text);
	}

});

//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2009 Aaron Newton <http://clientcide.com/>, Valerio Proietti <http://mad4milk.net> & the MooTools team <http://mootools.net/developers>, MIT Style License.

/*
---

script: More.js

description: MooTools More

license: MIT-style license

authors:
- Guillermo Rauch
- Thomas Aylott
- Scott Kyle

requires:
- core:1.2.4/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
	'version': '1.2.4.4',
	'build': '6f6057dc645fdb7547689183b2311063bd653ddf'
};

/*
---

script: MooTools.Lang.js

description: Provides methods for localization.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Events
- /MooTools.More

provides: [MooTools.Lang]

...
*/

(function(){

	var data = {
		language: 'en-US',
		languages: {
			'en-US': {}
		},
		cascades: ['en-US']
	};
	
	var cascaded;

	MooTools.lang = new Events();

	$extend(MooTools.lang, {

		setLanguage: function(lang){
			if (!data.languages[lang]) return this;
			data.language = lang;
			this.load();
			this.fireEvent('langChange', lang);
			return this;
		},

		load: function() {
			var langs = this.cascade(this.getCurrentLanguage());
			cascaded = {};
			$each(langs, function(set, setName){
				cascaded[setName] = this.lambda(set);
			}, this);
		},

		getCurrentLanguage: function(){
			return data.language;
		},

		addLanguage: function(lang){
			data.languages[lang] = data.languages[lang] || {};
			return this;
		},

		cascade: function(lang){
			var cascades = (data.languages[lang] || {}).cascades || [];
			cascades.combine(data.cascades);
			cascades.erase(lang).push(lang);
			var langs = cascades.map(function(lng){
				return data.languages[lng];
			}, this);
			return $merge.apply(this, langs);
		},

		lambda: function(set) {
			(set || {}).get = function(key, args){
				return $lambda(set[key]).apply(this, $splat(args));
			};
			return set;
		},

		get: function(set, key, args){
			if (cascaded && cascaded[set]) return (key ? cascaded[set].get(key, args) : cascaded[set]);
		},

		set: function(lang, set, members){
			this.addLanguage(lang);
			langData = data.languages[lang];
			if (!langData[set]) langData[set] = {};
			$extend(langData[set], members);
			if (lang == this.getCurrentLanguage()){
				this.load();
				this.fireEvent('langChange', lang);
			}
			return this;
		},

		list: function(){
			return Hash.getKeys(data.languages);
		}

	});

})();

/*
---

script: Log.js

description: Provides basic logging functionality for plugins to implement.

license: MIT-style license

authors:
- Guillermo Rauch
- Thomas Aylott
- Scott Kyle

requires:
- core:1.2.4/Class
- /MooTools.More

provides: [Log]

...
*/

(function(){

var global = this;

var log = function(){
	if (global.console && console.log){
		try {
			console.log.apply(console, arguments);
		} catch(e) {
			console.log(Array.slice(arguments));
		}
	} else {
		Log.logged.push(arguments);
	}
	return this;
};

var disabled = function(){
	this.logged.push(arguments);
	return this;
};

this.Log = new Class({
	
	logged: [],
	
	log: disabled,
	
	resetLog: function(){
		this.logged.empty();
		return this;
	},

	enableLog: function(){
		this.log = log;
		this.logged.each(function(args){
			this.log.apply(this, args);
		}, this);
		return this.resetLog();
	},

	disableLog: function(){
		this.log = disabled;
		return this;
	}
	
});

Log.extend(new Log).enableLog();

// legacy
Log.logger = function(){
	return this.log.apply(this, arguments);
};

})();

/*
---

script: Depender.js

description: A stand alone dependency loader for the MooTools library.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Events
- core:1.2.4/Request.JSON
- /MooTools.More
- /Log

provides: Depender

...
*/

var Depender = {

	options: {
		/* 
		onRequire: $empty(options),
		onRequirementLoaded: $empty([scripts, options]),
		onScriptLoaded: $empty({
			script: script, 
			totalLoaded: percentOfTotalLoaded, 
			loaded: scriptsState
		}),
		serial: false,
		target: null,
		noCache: false,
		log: false,*/
		loadedSources: [],
		loadedScripts: ['Core', 'Browser', 'Array', 'String', 'Function', 'Number', 'Hash', 'Element', 'Event', 'Element.Event', 'Class', 'DomReady', 'Class.Extras', 'Request', 'JSON', 'Request.JSON', 'More', 'Depender', 'Log'],
		useScriptInjection: true
	},

	loaded: [],

	sources: {},

	libs: {},

	include: function(libs){
		this.log('include: ', libs);
		this.mapLoaded = false;
		var loader = function(data){
			this.libs = $merge(this.libs, data);
			$each(this.libs, function(data, lib){
				if (data.scripts) this.loadSource(lib, data.scripts);
			}, this);
		}.bind(this);
		if ($type(libs) == 'string'){
			this.log('fetching libs ', libs);
			this.request(libs, loader);
		} else {
			loader(libs);
		}
		return this;
	},

	required: [],

	require: function(options){
		var loaded = function(){
			var scripts = this.calculateDependencies(options.scripts);
			if (options.sources){
				options.sources.each(function(source){
					scripts.combine(this.libs[source].files);
				}, this);
			}
			if (options.serial) scripts.combine(this.getLoadedScripts());
			options.scripts = scripts;
			this.required.push(options);
			this.fireEvent('require', options);
			this.loadScripts(options.scripts);
		};
		if (this.mapLoaded) loaded.call(this);
		else this.addEvent('mapLoaded', loaded.bind(this));
		return this;
	},

	cleanDoubleSlash: function(str){
		if (!str) return str;
		var prefix = '';
		if (str.test(/^http:\/\//)){
			prefix = 'http://';
			str = str.substring(7, str.length);
		}
		str = str.replace(/\/\//g, '/');
		return prefix + str;
	},

	request: function(url, callback){
		new Request.JSON({
			url: url,
			secure: false,
			onSuccess: callback
		}).send();
	},

	loadSource: function(lib, source){
		if (this.libs[lib].files){
			this.dataLoaded();
			return;
		}
		this.log('loading source: ', source);
		this.request(this.cleanDoubleSlash(source + '/scripts.json'), function(result){
			this.log('loaded source: ', source);
			this.libs[lib].files = result;
			this.dataLoaded();
		}.bind(this));
	},

	dataLoaded: function(){
		var loaded = true;
		$each(this.libs, function(v, k){
			if (!this.libs[k].files) loaded = false;
		}, this);
		if (loaded){
			this.mapTree();
			this.mapLoaded = true;
			this.calculateLoaded();
			this.lastLoaded = this.getLoadedScripts().getLength();
			this.fireEvent('mapLoaded');
			this.removeEvents('mapLoaded');
		}
	},

	calculateLoaded: function(){
		var set = function(script){
			this.scriptsState[script] = true;
		}.bind(this);
		if (this.options.loadedScripts) this.options.loadedScripts.each(set);
		if (this.options.loadedSources){
			this.options.loadedSources.each(function(lib){
				$each(this.libs[lib].files, function(dir){
					$each(dir, function(data, file){
						set(file);
					}, this);
				}, this);
			}, this);
		}
	},

	deps: {},

	pathMap: {},

	mapTree: function(){
		$each(this.libs, function(data, source){
			$each(data.files, function(scripts, folder){
				$each(scripts, function(details, script){
					var path = source + ':' + folder + ':' + script;
					if (this.deps[path]) return;
					this.deps[path] = details.deps;
					this.pathMap[script] = path;
				}, this);
			}, this);
		}, this);
	},

	getDepsForScript: function(script){
		return this.deps[this.pathMap[script]] || [];
	},

	calculateDependencies: function(scripts){
		var reqs = [];
		$splat(scripts).each(function(script){
			if (script == 'None' || !script) return;
			var deps = this.getDepsForScript(script);
			if (!deps){
				if (window.console && console.warn) console.warn('dependencies not mapped: script: %o, map: %o, :deps: %o', script, this.pathMap, this.deps);
			} else {
				deps.each(function(scr){
					if (scr == script || scr == 'None' || !scr) return;
					if (!reqs.contains(scr)) reqs.combine(this.calculateDependencies(scr));
					reqs.include(scr);
				}, this);
			}
			reqs.include(script);
		}, this);
		return reqs;
	},

	getPath: function(script){
		try {
			var chunks = this.pathMap[script].split(':');
			var lib = this.libs[chunks[0]];
			var dir = (lib.path || lib.scripts) + '/';
			chunks.shift();
			return this.cleanDoubleSlash(dir + chunks.join('/') + '.js');
		} catch(e){
			return script;
		}
	},

	loadScripts: function(scripts){
		scripts = scripts.filter(function(s){
			if (!this.scriptsState[s] && s != 'None'){
				this.scriptsState[s] = false;
				return true;
			}
		}, this);
		if (scripts.length){
			scripts.each(function(scr){
				this.loadScript(scr);
			}, this);
		} else {
			this.check();
		}
	},

	toLoad: [],

	loadScript: function(script){
		if (this.scriptsState[script] && this.toLoad.length){
			this.loadScript(this.toLoad.shift());
			return;
		} else if (this.loading){
			this.toLoad.push(script);
			return;
		}
		var finish = function(){
			this.loading = false;
			this.scriptLoaded(script);
			if (this.toLoad.length) this.loadScript(this.toLoad.shift());
		}.bind(this);
		var error = function(){
			this.log('could not load: ', scriptPath);
		}.bind(this);
		this.loading = true;
		var scriptPath = this.getPath(script);
		if (this.options.useScriptInjection){
			this.log('injecting script: ', scriptPath);
			var loaded = function(){
				this.log('loaded script: ', scriptPath);
				finish();
			}.bind(this);
			new Element('script', {
				src: scriptPath + (this.options.noCache ? '?noCache=' + new Date().getTime() : ''),
				events: {
					load: loaded,
					readystatechange: function(){
						if (['loaded', 'complete'].contains(this.readyState)) loaded();
					},
					error: error
				}
			}).inject(this.options.target || document.head);
		} else {
			this.log('requesting script: ', scriptPath);
			new Request({
				url: scriptPath,
				noCache: this.options.noCache,
				onComplete: function(js){
					this.log('loaded script: ', scriptPath);
					$exec(js);
					finish();
				}.bind(this),
				onFailure: error,
				onException: error
			}).send();
		}
	},

	scriptsState: $H(),
	
	getLoadedScripts: function(){
		return this.scriptsState.filter(function(state){
			return state;
		});
	},

	scriptLoaded: function(script){
		this.log('loaded script: ', script);
		this.scriptsState[script] = true;
		this.check();
		var loaded = this.getLoadedScripts();
		var loadedLength = loaded.getLength();
		var toLoad = this.scriptsState.getLength();
		this.fireEvent('scriptLoaded', {
			script: script,
			totalLoaded: (loadedLength / toLoad * 100).round(),
			currentLoaded: ((loadedLength - this.lastLoaded) / (toLoad - this.lastLoaded) * 100).round(),
			loaded: loaded
		});
		if (loadedLength == toLoad) this.lastLoaded = loadedLength;
	},

	lastLoaded: 0,

	check: function(){
		var incomplete = [];
		this.required.each(function(required){
			var loaded = [];
			required.scripts.each(function(script){
				if (this.scriptsState[script]) loaded.push(script);
			}, this);
			if (required.onStep){
				required.onStep({
					percent: loaded.length / required.scripts.length * 100,
					scripts: loaded
				});
			};
			if (required.scripts.length != loaded.length) return;
			required.callback();
			this.required.erase(required);
			this.fireEvent('requirementLoaded', [loaded, required]);
		}, this);
	}

};

$extend(Depender, new Events);
$extend(Depender, new Options);
$extend(Depender, new Log);

Depender._setOptions = Depender.setOptions;
Depender.setOptions = function(){
	Depender._setOptions.apply(Depender, arguments);
	if (this.options.log) Depender.enableLog();
	return this;
};


/*
---

script: Class.Refactor.js

description: Extends a class onto itself with new property, preserving any items attached to the class's namespace.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Class
- /MooTools.More

provides: [Class.refactor]

...
*/

Class.refactor = function(original, refactors){

	$each(refactors, function(item, name){
		var origin = original.prototype[name];
		if (origin && (origin = origin._origin) && typeof item == 'function') original.implement(name, function(){
			var old = this.previous;
			this.previous = origin;
			var value = item.apply(this, arguments);
			this.previous = old;
			return value;
		}); else original.implement(name, item);
	});

	return original;

};

/*
---

script: Class.Binds.js

description: Automagically binds specified methods in a class to the instance of the class.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Class
- /MooTools.More

provides: [Class.Binds]

...
*/

Class.Mutators.Binds = function(binds){
    return binds;
};

Class.Mutators.initialize = function(initialize){
	return function(){
		$splat(this.Binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);
		return initialize.apply(this, arguments);
	};
};


/*
---

script: Class.Occlude.js

description: Prevents a class from being applied to a DOM element twice.

license: MIT-style license.

authors:
- Aaron Newton

requires: 
- core/1.2.4/Class
- core:1.2.4/Element
- /MooTools.More

provides: [Class.Occlude]

...
*/

Class.Occlude = new Class({

	occlude: function(property, element){
		element = document.id(element || this.element);
		var instance = element.retrieve(property || this.property);
		if (instance && !$defined(this.occluded))
			return this.occluded = instance;

		this.occluded = false;
		element.store(property || this.property, this);
		return this.occluded;
	}

});

/*
---

script: Chain.Wait.js

description: value, Adds a method to inject pauses between chained events.

license: MIT-style license.

authors:
- Aaron Newton

requires: 
- core:1.2.4/Chain 
- core:1.2.4/Element
- core:1.2.4/Fx
- /MooTools.More

provides: [Chain.Wait]

...
*/

(function(){

	var wait = {
		wait: function(duration){
			return this.chain(function(){
				this.callChain.delay($pick(duration, 500), this);
			}.bind(this));
		}
	};

	Chain.implement(wait);

	if (window.Fx){
		Fx.implement(wait);
		['Css', 'Tween', 'Elements'].each(function(cls){
			if (Fx[cls]) Fx[cls].implement(wait);
		});
	}

	Element.implement({
		chains: function(effects){
			$splat($pick(effects, ['tween', 'morph', 'reveal'])).each(function(effect){
				effect = this.get(effect);
				if (!effect) return;
				effect.setOptions({
					link:'chain'
				});
			}, this);
			return this;
		},
		pauseFx: function(duration, effect){
			this.chains(effect).get($pick(effect, 'tween')).wait(duration);
			return this;
		}
	});

})();

/*
---

script: Array.Extras.js

description: Extends the Array native object to include useful methods to work with arrays.

license: MIT-style license

authors:
- Christoph Pojer

requires:
- core:1.2.4/Array

provides: [Array.Extras]

...
*/
Array.implement({

	min: function(){
		return Math.min.apply(null, this);
	},

	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l){
			do {
				result += this[--l];
			} while (l);
		}
		return result;
	},

	unique: function(){
		return [].combine(this);
	},

	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	}

});

/*
---

script: Date.js

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
- Aaron Newton
- Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
- Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
- Scott Kyle - scott [at] appden.com; http://appden.com

requires:
- core:1.2.4/Array
- core:1.2.4/String
- core:1.2.4/Number
- core:1.2.4/Lang
- core:1.2.4/Date.English.US
- /MooTools.More

provides: [Date]

...
*/

(function(){

var Date = this.Date;

if (!Date.now) Date.now = $time;

Date.Methods = {
	ms: 'Milliseconds',
	year: 'FullYear',
	min: 'Minutes',
	mo: 'Month',
	sec: 'Seconds',
	hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
	'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
	'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds'].each(function(method){
	Date.Methods[method.toLowerCase()] = method;
});

var pad = function(what, length){
	return new Array(length - String(what).length + 1).join('0') + what;
};

Date.implement({

	set: function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				prop = prop.toLowerCase();
				var m = Date.Methods;
				if (m[prop]) this['set' + m[prop]](value);
		}
		return this;
	},

	get: function(prop){
		prop = prop.toLowerCase();
		var m = Date.Methods;
		if (m[prop]) return this['get' + m[prop]]();
		return null;
	},

	clone: function(){
		return new Date(this.get('time'));
	},

	increment: function(interval, times){
		interval = interval || 'day';
		times = $pick(times, 1);

		switch (interval){
			case 'year':
				return this.increment('month', times * 12);
			case 'month':
				var d = this.get('date');
				this.set('date', 1).set('mo', this.get('mo') + times);
				return this.set('date', d.min(this.get('lastdayofmonth')));
			case 'week':
				return this.increment('day', times * 7);
			case 'day':
				return this.set('date', this.get('date') + times);
		}

		if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

		return this.set('time', this.get('time') + times * Date.units[interval]());
	},

	decrement: function(interval, times){
		return this.increment(interval, -1 * $pick(times, 1));
	},

	isLeapYear: function(){
		return Date.isLeapYear(this.get('year'));
	},

	clearTime: function(){
		return this.set({hr: 0, min: 0, sec: 0, ms: 0});
	},

	diff: function(date, resolution){
		if ($type(date) == 'string') date = Date.parse(date);
		
		return ((date - this) / Date.units[resolution || 'day'](3, 3)).toInt(); // non-leap year, 30-day month
	},

	getLastDayOfMonth: function(){
		return Date.daysInMonth(this.get('mo'), this.get('year'));
	},

	getDayOfYear: function(){
		return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1) 
			- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
	},

	getWeek: function(){
		return (this.get('dayofyear') / 7).ceil();
	},
	
	getOrdinal: function(day){
		return Date.getMsg('ordinal', day || this.get('date'));
	},

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset: function(){
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
	},

	setAMPM: function(ampm){
		ampm = ampm.toUpperCase();
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},

	getAMPM: function(){
		return (this.get('hr') < 12) ? 'AM' : 'PM';
	},

	parse: function(str){
		this.set('time', Date.parse(str));
		return this;
	},

	isValid: function(date) {
		return !!(date || this).valueOf();
	},

	format: function(f){
		if (!this.isValid()) return 'invalid date';
		f = f || '%x %X';
		f = formats[f.toLowerCase()] || f; // replace short-hand with actual format
		var d = this;
		return f.replace(/%([a-z%])/gi,
			function($0, $1){
				switch ($1){
					case 'a': return Date.getMsg('days')[d.get('day')].substr(0, 3);
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months')[d.get('month')].substr(0, 3);
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.toString();
					case 'd': return pad(d.get('date'), 2);
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return ((d.get('hr') % 12) || 12);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 'S': return pad(d.get('seconds'), 2);
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					case 'T': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},

	toISOString: function(){
		return this.format('iso8601');
	}

});

Date.alias('toISOString', 'toJSON');
Date.alias('diff', 'compare');
Date.alias('format', 'strftime');

var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	iso8601: '%Y-%m-%dT%H:%M:%S%T',
	rfc822: '%a, %d %b %Y %H:%M:%S %Z',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M'
};

var parsePatterns = [];
var nativeParse = Date.parse;

var parseWord = function(type, word, num){
	var ret = -1;
	var translated = Date.getMsg(type + 's');

	switch ($type(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[month - 1];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + index);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length)    throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};

Date.extend({

	getMsg: function(key, args) {
		return MooTools.lang.get('Date', key, args);
	},

	units: {
		ms: $lambda(1),
		second: $lambda(1000),
		minute: $lambda(60000),
		hour: $lambda(3600000),
		day: $lambda(86400000),
		week: $lambda(608400000),
		month: function(month, year){
			var d = new Date;
			return Date.daysInMonth($pick(month, d.get('mo')), $pick(year, d.get('year'))) * 86400000;
		},
		year: function(year){
			year = year || new Date().get('year');
			return Date.isLeapYear(year) ? 31622400000 : 31536000000;
		}
	},

	daysInMonth: function(month, year){
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	isLeapYear: function(year){
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	},

	parse: function(from){
		var t = $type(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		from = from.clean();
		if (!from.length) return null;

		var parsed;
		parsePatterns.some(function(pattern){
			var bits = pattern.re.exec(from);
			return (bits) ? (parsed = pattern.handler(bits)) : false;
		});

		return parsed || new Date(nativeParse(from));
	},

	parseDay: function(day, num){
		return parseWord('day', day, num);
	},

	parseMonth: function(month, num){
		return parseWord('month', month, num);
	},

	parseUTC: function(value){
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(
			localDate.get('year'),
			localDate.get('mo'),
			localDate.get('date'),
			localDate.get('hr'),
			localDate.get('min'),
			localDate.get('sec')
		);
		return new Date(utcSeconds);
	},

	orderIndex: function(unit){
		return Date.getMsg('dateOrder').indexOf(unit) + 1;
	},

	defineFormat: function(name, format){
		formats[name] = format;
	},

	defineFormats: function(formats){
		for (var name in formats) Date.defineFormat(name, formats[name]);
	},

	parsePatterns: parsePatterns, // this is deprecated
	
	defineParser: function(pattern){
		parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
	},
	
	defineParsers: function(){
		Array.flatten(arguments).each(Date.defineParser);
	},
	
	define2DigitYearStart: function(year){
		startYear = year % 100;
		startCentury = year - startYear;
	}

});

var startCentury = 1900;
var startYear = 70;

var regexOf = function(type){
	return new RegExp('(?:' + Date.getMsg(type).map(function(name){
		return name.substr(0, 3);
	}).join('|') + ')[a-z]*');
};

var replacers = function(key){
	switch(key){
		case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
			return ((Date.orderIndex('month') == 1) ? '%m[.-/]%d' : '%d[.-/]%m') + '([.-/]%y)?';
		case 'X':
			return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%T?';
	}
	return null;
};

var keys = {
	d: /[0-2]?[0-9]|3[01]/,
	H: /[01]?[0-9]|2[0-3]/,
	I: /0?[1-9]|1[0-2]/,
	M: /[0-5]?\d/,
	s: /\d+/,
	o: /[a-z]*/,
	p: /[ap]\.?m\.?/,
	y: /\d{2}|\d{4}/,
	Y: /\d{4}/,
	T: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
	currentLanguage = language;
	
	keys.a = keys.A = regexOf('days');
	keys.b = keys.B = regexOf('months');
	
	parsePatterns.each(function(pattern, i){
		if (pattern.format) parsePatterns[i] = build(pattern.format);
	});
};

var build = function(format){
	if (!currentLanguage) return {format: format};
	
	var parsed = [];
	var re = (format.source || format) // allow format to be regex
	 .replace(/%([a-z])/gi,
		function($0, $1){
			return replacers($1) || $0;
		}
	).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
	 .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
	 .replace(/%([a-z%])/gi,
		function($0, $1){
			var p = keys[$1];
			if (!p) return $1;
			parsed.push($1);
			return '(' + p.source + ')';
		}
	).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff]'); // handle unicode words

	return {
		format: format,
		re: new RegExp('^' + re + '$', 'i'),
		handler: function(bits){
			bits = bits.slice(1).associate(parsed);
			var date = new Date().clearTime();
			if ('d' in bits) handle.call(date, 'd', 1);
			if ('m' in bits || 'b' in bits || 'B' in bits) handle.call(date, 'm', 1);
			for (var key in bits) handle.call(date, key, bits[key]);
			return date;
		}
	};
};

var handle = function(key, value){
	if (!value) return this;

	switch(key){
		case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
		case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
		case 'd': return this.set('date', value);
		case 'H': case 'I': return this.set('hr', value);
		case 'm': return this.set('mo', value - 1);
		case 'M': return this.set('min', value);
		case 'p': return this.set('ampm', value.replace(/\./g, ''));
		case 'S': return this.set('sec', value);
		case 's': return this.set('ms', ('0.' + value) * 1000);
		case 'w': return this.set('day', value);
		case 'Y': return this.set('year', value);
		case 'y':
			value = +value;
			if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
			return this.set('year', value);
		case 'T':
			if (value == 'Z') value = '+00';
			var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
			offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
			return this.set('time', this - offset * 60000);
	}

	return this;
};

Date.defineParsers(
	'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
	'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
	'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
	'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
	'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
	'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
	'%o %b %d %X %T %Y' // "Thu Oct 22 08:11:23 +0000 2009"
);

MooTools.lang.addEvent('langChange', function(language){
	if (MooTools.lang.get('Date')) recompile(language);
}).fireEvent('langChange', MooTools.lang.getCurrentLanguage());

})();

/*
---

script: Date.Extras.js

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
- Aaron Newton
- Scott Kyle

requires:
- /Date

provides: [Date.Extras]

...
*/

Date.implement({

	timeDiffInWords: function(relative_to){
		return Date.distanceOfTimeInWords(this, relative_to || new Date);
	},

	timeDiff: function(to, joiner){
		if (to == null) to = new Date;
		var delta = ((to - this) / 1000).toInt();
		if (!delta) return '0s';
		
		var durations = {s: 60, m: 60, h: 24, d: 365, y: 0};
		var duration, vals = [];
		
		for (var step in durations){
			if (!delta) break;
			if ((duration = durations[step])){
				vals.unshift((delta % duration) + step);
				delta = (delta / duration).toInt();
			} else {
				vals.unshift(delta + step);
			}
		}
		
		return vals.join(joiner || ':');
	}

});

Date.alias('timeDiffInWords', 'timeAgoInWords');

Date.extend({

	distanceOfTimeInWords: function(from, to){
		return Date.getTimePhrase(((to - from) / 1000).toInt());
	},

	getTimePhrase: function(delta){
		var suffix = (delta < 0) ? 'Until' : 'Ago';
		if (delta < 0) delta *= -1;
		
		var units = {
			minute: 60,
			hour: 60,
			day: 24,
			week: 7,
			month: 52 / 12,
			year: 12,
			eon: Infinity
		};
		
		var msg = 'lessThanMinute';
		
		for (var unit in units){
			var interval = units[unit];
			if (delta < 1.5 * interval){
				if (delta > 0.75 * interval) msg = unit;
				break;
			}
			delta /= interval;
			msg = unit + 's';
		}
		
		return Date.getMsg(msg + suffix).substitute({delta: delta.round()});
	}

});


Date.defineParsers(

	{
		// "today", "tomorrow", "yesterday"
		re: /^(?:tod|tom|yes)/i,
		handler: function(bits){
			var d = new Date().clearTime();
			switch(bits[0]){
				case 'tom': return d.increment();
				case 'yes': return d.decrement();
				default: 	return d;
			}
		}
	},

	{
		// "next Wednesday", "last Thursday"
		re: /^(next|last) ([a-z]+)$/i,
		handler: function(bits){
			var d = new Date().clearTime();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[2], true);
			var addDays = newDay - day;
			if (newDay <= day) addDays += 7;
			if (bits[1] == 'last') addDays -= 7;
			return d.set('date', d.getDate() + addDays);
		}
	}

);


/*
---

script: Hash.Extras.js

description: Extends the Hash native object to include getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Hash.base
- /MooTools.More

provides: [Hash.Extras]

...
*/

Hash.implement({

	getFromPath: function(notation){
		var source = this.getClean();
		notation.replace(/\[([^\]]+)\]|\.([^.[]+)|[^[.]+/g, function(match){
			if (!source) return null;
			var prop = arguments[2] || arguments[1] || arguments[0];
			source = (prop in source) ? source[prop] : null;
			return match;
		});
		return source;
	},

	cleanValues: function(method){
		method = method || $defined;
		this.each(function(v, k){
			if (!method(v)) this.erase(k);
		}, this);
		return this;
	},

	run: function(){
		var args = arguments;
		this.each(function(v, k){
			if ($type(v) == 'function') v.run(args);
		});
	}

});

/*
---

script: String.Extras.js

description: Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

license: MIT-style license

authors:
- Aaron Newton
- Guillermo Rauch

requires:
- core:1.2.4/String
- core:1.2.4/$util
- core:1.2.4/Array

provides: [String.Extras]

...
*/

(function(){
  
var special = ['À','à','Á','á','Â','â','Ã','ã','Ä','ä','Å','å','Ă','ă','Ą','ą','Ć','ć','Č','č','Ç','ç', 'Ď','ď','Đ','đ', 'È','è','É','é','Ê','ê','Ë','ë','Ě','ě','Ę','ę', 'Ğ','ğ','Ì','ì','Í','í','Î','î','Ï','ï', 'Ĺ','ĺ','Ľ','ľ','Ł','ł', 'Ñ','ñ','Ň','ň','Ń','ń','Ò','ò','Ó','ó','Ô','ô','Õ','õ','Ö','ö','Ø','ø','ő','Ř','ř','Ŕ','ŕ','Š','š','Ş','ş','Ś','ś', 'Ť','ť','Ť','ť','Ţ','ţ','Ù','ù','Ú','ú','Û','û','Ü','ü','Ů','ů', 'Ÿ','ÿ','ý','Ý','Ž','ž','Ź','ź','Ż','ż', 'Þ','þ','Ð','ð','ß','Œ','œ','Æ','æ','µ'];

var standard = ['A','a','A','a','A','a','A','a','Ae','ae','A','a','A','a','A','a','C','c','C','c','C','c','D','d','D','d', 'E','e','E','e','E','e','E','e','E','e','E','e','G','g','I','i','I','i','I','i','I','i','L','l','L','l','L','l', 'N','n','N','n','N','n', 'O','o','O','o','O','o','O','o','Oe','oe','O','o','o', 'R','r','R','r', 'S','s','S','s','S','s','T','t','T','t','T','t', 'U','u','U','u','U','u','Ue','ue','U','u','Y','y','Y','y','Z','z','Z','z','Z','z','TH','th','DH','dh','ss','OE','oe','AE','ae','u'];

var tidymap = {
	"[\xa0\u2002\u2003\u2009]": " ",
	"\xb7": "*",
	"[\u2018\u2019]": "'",
	"[\u201c\u201d]": '"',
	"\u2026": "...",
	"\u2013": "-",
	"\u2014": "--",
	"\uFFFD": "&raquo;"
};

var getRegForTag = function(tag, contents) {
	tag = tag || '';
	var regstr = contents ? "<" + tag + "[^>]*>([\\s\\S]*?)<\/" + tag + ">" : "<\/?" + tag + "([^>]+)?>";
	reg = new RegExp(regstr, "gi");
	return reg;
};

String.implement({

	standardize: function(){
		var text = this;
		special.each(function(ch, i){
			text = text.replace(new RegExp(ch, 'g'), standard[i]);
		});
		return text;
	},

	repeat: function(times){
		return new Array(times + 1).join(this);
	},

	pad: function(length, str, dir){
		if (this.length >= length) return this;
		var pad = (str == null ? ' ' : '' + str).repeat(length - this.length).substr(0, length - this.length);
		if (!dir || dir == 'right') return this + pad;
		if (dir == 'left') return pad + this;
		return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
	},

	getTags: function(tag, contents){
		return this.match(getRegForTag(tag, contents)) || [];
	},

	stripTags: function(tag, contents){
		return this.replace(getRegForTag(tag, contents), '');
	},

	tidy: function(){
		var txt = this.toString();
		$each(tidymap, function(value, key){
			txt = txt.replace(new RegExp(key, 'g'), value);
		});
		return txt;
	}

});

})();

/*
---

script: String.QueryString.js

description: Methods for dealing with URI query strings.

license: MIT-style license

authors:
- Sebastian Markbåge, Aaron Newton, Lennart Pilon, Valerio Proietti

requires:
- core:1.2.4/Array
- core:1.2.4/String
- /MooTools.More

provides: [String.QueryString]

...
*/

String.implement({

	parseQueryString: function(){
		var vars = this.split(/[&;]/), res = {};
		if (vars.length) vars.each(function(val){
			var index = val.indexOf('='),
				keys = index < 0 ? [''] : val.substr(0, index).match(/[^\]\[]+/g),
				value = decodeURIComponent(val.substr(index + 1)),
				obj = res;
			keys.each(function(key, i){
				var current = obj[key];
				if(i < keys.length - 1)
					obj = obj[key] = current || {};
				else if($type(current) == 'array')
					current.push(value);
				else
					obj[key] = $defined(current) ? [current, value] : value;
			});
		});
		return res;
	},

	cleanQueryString: function(method){
		return this.split('&').filter(function(val){
			var index = val.indexOf('='),
			key = index < 0 ? '' : val.substr(0, index),
			value = val.substr(index + 1);
			return method ? method.run([key, value]) : $chk(value);
		}).join('&');
	}

});

/*
---

script: URI.js

description: Provides methods useful in managing the window location and uris.

license: MIT-style license

authors:
- Sebastian Markb�ge
- Aaron Newton

requires:
- core:1.2.4/Selectors
- /String.QueryString

provides: URI

...
*/

var URI = new Class({

	Implements: Options,

	options: {
		/*base: false*/
	},

	regex: /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
	parts: ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'],
	schemes: {http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0},

	initialize: function(uri, options){
		this.setOptions(options);
		var base = this.options.base || URI.base;
		if(!uri) uri = base;
		
		if (uri && uri.parsed) this.parsed = $unlink(uri.parsed);
		else this.set('value', uri.href || uri.toString(), base ? new URI(base) : false);
	},

	parse: function(value, base){
		var bits = value.match(this.regex);
		if (!bits) return false;
		bits.shift();
		return this.merge(bits.associate(this.parts), base);
	},

	merge: function(bits, base){
		if ((!bits || !bits.scheme) && (!base || !base.scheme)) return false;
		if (base){
			this.parts.every(function(part){
				if (bits[part]) return false;
				bits[part] = base[part] || '';
				return true;
			});
		}
		bits.port = bits.port || this.schemes[bits.scheme.toLowerCase()];
		bits.directory = bits.directory ? this.parseDirectory(bits.directory, base ? base.directory : '') : '/';
		return bits;
	},

	parseDirectory: function(directory, baseDirectory) {
		directory = (directory.substr(0, 1) == '/' ? '' : (baseDirectory || '/')) + directory;
		if (!directory.test(URI.regs.directoryDot)) return directory;
		var result = [];
		directory.replace(URI.regs.endSlash, '').split('/').each(function(dir){
			if (dir == '..' && result.length > 0) result.pop();
			else if (dir != '.') result.push(dir);
		});
		return result.join('/') + '/';
	},

	combine: function(bits){
		return bits.value || bits.scheme + '://' +
			(bits.user ? bits.user + (bits.password ? ':' + bits.password : '') + '@' : '') +
			(bits.host || '') + (bits.port && bits.port != this.schemes[bits.scheme] ? ':' + bits.port : '') +
			(bits.directory || '/') + (bits.file || '') +
			(bits.query ? '?' + bits.query : '') +
			(bits.fragment ? '#' + bits.fragment : '');
	},

	set: function(part, value, base){
		if (part == 'value'){
			var scheme = value.match(URI.regs.scheme);
			if (scheme) scheme = scheme[1];
			if (scheme && !$defined(this.schemes[scheme.toLowerCase()])) this.parsed = { scheme: scheme, value: value };
			else this.parsed = this.parse(value, (base || this).parsed) || (scheme ? { scheme: scheme, value: value } : { value: value });
		} else if (part == 'data') {
			this.setData(value);
		} else {
			this.parsed[part] = value;
		}
		return this;
	},

	get: function(part, base){
		switch(part){
			case 'value': return this.combine(this.parsed, base ? base.parsed : false);
			case 'data' : return this.getData();
		}
		return this.parsed[part] || '';
	},

	go: function(){
		document.location.href = this.toString();
	},

	toURI: function(){
		return this;
	},

	getData: function(key, part){
		var qs = this.get(part || 'query');
		if (!$chk(qs)) return key ? null : {};
		var obj = qs.parseQueryString();
		return key ? obj[key] : obj;
	},

	setData: function(values, merge, part){
		if (typeof values == 'string'){
			data = this.getData();
			data[arguments[0]] = arguments[1];
			values = data;
		} else if (merge) {
			values = $merge(this.getData(), values);
		}
		return this.set(part || 'query', Hash.toQueryString(values));
	},

	clearData: function(part){
		return this.set(part || 'query', '');
	}

});

URI.prototype.toString = URI.prototype.valueOf = function(){
	return this.get('value');
};

URI.regs = {
	endSlash: /\/$/,
	scheme: /^(\w+):/,
	directoryDot: /\.\/|\.$/
};

URI.base = new URI(document.getElements('base[href]', true).getLast(), {base: document.location});

String.implement({

	toURI: function(options){
		return new URI(this, options);
	}

});

/*
---

script: URI.Relative.js

description: Extends the URI class to add methods for computing relative and absolute urls.

license: MIT-style license

authors:
- Sebastian Markbåge


requires:
- /Class.refactor
- /URI

provides: [URI.Relative]

...
*/

URI = Class.refactor(URI, {

	combine: function(bits, base){
		if (!base || bits.scheme != base.scheme || bits.host != base.host || bits.port != base.port)
			return this.previous.apply(this, arguments);
		var end = bits.file + (bits.query ? '?' + bits.query : '') + (bits.fragment ? '#' + bits.fragment : '');

		if (!base.directory) return (bits.directory || (bits.file ? '' : './')) + end;

		var baseDir = base.directory.split('/'),
			relDir = bits.directory.split('/'),
			path = '',
			offset;

		var i = 0;
		for(offset = 0; offset < baseDir.length && offset < relDir.length && baseDir[offset] == relDir[offset]; offset++);
		for(i = 0; i < baseDir.length - offset - 1; i++) path += '../';
		for(i = offset; i < relDir.length - 1; i++) path += relDir[i] + '/';

		return (path || (bits.file ? '' : './')) + end;
	},

	toAbsolute: function(base){
		base = new URI(base);
		if (base) base.set('directory', '').set('file', '');
		return this.toRelative(base);
	},

	toRelative: function(base){
		return this.get('value', new URI(base));
	}

});

/*
---

script: Element.Forms.js

description: Extends the Element native object to include methods useful in managing inputs.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element
- /MooTools.More

provides: [Element.Forms]

...
*/

Element.implement({

	tidy: function(){
		this.set('value', this.get('value').tidy());
	},

	getTextInRange: function(start, end){
		return this.get('value').substring(start, end);
	},

	getSelectedText: function(){
		if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
		return document.selection.createRange().text;
	},

	getSelectedRange: function() {
		if ($defined(this.selectionStart)) return {start: this.selectionStart, end: this.selectionEnd};
		var pos = {start: 0, end: 0};
		var range = this.getDocument().selection.createRange();
		if (!range || range.parentElement() != this) return pos;
		var dup = range.duplicate();
		if (this.type == 'text') {
			pos.start = 0 - dup.moveStart('character', -100000);
			pos.end = pos.start + range.text.length;
		} else {
			var value = this.get('value');
			var offset = value.length;
			dup.moveToElementText(this);
			dup.setEndPoint('StartToEnd', range);
			if(dup.text.length) offset -= value.match(/[\n\r]*$/)[0].length;
			pos.end = offset - dup.text.length;
			dup.setEndPoint('StartToStart', range);
			pos.start = offset - dup.text.length;
		}
		return pos;
	},

	getSelectionStart: function(){
		return this.getSelectedRange().start;
	},

	getSelectionEnd: function(){
		return this.getSelectedRange().end;
	},

	setCaretPosition: function(pos){
		if (pos == 'end') pos = this.get('value').length;
		this.selectRange(pos, pos);
		return this;
	},

	getCaretPosition: function(){
		return this.getSelectedRange().start;
	},

	selectRange: function(start, end){
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else {
			var value = this.get('value');
			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		}
		return this;
	},

	insertAtCursor: function(value, select){
		var pos = this.getSelectedRange();
		var text = this.get('value');
		this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
		if ($pick(select, true)) this.selectRange(pos.start, pos.start + value.length);
		else this.setCaretPosition(pos.start + value.length);
		return this;
	},

	insertAroundCursor: function(options, select){
		options = $extend({
			before: '',
			defaultMiddle: '',
			after: ''
		}, options);
		var value = this.getSelectedText() || options.defaultMiddle;
		var pos = this.getSelectedRange();
		var text = this.get('value');
		if (pos.start == pos.end){
			this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
			this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
		} else {
			var current = text.substring(pos.start, pos.end);
			this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
			var selStart = pos.start + options.before.length;
			if ($pick(select, true)) this.selectRange(selStart, selStart + current.length);
			else this.setCaretPosition(selStart + text.length);
		}
		return this;
	}

});

/*
---

script: Elements.From.js

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element
- /MooTools.More

provides: [Elements.from]

...
*/

Elements.from = function(text, excludeScripts){
	if ($pick(excludeScripts, true)) text = text.stripScripts();

	var container, match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);

	if (match){
		container = new Element('table');
		var tag = match[1].toLowerCase();
		if (['td', 'th', 'tr'].contains(tag)){
			container = new Element('tbody').inject(container);
			if (tag != 'tr') container = new Element('tr').inject(container);
		}
	}

	return (container || new Element('div')).set('html', text).getChildren();
};

/*
---

script: Element.Delegation.js

description: Extends the Element native object to include the delegate method for more efficient event management.

credits:
- "Event checking based on the work of Daniel Steigerwald. License: MIT-style license.	Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
- Aaron Newton
- Daniel Steigerwald

requires:
- core:1.2.4/Element.Event
- core:1.2.4/Selectors
- /MooTools.More

provides: [Element.Delegation]

...
*/

(function(addEvent, removeEvent){
	
	var match = /(.*?):relay\(([^)]+)\)$/,
		combinators = /[+>~\s]/,
		splitType = function(type){
			var bits = type.match(match);
			return !bits ? {event: type} : {
				event: bits[1],
				selector: bits[2]
			};
		},
		check = function(e, selector){
			var t = e.target;
			if (combinators.test(selector = selector.trim())){
				var els = this.getElements(selector);
				for (var i = els.length; i--; ){
					var el = els[i];
					if (t == el || el.hasChild(t)) return el;
				}
			} else {
				for ( ; t && t != this; t = t.parentNode){
					if (Element.match(t, selector)) return document.id(t);
				}
			}
			return null;
		};

	Element.implement({

		addEvent: function(type, fn){
			var splitted = splitType(type);
			if (splitted.selector){
				var monitors = this.retrieve('$moo:delegateMonitors', {});
				if (!monitors[type]){
					var monitor = function(e){
						var el = check.call(this, e, splitted.selector);
						if (el) this.fireEvent(type, [e, el], 0, el);
					}.bind(this);
					monitors[type] = monitor;
					addEvent.call(this, splitted.event, monitor);
				}
			}
			return addEvent.apply(this, arguments);
		},

		removeEvent: function(type, fn){
			var splitted = splitType(type);
			if (splitted.selector){
				var events = this.retrieve('events');
				if (!events || !events[type] || (fn && !events[type].keys.contains(fn))) return this;

				if (fn) removeEvent.apply(this, [type, fn]);
				else removeEvent.apply(this, type);

				events = this.retrieve('events');
				if (events && events[type] && events[type].keys.length == 0){
					var monitors = this.retrieve('$moo:delegateMonitors', {});
					removeEvent.apply(this, [splitted.event, monitors[type]]);
					delete monitors[type];
				}
				return this;
			}
			return removeEvent.apply(this, arguments);
		},

		fireEvent: function(type, args, delay, bind){
			var events = this.retrieve('events');
			if (!events || !events[type]) return this;
			events[type].keys.each(function(fn){
				fn.create({bind: bind || this, delay: delay, arguments: args})();
			}, this);
			return this;
		}

	});

})(Element.prototype.addEvent, Element.prototype.removeEvent);

/*
---

script: Element.Measure.js

description: Extends the Element native object to include methods useful in measuring dimensions.

credits: "Element.measure / .expose methods by Daniel Steigerwald License: MIT-style license. Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Style
- core:1.2.4/Element.Dimensions
- /MooTools.More

provides: [Element.Measure]

...
*/

Element.implement({

	measure: function(fn){
		var vis = function(el) {
			return !!(!el || el.offsetHeight || el.offsetWidth);
		};
		if (vis(this)) return fn.apply(this);
		var parent = this.getParent(),
			restorers = [],
			toMeasure = []; 
		while (!vis(parent) && parent != document.body) {
			toMeasure.push(parent.expose());
			parent = parent.getParent();
		}
		var restore = this.expose();
		var result = fn.apply(this);
		restore();
		toMeasure.each(function(restore){
			restore();
		});
		return result;
	},

	expose: function(){
		if (this.getStyle('display') != 'none') return $empty;
		var before = this.style.cssText;
		this.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		return function(){
			this.style.cssText = before;
		}.bind(this);
	},

	getDimensions: function(options){
		options = $merge({computeSize: false},options);
		var dim = {};
		var getSize = function(el, options){
			return (options.computeSize)?el.getComputedSize(options):el.getSize();
		};
		var parent = this.getParent('body');
		if (parent && this.getStyle('display') == 'none'){
			dim = this.measure(function(){
				return getSize(this, options);
			});
		} else if (parent){
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		} else {
			dim = {x: 0, y: 0};
		}
		return $chk(dim.x) ? $extend(dim, {width: dim.x, height: dim.y}) : $extend(dim, {x: dim.width, y: dim.height});
	},

	getComputedSize: function(options){
		options = $merge({
			styles: ['padding','border'],
			plains: {
				height: ['top','bottom'],
				width: ['left','right']
			},
			mode: 'both'
		}, options);
		var size = {width: 0,height: 0};
		switch (options.mode){
			case 'vertical':
				delete size.width;
				delete options.plains.width;
				break;
			case 'horizontal':
				delete size.height;
				delete options.plains.height;
				break;
		}
		var getStyles = [];
		//this function might be useful in other places; perhaps it should be outside this function?
		$each(options.plains, function(plain, key){
			plain.each(function(edge){
				options.styles.each(function(style){
					getStyles.push((style == 'border') ? style + '-' + edge + '-' + 'width' : style + '-' + edge);
				});
			});
		});
		var styles = {};
		getStyles.each(function(style){ styles[style] = this.getComputedStyle(style); }, this);
		var subtracted = [];
		$each(options.plains, function(plain, key){ //keys: width, height, plains: ['left', 'right'], ['top','bottom']
			var capitalized = key.capitalize();
			size['total' + capitalized] = size['computed' + capitalized] = 0;
			plain.each(function(edge){ //top, left, right, bottom
				size['computed' + edge.capitalize()] = 0;
				getStyles.each(function(style, i){ //padding, border, etc.
					//'padding-left'.test('left') size['totalWidth'] = size['width'] + [padding-left]
					if (style.test(edge)){
						styles[style] = styles[style].toInt() || 0; //styles['padding-left'] = 5;
						size['total' + capitalized] = size['total' + capitalized] + styles[style];
						size['computed' + edge.capitalize()] = size['computed' + edge.capitalize()] + styles[style];
					}
					//if width != width (so, padding-left, for instance), then subtract that from the total
					if (style.test(edge) && key != style &&
						(style.test('border') || style.test('padding')) && !subtracted.contains(style)){
						subtracted.push(style);
						size['computed' + capitalized] = size['computed' + capitalized]-styles[style];
					}
				});
			});
		});

		['Width', 'Height'].each(function(value){
			var lower = value.toLowerCase();
			if(!$chk(size[lower])) return;

			size[lower] = size[lower] + this['offset' + value] + size['computed' + value];
			size['total' + value] = size[lower] + size['total' + value];
			delete size['computed' + value];
		}, this);

		return $extend(styles, size);
	}

});

/*
---

script: Element.Pin.js

description: Extends the Element native object to include the pin method useful for fixed positioning for elements.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Event
- core:1.2.4/Element.Dimensions
- core:1.2.4/Element.Style
- /MooTools.More

provides: [Element.Pin]

...
*/

(function(){
	var supportsPositionFixed = false;
	window.addEvent('domready', function(){
		var test = new Element('div').setStyles({
			position: 'fixed',
			top: 0,
			right: 0
		}).inject(document.body);
		supportsPositionFixed = (test.offsetTop === 0);
		test.dispose();
	});

	Element.implement({

		pin: function(enable){
			if (this.getStyle('display') == 'none') return null;
			
			var p,
					scroll = window.getScroll();
			if (enable !== false){
				p = this.getPosition();
				if (!this.retrieve('pinned')){
					var pos = {
						top: p.y - scroll.y,
						left: p.x - scroll.x
					};
					if (supportsPositionFixed){
						this.setStyle('position', 'fixed').setStyles(pos);
					} else {
						this.store('pinnedByJS', true);
						this.setStyles({
							position: 'absolute',
							top: p.y,
							left: p.x
						}).addClass('isPinned');
						this.store('scrollFixer', (function(){
							if (this.retrieve('pinned'))
								var scroll = window.getScroll();
								this.setStyles({
									top: pos.top.toInt() + scroll.y,
									left: pos.left.toInt() + scroll.x
								});
						}).bind(this));
						window.addEvent('scroll', this.retrieve('scrollFixer'));
					}
					this.store('pinned', true);
				}
			} else {
				var op;
				if (!Browser.Engine.trident){
					var parent = this.getParent();
					op = (parent.getComputedStyle('position') != 'static' ? parent : parent.getOffsetParent());
				}
				p = this.getPosition(op);
				this.store('pinned', false);
				var reposition;
				if (supportsPositionFixed && !this.retrieve('pinnedByJS')){
					reposition = {
						top: p.y + scroll.y,
						left: p.x + scroll.x
					};
				} else {
					this.store('pinnedByJS', false);
					window.removeEvent('scroll', this.retrieve('scrollFixer'));
					reposition = {
						top: p.y,
						left: p.x
					};
				}
				this.setStyles($merge(reposition, {position: 'absolute'})).removeClass('isPinned');
			}
			return this;
		},

		unpin: function(){
			return this.pin(false);
		},

		togglepin: function(){
			this.pin(!this.retrieve('pinned'));
		}

	});

})();

/*
---

script: Element.Position.js

description: Extends the Element native object to include methods useful positioning elements relative to others.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Dimensions
- /Element.Measure

provides: [Elements.Position]

...
*/

(function(){

var original = Element.prototype.position;

Element.implement({

	position: function(options){
		//call original position if the options are x/y values
		if (options && ($defined(options.x) || $defined(options.y))) return original ? original.apply(this, arguments) : this;
		$each(options||{}, function(v, k){ if (!$defined(v)) delete options[k]; });
		options = $merge({
			// minimum: { x: 0, y: 0 },
			// maximum: { x: 0, y: 0},
			relativeTo: document.body,
			position: {
				x: 'center', //left, center, right
				y: 'center' //top, center, bottom
			},
			edge: false,
			offset: {x: 0, y: 0},
			returnPos: false,
			relFixedPosition: false,
			ignoreMargins: false,
			ignoreScroll: false,
			allowNegative: false
		}, options);
		//compute the offset of the parent positioned element if this element is in one
		var parentOffset = {x: 0, y: 0}, 
				parentPositioned = false;
		/* dollar around getOffsetParent should not be necessary, but as it does not return
		 * a mootools extended element in IE, an error occurs on the call to expose. See:
		 * http://mootools.lighthouseapp.com/projects/2706/tickets/333-element-getoffsetparent-inconsistency-between-ie-and-other-browsers */
		var offsetParent = this.measure(function(){
			return document.id(this.getOffsetParent());
		});
		if (offsetParent && offsetParent != this.getDocument().body){
			parentOffset = offsetParent.measure(function(){
				return this.getPosition();
			});
			parentPositioned = offsetParent != document.id(options.relativeTo);
			options.offset.x = options.offset.x - parentOffset.x;
			options.offset.y = options.offset.y - parentOffset.y;
		}
		//upperRight, bottomRight, centerRight, upperLeft, bottomLeft, centerLeft
		//topRight, topLeft, centerTop, centerBottom, center
		var fixValue = function(option){
			if ($type(option) != 'string') return option;
			option = option.toLowerCase();
			var val = {};
			if (option.test('left')) val.x = 'left';
			else if (option.test('right')) val.x = 'right';
			else val.x = 'center';
			if (option.test('upper') || option.test('top')) val.y = 'top';
			else if (option.test('bottom')) val.y = 'bottom';
			else val.y = 'center';
			return val;
		};
		options.edge = fixValue(options.edge);
		options.position = fixValue(options.position);
		if (!options.edge){
			if (options.position.x == 'center' && options.position.y == 'center') options.edge = {x:'center', y:'center'};
			else options.edge = {x:'left', y:'top'};
		}

		this.setStyle('position', 'absolute');
		var rel = document.id(options.relativeTo) || document.body,
				calc = rel == document.body ? window.getScroll() : rel.getPosition(),
				top = calc.y, left = calc.x;

		var dim = this.getDimensions({computeSize: true, styles:['padding', 'border','margin']});
		var pos = {},
				prefY = options.offset.y,
				prefX = options.offset.x,
				winSize = window.getSize();
		switch(options.position.x){
			case 'left':
				pos.x = left + prefX;
				break;
			case 'right':
				pos.x = left + prefX + rel.offsetWidth;
				break;
			default: //center
				pos.x = left + ((rel == document.body ? winSize.x : rel.offsetWidth)/2) + prefX;
				break;
		}
		switch(options.position.y){
			case 'top':
				pos.y = top + prefY;
				break;
			case 'bottom':
				pos.y = top + prefY + rel.offsetHeight;
				break;
			default: //center
				pos.y = top + ((rel == document.body ? winSize.y : rel.offsetHeight)/2) + prefY;
				break;
		}
		if (options.edge){
			var edgeOffset = {};

			switch(options.edge.x){
				case 'left':
					edgeOffset.x = 0;
					break;
				case 'right':
					edgeOffset.x = -dim.x-dim.computedRight-dim.computedLeft;
					break;
				default: //center
					edgeOffset.x = -(dim.totalWidth/2);
					break;
			}
			switch(options.edge.y){
				case 'top':
					edgeOffset.y = 0;
					break;
				case 'bottom':
					edgeOffset.y = -dim.y-dim.computedTop-dim.computedBottom;
					break;
				default: //center
					edgeOffset.y = -(dim.totalHeight/2);
					break;
			}
			pos.x += edgeOffset.x;
			pos.y += edgeOffset.y;
		}
		pos = {
			left: ((pos.x >= 0 || parentPositioned || options.allowNegative) ? pos.x : 0).toInt(),
			top: ((pos.y >= 0 || parentPositioned || options.allowNegative) ? pos.y : 0).toInt()
		};
		var xy = {left: 'x', top: 'y'};
		['minimum', 'maximum'].each(function(minmax) {
			['left', 'top'].each(function(lr) {
				var val = options[minmax] ? options[minmax][xy[lr]] : null;
				if (val != null && pos[lr] < val) pos[lr] = val;
			});
		});
		if (rel.getStyle('position') == 'fixed' || options.relFixedPosition){
			var winScroll = window.getScroll();
			pos.top+= winScroll.y;
			pos.left+= winScroll.x;
		}
		if (options.ignoreScroll) {
			var relScroll = rel.getScroll();
			pos.top-= relScroll.y;
			pos.left-= relScroll.x;
		}
		if (options.ignoreMargins) {
			pos.left += (
				options.edge.x == 'right' ? dim['margin-right'] : 
				options.edge.x == 'center' ? -dim['margin-left'] + ((dim['margin-right'] + dim['margin-left'])/2) : 
					- dim['margin-left']
			);
			pos.top += (
				options.edge.y == 'bottom' ? dim['margin-bottom'] : 
				options.edge.y == 'center' ? -dim['margin-top'] + ((dim['margin-bottom'] + dim['margin-top'])/2) : 
					- dim['margin-top']
			);
		}
		pos.left = Math.ceil(pos.left);
		pos.top = Math.ceil(pos.top);
		if (options.returnPos) return pos;
		else this.setStyles(pos);
		return this;
	}

});

})();

/*
---

script: Element.Shortcuts.js

description: Extends the Element native object to include some shortcut methods.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Style
- /MooTools.More

provides: [Element.Shortcuts]

...
*/

Element.implement({

	isDisplayed: function(){
		return this.getStyle('display') != 'none';
	},

	isVisible: function(){
		var w = this.offsetWidth,
			h = this.offsetHeight;
		return (w == 0 && h == 0) ? false : (w > 0 && h > 0) ? true : this.isDisplayed();
	},

	toggle: function(){
		return this[this.isDisplayed() ? 'hide' : 'show']();
	},

	hide: function(){
		var d;
		try {
			//IE fails here if the element is not in the dom
			d = this.getStyle('display');
		} catch(e){}
		return this.store('originalDisplay', d || '').setStyle('display', 'none');
	},

	show: function(display){
		display = display || this.retrieve('originalDisplay') || 'block';
		return this.setStyle('display', (display == 'none') ? 'block' : display);
	},

	swapClass: function(remove, add){
		return this.removeClass(remove).addClass(add);
	}

});


/*
---

script: OverText.js

description: Shows text over an input that disappears when the user clicks into it. The text remains hidden if the user adds a value.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Options
- core:1.2.4/Events
- core:1.2.4/Element.Event
- /Class.Binds
- /Class.Occlude
- /Element.Position
- /Element.Shortcuts

provides: [OverText]

...
*/

var OverText = new Class({

	Implements: [Options, Events, Class.Occlude],

	Binds: ['reposition', 'assert', 'focus', 'hide'],

	options: {/*
		textOverride: null,
		onFocus: $empty()
		onTextHide: $empty(textEl, inputEl),
		onTextShow: $empty(textEl, inputEl), */
		element: 'label',
		positionOptions: {
			position: 'upperLeft',
			edge: 'upperLeft',
			offset: {
				x: 4,
				y: 2
			}
		},
		poll: false,
		pollInterval: 250,
		wrap: false
	},

	property: 'OverText',

	initialize: function(element, options){
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.attach(this.element);
		OverText.instances.push(this);
		if (this.options.poll) this.poll();
		return this;
	},

	toElement: function(){
		return this.element;
	},

	attach: function(){
		var val = this.options.textOverride || this.element.get('alt') || this.element.get('title');
		if (!val) return;
		this.text = new Element(this.options.element, {
			'class': 'overTxtLabel',
			styles: {
				lineHeight: 'normal',
				position: 'absolute',
				cursor: 'text'
			},
			html: val,
			events: {
				click: this.hide.pass(this.options.element == 'label', this)
			}
		}).inject(this.element, 'after');
		if (this.options.element == 'label') {
			if (!this.element.get('id')) this.element.set('id', 'input_' + new Date().getTime());
			this.text.set('for', this.element.get('id'));
		}

		if (this.options.wrap) {
			this.textHolder = new Element('div', {
				styles: {
					lineHeight: 'normal',
					position: 'relative'
				},
				'class':'overTxtWrapper'
			}).adopt(this.text).inject(this.element, 'before');
		}

		this.element.addEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		}).store('OverTextDiv', this.text);
		window.addEvent('resize', this.reposition.bind(this));
		this.assert(true);
		this.reposition();
	},

	wrap: function(){
		if (this.options.element == 'label') {
			if (!this.element.get('id')) this.element.set('id', 'input_' + new Date().getTime());
			this.text.set('for', this.element.get('id'));
		}
	},

	startPolling: function(){
		this.pollingPaused = false;
		return this.poll();
	},

	poll: function(stop){
		//start immediately
		//pause on focus
		//resumeon blur
		if (this.poller && !stop) return this;
		var test = function(){
			if (!this.pollingPaused) this.assert(true);
		}.bind(this);
		if (stop) $clear(this.poller);
		else this.poller = test.periodical(this.options.pollInterval, this);
		return this;
	},

	stopPolling: function(){
		this.pollingPaused = true;
		return this.poll(true);
	},

	focus: function(){
		if (this.text && (!this.text.isDisplayed() || this.element.get('disabled'))) return;
		this.hide();
	},

	hide: function(suppressFocus, force){
		if (this.text && (this.text.isDisplayed() && (!this.element.get('disabled') || force))){
			this.text.hide();
			this.fireEvent('textHide', [this.text, this.element]);
			this.pollingPaused = true;
			if (!suppressFocus){
				try {
					this.element.fireEvent('focus');
					this.element.focus();
				} catch(e){} //IE barfs if you call focus on hidden elements
			}
		}
		return this;
	},

	show: function(){
		if (this.text && !this.text.isDisplayed()){
			this.text.show();
			this.reposition();
			this.fireEvent('textShow', [this.text, this.element]);
			this.pollingPaused = false;
		}
		return this;
	},

	assert: function(suppressFocus){
		this[this.test() ? 'show' : 'hide'](suppressFocus);
	},

	test: function(){
		var v = this.element.get('value');
		return !v;
	},

	reposition: function(){
		this.assert(true);
		if (!this.element.isVisible()) return this.stopPolling().hide();
		if (this.text && this.test()) this.text.position($merge(this.options.positionOptions, {relativeTo: this.element}));
		return this;
	}

});

OverText.instances = [];

$extend(OverText, {

	each: function(fn) {
		return OverText.instances.map(function(ot, i){
			if (ot.element && ot.text) return fn.apply(OverText, [ot, i]);
			return null; //the input or the text was destroyed
		});
	},
	
	update: function(){

		return OverText.each(function(ot){
			return ot.reposition();
		});

	},

	hideAll: function(){

		return OverText.each(function(ot){
			return ot.hide(true, true);
		});

	},

	showAll: function(){
		return OverText.each(function(ot) {
			return ot.show();
		});
	}

});

if (window.Fx && Fx.Reveal) {
	Fx.Reveal.implement({
		hideInputs: Browser.Engine.trident ? 'select, input, textarea, object, embed, .overTxtLabel' : false
	});
}

/*
---

script: Fx.Elements.js

description: Effect to change any number of CSS properties of any number of Elements.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Fx.CSS
- /MooTools.More

provides: [Fx.Elements]

...
*/

Fx.Elements = new Class({

	Extends: Fx.CSS,

	initialize: function(elements, options){
		this.elements = this.subject = $$(elements);
		this.parent(options);
	},

	compute: function(from, to, delta){
		var now = {};
		for (var i in from){
			var iFrom = from[i], iTo = to[i], iNow = now[i] = {};
			for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
		}
		return now;
	},

	set: function(now){
		for (var i in now){
			var iNow = now[i];
			for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
		}
		return this;
	},

	start: function(obj){
		if (!this.check(obj)) return this;
		var from = {}, to = {};
		for (var i in obj){
			var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};
			for (var p in iProps){
				var parsed = this.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
		}
		return this.parent(from, to);
	}

});

/*
---

script: Fx.Accordion.js

description: An Fx.Elements extension which allows you to easily create accordion type controls.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Element.Event
- /Fx.Elements

provides: [Fx.Accordion]

...
*/

Fx.Accordion = new Class({

	Extends: Fx.Elements,

	options: {/*
		onActive: $empty(toggler, section),
		onBackground: $empty(toggler, section),
		fixedHeight: false,
		fixedWidth: false,
		*/
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		returnHeightToAuto: true
	},

	initialize: function(){
		var params = Array.link(arguments, {
			'container': Element.type, //deprecated
			'options': Object.type,
			'togglers': $defined,
			'elements': $defined
		});
		this.parent(params.elements, params.options);
		this.togglers = $$(params.togglers);
		this.previous = -1;
		this.internalChain = new Chain();
		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)){
			this.options.display = false;
			this.previous = this.options.show;
		}
		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}
		this.effects = {};
		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';
		for (var i = 0, l = this.togglers.length; i < l; i++) this.addSection(this.togglers[i], this.elements[i]);
		this.elements.each(function(el, i){
			if (this.options.show === i){
				this.fireEvent('active', [this.togglers[i], el]);
			} else {
				for (var fx in this.effects) el.setStyle(fx, 0);
			}
		}, this);
		if ($chk(this.options.display) || this.options.initialDisplayFx === false) this.display(this.options.display, this.options.initialDisplayFx);
		if (this.options.fixedHeight !== false) this.options.returnHeightToAuto = false;
		this.addEvent('complete', this.internalChain.callChain.bind(this.internalChain));
	},

	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		var test = this.togglers.contains(toggler);
		this.togglers.include(toggler);
		this.elements.include(element);
		var idx = this.togglers.indexOf(toggler);
		var displayer = this.display.bind(this, idx);
		toggler.store('accordion:display', displayer);
		toggler.addEvent(this.options.trigger, displayer);
		if (this.options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (this.options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});
		element.fullOpacity = 1;
		if (this.options.fixedWidth) element.fullWidth = this.options.fixedWidth;
		if (this.options.fixedHeight) element.fullHeight = this.options.fixedHeight;
		element.setStyle('overflow', 'hidden');
		if (!test){
			for (var fx in this.effects) element.setStyle(fx, 0);
		}
		return this;
	},

	detach: function(){
		this.togglers.each(function(toggler) {
			toggler.removeEvent(this.options.trigger, toggler.retrieve('accordion:display'));
		}, this);
	},

	display: function(index, useFx){
		if (!this.check(index, useFx)) return this;
		useFx = $pick(useFx, true);
		if (this.options.returnHeightToAuto){
			var prev = this.elements[this.previous];
			if (prev && !this.selfHidden){
				for (var fx in this.effects){
					prev.setStyle(fx, prev[this.effects[fx]]);
				}
			}
		}
		index = ($type(index) == 'element') ? this.elements.indexOf(index) : index;
		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			var hide;
			if (i != index){
				hide = true;
			} else if (this.options.alwaysHide && ((el.offsetHeight > 0 && this.options.height) || el.offsetWidth > 0 && this.options.width)){
				hide = true;
				this.selfHidden = true;
			}
			this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
			for (var fx in this.effects) obj[i][fx] = hide ? 0 : el[this.effects[fx]];
		}, this);
		this.internalChain.chain(function(){
			if (this.options.returnHeightToAuto && !this.selfHidden){
				var el = this.elements[index];
				if (el) el.setStyle('height', 'auto');
			};
		}.bind(this));
		return useFx ? this.start(obj) : this.set(obj);
	}

});

/*
	Compatibility with 1.2.0
*/
var Accordion = new Class({

	Extends: Fx.Accordion,

	initialize: function(){
		this.parent.apply(this, arguments);
		var params = Array.link(arguments, {'container': Element.type});
		this.container = params.container;
	},

	addSection: function(toggler, element, pos){
		toggler = document.id(toggler);
		element = document.id(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		if (len && (!test || pos)){
			pos = $pick(pos, len - 1);
			toggler.inject(this.togglers[pos], 'before');
			element.inject(toggler, 'after');
		} else if (this.container && !test){
			toggler.inject(this.container);
			element.inject(this.container);
		}
		return this.parent.apply(this, arguments);
	}

});

/*
---

script: Fx.Move.js

description: Defines Fx.Move, a class that works with Element.Position.js to transition an element from one location to another.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Fx.Morph
- /Element.Position

provides: [Fx.Move]

...
*/

Fx.Move = new Class({

	Extends: Fx.Morph,

	options: {
		relativeTo: document.body,
		position: 'center',
		edge: false,
		offset: {x: 0, y: 0}
	},

	start: function(destination){
		return this.parent(this.element.position($merge(this.options, destination, {returnPos: true})));
	}

});

Element.Properties.move = {

	set: function(options){
		var morph = this.retrieve('move');
		if (morph) morph.cancel();
		return this.eliminate('move').store('move:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('move')){
			if (options || !this.retrieve('move:options')) this.set('move', options);
			this.store('move', new Fx.Move(this, this.retrieve('move:options')));
		}
		return this.retrieve('move');
	}

};

Element.implement({

	move: function(options){
		this.get('move').start(options);
		return this;
	}

});


/*
---

script: Fx.Reveal.js

description: Defines Fx.Reveal, a class that shows and hides elements with a transition.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Fx.Morph
- /Element.Shortcuts
- /Element.Measure

provides: [Fx.Reveal]

...
*/

Fx.Reveal = new Class({

	Extends: Fx.Morph,

	options: {/*	  
		onShow: $empty(thisElement),
		onHide: $empty(thisElement),
		onComplete: $empty(thisElement),
		heightOverride: null,
		widthOverride: null, */
		link: 'cancel',
		styles: ['padding', 'border', 'margin'],
		transitionOpacity: !Browser.Engine.trident4,
		mode: 'vertical',
		display: 'block',
		hideInputs: Browser.Engine.trident ? 'select, input, textarea, object, embed' : false
	},

	dissolve: function(){
		try {
			if (!this.hiding && !this.showing){
				if (this.element.getStyle('display') != 'none'){
					this.hiding = true;
					this.showing = false;
					this.hidden = true;
					this.cssText = this.element.style.cssText;
					var startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
					this.element.setStyle('display', this.options.display);
					if (this.options.transitionOpacity) startStyles.opacity = 1;
					var zero = {};
					$each(startStyles, function(style, name){
						zero[name] = [style, 0];
					}, this);
					this.element.setStyle('overflow', 'hidden');
					var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
					this.$chain.unshift(function(){
						if (this.hidden){
							this.hiding = false;
							$each(startStyles, function(style, name){
								startStyles[name] = style;
							}, this);
							this.element.style.cssText = this.cssText;
							this.element.setStyle('display', 'none');
							if (hideThese) hideThese.setStyle('visibility', 'visible');
						}
						this.fireEvent('hide', this.element);
						this.callChain();
					}.bind(this));
					if (hideThese) hideThese.setStyle('visibility', 'hidden');
					this.start(zero);
				} else {
					this.callChain.delay(10, this);
					this.fireEvent('complete', this.element);
					this.fireEvent('hide', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.dissolve.bind(this));
			} else if (this.options.link == 'cancel' && !this.hiding){
				this.cancel();
				this.dissolve();
			}
		} catch(e){
			this.hiding = false;
			this.element.setStyle('display', 'none');
			this.callChain.delay(10, this);
			this.fireEvent('complete', this.element);
			this.fireEvent('hide', this.element);
		}
		return this;
	},

	reveal: function(){
		try {
			if (!this.showing && !this.hiding){
				if (this.element.getStyle('display') == 'none' ||
					 this.element.getStyle('visiblity') == 'hidden' ||
					 this.element.getStyle('opacity') == 0){
					this.showing = true;
					this.hiding = this.hidden =  false;
					var startStyles;
					this.cssText = this.element.style.cssText;
					//toggle display, but hide it
					this.element.measure(function(){
						//create the styles for the opened/visible state
						startStyles = this.element.getComputedSize({
							styles: this.options.styles,
							mode: this.options.mode
						});
					}.bind(this));
					$each(startStyles, function(style, name){
						startStyles[name] = style;
					});
					//if we're overridding height/width
					if ($chk(this.options.heightOverride)) startStyles.height = this.options.heightOverride.toInt();
					if ($chk(this.options.widthOverride)) startStyles.width = this.options.widthOverride.toInt();
					if (this.options.transitionOpacity) {
						this.element.setStyle('opacity', 0);
						startStyles.opacity = 1;
					}
					//create the zero state for the beginning of the transition
					var zero = {
						height: 0,
						display: this.options.display
					};
					$each(startStyles, function(style, name){ zero[name] = 0; });
					//set to zero
					this.element.setStyles($merge(zero, {overflow: 'hidden'}));
					//hide inputs
					var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
					if (hideThese) hideThese.setStyle('visibility', 'hidden');
					//start the effect
					this.start(startStyles);
					this.$chain.unshift(function(){
						this.element.style.cssText = this.cssText;
						this.element.setStyle('display', this.options.display);
						if (!this.hidden) this.showing = false;
						if (hideThese) hideThese.setStyle('visibility', 'visible');
						this.callChain();
						this.fireEvent('show', this.element);
					}.bind(this));
				} else {
					this.callChain();
					this.fireEvent('complete', this.element);
					this.fireEvent('show', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.reveal.bind(this));
			} else if (this.options.link == 'cancel' && !this.showing){
				this.cancel();
				this.reveal();
			}
		} catch(e){
			this.element.setStyles({
				display: this.options.display,
				visiblity: 'visible',
				opacity: 1
			});
			this.showing = false;
			this.callChain.delay(10, this);
			this.fireEvent('complete', this.element);
			this.fireEvent('show', this.element);
		}
		return this;
	},

	toggle: function(){
		if (this.element.getStyle('display') == 'none' ||
			 this.element.getStyle('visiblity') == 'hidden' ||
			 this.element.getStyle('opacity') == 0){
			this.reveal();
		} else {
			this.dissolve();
		}
		return this;
	},

	cancel: function(){
		this.parent.apply(this, arguments);
		this.element.style.cssText = this.cssText;
		this.hidding = false;
		this.showing = false;
	}

});

Element.Properties.reveal = {

	set: function(options){
		var reveal = this.retrieve('reveal');
		if (reveal) reveal.cancel();
		return this.eliminate('reveal').store('reveal:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('reveal')){
			if (options || !this.retrieve('reveal:options')) this.set('reveal', options);
			this.store('reveal', new Fx.Reveal(this, this.retrieve('reveal:options')));
		}
		return this.retrieve('reveal');
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal: function(options){
		this.get('reveal', options).reveal();
		return this;
	},

	dissolve: function(options){
		this.get('reveal', options).dissolve();
		return this;
	},

	nix: function(){
		var params = Array.link(arguments, {destroy: Boolean.type, options: Object.type});
		this.get('reveal', params.options).dissolve().chain(function(){
			this[params.destroy ? 'destroy' : 'dispose']();
		}.bind(this));
		return this;
	},

	wink: function(){
		var params = Array.link(arguments, {duration: Number.type, options: Object.type});
		var reveal = this.get('reveal', params.options);
		reveal.reveal().chain(function(){
			(function(){
				reveal.dissolve();
			}).delay(params.duration || 2000);
		});
	}


});

/*
---

script: Fx.Scroll.js

description: Effect to smoothly scroll any element, including the window.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Fx
- core:1.2.4/Element.Event
- core:1.2.4/Element.Dimensions
- /MooTools.More

provides: [Fx.Scroll]

...
*/

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
		var cancel = this.cancel.bind(this, false);

		if ($type(this.element) != 'element') this.element = document.id(this.element.getDocument().body);

		var stopper = this.element;

		if (this.options.wheelStops){
			this.addEvent('start', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('complete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		if (Browser.Engine.gecko) now = [Math.round(now[0]), Math.round(now[1])];
		this.element.scrollTo(now[0], now[1]);
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var scrollSize = this.element.getScrollSize(),
			scroll = this.element.getScroll(), 
			values = {x: x, y: y};
		for (var z in values){
			var max = scrollSize[z];
			if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z] : max;
			else values[z] = scroll[z];
			values[z] += this.options.offset[z];
		}
		return this.parent([scroll.x, scroll.y], [values.x, values.y]);
	},

	toTop: function(){
		return this.start(false, 0);
	},

	toLeft: function(){
		return this.start(0, false);
	},

	toRight: function(){
		return this.start('right', false);
	},

	toBottom: function(){
		return this.start(false, 'bottom');
	},

	toElement: function(el){
		var position = document.id(el).getPosition(this.element);
		return this.start(position.x, position.y);
	},

	scrollIntoView: function(el, axes, offset){
		axes = axes ? $splat(axes) : ['x','y'];
		var to = {};
		el = document.id(el);
		var pos = el.getPosition(this.element);
		var size = el.getSize();
		var scroll = this.element.getScroll();
		var containerSize = this.element.getSize();
		var edge = {
			x: pos.x + size.x,
			y: pos.y + size.y
		};
		['x','y'].each(function(axis) {
			if (axes.contains(axis)) {
				if (edge[axis] > scroll[axis] + containerSize[axis]) to[axis] = edge[axis] - containerSize[axis];
				if (pos[axis] < scroll[axis]) to[axis] = pos[axis];
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);
		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	},

	scrollToCenter: function(el, axes, offset){
		axes = axes ? $splat(axes) : ['x', 'y'];
		el = $(el);
		var to = {},
			pos = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize(),
			edge = {
				x: pos.x + size.x,
				y: pos.y + size.y
			};

		['x','y'].each(function(axis){
			if(axes.contains(axis)){
				to[axis] = pos[axis] - (containerSize[axis] - size[axis])/2;
			}
			if(to[axis] == null) to[axis] = scroll[axis];
			if(offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);
		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	}

});


/*
---

script: Fx.Slide.js

description: Effect to slide an element in and out of view.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Fx Element.Style
- /MooTools.More

provides: [Fx.Slide]

...
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical',
		wrapper: false,
		hideOverflow: true
	},

	initialize: function(element, options){
		this.addEvent('complete', function(){
			this.open = (this.wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open) this.wrapper.setStyle('height', '');
			if (this.open && Browser.Engine.webkit419) this.element.dispose().inject(this.wrapper);
		}, true);
		this.element = this.subject = document.id(element);
		this.parent(options);
		var wrapper = this.element.retrieve('wrapper');
		var styles = this.element.getStyles('margin', 'position', 'overflow');
		if (this.options.hideOverflow) styles = $extend(styles, {overflow: 'hidden'});
		if (this.options.wrapper) wrapper = document.id(this.options.wrapper).setStyles(styles);
		this.wrapper = wrapper || new Element('div', {
			styles: styles
		}).wraps(this.element);
		this.element.store('wrapper', this.wrapper).setStyle('margin', 0);
		this.now = [];
		this.open = true;
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set: function(now){
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(how, mode){
		if (!this.check(how, mode)) return this;
		this[mode || this.options.mode]();
		var margin = this.element.getStyle(this.margin).toInt();
		var layout = this.wrapper.getStyle(this.layout).toInt();
		var caseIn = [[margin, layout], [0, this.offset]];
		var caseOut = [[margin, layout], [-this.offset, 0]];
		var start;
		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn: function(mode){
		return this.start('in', mode);
	},

	slideOut: function(mode){
		return this.start('out', mode);
	},

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle: function(mode){
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set: function(options){
		var slide = this.retrieve('slide');
		if (slide) slide.cancel();
		return this.eliminate('slide').store('slide:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('slide')){
			if (options || !this.retrieve('slide:options')) this.set('slide', options);
			this.store('slide', new Fx.Slide(this, this.retrieve('slide:options')));
		}
		return this.retrieve('slide');
	}

};

Element.implement({

	slide: function(how, mode){
		how = how || 'toggle';
		var slide = this.get('slide'), toggle;
		switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
		if (!toggle) this.eliminate('slide:flag');
		return this;
	}

});


/*
---

script: Fx.SmoothScroll.js

description: Class for creating a smooth scrolling effect to all internal links on the page.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Selectors
- /Fx.Scroll

provides: [Fx.SmoothScroll]

...
*/

var SmoothScroll = Fx.SmoothScroll = new Class({

	Extends: Fx.Scroll,

	initialize: function(options, context){
		context = context || document;
		this.doc = context.getDocument();
		var win = context.getWindow();
		this.parent(this.doc, options);
		this.links = $$(this.options.links || this.doc.links);
		var location = win.location.href.match(/^[^#]*/)[0] + '#';
		this.links.each(function(link){
			if (link.href.indexOf(location) != 0) {return;}
			var anchor = link.href.substr(location.length);
			if (anchor) this.useLink(link, anchor);
		}, this);
		if (!Browser.Engine.webkit419) {
			this.addEvent('complete', function(){
				win.location.hash = this.anchor;
			}, true);
		}
	},

	useLink: function(link, anchor){
		var el;
		link.addEvent('click', function(event){
			if (el !== false && !el) el = document.id(anchor) || this.doc.getElement('a[name=' + anchor + ']');
			if (el) {
				event.preventDefault();
				this.anchor = anchor;
				this.toElement(el).chain(function(){
					this.fireEvent('scrolledTo', [link, el]);
				}.bind(this));
				link.blur();
			}
		}.bind(this));
	}
});

/*
---

script: Fx.Sort.js

description: Defines Fx.Sort, a class that reorders lists with a transition.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Dimensions
- /Fx.Elements
- /Element.Measure

provides: [Fx.Sort]

...
*/

Fx.Sort = new Class({

	Extends: Fx.Elements,

	options: {
		mode: 'vertical'
	},

	initialize: function(elements, options){
		this.parent(elements, options);
		this.elements.each(function(el){
			if (el.getStyle('position') == 'static') el.setStyle('position', 'relative');
		});
		this.setDefaultOrder();
	},

	setDefaultOrder: function(){
		this.currentOrder = this.elements.map(function(el, index){
			return index;
		});
	},

	sort: function(newOrder){
		if ($type(newOrder) != 'array') return false;
		var top = 0,
			left = 0,
			next = {},
			zero = {},
			vert = this.options.mode == 'vertical';
		var current = this.elements.map(function(el, index){
			var size = el.getComputedSize({styles: ['border', 'padding', 'margin']});
			var val;
			if (vert){
				val = {
					top: top,
					margin: size['margin-top'],
					height: size.totalHeight
				};
				top += val.height - size['margin-top'];
			} else {
				val = {
					left: left,
					margin: size['margin-left'],
					width: size.totalWidth
				};
				left += val.width;
			}
			var plain = vert ? 'top' : 'left';
			zero[index] = {};
			var start = el.getStyle(plain).toInt();
			zero[index][plain] = start || 0;
			return val;
		}, this);
		this.set(zero);
		newOrder = newOrder.map(function(i){ return i.toInt(); });
		if (newOrder.length != this.elements.length){
			this.currentOrder.each(function(index){
				if (!newOrder.contains(index)) newOrder.push(index);
			});
			if (newOrder.length > this.elements.length)
				newOrder.splice(this.elements.length-1, newOrder.length - this.elements.length);
		}
		var margin = top = left = 0;
		newOrder.each(function(item, index){
			var newPos = {};
			if (vert){
				newPos.top = top - current[item].top - margin;
				top += current[item].height;
			} else {
				newPos.left = left - current[item].left;
				left += current[item].width;
			}
			margin = margin + current[item].margin;
			next[item]=newPos;
		}, this);
		var mapped = {};
		$A(newOrder).sort().each(function(index){
			mapped[index] = next[index];
		});
		this.start(mapped);
		this.currentOrder = newOrder;
		return this;
	},

	rearrangeDOM: function(newOrder){
		newOrder = newOrder || this.currentOrder;
		var parent = this.elements[0].getParent();
		var rearranged = [];
		this.elements.setStyle('opacity', 0);
		//move each element and store the new default order
		newOrder.each(function(index){
			rearranged.push(this.elements[index].inject(parent).setStyles({
				top: 0,
				left: 0
			}));
		}, this);
		this.elements.setStyle('opacity', 1);
		this.elements = $$(rearranged);
		this.setDefaultOrder();
		return this;
	},

	getDefaultOrder: function(){
		return this.elements.map(function(el, index){
			return index;
		});
	},

	forward: function(){
		return this.sort(this.getDefaultOrder());
	},

	backward: function(){
		return this.sort(this.getDefaultOrder().reverse());
	},

	reverse: function(){
		return this.sort(this.currentOrder.reverse());
	},

	sortByElements: function(elements){
		return this.sort(elements.map(function(el){
			return this.elements.indexOf(el);
		}, this));
	},

	swap: function(one, two){
		if ($type(one) == 'element') one = this.elements.indexOf(one);
		if ($type(two) == 'element') two = this.elements.indexOf(two);
		
		var newOrder = $A(this.currentOrder);
		newOrder[this.currentOrder.indexOf(one)] = two;
		newOrder[this.currentOrder.indexOf(two)] = one;
		return this.sort(newOrder);
	}

});

/*
---

script: Drag.js

description: The base Drag Class. Can be used to drag and resize Elements using mouse events.

license: MIT-style license

authors:
- Valerio Proietti
- Tom Occhinno
- Jan Kassens

requires:
- core:1.2.4/Events
- core:1.2.4/Options
- core:1.2.4/Element.Event
- core:1.2.4/Element.Style
- /MooTools.More

provides: [Drag]

*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: $empty(thisElement),
		onStart: $empty(thisElement, event),
		onSnap: $empty(thisElement)
		onDrag: $empty(thisElement, event),
		onCancel: $empty(thisElement),
		onComplete: $empty(thisElement, event),*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		stopPropagation: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize: function(){
		var params = Array.link(arguments, {'options': Object.type, 'element': $defined});
		this.element = document.id(params.element);
		this.document = this.element.getDocument();
		this.setOptions(params.options || {});
		var htype = $type(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.Engine.trident) ? 'selectstart' : 'mousedown';

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: $lambda(false)
		};
		this.attach();
	},

	attach: function(){
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		if (event.rightClick) return;
		if (this.options.preventDefault) event.preventDefault();
		if (this.options.stopPropagation) event.stopPropagation();
		this.mouse.start = event.page;
		this.fireEvent('beforeStart', this.element);
		var limit = this.options.limit;
		this.limit = {x: [], y: []};
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			if (this.options.style) this.value.now[z] = this.element.getStyle(this.options.modifiers[z]).toInt();
			else this.value.now[z] = this.element[this.options.modifiers[z]];
			if (this.options.invert) this.value.now[z] *= -1;
			this.mouse.pos[z] = event.page[z] - this.value.now[z];
			if (limit && limit[z]){
				for (var i = 2; i--; i){
					if ($chk(limit[z][i])) this.limit[z][i] = $lambda(limit[z][i])();
				}
			}
		}
		if ($type(this.options.grid) == 'number') this.options.grid = {x: this.options.grid, y: this.options.grid};
		this.document.addEvents({mousemove: this.bound.check, mouseup: this.bound.cancel});
		this.document.addEvent(this.selection, this.bound.eventStop);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag: function(event){
		if (this.options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];
			if (this.options.invert) this.value.now[z] *= -1;
			if (this.options.limit && this.limit[z]){
				if ($chk(this.limit[z][1]) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ($chk(this.limit[z][0]) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}
			if (this.options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % this.options.grid[z]);
			if (this.options.style) {
				this.element.setStyle(this.options.modifiers[z], this.value.now[z] + this.options.unit);
			} else {
				this.element[this.options.modifiers[z]] = this.value.now[z];
			}
		}
		this.fireEvent('drag', [this.element, event]);
	},

	cancel: function(event){
		this.document.removeEvent('mousemove', this.bound.check);
		this.document.removeEvent('mouseup', this.bound.cancel);
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop: function(event){
		this.document.removeEvent(this.selection, this.bound.eventStop);
		this.document.removeEvent('mousemove', this.bound.drag);
		this.document.removeEvent('mouseup', this.bound.stop);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

Element.implement({

	makeResizable: function(options){
		var drag = new Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
		this.store('resizer', drag);
		return drag.addEvent('drag', function(){
			this.fireEvent('resize', drag);
		}.bind(this));
	}

});


/*
---

script: Drag.Move.js

description: A Drag extension that provides support for the constraining of draggables to containers and droppables.

license: MIT-style license

authors:
- Valerio Proietti
- Tom Occhinno
- Jan Kassens
- Aaron Newton
- Scott Kyle

requires:
- core:1.2.4/Element.Dimensions
- /Drag

provides: [Drag.Move]

...
*/

Drag.Move = new Class({

	Extends: Drag,

	options: {/*
		onEnter: $empty(thisElement, overed),
		onLeave: $empty(thisElement, overed),
		onDrop: $empty(thisElement, overed, event),*/
		droppables: [],
		container: false,
		precalculate: false,
		includeMargins: true,
		checkDroppables: true,
		stopPropagation: false
	},

	initialize: function(element, options){
		this.parent(element, options);
		element = this.element;
		
		this.droppables = $$(this.options.droppables);
		this.container = document.id(this.options.container);
		
		if (this.container && $type(this.container) != 'element')
			this.container = document.id(this.container.getDocument().body);
		
		var styles = element.getStyles('left', 'top', 'position');
		if (styles.left == 'auto' || styles.top == 'auto')
			element.setPosition(element.getPosition(element.getOffsetParent()));
		
		if (styles.position == 'static')
			element.setStyle('position', 'absolute');

		this.addEvent('start', this.checkDroppables, true);

		this.overed = null;
	},

	start: function(event){
		if (this.container) this.options.limit = this.calculateLimit();
		
		if (this.options.precalculate){
			this.positions = this.droppables.map(function(el){
				return el.getCoordinates();
			});
		}
		
		this.parent(event);
	},
	
	calculateLimit: function(){
		var offsetParent = this.element.getOffsetParent(),
			containerCoordinates = this.container.getCoordinates(offsetParent),
			containerBorder = {},
			elementMargin = {},
			elementBorder = {},
			containerMargin = {},
			offsetParentPadding = {};

		['top', 'right', 'bottom', 'left'].each(function(pad){
			containerBorder[pad] = this.container.getStyle('border-' + pad).toInt();
			elementBorder[pad] = this.element.getStyle('border-' + pad).toInt();
			elementMargin[pad] = this.element.getStyle('margin-' + pad).toInt();
			containerMargin[pad] = this.container.getStyle('margin-' + pad).toInt();
			offsetParentPadding[pad] = offsetParent.getStyle('padding-' + pad).toInt();
		}, this);

		var width = this.element.offsetWidth + elementMargin.left + elementMargin.right,
			height = this.element.offsetHeight + elementMargin.top + elementMargin.bottom,
			left = 0,
			top = 0,
			right = containerCoordinates.right - containerBorder.right - width,
			bottom = containerCoordinates.bottom - containerBorder.bottom - height;

		if (this.options.includeMargins){
			left += elementMargin.left;
			top += elementMargin.top;
		} else {
			right += elementMargin.right;
			bottom += elementMargin.bottom;
		}
		
		if (this.element.getStyle('position') == 'relative'){
			var coords = this.element.getCoordinates(offsetParent);
			coords.left -= this.element.getStyle('left').toInt();
			coords.top -= this.element.getStyle('top').toInt();
			
			left += containerBorder.left - coords.left;
			top += containerBorder.top - coords.top;
			right += elementMargin.left - coords.left;
			bottom += elementMargin.top - coords.top;
			
			if (this.container != offsetParent){
				left += containerMargin.left + offsetParentPadding.left;
				top += (Browser.Engine.trident4 ? 0 : containerMargin.top) + offsetParentPadding.top;
			}
		} else {
			left -= elementMargin.left;
			top -= elementMargin.top;
			
			if (this.container == offsetParent){
				right -= containerBorder.left;
				bottom -= containerBorder.top;
			} else {
				left += containerCoordinates.left + containerBorder.left;
				top += containerCoordinates.top + containerBorder.top;
			}
		}
		
		return {
			x: [left, right],
			y: [top, bottom]
		};
	},

	checkAgainst: function(el, i){
		el = (this.positions) ? this.positions[i] : el.getCoordinates();
		var now = this.mouse.now;
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},

	checkDroppables: function(){
		var overed = this.droppables.filter(this.checkAgainst, this).getLast();
		if (this.overed != overed){
			if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
			if (overed) this.fireEvent('enter', [this.element, overed]);
			this.overed = overed;
		}
	},

	drag: function(event){
		if (this.options.stopPropagation) {
			event.stopPropagation();
		}
		this.parent(event);
		if (this.options.checkDroppables && this.droppables.length) this.checkDroppables();
	},

	stop: function(event){
		this.checkDroppables();
		this.fireEvent('drop', [this.element, this.overed, event]);
		this.overed = null;
		return this.parent(event);
	}

});




Element.implement({

	makeDraggable: function(options){
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	}
});


/*
---

script: Slider.js

description: Class for creating horizontal and vertical slider controls.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Element.Dimensions
- /Class.Binds
- /Drag
- /Element.Dimensions
- /Element.Measure

provides: [Slider]

...
*/

var Slider = new Class({

	Implements: [Events, Options],

	Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],

	options: {/*
		onTick: $empty(intPosition),
		onChange: $empty(intStep),
		onComplete: $empty(strStep),*/
		onTick: function(position){
			if (this.options.snap) position = this.toPosition(this.step);
			this.knob.setStyle(this.property, position);
		},
		initialStep: 0,
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize: function(element, knob, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.knob = document.id(knob);
		this.previousChange = this.previousEnd = this.step = -1;
		var offset, limit = {}, modifiers = {'x': false, 'y': false};
		switch (this.options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				offset = 'offsetWidth';
		}
		
		this.full = this.element.measure(function(){ 
			this.half = this.knob[offset] / 2; 
			return this.element[offset] - this.knob[offset] + (this.options.offset * 2); 
		}.bind(this));
		
		this.min = $chk(this.options.range[0]) ? this.options.range[0] : 0;
		this.max = $chk(this.options.range[1]) ? this.options.range[1] : this.options.steps;
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / Math.abs(this.range) ;

		this.knob.setStyle('position', 'relative').setStyle(this.property, this.options.initialStep ? this.toPosition(this.options.initialStep) : - this.options.offset);
		modifiers[this.axis] = this.property;
		limit[this.axis] = [- this.options.offset, this.full - this.options.offset];

		var dragOptions = {
			snap: 0,
			limit: limit,
			modifiers: modifiers,
			onDrag: this.draggedKnob,
			onStart: this.draggedKnob,
			onBeforeStart: (function(){
				this.isDragging = true;
			}).bind(this),
			onCancel: function() {
				this.isDragging = false;
			}.bind(this),
			onComplete: function(){
				this.isDragging = false;
				this.draggedKnob();
				this.end();
			}.bind(this)
		};
		if (this.options.snap){
			dragOptions.grid = Math.ceil(this.stepWidth);
			dragOptions.limit[this.axis][1] = this.full;
		}

		this.drag = new Drag(this.knob, dragOptions);
		this.attach();
	},

	attach: function(){
		this.element.addEvent('mousedown', this.clickedElement);
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement);
		this.drag.attach();
		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown', this.clickedElement);
		this.element.removeEvent('mousewheel', this.scrolledElement);
		this.drag.detach();
		return this;
	},

	set: function(step){
		if (!((this.range > 0) ^ (step < this.min))) step = this.min;
		if (!((this.range > 0) ^ (step > this.max))) step = this.max;

		this.step = Math.round(step);
		this.checkStep();
		this.fireEvent('tick', this.toPosition(this.step));
		this.end();
		return this;
	},

	clickedElement: function(event){
		if (this.isDragging || event.target == this.knob) return;

		var dir = this.range < 0 ? -1 : 1;
		var position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
		position = position.limit(-this.options.offset, this.full -this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
		this.fireEvent('tick', position);
		this.end();
	},

	scrolledElement: function(event){
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(mode ? this.step - this.stepSize : this.step + this.stepSize);
		event.stop();
	},

	draggedKnob: function(){
		var dir = this.range < 0 ? -1 : 1;
		var position = this.drag.value.now[this.axis];
		position = position.limit(-this.options.offset, this.full -this.options.offset);
		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
	},

	checkStep: function(){
		if (this.previousChange != this.step){
			this.previousChange = this.step;
			this.fireEvent('change', this.step);
		}
	},

	end: function(){
		if (this.previousEnd !== this.step){
			this.previousEnd = this.step;
			this.fireEvent('complete', this.step + '');
		}
	},

	toStep: function(position){
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
	},

	toPosition: function(step){
		return (this.full * Math.abs(this.min - step)) / (this.steps * this.stepSize) - this.options.offset;
	}

});

/*
---

script: Sortables.js

description: Class for creating a drag and drop sorting interface for lists of items.

license: MIT-style license

authors:
- Tom Occhino

requires:
- /Drag.Move

provides: [Slider]

...
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onSort: $empty(element, clone),
		onStart: $empty(element, clone),
		onComplete: $empty(element),*/
		snap: 4,
		opacity: 1,
		clone: false,
		revert: false,
		handle: false,
		constrain: false
	},

	initialize: function(lists, options){
		this.setOptions(options);
		this.elements = [];
		this.lists = [];
		this.idle = true;

		this.addLists($$(document.id(lists) || lists));
		if (!this.options.clone) this.options.revert = false;
		if (this.options.revert) this.effect = new Fx.Morph(null, $merge({duration: 250, link: 'cancel'}, this.options.revert));
	},

	attach: function(){
		this.addLists(this.lists);
		return this;
	},

	detach: function(){
		this.lists = this.removeLists(this.lists);
		return this;
	},

	addItems: function(){
		Array.flatten(arguments).each(function(element){
			this.elements.push(element);
			var start = element.retrieve('sortables:start', this.start.bindWithEvent(this, element));
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
		}, this);
		return this;
	},

	addLists: function(){
		Array.flatten(arguments).each(function(list){
			this.lists.push(list);
			this.addItems(list.getChildren());
		}, this);
		return this;
	},

	removeItems: function(){
		return $$(Array.flatten(arguments).map(function(element){
			this.elements.erase(element);
			var start = element.retrieve('sortables:start');
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);
			
			return element;
		}, this));
	},

	removeLists: function(){
		return $$(Array.flatten(arguments).map(function(list){
			this.lists.erase(list);
			this.removeItems(list.getChildren());
			
			return list;
		}, this));
	},

	getClone: function(event, element){
		if (!this.options.clone) return new Element('div').inject(document.body);
		if ($type(this.options.clone) == 'function') return this.options.clone.call(this, event, element, this.list);
		var clone = element.clone(true).setStyles({
			margin: '0px',
			position: 'absolute',
			visibility: 'hidden',
			'width': element.getStyle('width')
		});
		//prevent the duplicated radio inputs from unchecking the real one
		if (clone.get('html').test('radio')) {
			clone.getElements('input[type=radio]').each(function(input, i) {
				input.set('name', 'clone_' + i);
			});
		}
		
		return clone.inject(this.list).setPosition(element.getPosition(element.getOffsetParent()));
	},

	getDroppables: function(){
		var droppables = this.list.getChildren();
		if (!this.options.constrain) droppables = this.lists.concat(droppables).erase(this.list);
		return droppables.erase(this.clone).erase(this.element);
	},

	insert: function(dragging, element){
		var where = 'inside';
		if (this.lists.contains(element)){
			this.list = element;
			this.drag.droppables = this.getDroppables();
		} else {
			where = this.element.getAllPrevious().contains(element) ? 'before' : 'after';
		}
		this.element.inject(element, where);
		this.fireEvent('sort', [this.element, this.clone]);
	},

	start: function(event, element){
		if (!this.idle) return;
		this.idle = false;
		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(event, element);

		this.drag = new Drag.Move(this.clone, {
			snap: this.options.snap,
			container: this.options.constrain && this.element.getParent(),
			droppables: this.getDroppables(),
			onSnap: function(){
				event.stop();
				this.clone.setStyle('visibility', 'visible');
				this.element.set('opacity', this.options.opacity || 0);
				this.fireEvent('start', [this.element, this.clone]);
			}.bind(this),
			onEnter: this.insert.bind(this),
			onCancel: this.reset.bind(this),
			onComplete: this.end.bind(this)
		});

		this.clone.inject(this.element, 'before');
		this.drag.start(event);
	},

	end: function(){
		this.drag.detach();
		this.element.set('opacity', this.opacity);
		if (this.effect){
			var dim = this.element.getStyles('width', 'height');
			var pos = this.clone.computePosition(this.element.getPosition(this.clone.offsetParent));
			this.effect.element = this.clone;
			this.effect.start({
				top: pos.top,
				left: pos.left,
				width: dim.width,
				height: dim.height,
				opacity: 0.25
			}).chain(this.reset.bind(this));
		} else {
			this.reset();
		}
	},

	reset: function(){
		this.idle = true;
		this.clone.destroy();
		this.fireEvent('complete', this.element);
	},

	serialize: function(){
		var params = Array.link(arguments, {modifier: Function.type, index: $defined});
		var serial = this.lists.map(function(list){
			return list.getChildren().map(params.modifier || function(element){
				return element.get('id');
			}, this);
		}, this);

		var index = params.index;
		if (this.lists.length == 1) index = 0;
		return $chk(index) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});


/*
---

script: Request.JSONP.js

description: Defines Request.JSONP, a class for cross domain javascript via script injection.

license: MIT-style license

authors:
- Aaron Newton
- Guillermo Rauch

requires:
- core:1.2.4/Element
- core:1.2.4/Request
- /Log

provides: [Request.JSONP]

...
*/

Request.JSONP = new Class({

	Implements: [Chain, Events, Options, Log],

	options: {/*
		onRetry: $empty(intRetries),
		onRequest: $empty(scriptElement),
		onComplete: $empty(data),
		onSuccess: $empty(data),
		onCancel: $empty(),
		log: false,
		*/
		url: '',
		data: {},
		retries: 0,
		timeout: 0,
		link: 'ignore',
		callbackKey: 'callback',
		injectScript: document.head
	},

	initialize: function(options){
		this.setOptions(options);
		if (this.options.log) this.enableLog();
		this.running = false;
		this.requests = 0;
		this.triesRemaining = [];
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	send: function(options){
		if (!$chk(arguments[1]) && !this.check(options)) return this;

		var type = $type(options), 
				old = this.options, 
				index = $chk(arguments[1]) ? arguments[1] : this.requests++;
		if (type == 'string' || type == 'element') options = {data: options};

		options = $extend({data: old.data, url: old.url}, options);

		if (!$chk(this.triesRemaining[index])) this.triesRemaining[index] = this.options.retries;
		var remaining = this.triesRemaining[index];

		(function(){
			var script = this.getScript(options);
			this.log('JSONP retrieving script with url: ' + script.get('src'));
			this.fireEvent('request', script);
			this.running = true;

			(function(){
				if (remaining){
					this.triesRemaining[index] = remaining - 1;
					if (script){
						script.destroy();
						this.send(options, index).fireEvent('retry', this.triesRemaining[index]);
					}
				} else if(script && this.options.timeout){
					script.destroy();
					this.cancel().fireEvent('failure');
				}
			}).delay(this.options.timeout, this);
		}).delay(Browser.Engine.trident ? 50 : 0, this);
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.fireEvent('cancel');
		return this;
	},

	getScript: function(options){
		var index = Request.JSONP.counter,
				data;
		Request.JSONP.counter++;

		switch ($type(options.data)){
			case 'element': data = document.id(options.data).toQueryString(); break;
			case 'object': case 'hash': data = Hash.toQueryString(options.data);
		}

		var src = options.url + 
			 (options.url.test('\\?') ? '&' :'?') + 
			 (options.callbackKey || this.options.callbackKey) + 
			 '=Request.JSONP.request_map.request_'+ index + 
			 (data ? '&' + data : '');
		if (src.length > 2083) this.log('JSONP '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');

		var script = new Element('script', {type: 'text/javascript', src: src});
		Request.JSONP.request_map['request_' + index] = function(){ this.success(arguments, script); }.bind(this);
		return script.inject(this.options.injectScript);
	},

	success: function(args, script){
		if (script) script.destroy();
		this.running = false;
		this.log('JSONP successfully retrieved: ', args);
		this.fireEvent('complete', args).fireEvent('success', args).callChain();
	}

});

Request.JSONP.counter = 0;
Request.JSONP.request_map = {};

/*
---

script: Request.Queue.js

description: Controls several instances of Request and its variants to run only one request at a time.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element
- core:1.2.4/Request
- /Log

provides: [Request.Queue]

...
*/

Request.Queue = new Class({

	Implements: [Options, Events],

	Binds: ['attach', 'request', 'complete', 'cancel', 'success', 'failure', 'exception'],

	options: {/*
		onRequest: $empty(argsPassedToOnRequest),
		onSuccess: $empty(argsPassedToOnSuccess),
		onComplete: $empty(argsPassedToOnComplete),
		onCancel: $empty(argsPassedToOnCancel),
		onException: $empty(argsPassedToOnException),
		onFailure: $empty(argsPassedToOnFailure),
		onEnd: $empty,
		*/
		stopOnFailure: true,
		autoAdvance: true,
		concurrent: 1,
		requests: {}
	},

	initialize: function(options){
		if(options){
			var requests = options.requests;
			delete options.requests;	
		}
		this.setOptions(options);
		this.requests = new Hash;
		this.queue = [];
		this.reqBinders = {};
		
		if(requests) this.addRequests(requests);
	},

	addRequest: function(name, request){
		this.requests.set(name, request);
		this.attach(name, request);
		return this;
	},

	addRequests: function(obj){
		$each(obj, function(req, name){
			this.addRequest(name, req);
		}, this);
		return this;
	},

	getName: function(req){
		return this.requests.keyOf(req);
	},

	attach: function(name, req){
		if (req._groupSend) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			if(!this.reqBinders[name]) this.reqBinders[name] = {};
			this.reqBinders[name][evt] = function(){
				this['on' + evt.capitalize()].apply(this, [name, req].extend(arguments));
			}.bind(this);
			req.addEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req._groupSend = req.send;
		req.send = function(options){
			this.send(name, options);
			return req;
		}.bind(this);
		return this;
	},

	removeRequest: function(req){
		var name = $type(req) == 'object' ? this.getName(req) : req;
		if (!name && $type(name) != 'string') return this;
		req = this.requests.get(name);
		if (!req) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			req.removeEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req.send = req._groupSend;
		delete req._groupSend;
		return this;
	},

	getRunning: function(){
		return this.requests.filter(function(r){
			return r.running;
		});
	},

	isRunning: function(){
		return !!(this.getRunning().getKeys().length);
	},

	send: function(name, options){
		var q = function(){
			this.requests.get(name)._groupSend(options);
			this.queue.erase(q);
		}.bind(this);
		q.name = name;
		if (this.getRunning().getKeys().length >= this.options.concurrent || (this.error && this.options.stopOnFailure)) this.queue.push(q);
		else q();
		return this;
	},

	hasNext: function(name){
		return (!name) ? !!this.queue.length : !!this.queue.filter(function(q){ return q.name == name; }).length;
	},

	resume: function(){
		this.error = false;
		(this.options.concurrent - this.getRunning().getKeys().length).times(this.runNext, this);
		return this;
	},

	runNext: function(name){
		if (!this.queue.length) return this;
		if (!name){
			this.queue[0]();
		} else {
			var found;
			this.queue.each(function(q){
				if (!found && q.name == name){
					found = true;
					q();
				}
			});
		}
		return this;
	},

	runAll: function() {
		this.queue.each(function(q) {
			q();
		});
		return this;
	},

	clear: function(name){
		if (!name){
			this.queue.empty();
		} else {
			this.queue = this.queue.map(function(q){
				if (q.name != name) return q;
				else return false;
			}).filter(function(q){ return q; });
		}
		return this;
	},

	cancel: function(name){
		this.requests.get(name).cancel();
		return this;
	},

	onRequest: function(){
		this.fireEvent('request', arguments);
	},

	onComplete: function(){
		this.fireEvent('complete', arguments);
		if (!this.queue.length) this.fireEvent('end');
	},

	onCancel: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('cancel', arguments);
	},

	onSuccess: function(){
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('success', arguments);
	},

	onFailure: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('failure', arguments);
	},

	onException: function(){
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('exception', arguments);
	}

});


/*
---

script: Request.Periodical.js

description: Requests the same URL to pull data from a server but increases the intervals if no data is returned to reduce the load

license: MIT-style license

authors:
- Christoph Pojer

requires:
- core:1.2.4/Request
- /MooTools.More

provides: [Request.Periodical]

...
*/

Request.implement({

	options: {
		initialDelay: 5000,
		delay: 5000,
		limit: 60000
	},

	startTimer: function(data){
		var fn = function(){
			if (!this.running) this.send({data: data});
		};
		this.timer = fn.delay(this.options.initialDelay, this);
		this.lastDelay = this.options.initialDelay;
		this.completeCheck = function(response){
			$clear(this.timer);
			this.lastDelay = (response) ? this.options.delay : (this.lastDelay + this.options.delay).min(this.options.limit);
			this.timer = fn.delay(this.lastDelay, this);
		};
		return this.addEvent('complete', this.completeCheck);
	},

	stopTimer: function(){
		$clear(this.timer);
		return this.removeEvent('complete', this.completeCheck);
	}

});

/*
---

script: Assets.js

description: Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Element.Event
- /MooTools.More

provides: [Assets]

...
*/

var Asset = {

	javascript: function(source, properties){
		properties = $extend({
			onload: $empty,
			document: document,
			check: $lambda(true)
		}, properties);
		
		if (properties.onLoad) properties.onload = properties.onLoad;
		
		var script = new Element('script', {src: source, type: 'text/javascript'});

		var load = properties.onload.bind(script), 
			check = properties.check, 
			doc = properties.document;
		delete properties.onload;
		delete properties.check;
		delete properties.document;

		script.addEvents({
			load: load,
			readystatechange: function(){
				if (['loaded', 'complete'].contains(this.readyState)) load();
			}
		}).set(properties);

		if (Browser.Engine.webkit419) var checker = (function(){
			if (!$try(check)) return;
			$clear(checker);
			load();
		}).periodical(50);

		return script.inject(doc.head);
	},

	css: function(source, properties){
		return new Element('link', $merge({
			rel: 'stylesheet',
			media: 'screen',
			type: 'text/css',
			href: source
		}, properties)).inject(document.head);
	},

	image: function(source, properties){
		properties = $merge({
			onload: $empty,
			onabort: $empty,
			onerror: $empty
		}, properties);
		var image = new Image();
		var element = document.id(image) || new Element('img');
		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name;
			var cap = name.capitalize();
			if (properties['on' + cap]) properties[type] = properties['on' + cap];
			var event = properties[type];
			delete properties[type];
			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images: function(sources, options){
		options = $merge({
			onComplete: $empty,
			onProgress: $empty,
			onError: $empty,
			properties: {}
		}, options);
		sources = $splat(sources);
		var images = [];
		var counter = 0;
		return new Elements(sources.map(function(source){
			return Asset.image(source, $extend(options.properties, {
				onload: function(){
					options.onProgress.call(this, counter, sources.indexOf(source));
					counter++;
					if (counter == sources.length) options.onComplete();
				},
				onerror: function(){
					options.onError.call(this, counter, sources.indexOf(source));
					counter++;
					if (counter == sources.length) options.onComplete();
				}
			}));
		}));
	}

};

/*
---

script: Color.js

description: Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Array
- core:1.2.4/String
- core:1.2.4/Number
- core:1.2.4/Hash
- core:1.2.4/Function
- core:1.2.4/$util

provides: [Color]

...
*/

var Color = new Native({

	initialize: function(color, type){
    if(color ==  "#NaNNaNNaN" || !color) {
      color = "#000000";
    }

		if (arguments.length >= 3){
			type = 'rgb'; color = Array.slice(arguments, 0, 3);
		} else if (typeof color == 'string'){
			if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
			else if (color.match(/hsb/)) color = color.hsbToRgb();
			else color = color.hexToRgb(true);
		}
		type = type || 'rgb';
		switch (type){
			case 'hsb':
				var old = color;
				color = color.hsbToRgb();
				color.hsb = old;
			break;
			case 'hex': color = color.hexToRgb(true); break;
		}

		color.rgb = color.slice(0, 3);
		color.hsb = color.hsb || color.rgbToHsb();
		color.hex = color.rgbToHex();
		return $extend(color, this);
	}

});

Color.implement({

	mix: function(){
		var colors = Array.slice(arguments);
		var alpha = ($type(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

var $RGB = function(r, g, b){
	return new Color([r, g, b], 'rgb');
};

var $HSB = function(h, s, b){
	return new Color([h, s, b], 'hsb');
};

var $HEX = function(hex){
	return new Color(hex, 'hex');
};

Array.implement({

	rgbToHsb: function(){
		var red = this[0],
				green = this[1],
				blue = this[2],
				hue = 0;
		var max = Math.max(red, green, blue),
				min = Math.min(red, green, blue);
		var delta = max - min;
		var brightness = max / 255,
				saturation = (max != 0) ? delta / max : 0;
		if(saturation != 0) {
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});

String.implement({

	rgbToHsb: function(){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHsb() : null;
	},

	hsbToRgb: function(){
		var hsb = this.match(/\d{1,3}/g);
		return (hsb) ? hsb.hsbToRgb() : null;
	}

});


/*
---

script: Group.js

description: Class for monitoring collections of events

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Events
- /MooTools.More

provides: [Group]

...
*/

var Group = new Class({

	initialize: function(){
		this.instances = Array.flatten(arguments);
		this.events = {};
		this.checker = {};
	},

	addEvent: function(type, fn){
		this.checker[type] = this.checker[type] || {};
		this.events[type] = this.events[type] || [];
		if (this.events[type].contains(fn)) return false;
		else this.events[type].push(fn);
		this.instances.each(function(instance, i){
			instance.addEvent(type, this.check.bind(this, [type, instance, i]));
		}, this);
		return this;
	},

	check: function(type, instance, i){
		this.checker[type][i] = true;
		var every = this.instances.every(function(current, j){
			return this.checker[type][j] || false;
		}, this);
		if (!every) return;
		this.checker[type] = {};
		this.events[type].each(function(event){
			event.call(this, this.instances, instance);
		}, this);
	}

});


/*
---

script: Hash.Cookie.js

description: Class for creating, reading, and deleting Cookies in JSON format.

license: MIT-style license

authors:
- Valerio Proietti
- Aaron Newton

requires:
- core:1.2.4/Cookie
- core:1.2.4/JSON
- /MooTools.More

provides: [Hash.Cookie]

...
*/

Hash.Cookie = new Class({

	Extends: Cookie,

	options: {
		autoSave: true
	},

	initialize: function(name, options){
		this.parent(name, options);
		this.load();
	},

	save: function(){
		var value = JSON.encode(this.hash);
		if (!value || value.length > 4096) return false; //cookie would be truncated!
		if (value == '{}') this.dispose();
		else this.write(value);
		return true;
	},

	load: function(){
		this.hash = new Hash(JSON.decode(this.read(), true));
		return this;
	}

});

Hash.each(Hash.prototype, function(method, name){
	if (typeof method == 'function') Hash.Cookie.implement(name, function(){
		var value = method.apply(this.hash, arguments);
		if (this.options.autoSave) this.save();
		return value;
	});
});

/*
---

script: IframeShim.js

description: Defines IframeShim, a class for obscuring select lists and flash objects in IE.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Element.Event
- core:1.2.4/Element.Style
- core:1.2.4/Options Events
- /Element.Position
- /Class.Occlude

provides: [IframeShim]

...
*/

var IframeShim = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		className: 'iframeShim',
		src: 'javascript:false;document.write("");',
		display: false,
		zIndex: null,
		margin: 0,
		offset: {x: 0, y: 0},
		browsers: (Browser.Engine.trident4 || (Browser.Engine.gecko && !Browser.Engine.gecko19 && Browser.Platform.mac))
	},

	property: 'IframeShim',

	initialize: function(element, options){
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.makeShim();
		return this;
	},

	makeShim: function(){
		if(this.options.browsers){
			var zIndex = this.element.getStyle('zIndex').toInt();

			if (!zIndex){
				zIndex = 1;
				var pos = this.element.getStyle('position');
				if (pos == 'static' || !pos) this.element.setStyle('position', 'relative');
				this.element.setStyle('zIndex', zIndex);
			}
			zIndex = ($chk(this.options.zIndex) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
			if (zIndex < 0) zIndex = 1;
			this.shim = new Element('iframe', {
				src: this.options.src,
				scrolling: 'no',
				frameborder: 0,
				styles: {
					zIndex: zIndex,
					position: 'absolute',
					border: 'none',
					filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
				},
				'class': this.options.className
			}).store('IframeShim', this);
			var inject = (function(){
				this.shim.inject(this.element, 'after');
				this[this.options.display ? 'show' : 'hide']();
				this.fireEvent('inject');
			}).bind(this);
			if (!IframeShim.ready) window.addEvent('load', inject);
			else inject();
		} else {
			this.position = this.hide = this.show = this.dispose = $lambda(this);
		}
	},

	position: function(){
		if (!IframeShim.ready || !this.shim) return this;
		var size = this.element.measure(function(){ 
			return this.getSize(); 
		});
		if (this.options.margin != undefined){
			size.x = size.x - (this.options.margin * 2);
			size.y = size.y - (this.options.margin * 2);
			this.options.offset.x += this.options.margin;
			this.options.offset.y += this.options.margin;
		}
		this.shim.set({width: size.x, height: size.y}).position({
			relativeTo: this.element,
			offset: this.options.offset
		});
		return this;
	},

	hide: function(){
		if (this.shim) this.shim.setStyle('display', 'none');
		return this;
	},

	show: function(){
		if (this.shim) this.shim.setStyle('display', 'block');
		return this.position();
	},

	dispose: function(){
		if (this.shim) this.shim.dispose();
		return this;
	},

	destroy: function(){
		if (this.shim) this.shim.destroy();
		return this;
	}

});

window.addEvent('load', function(){
	IframeShim.ready = true;
});

/*
---

script: Keyboard.js

description: KeyboardEvents used to intercept events on a class for keyboard and format modifiers in a specific order so as to make alt+shift+c the same as shift+alt+c.

license: MIT-style license

authors:
- Perrin Westrich
- Aaron Newton
- Scott Kyle

requires:
- core:1.2.4/Events
- core:1.2.4/Options
- core:1.2.4/Element.Event
- /Log

provides: [Keyboard]

...
*/

(function(){
	
	var Keyboard = this.Keyboard = new Class({

		Extends: Events,

		Implements: [Options, Log],

		options: {
			/*
			onActivate: $empty,
			onDeactivate: $empty,
			*/
			defaultEventType: 'keydown',
			active: false,
			events: {},
			nonParsedEvents: ['activate', 'deactivate', 'onactivate', 'ondeactivate', 'changed', 'onchanged']
		},

		initialize: function(options){
			this.setOptions(options);
			this.setup();
		}, 
		setup: function(){
			this.addEvents(this.options.events);
			//if this is the root manager, nothing manages it
			if (Keyboard.manager && !this.manager) Keyboard.manager.manage(this);
			if (this.options.active) this.activate();
		},

		handle: function(event, type){
			//Keyboard.stop(event) prevents key propagation
			if (event.preventKeyboardPropagation) return;
			
			var bubbles = !!this.manager;
			if (bubbles && this.activeKB){
				this.activeKB.handle(event, type);
				if (event.preventKeyboardPropagation) return;
			}
			this.fireEvent(type, event);
			
			if (!bubbles && this.activeKB) this.activeKB.handle(event, type);
		},

		addEvent: function(type, fn, internal){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
		},

		removeEvent: function(type, fn){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
		},

		toggleActive: function(){
			return this[this.active ? 'deactivate' : 'activate']();
		},

		activate: function(instance){
			if (instance) {
				//if we're stealing focus, store the last keyboard to have it so the relenquish command works
				if (instance != this.activeKB) this.previous = this.activeKB;
				//if we're enabling a child, assign it so that events are now passed to it
				this.activeKB = instance.fireEvent('activate');
				Keyboard.manager.fireEvent('changed');
			} else if (this.manager) {
				//else we're enabling ourselves, we must ask our parent to do it for us
				this.manager.activate(this);
			}
			return this;
		},

		deactivate: function(instance){
			if (instance) {
				if(instance === this.activeKB) {
					this.activeKB = null;
					instance.fireEvent('deactivate');
					Keyboard.manager.fireEvent('changed');
				}
			}
			else if (this.manager) {
				this.manager.deactivate(this);
			}
			return this;
		},

		relenquish: function(){
			if (this.previous) this.activate(this.previous);
		},

		//management logic
		manage: function(instance){
			if (instance.manager) instance.manager.drop(instance);
			this.instances.push(instance);
			instance.manager = this;
			if (!this.activeKB) this.activate(instance);
			else this._disable(instance);
		},

		_disable: function(instance){
			if (this.activeKB == instance) this.activeKB = null;
		},

		drop: function(instance){
			this._disable(instance);
			this.instances.erase(instance);
		},

		instances: [],

		trace: function(){
			Keyboard.trace(this);
		},

		each: function(fn){
			Keyboard.each(this, fn);
		}

	});
	
	var parsed = {};
	var modifiers = ['shift', 'control', 'alt', 'meta'];
	var regex = /^(?:shift|control|ctrl|alt|meta)$/;
	
	Keyboard.parse = function(type, eventType, ignore){
		if (ignore && ignore.contains(type.toLowerCase())) return type;
		
		type = type.toLowerCase().replace(/^(keyup|keydown):/, function($0, $1){
			eventType = $1;
			return '';
		});

		if (!parsed[type]){
			var key, mods = {};
			type.split('+').each(function(part){
				if (regex.test(part)) mods[part] = true;
				else key = part;
			});

			mods.control = mods.control || mods.ctrl; // allow both control and ctrl
			
			var keys = [];
			modifiers.each(function(mod){
				if (mods[mod]) keys.push(mod);
			});
			
			if (key) keys.push(key);
			parsed[type] = keys.join('+');
		}

		return eventType + ':' + parsed[type];
	};

	Keyboard.each = function(keyboard, fn){
		var current = keyboard || Keyboard.manager;
		while (current){
			fn.run(current);
			current = current.activeKB;
		}
	};

	Keyboard.stop = function(event){
		event.preventKeyboardPropagation = true;
	};

	Keyboard.manager = new Keyboard({
		active: true
	});
	
	Keyboard.trace = function(keyboard){
		keyboard = keyboard || Keyboard.manager;
		keyboard.enableLog();
		keyboard.log('the following items have focus: ');
		Keyboard.each(keyboard, function(current){
			keyboard.log(document.id(current.widget) || current.wiget || current);
		});
	};
	
	var handler = function(event){
		var keys = [];
		modifiers.each(function(mod){
			if (event[mod]) keys.push(mod);
		});
		
		if (!regex.test(event.key)) keys.push(event.key);
		Keyboard.manager.handle(event, event.type + ':' + keys.join('+'));
	};
	
	document.addEvents({
		'keyup': handler,
		'keydown': handler
	});

	Event.Keys.extend({
		'shift': 16,
		'control': 17,
		'alt': 18,
		'capslock': 20,
		'pageup': 33,
		'pagedown': 34,
		'end': 35,
		'home': 36,
		'numlock': 144,
		'scrolllock': 145,
		';': 186,
		'=': 187,
		',': 188,
		'-': Browser.Engine.Gecko ? 109 : 189,
		'.': 190,
		'/': 191,
		'`': 192,
		'[': 219,
		'\\': 220,
		']': 221,
		"'": 222
	});

})();


/*
---

script: Keyboard.js

description: Enhances Keyboard by adding the ability to name and describe keyboard shortcuts, and the ability to grab shortcuts by name and bind the shortcut to different keys.

license: MIT-style license

authors:
- Perrin Westrich

requires:
- core:1.2.4/Function
- /Keyboard.Extras

provides: [Keyboard.Extras]

...
*/
Keyboard.prototype.options.nonParsedEvents.combine(['rebound', 'onrebound']);

Keyboard.implement({

	/*
		shortcut should be in the format of:
		{
			'keys': 'shift+s', // the default to add as an event.
			'description': 'blah blah blah', // a brief description of the functionality.
			'handler': function(){} // the event handler to run when keys are pressed.
		}
	*/
	addShortcut: function(name, shortcut) {
		this.shortcuts = this.shortcuts || [];
		this.shortcutIndex = this.shortcutIndex || {};
		
		shortcut.getKeyboard = $lambda(this);
		shortcut.name = name;
		this.shortcutIndex[name] = shortcut;
		this.shortcuts.push(shortcut);
		if(shortcut.keys) this.addEvent(shortcut.keys, shortcut.handler);
		return this;
	},

	addShortcuts: function(obj){
		for(var name in obj) this.addShortcut(name, obj[name]);
		return this;
	},

	getShortcuts: function(){
		return this.shortcuts || [];
	},

	getShortcut: function(name){
		return (this.shortcutIndex || {})[name];
	}

});

Keyboard.rebind = function(newKeys, shortcuts){
	$splat(shortcuts).each(function(shortcut){
		shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler);
		shortcut.getKeyboard().addEvent(newKeys, shortcut.handler);
		shortcut.keys = newKeys;
		shortcut.getKeyboard().fireEvent('rebound');
	});
};


Keyboard.getActiveShortcuts = function(keyboard) {
	var activeKBS = [], activeSCS = [];
	Keyboard.each(keyboard, [].push.bind(activeKBS));
	activeKBS.each(function(kb){ activeSCS.extend(kb.getShortcuts()); });
	return activeSCS;
};

Keyboard.getShortcut = function(name, keyboard, opts){
	opts = opts || {};
	var shortcuts = opts.many ? [] : null,
		set = opts.many ? function(kb){
				var shortcut = kb.getShortcut(name);
				if(shortcut) shortcuts.push(shortcut);
			} : function(kb) { 
				if(!shortcuts) shortcuts = kb.getShortcut(name);
			};
	Keyboard.each(keyboard, set);
	return shortcuts;
};

Keyboard.getShortcuts = function(name, keyboard) {
	return Keyboard.getShortcut(name, keyboard, { many: true });
};


/*
---

script: Mask.js

description: Creates a mask element to cover another.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Options
- core:1.2.4/Events
- core:1.2.4/Element.Event
- /Class.Binds
- /Element.Position
- /IframeShim

provides: [Mask]

...
*/

var Mask = new Class({

	Implements: [Options, Events],

	Binds: ['position'],

	options: {
		// onShow: $empty,
		// onHide: $empty,
		// onDestroy: $empty,
		// onClick: $empty,
		//inject: {
		//  where: 'after',
		//  target: null,
		//},
		// hideOnClick: false,
		// id: null,
		// destroyOnHide: false,
		style: {},
		'class': 'mask',
		maskMargins: false,
		useIframeShim: true,
		iframeShimOptions: {}
	},

	initialize: function(target, options){
		this.target = document.id(target) || document.id(document.body);
		this.target.store('Mask', this);
		this.setOptions(options);
		this.render();
		this.inject();
	},
	
	render: function() {
		this.element = new Element('div', {
			'class': this.options['class'],
			id: this.options.id || 'mask-' + $time(),
			styles: $merge(this.options.style, {
				display: 'none'
			}),
			events: {
				click: function(){
					this.fireEvent('click');
					if (this.options.hideOnClick) this.hide();
				}.bind(this)
			}
		});
		this.hidden = true;
	},

	toElement: function(){
		return this.element;
	},

	inject: function(target, where){
		where = where || this.options.inject ? this.options.inject.where : '' || this.target == document.body ? 'inside' : 'after';
		target = target || this.options.inject ? this.options.inject.target : '' || this.target;
		this.element.inject(target, where);
		if (this.options.useIframeShim) {
			this.shim = new IframeShim(this.element, this.options.iframeShimOptions);
			this.addEvents({
				show: this.shim.show.bind(this.shim),
				hide: this.shim.hide.bind(this.shim),
				destroy: this.shim.destroy.bind(this.shim)
			});
		}
	},

	position: function(){
		this.resize(this.options.width, this.options.height);
		this.element.position({
			relativeTo: this.target,
			position: 'topLeft',
			ignoreMargins: !this.options.maskMargins,
			ignoreScroll: this.target == document.body
		});
		return this;
	},

	resize: function(x, y){
		var opt = {
			styles: ['padding', 'border']
		};
		if (this.options.maskMargins) opt.styles.push('margin');
		var dim = this.target.getComputedSize(opt);
		if (this.target == document.body) {
			var win = window.getSize();
			if (dim.totalHeight < win.y) dim.totalHeight = win.y;
			if (dim.totalWidth < win.x) dim.totalWidth = win.x;
		}
		this.element.setStyles({
			width: $pick(x, dim.totalWidth, dim.x),
			height: $pick(y, dim.totalHeight, dim.y)
		});
		return this;
	},

	show: function(){
		if (!this.hidden) return this;
		window.addEvent('resize', this.position);
		this.position();
		this.showMask.apply(this, arguments);
		return this;
	},

	showMask: function(){
		this.element.setStyle('display', 'block');
		this.hidden = false;
		this.fireEvent('show');
	},

	hide: function(){
		if (this.hidden) return this;
		window.removeEvent('resize', this.position);
		this.hideMask.apply(this, arguments);
		if (this.options.destroyOnHide) return this.destroy();
		return this;
	},

	hideMask: function(){
		this.element.setStyle('display', 'none');
		this.hidden = true;
		this.fireEvent('hide');
	},

	toggle: function(){
		this[this.hidden ? 'show' : 'hide']();
	},

	destroy: function(){
		this.hide();
		this.element.destroy();
		this.fireEvent('destroy');
		this.target.eliminate('mask');
	}

});

Element.Properties.mask = {

	set: function(options){
		var mask = this.retrieve('mask');
		return this.eliminate('mask').store('mask:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('mask')){
			if (this.retrieve('mask')) this.retrieve('mask').destroy();
			if (options || !this.retrieve('mask:options')) this.set('mask', options);
			this.store('mask', new Mask(this, this.retrieve('mask:options')));
		}
		return this.retrieve('mask');
	}

};

Element.implement({

	mask: function(options){
		this.get('mask', options).show();
		return this;
	},

	unmask: function(){
		this.get('mask').hide();
		return this;
	}

});

/*
---

script: Scroller.js

description: Class which scrolls the contents of any Element (including the window) when the mouse reaches the Element's boundaries.

license: MIT-style license

authors:
- Valerio Proietti

requires:
- core:1.2.4/Events
- core:1.2.4/Options
- core:1.2.4/Element.Event
- core:1.2.4/Element.Dimensions

provides: [Scroller]

...
*/

var Scroller = new Class({

	Implements: [Events, Options],

	options: {
		area: 20,
		velocity: 1,
		onChange: function(x, y){
			this.element.scrollTo(x, y);
		},
		fps: 50
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.docBody = document.id(this.element.getDocument().body);
		this.listener = ($type(this.element) != 'element') ?  this.docBody : this.element;
		this.timer = null;
		this.bound = {
			attach: this.attach.bind(this),
			detach: this.detach.bind(this),
			getCoords: this.getCoords.bind(this)
		};
	},

	start: function(){
		this.listener.addEvents({
			mouseover: this.bound.attach,
			mouseout: this.bound.detach
		});
	},

	stop: function(){
		this.listener.removeEvents({
			mouseover: this.bound.attach,
			mouseout: this.bound.detach
		});
		this.detach();
		this.timer = $clear(this.timer);
	},

	attach: function(){
		this.listener.addEvent('mousemove', this.bound.getCoords);
	},

	detach: function(){
		this.listener.removeEvent('mousemove', this.bound.getCoords);
		this.timer = $clear(this.timer);
	},

	getCoords: function(event){
		this.page = (this.listener.get('tag') == 'body') ? event.client : event.page;
		if (!this.timer) this.timer = this.scroll.periodical(Math.round(1000 / this.options.fps), this);
	},

	scroll: function(){
		var size = this.element.getSize(), 
			scroll = this.element.getScroll(), 
			pos = this.element != this.docBody ? this.element.getOffsets() : {x: 0, y:0}, 
			scrollSize = this.element.getScrollSize(), 
			change = {x: 0, y: 0};
		for (var z in this.page){
			if (this.page[z] < (this.options.area + pos[z]) && scroll[z] != 0) {
				change[z] = (this.page[z] - this.options.area - pos[z]) * this.options.velocity;
			} else if (this.page[z] + this.options.area > (size[z] + pos[z]) && scroll[z] + size[z] != scrollSize[z]) {
				change[z] = (this.page[z] - size[z] + this.options.area - pos[z]) * this.options.velocity;
			}
		}
		if (change.y || change.x) this.fireEvent('change', [scroll.x + change.x, scroll.y + change.y]);
	}

});

/*
---

script: Tips.js

description: Class for creating nice tips that follow the mouse cursor when hovering an element.

license: MIT-style license

authors:
- Valerio Proietti
- Christoph Pojer

requires:
- core:1.2.4/Options
- core:1.2.4/Events
- core:1.2.4/Element.Event
- core:1.2.4/Element.Style
- core:1.2.4/Element.Dimensions
- /MooTools.More

provides: [Tips]

...
*/

(function(){

var read = function(option, element){
	return (option) ? ($type(option) == 'function' ? option(element) : element.get(option)) : '';
};

this.Tips = new Class({

	Implements: [Events, Options],

	options: {
		/*
		onAttach: $empty(element),
		onDetach: $empty(element),
		*/
		onShow: function(){
			this.tip.setStyle('display', 'block');
		},
		onHide: function(){
			this.tip.setStyle('display', 'none');
		},
		title: 'title',
		text: function(element){
			return element.get('rel') || element.get('href');
		},
		showDelay: 100,
		hideDelay: 100,
		className: 'tip-wrap',
		offset: {x: 16, y: 16},
		windowPadding: {x:0, y:0},
		fixed: false
	},

	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		if (params.elements) this.attach(params.elements);
		this.container = new Element('div', {'class': 'tip'});
	},

	toElement: function(){
		if (this.tip) return this.tip;

		return this.tip = new Element('div', {
			'class': this.options.className,
			styles: {
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).adopt(
			new Element('div', {'class': 'tip-top'}),
			this.container,
			new Element('div', {'class': 'tip-bottom'})
		).inject(document.body);
	},

	attach: function(elements){
		$$(elements).each(function(element){
			var title = read(this.options.title, element),
				text = read(this.options.text, element);
			
			element.erase('title').store('tip:native', title).retrieve('tip:title', title);
			element.retrieve('tip:text', text);
			this.fireEvent('attach', [element]);
			
			var events = ['enter', 'leave'];
			if (!this.options.fixed) events.push('move');
			
			events.each(function(value){
				var event = element.retrieve('tip:' + value);
				if (!event) event = this['element' + value.capitalize()].bindWithEvent(this, element);
				
				element.store('tip:' + value, event).addEvent('mouse' + value, event);
			}, this);
		}, this);
		
		return this;
	},

	detach: function(elements){
		$$(elements).each(function(element){
			['enter', 'leave', 'move'].each(function(value){
				element.removeEvent('mouse' + value, element.retrieve('tip:' + value)).eliminate('tip:' + value);
			});
			
			this.fireEvent('detach', [element]);
			
			if (this.options.title == 'title'){ // This is necessary to check if we can revert the title
				var original = element.retrieve('tip:native');
				if (original) element.set('title', original);
			}
		}, this);
		
		return this;
	},

	elementEnter: function(event, element){
		this.container.empty();
		
		['title', 'text'].each(function(value){
			var content = element.retrieve('tip:' + value);
			if (content) this.fill(new Element('div', {'class': 'tip-' + value}).inject(this.container), content);
		}, this);
		
		$clear(this.timer);
		this.timer = (function(){
			this.show(this, element);
			this.position((this.options.fixed) ? {page: element.getPosition()} : event);
		}).delay(this.options.showDelay, this);
	},

	elementLeave: function(event, element){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this, element);
		this.fireForParent(event, element);
	},

	fireForParent: function(event, element){
		element = element.getParent();
		if (!element || element == document.body) return;
		if (element.retrieve('tip:enter')) element.fireEvent('mouseenter', event);
		else this.fireForParent(event, element);
	},

	elementMove: function(event, element){
		this.position(event);
	},

	position: function(event){
		if (!this.tip) document.id(this);

		var size = window.getSize(), scroll = window.getScroll(),
			tip = {x: this.tip.offsetWidth, y: this.tip.offsetHeight},
			props = {x: 'left', y: 'top'},
			obj = {};
		
		for (var z in props){
			obj[props[z]] = event.page[z] + this.options.offset[z];
			if ((obj[props[z]] + tip[z] - scroll[z]) > size[z] - this.options.windowPadding[z]) obj[props[z]] = event.page[z] - this.options.offset[z] - tip[z];
		}
		
		this.tip.setStyles(obj);
	},

	fill: function(element, contents){
		if(typeof contents == 'string') element.set('html', contents);
		else element.adopt(contents);
	},

	show: function(element){
		if (!this.tip) document.id(this);
		this.fireEvent('show', [this.tip, element]);
	},

	hide: function(element){
		if (!this.tip) document.id(this);
		this.fireEvent('hide', [this.tip, element]);
	}

});

})();

/*
---

script: Spinner.js

description: Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

license: MIT-style license

authors:
- Aaron Newton

requires:
- core:1.2.4/Fx.Tween
- /Class.refactor
- /Mask

provides: [Spinner]

...
*/

var Spinner = new Class({

	Extends: Mask,

	options: {
		/*message: false,*/
		'class':'spinner',
		containerPosition: {},
		content: {
			'class':'spinner-content'
		},
		messageContainer: {
			'class':'spinner-msg'
		},
		img: {
			'class':'spinner-img'
		},
		fxOptions: {
			link: 'chain'
		}
	},

	initialize: function(){
		this.parent.apply(this, arguments);
		this.target.store('spinner', this);

		//add this to events for when noFx is true; parent methods handle hide/show
		var deactivate = function(){ this.active = false; }.bind(this);
		this.addEvents({
			hide: deactivate,
			show: deactivate
		});
	},

	render: function(){
		this.parent();
		this.element.set('id', this.options.id || 'spinner-'+$time());
		this.content = document.id(this.options.content) || new Element('div', this.options.content);
		this.content.inject(this.element);
		if (this.options.message) {
			this.msg = document.id(this.options.message) || new Element('p', this.options.messageContainer).appendText(this.options.message);
			this.msg.inject(this.content);
		}
		if (this.options.img) {
			this.img = document.id(this.options.img) || new Element('div', this.options.img);
			this.img.inject(this.content);
		}
		this.element.set('tween', this.options.fxOptions);
	},

	show: function(noFx){
		if (this.active) return this.chain(this.show.bind(this));
		if (!this.hidden) {
			this.callChain.delay(20, this);
			return this;
		}
		this.active = true;
		return this.parent(noFx);
	},

	showMask: function(noFx){
		var pos = function(){
			this.content.position($merge({
				relativeTo: this.element
			}, this.options.containerPosition));
		}.bind(this);
		if (noFx) {
			this.parent();
			pos();
		} else {
			this.element.setStyles({
				display: 'block',
				opacity: 0
			}).tween('opacity', this.options.style.opacity || 0.9);
			pos();
			this.hidden = false;
			this.fireEvent('show');
			this.callChain();
		}
	},

	hide: function(noFx){
		if (this.active) return this.chain(this.hide.bind(this));
		if (this.hidden) {
			this.callChain.delay(20, this);
			return this;
		}
		this.active = true;
		return this.parent(noFx);
	},

	hideMask: function(noFx){
		if (noFx) return this.parent();
		this.element.tween('opacity', 0).get('tween').chain(function(){
			this.element.setStyle('display', 'none');
			this.hidden = true;
			this.fireEvent('hide');
			this.callChain();
		}.bind(this));
	},

	destroy: function(){
		this.content.destroy();
		this.parent();
		this.target.eliminate('spinner');
	}

});

Spinner.implement(new Chain);

if (window.Request) {
	Request = Class.refactor(Request, {
		
		options: {
			useSpinner: false,
			spinnerOptions: {},
			spinnerTarget: false
		},
		
		initialize: function(options){
			this._send = this.send;
			this.send = function(options){
				if (this.spinner) this.spinner.chain(this._send.bind(this, options)).show();
				else this._send(options);
				return this;
			};
			this.previous(options);
			var update = document.id(this.options.spinnerTarget) || document.id(this.options.update);
			if (this.options.useSpinner && update) {
				this.spinner = update.get('spinner', this.options.spinnerOptions);
				['onComplete', 'onException', 'onCancel'].each(function(event){
					this.addEvent(event, this.spinner.hide.bind(this.spinner));
				}, this);
			}
		},
		
		getSpinner: function(){
			return this.spinner;
		}
		
	});
}

Element.Properties.spinner = {

	set: function(options){
		var spinner = this.retrieve('spinner');
		return this.eliminate('spinner').store('spinner:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('spinner')){
			if (this.retrieve('spinner')) this.retrieve('spinner').destroy();
			if (options || !this.retrieve('spinner:options')) this.set('spinner', options);
			new Spinner(this, this.retrieve('spinner:options'));
		}
		return this.retrieve('spinner');
	}

};

Element.implement({

	spin: function(options){
		this.get('spinner', options).show();
		return this;
	},

	unspin: function(){
		var opt = Array.link(arguments, {options: Object.type, callback: Function.type});
		this.get('spinner', opt.options).hide(opt.callback);
		return this;
	}

});

/*
---

script: Date.English.US.js

description: Date messages for US English.

license: MIT-style license

authors:
- Aaron Newton

requires:
- /Lang
- /Date

provides: [Date.English.US]

...
*/

MooTools.lang.set('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	//culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',

	/* Date.Extras */
	ordinal: function(dayOfMonth){
		//1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',
	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});

Element.implement({
 disableSelection: function() {
  if(Browser.Engine.trident || Browser.Engine.webkit) {
   this.onselectstart = function() { return false; }
   if (Browser.Engine.webkit) {
     this.setStyle('-webkit-user-select', 'none');
   }
  }
  else if(Browser.Engine.gecko) {
   this.setStyle('-moz-user-select', '-moz-none');
  }
  else {
   this.onmousedown = function() { return false; }
  }
  
  return this;
 },
 
 enableSelection: function(pUserSelect) {
  pUserSelect = pUserSelect || '';
  
  if(Browser.Engine.trident || Browser.Engine.webkit) {
   this.onselectstart = function() { return true; }
   if (Browser.Engine.webkit) {
     this.setStyle('-webkit-user-select', pUserSelect);
   }
  }
  else if(Browser.Engine.gecko) {
   this.setStyle('-moz-user-select', pUserSelect);
  }
  else {
   this.onmousedown = function() { return true; }
  }
  return this;
 }
 
})

if (!window.console) {
  window.console = {
    log: function() {},
    warn: function() {},
    debug: function() {},
    info: function() {},
    error: function() {},
    assert: function() {},
    dir: function() {},
    dirxml: function() {},
    trace: function() {},
    group: function() {},
    groupEnd: function() {},
    time: function() {},
    timeEnd: function() {},
    profile: function() {},
    profileEnd: function() {},
    count: function() {}
  }
}

document.blur = (function() {
  var tmp;
  
  return function() {
    
    if(!tmp) {
      tmp = document.createElement('input');
      tmp.style.position = 'absolute';
      tmp.style.left = '-10000px';
      tmp.style.top = '-10000px';
      tmp.style.width = '1px';
      tmp.style.height = '1px';
      document.body.appendChild(tmp);
    }
    else {
      tmp.style.display = '';
    }
    
    tmp.focus();
    
    // z nieznanych przyczyn na Macu webkity przy wcisnietym Shift nie moga kasowac elementu
    // zamiast tego mozna go ukryc i pozostawic w DOM
    if(Browser.Engine.webkit && Browser.Platform.mac) {
      tmp.blur();
      tmp.style.display = 'none';
    }
    else {
      document.body.removeChild(tmp);
      tmp = null;
    }
  }
})()

/**
*
*  Javascript sprintf
*  http://www.webtoolkit.info/
*
*
**/
 
sprintfWrapper = {
	init : function () {

		if (typeof RegExp == "undefined") { return null; }

		var string = this.toString();
		var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
		var matches = new Array();
		var strings = new Array();
		var convCount = -1;
		var stringPosStart = 0;
		var stringPosEnd = 0;
		var matchPosEnd = 0;
		var newString = '';
		var match = null;

		while (match = exp.exec(string)) {
			if (match[9]) { convCount += 1; }

			stringPosStart = matchPosEnd;
			stringPosEnd = exp.lastIndex - match[0].length;
			strings[strings.length] = string.substring(stringPosStart, stringPosEnd);

			matchPosEnd = exp.lastIndex;
			matches[matches.length] = {
				match: match[0],
				left: match[3] ? true : false,
				sign: match[4] || '',
				pad: match[5] || ' ',
				min: match[6] || 0,
				precision: match[8],
				code: match[9] || '%',
				negative: parseInt(arguments[convCount]) < 0 ? true : false,
				argument: String(arguments[convCount])
			};
		}
		strings[strings.length] = string.substring(matchPosEnd);

		if (matches.length == 0) { return string; }
		if ((arguments.length - 1) < convCount) { return null; }

		var code = null;
		var match = null;
		var i = null;

		for (i=0; i<matches.length; i++) {

			if (matches[i].code == '%') { substitution = '%' }
			else if (matches[i].code == 'b') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
				substitution = sprintfWrapper.convert(matches[i], true);
			}
			else if (matches[i].code == 'c') {
				matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
				substitution = sprintfWrapper.convert(matches[i], true);
			}
			else if (matches[i].code == 'd') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
				substitution = sprintfWrapper.convert(matches[i]);
			}
			else if (matches[i].code == 'f') {
				matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
				substitution = sprintfWrapper.convert(matches[i]);
			}
			else if (matches[i].code == 'o') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
				substitution = sprintfWrapper.convert(matches[i]);
			}
			else if (matches[i].code == 's') {
				matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
				substitution = sprintfWrapper.convert(matches[i], true);
			}
			else if (matches[i].code == 'x') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
				substitution = sprintfWrapper.convert(matches[i]);
			}
			else if (matches[i].code == 'X') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
				substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
			}
			else {
				substitution = matches[i].match;
			}

			newString += strings[i];
			newString += substitution;

		}
		newString += strings[i];

		return newString;

	},

	convert : function(match, nosign){
		if (nosign) {
			match.sign = '';
		} else {
			match.sign = match.negative ? '-' : match.sign;
		}
		var l = match.min - match.argument.length + 1 - match.sign.length;
		var pad = new Array(l < 0 ? 0 : l).join(match.pad);
		if (!match.left) {
			if (match.pad == "0" || nosign) {
				return match.sign + pad + match.argument;
			} else {
				return pad + match.sign + match.argument;
			}
		} else {
			if (match.pad == "0" || nosign) {
				return match.sign + match.argument + pad.replace(/0/g, ' ');
			} else {
				return match.sign + match.argument + pad;
			}
		}
	}
}
String.prototype.sprintf = sprintfWrapper.init;

String.prototype.repeat = function(l){
  return new Array(l+1).join(this);
}

String.prototype.escapeHTML = function() {
  return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

String.prototype.unescapeHTML = function() {
  return this.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

Number.prototype.toIntZero = String.prototype.toIntZero = function(){
  var v = this.toInt();
  return isNaN(v) ? 0 : v;
}

Number.prototype.toFloatZero = String.prototype.toFloatZero = function(){
  var v = this.toFloat();
  return isNaN(v) ? 0 : v;
}

var isChrome = function() {
  return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

Color.implement({

	desaturate: function(){
		var avg = Math.round(this.rgb.sum() / 3);
    
    return new Color([avg, avg, avg]);
	}
});

Element.implement({
  'storeEvent': function(pEvent) {
    var stored_events = this.retrieve('storedEvents') || {};
    
    stored_events[pEvent] = new Element('div');
    stored_events[pEvent].cloneEvents(this, pEvent);
    
    this.store('storedEvents', stored_events);
    
    return this;
  },
  
  'restoreEvent': function(pEvent) {
    var stored_events = this.retrieve('storedEvents') || {};
    
    if(stored_events[pEvent]) {
      this.removeEvents(pEvent);
      this.cloneEvents(stored_events[pEvent], pEvent);
    }
    
    return this;
  }
});

Events.implement({
  
  fireEventOnce: function(type, args, delay) {
    this.fireEvent(type, args, delay);
    this.removeEvents(type);
    
    return this;
  }
  
});

Element.implement({
  'onTransitionEnd':function(onTransitionEnd) {
    this.addEventListener('webkitTransitionEnd', onTransitionEnd);
    this.addEventListener('mozTransitionEnd', onTransitionEnd);
    this.addEventListener('msTransitionEnd', onTransitionEnd);
    this.addEventListener('transitionEnd', onTransitionEnd);
  }
});

// ---------------------------------------------------------------------
// Browser Detection 
// 
// ---------------------------------------------------------------------
isMac = (navigator.appVersion.indexOf("Mac")!=-1) ? true : false; 
isDOM=(document.getElementById)?true:false
isOpera=isOpera5=window.opera && isDOM
isOpera6=isOpera && window.print
isOpera7=isOpera && navigator.userAgent.indexOf("Opera 7") > 0 || navigator.userAgent.indexOf("Opera/7") >= 0
isMSIE=isIE=document.all && document.all.item && !isOpera
isMSIE4 = ((document.all)&&(navigator.appVersion.indexOf("MSIE 4.")!=-1)) ? true : false; 
isMSIEmac = ((document.all)&&(isMac)) ? true : false; 
isNC=navigator.appName=="Netscape"
isNC4=isNC && !isDOM
isNC6=isNC && isDOM



// ---------------------------------------------------------------------
// Safe loading into window.onload
//
// Body onload utility (supports multiple onload functions) 
// ---------------------------------------------------------------------
var gSafeOnload = new Array(); 
var gSafeOnloadDelay = new Array();

function SafeAddOnload(f) {
  SafeAddOnloadDelayed(f, 0);
}

function SafeAddOnloadDelayed(f, d) {
  if (isMSIEmac && isMSIE4)  // IE 4.5 blows out on testing window.onload 
  { 
    window.onload = SafeOnload; 
    gSafeOnload[gSafeOnload.length] = f;
    gSafeOnloadDelay[gSafeOnloadDelay.length] = d;
  } 
  else if (window.onload) 
  { 
    if (window.onload != SafeOnload) 
    { 
      gSafeOnload[0] = window.onload; 
      gSafeOnloadDelay[0] = 0;
      window.onload = SafeOnload; 
    } 
    gSafeOnload[gSafeOnload.length] = f; 
    gSafeOnloadDelay[gSafeOnloadDelay.length] = d;
  } 
  else {
    window.onload = f;
  }
} 

function SafeOnload() 
{ 
  var xyziilen = gSafeOnload.length;
  
  for (xyzii = 0; xyzii < xyziilen; xyzii++) {
    
    if (typeof(gSafeOnload[xyzii]) != 'function') {
      gSafeOnload[xyzii] = new Function(gSafeOnload[xyzii]);
    }
    
    if (gSafeOnloadDelay[xyzii] > 0) {
      setTimeout(gSafeOnload[xyzii], gSafeOnloadDelay[xyzii]); 
    }
    else {
      gSafeOnload[xyzii]();
    }  
  }
} 

// ---------------------------------------------------------------------
// Set a layer opacity
// 
// ---------------------------------------------------------------------
function SetLayerOpacity(layername, opacitylevel) {
  if (!isDOM) {
    return false;
  }
  if(isMSIE) {
    document.getElementById(layername).style.filter='alpha(opacity='+opacitylevel+')';
  }
        if(isNC6) {
    document.getElementById(layername).style.MozOpacity = opacitylevel/100;
  }
}

// ---------------------------------------------------------------------
// Open new browser window
// 
// Params:
//
//   pWidth - popup width in px
//   pHeight - popup height in px
//   pXpos - x window position or one of: center, left, right
//   pYpos - y window position or one of: center, top, bottom
//   pURL - URL to open in window - optional
//   pWindowName - name of window - optional
//   pFocusAfterLoad - focus window after load
//   pAddon - turn on addons. give what addons you want to enable separated by ,
//            ie: scrollbars,hotkeys,location,menubar,resizable,titlebar,toolbar
// ---------------------------------------------------------------------
function PopupWindow(pWidth, pHeight, pXpos, pYpos, pURL, pWindowName, pFocusAfterLoad, pAddon) {

  // Position X
  if ('center' == pXpos) {
    pXpos = Math.round((screen.width -  pWidth) / 2);
  }
  else if('left' == pXpos) {
    pXpos = 0;
  }
  else if('right' == pXpos) {
    pXpos = screen.width -  pWidth;
  }
  
  // Position Y
  if ('center' == pYpos) {
    pYpos = Math.round((screen.height - pHeight) / 2);
  }
  else if('top' == pYpos) {
    pYpos = 0;
  }
  else if('bottom' == pYpos) {
    pYpos = screen.height - pHeight;
  }
  
  var addons = '' + 
    'hotkeys=no' + 
    ',location=no' + 
    ',menubar=no' + 
    ',resizable=no' + 
    ',scrollbars=no' + 
    ',status=no' + 
    ',titlebar=no' + 
    ',toolbar=no';
    
  // Replace addons to yes - ie. status=no -> status=yes
  if (pAddon) {
    splitaddons = pAddon.split(',');
    
    for(i = 0; i < splitaddons.length; i++) {
      regexp = new RegExp(splitaddons[i] + '=no', 'i');
      addons = addons.replace(regexp, splitaddons[i] + '=yes');
    }
  }
    
  windowhandle = window.open(
    pURL, pWindowName, 
    'height=' + pHeight +
    ',width=' + pWidth +
    ',screenX=' + pXpos + 
    ',screenY=' + pYpos + 
    ',left=' + pXpos +
    ',top=' + pYpos + 
    addons
  );
  
  // Raise window after window load
  if (true == pFocusAfterLoad) {
    windowhandle.focus();
  }
  
  //windowhandle.opener = window;
  
  return windowhandle;
}


function PopupWindowResize(pWidth, pHeight, pXpos, pYpos) {
  
  // Position X
  if ('center' == pXpos) {
    pXpos = Math.round((screen.width -  pWidth) / 2);
  }
  else if('left' == pXpos) {
    pXpos = 0;
  }
  else if('right' == pXpos) {
    pXpos = screen.width -  pWidth;
  }
  
  // Position Y
  if ('center' == pYpos) {
    pYpos = Math.round((screen.height - pHeight) / 2);
  }
  else if('top' == pYpos) {
    pYpos = 0;
  }
  else if('bottom' == pYpos) {
    pYpos = screen.height - pHeight;
  }
    
  window.resizeTo(pWidth, pHeight);
  
  if (pXpos > 0 && pYpos > 0) {
    window.moveTo(pXpos, pYpos);  
  }
}

// ---------------------------------------------------------------------
//  Loads dynamically script
// ---------------------------------------------------------------------
var gLoadedScripts = new Array();

function LoadScript(pScriptSrc) {
  
  // Check if script was'nt loaded already
  if (true == in_array(pScriptSrc, gLoadedScripts)) {
    return;  
  }
  
  gLoadedScripts.push(pScriptSrc);
  
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = pScriptSrc;
  
  document.getElementsByTagName("head")[0].appendChild(script);
  
  return script;
}

function in_array(pNeedle, pHaystack) {
  for(var i in pHaystack) {
    if (pNeedle == pHaystack[i]) {
      return true;
    }  
  }  
  return false;
}



function print_r(pMixed, pReturn) {
  var tmp = new String;
  
  for(var i in pMixed) {
    tmp += i + ' = ' + pMixed[i] + '\n';
  }
  
  if (true === pReturn) {
    return tmp;
  }
  else {
    alert(tmp);
  }
}


// ---------------------------------------------------------------------
// Add event to object
// 
// ---------------------------------------------------------------------
function AddEvent(pObject, pHandler, pFunction){

  if (!document.all && document.getElementById){
    pObject.setAttribute(pHandler, pFunction);
  }    
  
  //workaround for IE 5.x and IE 6
  if (document.all && document.getElementById){
    pObject[pHandler.toLowerCase()] = new Function(pFunction);
  }
}


function GetWindowWidth() {
  return parseInt(
    (document.body && !isOpera && document.body.clientWidth)? document.body.clientWidth : (window.innerWidth || 0)
  );
};

function GetWindowHeight() {
  return parseInt(
    (document.body && !isOpera && document.body.clientHeight)? document.body.clientHeight : (window.innerHeight || 0)
  );
};

function CenterLayerOnPage(pLayer, pWidth, pHeight) {
  
  if (document.documentElement.clientWidth < pWidth) {
    leftPom = Math.round((document.documentElement.scrollWidth - pWidth)/2);
  }
  else {
    leftPom = Math.round((document.documentElement.clientWidth - pWidth)/2) + document.documentElement.scrollLeft;
  }
  
  if (document.documentElement.clientHeight < pHeight) {
    topPom = Math.round((document.documentElement.scrollHeight - pHeight)/2);
  }
  else {
    topPom = Math.round((document.documentElement.clientHeight - pHeight)/2) + document.documentElement.scrollTop;
  }
  
  $(pLayer).style.top = topPom + 'px';
  $(pLayer).style.left = leftPom  + 'px';
}

function ImgAlpha(pSrc, pWidth, pHeight, pIEScalingOff) {

  var img_el = new Element('img');
  img_el.width = pWidth;
  img_el.height = pHeight;
  img_el.src = pSrc;
  
  return img_el;
}

// Mouse positions are stored in MouseX and MouseY
var MouseX = 0;
var MouseY = 0;

function MousePositionXYHandler(ev){
  if (isNC6) {
    MouseX = ev.pageX;
    MouseY = ev.pageY;
  }
  else if(isMSIE4) {
    MouseX = document.body.scrollLeft + window.event.x;
    MouseY = document.body.scrollTop + window.event.y;
  }
  else if(isMSIE && event && document.documentElement && document.body) {
    MouseX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
    MouseY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
  }
  else {
    MouseX = event.pageX ? event.pageX - window.pageXOffset : event.clientX;
    MouseY = event.pageY ? event.pageY - window.pageYOffset : event.clientY;
  }
}
// Mouse handler - stores mouse position in var MouseX and MouseY
document.onmousemove = MousePositionXYHandler;

var WindowPosition = {
  GetX: function() {
    if (isMSIE) {
      return window.screenLeft;
    }
    return window.screenX;
  },
  
  GetY: function() {
    if (isMSIE) {
      return window.screenTop;
    }
    return window.screenY;
  }
}

/*
funkcja kopiujaca obiekt
*/
copyObject = function(pObject) {
  var newObj = $type(pObject) == 'array' ? [] : {};
  for (i in pObject){
    if (pObject[i] && $type(pObject[i]) == "object") {
      newObj[i] = copyObject(pObject[i]);
    }
    else{
      newObj[i] = pObject[i]
    }
  }
  return newObj;
}

var customUploader = new Class({
  
  'mEventsEl': null,
  'mFileboxEl': null,
  'mCustomButtonEl': null,
  'mStrictEl': null,
  'mEventAttached': false,
  'mEventsElementPosition': null,
  'mEventsElementSize': null,
  'mBrowserButtonPosition': 130,
  
  'mStart': null,
  
  'initialize': function(pEventsEl, pFileboxEl, pCustomButtonEl, pStrictEl){
    
    this.mEventAttached = false;
    
    if(!pStrictEl){
      pStrictEl = false;
    }
    
    this.mEventsEl = pEventsEl;
    this.mFileboxEl = pFileboxEl;
    this.mCustomButtonEl = pCustomButtonEl;
    this.mStrictEl = pStrictEl;
    
    this.mEventsElementPosition = pEventsEl.getPosition();
    this.mEventsElementSize = pEventsEl.getSize();
    
    this.setBrowserDifferencePosition();
    this.allocateElements();
    
    this.registerEvents();
    
  },
  
  'setBrowserDifferencePosition': function(){
  	if(Browser.Engine.gecko){
  	  this.mBrowserButtonPosition = 180;
  	}
  	else if(Browser.Engine.presto){
  	  this.mBrowserButtonPosition = 150;
  	}
  },
  
  'allocateElements': function(){
    
  	if(false == this.mStrictEl){
  	  this.mEventsEl.getParent().getParent().adopt(this.mFileboxEl);
  	}
  	else{
  	  this.mEventsEl.adopt(this.mFileboxEl);
  	}
    
    this.mFileboxEl.setStyles({
      'opacity': 0.01,
      'left': -400,
      'position': 'absolute'
    });    
   
    this.mFileboxEl.addClass('curDefault');
     
  },
  
  'attachEvent': function(){
  	this.mStart = this.mEventsEl.getPosition();
  	
  	if (false === this.mEventAttached) {
	  	this.mEventsEl.addEvent('mousemove', this.followButton.bindWithEvent(this));
			this.mEventAttached = true;
  	}
  	
  	this.mFileboxEl.setStyle('display', '');
  	
  },
  
  'detachEvent': function(){
    this.mEventsEl.removeEvents('mousemove');
    this.mEventAttached = false;
    this.mFileboxEl.setStyles({
      'display': 'none',
      'left': -400
    });
    
  },
  
  'followButton': function(pE){
    
    if(!this.mStart){
      this.mStart = {'x': 0, 'y': 0};
    }
    
		this.mFileboxEl.setStyles({
      'left': pE.page.x - this.mStart.x - this.mBrowserButtonPosition,
      'top': pE.page.y - this.mStart.y - 13
    });
    
    this.checkPosition(pE);
    
  },
  
  'checkPosition': function(pE) {
  	if (pE.page.x < this.mEventsElementPosition.x || pE.page.x > (this.mEventsElementPosition.x + this.mEventsElementSize.x) || pE.page.y < this.mEventsElementPosition.y || pE.page.y > (this.mEventsElementPosition.y + this.mEventsElementSize.y)){
  		this.detachEvent();
  	}
  	
  },
  
  'registerEvents': function(){
    this.mEventsEl.addEvent('mousemove', this.followButton.bindWithEvent(this));
    this.mFileboxEl.addEvent('mousemove', this.followButton.bindWithEvent(this));

    this.mEventsEl.addEvent('mouseenter', function(){
      this.attachEvent();
    }.bind(this));

    this.mFileboxEl.addEvent('mousedown', function(pE){
      this.mCustomButtonEl.fireEvent('mousedown', pE);
    }.bindWithEvent(this));
    
    document.addEvent('mouseup', function(pE){
      this.mCustomButtonEl.fireEvent('mouseup', pE);
    }.bindWithEvent(this));
    
  }
  
});

/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
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
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
}
Request.Comet = new Class({

	Implements: [Options, Events],

	tunnel: null,
	timeoutactive: true,

	options: {
		url: '',
		onPush: $empty,
		secure: true,
		ttl: 30000
	},

	initialize: function(options) {
		this.setOptions(options);

    this.type = (Browser.Engine.trident ? 3 : 1);

    // IE
    if (this.type == 3) {
      this.tunnel = new ActiveXObject("htmlfile");
    }

    // Opera
    else if (this.type == 2){
      this.tunnel = document.createElement("event-source");
    }

    // Firefox i inne
    else {
  		this.tunnel = new Request.Comet.XHR(this.options);
  		this.tunnel.addCallback(this.onChange.bind(this), {readyState: false, status: false});
  		this.tunnel.addEvent('onEnd', this.fireEvent.pass(['end'], this));
  		this.tunnel.addEvent('onFail', this.fireEvent.pass(['fail'], this));
    }
    
    // Laduje oczekiwanie na timeout - przed pierwszym polaczeniem timeout troche wiekszy
    this.clearConnectionTimeout(15000);
	},
	
	clearConnectionTimeout: function(pTTL) {
	  $clear(this.mTimeout);
	  
    // Dodaje timeouta ktory, jesli zostanie wywolany zasygnalizuje problem z polaczeniem
    if (this.timeoutactive) {
      this.mTimeout = this.connectionTimeout.delay(pTTL | this.options.ttl, this);
    }
	},
	
  connectionTimeout: function() {
    this.cancel();
    this.fireEvent('timeout');
  },
      
	cancel: function() {
   
	  $clear(this.mTimeout);
  	this.timeoutactive = false;

  	if (!this.tunnel) {
	    return;
	  }

  	// IE
    if (this.type == 3) {
      this.tunnel.body.innerHTML = "<iframe src='about:blank'></iframe>";
    }
    // Opera
    else if (this.type == 2) {
      document.body.removeChild(this.tunnel);
    }
    // Firefox i inne
    else {
      this.tunnel.cancel();
    }

    this.tunnel = null;
    
	},

	send: function(pData) {
	  
	  pData.comet_type = this.type;
	  
	  // IE
    if (this.type == 3) {
      this.tunnel.open();
      this.tunnel.write("<html><body></body></html>");
      this.tunnel.close();
      this.tunnel.parentWindow._cometObject = this;
      this.tunnel.body.innerHTML = '<iframe src="' + this.options.url + '?json=' + encodeURIComponent(JSON.encode(pData)) + '"></iframe>';
      this.addEvent('onPing', this.clearConnectionTimeout.bind(this));
    }
    // Opera
    else if (this.type == 2) {
      this.tunnel.setAttribute("src", this.options.url + '?json=' + encodeURIComponent(JSON.encode(pData)));
      document.body.appendChild(this.tunnel);
      this.tunnel.addEventListener('MooComet', this.onChange.bind(this), false);
      this.tunnel.addEventListener('MooCometPing', this.clearConnectionTimeout.bind(this), false);
    }
    // Inne
    else {
  		this.tunnel.addCallback(this.clearConnectionTimeout.bind(this), {readyState: false, status: 200});
      this.tunnel.post({'json': JSON.encode(pData)});
    }
    
	},

	onChange: function(pResponse) {

	  // Opera ma troche inaczej
	  if (this.type == 2) {
      this.cancel();
      this.fireEvent('push', JSON.decode(pResponse.data, true));
      this.fireEvent('end');
      return;
	  }
	  
	  // Poniewaz ta metoda jest wykonywana za kazdym razem kiedy zostanie odebrana jakas dana z serwera (enter) to czeka na koncowy znacznik
	  if (!pResponse.match(/::end::$/)) {
	    return;
	  }
	  
    pResponse = pResponse.replace(/::end::$/, '');
	  
    this.cancel();
	  this.fireEvent('push', JSON.decode(pResponse, true));
    this.fireEvent('end');
	}
});

Request.Comet.XHR = new Class({
	Extends: Request,

	callbacks: [],

	check: function() {
		return true;
	},

	addCallback: function(fn, options){

		options = $extend({
			fn: $empty,
			readyState: 4,
			status: 200
		}, options);

		this.callbacks.push($extend(options, {fn: fn}));
		return this;
	},

	onStateChange: function(){
	  
 	  if (this.xhr.readyState == 4 && this.running) {
      // Jesli puste naglowki odpowiedzi, to znaczy ze wystapil problem z polaczeniem
      this.fireEvent(this.xhr.getAllResponseHeaders().length > 0 ? 'end' : 'fail');
	  }

	  // Dooshek - to jest dziwne troche ale chyba potrzebne bo inaczej sie callbacki wykonuja ktore wcale nie powinny
		if (this.xhr.readyState != 3 || !this.running) {
		  return;
		}
	  
		this.status = 0;
		$try(function(){
			this.status = this.xhr.status;
		}.bind(this));

		this.response = {text: this.xhr.responseText, xml: this.xhr.responseXML};

		this.callbacks.forEach(function(callback) {

			if (callback.readyState != false && callback.readyState != this.xhr.readyState)
				return;

			if (callback.status != false && callback.status != this.status)
				return;

			callback.fn(this.response.text);
		}, this);
	}
});

/**
 * @todo This class needs to be cleaned up, we don't use long-polling anymore
 *
 * @type {Class}
 */
var DPComet = new Class({

  Implements: [Events],

  mThreadID: null,

  mActive: true,
  mConnected: true,
  
  /*  
  * @param pIdProject - id projektu który jest obserwowany
  * @param pIdProject - hash projektu służący do autentykacji użytkownika (wykorzystywane w podglądzie)
  */
  initialize: function(pIdProject, pProjectHash, pActiveCollaboration) {

    this.mIdProject = pIdProject;
    this.mProjectHash = pProjectHash;
    this.mActive = pActiveCollaboration;
    
    // Generuje unikalny thread_id po to, zeby nie otrzymywac swoich wlasnych danych
    this.mThreadID = (window.name || this.setNewThreadId()) + pIdProject;
    
    // W Safari i Chrome jest blad ktory powoduje, ze pokazuje sie klepsydra jesli strona probuje cos zaladowac zanim wszystko sie wczytalo
    // if (Browser.Engine.webkit) {
    //   window.addEvent('load', this.buildComet.delay(3000, this));
    // }
    // else {
    //   this.buildComet();
    // }

    // Deaktywuje cometa przy reloadzie strony
    window.onbeforeunload = function (pE) {
      this.mActive = false;
      if(this.mComet){
        this.mComet.cancel();
      }
    }.bind(this);
    
  },
  
  setNewThreadId: function(){
    return window.name = $random(0, 1000000) + new Date().getTime().toString().substr(4);
  },
    
  /**
   * Metoda sluzaca do odnowienia polaczenia po nieobecnosci (po pracy w trybie offline).
   * Musi byc wykorzystana przed normalnym przywroceniem long-pollingu, poniewaz nastepuje szybkie pobranie zmian, ktore nastepnie sa mergowane ze zmianami lokalnymi.
   * W przypadku konfliktu musza zostac podjete odpowiednie kroki zanim zostanie przywrocony normalny tryb pushowania zmian z serwera
   */
  reconnect: function() {
    var changes = false;
    
    var reconnect_changes = function(pData) {
      var data = pData || {};
      changes = true;
      
      this.fireEvent('onReconnectChanges', [data]);
    }.bind(this);

    // Join to the room (live collaboration - socket.io)
    if(dpManager.isCollaboration()) {
      socket.emit('addCollaborator', {'socketRoomId': dpManager.dpProject.getHash(), 'userData': dpManager.DataForCollaboration });
    };

    // @todo Get all events from socket that occurred while being offline and call reconnect_changes() passing remote changes as parameter
    // @todo call DPPage.restoreCommunication() directly only if nothing changed remotely

    // saves changes made locally and emits them through the socket,
    // then displays reload dialog if there are more collaborators
    dpManager.dpWorkBench.getActivePage().restoreCommunication();
  },
  
  /**
   * Standardowy comet wysylany w celu oczekiwania na push zmian od innych uzytkownikow
   */
  buildComet: function() {
    if (false == this.mActive && this.mConnected) {
      return;
    }
    
    if (this.mComet && this.mComet.cancel) {
      this.mComet.cancel();
    }
    
    this.mComet = new Request.Comet({
      'url': '/ajax/dmsDPComet/Push/',
      'onPush': this.onPush.bind(this),
      'onEnd': this.onEnd.bind(this),   
      'onFail': this.onTimeout.bind(this),
      'onTimeout': this.mProjectHash ? this.buildComet.bind(this) : this.onTimeout.bind(this)
    });
    
    this.mComet.send({'id_project': this.mIdProject, 'project_hash': this.mProjectHash, 'thread_id': this.mThreadID});
  },
  
  onPush: function(pData) {
    
    // Brak uprawnien do edycji tego projektu lub uzytkownik zostal wylogowany
    if (pData.error) {

      this.mActive = false;
      
      DSWindow.Alert(
        transtext('You\'ve been logged out because you\'ve logged in from another browser or you haven\'t been using UXPin for a while.'),
        transtext('Warning'),
        transtext('Go'),
        10,
        'crystal/32/actions/agt_update_critical.png',
        function() {
          // Z powrotem do logowania
          window.location = '/';
        }
      );
      return false;
    }
    
    new Hash(pData).each(function(pData, pEvent) {
      
      for(var i = 0; i < pData.length; i++) {
        
        var tmp = pData[i];
        tmp['event'] = pEvent;
        this.fireEvent(pEvent, tmp);
      }
      
    }, this);
  },
  
  getThreadID: function() {
    return this.mThreadID;
  },
  
  onTimeout: function() {
    this.fireEvent('fail');
  },
  
  onEnd: function() {
    var delay = 1000;
    var response_text = undefined;
    var response_status = 200;

    if(this.mComet && this.mComet.tunnel) {
      
      // usalamy status odpowiedzi
      if(this.mComet.tunnel.status != 200) {
        response_status = this.mComet.tunnel.status;
      }
    
      // ustalamy string odpowiedzi
      if(this.mComet.tunnel.response) {
        response_text = this.mComet.tunnel.response.text;
      }
    }

    // Sprawdzamy, czy nie wystapil blad po stronie serwera, jesli tak, to opozniamy kolejny push o wiecej niz standardowa sekunde, 
    // a wprzypadku odpowiedzi innej niz 200, wywolujemy disconnecta
    if(200 !== response_status) {
      return this.onTimeout();
    }
    else if(undefined !== response_text && typeof response_text == 'string' && response_text.replace(/\s/g, '').length > 0) {
      try {
        JSON.decode(response_text);
      }
      catch(e) {
        delay = 15000;
      }
    }

    // opoznienie o sekunde, aby w przypadku celowego rozlaczenia, nie wysylal sie kolejny comet, zanim zlapiemy event rozlaczenia
    // this.buildComet.delay(delay, this); 
  }
    
});
/**
 * Klasa służąca do obsługi requestów AJAXowych
 * 
 * Wykorzystuje mootoolsową klasę Json.Remonte
 * 
 * Przykład uzycia:
 * 
 * 
 *     DejaxRequest.newRequest({
 *       url: '/ajax/dmsDPPage/SetActivePage/',
 *       eval: true,
 *       mode: 'cancel',
 *       data: {},
 *       onComplete: this.switchActivePage.bind(this)
 *     });
 * 
 * @copyright This file is DeSmart module. Copyright DeSmart.com. All rights reserved. www.desmart.com desmart@desmart.com
 */
Dejax = new Class({

  Implements: [Events],
  
  /**
  * Po tym czasie request zostanie uznany za "zaginiony" i zraportowany do debugera
  */
  mTTL: 30000,
  
  /**
   * Request handler - uchwyt aktywnego połączenia, które należy wykorzystać, chyba że zapytanie należy wykonać w trybie free (mode: free)
   * 
` */
  mRh: null,
  
  /**
   * Flaga informująca czy istnieje aktywne połączenie
   * 
` */
  mIsActiveConnection: false,
  
  /**
   * Stos requestów do wykonania
   * 
` */
  mQueue: new Array,

  /**
   * Służy do ominięcia eventa onbeforeunload
   * Ustawiany na true w momencie wyłaczenia systemu przez administratora
   * 
` */
  mForceLeave: false,
  
  mLogoutUrl: '/mod/Login/Logout',
  
  /**
   * mode - tryb zapytania, możliwe wartości:
   *    1) queue - zapytanie dodaje się do stosu i jest wykonywane gdy poprzednie zostanie zakończone
   *    2) cancel - zapytanie anuluje istniejące połączenie i wywołuje nowe
   *    4) free - poza kontrolą trybów - tworzy nowy obiekt Json.Request
   
   * eval - decyduje o tym czy zwrócaona treść ma być evalowana
   * onComplete - event uruchamiany po zakończeniu zapytania.
   * completePass - Agumenty które zostaną przekazane do onComplete.
   * data - dane do przesłania
   * prevent - uniemożliwia wykonanie jakiegokolwiek zapytania do czasu zakończenia istniejącego
   * 
   */
	options: {
    mode: 'free',
    completePass: new Array(),
    data: null,
    prevent: false,
    url: null,
    eval: true,
    evalData: null,
    debugRequest: false
	},
	
	initialize: function(){
	  this.resetOptions();
	},

  /**
   * Tworzy nowy obiekt Json.Remonte i przypisuje go do requestHandlera.
   * 
   */
	createRequestHandler: function(){
    this.mRh = new Request.JSON({
      onComplete: this.onCompleteCall.bind(this),
      evalScripts: false,
      url: this.options.url
    });
	},
	
	resetOptions: function(){
	  this.options = {
      mode: 'free',
      eval: true,
      completePass: new Array(),
      data: null,
      prevent: false,
      url: null,
      evalData: null,
      debugRequest: false
  	}
	  this.removeEvents('onComplete');
	},
	
	setOptions: function(pOptions){
    if(pOptions.onComplete){
      this.addEvent('onComplete', pOptions.onComplete);
    }
    for(i in this.options){
      this.options[i] = pOptions[i]
    }
	},
	
  /**
   * inicjuje nowe zapytanie, w zależności od trybu
   * 
   */
	newRequest: function(pOptions){

    switch(pOptions.mode){
      default:
      case 'free':
        var tmp = new Dejax();
        tmp.send(pOptions);
        return true;
        break;
      case 'cancel':
    	  if(true == this.options.prevent){
          // Jeżeli w kolejce poprzednim trybem jest cancel to usuwamy ostatniego requesta z kolejki
          var prev = this.mQueue.length.toInt() - 1;
          if(this.mQueue[prev] && this.mQueue[prev].mode == 'cancel'){
            this.mQueue.pop();
          }
          
    	    // Jeżeli włączony jest tryb prevent to request jest kolejkowany
          this.mQueue.include(pOptions);
    	    return false;
    	  }
        if(true == this.mIsActiveConnection){
          $clear(this.options.debugDelay);
          this.mRh.cancel();
        }
        break;
      case 'queue':
        if(true == this.mIsActiveConnection){          
          this.mQueue.extend([pOptions]);
    	    return true;
        }
        break;
    }
	  
	  if(true == this.options.prevent){
	    return false;
	  }
    this.send(pOptions);
	},
	
	send: function(pOptions){
    if(pOptions){
  	  this.resetOptions();
  	  this.setOptions(pOptions);
    }    
    if(!this.options){
      return false;
    }
    
    this.fireEvent('onStart');

    this.mIsActiveConnection = true;
    // czyscimy urla z  parametru __ajax_request jeżeli juz go posiada
    this.options.url = this.options.url.replace(/(\?|&)__ajax_request=1/g, '');
    if(!this.options.url.match(/\?/)){
      this.options.url +='?__ajax_request=1'
	  }
	  else{
      this.options.url +='&__ajax_request=1'
	  }

	  var data = pOptions || this.options;
	  
	  // Poprzedni request się zakończył więc trzeba stworzyć nowy!
	  this.createRequestHandler();
	  
	  // wyłaczam debuga nie ma sensu by się wykonywał!
//    this.options.debugDelay = this.runDebug.delay(this.mTTL, this, [data]);
    this.mRh.post({'json': JSON.encode(this.options.data)});
	},
	
	showAlert: function(){
	  alert('nie wolno!')
	},
  
  /**
   * Metoda wywoływana po zakończeniu requesta ajaxowego.
   * 
   * evaluje również wszystkie skrypty które zostały zwrócone
   * jako parametr zwracane są dane przesłane z requesta
   *
   * @param object pData
   */  
  onCompleteCall: function(pData){
    $clear(this.options.debugDelay);
    this.mIsActiveConnection = false;
    this.options.prevent = false;

    if(pData && pData.system_message && 'disabled' == pData.system_message){
      this.mForceLeave = true;
      window.location.href = this.mLogoutUrl;
    }
    
    if(!this.options.completePass){
      this.options.completePass = new Array();
    }
    this.options.completePass.extend([pData])
    
    this.fireEvent('onComplete', this.options.completePass);
    
    if(true == this.options.eval){
      if(this.options.evalData){
        this.options.evalData.each(function(pEl){
          this.evalScripts(pData[pEl]);
        }.bind(this))
      }
      else{
        this.evalScripts(pData);
      }
    }
    
    this.fireEvent('onEnd');

    
    if(this.mQueue.length > 0){
      this.send(this.mQueue.pop());
    }
      
    return pData;
  },
  
  /**
   * Jeżeli request trwa zbyt długo to informacje na jego temat sa zapisywane do bzy danych,
   * sam request jest cancelowany i uruchamiany ponownie
   * 
   * @param object pData
   */  
  runDebug: function(pData){
    
    if(false == this.mIsActiveConnection){
      return false;
    }
    
    this.mRh.cancel();
    // Jeżeli jest to request Debugowy to anulujemy trwający ale nie wysyłamy kolejnego requesta
    if(true === this.options.debugRequest){
      return true;
    }
    
    this.newRequest({
      url: '/ajax/Dejax/DeBug/',
      eval: false,
      debugRequest: true,
      data: {'data': pData}
    });
    
    this.newRequest(pData);
  },
  
  /**
   * Metoda evalujaca javascripta z podanego stringa.
   * 
   * @param string pData
   */  
	evalScripts: function(pData){
		scripts_to_asset = [];
		var regexp_to_asset = /<script[^>]* src="([\s\S]*?)"[^>]*?>[\s\S]*?<\/script>/gi;
		while ((script_to_asset = regexp_to_asset.exec(pData))) new Asset.javascript(script_to_asset[1]);

	  this.evalInLine.delay(1, this, pData);
	},
  
	evalInLine: function(pData){
		scripts = [];
		var regexp = /<script[^>]*>([\s\S]*?)<\/script>/gi;
		while ((script = regexp.exec(pData))) scripts.push(script[1]);
		scripts = scripts.join('\n');
		
		if (scripts) (window.execScript) ? window.execScript(scripts) : window.setTimeout(scripts, 0);
	}
	
	
});
var DejaxRequest;
window.addEvent('domready', function(){
  DejaxRequest = new Dejax();
});

//MooCanvas, My Object Oriented Canvas Element. Copyright (c) 2008 Olmo Maldonado, <http://ibolmo.com/>, MIT Style License.
/*
Script: Canvas.js
	Contains the Canvas class.

Dependencies:
	MooTools, <http://mootools.net/>
		Element, and its dependencies

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

/*
Class: Canvas
	Creates the element <canvas> and extends the element with getContext if not defined.

Syntax:
	>var myCanvas = new Canvas([el,][ props]);

Arguments:
	el    - (element, optional) An unextended canvas Element to extend if necessary.
	props - (object, optional) All the particular properties for an Element. 

Returns:
	(element) A new Canvas Element extended with getContext if necessary.

Example:
	[javascript]
		var cv = new Canvas();
		var ctx = cv.getContext('2d');
		$(document.body).adopt(cv);
	[/javascript]
*/

if (Browser.Engine.trident){
	Element.Constructors.canvas = function(props){
		return new Canvas(props);
	};	
  
  (function() {
    var sheet = document.createElement('style'),
        node = document.createTextNode('canvas {text-align:left;display:inline-block;}' +
          'canvas div, canvas div * {position:absolute;overflow:hidden}' +
          'canvas div * {width:10px;height:10px;}' +
          'v\\:*, o\\:*{behavior:url(#default#VML)}');
    sheet.type = 'text/css';
    sheet.appendChild(node);
    
    document.head.appendChild(sheet);
  })()
}

var Canvas = new Class({

	initialize: function(){
		var params = Array.link(arguments, {properties: Object.type, element: $defined});
		var props = $extend({width: 300, height: 150}, params.properties);
		var el = (params.element || document.newElement('canvas')).set(props);
		if (el.getContext) return el;
		el.attachEvent('onpropertychange', this.changeproperty);
		el.attachEvent('onresize', this.resize);
		el.getContext = function(){
			return this.context = this.context || new CanvasRenderingContext2D(el);
		};
		return el.setStyles({
			width: props.width,
			height: props.height
		});
	},

	changeproperty: function(e){
		var property = e.propertyName;
		if (property == 'width' || property == 'height'){
			e = e.srcElement;
			e.style[property] = e[property];
			e.getContext().clearRect();
		}
	},

	resize: function(e){
		e = e.srcElement;
		var efC = e.firstChild;
		if (efC){
			efC.style.width = e.width;
			efC.style.height = e.height;
		}
	}

});

/*
Private Class: CanvasRenderingContext2D
	Context2D class with all the Context methods specified by the WHATWG, <http://www.whatwg.org/specs/web-apps/current-work/#the-canvas>

Arguments:
	el - (element) An Element requesting the context2d.
*/
var CanvasRenderingContext2D = new Class({

	initialize: function(el){
		this.element = new Element('div').setStyles({
			width: el.clientWidth,
			height: el.clientHeight
		}).inject(el);

		this.m = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
		this.l = 0;
		this.rot = 0;
		this.state = [];
		this.path = [];

		// from excanvas, subpixel rendering.
		this.Z = 10;
		this.Z2 = this.Z / 2;
		this.miterLimit = this.Z * 1;
	},
    
	arcScaleX: 1,
	arcScaleY: 1,
	currentX: 0,
	currentY: 0,
	lineWidth: 1,
	strokeStyle: '#000',
	fillStyle: '#fff',
	globalAlpha: 1,
	globalCompositeOperation: 'source-over',
	lineCap: 'butt',
	lineJoin: 'miter',
	shadowBlur: 0,
	shadowColor: '#000',
	shadowOffsetX: 0,
	shadowOffsetY: 0,

	getCoords: function(x,y){
		var m = this.m, Z = this.Z, Z2 = this.Z2,
		coord = {
			x: Z * (x * m[0][0] + y * m[1][0] + m[2][0]) - Z2,
			y: Z * (x * m[0][1] + y * m[1][1] + m[2][1]) - Z2
		};
		coord.toString = function(){ return this.x.round() + ',' + this.y.round() };
		return coord;
	}

});

/*
Script: Path.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({

	/*
		A path has a list of zero or more subpaths.
		Each subpath consists of a list of one or more points,
		connected by straight or curved lines, and a flag indicating whether
		the subpath is closed or not. A closed subpath is one where the
		last point of the subpath is connected to the first point of
		the subpath by a straight line. Subpaths with fewer than two
		points are ignored when painting the path.
	*/

	/*
	Property:
		Empties the list of subpaths so that the context once again has zero
		subpaths.
	*/
	beginPath: function(){
		this.l = 0;
		this.path.length = 0;
	},

	/*
	Property:
		Creates a new subpath with the specified point as its first
		(and only) point.
	*/
	moveTo: function(x, y){
		this.path[this.l++] = 'm';
		this.path[this.l++] = this.getCoords(x, y);
		this.currentX = x;
		this.currentY = y;
	},

	/*
	Property:
		Does nothing if the context has no subpaths.
		Otherwise, marks the last subpath as closed, create a new
		subpath whose first point is the same as the previous
		subpath's first point, and finally add this new subpath to the
		path.
	*/
	closePath: function(){
		this.path[this.l++] = 'x';
	},

	/*
	Property:
		Method must do nothing if the context has no subpaths. Otherwise,
		it must connect the last point in the subpath to the given point
		(x, y) using a straight line, and must then add the given point
		(x, y) to the subpath.
	*/
	lineTo: function(x, y){
		this.path[this.l++] = 'l';
		this.path[this.l++] = this.getCoords(x,y);
		this.currentX = x;
		this.currentY = y;
	},

	/*
	Property:
		Method must do nothing if the context has no subpaths. Otherwise,
		it must connect the last point in the subpath to the given point
		(x, y) using a straight line, and must then add the given point
		(x, y) to the subpath.
	*/
	quadraticCurveTo: function(cpx, cpy, x, y){
		var cx = 2 * cpx,
			cy = 2 * cpy;

		this.bezierCurveTo(
			(cx + this.currentX) / 3,
			(cy + this.currentY) / 3,
			(cx + x) / 3,
			(cy + y) / 3,
			x,
			y
		);
	},

	/*
	Property:
		Method must do nothing if the context has no subpaths. Otherwise,
		it must connect the last point in the subpath to the given point
		(x, y) using a bezier curve with control points (cp1x, cp1y) and
		(cp2x, cp2y). Then, it must add the point (x, y) to the subpath.
	*/
	bezierCurveTo: function(cp0x, cp0y, cp1x, cp1y, x, y){
		this.path[this.l++] = ' c ' + [
			this.getCoords(cp0x, cp0y),
			this.getCoords(cp1x, cp1y),
			this.getCoords(x,y)
		].join(',');

		this.currentX = x;
		this.currentY = y;
	},

	/*
	Property:
		Method must do nothing if the context has no subpaths. If the context
		does have a subpath, then the behaviour depends on the arguments and
		the last point in the subpath.

		Let the point (x0, y0) be the last point in the subpath. Let The Arc
		be the shortest arc given by circumference of the circle that has one
		point tangent to the line defined by the points (x0, y0) and (x1, y1),
		another point tangent to the line defined by the points (x1, y1) and
		(x2, y2), and that has radius radius. The points at which this circle
		touches these two lines are called the start and end tangent points
		respectively.

		If the point (x2, y2) is on the line defined by the points (x0, y0)
		and (x1, y1) then the method must do nothing, as no arc would satisfy
		the above constraints.

		Otherwise, the method must connect the point (x0, y0) to the start
		tangent point by a straight line, then connect the start tangent point
		to the end tangent point by The Arc, and finally add the start and end
		tangent points to the subpath.

		Negative or zero values for radius must cause the implementation to
		raise an INDEX_SIZE_ERR exception.
	*/
	arcTo: Function.empty,

	/*
	Property:
		Method draws an arc. If the context has any subpaths, then the method
		must add a straight line from the last point in the subpath to the
		start point of the arc. In any case, it must draw the arc between the
		start point of the arc and the end point of the arc, and add the start
		and end points of the arc to the subpath. The arc and its start and
		end points are defined as follows:

		Consider a circle that has its origin at (x, y) and that has radius
		radius. The points at startAngle and endAngle along the circle's
		circumference, measured in radians clockwise from the positive x-axis,
		are the start and end points respectively. The arc is the path along
		the circumference of this circle from the start point to the end point,
		going anti-clockwise if the anticlockwise argument is true, and
		clockwise otherwise.

		Negative or zero values for radius must cause the implementation to
		raise an INDEX_SIZE_ERR exception.
	*/
	arc: function(x, y, rad, a0, a1, cw){
		rad *= this.Z;

		var x0 = a0.cos() * rad, y0 = a0.sin() * rad,
			x1 = a1.cos() * rad, y1 = a1.sin() * rad;

		if (x0 == x1 && !cw) x0 += 0.125;
		
        var Z2 = this.Z2,
            c = this.getCoords(x, y),
			aSXr = this.arcScaleX * rad,
			aSYr = this.arcScaleY * rad;
			
		x -= Z2;
		y -= Z2;

		this.path[this.l++] = [
			cw ? 'at ' : 'wa ',
			(c.x - aSXr).round() + ',' + (c.y - aSYr).round(), ' ',
			(c.x + aSXr).round() + ',' + (c.y + aSYr).round(), ' ',
			this.getCoords(x0 + x, y0 + y), ' ',
			this.getCoords(x1 + x, y1 + y),
		].join('');
	},

	/*
	Property:
		method must create a new subpath containing just the four points
		(x, y), (x+w, y), (x+w, y+h), (x, y+h), with those four points
		connected by straight lines, and must then mark the subpath as
		closed. It must then create a new subpath with the point (x, y)
		as the only point in the subpath.

		Negative values for w and h must cause the implementation to raise
		an INDEX_SIZE_ERR exception.
	*/
	rect: function(x, y, w, h){
		this.moveTo(x, y);
		this.lineTo(x + w, y);
		this.lineTo(x + w, y + h);
		this.lineTo(x, y + h);
		this.closePath();
	},

	/*
	Property:
		Method must fill each subpath of the current path in turn, using
		fillStyle, and using the non-zero winding number rule. Open subpaths
		must be implicitly closed when being filled (without affecting the
		actual subpaths).
	*/
	fill: function(){
		this.stroke(true);
	},


	/*
	Property:
		Method must stroke each subpath of the current path in turn, using
		the strokeStyle, lineWidth, lineJoin, and (if appropriate) miterLimit
		attributes.

		Paths, when filled or stroked, must be painted without affecting the
		current path, and must be subject to transformations, shadow effects,
		global alpha, clipping paths, and global composition operators.

		The transformation is applied to the path when it is drawn, not when
		the path is constructed. Thus, a single path can be constructed and
		then drawn according to different transformations without recreating
		the path.
	*/

	stroke: function(fill){
		if(!this.path.length) return;

		var size = this.Z * 10,
			fS = this.fillStyle,
			rgb = String.type(fS),
			color = this.processColor(fill && rgb ? fS : this.strokeStyle),
			a = (fill) ?
				['filled="true" stroked="',
				['<v:fill', !rgb ? this.processColorObject(fS) : 'color="' + color.color + '" opacity="' + color.opacity, '"></v:fill>']]
			:
				['strokeweight=' + 0.8 * this.lineWidth * this.m[0][0] + ' filled="',
				['<v:stroke',
					'endcap=', (this.lineCap == 'butt') ? 'flat' : this.lineCap,
					'joinstyle=', this.lineJoin,
					'color=', color.color,
					'opacity="', color.opacity, '" />']];

		this.element.insertAdjacentHTML('beforeEnd', [
			'<v:shape path="', this.path.join(''), '" coordorigin="0 0" coordsize="' + size + ' ' + size + '" ', a[0], 'false">',
				a[1].join(' '),
			'</v:shape>'
		].join(''));

		if(fill && fS.img) this.element.getLast().fill.alignshape = false; // not sure why this has to be called explicitly

		this.beginPath();
	},

	/*
	Property:
		Method must create a new clipping path by calculating the intersection
		of the current clipping path and the area described by the current path
		(after applying the current transformation), using the non-zero winding
		number rule. Open subpaths must be implicitly closed when computing the
		clipping path, without affecting the actual subpaths.

		When the context is created, the initial clipping path is the rectangle
		with the top left corner at (0,0) and the width and height of the
		coordinate space.
	*/
	clip: Function.empty,

	/*
	Property:
		Method must return true if the point given by the x and y coordinates
		passed to the method, when treated as coordinates in the canvas'
		coordinate space unaffected by the current transformation, is within
		the area of the canvas that is inside the current path; and must
		return false otherwise.
	*/
	isPointInPath: Function.empty,

	processColor: function(col){
		var a = this.globalAlpha;
		if (col.substr(0, 3) == 'rgb'){
			if (col.charAt(3) == "a") a *= col.match(/([\d.]*)\)$/)[1];
			col = col.rgbToHex();
		}
		return {
			color: col,
			opacity: a
		};
	},

	/*
		If a gradient has no stops defined, then the gradient must be treated as a
		solid transparent black. Gradients are, naturally, only painted where the
		stroking or filling effect requires that they be drawn.
		
		* in gradients stops are not implict. 0 0.5 (stop) 1, 1 will break if not set, normally you'd expect 0.5 to propagate to 1.
	*/
	processColorObject: function(obj){
		var ret = '';
		if(obj.addColorStop){
			var oc0 = obj.col0, oc1 = obj.col1, stops = '';
			if(obj.stops) for (var i = 0, j = obj.stops.length; i < j; i++) stops += (100 * obj.stops[i][0]).round() + '% ' + obj.stops[i][1];
			ret += ((obj.r0) ?
				'type=gradientradial focusposition="0.2,0.2" focussize="0.2,0.2"'
			:
				'type=gradient method=linear focus=0 angle=' + 180 * (1 + obj.angle / Math.PI) + ' '
			) + [
				'color="' + oc0.color,
				'opacity="' + oc0.opacity * 100 + '%',
				'color2="' + oc1.color,
				'o:opacity2="' + oc1.opacity * 100 + '%',
				'colors="' + stops
			].join('" ');
		}

		return (obj.img) ?  'type="tile" src="' + obj.img.src : ret;
	}
	
});

/*
Script: Rects.js

Dependencies:
	Canvas.js, Path.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({

	/*
	Property: clearRect
		Clears the pixels in the specified rectangle.
		If height or width are zero has no effect.

		If no arguments, clears all of the canvas

		Currently, clearRect clears all of the canvas.
	 */
	clearRect: function(x, y, w, h){
		this.element.innerHTML = '';
		this.m = [
			[1, 0 ,0],
			[0, 1, 0],
			[0, 0, 1]
		];
	},

	/*
	Property: fillRect
		Paints the specified rectangle using fillStyle.
		If height or width are zero, this method has no effect.
	 */
	fillRect: function(x, y, w, h){
		this.rect(x, y, w, h);
		this.fill();
	},

	/*
		Draws a rectangular outline of the specified size.
		If width or height are zero: ??
	 */
	strokeRect: function(x, y, w, h){
		this.rect(x, y, w, h);
		this.stroke();
	}

});
/*
Script: Transform.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({
	/*
		The transformation matrix is applied to all drawing operations prior
		to their being rendered. It is also applied when creating the clip region.
		
		The transformations must be performed in reverse order. For instance,
		if a scale transformation that doubles the width is applied, followed
		by a rotation transformation that rotates drawing operations by a
		quarter turn, and a rectangle twice as wide as it is tall is then
		drawn on the canvas, the actual result will be a square.
	*/

  	/*
  	Property: scale
		Method must add the scaling transformation described by the arguments
		to the transformation matrix. The x argument represents the scale factor
		in the horizontal direction and the y argument represents the scale
		factor in the vertical direction. The factors are multiples.
	*/
	scale: function(x,y){
		this.arcScaleX *= x;
		this.arcScaleY *= y;

		this.matMult([
			[x, 0, 0],
			[0, y, 0],
			[0, 0, 1]
		]);
	},

  	/*
  	Property: rotate
		Method must add the rotation transformation described by the argument
		to the transformation matrix. The angle argument represents a clockwise
		rotation angle expressed in radians.
	*/
	rotate: function(ang){
		this.rot += ang;
		var c = ang.cos(),
			s = ang.sin();
			
		this.matMult([
			[ c, s, 0],
			[-s, c, 0],
			[ 0, 0, 1]
		]);
	},

  	/*
  	Property: translate
		Method must add the translation transformation described by the arguments
		to the transformation matrix. The x argument represents the translation
		distance in the horizontal direction and the y argument represents the
		translation distance in the vertical direction. The arguments are in
		coordinate space units.
	*/
	translate: function(x, y){
		this.matMult([
			[1, 0, 0],
			[0, 1, 0],
			[x, y, 1]
		]);
	},

  	/*
  	Property: transform
		Method must multiply the current transformation matrix with the matrix described
		by the inputs.
	*/
 	transform: function(m11, m12, m21, m22, dx, dy){
		this.matMult([
			[m11, m21, dx],
			[m12, m22, dy],
			[  0,   0,  1]
		]);
	},

  	/*
  	Property: setTransform
  		Method must reset the current transform to the identity matrix, and then invoke
  		the transform method with the same arguments.
  	*/
	setTransform: function(){
		this.m = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];

		this.transform.apply(this, arguments);
	},

	/*
		Property: matMult
			Method to multiply 3x3 matrice. Currently takes input and multiplies against
			the transform matrix and saves the result to the transform matrix.

			This is an optimized multiplication method. Will only multiply if the input
			value is not zero. Thus, minimizing multiplications and additions.
	*/
	matMult: function(b){
		var m = this.m,
			o = [[0, 0, 0],
				 [0, 0, 0],
				 [0, 0, 0]];

		for (var i = 3; i--;){
			var b0 = b[0][i], b1 = b[1][i], b2 = b[2][i];
			if (b0) this.sum(o[0], this.dotmult(b0, m[i]));
			if (b1) this.sum(o[1], this.dotmult(b1, m[i]));
			if (b2) this.sum(o[2], this.dotmult(b2, m[i]));
		}

		this.m = o;
	},

	dotmult: function(x,y){
		return y.map(function(val){ return x * val; });
	},

	sum: function(o,v){
		o[0] += v[0];
		o[1] += v[1];
		o[2] += v[2];
	}

});
/*
Script: Image.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({
	/*
	Property: drawImage
		This method is overloaded with three variants: drawImage(image, dx, dy),
		drawImage(image, dx, dy, dw, dh), and drawImage(image, sx, sy, sw, sh,
		dx, dy, dw, dh). (Actually it is overloaded with six; each of those three
		can take either an HTMLImageElement or an HTMLCanvasElement for the image
		argument.) If not specified, the dw and dh arguments default to the values
		of sw and sh, interpreted such that one CSS pixel in the image is treated
		as one unit in the canvas coordinate space. If the sx, sy, sw, and sh
		arguments are omitted, they default to 0, 0, the image's intrinsic width
		in image pixels, and the image's intrinsic height in image pixels,
		respectively.

		If the image is of the wrong type, the implementation must raise a
		TYPE_MISMATCH_ERR exception. If one of the sy, sw, sw, and sh arguments
		is outside the size of the image, or if one of the dw and dh arguments
		is negative, the implementation must raise an INDEX_SIZE_ERR  exception.

		The specified region of the image specified by the source rectangle
		(sx, sy, sw, sh) must be painted on the region of the canvas specified
		by the destination rectangle (dx, dy, dw, dh).

		Images are painted without affecting the current path, and are subject to
		transformations, shadow effects, global alpha, clipping paths, and global
		composition operators.
	*/
	drawImage: function (image){
		var args = arguments, length = args.length, off = (length == 9) ? 4 : 0;

		var irS = image.runtimeStyle, w0 = irS.width, h0 = irS.height;
		irS.width = 'auto';
		irS.height = 'auto';

		var w = image.width, h = image.height;
		irS.width = w0;
		irS.height = h0;

		var sx = 0, sy = 0, 
			sw = w, sh = h,
			dx = args[++off], dy = args[++off],
			dw = args[++off] || w, dh = args[++off] || h;

		if (length == 9){
			sx = args[1]; sy = args[2];
			sw = args[3]; sh = args[4];
		}

		var syh = sy / h, sxw = sx / w,
			m = this.m,
			Z = this.Z,
			d = $H(this.getCoords(dx, dy)).map(function(val){ return (val / Z).round(); });
		var props = (!m[0][1] && m[0][0] == 1) ?
			'top:' + d.y + ';left:' + d.x : [
			'filter:progid:DXImageTransform.Microsoft.Matrix(',
				'M11=', m[0][0], 'M12=', m[1][0],
				'M21=', m[0][1], 'M22=', m[1][1],
				'Dx=', d.x, 'Dy=', d.y, 
			')'
		].join(' ');
				
		this.element.insertAdjacentHTML('beforeEnd', [
			'<v:group style="', props, '" coordsize="', Z * 10, ',', Z * 10, '">',[
				'<v:image',
					'src=', image.src, 'style=width:' + Z * dw + ';height:' + Z * dh,
					'croptop=', syh,
					'cropright=', 1 - sxw - sw/w,
					'cropbottom=', 1 - syh - sh/h,
					'cropleft=', sxw,
				'/>'].join(' '),
			'</v:group>'
		].join(' '));
	},

	drawImageFromRect: Function.empty,

	/*
	Property: getImageData
		Method must return an ImageData object representing the underlying
		pixel data for the area of the canvas denoted by the rectangle which
		has one corner at the (sx, sy) coordinate, and that has width sw and
		height sh. Pixels outside the canvas must be returned as transparent
		black.
	*/
	getImageData: Function.empty,

	/*
	Property: putImageData
		Method must take the given ImageData structure, and draw it at the
		specified location dx,dy in the canvas coordinate space, mapping each
		pixel represented by the ImageData structure into one device pixel.
	*/
	putImageData: Function.empty

});
/*
Script: State.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({
	/*
	Property: states
		Each context maintains a stack of drawing states.
		Drawing states consist of:
			The current transformation matrix.
			The current clip region.
			The current values of the 'states'
	*/
	states: [
	    'arcScaleX',
	    'arcScaleY',
	    'currentX',
	    'currentY',
	    
		'strokeStyle',
		'fillStyle',
		'globalAlpha',
		'lineWidth',
		'lineCap',
		'lineJoin',
		'miterLimit',
		'shadowOffsetX',
		'shadowOffsetY',
		'shadowBlur',
		'shadowColor',
		'globalCompositeOperation'
	],

	/*
	Property: save
		Method pushes a copy of the current drawing state onto the drawing
		state stack.
	*/
	save: function(){
		var copy = {};
		this.states.each(function(prop){
			copy[prop] = this[prop];
		}, this);
		this.dStack.push(copy);
		this.mStack.push(this.m);
	},

	/*
	Property: restore
		Method pops the top entry in the drawing state stack, and resets
		the drawing state it describes. If there is no saved state, the method
		does nothing.
	*/
	restore: function(){
		var saved = this.dStack.pop();
		this.states.each(function(prop){
			this[prop] = saved[prop];
		}, this);
		this.m = this.mStack.pop();
	},

	mStack: [],
	dStack: []
});
/*
Script: Gradient.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Many thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({
	/*
	Property: createLinearGradient
		Method takes four arguments, representing the start point (x0, y0)
		and end point (x1, y1) of the gradient, in coordinate space units,
		and must return a linear CanvasGradient initialised with that line.

		Linear gradients must be rendered such that at the starting point
		on the canvas the color at offset 0 is used, that at the ending point
		the color at offset 1 is used, that all points on a line perpendicular
		to the line between the start and end points have the color at the point
		where those two lines cross (interpolation happening as described above),
		and that any points beyond the start or end points are a transparent black.
	*/
	createLinearGradient: function(x0, y0, x1, y1){
		return new CanvasGradient(x0, y0, x1, y1, this);
	},

	/*
	Property: createRadialGradient
		Method takes six arguments, the first three representing the start circle
		with origin (x0, y0) and radius r0, and the last three representing the
		end circle with origin (x1, y1) and radius r1. The values are in coordinate
		space units. The method must return a radial CanvasGradient initialised with
		those two circles.

		Radial gradients must be rendered such that a cone is created from the two
		circles, so that at the circumference of the starting circle the color at
		offset 0 is used, that at the circumference around the ending circle the
		color at offset 1 is used, that the circumference of a circle drawn a certain
		fraction of the way along the line between the two origins with a radius the
		same fraction of the way between the two radii has the color at that offset
		(interpolation happening as described above), that the end circle appear to
		be above the start circle when the end circle is not completely enclosed by
		the start circle, that the end circle be filled by the color at offset 1, and
		that any points not described by the gradient are a transparent black.
	*/
	createRadialGradient: function(x0, y0, r0, x1, y1, r1){
		return $extend(new CanvasGradient(x0, y0, x1, y1, this), {
			r0: r0,
			r1: r1
		});
	}

});

/*
Private Class: CanvasGradient
	CanvasGradient class for the gradients. Defines stops.

Arguments:
	x0  - (number) Coordinate "from" x-point
	y0  - (number) Coordinate "from" y-point
	x1  - (number) Coordinate "to" x-point
	y1  - (number) Coordinate "to" y-point
	ctx - (number) Context object to reference (for the processColor dependency). Temporary until proper color processing is implemented.
*/
var CanvasGradient = new Class({

	initialize: function(x0, y0, x1, y1, ctx){
		this.angle = ((y1 - y0) / ((x1 - x0).pow(2) + (y1 - y0).pow(2)).sqrt()).acos();
		this.ctx = ctx;
	},

	/*
	Property: addColorStop
		Method adds a new stop to a gradient. If the offset is less than
		0 or greater than 1 then an INDEX_SIZE_ERR exception must be raised.
		If the color cannot be parsed as a CSS color, then a SYNTAX_ERR
		exception must be raised. Otherwise, the gradient must be updated
		with the new stop information.
	*/
	addColorStop: function(off, col){
		col = this.processColor(col);

		if (off == 1 || off == 0){
			this['col' + off] = col;
		} else {
			if(!this.stops) this.stops = [];
			this.stops.push([off, col.color]);
		}
	},

	processColor: function(col){ //path
		var a = this.ctx.globalAlpha || 1;
		if (col.substr(0, 3) == 'rgb'){
			if (col.charAt(3) == "a") a*= col.match(/([\d.]*)\)$/)[1];
			col = col.rgbToHex();
		}
		return {
			color: col,
			opacity: a
		};
	}

});

/*
Script: Pattern.js

Dependencies:
	Canvas.js

Author:
	Olmo Maldonado, <http://ibolmo.com/>

Credits:
	Lightly based from Ralph Sommerer's work: <http://blogs.msdn.com/sompost/archive/2006/02/22/536967.aspx>
	Moderately based from excanvas: <http://excanvas.sourceforge.net/>
	Great thanks to Inviz, <http://inviz.ru/>, for his optimizing help.

License:
	MIT License, <http://en.wikipedia.org/wiki/MIT_License>
*/

CanvasRenderingContext2D.implement({

	/*
	Property: createPattern
		The first argument gives the image to use as the pattern (either
		an HTMLImageElement or an HTMLCanvasElement). Modifying this image
		after calling the createPattern() method must not affect the pattern.
		The second argument must be a string with one of the following values:
		repeat, repeat-x, repeat-y, no-repeat. If the empty string or null is
		specified, repeat must be assumed. If an unrecognised value is given,
		then the user agent must raise a SYNTAX_ERR exception. User agents
		must recognise the four values described above exactly (e.g. they must
		not do case folding). The method must return a CanvasPattern object
		suitably initialised.
	 */
	createPattern: function(img, rep){
		return new CanvasPattern(img, rep);
	}

});

/*
Class: CanvasPattern
	Patterns must be painted so that the top left of the first image is
	anchored at the origin of the coordinate space, and images are then
	repeated horizontally to the left and right (if the repeat-x  string
	was specified) or vertically up and down (if the repeat-y string was
	specified) or in all four directions all over the canvas (if the repeat
	string was specified). The images are not be scaled by this process;
	one CSS pixel of the image must be painted on one coordinate space unit.
	Of course, patterns must only actually painted where the stroking or
	filling effect requires that they be drawn, and are affected by the
	current transformation matrix.
*/
var CanvasPattern = new Class({

	initialize: function(img, rep){
		this.img = img;
		this.rep = rep;
	}

});
var UXPStack = new Class({
  
  mStack: [],
  
  mStackSize: 20,
  
  
  initialize: function(pStackSize) {
    
    if(pStackSize > 0) {
      this.setStackSize(pStackSize);
    }
    
    // nie uruchamiam automatycznego wysylania stacka po bledzie, gdyz zawaliloby nam to serwer
    // narazie trzeba umieszczac wywolanie wyslania w kopdzie w miejscach gdzie wystepuja konkretne bledy
    // window.addEvent('error', function() {
    //  this.report("On error stack send");
    // }.bind(this));
  },
          
  setStackSize: function(pSize) {
    this.mStackSize = pSize;
  },
  
  addToStack: function(pData) {
    this.mStack.push(pData);
    
    // usun stare wpisy
    if(this.mStack.length > this.mStackSize) {
      this.mStack.splice(0, this.mStack.length - this.mStackSize);
    }
  },
  
  getStack: function() {
    return this.mStack;
  },
  
  clearStack: function() {
    this.mStack = [];
  },
  
  report: function(pMessage, pParams) {
    var stack = this.getStack();
    var stack_parsed = [];
    
    stack.each(function(pStacked) {
      var stacked = {'action': pStacked.action, 'params': []};
      
      pStacked.params && pStacked.params.each(function(pParam) {
        try {
          JSON.encode(pParam);
          stacked.params.push(pParam);
        }
        catch(e) {
          stacked.params.push('_callback_');
        }
      });
      
      stack_parsed.push(stacked);
    });
    
    new Dejax().send({
      mode: 'queue',
      url: '/ajax/dmsUXPStack/Report/',
      data: {
        'message': pMessage,
        'params': pParams,
        'stack': stack_parsed
      },
      onComplete: this.clearStack.bind(this)
    });
  }
  
}).extend({
  
  mInstance: null,
          
  instance: function() {
    if(null == UXPStack.mInstance) {
      UXPStack.mInstance = new UXPStack();
    }
    
    return UXPStack.mInstance;
  },     
  
  add: function(pAction, pParams) {
    UXPStack.instance().addToStack({
      'url': document.URL,
      'action': pAction,
      'params': pParams
    });
  },
          
  getClean: function() {
    var stack = dpManager.uxpStack.getStack();
    UXPStack.instance().clearStack();
    
    return stack;
  }, 
  
  error: function(pMessage, pParams) {
    UXPStack.instance().report(pMessage, pParams);
  },
  
  parseStackParamRecursive: function(pStackParam) {
    var param = null;
    
    if(typeof pStackParam === 'object') {
      param = {};
      
      new Hash(pStackParam).each(function(pValue, pKey) {
        param[pKey] = UXPStack.parseStackParamRecursive(pValue);
      });
    }
    else if(typeof pStackParam === 'function') {
      param = '_callback_';
    }
    else {
      param = pStackParam;
    }
    
    return param;
  }
  
});


;(function UXPConnection_Scope(global) {
  'use strict';

  var LSKEY;

  var UXPConnection = new Class({

    Implements: [Events],

    mConnected: false,

    mTesting: false,

    mIcon: null,

    mDisconnections: [],


    initialize: function() {
      window.addEventListener('online', this.setConnected.bind(this));

      window.addEventListener('offline', function() {
        this.setDisconnected('OFFLINEEVENT');
      }.bind(this));

      // załaduj ikonke offline (gdy juz zabraknie polaczenia, to przeciez jej nie sciagniemy)
      this.mIcon = new Image();
      this.mIcon.src = '/p/disconnected.png';
    },

    observe: function() {
      LSKEY = 'disconnected_' + dpManager.DataForCollaboration.user_id;
      var stored = JSON.parse(lscache.get(LSKEY));

      if (stored && typeof stored == 'object') {
        this.mDisconnections = stored;
      }
    },

    isConnectionAlive: function(pCallbacks, pPeriod) {
      var callbacks = new Hash({
        'onTrue': $empty,
        'onFalse': $empty
      }).extend(pCallbacks || {});

      // Jesli polaczenie jest juz w trakcie testowania, to podane callbacki podajemy do wywolania w przypadku polaczenia/rozłaczenia (event rozłączenia raczej nie nastąpi, więc ten callback jest raczej bezuzyteczny)
      if(this.mTesting) {

        var onTrueRef = function() {
          callbacks.onTrue();
          this.removeEvent('connect', onTrueRef);
        }.bind(this);

        var onFalseRef = function() {
          callbacks.onTrue();
          this.removeEvent('disconnect', onFalseRef);
        }.bind(this);

        this.addEvent('connect', onTrueRef);
        this.addEvent('disconnect', onFalseRef);

        return;
      }

      // Referencja do funkcji testującej połączenie (w przypadku braku polaczenia wywołuje sama siebie jeśli podano pPeriod)
      var checkRef = function() {
        var online = window.navigator.onLine;
        this.mTesting = true;

        if(!online) {
          callbacks.onFalse();

          if(pPeriod > 0) {
            checkRef.delay(pPeriod, this);
          }
        }
        else {
          this.test({
            'onTrue': function() {
              this.mTesting = false;
              callbacks.onTrue();
            }.bind(this),
            'onFalse': function() {
              callbacks.onFalse();

              if(pPeriod > 0) {
                this.mTesting = true;
                checkRef.delay(pPeriod);
              }
            }.bind(this)
          });
        }
      }.bind(this);

      // rozpocznij
      checkRef();
    },

    test: function(pCallbacks) {
      var callbacks = new Hash({'onTrue': $empty, 'onFalse': $empty}).extend(pCallbacks || {});
      var shout = 'Knock knock, anybody home ' + new Date().getTime() + ' ?';

      new Dejax().send({
        'mode': 'cancel',
        'url': '/ajax/dmsUXPConnection/Test/',
        'data': {
          'id_page': dpManager ? dpManager.dpPageInspector.getActivePageID() : false,
          'shout': shout
        },
        'onComplete': function(pResponse) {
          if(pResponse && pResponse.echo === shout) {
            this.setConnected();

            if(typeof callbacks.onTrue == 'function') {
              callbacks.onTrue();
            }
          }
          else {
            this.setDisconnected('CONNECTIONTESTFAIL');

            if(typeof callbacks.onFalse == 'function') {
              callbacks.onFalse();
            }
          }
        }.bind(this)
      });
    },

    isConnected: function() {
      return this.mConnected;
    },

    setConnected: function(pFireEvent) {

      if (this.mDisconnections.length > 0) {
        this.logDebug();

        // clear the array
        this.mDisconnections = [];
        lscache.set(LSKEY, this.mDisconnections);
      }

      if (this.isConnected()) {
        return;
      }

      var fire_event = typeof pFireEvent == 'undefined' || pFireEvent;
      this.mConnected = true;

      if (fire_event) {
        this.fireEvent('connect');
      }
    },

    logDebug: function() {
      var disconnections = this.mDisconnections.slice();
      var disconnection_time = (Date.now() - disconnections[0].time) / 1000;

      var notification = function() {
        RollbarNotifier.handleMessage({
          msg: 'User Offline',
          level: 'debug',
          original_source: disconnections[0].source,
          offline_time: disconnection_time,
          disconnections: disconnections
        });
      };

      // if editor just loaded, real RollbarNotifier is not loaded yet, wait some time
      if (!RollbarNotifier.accessToken) {
        setTimeout(notification, 2500);
      } else {
        notification();
      }
    },

    /**
     * Sets application to offline mode
     *
     * @param pFireEvent [TRUE] If not to fire 'disconnect' event, provide false. If string provided, event will be fired with pFireEvent as parameter
     */
    setDisconnected: function(pFireEvent) {

      this.mDisconnections.push({
        'source': pFireEvent,
        'time': Date.now(),
        'id_user': parseInt(dpManager.DataForCollaboration.user_id, 10),
        'id_page': dpManager.dpPageInspector ? parseInt(dpManager.dpPageInspector.getActivePageID(), 10) : null
      });

      lscache.set(LSKEY, this.mDisconnections);

      if (false === this.isConnected()) {
        return;
      }

      var fire_event = typeof pFireEvent == 'undefined' || pFireEvent;
      this.mConnected = false;

      if (fire_event) {
        this.fireEvent('disconnect', [pFireEvent]);
      }
    }

  });

  global.UXPConnection = UXPConnection;

})(window);

var StickyNotes = new Class({
  
  mWidth: 0,
  mHeight: 0,
  mCanvasElement: null,
  mCTX: null,
  mTextElement: null,
  mContainerElement: null,
  mColorSet: 'yellow',
  
  mColorSets: {
    'yellow': {
      'base_color': '#FFE605',
      'header_saturation': 59
    },
    'orange': {
      'base_color': '#FF6A00',
      'header_saturation': 47
    },
    'green': {
      'base_color': '#71FF58',
      'header_saturation': 55
    },
    'pink': {
      'base_color': '#ff55aa',
      'header_saturation': 47
    },
    'blue': {
      'base_color': '#46D6F1',
      'header_saturation': 55
    }
  },
  
  initialize: function(pWidth, pHeight){
    
    this.mCanvasElement = new Canvas();
    this.mContainerElement = new Element('div', {'class': 'StickyNote'});
    this.mCanvasElement.injectInside(this.mContainerElement);
    this.mTextElement = new Element('span').injectInside(this.mContainerElement);
    
    this.mCanvasElement.setStyles({
      'position': 'absolute',
      'left': 0,
      'top': 0
    });
    
    this.mCTX = this.mCanvasElement.getContext('2d');
    
    this.setWidth(pWidth);
    this.setHeight(pHeight);
    
    this.refreshView();
    
    return this;
  },
  
  setWidthHeight: function(pWidth, pHeight) {
    this.mWidth = parseInt(pWidth);
    if(this.mWidth < 50){
      this.mWidth = 50;
    }
    this.mHeight = parseInt(pHeight);
    if(this.mHeight < 50){
      this.mHeight = 50;
    }
    this.mCanvasElement.set('width', this.mWidth);
    this.mCanvasElement.set('height', this.mHeight);
    this.refreshView();
  },
  
  setWidth: function(pWidth){
    this.mWidth = parseInt(pWidth);
    if(this.mWidth < 50){
      this.mWidth = 50;
    }
    this.mCanvasElement.set('width', this.mWidth);
    this.refreshView();
    
    return this;
  },
  
  setHeight: function(pHeight){
    this.mHeight = parseInt(pHeight);
    if(this.mHeight < 50){
      this.mHeight = 50;
    }
    this.mCanvasElement.set('height', this.mHeight);
    this.refreshView();
        
    return this;    
  },
  
  drawNote: function(){
    
    if (!this.mHeight || !this.mWidth) {
      return;
    }
    
    // Czysci caly canvas
    this.mCTX.clearRect(0,0,this.mWidth,this.mHeight);
    
    // Cien
    var shadowBlur = 4;
    var cornerRadius = 3;
    var shadowOffset = {'x': 5, 'y': 5};
    
    for (var x = 0; x <= shadowBlur; x++) {
      this.roundedRect(
        this.mCTX,
        shadowOffset.x + 1 + x,
        shadowOffset.y + 1 + x,
        this.mWidth - (x * 2) - shadowOffset.x - 4,
        this.mHeight - (x * 2) - shadowOffset.y - 4,
        cornerRadius + (shadowBlur - x),
        [70, 70, 70],
        x == shadowBlur ? .1 : .03 + (x * .04)
      );
    }
    
    var gradient = this.mCTX.createLinearGradient(0, 0, 0, this.mHeight);
    
    var color_to = this.mColorSets[this.mColorSet].base_color;
    var color_from = new Color(color_to).setSaturation(23);    
    
    gradient.addColorStop(0, color_from.rgbToHex());
    gradient.addColorStop(1, color_to);
    
    // hack dla Chrome'a - cien nadpisujemy solid blockiem, dopiero po tym nakladamy gradient
    this.mCTX.fillStyle = this.mColorSets[this.mColorSet].base_color;
    this.mCTX.fillRect(8, 8, this.mWidth - 16, this.mHeight - 16);
    
    this.mCTX.fillStyle = gradient;

    // Glowny prostokat
    this.mCTX.fillRect(8, 8, this.mWidth - 16, this.mHeight - 16);
    
    // Naglowek
    var header_color = new Color(this.mColorSets[this.mColorSet].base_color).setSaturation(this.mColorSets[this.mColorSet].header_saturation);
        
    this.mCTX.fillStyle = header_color.rgbToHex();
    this.mCTX.fillRect(8, 8, this.mWidth - 16, 24);
    
    return this;
  },
  
  refreshView: function(){
    
    this.mContainerElement.setStyles({'width': this.mWidth, 'height': this.mHeight});
    this.drawNote();
    
    return this;
  },
  
  getCanvasElement: function(){
    return this.mContainerElement;
  },
  
  setText: function(pText){
    
    var text = pText.split('\n');
    var html = '<div class="StickyNoteHeader">' + text.shift() + '</div>' + text.join('<br/>');
    
    this.mTextElement.set('html', html);
    
    return this;
  },
  
  setColor: function(pColorSet){
    this.mColorSet = pColorSet.toLowerCase();
    this.refreshView();
    
    return this;
  },
  
  roundedRect: function(ctx, x, y, width, height, radius, rgb, a){
      ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + height - radius);
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
      ctx.lineTo(x + width - radius, y + height);
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      ctx.lineTo(x + width, y + radius);
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
      ctx.fill(); 
    }
  
});
/*
Script: mootreeWithDDandKeyNav.js
    My Object Oriented Tree
    - Developed by moro magmoro@mail.ru, based on MooTree rev.16 by Rasmus Schultz
    - Tested with MooTools release 1.11, under Firefox 2 IE6 and Opera9.

License:
    MIT-style license.

Credits:
    MooTree rev.16 by Rasmus Schultz, http://www.mindplay.dk/mootree
*/

var MooTreeIcon = ['I','L','Lminus','Lplus','Rminus','Rplus','T','Tminus','Tplus','_closed','_doc','_open','minus','plus'];

/*
Class: MooTreeControl
    This class implements a tree control.

Properties:
    root - returns the root <MooTreeNode> object.
    selected - returns the currently selected <MooTreeNode> object, or null if nothing is currently selected.

Events:
    onExpand - called when a node is expanded or collapsed: function(node, state) - where node is the <MooTreeNode> object that fired the event, and state is a boolean meaning true:expanded or false:collapsed.
    onSelect - called when a node is selected or deselected: function(node, state) - where node is the <MooTreeNode> object that fired the event, and state is a boolean meaning true:selected or false:deselected.
    onClick - called when a node is clicked: function(node) - where node is the <MooTreeNode> object that fired the event.
    onReplace - event fired when u replace node. Takes 3 parameters - [fromNode,toNode,where]. ( where='after' || 'before' || 'inside')

Options:
    div - a string representing the div Element inside which to build the tree control.
    mode - optional string, defaults to 'files' - specifies default icon behavior. In 'files' mode, empty nodes have a document icon - whereas, in 'folders' mode, all nodes are displayed as folders (a'la explorer).
    
    - boolean, defaults to false. If set to true, a grid is drawn to outline the structure of the tree.
    
    theme - string, optional, defaults to 'mootree.png' - specifies the 'theme' GIF to use.
    
    loader - optional, an options object for the <MooTreeNode> constructor - defaults to {icon:'mootree_loader.gif', text:'Loading...', color:'a0a0a0'}
    
    nodeOptions - node options
    
    draggable - mozliwe jest przenoszenie elementow pomiedzy galeziami drzewa

    openclosesave (boolean) true - bedzie zapisywane do Cookie czy galaz byla otwarta i przywracane, domyslnie wylaczone (false)
    
    onExpand - optional function (see Events above)
    onSelect - optional function (see Events above)
    onClick - optional function (see Events above)//deprecated. will be removed or changed soon.
    onReplace - optional function (see Events above)
    onNodeDrop - wykonywany po prawidlowym upuszczeniu w nowym miejscu elementu (przy draggable = true)

Note: for scrolling(when div has overflow) i'm use fixed version of Fx.Scroll (see source code of my mootools version)
*/

var MooTreeControl = new Class({

  Implements: [Options, Events],
  
    options:{
        onExpand: $empty,
        onSelect: $empty,
        onClick: $empty,
        onReplace: $empty,
        onAddComponent: $empty,
        onNodeDrop: $empty,
        theme : 'mootree.png',
        draggable: false
    },
    
    initialize: function(options) {
      UXPStack.add('MooTreeControl.initialize', [options]);
      
        //this.initGarbageCollector();
        this.setOptions(options);
        var options=this.options;
        this.div=$(this.options.div)          // tells the root node which div to insert itself into
        var nodeOptions = $extend(options.nodeOptions,{'div' : this.div})
        this.root = new MooTreeNode(nodeOptions, this); // create the root node of this tree control
        this.root.addInTree();
        this.index = {};            // used by the get() method
        this.enabled = true;                  // enable visual updates of the control

        if (true === options.draggable) {
          this.DDinit();
        }
        this.theme = options.theme;

        this.loader = options.loader || {icon:'mootree_loader.gif', text:'Loading...', color:'#a0a0a0'};

        this.selected = null;                 // set the currently selected node to nothing
        this.mode = options.mode;              // mode can be "folders" or "files", and affects the default icons
        this.grid = options.grid;              // grid can be turned on (true) or off (false)

        this.root.update(true);
        //this.keyNavigation();//implement key navigation. Walk with ['up','down','left','right'] keys.
    },
    
    
    /*
    Property: select
        Sets the currently selected node.
        This is called by <MooTreeNode> when a node is selected (e.g. by clicking it's title with the mouse).
    
    Parameters:
        node - the <MooTreeNode> object to select.
    */
    
    select: function(node, dontfireevent) {

        if (true !== dontfireevent) {
          this.fireEvent('onClick',[node]);node.fireEvent('onClick'); // fire click events ???
        }
        
        if (this.selected === node) return; // already selected
        if (this.selected) {
            // deselect previously selected node:
            this.selected.select(false);
            if (true !== dontfireevent) {
              this.fireEvent('onSelect',[this.selected, false]);
            }
        }
        // select new node:
        this.selected = node;
        
        if (false !== node) {
          node.select(true, dontfireevent);
        }
        
        if (true !== dontfireevent) {
          this.fireEvent('onSelect',[node, true]);
        }
    },
    
    /*
    Property: expand
        Expands the entire tree, recursively.
    */
    
    expand: function() {
        this.root.toggle(true, true);
    },

    /*
    Property: collapse
        Collapses the entire tree, recursively.
    */

    collapse: function() {
        this.root.toggle(true, false);
    },
    
    /*
    Property: get
        Retrieves the node with the given id - or null, if no node with the given id exists.
    
    Parameters:
        id - a string, the id of the node you wish to retrieve.
    
    Note:
        Node id can be assigned via the <MooTreeNode> constructor, e.g. using the <MooTreeNode.insert> method.
    */
    
    get: function(id) {
        return this.index[id] || null;
    },
    
    /*
    Property: adopt
        Adopts a structure of nested ul/li/a elements as tree nodes, then removes the original elements.
    
    Parameters:
        id - a string representing the ul element to be adopted, or an element reference.
        parentNode - optional, a <MooTreeNode> object under which to import the specified ul element. Defaults to the root node of the parent control.
    
    Note:
        The ul/li structure must be properly nested, and each li-element must contain one a-element, e.g.:
        
        ><ul id="mytree">
        >  <li><a href="test.html">Item One</a></li>
        >  <li><a href="test.html">Item Two</a>
        >    <ul>
        >      <li><a href="test.html">Item Two Point One</a></li>
        >      <li><a href="test.html">Item Two Point Two</a></li>
        >    </ul>
        >  </li>
        >  <li><a href="test.html"><!-- icon:_doc; color:#ff0000 -->Item Three</a></li>
        ></ul>
        
        The "href", "target", "title" and "name" attributes of the a-tags are picked up and stored in the
        data property of the node.
        
        CSS-style comments inside a-tags are parsed, and treated as arguments for <MooTreeNode> constructor,
        e.g. "icon", "openicon", "color", etc.
    */
    
    adopt: function(id, parent) {
        if (parent === undefined) parent = this.root;
        this.disable();
        this._adopt(id, parent);
        parent.update(true);
        $(id).destroy();
        this.enable();
    },
    
    _adopt: function(id, parent) {
        /* adopts a structure of ul/li elements into this tree */
        $(id).getChildren()
        .each(function(child){
            if (child.get('tag') != 'li') return false;
            var config={text:''}, comment='', subuls=[];
            child.getChildren().each(function(child){
                switch ( child.get('tag') ) {
                    case 'a':
                        $A(child.childNodes).each(function(child){
                            switch ( child.nodeName ) {
                                case '#text':config.text += child.nodeValue;break;
                                case '#comment':comment += child.nodeValue;break;
                            }
                        });
                        config.data = child.getProperties('href','target','title','name');
                        break;
                    case 'ul':
                        subuls.push(child);
                        break;
                }
            });
            
            config.data.url = config.data['href']; // (for backwards compatibility)
            
            if (comment != '') {
                comment.split(';')
                .each(function(propValue){
                    var propValueArray=propValue.split(':');
                    if(propValueArray.length == 2) config[propValueArray[0].trim()]=propValueArray[1].trim();
                });
            }
            
            var node = parent.insert(config);
            if(subuls.length){
                subuls.each(function(subul){
                    this._adopt(subul, node);
                }.bind(this));
            }
        }.bind(this));
    },
        
    /*
    Property: disable
        Call this to temporarily disable visual updates -- if you need to insert/remove many nodes
        at a time, many visual updates would normally occur. By temporarily disabling the control,
        these visual updates will be skipped.
        
        When you're done making changes, call <MooTreeControl.enable> to turn on visual updates
        again, and automatically repaint all nodes that were changed.
    */
    
    disable: function() {
        this.enabled = false;
    },
    
    /*
    Property: enable
        Enables visual updates again after a call to <MooTreeControl.disable>
    */

    enable: function() {
        this.enabled = true;
        this.root.update(true, true);
    },
    
    keyNavigation: function(){
        this.div.addEvent('keydown',function(event){
            var event=new Event(event);
            if(!this.scrolled){
                if(!this.selected){
                    this.select(this.root);
                }else{
                    var current=this.selected;
                    switch (event.key){
                        case 'down':this.goForward(current);break;  
                        case 'up':this.goBack(current);break;   
                        case 'left':this.goLeft(current);break;
                        case 'right':this.goRight(current);break;
                    }
                    
                }
                this.chkOverflow();
            }
            event.stop();
        }.bind(this));
    },
    
    goForward: function(current){
        var forward=current.getForward();
        if( forward ) this.select(forward)
    },
    
    goBack: function(current){
        var back=current.getBack();
        if (back) this.select(back);
    },
    
    goLeft: function(current){
        if(current.isRoot()){
            if(current.open){
                current.toggle(false);
            }else{
                return false;
            }
        }else{
            if( current.nodes.length && current.open ){
                current.toggle(false);
            }else{
                return this.select(current.parent);
            }
        }
    },
    
    goRight: function(current){
        if(!current.nodes.length){
            return false;
        }else if(!current.open){
            return current.toggle(false);
        }else{
            return this.select(current.getFirst());
        }
    },
    
    setSortedNodes: function(pNode) {
      
      if (!pNode) {
        pNode = this.root;
        this.sort_order = {};
      }
      
      pNode.nodes.each(function(node) {
        this.sort_order[node.id+" "] = node.parent.id;
        this.setSortedNodes(node);
      }, this);
    },
    
    /**
     * Zwraca wygenerowana kolejnosc w drzewie, dzieki czemu mozna ustawic kolejnosc np. w bazie danych
     */
    getSortedNodes: function() {
      this.setSortedNodes();
      return this.sort_order;
    },
    
    /**
     * Ustawia dane potrzebne do wyciagniecia plaskiego drzewa
     */
    setFlatTree: function(pNode) {
      
      pNode.nodes.each(function(node) {
        this.flat_tree.push(node);
        this.setFlatTree(node);
      }, this);
    },
    
    /**
     * Pobiera drzewko w wersji "flat" zaczynajac od node'a node
     *
     * @param string pStartNode id node;a od ktorego ma zostac rozpoczete pobieranie (jesli puste to zaczyna od root'a)
     * @return array
     */
    getFlatTree: function(pStartNode) {
      
      var node = null;
      this.flat_tree = [];
      
      if (pStartNode && this.get(pStartNode)) {
        node = this.get(pStartNode);
      }
      else {
        node = this.root;
      }
      
      this.setFlatTree(node);
      
      return this.flat_tree;
    },
    
    replace: function(from,to,where){
        if ( from.replaceTo(to,where) ){
            this.fireEvent('onReplace',[from,to,where]);
        }
    },
    
    chkOverflow: function(){//still there is some issues
      
        // Wylaczenie scrollowania - nie dziala za dobrze w JP (powoduje dziwne zachowania podczas przeciagania)
        return;
        
        if (!this.selected) return;
      
        var treeCoords=this.div.getCoordinates();
        var current=this.selected;
        var node=current.divs.node;
        var text=current.divs.text;
        var TextPosition=text.getPosition([this.div]);
        var NodePosition=node.getPosition([this.div]);
        var hide=[];
        var size=this.div.getSize();
        var scroll=this.div.getScroll();
        var scrollHeight=(size.x - scroll.x > 18 ? 0 : 25);
        if( NodePosition.y +node.offsetHeight + scrollHeight> treeCoords.bottom ) hide.push('bottom');
        if( NodePosition.y - node.offsetHeight+2 < treeCoords.top ) hide.push('top');
        if( TextPosition.x +text.offsetWidth> treeCoords.right ) hide.push('right');
        if( NodePosition.x < treeCoords.left ) hide.push('left');

        if( hide.length > 0 ){
            this.scrolled=true;
            var scroll=new Fx.Scroll(this.div,{
                overflown: [this.div],
                onComplete:function(){this.scrolled=false;}.bind(this)
            });
            if( hide.contains('top') ) {
                var back=current.getBack();
                if( back ) {
                    scroll.toElement(back.divs.node);
                }else{
                    scroll.toElement(node);
                }
            }else if( hide.contains('bottom') ){
                scroll.scrollTo(scroll.x,scroll.y+node.offsetHeight);
            }else{
                scroll.toElement(node);
            }
        }
    },
    
    initGarbageCollector: function(){
        //memoryLeakFix
        this.GarbageCollector=[];
        window.addListener('beforeunload', function(){
            window.addListener('unload', function(){this.GarbageCollector.each(function(el){el.treeNode=null})}.bind(this));
        }.bind(this));
    },
    
    DDinit: function(){
        this.mouse={
                down:false,
                drag:false
               };
        this.DDnotAllowed=[];
        this.DDinjectEvents();
        this.DDEvents();
        this.DDfixUp();
    },
    
    DDEvents: function(){
      this.div.addEvents({
        'mousedown' : this.DDdownEvent.bindWithEvent(this),
        'mouseup' : this.DDupEvent.bind(this)
      });

      document.addEvent('mousemove', this.DDmoveEvent.bindWithEvent(this));
    },

    DDdownEvent: function(event){
        var event=new Event(event);
        var node = this.DDfindNode(event.target);
        if (!node || false === node.treeNode.options.draggable) return;
        this.DDworkbenchDroppable = node.treeNode.options.workbenchDroppable || false;
        this.mouse.down=true;
        event.stop();
    },
    
    DDupEvent: function(){
        if (this.mouse.down && this.mouse.drag) {
          if(this.DDghost && this.DDghost.destroy){
          this.DDghost.destroy();
          }
          this.DDclean();
          !this.DDexternalUp ? this.DDreplace() : this.DDexternalUp=false;

          if(true === this.DDAddComponent && true === this.DDworkbenchDroppable){
            this.fireEvent('onAddComponent', [this.DDnode, this.mouse.x, this.mouse.y]);
          }
          else if (this.DDinject[0] != 'notAllowed') {
            this.fireEvent('onNodeDrop');
          }
        }
        this.DDworkbenchDroppable=false;
        this.DDAddComponent=false;
        this.mouse.down=false;
        this.mouse.drag=false;
    },
    
    DDmoveEvent: function(event){
        this.mouse.x = event.page.x;
        this.mouse.y = event.page.y;
        
        if(!this.mouse.down) 
          return true;
        
        var event=new Event(event);
        
        if( !this.mouse.drag ) 
          this.DDaddGhost(event);
        
        var target=this.DDfindNode(event.target);
        
        if ( !target ) 
          return true;
        
        target.treeNode.open = true;
        
        //if( !target.selected ) this.select(target.treeNode);
        if ( !this.scrolled ) 
          this.chkOverflow();
        
        this.DDgetDropPlace(event);
    },
    
    DDfixUp: function(){
        document.addEvent('mouseup',function(){
            if(this.mouse.down && this.mouse.drag){
                this.DDexternalUp=true;
                this.div.fireEvent('mouseup');
            }
        }.bind(this));
    },
    
    
    DDinjectEvents: function(){
        ['After', 'Before', 'Inside', 'NotAllowed'].each(function(where){
          this.addEvent('onDDinject'+where, this.DDinjectEvent.bind(this));
        }.bind(this));
    },

    DDinjectEvent: function(where,target){
        if(true === this.DDworkbenchDroppable){
          where = 'notAllowed';
        }
        if([where,target].eq(this.DDinject)) return;
        this.DDclean();
        this.DDinject=[where,target];
        switch(where){
            case 'before':
            case 'after' :
                var side=(where=='after' ? 'bottom' : 'top');
                this.DDinjector=new Element('div',{'styles':
                    {
                    position:'absolute',
                    left:0,
                    width:18,
                    height:0,
                    'border-top':'solid 2px #888',
                    overflow:'hidden',
                    cursor:'default',
                    'z-index':100
                    }
                })
                .setStyle(side,0)
                .injectInside(this.DDinject[1]);
                break;
            case 'inside':
                var text=target.getLast();
                this.DDinside=text;
                var node=target.treeNode;
                
                if(!node.options.last_node) {
                  text.setStyle('background-color','#DDD');
                }
                
                if(!node.open && !this.DDopenTimer){
                    target.setStyle('cursor','progress');
                    text.setStyle('cursor','progress');
                    this.DDopenTimer=function(node){
                        node.toggle(false,true);
                        this.DDopenTimer=false;
                        this.DDinside.setStyle('cursor','default');
                        this.DDinside.getParent().setStyle('cursor','default')
                    }.delay(600,this,[node])
                }
                break;
            case 'notAllowed' :
                this.DDnotAllowed.push(target);
                this.DDnotAllowed.push(target.getLast());
                if(!target.oldCursor) target.oldCursor=target.getStyle('cursor');
                target.setStyle('cursor','default');
                if(!target.getLast().oldCursor) target.getLast().oldCursor=target.getLast().getStyle('cursor');
                target.getLast().setStyle('cursor','default');
        }
    },

    DDclean: function(){
        if(this.DDinside){
            this.DDinside.setStyles({
                'border' : 'none',
                'background-color': 'transparent',
                'cursor' : 'default'
            });
            this.DDinside=false;
        }
        if(this.DDnotAllowed.length>0){
            this.DDnotAllowed.each(function(el){
                el.setStyle('cursor',el.oldCursor);
            });
            this.DDnotAllowed=[];
        }
        if(this.DDinjector){
            try{this.DDinjector.destroy()}catch(e){};
            this.DDinjector=false;
        }
        if(this.DDopenTimer){
            $clear(this.DDopenTimer);
            this.DDopenTimer=false;
        }
    },
    
    DDfindNode: function(el){
        if(el.get('tag') == 'body') return false;
        do{
            if(el.get('tag') == 'body'){return false;}
            if(true === this.DDworkbenchDroppable && 'WorkBench' == el.getProperty('id')){
              this.DDAddComponent = true;
              return false;
            }
            if(el.treeNode) return el;
        }while( el=el.getParent() )
    },
    
    DDaddGhost: function(event){
        
        if (!this.selected) return false;
      
        var node=this.DDfindNode(event.target);
        if(node){
            this.DDnode=node.treeNode;
            var clone=node.clone(true)
            .injectInside($(document.body))
            .setStyles({
                position:'absolute',
                left:event.page.x+20,
                top:event.page.y+20,
                opacity:0.85,
                'background-color': '#FFF',
                width:node.getFirst().offsetWidth+node.getLast().offsetWidth,
                height:node.offsetHeight,
                'z-index': 10000
            });
            clone.makeDraggable({
                onComplete: function(){
                    var el=this.element;
                    if(el){try{el.destroy()}catch(e){};}
                }
            }).start(event);
            this.DDghost=clone;
        }
        this.mouse.drag=true;
    },
    
    DDgetDropPlace: function(event){
       
        if (!this.selected) return;
      
        var target = this.DDfindNode(event.target);

        if (target){
            this.DDtargetNode=target.treeNode;
            var height=target.offsetHeight;
            var top=target.getPosition([this.div]).y;
            var bottom=top+height;
            
            if (event.page.y-top<1/4*height && !this.DDtargetNode.isRoot() && false !== this.DDtargetNode.options.allow_drop_sort && !this.DDnode.contain(this.DDtargetNode)){
              this.fireEvent('onDDinjectBefore',['before',target]);
            }
            else if(bottom-event.page.y<1/4*height && !this.DDtargetNode.isRoot() && false !== this.DDtargetNode.options.allow_drop_sort && !this.DDnode.contain(this.DDtargetNode)) { 
              this.fireEvent('onDDinjectAfter',['after',target]);
            }
            else {
              if (this.DDtargetNode.options.DDtype=='file' || (this.DDtargetNode.isRoot() && (event.page.y-top<1/4*height || bottom-event.page.y<1/4*height)) || this.DDnode.contain(this.DDtargetNode)) {
                this.fireEvent('onDDinjectNotAllowed',['notAllowed',target]);
              }
              // Dooshek - nowa opcja dla node'a - allow_drop - jesli true to (domyslnie) pozwala na upuszczenie elementu na ten element
              else if (false === this.DDtargetNode.options.allow_drop) {
                this.fireEvent('onDDinjectNotAllowed',['notAllowed',target]);
              }
              else {
                this.fireEvent('onDDinjectInside',['inside',target]);
              }
            }
        }
        else{
          this.DDclean();
          this.DDinject=null;
        }
    },
    
    DDreplace: function(){
        if(this.DDtargetNode && this.DDnode && this.DDinject){
            if(this.DDinject[0]=='notAllowed') return;
            
            // jesli node jest ustawiony jako ostatni to takim ma pozostac
            // to pewnie bedzie dzialac tylko dla nodow podpietych do roota
            if(this.DDtargetNode.options.last_node) {
              this.DDtargetNode = this.DDtargetNode.getPrevious()
              this.DDinject[1] = this.DDtargetNode.divs.node
            }
            
            this.replace(this.DDnode,this.DDtargetNode,this.DDinject[0]);
            this.DDtargetNode=false;
            this.DDnode=false;
        }
    },

    /**
     * Usuwa i czysci po sobie smieci
     */
    remove: function() {
      this.selected = null;
      this.root.nodes.empty();
      this.options.div.destroy();
      this.options.div = null;
      for(var i in this.root.divs) {
        this.root.divs[i].destroy();
      }
      this.root.divs = null;
      this.div.destroy();
      this.div = null;
      this.options = null;
    }
    
});

/*
Class: MooTreeNode
    This class implements the functionality of a single node in a <MooTreeControl>.

Parameters:
    options - an object. See options below.

Options:
    text - this is the displayed text of the node, and as such as is the only required parameter.
    id - string, optional - if specified, must be a unique node identifier. Nodes with id can be retrieved using the <MooTreeControl.get> method.
    color - string, optional - if specified, must be a six-digit hexadecimal RGB color code.
    
    open - boolean value, defaults to false. Use true if you want the node open from the start.
    
    icon - use this to customize the icon of the node. The following predefined values may be used: '_open', '_closed' and '_doc'. Alternatively, specify the URL of a GIF or PNG image to use - this should be exactly 18x18 pixels in size. If you have a strip of images, you can specify an image number (e.g. 'my_icons.gif#4' for icon number 4).
    openicon - use this to customize the icon of the node when it's open.
    
    data - an object containing whatever data you wish to associate with this node (such as an url and/or an id, etc.)
    
    DDtype - if DDtype='file' u can't replace nodes inside this.
    
    
Events:
    onExpand - called when the node is expanded or collapsed: function(state) - where state is a boolean meaning true:expanded or false:collapsed.
    onSelect - called when the node is selected or deselected: function(state) - where state is a boolean meaning true:selected or false:deselected.
    onClick - called when the node is clicked (no arguments).
*/

var MooTreeNode = new Class({

  Implements: [Options, Events],
  
    options:{
        onExpand: $empty,
        onSelect: $empty,
        onClick: $empty,
        hide_tree_icon: false,
        class_name: null,
        selectable: true,
        last_node: false
    },
    
    initialize: function(options, control) {
      UXPStack.add('MooTreeNode.initialize', [options, control]);

        this.setOptions(options);
        var options=this.options;
        this.text = options.text;       // the text displayed by this node
        this.id = options.id || null;   // the node's unique id
        this.nodes = new Array();       // subnodes nested beneath this node (MooTreeNode objects)
        this.parent = null;             // this node's parent node (another MooTreeNode object)
        this.control = control; // owner control of this node's tree
        this.selected = false;          // a flag telling whether this node is the currently selected node in it's tree
        
        this.color = options.color || null; // text color of this node
        
        this.data = options.data || {}; // optional object containing whatever data you wish to associate with the node (typically an url or an id)
               
        this.open = options.open ? true : false; // flag: node open or closed?
        
        this.icon = options.icon;
        this.openicon = options.openicon || this.icon;
        
        // add the node to the control's node index:
        if (this.id) this.control.index[this.id] = this;
        
        // create the necessary divs:
        this.divs = {
            main: new Element('div').addClass('mooTree_node').setStyle('position','relative'),
            indent: new Element('div').setStyle('position','absolute'),
            gadget: new Element('div'),
            node: new Element('div'),
            icon: new Element('div'),
            text: new Element('div').addClass('mooTree_text'),
            sub: new Element('div')
        }
        
        if(this.options.class_name) {
          this.divs.main.addClass(this.options.class_name);
        }

        // put the other divs under the main div:
        this.divs.main.adopt([
                            this.divs.indent,
                            this.divs.gadget,
                            this.divs.node.
                            setStyles({
                                'position':'relative',
                                'width':'auto !important',
                                'width':'1px',
                                'min-width':'1px'
                            })
                            .adopt([
                                    this.divs.icon,
                                    this.divs.text
                                    ])
                            ]);




        this.divs.node.treeNode=this;
        //this.control.GarbageCollector.push(this.divs.node);
        // attach event handler to gadget:
        this.divs.gadget.addEvent('click',  this.toggle.bind(this));

        // attach event handler to icon/text:
        this.divs.node
        .addEvent('click',function(){
          
            if(this.options.selectable) {
              this.control.select(this);
            }
            else {
              this.fireEvent('click');
            }
        }.bind(this));

    },
    
    addInTree: function(){
        // put the main and sub divs in the specified parent div:
        if(!this.options.div) {
          UXPStack.error("this.options.div is empty in MooTreeNode");
          return false;
        }
        
        $(this.options.div).adopt([this.divs.main,this.divs.sub]);
        this.$added=true;
    },
    
    /*
    Property: insert
        Creates a new node, nested inside this one.
    
    Parameters:
        options - an object containing the same options available to the <MooTreeNode> constructor.

    Returns:
        A new <MooTreeNode> instance.
    */
    
    insert: function(options, rebuild) {
        
        // set the parent div and create the node:
        options.div = this.divs.sub;
        var node = new MooTreeNode(options, this.control);
        node.addInTree();
        
        // set the new node's parent:
        node.parent = this;
        
        // mark this node's last node as no longer being the last, then add the new last node:
        var nodes = this.nodes;
        nodes.push(node);
        
        if (rebuild !== false) {

          // repaint the new node:
          node.update();
          
          if (nodes.length == 1){
              this.update();// repaint the new node's parent (this node)
          }else{
              if (nodes.length > 1) nodes[nodes.length-2].update(true);// recursively repaint the new node's previous sibling node
          }
        }
         
        return node;
        
    },
    
    isLast: function(){
        if(this.parent==null) return true;
        if(this.parent.nodes.getLast()==this) return true;
        return false;
    },
    
    isFirst: function(){
        if(this.parent==null) return true;
        if(this.parent.nodes[0]==this) return true;
        return false;
    },
    
    isRoot: function(){
        return this.parent==null ? true : false;
    },
    
    childOrder: function(){
        if( this.isRoot() ) return 0;
        return this.parent.nodes.indexOf(this);
    },
    
    getNext: function(){
        if(this.isLast()) return null;
        return this.parent.nodes[this.childOrder()+1];
    },
    
    getPrevious: function(){
        if( this.isFirst() ) return null;
        return this.parent.nodes[this.childOrder()-1];
    },
    
    getFirst: function(){
        if(this.nodes.length==0) return null;
        return this.nodes[0];
    },
    
    getLast: function(){
        if(this.nodes.length==0) return null;
        return this.nodes.getLast();        
    },
    
    getLevel: function(){
      
        var p=this;
        var level=0;
        do{
            if( p.isRoot() ) {
              this.currentLevel = level;
              return level;
            }
            level++
        }while ( p=p.parent );
    },
    
    getForward: function(){
        var current=this;
        if(current.isRoot()){
            if(!current.open || current.nodes.length==0) return false;
            return current.getFirst();
        }else{
            if(current.getFirst() && current.open){
                return current.getFirst();
            }
            return (function(current){
                if(current.getNext()){
                    return current.getNext();
                }else if(!current.isRoot()){
                    return arguments.callee(current.parent)
                }else{
                    return null;
                }
            })(current);
        }
    },
    
    getBack: function(){
        var current=this;
        if(current.isRoot()){
            return false;
        }else{
            if( current.getPrevious() ){
                current=current.getPrevious();
                while( current.open && current.getLast() ){
                    current=current.getLast();
                }
                return current;
            }else{
                return current.parent;
            }
        }
    },
    
    copy: function(deep){
        var copy=new MooTreeNode(this.options, this.control);
        if(deep){
            this.nodes.each(function(node){
                var cnode=node.copy(true);
                cnode.parent=copy;
                cnode.options.div=cnode.parent.divs.sub;
                copy.nodes.push(cnode); 
            }.bind(this));
            return copy;
        }else{
            return copy;
        }
    },
    
    injectInside: function(node){//insert code
        // set the new node's parent:
        this.parent = node;
        this.options.div=node.divs.sub;
        // add node into Tree;
        this.addInTree();
        // mark this node's last node as no longer being the last, then add the new last node:
        var nodes = node.nodes;
        nodes.push(this);
        
        // repaint the new node:
        this.update(true);
        
        
        if (nodes.length == 1){
            node.update();// repaint the new node's parent (this node)
        }else{
            if (nodes.length > 1) nodes[nodes.length-2].update(true);// recursively repaint the new node's previous sibling node
        }
         
        return this;
    },
    
    injectBefore: function(node){
        this.parent = node.parent;
        if(!this.parent) return;
        this.options.div=node.parent.divs.sub;

        this.divs.sub.injectBefore(node.divs.main);
        this.divs.main.injectBefore(this.divs.sub);
        this.$added=true;
        // mark this node's last node as no longer being the last, then add the new last node:
        var nodes = node.parent.nodes;
        nodes.injectBefore(node,this);
        
        // repaint the new node:
        this.update(true);

        var addedNodeIndex=nodes.indexOf(this);
        if(addedNodeIndex>0) nodes[addedNodeIndex-1].update(true);// recursively repaint the new node's previous sibling node
        if(addedNodeIndex<nodes.length-1) nodes[addedNodeIndex+1].update(true);
        return this;
    },
    
    injectAfter: function(node){
        this.parent = node.parent;
        if(!this.parent) return;
        this.options.div=node.parent.divs.sub;

        this.divs.main.injectAfter(node.divs.sub);
        this.divs.sub.injectAfter(this.divs.main);
        this.$added=true;
        // mark this node's last node as no longer being the last, then add the new last node:
        var nodes = node.parent.nodes;
        nodes.injectAfter(node,this);
        
        // repaint the new node:
        this.update(true);

        var addedNodeIndex=nodes.indexOf(this);
        if(addedNodeIndex>0) nodes[addedNodeIndex-1].update(true);// recursively repaint the new node's previous sibling node
        if(addedNodeIndex<nodes.length-1) nodes[addedNodeIndex+1].update(true);
        return this;
    },
    //not implemented
    injectTop: function(node){
    },
      
    //repalace current node with toNode. where = 'after' || 'before' || 'inside' .   'top' not implemented
    replaceTo: function(toNode,where,dontSelect){
        if( !['after','before','inside'].contains(where) ) return false;
        var oldparent=this.parent;
        var oldprevious=this.getPrevious();
        var oldnext=this.getNext();
        switch(where){
            case 'after' :
                // chk isTheSamePlace?
                if( toNode.getNext() && toNode.getNext()==this ) return false;
                
                //insert main and sub divs into new place
                this.divs.main.injectAfter(toNode.divs.sub);
                this.divs.sub.injectAfter(this.divs.main);

                // update {parent,nodes} - base tree structure.
                this.parent.nodes.erase(this);
                this.parent=toNode.parent;
                this.parent.nodes.injectAfter(toNode,this);
                break;
            case 'before' :
                // chk isTheSamePlace?
                if( toNode.getPrevious() && toNode.getPrevious()==this ) return false;
                
                //insert main and sub divs into new place
                this.divs.sub.injectBefore(toNode.divs.main);
                this.divs.main.injectBefore(this.divs.sub);

                // update {parent,nodes} - base tree structure.
                this.parent.nodes.erase(this);
                this.parent=toNode.parent;
                this.parent.nodes.injectBefore(toNode,this);
                break;
            case 'inside' :
                // chk isTheSamePlace?
                if( toNode.getLast() && toNode.getLast()==this ) return false;
                
                //insert main and sub divs into new place
                this.divs.main.injectInside(toNode.divs.sub);
                this.divs.sub.injectAfter(this.divs.main);

                // update {parent,nodes} - base tree structure.
                this.parent.nodes.erase(this);
                this.parent=toNode;
                this.parent.nodes.push(this);
                break;   
        }
        //update old place
        if(oldprevious) oldprevious.update(true);
        //if(oldnext) oldnext.update();
        if( oldparent && !oldparent.getFirst() ) oldparent.update();
        
        //update this node and around node.
        this.update(true);
        var previous=this.getPrevious();
        if(previous) previous.update(true);
        var next=this.getNext();
        if(next) next.update();
        this.parent.update();
        
        //select this node;
        if(dontSelect){
          return this;
        }
        this.control.select(this);
        return this;
    },
    
    // return true if current node parent or parent.parent etc of test node
    contain: function(node){// node - test node
        if(this==node) return true;
        var nodes=this.nodes;
        for(var i=0,l=nodes.length;i<l;i++){
            if ( nodes[i].contain(node) ) return true;
        }
        return false;
    },
   
    /*
    Property: remove
        Removes this node, and all of it's child nodes. If you want to remove all the childnodes without removing the node itself, use <MooTreeNode.clear>
    */
    
    remove: function() {
        var p = this.parent;
        this._remove();
        p.update(true);
    },
    
    _remove: function() {
        
        // recursively remove this node's subnodes:
        var nodes = this.nodes;
        while (nodes.length) nodes[nodes.length-1]._remove();
        
        // remove the node id from the control's index:
        delete this.control.index[this.id];
        
        // remove this node's divs:
        this.divs.main.destroy();
        this.divs.sub.destroy();
        
        if (this.parent) {
            
            // remove this node from the parent's collection of nodes:
            var p = this.parent.nodes;
            p.erase(this);       
        }
        
    },
    
    /*
    Property: clear
        Removes all child nodes under this node, without removing the node itself.
          To remove all nodes including this one, use <MooTreeNode.remove>
    */
    
    clear: function() {
        this.control.disable();
        while (this.nodes.length) this.nodes[this.nodes.length-1].empty();
        this.control.enable();
    },

    /*
    Property: update
        Update the tree node's visual appearance.
    
    Parameters:
        recursive - boolean, defaults to false. If true, recursively updates all nodes beneath this one.
    */
    
    update: function(recursive) {
        if (!this.control.enabled) return;
        var level=this.getLevel();// level of deep
        this.updateIndent(level);// update indentations
        this.updateGadget(level);// update the plus/minus gadget
        this.updateShowHide();// show/hide subnodes
        this.updateNode(level);//update the node
        this.updateIcon(level);// update the icon
        this.updateText(); // update the text
        // if recursively updating, update all child nodes:
        if (recursive) {
            this.nodes.each( function(node) {
                if(!node.$added) node.addInTree();
                node.update(node.open);
            });
        } 
    },
    
    updateIndent: function(level){
        if(level==undefined) var level=this.getLevel();
        this.divs.indent.empty();
        var p = this,indents=[];
        while (p=p.parent) {
            indents.push( this.getImg(
                                        p.isLast() || !this.control.grid 
                                        ?
                                        ''
                                        :
                                        'I'
                                      ) 
                        );
        }
        for(var i=0;i<level;i++){
            indents[i].setStyles({
                position:'absolute',
                width:18,
                height:18,
                top:0,
                left:(level-i-1)*18
            });
            this.divs.indent.adopt(indents[i]);
        };
    },
    
    updateGadget: function(level){
        if(level==undefined) var level=this.getLevel();
        
        this.divs.gadget.setStyles({
            position:'absolute',
            top:0,
            width:18,
            height:18,
            left:(level)*18
        });
        this.divs.gadget.empty();
        
        this.getImg(
            (
                this.control.grid
                ?
                (
                    (this.control.root == this )
                    ?
                    (this.nodes.length ? 'R' : '')
                    :
                    (this.isLast() ? 'L' : 'T')
                )
                :
                ''
            ) +
            (
                this.nodes.length
                ?
                (this.open ? 'minus' : 'plus')
                :
                ''
            )
            , this.divs.gadget 
        );
    },
    
    updateNode: function(level){
        if(level==undefined) {
          var level=this.getLevel();
        }

        // Optymalizacja - ustawia raz style
        if (this.divs.node.style.left.toInt() !== (level+1)*18) {
          this.divs.node.setStyles({
              height:18,
              left:(level+1)*18
          });
        }
    },
    
    updateIcon: function(level){
        // Hamówa ale nie mam innego pomysłu. Jeżeli ikonki są ikonami collaborations to ich nie odswierzamy      
        var icon_position = this.divs.icon.style.backgroundPosition;
        
        // Glupia opera wstawia w icon_position wartosc 'none'
        if(icon_position && 'none' != icon_position){
          icon_position = icon_position.match(/(\d+)/g);
          if(324 == icon_position[0] || 306 == icon_position[0]){
            return true;
          }
        }
        
        // Optymalizacja - ustawia raz style
        if (this.divs.icon.style.position !== 'absolute') {
          this.divs.icon.setStyles({
            position:'absolute',
            top:0,
            width:18,
            height:18,
            left:0
          });
        }
        else {
          this.divs.icon.empty();
         
        }
        
        this.getImg( 
            this.nodes.length
            ? 
            ( this.open 
                ? 
                (this.openicon || this.icon || '_open')
                : 
                (this.icon || '_closed')
            ) 
            : 
             this.icon || (this.control.mode == 'folders' ? '_closed' : '_doc')
            ,this.divs.icon 
        );
    },
    
    updateText: function(){
        // Optymalizacja - tylko raz ustawia style
        if (this.divs.text.style.position !== 'absolute') {
          this.divs.text.setStyles({
              position:'absolute',
              height:18,
              left:18,
              padding:0,
              margin:0
          });

          this.divs.textsub = new Element('div').setStyles({
            position:'relative',
            'white-space':'nowrap',
            bottom:-3,
            height:'100%',
            color:this.color
            }).appendText(this.text);

          this.divs.text.adopt(this.divs.textsub)
        }
        else {
          this.divs.textsub.set('text', this.text);
        }
    },
    
    updateShowHide: function(){
        this.divs.sub.style.display = this.open ? 'block' : 'none';
    },
    
    /*
    Property: getImg
        Creates a new image (actually, a div Element) -- or turns a given div into an image.
        You should not need to manually call this method. (though if for some reason you want to, you can)
    
    Parameters:
        name - the name of new image to create, defined by <MooTreeIcon> or located in an external file.
        div - optional. A string representing an existing div element to be turned into an image, or an element reference.
    
    Returns:
        The new div Element.
    */
    
    getImg: function(name, div) {

        div = ( div || new Element('div') ) // if no div was specified, create a new one
        .addClass('mooTree_img');// apply the mooTree_img CSS class:
        
        // if a blank image was requested, simply return it now:
        if (name == '') return div;
        
        var img = this.control.theme;
        
        var i = MooTreeIcon.indexOf(name);
        if (i == -1) {
            // custom (external) icon:
            var x = name.split('#');
            img = x[0];
            i = (x.length == 2 ? parseInt(x[1])-1 : 0);
        }

        // Optymalizacja 
        if (div.style.backgroundPosition === '-' + (i*18) + 'px 0px') {
          return div;
        }
        
        if(!this.options.hide_tree_icon) {
          div.style.backgroundImage = 'url(' + img + ')';
        }
        
        div.style.backgroundPosition = '-' + (i*18) + 'px 0px';
        
        return div;
        
    },
    
    /*
    Property: toggle
        By default (with no arguments) this function toggles the node between expanded/collapsed.
        Can also be used to recursively expand/collapse all or part of the tree.
    
    Parameters:
        recursive - boolean, defaults to false. With recursive set to true, all child nodes are recursively toggle to this node's new state.
        state - boolean. If undefined, the node's state is toggled. If true or false, the node can be explicitly opened or closed.
    */
    
    toggle: function(recursive, state) {
        
        if(typeof state === "undefined") {
          this.open = !this.open;
        }
        else {
          this.open = state;
        }

        if(this.$subUpdated){
            this.updateGadget();
            this.updateShowHide();
        }else{
            this.update(true);
            this.$subUpdated=true;
        }
        
        this.fireEvent('onExpand',this.open);
        this.control.fireEvent('onExpand',[this, this.open]);

        if (recursive) this.nodes.each( function(node) {
            node.toggle(true, this.open);
        }, this);
        
    },

    /**
     * Rozwija cala galaz od bierzacego elementu w gore
     */
    toggleParent: function() {

      this.toggle(false, true); 

      if (this.parent) {
        this.parent.toggleParent();
      }
    },
    
    /*
    Property: select
        Called by <MooTreeControl> when the selection changes.
        You should not manually call this method - to set the selection, use the <MooTreeControl.select> method.
    */
    
    select: function(state, dontfireevent) {
        this.selected = state;
        
        if(this.selected) {
          this.divs.main.addClass('mooTree_selected')
        }
        else {
          this.divs.main.removeClass('mooTree_selected')
        }
        
        // Modyfikacja, aby event nie wywoływał się przy odklikiwaniu - Skowron
        if(true === state && true !== dontfireevent){
          this.fireEvent('onSelect',[state]);
        }
    },
     

    /*
    Property: load
        Asynchronously load an XML structure into a node of this tree.
    
    Parameters:
        url - string, required, specifies the URL from which to load the XML document.
        vars - query string, optional.
    */
    
    load: function(url, vars, redraw) {
        if (this.nodes.length) return; // if this node is already loading, return
        
        this.toggle(false, true); // expand the node to make the loader visible
        
        this.clear();

        this.insert(this.control.loader);
        
        (function(){
            new XHR({
                method: 'GET',
                onSuccess: this._loaded.bind(this),
                onFailure: this._load_err.bind(this)
            }).send(url, vars || '');
        }).delay(20,this);// allowing a small delay for the browser to draw the loader-icon.       
    },
    
    _loaded: function(text, xml) {
        // called on success - import nodes from the root element:
        this.control.disable();
        this.clear();
        this._import(xml.documentElement);
        this.control.enable();
    },
    
    _import: function(e) {
        // import childnodes from an xml element:
        var n = e.childNodes;
        for (var i=0; i<n.length; i++) if (n[i].tagName == 'node') {
            var opt = {data:{}};
            var a = n[i].attributes;
            for (var t=0; t<a.length; t++) {
                switch (a[t].name) {
                    case 'text':
                    case 'id':
                    case 'icon':
                    case 'openicon':
                    case 'color':
                    case 'open':
                        opt[a[t].name] = a[t].value;
                        break;
                    default:
                        opt.data[a[t].name] = a[t].value;
                }
            }
            var node = this.insert(opt);
            if (node.data.load) {
                node.open = false; // can't have a dynamically loading node that's already open!
                node.insert(this.control.loader);
                node.onExpand = function(state) {
                    this.load(this.data.load);
                    this.onExpand = new Function();
                }
            }
            // recursively import subnodes of this node:
            if (n[i].childNodes.length) node._import(n[i]);
        }
    },
    
    _load_err: function(req) {
        window.alert('Error loading: ' + this.text);
    }
    
});

Array.implement({
    injectBefore: function(cur,add){
        if(!this.contains(cur)) return false;
        var array=this.slice(0,this.indexOf(cur));
        array.push(add);
        this.slice(this.indexOf(cur),this.length).each(function(el){
            array.push(el);
        });
        this.splice(0,this.length);
        array.each(function(el){
            this.push(el);
        }.bind(this));
    },
    
    injectAfter: function(cur,add){
        if(!this.contains(cur)) return false;
        var array=this.slice(0,this.indexOf(cur)+1);
        array.push(add);
        this.slice(this.indexOf(cur)+1,this.length).each(function(el){
            array.push(el);
        });
        this.splice(0,this.length);
        array.each(function(el){
            this.push(el);
        }.bind(this));
    },
    
    eq: function(array){
        if(!array) return false;
        var thisLength=this.length;
        var arrayLength=array.length;
        if(!arrayLength || thisLength != arrayLength) return false;
        for(var i=thisLength-1;i>=0;i--){
            if(this[i] != array[i]) return false;
        }
        return true;
    }
    
});
/** 
 * Obsluguje dodawanie komentarzy przez uzytkownika poprzez nacisniecie przycisku "Add comment"
 */
var DPPageComments_Add = new Class({
  
  /** 
   * Pozwala postawic ikonke z komentarzem oraz wyswietla okno do wpisania komentarza
   */
  addComment: function(pEl, pEvent) {
    pEvent && pEvent.stop();

    // Sprawdza czy nie kliknieto w pina lub popupa, jesli tak to do widzenia
    var check_el = document.getElements('.comment-popup');
    check_el = check_el.combine(document.getElements('.comment-popup *'));
    check_el = check_el.combine(document.getElements('.pin'));

    if (pEvent && check_el.contains(pEvent.target)) {
      return;
    }
    
    var position = {
      x: 20 + $('canvas-wrapper').getScroll().x.toInt(),
      y: 20 + $('canvas-wrapper').getScroll().y.toInt()
    }

    this.mPopup && this.mPopup.destroy();

    // Tworzy tymczasowego Pina 
    this.createTemporaryPin(position);
    
    this.mPopup = new DPPageComments_Popup({'show_user_name': false}, this.mPinEl);
    this.mPopup
      .addEvent('destroy', this.destroyPin.bind(this))
      .addEvent('save', this.saveComment.bind(this))
      .addEvent('drag', this.movePinNearPopup.bind(this));

    this.movePopupNearPin();
  },
  
  createTemporaryPin: function(pPosition) {
    
    this.mPinEl = new Element('span', {
      'class': 'pin active',
      'styles': {
        'left': pPosition.x,
        'top': pPosition.y
      }
    }).inject(document.getElement('#comments-pins'));
    
    this.mPinEl.makeDraggable({
      'limit': {
        'x': [0, 10000],
        'y': [0, 10000]
      },
      'snap': 0,
      'stopPropagation': true,
      'preventDefault': true,      
      'onStart': this.hidePopup.bind(this),
      'onComplete': function() {
          this.showPopup(this);
          this.movePopupNearPin(this)
      }.bind(this)
    });
  },
  
  /** 
   * Przesuwa popup tak aby zawsze byl w poblizu pina
   */
  movePopupNearPin: function() {
    var coords = this.mPinEl.getCoordinates($('canvas-wrapper')),
        x = coords.left.toInt() + coords.width.toInt(),
        y = coords.top.toInt();

    this.mPopup.moveTo(x, y);
  },
  
  /** 
   * Przesuwa pin do elementu popupa
   */
  movePinNearPopup: function() {
    var coords = this.mPopup.getArrowCoordinates(document.getElementById('canvas-wrapper'));
    
    // Bezposrednio aby nie cielo przy dragowaniu
    this.mPinEl.style.left = (coords.left - 26) + 'px',
    this.mPinEl.style.top = (coords.top - 7) + 'px';
  }, 
  
  /** 
   * Zapisuje komentarz do bazy danych
   */
  saveComment: function() {
    
    // Wysyla komentarz do servera
    if (!this.mAjax) {
      this.mAjax = new Request.JSON({
        evalScripts: false,
        url: '/ajax/dmsDPPageComments/Save/',
        link: 'cancel',
        onComplete: this.commentSaved.bind(this),
        noCache: true
      });
    }
    
    var data = {
      'id_page': Preview.getCurrentPageId(),
      'id_document': Preview.getDocumentId(),
      'project_hash': Preview.Comments.getProjectHash(),
      'user_name': Preview.Comments.getUserName(),
      'comment': this.mPopup.getComment(),
      'pos_x': this.mPinEl.getStyle('left').toInt(),
      'pos_y': this.mPinEl.getStyle('top').toInt(),
      'counter': this.getCounter() + 1
    };
    
    Preview.Comments.mIndicatorRef.show();
    this.mAjax.post({'json': JSON.encode(data)});

    // Google Analytics
    $defined(window['GAnal']) && GAnal.trackEvent('preview', 'comments', 'add');
    
    // sending 'Added comment on preview' event to KISSmetrics
    _kmq.push(['record', 'Added comment on preview']);
  },
  
  commentSaved: function(pData) {

    Preview.Comments.mIndicatorRef.hide();

    // Nie udalo sie zapisac komentarza
    if (!pData.id_page_comment) {
      this.mPopup.destroy();
      return;
    }
    
    this.mPopup.destroy();
    
    // Po utworzeniu komentarza i pokazaniu pina od razu pokazuje popup, zeby uzytkownik widzial co dodal
    pData.show_popup = true;
    
    this.createComment(pData, true);
    
  },
  
  showPopup: function() {
    this.mPopup.show();
  },
  
  hidePopup: function() {
    this.mPopup.hide();
  },
  
  destroyPin: function() {
    this.mPinEl.destroy();
  }
  
});

/** 
 * Wskaźnik saveowania - mruga sobie radośnie napisem "Saving..."
 */
var DPPageComments_Indicator = new Class({

  initialize: function() {
    this.render();
  },
  
  render: function() {
    this.mEl = new Element('div', {
      'id': 'saving-indicator',
      'html': 'Saving...' 
    }).fade('hide').inject(document.body);
    
    this.mEl.set('tween', {'duration': 400});   
  },
  
  blink: function() {
    this.mEl.fade(0.1).get('tween').chain(function(){
      this.mEl.fade(0.9).get('tween').chain(this.blink.bind(this));
    }.bind(this));
  },
  
  show: function() {
    this.blink();
  },
  
  hide: function() {
    this.mEl.fade('out');
  }
  
});
/** 
 * Ogolna klasa zarzadzajaca wszystkimi komponentami do komentarzy, przechowujaca
 * referencje do nich oraz zarzadzajaca dodawaniem/edycha/usuwaniem komentarzy
 */
var DPPageComments = new Class({
  
  Implements: [DPPageComments_Add],
  
  // Rejestr komentarzy
  mComments: null,
  
  // Id_page strony na ktorej sie znajduje uzytkownik
  mIdPage: null,
  
  // Project hash - potrzebny do autoryzacji
  mProjectHash: null,

  mDejax: new Dejax,
  
  initialize: function(pComments, pIdPage, pProjectHash, pParentEl) {
    
    this.mComments = new Hash();
    this.mIdPage = pIdPage;
    this.mProjectHash = pProjectHash;
    this.mParentEl = pParentEl;
    this.mIndicatorRef = new DPPageComments_Indicator;
    
    this.initList();
    this.loadComments(pComments);
    this.registerEvents();
    this.initPinsVisibility();
  },
  
  registerEvents: function() {

    // Utworz przyciski w main toolbar i przypisz odpowiednie eventy
    if(Preview.MainToolbar) {

      Preview.MainToolbar.addEl(new DPMainToolbar_Widget_ButtonGroup('tools', [
        new DPMainToolbar_Widget_Button({
          'id': 'comment-add',
          'text': 'Add new comment',
          'button_style': 'dark-style',
          'onClick': this.addComment.bind(this)
        }),
        new DPMainToolbar_Widget_CheckboxGroup({
          'class_name': 'annotations',
          'options': [{
            'id': 'toggle-pins',
            'label': 'Show annotations',
            'value': '1',
            'checked': this.getPinsState() == 1 ? false : 'checked',
            'click': this.togglePins.bind(this)
          }, 
          {
            'id': 'show-resolved',
            'label': 'Show resolved',
            'value': '1',
            'checked': this.getResolvedState() == 1 ? false : 'checked',
            'click': this.toggleResolved.bind(this)
          }]
        })
      ]));
    }

    var name_span = new Element('em', {
      'id':'name-set',
      'html':'Viewing as '
    });

    var name_holder = new Element('strong',{
      'html' : this.getUserName() || "anonymous",
      'id' : 'user-name'
    });

    var change_name = new Element('a', {
      'href' : '#',
      'html' : 'Change name'
    })

    name_span.adopt(name_holder, change_name);

    Preview.MainToolbar.mEl.adopt(name_span);
    change_name.addEvent('click',  this.showSetUserNamePopup.bind(this));
    
    document.getElement('#comments-pins').disableSelection();
  },

  /**
   * Odczytuje z cookie widzialnosc pinow i pokazuje je lub chowa
   */
  initPinsVisibility: function() {
    
    // piny
    if (1 == this.getPinsState()) {
      this.hidePins();
    }
    
    // komentarze i piny resolved
    if (1 == this.getResolvedState()) {
      this.hideResolved();
    }
    
  },
  
  /** 
   * Tworzy liste komentarzy
   */
  initList: function() {
    if(this.mEl) {
      document.getElement('#comments-pins').empty();
      this.mEl.empty();
    }

    this.mEl = new Element('div', {
      'id': 'pagecomments'
    }).inject(this.mParentEl);
    
    this.mListRef = new DPPageComments_List(this);
  },
  
  /** 
   * Tworzy komentarze
   */
  loadComments: function(pComments) {
    
    pComments.each(function(pItem) {
      
      // Dzieci - przeksztalca ze string do array
      pItem.children = (pItem.children && pItem.children.split(',')) || [];
      
      this.createComment(pItem);
      
    }.bind(this));
    
    return this;
  },
  
  /** 
   * Tworzy pojedynczy element komentarza
   * 
   * @param object pOptions - zobacz do klasy DPPageComments_Comment, dodatkowy parametr show_popup ktory powoduje pokazanie popupa od razu po dodaniu (wykorzystywane przy dodawaniu komentarza)
   * @param boolean pAddChild - true - dodaje element jako children swojego parenta, default: false
   * @return DPPageComments_Comment
   */
  createComment: function(pOptions, pAddChild) {
    pOptions.counter = this.getCounter() + 1;

    var comment = new DPPageComments_Comment(pOptions, this);
    var pin;

    // Nie tworzy pina dla subkomentarzy i resolved
    if (!pOptions.id_page_comment_parent) {
      pin = new DPPageComments_Pin(comment);
    }

    if (!this.mListRef.createItem(comment)) {
      return false;
    }

    this.mComments.set(pOptions.id_page_comment, comment);
    
    if (true === pOptions.show_popup && pin) {
      pin.showPopup(false);
    }

     // Dodaje do parenta jako childrena
    if (true === pAddChild && pOptions.id_page_comment_parent) {
      this.getComment(pOptions.id_page_comment_parent).addChild(pOptions.id_page_comment);
    }

    return comment;
  },

  /**
   * Pobiera komentarz z rejestru po jego ID
   */
  getComment: function(pIdPageComment) {
    return this.mComments.get(pIdPageComment);
  },
  
  /** 
   * Pobiera wszystkie podkomentarze do podanego komentarza
   * 
   * Pobiera tylko komentarze ktore nie sa "resolved"
   */
  getCommentChildren: function(pIdPageComment) {
    var children = [];
    this.getComment(pIdPageComment).get('children').each(function(pId) {
      children.push(this.getComment(pId));
    }.bind(this));
    
    return children;
  },
  
  /** 
   * Pobiera licznik aby wiedziec ile jest "glownych" komentarzy
   * 
   * Glowne to takie ktore nie sa dziecmi (rooty, parenty, moga miec dzieci :)
   */
  getCounter: function() {
    return this.mComments.filter(function(pComment) {
      return pComment.get('id_page_comment_parent') > 0 ? false : true;
    }).getLength();
  },

  /**
   * Usuwa komentarz z listy komentarzy
   */
  removeComment: function(pIdPageComment) {
    var parent_comment_id = this.mComments.get(pIdPageComment).options.id_page_comment_parent;
    
    if(parent_comment_id) {
      this.getComment(parent_comment_id).removeChild(pIdPageComment);
    }
    
    this.mComments.erase(pIdPageComment);
    this.mListRef.removeItem(pIdPageComment);
    this.renumerateComments();
    return this;
  },
  
  /** 
   * Przenumerowuje komentarze
   */
  renumerateComments: function() {
    var counter = 1;
    this.mComments.each(function(pComment) {
      // Tylko dla elementow ktore nie sa dziecmi (glownymi elementami)
      if (false === pComment.isChild()) {
        pComment.set('counter', counter++);
      }
    });
  },
  
  /** 
   * Pokazuje lub chowa piny (ukrywa je)
   *
   * Zapisuje rowniez w cookie info o stanie
   */
  togglePins: function(pEvent, pEl) {
    
    // Jesli przekazano pEvevent i pEl, to znaczy, ze kliknieto w checkbox i mamy jego stan po tym jak ptaszek się zmienil
    var show_pins = pEvent && pEl ? pEl.checked : this.getPinsState();
    
    if (show_pins) {
      this.showPins();
      this.setPinsState('0');
    }
    else {
      this.hidePins();
      this.setPinsState('1');
    }
  },
  
  /**
   * Pokazuje lub chowa komentarze 'resolved' wraz z pinami
   */
  toggleResolved: function(pEvent, pEl) {
    
    // Jesli przekazano pEvevent i pEl, to znaczy, ze kliknieto w checkbox i mamy jego stan po tym jak ptaszek się zmienil, natomiast getResolvedState() zwraca stan przed zmianą
    var show_resolved = pEvent && pEl ? pEl.checked : this.getResolvedState();
    
    if (show_resolved) {
      this.showResolved();
      this.setResolvedState('0');
    }
    else {
      this.hideResolved();
      this.setResolvedState('1');
    }
  },
  
  showPins: function() {
    document.getElements('#comments-pins .pin').show();
  },
  
  hidePins: function() {
    document.getElements('#comments-pins .pin').hide();
  },
  
  showResolved: function() {
    document.getElements('#comments-pins .pin.resolved').show();
    this.mListRef.mEl.getElements('.resolved').show();
  },
  
  hideResolved: function() {
    document.getElements('#comments-pins .pin.resolved').hide();
    this.mListRef.mEl.getElements('.resolved').hide();
  },
  
  /**
   * Zwraca stan pinow komentarzy. UWAGA PSIKUS:
   * 1 - piny ukryte
   * 0 - piny widoczne
   */
  getPinsState: function() {
    return Cookie.read('pins-hidden');
  },
  
  /**
   * Ustawia stan pinow komentarzy. UWAGA PSIKUS:
   * 1 - piny ukryte
   * 0 - piny widoczne
   */
  setPinsState: function(pState) {
    return Cookie.write('pins-hidden', pState);
  },
  
  /**
   * Zwraca stan wyświetlania komentarzy 'resolved'. UWAGA PSIKUS:
   * 1 - piny ukryte
   * 0 - piny widoczne
   */
  getResolvedState: function() {
    return Cookie.read('resolved-hidden');
    
  },
  
  /**
   * Ustawia stan wyświetlania komentarzy 'resolved'. UWAGA PSIKUS:
   * 1 - piny ukryte
   * 0 - piny widoczne
   */
  setResolvedState: function(pState) {
    return Cookie.write('resolved-hidden', pState);
  },
  
  getIdPage: function() {
    return this.mIdPage;
  },
  
  getProjectHash: function() {
    return this.mProjectHash;
  },
  
  showSetUserNamePopup: function() {
    new DPPageComments_SetUserNamePopup;
  },
  
  setUserName: function(pName) {
    Cookie.write('page-comments-user-name', pName);
    document.getElement('#user-name').set('html', pName);
  },
  
  getUserName: function(pName) {
    return Cookie.read('page-comments-user-name') || '';
  },

  fetchComments: function(pIdPage) {
     this.mComments = new Hash;
    this.mDejax.newRequest({
      'url': '/ajax/dmsDPPreview/GetPageComments/',
      'eval': true,
      'mode': 'cancel',
      'data': {
        'id_page': pIdPage,
        'id_project': Preview.getData().id_project,
        'project_hash': Preview.getData().project_hash
      },
      'onComplete': function(pResponse) {
        this.initList();
        this.loadComments(pResponse);
        if(this.getResolvedState() == 1) {
          this.hideResolved();
        }
        if(this.getPinsState() == 1) {
          this.hidePins();
        }


      }.bind(this)
    });
  },

  /**
   * Scroll with animation to the specified comment.
   */
  goToComment: function(pCommentId, pShowAddComment, pAnimationDuration) {
    var canvas_wrapper = document.getElementById('canvas-wrapper');
    var comment = document.querySelector('span[data-comment-id="' + pCommentId + '"]');
    var start = canvas_wrapper.scrollTop;
    var change = (comment.offsetTop - comment.clientHeight) - start;
    var current_time = 0;
    var increment = 20;
    var pAnimationDuration = pAnimationDuration || 350;

    /**
     * t = current time
     * b = start value
     * c = change in value
     * d = duration
     */
    var easeInOutQuad = function(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };

    var animateScroll = function(){
      current_time += increment;
      var val = easeInOutQuad(current_time, start, change, pAnimationDuration);
      canvas_wrapper.scrollTop = val;

      if(current_time < pAnimationDuration) {
        setTimeout(animateScroll, increment);
      }
    };

    // Do animate!
    animateScroll();


    if (comment && pShowAddComment) {
      // show comment
      setTimeout(function clickOnTheComment() {
        comment.click();
      }, pAnimationDuration + 100);
    }
  }
  
})
/** 
 * Obsluguje pojedynczy element komentarza
 * 
 * Tworzy element Pin oraz Item.
 * Nic nie renderuje - jedynie przechowuje informacje o komentarzu. 
 * 
 * @events
 *   update - po uaktualnieniu komentarza (zmianie tresci komentarza, pozycji, statusu (is_resolved) itp.)
 *   destroy - po usunieciu komentarza
 * 
 */
var DPPageComments_Comment = new Class({
  
  Implements: [Options, Events],
  
  options: {
    'id_page_comment': null,
    'id_page_comment_parent': null,
    'counter': '',
    'pos_x': 0,
    'pos_y': 0,
    'is_resolved': false,
    'comment': null,
    'user_name': null,
    'insert_date': null,
    'avatar': 'null',
    'children': []
  },
  
  // Referencja do glownego obiektu trzymajacego wszystkie komentarze (Preview.Comments)
  mCommentsRef: null,
  
  initialize: function(pOptions, pCommentsRef) {
    this.mCommentsRef = pCommentsRef;
    this.setOptions(pOptions);
    
    if (null === this.options.children) {
      this.options.children = [];
    }
    
  },
  
  /** 
   * Pobiera dowolna wartosc z "options" (np. avatar)
   */
  get: function(pProperty) {
    return this.options[pProperty];
  },
  
  /** 
   * Ustawia odpowiednia wartosc w "options" oraz powiadamia eventem o zmianie 
   * 
   * @events update
   */
  set: function(pProperty, pValue, pFireEvent) {
    pFireEvent = $defined(pFireEvent) ? pFireEvent : true; 
    
    this.options[pProperty] = pValue;
    
    if (true === pFireEvent) {
      this.fireEvent('update');
    }

    return this;
  },

  /** 
   * Zapisuje komentarz do bazy (uaktualnia)
   */
  save: function(pCallback) {
    // Wysyla komentarz do servera
    this.mAjax = new Request.JSON({
      evalScripts: false,
      url: '/ajax/dmsDPPageComments/Save/',
      link: 'chain',
      onComplete: function(pCallback) {
        Preview.Comments.mIndicatorRef.hide();
        pCallback && pCallback.apply();
      }.pass([pCallback]),
      noCache: true
    });
    
    var data = {
      'id_page': Preview.getCurrentPageId(),
      'id_document': Preview.getDocumentId(),
      'project_hash': Preview.Comments.getProjectHash(),
      'id_page_comment': this.options.id_page_comment,
      'id_page_comment_parent': this.options.id_page_comment_parent,
      'user_name': Preview.Comments.getUserName(),
      'comment': this.options.comment,
      'pos_x': this.options.pos_x,
      'pos_y': this.options.pos_y,
      'counter': this.options.counter
    };
    
    Preview.Comments.mIndicatorRef.show();
    this.mAjax.post({'json': JSON.encode(data)});    
  },
  
  /**
   * Zapisuje na serwerze informacje o resolve komentarza
   */
  saveResolved: function(pState, pCallback) {
    var resolved = $defined(pState) ? pState : this.isResolved();
    var callback = typeof pCallback == 'function' ? pCallback : $empty;
    
    var ajax = new Request.JSON({
      evalScripts: false,
      url: '/ajax/dmsDPPageComments/Save/',
      link: 'cancel',
       onComplete: function(pCallback) {
        Preview.Comments.mIndicatorRef.hide();
        pCallback && pCallback();
      }.pass([callback]),
      noCache: true
    });
      
    var data = {
      'id_page': Preview.getCurrentPageId(),
      'id_document': Preview.getDocumentId(),
      'project_hash': Preview.Comments.getProjectHash(),
      'id_page_comment': this.get('id_page_comment'),
      'is_resolved': resolved
    };

    Preview.Comments.mIndicatorRef.show();
    ajax.post({'json': JSON.encode(data)});
    
    $defined(window['GAnal']) && GAnal.trackEvent('preview', 'comments', 'resolved');

    // sending 'Marked comment as resolved' event to KISSmetrics
    _kmq.push(['record', 'Marked comment as resolved']); 
  },
  
  /**
   * Zmienia wartosc 'is_resolved' i zwraca aktualny stan z metody isResolved()
   */
  toggleResolved: function(pCallback) {
    
    // Jesli przekazany parametr to event, usuwamy go
    if(pCallback && pCallback.event) {
      pCallback = undefined;
    }
    
    this.set('is_resolved', !this.isResolved());
    this.saveResolved(this.isResolved(), pCallback);
  },

  /**
   * Redirect to the comment
   */
  goToComment: function() {
    Preview.Comments.goToComment(this.options.id_page_comment, true);
  },

  /**
   * Usuwa komentarz z bazy
   */
  remove: function() {
    this.mAjax = new Request.JSON({
      evalScripts: false,
      url: '/ajax/dmsDPPageComments/Remove/',
      link: 'chain',
      onComplete: function() {
        Preview.Comments.mIndicatorRef.hide();
        this.destroy();
      }.bind(this),
      noCache: true
    });
    
    var data = {
      'id_page': Preview.getCurrentPageId(),
      'id_document': Preview.getDocumentId(),
      'project_hash': Preview.Comments.getProjectHash(),
      'id_page_comment': this.options.id_page_comment
    };
    
    Preview.Comments.mIndicatorRef.show();
    this.mAjax.post({'json': JSON.encode(data)});    

    // sending 'Comment was removed' event to KISSmetrics
    _kmq.push(['record', 'Comment was removed']); 
  },
  
  /** 
   * Usuwa komentarz wraz z dziecmi
   * 
   * @events destroy
   * 
   */
  destroy: function() {
    
    this.options.children.each(function(pId) {
      this.mCommentsRef.getComment(pId).destroy();
    }.bind(this));
    
    // Usuwa siebie z listy komentarzy
    this.mCommentsRef.removeComment(this.options.id_page_comment);
    
    this.fireEvent('destroy');
    delete this.mCommentsRef;
  },
  
  /** 
   * Podswietla komentarz 
   * 
   * Nic wlasciwie nie robi tylko powiadamia pina oraz komentarz na liscie
   */
  highlight: function() {
    this.fireEvent('highlight');
  },

  /** 
   * Nie podswietla komentarza :)
   * 
   * Nic wlasciwie nie robi tylko powiadamia pina oraz komentarz na liscie
   */
  unhighlight: function() {
    this.fireEvent('unhighlight');
  },
  
  isResolved: function() {
    return this.options.is_resolved == 1 || this.options.is_resolved == true;
  },
  
  isChild: function() {
    return this.options.id_page_comment_parent > 0;
  },
  
  addChild: function(pIdChild) {
    this.options.children.push(pIdChild);
    return this;
  },
  
  removeChild: function(pIdChild) {
    this.options.children.splice(this.options.children.indexOf(pIdChild), 1);
    return this;
  }
  
})
var DPPageComments_Popup_Draggable = new Class({
  
  makeDraggable: function() {
    this.mEl.makeDraggable({
      'snap': 0,
      'onDrag': function() {
        this.fireEvent('drag');
        this.switchSides();

      }.bind(this),
      'onComplete': function() {
        this.fireEvent('onDragComplete');
        
        if (this.mTextAreaEl) {
          (function() {
            this.mTextAreaEl.focus();
          }).delay(10, this);
        }

        this.setProperPosition();
        
      }.bind(this),
      'handle': this.mHandleEl,
      'stopPropagation': true,
      'preventDefault': true,
      'limit': {
        'x': [0, 10000],
        'y': [0, 10000]
      }
    });
  }
  
});
/**
 * Renderuje i zarzadza popupem pokazujacym sie kolo pinow w ktorym uzytkownik
 * moze wpisac komentarz
 *
 * @events
 *   destroy
 *   save - po nacisnieciu przez uzytkownika klawisza save/ok/create
 *   resolve - po kliknieciu "mark as resolved" przez uzytkownika
 *   remove - po kliknieciu "remove" przez uzytkownika
 *
 */
var DPPageComments_Popup = new Class({

  Implements: [Events, Options, DPPageComments_Popup_Draggable],

  options: {
    'user_name': null,
    'show_textarea': true,
    'show_user_name': true,
    'show_resolve_link': false
  },

  // Blokuje przycisk save po kliknieciu
  mBlockSave: false,

  initialize: function(pOptions, pPinRef, pCommentRef) {
    this.mPinRefEl = pPinRef;
    this.mCommentRef = pCommentRef;
    this.setOptions(pOptions);
    this.render();
    this.registerEvents();
  },

  render: function() {

    this.mEl = new Element('div', {
      'class': 'comment-popup',
      'html': this.renderComments() + '<textarea placeholder="Write a comment..."></textarea><div class="close-btn"></div><div class="actions"><a href="" class="save-btn">save</a><a href="" class="mark-as-resolved"></a><a href="" class="remove">remove</a></div><div class="arrow"></div>'
    });

    this.mHandleEl = new Element('div', {
      'class': 'handle'
    }).inject(this.mEl);

    this.mEl.set('tween', {'duration': 120});

    this.mCloseBtnEl = this.mEl.getElement('.close-btn');
    this.mTextAreaEl = this.mEl.getElement('textarea');
    this.mSaveBtnEl  = this.mEl.getElement('.save-btn').addClass('inactive');
    this.mActionsEl  = this.mEl.getElement('.actions');
    this.mUserNameEl  = this.mEl.getElement('.user-name');
    this.mMarkAsResolvedEl = this.mEl.getElement('.mark-as-resolved');
    this.mRemoveEl  = this.mEl.getElement('.remove');
    this.mCommentEl = this.mEl.getElement('.msg');

    if (false === this.options.show_user_name) {
      this.mUserNameEl.hide();
    }

    if (false === this.options.show_resolve_link) {
      this.mMarkAsResolvedEl.hide();
      this.mRemoveEl.hide();
    }

    // Nie pokazuje textarea ani linkow do zamkniecia
    if (false === this.options.show_textarea) {
      this.mTextAreaEl.hide();
      this.mActionsEl.hide();
      this.mCloseBtnEl.hide();
    }
    else {
      this.setProperPosition();

      // Obsluga entera - zapis
      this.mTextAreaEl.addEvent('keydown', function(pEvent) {
        if ('enter' === pEvent.key) {
          pEvent.stop();
          this.save();
        }
        this.setProperPosition();
      }.bind(this));

      // Jesli uzytkownik nic nie wpisze to button "save" jest nieaktywny
      this.mTextAreaEl.addEvent('keyup', function(pEvent) {
        if (this.mTextAreaEl.get('value')) {
          this.mSaveBtnEl.removeClass('inactive');
        }
        else {
          this.mSaveBtnEl.addClass('inactive');
        }
        this.setProperPosition();
      }.bind(this));

      // Po wlaczeniu
      (function() {
        this.mTextAreaEl.focus();
      }.delay(10, this))
    }

    this.update();
    this.mEl.inject($('canvas-wrapper'));
    this.mAutoGrow = new AutoGrow(this.mTextAreaEl, {'minHeight': 33, 'tween': false, 'margin': 3});
    this.makeDraggable();
  },

  update: function() {

    // resolved / unresolved
    this.mEl.getElement('.mark-as-resolved').set('text', this.mCommentRef && this.mCommentRef.isResolved() ? 'mark as unresolved' : 'mark as resolved');

  },

  /**
   * Tworzy HTMLa do wszystkich komentarzy
   */
  renderComments: function() {
    var html = '';

    // Jesli nie ma komentarzy to zwraca pusty komentarz
    if (!this.mCommentRef) {
      return '<span class="comment"><span class="msg"></span><span class="user-name"></span></span>';
    }

    var comments = [];

    comments.push(this.mCommentRef);
    comments = comments.combine(Preview.Comments.getCommentChildren(this.mCommentRef.get('id_page_comment')));

    for(var i = 0; i < comments.length; i++) {

      var comment = comments[i];

      if (comment.get('id_page_comment_parent')) {
        html += '<span class="comment sub">';
      }
      else {
        html += '<span class="comment">';
      }

      // Avatar
      if (comment.get('id_page_comment_parent')) {
        html += '<img class="avatar" src="' + comment.get('avatar') + '" />';
      }
      html += '<span class="msg">' + comment.get('comment') + '</span>';
      html += '<span class="user-name">by <em>' + comment.get('user_name') + '</em></span>';
      html += '</span>';
    }

    return html;
  },

  registerEvents: function() {
    this.mCloseBtnEl.addEvent('click', this.destroy.bind(this));
    this.mSaveBtnEl.addEvent('click', this.save.bind(this));
    this.mMarkAsResolvedEl.addEvent('click', this.markAsResolved.bind(this));
    this.mRemoveEl.addEvent('click', this.remove.bind(this));

    this.mDestroyRef = this.destroy.bind(this);
    window.addEvent('click', this.mDestroyRef);
  },

  moveTo: function(pX, pY) {
    this.mEl.setStyles({'left': pX, 'top': pY});
    this.setProperPosition();

    return this;
  },

  /**
   * Korekcja pozycji tipa
   */
  setProperPosition: function() {

    this.switchSides();

    // Jesli okno "wylazi" poza dolna krawedz okna to przesuwa je w gore
    var browser_scroll_size = 10;
    var win_height = window.innerHeight - browser_scroll_size;
    var popup_dimensions = this.mEl.getDimensions();
    var popup_bottom_offset = this.mEl.getPosition().y + popup_dimensions.height;

    if (popup_bottom_offset > win_height) {
      var popup_top_style = this.mEl.getStyle('top').toInt() - (popup_bottom_offset - win_height);
      this.mEl.setStyle('top', popup_top_style);
    }

    // Jesli okno "wylazi" poza gorna krawedz okna to przesuwa je w dol
    var win_hmin = window.getScrollTop() + 15; // 15px - lekki margines od gory - ladniej wyglada

    if (this.mEl.getStyle('top').toInt() < win_hmin) {
      this.mEl.setStyle('top', win_hmin);
    }

    // Ustala pozycje "arrow" wzgledem pina
    if (this.mPinRefEl) {

      // Jaka jest pozycja okna wzgledem pina?
      var arrow_posy = Math.abs(this.mEl.getPosition(this.mPinRefEl).y) + 7;

      // Nie moze wychodzic poza pina (z malym marginesem 15px)
      if (arrow_posy > popup_dimensions.height - 15) {
        arrow_posy = popup_dimensions.height - 15;
      }

      this.mEl.getElement('.arrow').setStyle('top', arrow_posy);
    }

  },

  /**
   * Dodaje klase left jest element wychodzi poza ekran
   */
  switchSides: function() {
    if (15 + this.mEl.getComputedSize().totalWidth + this.mEl.getCoordinates().left.toInt() - this.mEl.getStyle('margin-left').toInt() - this.mEl.getStyle('margin-right').toInt() > document.documentElement.clientWidth.toInt() + window.getScrollLeft().toInt()) {
      this.mEl.addClass('left');
    }
    else {
      this.mEl.removeClass('left');
    }
  },

  destroy: function(pEvent) {

    // Event wywolany poprzez window.click
    if (pEvent && 'click' === pEvent.type && this.mCloseBtnEl !== pEvent.target) {

      // Kliknieto w pina - nic nie rob
      if (this.mPinRefEl && (this.mPinRefEl.getElements('*').contains(pEvent.target) || this.mPinRefEl === pEvent.target)) {
        return;
      }

      // Kliknieto w element popupa - nic nie rob
      if (this.mEl.getElements('*').contains(pEvent.target) || this.mEl === pEvent.target) {
        return;
      }
    }

    window.removeEvent('click', this.mDestroyRef);
    this.mEl.destroy();
    this.mAutoGrow && this.mAutoGrow.destroy();

    delete this.mAutoGrow;
    delete this.mCommentRef;
    delete this.mPinRefEl;

    this.fireEvent('destroy');
  },

  getComment: function() {
    return this.mTextAreaEl.get('value');
  },

  hide: function() {
    this.mEl.fade('hide');
  },

  show: function() {
    this.mEl.fade('in');
  },

  save: function(pEvent) {

    pEvent && pEvent.stop();

    // Blokada przed nic nie wpisaniem w pole komentarza
    if ('' == this.mTextAreaEl.get('value')) {
      return this;
    }

    this.mTextAreaEl.setProperty('readonly', 'readonly');

    // Blokada przed ponownym kliknięciem save
    if (true === this.mBlockSave) {
      return this;
    }

    this.mBlockSave = true;
    this.mSaveBtnEl.set('text', 'saving...');
    this.fireEvent('save');

    return this;
  },

  remove: function(pEvent) {
    pEvent && pEvent.stop();

    new DPPageComments_RemoveCommentPopup().addEvent('remove', function() {
      this.fireEvent('remove');
    }.bind(this));

  },

  markAsResolved: function(pEvent) {
    pEvent && pEvent.stop();

    this.mMarkAsResolvedEl.set('text', this.mCommentRef.isResolved() ? 'unresolving...' : 'resolving...');

    this.fireEvent('resolve');
  },

  getArrowCoordinates: function() {
    var coords = this.mEl.getElement('.arrow').getCoordinates(document.getElementById('canvas-wrapper'));

    if (this.mEl.hasClass('left')) {
      coords.left += 42;
    }

    return coords;
  }

});

/*
 * Interfejs do dragowania pinow
 */
var DPPageComments_Pin_Draggable = new Class({
  
  makeDraggable: function() {
    this.mEl.makeDraggable({
      'limit': {
        'x': [0, document.getElementById('canvas-wrapper').getStyle('width') == "100%" ? 10000 : document.getElementById('canvas-wrapper').getStyle('width').toInt() -15],
        'y': [0, 10000]
      },
      'snap': 0,
      'stopPropagation': true,
      'preventDefault': true,
      
      'onStart': function() {
        
        // Niszczy popupa jesli istnial - przesuwanie Pina zawsze to robi
        if (this.mPopup) {
          this.mPopup.destroy();
          delete this.mPopup;
        }
        
        // Blokuje ewentualne pokazywanie sie Popupa
        this.mBlockPopup = true;
      }.bind(this),
      
      'onComplete': function(pEl) {
        this.savePosition(pEl);
        
        // Mala chamowa aby po skonczeniu dragowania nie pokazywalo sie okno z mozliwoscia wpisania komentarza (w trybie edycji - event "click")
        (function() {
          this.mBlockPopup = false;
        }.delay(50, this));
        
      }.bind(this)
    });
  },
  
  /** 
   * Wykonywane po zakonczeniu dragowania 
   * 
   * Zapisuje pozycje pina jako pozycje komentarza (pos_x, pos_y) oraz wykonuje update()
   */
  savePosition: function(pEl) {
    
    this.mCommentRef
      .set('pos_x', pEl.getStyle('left').toInt(), false)
      .set('pos_y', pEl.getStyle('top').toInt(), false)
      .save();
  }

})
/*
 * Rozszerzenie o funkcje obslugi Popupa do Pina
 */
var DPPageComments_Pin_Popup = new Class({

  mPopupIsSticky: false,
  mBlockPopup: false,

  showPopup: function(pShowEdit) {

    if ((this.mPopup && true === this.mPopupIsSticky) || true === this.mBlockPopup) {
      return;
    }

    if (this.mPopup) {
      this.mPopup.destroy();
    }

    this.mPopupIsSticky = pShowEdit;

    this.mPopup = new DPPageComments_Popup({
      'show_textarea': pShowEdit,
      'show_resolve_link': true,
      'onSave': this.save.bind(this),
      'onDestroy': function() {
        delete this.mPopup;
      }.bind(this),
      'onResolve': function() {
        this.mCommentRef.toggleResolved(this.resolvedCallback.bind(this)); //.bind(this);
      }.bind(this),
      'onDrag': this.movePinNearPopup.bind(this),
      'onDragComplete': function() {
         this.savePosition(this.mEl);
      }.bind(this),
      'onRemove': this.remove.bind(this)
    }, this.mEl, this.mCommentRef);

    this.movePopupNearPin();
  },

  destroyPopup: function() {

    // Jesli popup zostal powolany do zycia po kliknieciu w Pina to nie bedzie sie chowal po odjechaniu z Pina
    if (!this.mPopup || true === this.mPopupIsSticky) {
      return;
    }

    this.mPopup.destroy();
    delete this.mPopup;
  },

  /**
   * Przesuwa popup tak aby zawsze byl w poblizu pina
   */
  movePopupNearPin: function() {
    var coords = this.mEl.getCoordinates($('canvas-wrapper')),
        x = coords.left.toInt() + coords.width.toInt(),
        y = coords.top.toInt();

    this.mPopup.moveTo(x, y);
  },

  /**
   * Przesuwa pin do elementu popupa
   */
  movePinNearPopup: function() {
    var coords = this.mPopup.getArrowCoordinates();

    // Bezposrednio aby nie cielo przy dragowaniu
    this.mEl.style.left = (coords.left - 26) + 'px',
    this.mEl.style.top = coords.top -7 + 'px';
  },

  /**
   * Zapisuje komentarz jako parenta podajac aktualny (edytowany)
   */
  save: function(pMode) {

    if (!this.mCommentAjax) {
      this.mCommentAjax = new Request.JSON({
        evalScripts: false,
        url: '/ajax/dmsDPPageComments/Save/',
        link: 'cancel',
        onComplete: this.saved.bind(this),
        noCache: true
      });
    }

    var data = {
      'id_page': Preview.getCurrentPageId(),
      'id_document': Preview.getDocumentId(),
      'project_hash': Preview.Comments.getProjectHash(),
      'id_page_comment_parent': this.mCommentRef.get('id_page_comment'),
      'user_name': Preview.Comments.getUserName(),
      'comment': this.mPopup.getComment(),
      'pos_x': this.mEl.getStyle('left').toInt(),
      'pos_y': this.mEl.getStyle('top').toInt(),
      'counter': ''
    };

    Preview.Comments.mIndicatorRef.show();
    this.mCommentAjax.post({'json': JSON.encode(data)});

    $defined(window['GAnal']) && GAnal.trackEvent('preview', 'comments', 'add-reponse');
    
    // sending 'Added comment on preview' event to KISSmetrics
    _kmq.push(['record', 'Added response to comment']);
  },

  saved: function(pData) {

    Preview.Comments.mIndicatorRef.hide();

    // Nie udalo sie zapisac komentarza
    if (!pData.id_page_comment) {

      if (this.mPopup) {
        this.mPopup.destroy();
      }

      return;
    }

    Preview.Comments.createComment(pData, true);

    if (this.mPopup) {
      this.mPopup.destroy();
    }

    this.showPopup(false);
  },

  resolvedCallback: function() {
    Preview.Comments.mIndicatorRef.hide();

    if (this.mPopup) {
      this.mPopup.destroy();
    }

    // Uaktualnia komentarz
//    this.mCommentRef.set('is_resolved', true);

    // Chowa lub zostawia link show/hide annotations
//    Preview.Comments.toggleAnnotationsLink();

    // Wywala pina
//    this.destroy();
  },

  remove: function() {
    this.mCommentRef.remove();

    this.mPopupIsSticky = true;

    if (this.mPopup) {
      this.mPopup.destroy();
      delete this.mPopup;
    }
  }

});
/** 
 * Renderuje pina
 */
var DPPageComments_Pin = new Class({
  
  Implements: [DPPageComments_Pin_Draggable, DPPageComments_Pin_Popup],

  // Referencja do obiektu komentarza (DPPageComments_Comment)
  mCommentRef: null,

  /** 
   * Konstruktor
   * 
   * @param object DPPageComments_Comment
   */
  initialize: function(pCommentRef) {
    this.mCommentRef = pCommentRef;
    
    this.render();
    this.makeDraggable();
    this.registerEvents();
  },

  render: function() {
    
    this.mEl = new Element('span', {
      'class': 'pin',
      'data-comment-id': this.mCommentRef.options.id_page_comment
    }).inject(document.getElement('#comments-pins'));
    
    this.mEl.disableSelection();
    
    this.update();
  },
  
  registerEvents: function() {
    this.mCommentRef.addEvent('update', this.update.bind(this));
    this.mCommentRef.addEvent('destroy', this.destroy.bind(this));
    this.mCommentRef.addEvent('highlight', this.highlight.bind(this));
    this.mCommentRef.addEvent('unhighlight', this.unhighlight.bind(this));
    
    this.mEl.addEvent('mouseenter', this.mCommentRef.highlight.bind(this.mCommentRef));
    this.mEl.addEvent('mouseleave', this.mCommentRef.unhighlight.bind(this.mCommentRef));
    
    // Pokazuje popupa ale bez trybu edycji (jedynie komentarz)
    this.mEl.addEvent('mouseenter', this.showPopup.pass([false], this));
    this.mEl.addEvent('mouseleave', this.destroyPopup.bind(this));
    
    // Pokazuje popupa z trybem edycji oraz komentarzem
    this.mEl.addEvent('click', this.showPopup.pass([true], this));
  },
  
  update: function() {
    
    if (!this.mCommentRef) {
      return this;
    }
    
    this.mEl.setStyles({
      'left': this.mCommentRef.get('pos_x') ? this.mCommentRef.get('pos_x').toInt() : 0,
      'top': this.mCommentRef.get('pos_y') ? this.mCommentRef.get('pos_y').toInt() : 0
    });
    
    if('1' == this.mCommentRef.isResolved()) {
      this.mEl.addClass('resolved');
      this.mEl.set('html', '&#10004;');
    }
    else {
      this.mEl.removeClass('resolved');
      this.mEl.set('text', this.mCommentRef.get('counter'));
    }
    
    return this;
  },
  
  destroy: function() {
    this.mEl.destroy();
    delete this.mCommentRef;
  },
  
  highlight: function() {
    this.mEl.addClass('active');
  },
  
  unhighlight: function() {
    this.mEl.removeClass('active');
  },
  
  getDomElement: function() {
    return this.mEl;
  }
  
})
/**
 * Obsluga listy komentarzy w menu (po lewej)
 * 
 */
var DPPageComments_List = new Class({

  // Domyslnie nie jest rozwinieta
  mIsExpanded: false,
  
  // Lista itemow, aby byl do nich prosty dostep
  mItems: {},

  // Referencja do obiektu zarzadzania komentarzami (DPPageComments)
  mCommentsRef: null,

  initialize: function(pCommentsRef, pParentEl) {
    this.mCommentsRef = pCommentsRef;

    this.render();
    this.registerEvents();
  },
  
  render: function() {
    
    this.mEl = new Element('ul', {
      'id': 'comment-list'
    }).inject(this.mCommentsRef.mEl);

    this.createInfoElement();
  },
  
  createInfoElement: function() {
    this.removeInfoElement();
    
    this.mInfoEl = new Element('span', {
      'class': 'no-comments-info',
      'html': 'Share this preview with your peers and gather feedback.'
    }).inject(this.mEl);
  },
  
  removeInfoElement: function() {
    
    if(this.mInfoEl) {
      this.mInfoEl.destroy();
      this.mInfoEl = null;
    }
  },
  
  registerEvents: function() {
    
    // Kontroluje wysokosci poszczegolnych elementow w menu przy resize okna
    window.addEvent('resize', this.windowResized.bind(this));
    window.addEvent('scroll', this.windowResized.bind(this));
    
    // Stabilizuje pozycje poczatkowe elementow
    window.scrollTo(0,0);
    this.windowResized();
  },
  
  /** 
   * Tworzy pojedynczy element listy
   * 
   * Za wstawienie elementu do DOMa jest odpowiedzialna ta metoda
   * 
   * @param pCommentRef DPPageComments_Comment
   * @return DPPageComments_List_Item
   */
  createItem: function(pCommentRef) {
    var item = new DPPageComments_List_Item(pCommentRef);
    this.removeInfoElement();

    // Wstawia pod konkretnym komentarzem jesli ma parenta
    var parent_id = pCommentRef.get('id_page_comment_parent');


    // some comments have parent_id that is from different project :/ (iterations?)
    if (parent_id && !this.mItems[parent_id]) {
      return false;
    }

    if (parent_id) {
      var parent_item = this.mItems[parent_id];
      item.getDOMElement().inject(parent_item.getChildrenContainer());
    }
    else {
      this.mEl.adopt(item.getDOMElement());
    }
    
    // item
    this.mItems[pCommentRef.get('id_page_comment')] = item;
    
    return item;
  },
  
  removeItem: function(pCommentId) {
    delete this.mItems[pCommentId];
    
    if(new Hash(this.mItems).getLength() == 0) {
      this.createInfoElement();
    }
  },
  
  /**
   * Przy resize okna zapewnia, ze wszystkie elementy sitemapy trzymaja sie kupy
   */
  windowResized: function() {
    
  }

});
/*
 * Pojedynczy element listy komentarzy
 */
var DPPageComments_List_Item = new Class({

  // Referencja do obiektu komentarza (DPPageComments_Comment)
  mCommentRef: null,
  
  initialize: function(pCommentRef) {
    this.mCommentRef = pCommentRef;
    
    this.render();
    this.registerEvents();
  },

  render: function() {
    
    this.mEl = new Element('li', {
      'class': 'item level' + (this.mCommentRef.get('id_page_comment_parent') === null ? '0' : '1'),
      'id': 'id_page_comment-' + this.mCommentRef.get('id_page_comment')
    });
    
    this.mEl.microjungle([
      ['img.avatar'],
      ['span.counter'],
      ['span.comment'],
      ['span.summary']
    ]);

    this.update();
  },
  
  getChildrenContainer: function() {
    
    // Utworz konetener na odpowiedzi, jesli jeszcze nie istnieje
    if(!this.mChildrenContainer) {
      this.mChildrenContainer = new Element('ul', {
        'class': 'responses'
      }).inject(this.mEl);
    }
    
    // zwroc
    return this.mChildrenContainer;
  },
  
  registerEvents: function() {
    this.mCommentRef.addEvent('update', this.update.bind(this));
    this.mCommentRef.addEvent('destroy', this.destroy.bind(this));
    this.mCommentRef.addEvent('highlight', this.highlight.bind(this));
    this.mCommentRef.addEvent('unhighlight', this.unhighlight.bind(this));

    this.mEl.addEvent('mouseenter', this.mCommentRef.highlight.bind(this.mCommentRef));
    this.mEl.addEvent('mouseleave', this.mCommentRef.unhighlight.bind(this.mCommentRef));
  },
  
  /** 
   * Uaktualnia komentarz
   */
  update: function() {
    
    // czy leel0 czy odpowiedz
    var is_parent = this.mCommentRef.get('id_page_comment_parent') == null;
    
    this.mEl.getElement('.avatar').set('src', this.mCommentRef.get('avatar'));
    this.mEl.getElement('.comment').set('html', '<span class="name">'+this.mCommentRef.get('user_name')+':</span>'  + this.mCommentRef.get('comment'));
    
    // Podsumowanie - w przypadku parenta, czas i linki akcji, w przypadku odpowiedzi, podpis i czas
    if(is_parent) {
      
      // counter
      if(this.mCommentRef.get('is_resolved') == 0) {
        this.mEl.getElement('.counter').set('text', this.mCommentRef.get('counter'));
      }
      else {
        this.mEl.getElement('.counter').set('html', '&#10004;');
      }

      // Link to the comment
      this.mEl.getElement('.counter').removeEvents().addEvent('click', this.mCommentRef.goToComment.bind(this.mCommentRef));

      // summary
      this.mEl.getElement('.summary').set('html', '').microjungle([
        ['span.date', Preview.prettyDate(this.mCommentRef.get('insert_date'))],
        ['span.actions', [
            ['a.delete[href=#]', 'Delete'],
            ['a.resolve[href=#]', this.mCommentRef.isResolved() ? 'Unresolve' : 'Resolve']
        ]]
      ]);
      
      // event na delete
      this.mEl.getElement('.summary .delete').removeEvents().addEvent('click', this.mCommentRef.remove.bind(this.mCommentRef));
      
      // event na resolve
      this.mEl.getElement('.summary .resolve').removeEvents().addEvent('click', this.mCommentRef.toggleResolved.bind(this.mCommentRef));
    }
    else {
      
      // usun element counter
      this.mEl.getElement('.counter').destroy();
      
      // summary
      this.mEl.getElement('.summary').set('html', '').microjungle([
        ['span.date', Preview.prettyDate(this.mCommentRef.get('insert_date'))],
        ['span.actions', [
            ['a.delete[href=#]', 'Delete']
        ]]
      ]);
      
      // event na delete
      this.mEl.getElement('.summary .delete').removeEvents().addEvent('click', this.mCommentRef.remove.bind(this.mCommentRef));
    }
    
    this.mCommentRef.isResolved() ? this.mEl.addClass('resolved') : this.mEl.removeClass('resolved');
    
    return this;
  },
  
  getDOMElement: function() {
    return this.mEl;
  },
  
  destroy: function() {
    this.mEl.destroy();
    delete this.mCommentRef;
  },
  
  highlight: function() {
    this.mEl.addClass('active');
  },
  
  unhighlight: function() {
    this.mEl.removeClass('active');
  }

});
/** 
 * Pokazuje popup z mozliwoscia wpisania nazwy uzytkownika
 */
var DPPageComments_SetUserNamePopup = new Class({
  
  initialize: function() {
    this.render();
    this.registerEvents();
  },
  
  render: function() {
    this.mEl = new Element('div', {
      'id': 'set-name-popup',
      'html': '<h2>Set your name</h2><input type="text" maxlength="30" /><a href="#" class="save-btn">OK, that\'s me!</a><a href="#" class="cancel-btn">cancel</a>'
    }).inject(document.body);
    
    this.mSaveBtnEl = this.mEl.getElement('.save-btn');
    this.mCancelBtnEl = this.mEl.getElement('.cancel-btn');
    this.mTextBoxEl = this.mEl.getElement('input');
    
    this.mTextBoxEl.set('value', Preview.Comments.getUserName().unescapeHTML());
    
    // Obsluga Entera w inpucie (wykonuje zapis (save))
    this.mTextBoxEl.addEvent('keyup', function(pEvent) {
      if (pEvent.key === 'enter') {
        this.save();
      }
    }.bind(this));
    
    this.mEl.position({
      'position': 'center',
      'edge': 'center'
    });
    
    (function() {
      this.mTextBoxEl.select();  
      this.mTextBoxEl.focus();
    }.delay(50, this));
    
  },
  
  registerEvents: function() {
    this.mSaveBtnEl.addEvent('click', this.save.bind(this));
    this.mCancelBtnEl.addEvent('click', this.destroy.bind(this));
  },
  
  save: function() {
    
    var value = this.mTextBoxEl.get('value') || 'Anonymous';
    
    Preview.Comments.setUserName(value.escapeHTML());
    this.destroy();
  },
  
  destroy: function() {
    this.mEl.destroy();
  }
  
});
/** 
 * Pokazuje popup z potwierdzeniem usuniecia komentarza
 */
var DPPageComments_RemoveCommentPopup = new Class({

  Implements: [Events],

  mCommentRef: null,
  
  initialize: function(pCommentRef) {
    this.mCommentRef = pCommentRef;
    this.render();
    this.registerEvents();
  },
  
  render: function() {
    this.mEl = new Element('div', {
      'id': 'remove-comment-popup',
      'html': '<h2>Are you sure you want to delete this comment?</h2><a href="#" class="yes-btn">Yes, I\'m sure</a><a href="#" class="cancel-btn">cancel</a>'
    }).inject(document.body);
    
    this.mYesBtnEl = this.mEl.getElement('.yes-btn');
    this.mCancelBtnEl = this.mEl.getElement('.cancel-btn');
    
    this.mEl.position({
      'position': 'center',
      'edge': 'center'
    });
  },
  
  registerEvents: function() {
    this.mYesBtnEl.addEvent('click', this.removeComment.bind(this));
    this.mCancelBtnEl.addEvent('click', this.destroy.bind(this));
  },
  
  removeComment: function() {
    this.fireEvent('remove');
    this.destroy();
  },
  
  destroy: function() {
    this.mEl.destroy();
  }
  
});
/*
 * AUTOGROW TEXTAREA
 * Version 1.0
 * A mooTools plugin
 * by Gary Glass (www.bookballoon.com)
 * mailto:bookballoon -at- bookballoon.com
 *
 * Based on a jQuery plugin by Chrys Bader (www.chrysbader.com).
 * Thanks to Aaron Newton for reviews and improvements.
 *
 * Copyright (c) 2009 Gary Glass (www.bookballoon.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * NOTE: This script requires mooTools. Download mooTools at mootools.net.
 *
 * USAGE:
 *		new AutoGrow(element);
 * where 'element' is a textarea element. For example:
 *		new AutoGrow($('myTextarea'));
 */
var AutoGrow = new Class({

  Implements: [Options, Events],

  options: {
    margin: 0, // gap (in px) to maintain between last line of text and bottom of textarea
    minHeight: 0, // minimum height of textarea
    maxHeight: 0,
    tween: true
    /* onResize: null */
  },
  
  resizeRef: null,

  initialize: function(textarea, options) {
    this.setOptions(options);
    this.textarea = $(textarea);
    this.resizeRef = this.resize.bind(this);

    this.textarea.addEvent('keyup', this.resizeRef);
    this.textarea.addEvent('mouseup', this.resizeRef);

    this.options.tween && this.textarea.set('tween', {
      'duration': 150,
      'onComplete': this.fireEvent.pass(['resize'], this)
    });

    this.options.minHeight = this.textarea.clientHeight;

    this.dummy =  new Element("div", {
      styles:	{
        "overflow-x" : "hidden",
        "position"   : "absolute",
        "top"        : 0,
        "left"       : "-9999px",
        "white-space": "pre-wrap"

          // for debugging
//        'top'        : 10,
//        'left'       : 10,
//        'background' : '#fff',
//        'z-index'    : 999999
      }
    })
    .inject(document.body);

    this.setDummyStyles();
    this.resize.delay(300, this);
  },

  setDummyStyles: function() {
    this.dummy.setStyles(this.textarea.getStyles(
      "font-size",
      "font-family",
      "font-style",
      "font-variant",
      "font-weight",
      "width",
      "line-height",
      "padding"
    ));
  },

  resize: function(pForce) {
    var html = this.textarea.get('value').replace(/\n|\r\n/g, '<br>X') + 'X';

    if (pForce || (this.dummy && this.dummy.get("html").toLowerCase() != html.toLowerCase())){
      this.dummy.set("html", html);

      var triggerHeight = this.dummy.getComputedSize().height + this.options.margin,
      newHeight = Math.max(this.options.minHeight, triggerHeight);

      if(this.options.maxHeight && newHeight > this.options.maxHeight) {
        newHeight = this.options.maxHeight;
      }
      
      if (this.textarea.clientHeight != newHeight) {

        if(this.options.tween) {
          this.textarea.tween("height", newHeight);
        }
        else {
          this.textarea.setStyle('height', newHeight);
          this.fireEvent('resize');
        }
      }
    }
  },
  
  destroy: function() {
    this.dummy.destroy();
    delete this.dummy;
    
    this.textarea.removeEvent('keyup', this.resizeRef);
    this.textarea.removeEvent('mouseup', this.resizeRef);
  }

});
var dmsDPElement_Preview_Navigation_Item = new Class({
  
  mEl: null,
  
  mType: null,
  
  initialize: function(pEl, pType) {
    this.mEl = pEl;
    this.mType = pType || 'vertical';
    
    this.attachEvents();
    this.setWidth();
  },
  
  /**
   * Ustawia szerokosc dla listy na podstawie najdluzszego elementu z tekstem (<em/>)
   * 
   * Jest to potrzebne aby wszystkie subpozycje pojawialy sie poprawnie
   */
  setWidth: function() {
    var els = this.mEl.getChildren('li').getChildren('span').flatten(),
        width_list;
    
    width_list = els.map(function(pEl) {
      var el = pEl.getElement('em'),
          clone = el.clone(),
          width;
          
      clone.setStyles({
        'padding': el.getStyle('padding'),
        'display': 'none'
      });
      
      clone.inject(document.body);
      width = clone.measure(function() {
        return this.offsetWidth;
      });
      
      clone.destroy();
      
      return width;
    });
    
    this.mEl.setStyle('width', width_list.max());
  },
  
  attachEvents: function() {
    this.mEl.getParent().addEvents({
      'mouseenter': this.show.bind(this),
      'mouseleave': this.hide.bind(this)
    });
  },
  
  show: function() {
    this.mEl.show();
    
    if('horizontal' === this.mType) {
      this.showHorizontal();
    }
    else {
      this.showVertical();
    }
  },
  
  showHorizontal: function() {
    this.mEl.position({
      'relativeTo': this.mEl.getParent(),
      'edge': 'topLeft',
      'position': 'bottomLeft'
    })
  },
  
  showVertical: function() {
    var pos = this.mEl.position({
          'relativeTo': this.mEl.getParent(),
          'edge': 'topLeft',
          'position': 'topRight',
          'returnPos': true
        }),
        screen_width = window.getWidth() + window.getScrollLeft();
    
    if(this.mEl.getWidth() + pos.left + this.mEl.getPosition().x <= screen_width) {
      this.mEl.setStyles(pos);
      return;
    }
    
    this.mEl.position({
      'relativeTo': this.mEl.getParent(),
      'edge': 'topRight',
      'position': 'topLeft'
    });
  },
  
  hide: function() {
    this.mEl.hide();
  }
  
})
var dmsDPElement_Preview_Navigation = new Class({
  
  mEl: null,
  mActiveBgColor: null,
  mInactiveBgColor: null,
  
  initialize: function(pEl, pType) {
    this.mEl = pEl;
    var direct_childs = pEl.getChildren('li');
    
    pEl.getElements('li > ul').each(function(pEl) {
      var type = null;
      
      if(direct_childs.contains(pEl.getParent())) {
        type = pType;
      }
      
      new dmsDPElement_Preview_Navigation_Item(pEl, type);
    });
  },
  
  setBgColors: function(pActive, pInactive) {
    this.mActiveBgColor = pActive;
    this.mInactiveBgColor = pInactive;
    
    // Mouseover na glowne elementy (zmiana koloru na wybrany dla aktywnego elementu)
    this.mEl.getElements('li.inactive.main').each(function(pEl){
      pEl.addEvent('mouseover', function(){
        pEl.setStyle('background-color', this.mActiveBgColor);
      }.bind(this));
      pEl.addEvent('mouseout', function(){
        pEl.setStyle('background-color', this.mInactiveBgColor);
      }.bind(this));
    }.bind(this));
  }
  
})
var _kmq = _kmq || [];
var _kmk = _kmk || '68f9313d866df031326598d49a29feb2a560246d';
function _kms(u){
  setTimeout(function(){
    var d = document, f = d.getElementsByTagName('script')[0],
    s = d.createElement('script');
    s.type = 'text/javascript'; s.async = true; s.src = u;
    f.parentNode.insertBefore(s, f);
  }, 1);
}
_kms('//i.kissmetrics.com/i.js');
_kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
(function(c,a){
  window.mixpanel=a;
  var b,d,h,e;
  b=c.createElement("script");
  b.type="text/javascript";
  b.async=!0;
  b.src=("https:"===c.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.0.min.js';
  d=c.getElementsByTagName("script")[0];
  d.parentNode.insertBefore(b,d);
  a._i=[];
  a.init=function(b,c,f){
    function d(a,b){
      var c=b.split(".");
      2==c.length&&(a=a[c[0]],b=c[1]);
      a[b]=function(){
        a.push([b].concat(Array.prototype.slice.call(arguments,0)))
      }
    }
    var g=a;
    "undefined"!==typeof f?
    g=a[f]=[]:f="mixpanel";
    g.people=g.people||[];
    h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");
    for(e=0;e<h.length;e++)d(g,h[e]);
    a._i.push([b,c,f])
  };
  
  a.__SV=1.1
})(document,window.mixpanel||[]);

mixpanel.init("0298878303364f637de40b237f959989");
var analytics=analytics||[];(function(){var e=["identify","track","trackLink","trackForm","trackClick","trackSubmit","page","pageview","ab","alias","ready","group"],t=function(e){return function(){analytics.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var n=0;n<e.length;n++)analytics[e[n]]=t(e[n])})(),analytics.load=function(e){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=("https:"===document.location.protocol?"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)};

analytics.load("e7n2wyrucd");
;(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://static.intercomcdn.com/intercom.v1.js';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}};})();
