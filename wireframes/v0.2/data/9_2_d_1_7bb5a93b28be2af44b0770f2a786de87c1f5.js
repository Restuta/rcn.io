(function() {
  var zen = function(string) {
    var replace = {
        '\\[([a-zA-Z\\-]+)=([^\\]]+)\\]': function(parsed) {
          var props = {};
          props[parsed[1]] = parsed[2];

          return props;
        },
        '#([a-zA-Z][a-zA-Z0-9\\-_]*)': function(parsed) {
          return { 'id': parsed[1] }
        },
        '\\.([a-zA-Z][a-zA-Z0-9\\-_]*)': function(parsed) {
          return { 'class': parsed[1] }
        }
      },
      props = {};
    
    new Hash(replace).each(function(parser, regexp) {
      var match;
      
      regexp = new RegExp(regexp);
      
      while(string.test(regexp)) {
        match = string.match(regexp);
        
        $extend(props, parser(match));
        string = string.replace(match[0], '');
      }
    })
    
    return [string, props];
  };
  
  var microjungle = function(template) {
    
    // they just doing their job.
    var monkeys =  function(what, who) {
      what.each(function(j) {
        
        if (!j) {
          return;
        }
         
        if (typeof j == 'string') {
          who.innerHTML += j;
        } 
        else if (typeof j[0] == 'string') {
          var parsed_zen = zen(j.shift()),
              el = new Element(parsed_zen[0]),
              attrs = {}.toString.call(j[0]) === '[object Object]' ? j.shift() : {};
              
          $extend(attrs, parsed_zen[1]);

          attrs && el.setProperties(attrs);
          who.appendChild(monkeys(j, el));
        } 
        else if (j.nodeType === 1 || j.nodeType === 11) {
          who.appendChild(j);
        } 
        else {
          monkeys(j, who);
        }
      })

      return who;
    };

    return monkeys(template, document.createDocumentFragment());
  };
  
  Element.implement({
    
    microjungle: function(template) {
      this.appendChild(microjungle(template));
      
      return this;
    }
  })
  $.microjungle = microjungle
  
})()
/**
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint undef:true, browser:true */

/**
 * Creates a namespace for the lscache functions.
 */
var lscache = function() {

  // Prefix for all lscache keys
  var CACHE_PREFIX = 'lscache-';

  // Suffix for the key name on the expiration items in localStorage
  var CACHE_SUFFIX = '-cacheexpiration';

  // expiration date radix (set to Base-36 for most space savings)
  var EXPIRY_RADIX = 10;

  // time resolution in minutes
  var EXPIRY_UNITS = 60 * 1000;

  // ECMAScript max Date (epoch + 1e8 days)
  var MAX_DATE = Math.floor(8.64e15/EXPIRY_UNITS);

  var cachedStorage;
  var cachedJSON;
  var cacheBucket = '';

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  // It's not run at parse-time as it takes 200ms in Android.
  function supportsStorage() {
    var key = '__lscachetest__';
    var value = key;

    if (cachedStorage !== undefined) {
      return cachedStorage;
    }

    try {
      setItem(key, value);
      removeItem(key);
      cachedStorage = true;
    } catch (exc) {
      cachedStorage = false;
    }
    return cachedStorage;
  }

  // Determines if native JSON (de-)serialization is supported in the browser.
  function supportsJSON() {
    /*jshint eqnull:true */
    if (cachedJSON === undefined) {
      cachedJSON = (window.JSON != null);
    }
    return cachedJSON;
  }

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor((new Date().getTime())/EXPIRY_UNITS);
  }

  /**
   * Wrapper functions for localStorage methods
   */

  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
  }

  function setItem(key, value) {
    // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
  }

  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  }

  return {

    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     * @param {number} time
     */
    set: function(key, value, time) {
      if (!supportsStorage()) return;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.
      if (typeof value !== 'string') {
        if (!supportsJSON()) return;
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Sometimes we can't stringify due to circular refs
          // in complex objects, so we won't bother storing then.
          return;
        }
      }

      try {
        setItem(key, value);
      } catch (e) {
        if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          // If we exceeded the quota, then we will sort
          // by the expire time, and then remove the N oldest
          var storedKeys = [];
          var storedKey;
          for (var i = 0; i < localStorage.length; i++) {
            storedKey = localStorage.key(i);

            if (storedKey.indexOf(CACHE_PREFIX + cacheBucket) === 0 && storedKey.indexOf(CACHE_SUFFIX) < 0) {
              var mainKey = storedKey.substr((CACHE_PREFIX + cacheBucket).length);
              var exprKey = expirationKey(mainKey);
              var expiration = getItem(exprKey);
              if (expiration) {
                expiration = parseInt(expiration, EXPIRY_RADIX);
              } else {
                // TODO: Store date added for non-expiring items for smarter removal
                expiration = MAX_DATE;
              }
              storedKeys.push({
                key: mainKey,
                size: (getItem(mainKey)||'').length,
                expiration: expiration
              });
            }
          }
          // Sorts the keys with oldest expiration time last
          storedKeys.sort(function(a, b) { return (b.expiration-a.expiration); });

          var targetSize = (value||'').length;
          while (storedKeys.length && targetSize > 0) {
            storedKey = storedKeys.pop();
            removeItem(storedKey.key);
            removeItem(expirationKey(storedKey.key));
            targetSize -= storedKey.size;
          }
          try {
            setItem(key, value);
          } catch (e) {
            // value may be larger than total quota
            return;
          }
        } else {
          // If it was some other error, just give up.
          return;
        }
      }

      // If a time is specified, store expiration info in localStorage
      if (time) {
        setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
      } else {
        // In case they previously set a time, remove that info from localStorage.
        removeItem(expirationKey(key));
      }
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function(key) {
      if (!supportsStorage()) return null;

      // Return the de-serialized item if not expired
      var exprKey = expirationKey(key);
      var expr = getItem(exprKey);

      if (expr) {
        var expirationTime = parseInt(expr, EXPIRY_RADIX);

        // Check if we should actually kick item out of storage
        if (currentTime() >= expirationTime) {
          removeItem(key);
          removeItem(exprKey);
          return null;
        }
      }

      // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
      var value = getItem(key);
      if (!value || !supportsJSON()) {
        return value;
      }

      try {
        // We can't tell if its JSON or a string, so we try to parse
        return JSON.parse(value);
      } catch (e) {
        // If we can't parse, it's probably because it isn't an object
        return value;
      }
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function(key) {
      if (!supportsStorage()) return null;
      removeItem(key);
      removeItem(expirationKey(key));
    },

    /**
     * Returns whether local storage is supported.
     * Currently exposed for testing purposes.
     * @return {boolean}
     */
    supported: function() {
      return supportsStorage();
    },

    /**
     * Flushes all lscache items and expiry markers without affecting rest of localStorage
     */
    flush: function() {
      if (!supportsStorage()) return;

      // Loop in reverse as removing items will change indices of tail
      for (var i = localStorage.length-1; i >= 0 ; --i) {
        var key = localStorage.key(i);
        if (key.indexOf(CACHE_PREFIX + cacheBucket) === 0) {
          localStorage.removeItem(key);
        }
      }
    },
    
    /**
     * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
     * @param {string} bucket
     */
    setBucket: function(bucket) {
      cacheBucket = bucket;
    },
    
    /**
     * Calls callback to access data for given bucket
     * 
     * @param {string} bucket
     * @param {function} callback
     * @return {mixed}
     */
    bucket: function(bucket, callback) {
      var old_bucket = cacheBucket,
          result;
          
      if(old_bucket == bucket) {
        return callback();
      }
      
      this.setBucket(bucket);
      result = callback();
      this.setBucket(old_bucket);
      
      return result;
    },
    
    /**
     * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
     */
    resetBucket: function() {
      cacheBucket = '';
    }
  };
}();

var hashuri = (function() {
  var hash_map = {},
      raw_hash,
      map = Array.prototype.map,
      each = Array.prototype.forEach;
  
  if(!each) {
    each = function(callback) {
          
      for(var i = 0; i < this.length; i++) {
        callback(this[i], i);
      }
    }
  }
  
  if(!map) {
    map = function(callback) {
      var mapped = [];
         
      each.call(this, function(value) {
        mapped.push(callback(value));
      })
      
      return mapped;
    }
  }
  
  var create_hash_map = function() {
    var hash;
    
    if(document.location.hash == raw_hash) {
      return;
    }
    
    raw_hash = document.location.hash;
    hash = raw_hash.replace(/^#\??/, '');
    hash_map = {};
    
    if(!hash) {
      return;
    }
    
    map.call(hash.split('&'), function(arg) {
      var parts = arg.split('=');

      hash_map[parts[0]] = parts[1] ? decodeURI(parts[1]) : null;
    });
  }
  
  var to_uri = function(params) {
    var hash_uri_parts = [],
        key;
      
    for(key in params) {
      params.hasOwnProperty(key) && hash_uri_parts.push(key + '=' + encodeURI(params[key]));
    }

    return '#?' + hash_uri_parts.join('&');
  }
  
  var update_location = function() {
    document.location = to_uri(hash_map);
  }
  
  create_hash_map();
  
  // support for legacy IEs
  (window.attachEvent || window.addEventListener)('hashchange', create_hash_map);
  
  return {
    
    toUri: to_uri,
    
    get: function(param) {
      return hash_map[param];
    },
    
    set: function(param, value) {
      
      if('[object Object]' == Object.prototype.toString.call(param)) {
        hash_map = param;
      }
      else {
        
        if(undefined === value) {
          delete hash_map[param];
        }
        else {
          hash_map[param] = value;
        }
      }
      
      update_location();
    }
  }
})();
/**
/**
 * Tworzy toolbar z itemami ktorych zawartosc moze zmieniac sie podczas odswiezania ich (metoda refresh)
 * 
 * Toolbar podczas odswiezania wywoluje metode refresh() na kazdym z elementow a ten decyduje czy cos powinno sie zmienic 
 * (np. ikona moze pozostac aktywa lub deaktywowac sie)
 * 
 */
var DPMainToolbar = new Class({
  
  mItems: [],
  
  mParentEl: document.body,

  mResponsive: null,

  mHistoryWidget: null,

  initialize: function() {
    this.mResponsive = new DPMainToolbar_Widget_Button_Responsive();
    // sorry, nie wiem jak to inaczej zrobic :(
    this.pageWidget = new DPMainToolbar_Widget_Page();
    this.link_button =  new DPMainToolbar_Widget_Button_Link();
    this.mHistoryWidget = new DPMainToolbar_Widget_UndoRedo();
    
    this.mItems = [
      this.pageWidget,
      new DPMainToolbar_Widget_ButtonGroup('tools', [
        this.mHistoryWidget,
        new DPMainToolbar_Widget_Button_Group(),
        new DPMainToolbar_Widget_ButtonToolbar({
          'text': 'Arrange',
          'tooltip': 'Arrange',
          'class_name': 'arrange',
          'button_style': 'inactive only-icon icon-arrange',
          'onRefresh': function() {
            var locked_states = dpManager.dpWorkBench.getActivePage().getActiveElements()
              .map(function(pEl) {
                return pEl.getProperty('locked');
              })
              .unique();

            // button jest aktywny gdy zaznaczone elmenety nie sa zablokowane
            if(locked_states.length > 1 || (1 == locked_states.length && 0 == locked_states.pop())) {
              this.mTextEl.removeClass('inactive');
            }
            else {
              this.mTextEl.addClass('inactive');
            }
          },
          'showToolbar': function(pEl) {
            if (this.mTextEl.hasClass('inactive')) {
              return;
            }

            this.toolbar = new dmsDPPropertyToolbar_Toolbar_Core(pEl, null, {
              'position': 'bottom',
              'container': dpManager.dpMainToolbar.getEl(),
              'class_name': 'arrange',
              'offset': 7,
              'onDestroy': function() {
                this.mTextEl.removeClass('pushed');
                this.toolbar = null;
              }.bind(this)
            });

            this.toolbar.addWidget(new DPMainToolbar_Widget_Toolbar_Arrange());
            this.toolbar.toggle(true);
            this.mTextEl.addClass('pushed');
          }
        }),
        new DPMainToolbar_Widget_Button_Align(),
        this.link_button,
        new DPMainToolbar_Widget_Button_Lock(),
        new DPMainToolbar_Widget_Button_Image(),
        new DPMainToolbar_Widget_Button_LayersPanel(),
        new DPMainToolbar_Widget_Button({
          'text': 'UX Patterns',
          'class_name': '',
          'button_style': 'only-icon-font icon-font-patterns',
          'tooltip': 'UX Patterns',
          'onClick': function() {
            if (LayersPanelWindow.isOpened()) {
              LayersPanelWindow.destroy();
              document.querySelector('div#DPMainToolbar .icon-font-layers').classList.remove('active');
            }
            dpManager.uxpPatterns.toggleLibrary();

            try {
              window.analytics.track("open uxpattern library", {category: "app", label: 'toolbar'});
            }
            catch (e) {}
          }
        })
      ]),
      new DPMainToolbar_Widget_ButtonGroup('parameters', [
        new DPMainToolbar_Widget_Width(),
        new DPMainToolbar_Widget_Height(),
        new DPMainToolbar_Widget_PositionX(),
        new DPMainToolbar_Widget_PositionY(),
        new DPMainToolbar_Widget_Rotation(),
        new DPMainToolbar_Widget_Opacity()
      ]),
      // Przełącznik dla komponentów, na oznaczanie, czy komponent ma być exportowalny
//      new DPMainToolbar_Widget_CheckboxGroup({
//        'class_name': 'components',
//        'load': function() {
//          dpManager.addEvent('load', function(){
//            dpManager.dpWorkBench.addEvent('onPageLoaded', function(){
//              console.log('onPageLoaded');
//            });
//          });
//        },
//        'options': [{
//          'id': 'toggle-exportable',
//          'label': 'Exportable',
//          'value': '1',
//          'checked': false,
//          'click': function() {
//            new Dejax().send({
//              mode: 'cancel',
//              onComplete: function(pRes){
//                $('toggle-exportable').set('checked', pRes.exportable == '1' ? 'checked' : false);
//              },
//              data: {
//                'id_page': dpManager.dpPageInspector.getActivePageID()
//              },
//              url: '/ajax/dmsDPPage/ToggleExportable/'
//            });
//          }
//        }]
//      }),
      new DPMainToolbar_Widget_ButtonGroup('action', [
        new DPMainToolbar_Widget_ButtonToolbar({
          'class_name': 'iteration',
          'button_style': 'only-icon-font icon-font-iterations',
          'text': 'Iterations',
          'tooltip' : 'By creating a new iteration you are saving<br> your work at its current stage.You will always<br> be able to come back to this version, retrieve it,<br> or pass a link to it for a review',
          'showToolbar': function(pEl) {
            this.toolbar = new dmsDPPropertyToolbar_Toolbar_Core(pEl, null, {
              'position': 'bottom',
              'container': pEl.getParent().getParent(),
              'class_name': 'iterations',
              'offset': 7,
              'onDestroy': function() {
                this.toolbar = null;
                this.mEl.removeClass('pushed');
              }.bind(this)
            });

            this.toolbar.addWidget(new DPMainToolbar_Widget_Toolbar_Iteration());
            this.toolbar.toggle(true);
            this.mEl.addClass('pushed');
          }
        }),
        new DPMainToolbar_Widget_Button_Configure(),
        this.createShareButton(),
        new DPMainToolbar_Widget_Button_Preview()
      ])
    ];

    this.render();
    
    // kiedy tworzy sie DPMainToolbar nie ma jeszcze zaladowanej strony
    // dopiero po jej zaladowaniu mozna podpiac event onActivateElements
    dpManager.dpWorkBench.addEvent('onPageLoaded', function() {
      dpManager.dpWorkBench.getActivePage().addEvent('onActivateElements', this.refresh.bind(this));
    }.bind(this));
  },

  hideToolbars: function() {
    this.mItems.forEach(function(value) {
      if (value instanceof DPMainToolbar_Widget_ButtonGroup) {
        value.mItems.forEach(function(value) {
          if (value instanceof DPMainToolbar_Widget_ButtonToolbar && value.isToolbarOpen()) {
            value.hideToolbar();
          }
        });
      }
    });
  },

  /**
   * Renderuje glowny element toolbara oraz elementy takie jak przycisk dropdowna, klawisze Share, HTML
   * 
   */
  render: function() {
    this.mEl = new Element('div', {'id': 'DPMainToolbar'});

    this.mItems.each(function(pItem) {
      pItem.render(this.mEl);
    }.bind(this));

    this.mItems.forEach(function(value) {
      if (value instanceof DPMainToolbar_Widget_ButtonGroup) {
        value.mItems.forEach(function(value) {
          if (value instanceof DPMainToolbar_Widget_ButtonToolbar) {
            value.addEvent(DPMainToolbar_Widget_ButtonToolbar.OPEN_TOOLBAR, this.hideToolbars.bind(this));
          }
          else if (value instanceof DPMainToolbar_Widget_Button) {
            value.addEvent('click', this.hideToolbars.bind(this));
          }
        }.bind(this));
      }
    }.bind(this));

    this.mEl.inject(this.mParentEl);
    this.refresh();

    if(document.getElement("#trial-info")){
      this.mEl.setStyle('top', 25);
    }
    return this;
  },
  
  getEl: function() {
    return this.mEl;
  },
  
  /**
   * Wysyla sygnal odswiezenia do kazdego elementu toolbara (Item)
   * 
   * @param hash pProps wlasciwosci elementu ktory np. border-width, width, height itp. 
   */
  refresh: function(pProps) {
    this.mItems.each(function(pItem) {
      pItem.refresh(pProps);
    }.bind(this));

    return this;
  },
  
  createShareButton: function() {
    var thisRef = this;
    
    return new DPMainToolbar_Widget_ButtonToolbar({
      'text': 'Share',
      'class_name': 'sharing',
      'button_style': 'only-icon-font icon-font-sharing',
      'tooltip': 'Share (Preview, Share by email, Download as HTML)',
      'tooltip_position': 'top-right-arrow',
      'showToolbar': function(pEl) {
        var share_options = {
          'project_hash': dpManager.dpProject.getHash(),
          'preview_password': dpManager.dpProject.mData.preview_password
        };

        if (uxpDocEditor) {
          share_options.id_page = uxpDocEditor.getDocumentId();
        }
        else if(dpManager.dpPageInspector.isComponent()) {
          share_options.id_page = dpManager.dpPageInspector.getPages()[0].id_page;
        }
        else {
          share_options.id_page = dpManager.dpPageInspector.getActivePageID();
        }

        this.toolbar = new dmsDPPropertyToolbar_Toolbar_Core(pEl, null, {
          'position': 'bottom',
          'container': thisRef.getEl(),
          'class_name': 'share',
          'offset': 9,
          'onDestroy': function() {
            this.toolbar = null;
            this.mTextEl.removeClass('pushed');
          }.bind(this)
        });

        this.toolbar.addWidget(new DPMainToolbar_Widget_Toolbar_Share(share_options));
        this.toolbar.toggle(true);

        this.mTextEl.addClass('pushed');
      }
    });
  }

});

var dmsDPPropertyToolbar_Toolbar_Core = new Class({

  Implements: [Events, Options],

  mWidgets: [],

  mRelativeEl: null,

  mEl: null,

  mDestroyRef: null,

  mPreventDestroy: false,

  mToggleRefs: {},

  mRendered: false,

  options: {
    'position': null,
    'container': null,
    'offset': null,
    'class_name': null
  },

  mPhantomMode: false,

  initialize: function(pRelativeEl, pWidgets, pOptions) {
    this.mRelativeEl = pRelativeEl;
    pOptions = pOptions || {};

    if(pWidgets) {
      pWidgets.each(this.addWidget.bind(this));
    }

    this.mDestroyRef = this.destroy.bind(this);

    if(!pOptions.container) {
      pOptions.container = dpManager.dpWorkBench.getWorkBenchEl();
    }

    this.setOptions(pOptions);
  },

  show: function() {
    this.render();
    this.setPosition();

    window.addEvent('click', this.mDestroyRef);
  },

  quickHide: function () {
    this.mEl.hide();
  },

  quickShow: function () {
    this.mEl.show();
    this.setPosition();
  },

  toggle: function(pShow) {

    if(undefined === pShow) {
      pShow = this.isActive() ? false : true;
    }

    if(!pShow) {
      this.mEl.hide();
      this.fireEvent('toggle', [false]);
    }
    else if(this.mRendered) {
      this.mEl.show();
      this.setPosition();
      this.fireEvent('toggle', [true]);
    }
    else {
      this.show();
      this.fireEvent('toggle', [true]);
    }
  },

  addWidget: function(pWidget) {
    this.mWidgets.push(pWidget);

    pWidget.setToolbar(this);
  },

  render: function() {
    this.mEl = new Element('div', {
        'class': 'property-toolbar'
      })
      .inject(this.options.container);

    if(this.options.class_name) {
      this.mEl.addClass(this.options.class_name);
    }
    if(this.options.id_name) {
      this.mEl.set('id', this.options.id_name);
    }

    this.mEl.microjungle([
      ['span', {'class': 'arrow'}]
    ]);

    this.mWidgets.each(function(pWidget) {
      pWidget.render(this.mEl);
    }.bind(this));

    this.mRendered = true;
  },

  refresh: function() {
    this.mWidgets.each(function(pWidget){
      pWidget.refresh();
    });
  },

  isActive: function() {
    return this.mEl && this.mEl.isVisible();
  },

  destroy: function(pE) {

    if(this.mPreventDestroy) {
      return;
    }

    var elements = this.mEl.getElements('*');
    elements.push(this.mEl);
    elements.push(this.mRelativeEl);
    elements.extend(this.mRelativeEl.getElements('*'));

    if(pE && elements.contains(pE.target)) {
      return;
    }

    this.mWidgets.each(function(pWidget) {
      pWidget.destroy();
      pWidget.removeEvents();
    });

    this.mWidgets = [];
    this.mEl.destroy();
    this.cleanUp();

    // only when editing wireframe
    if (dpManager.dpWorkBench) {
      dpManager.dpWorkBench.mCurrentToolsBox = null;
    }

    this.fireEvent('destroy');
  },

  cleanUp: function() {
    window.removeEvent('click', this.mDestroyRef);

    this.mDestroyRef = null;
  },

  /**
   * Ustawia pozycje toolbara
   *
   * W zaleznosci od polozenia elementu toolbar bedzie pojawiac sie w takim miejscu aby byl widoczny.
   * Domyslnie toolbar znajduje sie pod elementem (w centrum)
   *
   * W zaleznosci od pozycji toolbarowi zostania nadana odpowiednia klasa:
   * - bottom-left - gdy jest na dole zrownany lewa krawedzia z elementem
   * - bottom-center
   * - bottom-right
   * - right-top
   * - right-center
   * - right-bottom
   * - top-right
   * - top-center
   * - top-left
   * - left-top
   * - left-center
   * - left-bottom
   */
  setPosition: function() {
    var helper = new dmsDPPropertyToolbar_Toolbar_Position(this.mEl, this.mRelativeEl, this.options.position);

    if(this.options.offset) {
      helper.setOffset(this.options.offset);
    }

    helper.position();
  },

  preventDestroy: function(pState) {
    this.mPreventDestroy = pState;
  }

});
var DPPropertyToolbar = new Class({

  mToolbarIcons: {},
  
  initialize: function() {
    this.mToolbarIcons = {};
  },

  /**
   * Toolbar z ikonkami
   *
   * @param pIcons - array z nazwami obiektow-ikonek z this.mToolbarIcons
   */
  generateToolbar: function(pIcons) {
    this.mToolbar = new Element('div', {
      'class': 'Toolbar TextareaToolbar'
    });
    pIcons.each(function(pIcon) {
    	var icon = this.mToolbarIcons[pIcon];
      
    	var link = new Element('a', {'title': icon.name, 'class': 'ButtonActive'}).injectInside(this.mToolbar);
    	new Element('img', {'src': DSWindowSkin.mIconBaseP + icon.icon, 'alt': icon.name}).injectInside(link).disableSelection();
    	new Element('span').set('html', icon.name).injectInside(link);
	    link.addEvent('click', icon.action);
	    this.mToolbarIcons[pIcon]['el'] = link;
    }.bind(this));

    this.mDSWindow.mContentElement.adopt(this.mToolbar);
  }  

});
var dmsDPPropertyToolbar_Widget_Interface = new Class({
  
  Implements: [Events, Options],
  
  mToolbar: null,
  
  initialize: function(pOptions) {
    this.setOptions(pOptions);
  },
  
  setToolbar: function(pToolbar) {
    this.mToolbar = pToolbar;
  },
  
  /**
   * Pobiera wartość danej właściwości. 
   * Jesli przekazano, to wykorzystuje callback (options.getValue), a jeśli nie, pobiera wartość bezposrednio z getProperty aktywnego elementu
   * 
   * @param mixed pProperty 
   */
  getValue: function(pProperty) {
    if(typeof(this.options.getValue) == 'function') {
      return this.options.getValue(pProperty);
    }
    
    return this.mToolbar.getActiveElement().getProperty(pProperty);
  },
  
  render: function(pEl) {
  },
  
  refresh: function() {
  },
  
  destroy: function() {
  }
  
});
var DPMainToolbar_Widget_Button = new Class({
  
  Implements: [Events, Options],
  
  options: {
    'id': '',
    'text': '',
    'tooltip': '',
    'tooltip_position': '',
    'class_name': '',
    'button_style': ''
  },
  
  mEl: null,
  
  mTextEl: null,
  
  mTooltipEl: null,
  
  initialize: function(pOptions) {
    this.setOptions(pOptions);
  },
  
  render: function(pContainerEl) {
    
    this.mEl = new Element('a', {
      'id': this.options.id,
      'class': 'btn ' + this.options.class_name,
      'data-show-node': 'tooltip',
      'href': '#',
      'events': {
        'click': function(pE) {
          this.fireEvent('click', [this.mEl, pE, this]);
          return false;
        }.bind(this)
      }
    }).inject(pContainerEl);
    
    this.mTextEl = new Element('span', {
      'class': 'btn-flat ' + this.options.button_style,
      'data-show-node': 'tooltip'
    }).inject(this.mEl);
    this.setText();
    
    this.mTooltipEl = this.mEl.getElement('span.tooltip');
    
    if(this.options.tooltip) {
      this.renderTooltip();
      this.mTooltipEl.set('html', this.options.tooltip);
    }
    
    if(this.options.tooltip_position) {
      this.mTooltipEl.classList.add(this.options.tooltip_position);
    }

    return this;
  },
  
  renderTooltip: function() {
    this.mTooltipEl = new Element('span', {
      'class': 'tooltip'
    });

    this.mEl.microjungle([
        this.mTooltipEl
    ])
  },
  
  refresh: function() {
    
    try {
      if(!dpManager.dpWorkBench.getActivePage()) {
        return;
      }
      
      this.fireEvent('refresh', [this.mEl]);
    }
    catch(pError) {
      return false;
    }
  },
  
  setText: function(pText) {
    this.mTextEl.set('html', pText || this.options.text);
  }
  
})
var DPWorkBench_ResponsiveWidget = new Class({

  Extends: dmsDPPropertyToolbar_Widget_Interface,

  infoBoxEl: null,

  customSizeEl: null,

  customNameEl: null,

  mSelectedVersion: 0,

  getAllBreakpoints: function() {
    var optionElHelper = function(pEl) {
      return [
        'option', {html: pEl.getAttribute('data-text').replace('&infin;', '∞'), value: pEl.get('id')}
      ];
    }

    var newBreakpoints = [['option', {html: 'Choose a preset', selected: 'selected', disabled: 'disabled'}]];
    var existingBreakpoints = [];

    dpManager.dpProject.mVersions.each(function(pSize) {
      var elem = new Element('option', {
        'id': 'resp'+pSize.version,
        'data-type-id': pSize.version,
        'data-text': pSize.text
      });

      if(dpManager.dpProject.hasVersion(pSize.version)) {
        existingBreakpoints.push(optionElHelper(elem));
      } else {
        newBreakpoints.push(optionElHelper(elem));
      }

      this['resp'+pSize.version] = elem;
    }.bind(this));

    return {
      newBreakpoints: newBreakpoints,
      existingBreakpoint: existingBreakpoints
    };
  },

  render: function(pEl) {
    var breakpoints = this.getAllBreakpoints();
    var newBreakpoints = breakpoints.newBreakpoints;

    var presets = new Element('select', {
      events: {
        change: function(pE) {
          var breakpoints = this.getAllBreakpoints(); // because we need on every change get existing breakpoints (microjungle destroy that array)
          var existingBreakpoints = breakpoints.existingBreakpoint;

          var isCustom = (presets.selectedIndex == presets.options.length - 1);

          var fromSelectElement = new Element('select');

          fromSelectElement.microjungle(existingBreakpoints); // without "presets"

          //Zaznaczenie aktualnej opcji
          fromSelectElement.set('value', dpManager.dpProject.mMainVersion);

          var addBreakpointButton = new Element('button', {
            html: 'Add breakpoint',
            'class': 'btn-flat medium-size',
            events: {
              click: function() {
                if (isCustom) {
                  var name = this.customNameEl.get('value'),
                    size = this.customSizeEl.get('value'),
                    version = {
                      version: this.getMaxVariationVersion(dpManager.dpProject.mVersions) + 1,
                      text: name + ' (' + size + 'px)',
                      width: size
                    };

                  if ('' == name) {
                    this.customNameEl.setAttribute('class', 'border-error');
                    return false;
                  }
                  this.customNameEl.setAttribute('class', '');

                  dpManager.dpProject.mVersions.push(version);
                  this.toggleVersion(version, true, copyElementsEl.checked);
                } else {
                  var size = presets.value.match(/\d+$/)[0].toInt();
                  var copyFrom = fromSelectElement.value.match(/\d+$/)[0].toInt();
                  this.changeMainVersion(copyFrom);
                  this.toggleVersion(dpManager.dpProject.mVersions[size], true, copyElementsEl.checked);
                }
                this.mToolbar.destroy();
                return false;
              }.bind(this)
            }
          });

          var copyElementsEl = new Element('input', {
            type: 'checkbox',
            name: 'copy-elements',
            id: 'copy-elements',
            events: {
              click: function(pE) {
                this.toggleSelect(fromSelectElement, pE.event.target.checked);
              }.bind(this)
            },
            checked: true
          });

          if (this.infoBoxEl) {
            this.infoBoxEl.destroy();
          }

          if (isCustom) {
            this.infoBoxEl = (new Element('div', {'class':'creating-breakpoint'}).microjungle(
              [[this.renderCustomResponsiveForm()], ['div', copyElementsEl, ['label', {for: 'copy-elements', html: 'I want to copy all elements from: '}], fromSelectElement], [addBreakpointButton]]
            )).inject(pEl);
          } else {
            this.infoBoxEl = (new Element('div', {'class':'creating-breakpoint'}).microjungle(
              [['div', copyElementsEl, ['label', {for: 'copy-elements', html: 'I want to copy all elements from: '}], fromSelectElement], [addBreakpointButton]]
            )).inject(pEl);
          }
          this.infoBoxEl.innerHtml = 'asd';
          return;
        }.bind(this)
      }
    });

    newBreakpoints.push([['option', {html: 'Custom'}]]);

    presets.microjungle(newBreakpoints);

    presets.inject(pEl);

    this.refresh();
  },

  toggleSelect: function(pSelectEl, pEnable) {
    if (pEnable) {
      pSelectEl.removeAttribute('disabled');
    } else {
      pSelectEl.setAttribute('disabled', 'disabled');
    }
  },

  getMaxVariationVersion: function(versions) {
    var max = 0;
    versions.each(function(version) {
      if (max < version.version) {
        max = version.version;
      }
    });
    return max;
  },

  changeMainVersion: function(pId) {
    dpManager.dpProject.setMainVersion(pId);
  },

  toggleVersion: function(pSize, pCheck, pShouldICopyElements) {
    dpManager.dpPageInspector.mSelectedVersion = pSize.version;
    var version = pSize.version;
    if(!pCheck) {
      this.mToolbar.destroy();
      DSWindow.CreateConfirm('Are you sure you want to delete '+ pSize.text +'? <br/><br/>Please note that the '+ pSize.text +' breakpoint will be removed from all pages in this wireframe and that you will not be able to undo this action.', 'Delete '+ pSize.text +'? ', transtext('Yes'), transtext('No'), function() {
        dpManager.dpPageInspector.toggleVersion(version);
      }.bind(this));
    }
    else {
      dpManager.dpPageInspector.toggleVersion(version, pShouldICopyElements);

    }
  },

  updateSelect: function() {
    var options = [];

    if(this.mainSelect) {
      dpManager.dpProject.mVersions.each(function(pSize) {
        if(dpManager.dpProject.hasVersion(pSize.version)) {
          var sel = ['option[value='+pSize.version+']', pSize.text];
          options.push(sel);
        }
      });

      this.mainSelect.empty();
      this.mainSelect.microjungle(options);
      this.mainSelect.set('value', dpManager.dpProject.mMainVersion);
    }
  },

  renderCustomResponsiveForm: function() {

    this.customNameEl = new Element('input', {
      'type': 'text',
      'placeholder': 'Name'
    });

    this.customSizeEl = new DPMainToolbar_Properties_Input(null, 'height', 1, 10000).getDomElement();
    this.customSizeEl.setAttribute('placeholder', 'Size (px)');
    this.customSizeEl.setAttribute('value', 320);

    var customEl = new Element('div', {
        'class':'custom-breakpoint-form'
      })
      .adopt(this.customNameEl)
      .adopt((new Element('fieldset', {
          'data-unit': 'px'
        }).adopt(this.customSizeEl))
      );
    customEl.resetAndHide = function () {
      this.customNameEl.set('value', '');
      this.customSizeEl.set('value', '');
      customEl.hide();
    }.bind(this);
    return customEl;
  }

});

var DPMainToolbar_Widget_Button_Responsive = new Class({

  Extends: DPMainToolbar_Widget_Button,

  options: {
    'class_name': 'responsive',
    'text': 'Responsive',
    'button_style': 'inactive only-icon icon-responsive',
    'tooltip': 'Choose responsive breakpoints'
  },

  mToolbar: null,

  mResponiveWidget: null,

  initialize: function() {
    this.addEvent('click', this.showToolbar);
  },

  showToolbar: function(pEl) {
    this.mResponiveWidget = new DPWorkBench_ResponsiveWidget();
    
    if(this.mToolbar) {
      this.mToolbar.destroy();
      return false;
    }

    this.mToolbar = new dmsDPPropertyToolbar_Toolbar_Core(pEl, null, {
      'position': 'bottom',
      'class_name': 'responsive',
      'offset': 7,
      'container': dpManager.dpMainToolbar.getEl()
    });

    this.mToolbar.addWidget(this.mResponiveWidget);
    this.mToolbar.show();

    this.mToolbar.addEvent('destroy', function() {
      this.mToolbar = null;
    }.bind(this));

    return false;
  }

});

var DPMainToolbar_Widget = new Class({
  
  Implements: [Options],
  
  mEl: null,
  
  initialize: function(pOptions) {
    this.setOptions(pOptions);
  },
  
  isActive: function() {
    
  },
  
  refresh: function(pProps) {
    
  },
  
  render: function(pContainerEl) {
    
  },
  
  /**
   * Odswieza wlasciwosci inputa do edycji z delikatnym opoznieniem
   */
  refreshMinMax: function(pActiveEl, pMin, pMax, pProps) {
    (function() {
      this.mInput.mActiveEl = pActiveEl;
      
      if('undefined' !== typeof pMin && 'undefined' !== typeof pMax) {
        this.mInput.setMinMax(pMin, pMax);
      }
      
      if(this.mInput.isEnabled()) {
        this.mInput.refresh(pProps);
      }
    }.delay(200, this));
  }
  
})
var DPMainToolbar_Widget_ButtonGroup = new Class({
  
  Extends: DPMainToolbar_Widget,
  
  options: {
    'class_name': ''
  },
  
  mItems: [],
  
  initialize: function(pClassName, pWidgets) {
    this.setOptions({
      'class_name': pClassName
    })
    
    this.mItems = pWidgets || [];
  },
  
  render: function(pContainerEl) {
    var class_name = 'group';
    
    if(this.options.class_name) {
      class_name += ' ' + this.options.class_name;
    }
    
    this.mEl = new Element('span', {
        'class': class_name
      })
      .inject(pContainerEl);
      
    this.mItems.each(function(pWidget) {
      pWidget.render(this.mEl);
    }.bind(this))
  },
  
  refresh: function(pProps) {
    this.mItems.each(function(pWidget) {
      pWidget.refresh(pProps);
    })
  }
  
})
var DPMainToolbar_Widget_ButtonToolbar = new Class({

  Extends: DPMainToolbar_Widget_Button,

  toolbar: null,

  initialize: function(pOptions) {
    this.setOptions(pOptions);
    this.addEvent('click', this.onClick);
    if (typeof this.options.showToolbar == 'function') {
      this.showToolbar = this.options.showToolbar;
    }
  },

  isToolbarOpen: function() {
    return this.toolbar ? true : false;
  },

  hideToolbar: function() {
    this.toolbar.destroy();
    this.toolbar = null;
  },

  onClick: function(el) {
    if (this.isToolbarOpen()) {
      this.hideToolbar();
    } else if (typeof this.showToolbar == 'function') {
      this.fireEvent(DPMainToolbar_Widget_ButtonToolbar.OPEN_TOOLBAR);
      this.showToolbar(el);
    }
  }

});
DPMainToolbar_Widget_ButtonToolbar.OPEN_TOOLBAR = 'openToolbar';
var DPMainToolbar_Widget_CheckboxGroup = new Class({
  
  Implements: [Events, Options],
  
  options: {
    'tooltip': '',
    'class_name': '',
    'load': $empty,
    'options': [{
      'id': '',
      'label': '',
      'value': '',
      'checked': '',
      'click': $empty
    }]
  },
  
  mEl: null,
  
  mTooltipEl: null,
  
  initialize: function(pOptions) {
    this.setOptions(pOptions);
  },
  
  render: function(pContainerEl) {
    this.mEl = new Element('span', {
      'class': 'options'
    }).inject(pContainerEl);
    
    var text = new Element('span', {
      'text': 'Options',
      'class': 'btn-flat only-icon icon-configure',
      'data-show-node': 'tooltip'
    }).inject(this.mEl);
    
    
    var innersettings = new Element('span', {
      'class': 'check ' + this.options.class_name
    }).inject(this.mEl);
    
    this.options.options.each(function(pCheckbox) {
      var span = new Element('span').inject(innersettings);
      
      var checkbox = new Element('input', {
        'id': pCheckbox.id,
        'type': 'checkbox',
        'value': pCheckbox.value,
        'checked': pCheckbox.checked,
        'events': {
          'click': function(pE) {
            if(typeof pCheckbox.click == 'function') {
              pCheckbox.click(pE, this);
            }
            return true;
          }
        }
      }).inject(span);

      var label = new Element('label', {
        'class': 'checkbox-label',
        'for': pCheckbox.id,
        'html': pCheckbox.label
      }).inject(span);
    }.bind(this));
    
    this.mTooltipEl = this.mEl.getElement('span.tooltip');
    
    if(this.options.tooltip) {
      this.renderTooltip();
      this.mTooltipEl.set('html', this.options.tooltip);
    }
    
    this.addEvent('load', this.options.load.bind(this));
    this.fireEvent('load');
    
    return this;
  },
  
  renderTooltip: function() {
    this.mTooltipEl = new Element('span', {
      'class': 'tooltip'
    });
    
    this.mEl.microjungle([
      this.mTooltipEl
    ])
  },
  
  refresh: function() {
    
    try {
      if(!dpManager.dpWorkBench.getActivePage()) {
        return;
      }
      
      this.fireEvent('refresh', [this.mEl]);
    }
    catch(pError) {
      return false;
    }
  }
  
})

var DPSidebar = new Class({

  Implements: [Events],

  mEl: null,
  
  mCookieName: 'sidebar_config',
  
  Resizer: null,
  
  Cookie: null,
  
  mItems: null,

  initialize: function(pOptions) {
    var active_tab;
    
    this.mItems = new Hash({
      'home': new DPSidebar_Widget_Home('nav'),
      'elements': new DPSidebar_Widget_Elements('nav'),
      'components': new DPSidebar_Widget_Components('nav'),
      'search': new DPSidebar_Widget_TheSearchLaunch('nav'),
      'annotate': new DPSidebar_Widget_Annotate('nav'),
      'team': new DPSidebar_Widget_Team('nav'),
      'news': new DPSidebar_Widget_HelpOverlay('subnav'),
      'video' : new DPSidebar_Widget_Video('subnav'),
      'avatar': new DPSidebar_Widget_Avatar('subnav'),
      'help': new DPSidebar_Widget_Help('subnav')
    });

    this.render(pOptions || {});
    this.Cookie = new Cookie(this.mCookieName, {
      'duration': 365,
      'path': '/'
    });
    
    this.setResizer();
    
    active_tab = this.getConfig('active_tab');

    //jesli ktos nie ma cookie z configiem (czyli prawdopodnie jest 1 raz) to otwieramy elements
    if(!active_tab && this.getConfig() && this.getConfig().active_tab === undefined) {
      active_tab = "elements";
    }

    if(hashuri.get('new')) {
      active_tab = "elements";
    }

    if(active_tab && this.mItems.get(active_tab)) {
      this.mItems.get(active_tab).show({
        'animate': false
      })
    }
  },
  
  setResizer: function() {
    this.Resizer = new DPSidebar_WorkBenchResizer();
  },
  
  getWidget: function(pName) {
    return this.mItems.get(pName);
  },
  
  render: function(pOptions) {
    this.mEl = new Element('div', {
      'id': 'sidebar'
    }).inject(document.body);
      
    var nav_el = new Element('ul', {
      'class': 'nav'
    }).inject(this.mEl);

    var subnav_el = new Element('ul', {
      'class': 'subnav'
    }).inject(this.mEl);

    this.mItems.each(function(pItem, pKey) {
      var container_el = 'nav' === pItem.getSection() ? nav_el : subnav_el,
          list_el = new Element('li')
            .inject(container_el);
      
      if(pOptions && undefined !== pOptions[pKey]) {
        pItem.setOptions(pOptions[pKey])
      }
      
      pItem.setSidebar(this);
      pItem.render(list_el);
      pItem.addEvents({
        'show': function(pE, pOptions) {
          this.hideOtherToolbars(pItem);
          this.setConfig('active_tab', pKey);

          if (typeof pOptions.fire === 'undefined' || pOptions.fire) {
            this.fireEvent('toolbarShow', [pE, 'show', pOptions]);
          }
        }.bind(this),
        'hide': function(pE, pOptions) {
          this.setConfig('active_tab', null);
          this.fireEvent('toolbarHide', [pE, 'hide', pOptions]);
        }.bind(this)
      })
      
      pItem.afterInit && pItem.afterInit();
    }, this);
  },
  
  /**
   * Ukrywa wszystkie aktywne toolbary poza tym aktywnym
   * 
   * Podczas ukrywania toolbara *nie ulegnie zmianie* rozmiar workbencha
   */
  hideOtherToolbars: function(pActiveToolbar) {
    this.mItems.getValues()
      .each(function(pItem) {
        
        if(!(pItem instanceof DPSidebar_Widget_FloatingToolbar) || pItem === pActiveToolbar) {
          return;
        }
        
        if(!pItem.isToolbarVisible()) {
          return;
        }
        
        pItem.hide({
          'resize_workbench': false
        })
      })
  },
  
  setConfig: function(pName, pValue) {
    var config = this.getConfig();
    config[pName] = pValue;
    
    this.Cookie.write(JSON.encode(config));
  },
  
  getConfig: function(pName) {
    var cookie_value = this.Cookie.read(),
        config = (cookie_value && JSON.parse(cookie_value)) || {};
        
    if(pName) {
      return config[pName] || null;
    }
    
    return config;
  },
  
  getItems: function() {
    return this.mItems;
  },

  isAnyToolbarVisible: function() {
    return this.mItems.some(function(pBar) {return pBar.mOn == true});
  }

  
});
var DPSidebar_Widget = new Class({
  
  Implements: [Events, Options],
  
  mSection: null,
  
  mSidebar: null,
  
  mEl: null,
  
  initialize: function(pSection, pOptions) {
    this.mSection = pSection;
    this.setOptions(pOptions);
  },
  
  getSection: function() {
    return this.mSection;
  },
  
  setSidebar: function(pSidebar) {
    this.mSidebar = pSidebar;
  },
  
  render: function(pContainerEl) {
    
  }
  
});

var DPSidebar_WorkBenchResizer = new Class({
  
  Implements: [Events],
  
  mMorphLockCounter: 0,

  mMorphs: {},
  
  mElements: null,
  
  initialize: function() {
    this.mElements = new Hash({
      'workbench': dpManager.dpWorkBench.getWorkBenchElMain(),
      'container': dpManager.dpWorkBench.getWorkBenchElMain().getParent()
    });
  },
  
  /**
   * Zmienia wymiary workbencha o podana delte
   * 
   * Jesli delta jest ujemna workbench zostanie zmniejszony o tyle pikseli,
   * w przeciwnym razie zostanie powiekszony
   * 
   * @param object pOptions {
   *   'animate' - czy animowac zmiane rozmiaru
   *   'width' - delta,
   *   'only_width'
   * }
   */
  resize: function(pOptions) {

    if(this.isLocked() && !pOptions.force) {
      return;
    }
    
    if(pOptions.animate) {
      this._animate(pOptions);
    }
    else {
      this._resize(pOptions);
    }
  },
  
  isLocked: function() {
    return this.mMorphLockCounter > 0;
  },
  
  _resize: function(pOptions) {
    var css = this.calculateStyles(pOptions);

    this.mElements.each(function(pEl, pKey) {

      // cancel ongoing animation
      if (this.mMorphs[pKey] && this.mMorphs[pKey].cancel) {
        this.mMorphs[pKey].cancel();
      }

      pEl.setStyles(css[pKey]);
    }.bind(this));
    
    this.fireEvent('complete');
  },
  
  _animate: function(pOptions) {
    this.mMorphs = this.prepareFx(),
        css = this.calculateStyles(pOptions);
    
    this.mElements.getKeys().each(function(pKey) {
      this.mMorphs[pKey].start(css[pKey])
    }.bind(this));
  },
  
  /**
   * Oblicza style dla elementow, ktore trzeba zmodyfikowac
   * 
   * @param integer pWidth
   * @return object
   */
  calculateStyles: function(pOptions) {
    var workbench_el = this.mElements.workbench,
        container_el = this.mElements.container,
        width = pOptions['width'];

    var container = {
      'width': container_el.getStyle('width').toIntZero() + width
    }

    if (pOptions.only_width) {
      container.left = container_el.getStyle('left').toIntZero();
    } else {
      container.left = container_el.getStyle('left').toIntZero() - width;
    }

    return {
      'workbench': {
        'width': workbench_el.getStyle('width').toIntZero() + width
      },
      'container': container
    };
  },
  
  prepareFx: function() {
    var events = {
          'onStart': function() {
            this.mMorphLockCounter += 1;
          }.bind(this),
          'onComplete': function() {
            this.mMorphLockCounter -= 1;
            
            if(0 == this.mMorphLockCounter) {
              this.fireEventOnce('complete');
            }
          }.bind(this)
        },
        fxs = {};
        
    this.mElements.each(function(pEl, pKey) {
      fxs[pKey] = new Fx.Morph(pEl, events);
    });
        
    return fxs;
  }
  
});
var DPSidebar_Widget_FloatingToolbar = new Class({
  
  Implements: DPSidebar_Widget,
  
  mToolbarEl: null,
  
  mToolbarWidth: 240,
  
  mToolbarName: null,
  
  mToggleShortcut: null,

  mOn: null,

  mCSidebarH: false,

  renderToolbar: function() {
    this.mToolbarEl = new Element('div', {
        'class': 'sidebar-toolbar',
        'styles': {
          'width': this.mToolbarWidth
        }
      })
      .hide()
      .inject(document.body);

    if(document.getElement("#trial-info")){
      this.mToolbarEl.setStyle('top', 75);
    }

    if(undefined !== this.mToolbarName) {
      this.mToolbarEl.addClass(this.mToolbarName);
    }
  },
  
  show: function(pOptions) {
    this.mOn = true;

    var active_other_toolbars = this.areOtherToolbarsActive(),
        options = {
          'animate': true,
          'resize_workbench': active_other_toolbars ? false : true
        };
    
    $extend(options, pOptions || {});
    
    this.mEl.addClass('active');
    this.mToolbarEl.show();

    this.fireEvent('show', [this, options]);

    if(options.resize_workbench) {
      if(options.animate)  {
        this.fireEvent("showAnimStart");
      }

      this.mSidebar.Resizer.resize({
        'width': -this.mToolbarWidth,
        'animate': options.animate,
        'force': options.force || false
      })
    }

    if(dpManager && dpManager.dpPageInspector) {
      dpManager.dpPageInspector.sidebarShown();
      this.adjustToSitemap()
    }
  },
  
  afterInit: function() {
    
    if(this.mToggleShortcut && dpManager) {
      dpManager.dpShortcuts.addShortcut(this.mToggleShortcut, this.toggle.bind(this));
    }
  },
  
  /**
   * Sprawdza czy sa aktualnie aktywne inne toolbary
   * 
   * @return boolean
   */
  areOtherToolbarsActive: function() {
    return this.mSidebar.getItems()
      .getValues()
      .some(function(pItem) {

        if(pItem === this) {
          return false;
        }

        if(pItem instanceof DPSidebar_Widget_FloatingToolbar && pItem.isToolbarVisible()) {
          return true;
        }

        return false;
      }.bind(this));
  },
  
  hide: function(pOptions) {
    this.mOn = false;
    var options = {
      'animate': true,
      'resize_workbench': true
    };
    
    $extend(options, pOptions || {});

    this.mEl.removeClass('active');
    this.fireEvent('hide', [this, options])
    
    if(options.resize_workbench) {

      if(options.animate) {
        this.fireEvent("hideAnimStart");
      }

      this.mSidebar.Resizer
        .addEvent('complete', function() {
          this.mToolbarEl.hide();
        }.bind(this))
        .resize({
          'width': this.mToolbarWidth,
          'animate': options.animate
        });

      if (dpManager) {
        dpManager.dpWorkBench.resizeWorkBench({additional: 0});
      }
    }
    else {
      this.mToolbarEl.hide();
    }

    if(dpManager) {
      dpManager.dpPageInspector.sidebarWasHidden();
    }
  },
  
  toggle: function(pOptions) {
    
    if(this.mSidebar.Resizer.isLocked()) {
      return;
    }
    
    if(this.isToolbarVisible()) {
      this.hide(pOptions);
    }
    else {
      this.show(pOptions);
    }
  },
  
  getToolbarEl: function() {
    return this.mToolbarEl;
  },
  
  isToolbarVisible: function() {
    return this.mToolbarEl.isVisible();
  }

});

var dmsDPPreview_Comet = new Class({

  mActiveLayer: 1,

  mMenu: null,

  initialize: function() {
    // Aby ladnie wygladalo "przejscie" pomiedzy nowym kontentem a starym sa 2 divy ktore sie podmieniaja
    $('main1').setStyles('opacity', 1);
  },

   loadPage: function(pHTML) {

    $('main1').set('html', pHTML);
    pHTML.stripScripts(true);
    Preview.fixModals();
  },

  /**
   * Laduje menu (drzewko) z lewej strony
   *
   * Ta metoda jest osobno po to, zeby sama mogla sobie pobierac updateniete drzewko
   * w przypadku zmiany w trybie collaboration
   *
   */
  loadMenu: function(pData) {
    Preview.Menu.load(pData);
  }

});
var dmsDPPreview_Menu = new Class({
  
  mTreeControl: null,
  
  mIconsMap: {
    'Analytics': '21',
    'Business Model Canvas': '22',
    'Project Canvas': '23',
    'Conceptual Diagram': '24',
    'Persona': '25',
    'Sitemap': '26',
    'Specification': '27',
    'Userflow': '28',
    'Visual Design': '29',
    'Wireframe': '30',
    'Other': '31'
  },
  
  mEl: null,
  
  mParentEl: null,
  
  mIconsPath: null,
  
  initialize: function(pParentEl) {
    this.mParentEl = pParentEl;
    
    this.mIconsPath = this.getIconsPath();
  },
  
  getIconsPath: function() {
    
    if(!Preview.isExport()) {
      return '/mp/MooTreeControl/';
    }
    
    if(window.location.href.test(/\/pages\//)) {
      return '../data/'
    }
    
    return 'data/';
  },
  
  load: function(pData) {
    UXPStack.add('dmsDPPreview_Menu.load', [pData]);

    // Brak danych do drzewka
    if (!pData) {
      return;
    }

    // Wyrzuca drzewko jesli juz istnialo (zeby je zregenerowac)
    if (this.mTreeControl) {
      this.mTreeControl.remove();
    }
    
    var el = new Element('div', {
      'styles': {
        'margin-left': '-10px'
      }
    }).inject(this.mParentEl);
    
    // Tworzy nowe drzewko
    this.mTreeControl = new MooTreeControl({
        'div': el,
        'mode': 'files',
        'grid': true,
        'draggable': false,
        'theme': this.mIconsPath + 'mootree.png?v2',
        'nodeOptions': {
          'text': 'Pages',
          'open': true
        }
      }
    );
      
    // Chowa nazwe projektu
    this.mTreeControl.div.getElement('.mooTree_node:first-child').hide();

    this.mTreeControl.root.options.draggable = false;
    this.mTreeControl.root.divs.node.removeEvents('click');
    this.mTreeControl.root.divs.node.disableSelection();
    
    var load_menu_page = function(pData) {

      if(pData.url) {
        window.location = pData.url + "#" +Preview.mCurrentVersion;
        return;
      }
      
      this.loadMenuPage(pData.id_page || 'd'+pData.id_document);
    }.bind(this);
    
    var project_id = Preview.getData().id_project;
    var just_select = null;
    var hash_map = new Hash(Preview.mData.current_map);

    // Dodaje strony
    pData.each(function(pItem) {

      if(!pItem.version_of) {
        var icon = this.mIconsPath + 'mootree.png?v2#',
            parent_node,
            node;

        if (pItem.parent) {
          parent_node = this.mTreeControl.get(pItem.parent);
        }
        else {
          parent_node = this.mTreeControl.root;
        }

        if(pItem.is_category) {

          if($defined(this.mIconsMap[pItem.name])) {
            icon += this.mIconsMap[pItem.name];
          }
          else {
            icon += this.mIconsMap['Other'] || '11';
          }
        }
        else {
          icon += '11';
        }

        var node_id_page;

        if(Preview.mCurrentVersion != 0 && Preview.mData.current_map[pItem.id_page]) {
          node_id_page = Preview.mData.current_map[pItem.id_page];
        }
        else {
          node_id_page = pItem.id_page;
        }

        if(pItem.just_select_it === true) {
          just_select = pItem.id_page || pItem.id;
        }

        if(parent_node) {
          node = parent_node.insert({
            'text': pItem.name,
            'id': pItem.id || pItem.id_page,
            'selected': true,
            'open': false,
            'icon': icon,
            'data': {
              'id_page': node_id_page || null,
              'id_document': pItem.id_document,
              'url': pItem.url
            },

            'onSelect': function() {
              var next_node = this;

              if(this.data && (this.data.id_page || this.data.id_document)) {
                load_menu_page(this.data);
                return;
              }

              while(next_node.getFirst()) {
                next_node = next_node.getFirst();

                if(next_node.data.id_page) {
                  load_menu_page(next_node.data);
                  return;
                }
              }
            },
            /**
             * onExpand jest wywolywany przy zwijaniu i rozwijaniu (parametr okresla stan)
             */
            'onExpand': function(expanding) {
              var open_nodes = lscache.bucket(project_id, function() {
                return lscache.get('open_nodes') || []
              });

              //use one id for responsive to identify open nodes
              var page = hash_map.keyOf(this.data.id_page) || this.data.id_page;
              // Jesli rozwijamy i elementu nie ma w tabeli to dodajemy, jesli nie zwijamy i element jest na liscie to usuwamy
              if (expanding === true && open_nodes.contains(page) === false) {
                open_nodes.push(page);
              }
              else if (expanding === false && open_nodes.contains(page)) {
                var index = open_nodes.indexOf(page);
                open_nodes.splice(index,1);
              }

              lscache.bucket(project_id, function() {
                lscache.set('open_nodes', JSON.encode(open_nodes));
              });
            }
          }, false);

          var open_nodes = lscache.bucket(project_id, function() {
            return lscache.get('open_nodes') || []
          });

          // Otwiera drzewko jesli bylo wczesniej otwarte lub jesli znajduje sie na liscie otwartych elementow
          //use one id for responsive to identify open nodes
          var the_id = Preview.getData().version_of || Preview.getData().id_page;

          if ((pItem.id_page && the_id == pItem.id_page) || (pItem.id_document && Preview.getData().id_document == pItem.id_document) || open_nodes.contains(pItem.id_page)) {
            node.toggleParent();
          }
        }
      }
    }.bind(this));

    // Przebudowuje drzewko, zeby wygladalo po ludzku (drugi parametr do node.insert wylacza updateowanie podczas dodawania, zeby bylo szybciej)
    this.mTreeControl.root.update(true);

    // Zaznacza strone na ktorej jest uzytkownik
    var selected_page;

    if(just_select) {
      selected_page = just_select;
    }
    else {
      if(Preview.mCurrentVersion != 0) {
        selected_page = Preview.getData().version_of
      }
      else {
        selected_page = Preview.getCurrentPageId();
      }
    }

    this.mTreeControl.select(this.mTreeControl.get(selected_page), true);
  },
  
  remove: function() {
    this.mTreeControl.remove();
  },
  
  /**
   * Laduje nastepna strone po kliknieciu w element menu
   */
  loadMenuPage: function(pIdPage) {
    var url = Preview.getData().page_base_url.replace(':id_page', pIdPage);

    if (false === Preview.getData().active_collaboration) {
      url += 'd';
    }

    if (false === Preview.getData().menu_enabled) {
      url += 'm';
    }

    if(hashuri.get('R')) {
      url += "#R=1";
    }
    else if(Preview.mCurrentVersion) {
      url += "#"+Preview.mCurrentVersion
    }

    window.location = url;
  }
  
});
var dmsDPPreview_Sidebar = new Class({

  Extends: DPSidebar,

  mCookieName: 'new_preview_sidebar_config',

  mItems: new Hash(),

  initialize: function() {
    this.Cookie = new Cookie(this.mCookieName, {
      'path': '/',
      'duration': 365
    });

    this.setResizer();
  },

  setActiveTab: function() {
    var active_tab = this.getConfig('active_tab');

    if(this.getConfig()['active_tab'] === undefined && this.mItems.get('sitemap')) {
      this.mItems.get('sitemap').show({
        'animate': false
      })
    }

    if(active_tab && this.mItems.get(active_tab)) {
      this.mItems.get(active_tab).show({
        'animate': false
      })
    }

  },

  setResizer: function() {
    this.Resizer = new dmsDPPreview_Sidebar_Resizer();
  },

  addWidget: function(pName, pWidget) {
    this.mItems.set(pName, pWidget);
  },

  getWidget:function(pName) {
    return this.mItems[pName];
  }

});
var dmsDPPreview_Sidebar_Back = new Class({
  
  Extends: DPSidebar_Widget,

  mTooltipEl: 'Back to Dashboard',

  render: function(pContainerEl) {
    this.mEl = new Element('a', {
        'href': '/dms/Collections/Show/%d'.sprintf(Preview.getData().id_collection),
        'data-tooltip': 'Dashboard',
        'data-show-node': 'tooltip',
        'text': 'Dashboard',
        'class': 'icon-font-back'
      })
      .inject(pContainerEl);

    this.mEl.microjungle([
      ['span', {'class': 'tooltip left-arrow'}, this.mTooltipEl]
    ])
  }

})
var dmsDPPreview_Sidebar_Comments = new Class({
  
  Extends: DPSidebar_Widget_FloatingToolbar,

  mToolbarName: 'comments',

  mTooltipEl: 'Comments',

  initialize: function(pSection) {
    this.parent(pSection);
    this.mResizeRef = this.resizeToolbar.bind(this);
    
    this.addEvents({
      'show': function() {
        this.resizeToolbar();
        window.addEvent('resize', this.mResizeRef);
      }.bind(this),
      'hide': function() {
        window.removeEvent('resize', this.mResizeRef);
      }.bind(this)
    })
  },

  render: function(pContainerEl) {
    
    this.mEl = new Element('a', {
      'href': '#',
      'data-tooltip': 'Comments',
      'data-show-node': 'tooltip',
      'text': 'Comments',
      'class': 'icon-font-comments',
      'events': {
          'click': function() {
            this.toggle({
              'animate': true
            });
            
            return false;
          }.bind(this)
        }
    }).inject(pContainerEl);

    this.mEl.microjungle([
      ['span', {'class': 'tooltip left-arrow'}, this.mTooltipEl]
    ])

    this.renderToolbar();
  },
  
  resizeToolbar: function() {
    var window_height = window.height;
    
    this.mToolbarEl.setStyles({
      'overflow': 'auto'
    });
  }
  
});

;(function dmsDPPreview_Sidebar_InteractionsScope() {
  'use strict';

  var dmsDPPreview_Sidebar_Interactions = new Class({

    Extends: DPSidebar_Widget_FloatingToolbar,

    mToolbarName: 'interactions',

    hideTimeout: null,

    mCopyStyles: ['width','height','left','top','position',window.utils.prefix.css+'transition',window.utils.prefix.css+'transform'],

    mHighlighted:false,

    mObserver: null,

    mTooltipEl: 'Highlight Interactions',

    mAnimationTime:150,

    initialize: function(pSection, pOptions) {
      this.mObserver = new MutationObserver(function observing(mutations) {
        mutations.forEach(function(mutation) {
          var comp_id = 'companion_'+mutation.target.id;
          var comp_el = document.getElementById(comp_id);
          var prefix = [InteractionsAnimations.prefixes[window.utils.prefix.lowercase]];
          comp_el.style[prefix+'TransitionProperty'] = mutation.target.style[prefix+'TransitionProperty'];
          comp_el.style[prefix+'TransitionDuration'] = mutation.target.style[prefix+'TransitionDuration'];
          comp_el.style[prefix+'TransitionTimingFunction'] = mutation.target.style[prefix+'TransitionTimingFunction'];
          comp_el.style[prefix+'Transform'] = mutation.target.style[prefix+'Transform'];

          comp_el.style.top = mutation.target.style.top;
          comp_el.style.left = mutation.target.style.left;
        });
      });
      this.parent(pSection, pOptions);
    },

    render: function(pContainerEl) {
      this.mEl = new Element('a', {
        'href': '#',
        'data-tooltip': 'Highlight Interactions',
        'data-show-node': 'tooltip',
        'text': 'Interactions',
        'class': 'icon-font-interactions',
        'events': {
          'click': function(pE) {
            pE.preventDefault();

            if(this.mHighlighted){
              clearTimeout(this.hideTimeout);
              this.hideTimeout = setTimeout(this.disableInteractionHighlight.bind(this),1000);
              return false;
            }

            var inters = document.querySelectorAll('.interactive');
            var config = {attributes:true, childList:false, characterData:false, attributeFilter:['style']};
            var eachStyleCallback = function(pStyle) {
              style += pStyle+':'+inters[i].style[pStyle]+';';
            };

            for(var i=0; i<inters.length; i++) {
              var companion = document.createElement('div');
              companion.id = 'companion_'+inters[i].id;
              companion.classList.add('interactive', 'highlighted','companion');
              var style = '';

              this.mCopyStyles.each(eachStyleCallback);

              companion.style.cssText = style;
              var border = parseInt(inters[i].style.borderWidth);

              if(border) {
                companion.style.width = parseInt(inters[i].style.width) + 2*border + 'px';
                companion.style.height = parseInt(inters[i].style.height) + 2*border + 'px';
              }

              setTimeout(companion.classList.add.bind(companion.classList, ['visible-highlighted']),30);
              this.mObserver.observe(inters[i],config);
              inters[i].parentElement.insertBefore(companion,inters[i]);
            }

            this.mHighlighted = true;

            this.hideTimeout = setTimeout(this.disableInteractionHighlight.bind(this),1500);
            return true;
          }.bind(this)
        }
      }).inject(pContainerEl);

      this.mEl.microjungle([
        ['span', {'class': 'tooltip left-arrow'}, this.mTooltipEl]
      ]);

      this.renderToolbar();
    },

    disableInteractionHighlight: function() {
      this.mHighlighted = false;
      var companions = document.querySelectorAll('.companion');
      for(var i=0;i<companions.length;i++) {
        companions[i].classList.remove('visible-highlighted');
      }

      setTimeout(function(){
        this.mObserver.disconnect();
        this.removeCompanions();
      }.bind(this),this.mAnimationTime);
    },

    removeCompanions: function() {
      var companions = document.querySelectorAll('.companion');
      for(var i=0;i<companions.length;i++) {
        companions[i].parentElement.removeChild(companions[i]);
      }
    }

  });

  window.dmsDPPreview_Sidebar_Interactions = dmsDPPreview_Sidebar_Interactions;

})();

var dmsDPPreview_Sidebar_Resizer = new Class({
  
  Extends: DPSidebar_WorkBenchResizer,
  
  initialize: function() {
    this.mElements = new Hash({
      'canvas': document.getElement('#canvas')
    });
  },
  
  calculateStyles: function(pOptions) {
    return {
      'canvas': {
        'left': this.mElements.canvas.getStyle('left').toIntZero() - pOptions['width']
      }
    };
  }
})
var dmsDPPreview_Sidebar_Sitemap = new Class({
  
  Extends: DPSidebar_Widget_FloatingToolbar,
  
  mToolbarName: 'sitemap',

  mTooltipEl: 'Sitemap',

  render: function(pContainerEl) {
    this.mEl = new Element('a', {
        'href': '#',
        'data-tooltip': 'Sitemap',
        'data-show-node': 'tooltip',
        'text': 'Sitemap',
        'class': 'icon-font-sitemap',
        'events': {
          'click': function() {
            this.toggle({
              'animate': true
            });
            
            return false;
          }.bind(this)
        }
      })
      .inject(pContainerEl);

    this.mEl.microjungle([
      ['span', {'class': 'tooltip left-arrow'}, this.mTooltipEl]
    ]);

    this.renderToolbar();
  }
  
});

;(function Preview_ElementScope() {
  'use strict';

  var Preview_Elements = new Class({

    mIndex: {},

    set: function(pId, pEl, pOptions) {
      var id = parseInt(pId, 10);
      var el = typeof pEl == 'object' ? pEl : Interactions.getSetElRef(id);

      if (!el) {
        console.error('NO ELEMENT ' + id);
        return;
      }

      var type = Preview_Elements.getElementType(el);
      var class_name = 'Preview_Elements_' + type;

      if (typeof window[class_name] == 'undefined') {
        class_name = 'Preview_Elements_Generic';
      }

      this.mIndex[id] = new window[class_name](pEl, pOptions);
      this.mIndex[id].setId(id);
    },

    get: function(pId) {
      return this.mIndex[parseInt(pId, 10)];
    },

    getEach: function(pCallback) {
      if (typeof pCallback != 'function') {
        return false;
      }

      for (var id in this.mIndex) {
        if (this .mIndex.hasOwnProperty(id)) {
          pCallback.call(this.mIndex[id], this.mIndex[id], id);
        }
      }
    },

    highlightInteractive: function() {
      this.getEach(function(pElement) {
        if (pElement.isInteractive()) {
          pElement.highlight();
        }
      });
    }

  });

  Preview_Elements.getElementType = function(pEl) {
    var match;
    var type;

    for (var i = 0, l = pEl.classList.length; i < l; i++) {
      match = pEl.classList[i].match(/^El(.*)$/);

      if (match && match[1]) {
        type = match[1];
        break;
      }
    }

    // off course some exceptions ...
    if (!type) {
      if (pEl.classList.contains('line')) {
        type = 'Line';
      }
      if (pEl.classList.contains('arrow')) {
        type = 'Arrow';
      }
      else if (pEl.classList.contains('GeoSVGEl')) {
        type = 'GeoSVG';
      }
      else if (pEl.classList.contains('UniSVGEl')) {
        type = 'GeoSVG';
      }
      else if (pEl.classList.contains('IconSVG')) {
        type = 'IconSVG';
      }
      else if (pEl.classList.length === 0 && pEl.querySelector('img.ElImage')) {
        type = 'Image';
      }
    }

    return type;
  };

  window.Preview_Elements = Preview_Elements;
})();

;(function Preview_Elements_Generic_Scope() {
  'use strict';

  var Preview_Elements_Generic = new Class({

    Implements: [Options],

    options: {
      interactive: false,
      in_group: false,
      in_component: false
    },

    mType: null,

    mId: null,

    mEl: null,

    mElementAnimations: null,

    initialize: function(pEl, pOptions) {
      this.mEl = pEl;
      this.mType = Preview_Elements.getElementType(pEl);
      this.setOptions(pOptions);

      if (this.options.interactive) {
        this.setInteractive();
      }

      if (this.options.in_component) {
        this.mEl.classList.add('component-child');
      }
    },

    getElement: function() {
      return this.mEl;
    },

    setId: function(pId) {
      this.mId = pId;
    },

    setInteractive: function() {
      var el = this.getElement();

      el.classList.add('interactive');
      el.classList.add('highlighted');
    },

    getSetElementAnimations: function() {
      if (!this.mElementAnimations || !(this.mElementAnimations instanceof InteractionsAnimations)) {
        this.mElementAnimations = new InteractionsAnimations(this.getElement());
      }

      return this.mElementAnimations;
    },

    isInteractive: function() {
      return this.options.interactive;
    },

    isInGroup: function() {
      return this.options.in_group;
    },

    highlight: function() {
      console.log('highlight');
    },

    cssToJsStyle: function(pCssStyle) {
      return pCssStyle.replace(/\-([a-z]){1}/, function(match, $1) {
        return $1.toUpperCase();
      });
    },

    show: function(pAnimation) {
      this.setShowAnimation(pAnimation);
      var el = this.getElement();

      setTimeout(function() {
        el.style.visibility = 'visible';
        el.style.marginLeft = '0px';
        el.style.opacity = Interactions.ori_styles[this.mId].opacity;
      }.bind(this), 10);
    },

    hide: function(pAnimation) {
      this.setHideAnimation(pAnimation);
      var el = this.getElement();

      el.style.visibility = 'hidden';
      el.style.opacity = 0;

      if (pAnimation && pAnimation.show == 'slide') {
        el.style.marginLeft = '100px';
      }
    },

    isVisible: function() {
      return window.getComputedStyle(this.getElement()).getPropertyValue('opacity') > 0 && window.getComputedStyle(this.getElement()).getPropertyValue('visibility') !== 'hidden';
    },

    /**
     * Sets style to the element
     *
     * @param pStyle
     * @param pValue
     * @param pUpdateOriginal
     * @param pAnimate [optional]
     */
    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimation) {
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;
      var style_property = this.cssToJsStyle(pStyle);
      var current_style = window.getComputedStyle(this.getElement())[style_property];

      if (false !== pAnimation) {
        this.setAnimation('style', pAnimation);
      }

      this.getElement().style[style_property] = pValue;

      if (update_original) {
        Interactions.ori_styles[this.mId][pStyle] = current_style;
      }
    },

    resize: function(pWidth, pHeight, pAnimation) {
      this.setAnimation('resize', pAnimation);
      var el = this.getElement();

      el.style.width = parseInt(pWidth, 10) + 'px';
      el.style.height = parseInt(pHeight, 10) + 'px';
    },

    rotate: function(pAngle, pAnimation) {
      this.setAnimation('rotate', pAnimation);

      var prefix = InteractionsAnimations.prefixes[this.mElementAnimations.getPrefix()];
      var value = /^rotate\((\-?[0-9]+)deg\)$/.exec(this.getElement().style[prefix + 'Transform']);

      if (value) {
        value = parseInt(value[1], 10) || 0;
      }
      else {
        value = 0;
      }

      setTimeout(function() {
        this.getElement().style[prefix + 'Transform'] = 'rotate(' + (value + parseInt(pAngle, 10)) + 'deg)';
      }.bind(this), 5);
    },

    setPosition: function(pX, pY, pAnimation) {
      this.setAnimation('move', pAnimation);
      var el = this.getElement();

      el.style.left =  pX + 'px';
      el.style.top = pY + 'px';
    },

    getPosition: function(pRelativeToWorkbench) {
      var el = this.getElement();
      var position = {
        left: parseInt(el.style.left, 10),
        top: parseInt(el.style.top, 10)
      };

      if (pRelativeToWorkbench && this.isInGroup()) {
        var groupEl = el.parentNode;

        position.left += parseInt(groupEl.style.left, 10);
        position.top += parseInt(groupEl.style.top, 10);
      }

      return position;
    },

    setOpacity: function(pValue, pAnimation) {
      this.setAnimation('opacity', pAnimation);

      this.getElement().style.opacity = pValue;
    },

    setAnimation: function(pType, pAnimation, pEl, pElId) {
      var el_animations;
      var el_id = pElId || this.mId;

      if (pEl) {
        el_animations = new InteractionsAnimations(pEl);
      }
      else {
        el_animations = this.getSetElementAnimations();
      }

      if (pAnimation && pAnimation.style) {
        el_animations.addAnimation(pType, pAnimation.style, pAnimation.time + 'ms');

        if (InteractionsAnimations.timeouts[pType][el_id]) {
          clearTimeout(InteractionsAnimations.timeouts[pType][el_id]);
        }

        InteractionsAnimations.timeouts[pType][el_id] = setTimeout(function() {
          el_animations.remove(pType);
        }, InteractionsAnimations.getTimeoutTime(pAnimation.time));
      }
      else {
        el_animations.remove(pType);
      }

      return el_animations;
    },

    setShowAnimation: function(pAnimation) {
      this.getSetElementAnimations();

      if (pAnimation && pAnimation.show) {
        if (pAnimation.show == 'slide') {
          this.getElement().style.marginLeft = '-100px';
        }

        // animation must be set after initial value of marginLeft
        setTimeout(function() {
          this.mElementAnimations.addAnimation('show', pAnimation.style, pAnimation.time + 'ms');
        }.bind(this), 1);

        setTimeout(function() {
          this.mElementAnimations.remove('show');

          // reset margin
          if (pAnimation.show == 'slide') {
            this.getElement().style.marginLeft = 0;
          }
        }.bind(this), InteractionsAnimations.getTimeoutTime(pAnimation.time));
      }
      else {
        this.mElementAnimations.remove('show');
      }
    },

    setHideAnimation: function(pAnimation) {
      this.getSetElementAnimations();

      if (pAnimation && pAnimation.show) {
        this.mElementAnimations.addAnimation('show', pAnimation.style, pAnimation.time + 'ms');

        setTimeout(function() {
          this.mElementAnimations.remove('show');

          // reset margin
          if (pAnimation.show == 'slide') {
            this.getElement().style.marginLeft = 0;
          }
        }.bind(this), InteractionsAnimations.getTimeoutTime(pAnimation.time));
      }
      else {
        this.mElementAnimations.remove('show');
      }
    }

  });

  window.Preview_Elements_Generic = Preview_Elements_Generic;
})();

;(function Preview_Elements_ShapeInterface_Scope() {
  'use strict';

  var Preview_Elements_ShapeInterface = new Class({

    resize: function(pWidth, pHeight, pAnimation) {
      var shape_el = this.mEl.querySelector('.shape');
      var shape_animations = new InteractionsAnimations(shape_el);
      var scale_factor = [100,100];

      // scale is counted differently for GeoSVG
      if (!this.mEl.classList.contains('GeoSVGEl')) {
        scale_factor = [parseInt(Interactions.ori_styles[this.mId].original_width), parseInt(Interactions.ori_styles[this.mId].original_height)];
      }

      if (pAnimation && pAnimation.style) {
        shape_animations.addAnimation('scale', pAnimation.style, pAnimation.time + 'ms');

        InteractionsAnimations.timeouts.resize[this.mId] = setTimeout(function() {
          shape_animations.remove('scale');
        }, InteractionsAnimations.getTimeoutTime(pAnimation.time));
      }

      var scale = [parseInt(pWidth)/scale_factor[0], parseInt(pHeight)/scale_factor[1]];
      var transform = 'scale('+scale[0]+','+scale[1]+')';

      shape_el.style['-'+shape_animations.prefix+'-transform'] = transform;
      shape_el.style.transform = transform;

      this.parent(pWidth, pHeight, pAnimation);
    }

  });

  window.Preview_Elements_ShapeInterface = Preview_Elements_ShapeInterface;

})();
;(function Preview_Elements_Arrow_Scope() {
  'use strict';

  var Preview_Elements_Arrow = new Class({

    Extends: Preview_Elements_Generic,

    mElLine: null,

    mElMarkers: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElLine = this.mEl.querySelector('svg .arrow-path');
      this.mElMarkers = this.mEl.querySelectorAll('svg defs marker path');
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimations) {
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;

      if ('color' == pStyle) {
        if (update_original) {
          Interactions.ori_styles[this.mId].color = this.mElLine.getAttribute('stroke');
        }

        this.mElLine.setAttribute('stroke', pValue);

        Array.prototype.forEach.call(this.mElMarkers, function(pMarker) {
          pMarker.setAttribute('fill', pValue);
        });
      }
      else {
        this.parent(pStyle, pValue, pUpdateOriginal, pAnimations);
      }
    },

    resize: function(pWidth, pHeight, pAnimation) {
      var arrow_el = this.mEl.querySelector('.arrow-path');
      var props = Interactions.ori_styles[this.mId];
      var path = DPElement_Helper.generateArrowPath(parseInt(pWidth), parseInt(pHeight), props['arrow-curve'], props['arrow-orientation'], props.stroke);

      arrow_el.setAttribute('d', path);
      this.parent(pWidth, pHeight, pAnimation);
    }

  });

  window.Preview_Elements_Arrow = Preview_Elements_Arrow;

})();

;(function Preview_Elements_GeoSVG_Scope() {
  'use strict';

  var Preview_Elements_GeoSVG = new Class({

    Extends: Preview_Elements_Generic,

    Implements: [Preview_Elements_ShapeInterface],

    mElSvg: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElSvg = this.mEl.querySelector('svg polygon');
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimation) {
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;

      if ('color' == pStyle) {
        if (update_original) {
          Interactions.ori_styles[this.mId].color = this.mElSvg.getAttribute('fill');
        }

        this.mElSvg.setAttribute('fill', pValue);
      }
      else {
        this.parent(pStyle, pValue, pUpdateOriginal, pAnimation);
      }
    }

  });

  window.Preview_Elements_GeoSVG = Preview_Elements_GeoSVG;

})();

;(function Preview_Elements_Group_Scope() {
  'use strict';

  var Preview_Elements_Group = new Class({

    Extends: Preview_Elements_Generic,

    mGroupElements: [],

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);

      Array.prototype.forEach.call(this.mEl.querySelectorAll('*[id^=el]'), function(pEl) {
        this.mGroupElements.push(pEl);
      }.bind(this));
    },

    /**
     * This is workaround for a problem of groups that cannot have their own opacity, because opacity creates z-index stack.
     * To show group with fade animation, group needs to have opacity set to 0.
     *
     * @param pAnimation
     * @todo Remove this when we switch to groups having their own opacity
     */
    show: function(pAnimation) {
      if (!this.isVisible() && pAnimation && pAnimation.show && pAnimation.time > 0) {
        this.getElement().style.opacity = 0;
      }

      this.parent(pAnimation);
    },

    resize: function(pWidth, pHeight, pAnimation) {
      var current = {w: parseInt(this.mEl.style.width), h: parseInt(this.mEl.style.height)};
      var size = {w: parseInt(pWidth), h: parseInt(pHeight)};
      var delta = {w: size.w/current.w, h: size.h/current.h};
      var edit_styles = {w: ['width', 'left'], h: ['top', 'height']};

      this.mGroupElements.each(function eachElementScope(pEl) {

        // animation ?
        if (pAnimation && pAnimation.style) {
          var el_animations = new InteractionsAnimations(pEl);
          el_animations.addAnimation('resize', pAnimation.style, pAnimation.time + 'ms');
          el_animations.addAnimation('move', pAnimation.style, pAnimation.time + 'ms');

          if (InteractionsAnimations.timeouts.resize[this.mId]) {
            clearTimeout(InteractionsAnimations.timeouts.resize[this.mId]);
          }

          InteractionsAnimations.timeouts.resize[this.mId] = setTimeout(function removeResizeScope() {
            el_animations.remove('resize');
            el_animations.remove('move');
          }.bind(this), InteractionsAnimations.getTimeoutTime(pAnimation.time));
        }

        // left, width
        edit_styles.w.each(function eachElementStyleScope(pStyle) {
          pEl.style[pStyle] = (parseInt(pEl.style[pStyle]) * delta.w) + 'px';
        });

        // top, height
        edit_styles.h.each(function eachElementStyleScope(pStyle) {
          pEl.style[pStyle] = (parseInt(pEl.style[pStyle]) * delta.h) + 'px';
        });

      }.bind(this));

      this.parent(pWidth, pHeight, pAnimation);
    }

  });

  window.Preview_Elements_Group = Preview_Elements_Group;

})();

;(function Preview_Elements_IconSVG_Scope() {
  'use strict';

  var Preview_Elements_IconSVG = new Class({

    Extends: Preview_Elements_Generic,

    Implements: [Preview_Elements_ShapeInterface],

    mElSvg: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElSvg = this.mEl.querySelector('.shape path');

      // FontAwesome has also a IconSVG class, but has a different structure :/
      if (!this.mElSvg) {
        this.mElSvg = this.mEl.querySelector('path.shape');
      }
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimation) {
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;

      if ('color' == pStyle) {
        if (update_original) {
          Interactions.ori_styles[this.mId].color = this.mElSvg.getAttribute('fill');
        }

        this.mElSvg.setAttribute('fill', pValue);
      }
      else {
        this.parent(pStyle, pValue, update_original, pAnimation);
      }
    }

  });

  window.Preview_Elements_IconSVG = Preview_Elements_IconSVG;

})();

;(function Preview_Elements_Image_Scope() {
  'use strict';

  var Preview_Elements_Image = new Class({

    Extends: Preview_Elements_Generic,

    mElSvg: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElImage = this.mEl.querySelector('img');
    },

    resize: function(pWidth, pHeight, pAnimation) {
      this.setAnimation('resize', pAnimation, this.mElImage);

      this.mElImage.style.width = (parseInt(pWidth)) + 'px';
      this.mElImage.style.height = (parseInt(pHeight)) + 'px';
      this.parent(pWidth, pHeight, pAnimation);
    }

  });

  window.Preview_Elements_Image = Preview_Elements_Image;

})();
;(function Preview_Elements_Line_Scope() {
  'use strict';

  var Preview_Elements_Line = new Class({

    Extends: Preview_Elements_Generic,

    mElLine: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElLine = this.mEl.querySelector('svg line');
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimation) {
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;

      if ('color' == pStyle) {
        if (update_original) {
          Interactions.ori_styles[this.mId].color = this.mElLine.getAttribute('stroke');
        }

        this.mElLine.setAttribute('stroke', pValue);
      }
      else {
        this.parent(pStyle, pValue, pUpdateOriginal, pAnimation);
      }
    }

  });

  window.Preview_Elements_Line = Preview_Elements_Line;

})();

;(function Preview_Elements_Navigation_Scope() {
  'use strict';

  var Preview_Elements_Navigation = new Class({

    Extends: Preview_Elements_Generic,

    mElements: null,

    mElementsInactive: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mElements = this.mEl.querySelectorAll('li');
      this.mElementsInactive = this.mEl.querySelectorAll('li.inactive');
    },

    setAnimation: function(pType, pAnimation) {

      // standard call
      this.parent(pType, pAnimation);

      // custom behavior for style animations - set the navi custom animation for all inner elements
      if ('style' == pType && pAnimation) {
        Array.prototype.forEach.call(this.mElements, function(pElement) {
          this.parent('style_navi', pAnimation, pElement, MD5(pElement.innerHTML));
        }.bind(this));
      }
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimate) {
      var el_id = this.mId;
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;
      var current_style;

      // font color set in standard way
      if ('color' == pStyle) {
        return this.parent(pStyle, pValue, pUpdateOriginal, pAnimate);
      }

      // set styles
      if (['inactive-background-color', 'background-color'].indexOf(pStyle) > -1) {
        Array.prototype.forEach.call(this.mElementsInactive, function(pElement) {
          current_style = window.getComputedStyle(pElement).backgroundColor;
          pElement.style.backgroundColor = pValue;
        });

        if (update_original) {
          Interactions.ori_styles[el_id]['background-color'] = current_style;
        }
      }
      else if ('element-border-color' == pStyle) {
        Array.prototype.forEach.call(this.mElements, function(pElement) {
          current_style = window.getComputedStyle(pElement).borderColor;
          pElement.style.borderColor = pValue;
        });

        if (update_original) {
          Interactions.ori_styles[el_id]['border-color'] = current_style;
        }
      }
      else {
        this.parent(pStyle, pValue, pUpdateOriginal, pAnimate);
      }
    }

  });

  window.Preview_Elements_Navigation = Preview_Elements_Navigation;
})();

;(function Preview_Elements_Tab_Scope() {
  'use strict';

  var Preview_Elements_Tab = new Class({

    Extends: Preview_Elements_Navigation,

    mElements: null,

    mElementsInactive: null

  });

  window.Preview_Elements_Tab = Preview_Elements_Tab;
})();

;(function Preview_Elements_TextElement_Scope() {
  'use strict';

  var Preview_Elements_TextElement = new Class({

    Extends: Preview_Elements_Generic,

    mChildElements: null,

    initialize: function(pEl, pOptions) {
      this.parent(pEl, pOptions);
      this.mChildElements = this.mEl.querySelectorAll('span[style]');

      if (this.mChildElements.length === 0) {
        this.mChildElements = [this.mEl];
      }
    },

    setAnimation: function(pType, pAnimation) {

      // custom style animation handling
      if ('style' == pType && pAnimation && pAnimation.style) {
        Array.prototype.forEach.call(this.mChildElements, function(pElement) {
          this.parent('style', pAnimation, pElement, MD5(pElement.innerHTML));
        }.bind(this));
      }
      // standard
      else {
        this.parent(pType, pAnimation);
      }
    },

    setStyle: function(pStyle, pValue, pUpdateOriginal, pAnimate) {
      var style_property = this.cssToJsStyle(pStyle);
      var update_original = typeof pUpdateOriginal == 'undefined' || pUpdateOriginal;

      // set possible animation
      if (pAnimate && pAnimate.style) {
        this.setAnimation('style', pAnimate);
      }

      // original style
      var current_style = [];

      // set style
      Array.prototype.forEach.call(this.mChildElements, function(pElement, pIndex) {
        current_style[pIndex] = pElement.style[style_property];
        pElement.style[style_property] = pValue instanceof Array ? pValue[pIndex] : pValue;
      });

      // update original
      if (update_original) {
        Interactions.ori_styles[this.mId][pStyle] = current_style;
      }
    }

  });

  window.Preview_Elements_TextElement = Preview_Elements_TextElement;

})();
;(function Preview_Elements_Tooltip_Scope() {
  'use strict';

  var Preview_Elements_Tooltip = new Class({

    Extends: Preview_Elements_Generic,

    initialize: function(pEl, pOptions) {
      pEl = pEl.parentNode;
      this.parent(pEl, pOptions);
    }

  });

  window.Preview_Elements_Tooltip = Preview_Elements_Tooltip;

})();

;(function Preview_Elements_UniSVG_Scope() {
  'use strict';

  var Preview_Elements_UniSVG = new Class({

    Extends: Preview_Elements_Generic,

    Implements: [Preview_Elements_ShapeInterface]

  });

  window.Preview_Elements_UniSVG = Preview_Elements_UniSVG;

})();

var dmsDPPreview_Preview = new Class({
  
  Sidebar: null,
  
  MainToolbar: null,
  
  Menu: null,
  
  mData: null,
  
  mCanvasEl: null,

  mCurrentVersion: 0,

  mPageBuffer: {},

  mExportMode: false,

  mElements: null,

  mDejax: new Dejax,

  mVersions:  new Hash({
   "0": {"version":0, "text":"Default", "width": "5000"},
   "1": {"version":1, "text":"iPhone (320px)", "width": 320, "breakwidth":400},
   "2": {"version":2, "text":"iPhone Landscape (480px)", "width": 480, "breakwidth": 500},
   "3": {"version":3, "text":"Tablets (600px)", "width": 600, "breakwidth": 620},
   "4": {"version":4, "text":"iPads (768px)", "width": 768, "breakwidth": 790},
   "5": {"version":5, "text":"Standard websites (992px)", "width": 992, "breakwidth": 1012},
   "6": {"version":6, "text":"iPad Landscape (1024px)", "width": 1024, "breakwidth": 1044},
   "7": {"version":7, "text":"Wide websites (1224px)", "width": 1224, "breakwidth": 1244}
  }),

  mFixedElems: [],
  
  initialize: function() {
    this.mElements = new Preview_Elements();
  },

  attachEvents: function() {
    this.mCanvasEl = document.getElement('#canvas');
    this.canvasResize();

    window.addEvent('resize', this.canvasResize.bind(this));
    window.addEvent('resize', this.responsiveAdjust);
    window.addEventListener("orientationchange", function() {
      Preview.canvasResize();
      Preview.responsiveAdjust();
    }, false);
  },
  
  setData: function(pData) {

    this.mData = pData;

    if(this.mData.versions) {
      this.mData.versions = new Hash(JSON.decode(this.mData.versions));
    }

    if (this.mData.version_data) {
      this.mData.version_data = new Hash(this.mData.version_data);
      this.mData.versions.combine(this.mData.version_data);
      this.mData.version_data.forEach(function(row) {
        "use strict";
        row.breakwidth = row.width + 20;
        Preview.mVersions.set(row.version, row);
      });
    }

    var breaks = [];
    this.mData.versions.each(function(pId, pVer){
      var obj = {};
      if (Preview.mVersions.hasOwnProperty(pVer)) {
        obj[Preview.mVersions[pVer].width] =  pVer;
        obj["size"] = Preview.mVersions[pVer].breakwidth || Preview.mVersions[pVer].width;
        obj["version"] = parseInt(pVer, 10);
        obj["breakwidth"] = parseInt(pVer, 10);
        breaks.push(obj);
      }
    });
    breaks.sort(function(pA,pB){
      if(pA.size < pB.size) return -1;
      if(pA.size > pB.size) return 1;
      return 0;
    });
    this.breaks = breaks

    this.mCurrentPageId = this.mData.id_page;
    this.mCurrentVersion = this.mData.current_version;
    this.canvasResize();
  },

  
  getData: function() {
    return this.mData;
  },


  getCurrentPageId: function() {
    return this.mCurrentPageId
  },
  
  getDocumentId: function() {
    return this.mData.id_document;
  },

  createMainToolbar: function() {

    this.MainToolbar = new dmsDPPreview_MainToolbar();
    
    this.mCanvasEl.getElement('#canvas-wrapper').setStyle('top', '50px');
    this.canvasResize();
  },


  hideVersionList: function(pE) {
    window.removeEvent(this.hideVersionList)
    var elements = this.mVersionListDiv.getElements('*');
    elements.push(this.mVersionListDiv);

    if(pE && elements.contains(pE.target)) {
      return;
    }

    this.mVersionListDiv.hide();
  },


  createVersionSwitch: function(pVersionsHash) {

    var container = new Element("div", {
      "class" : "responsive"
    }).microjungle([
        ['label',{'text':'Responsive:'}]
      ]);

    var list = new Element("select", {
      "class": "version-list",
      "id": "version-select"
    });
    
    container.adopt(list);
    pVersionsHash.each(function(pVersion, pType) {
      if (this.mVersions.hasOwnProperty(pType)) {
        var li = new Element('option', {
          "class": 'version-item',
          "value": pVersion,
          "text": this.mVersions[pType].text,
          "selected": pType == this.mCurrentVersion ? true : false
        });
        list.adopt(li);
      }
    }.bind(this));

    var li = new Element('option', {
      "class": 'version-item',
      "value": "responsive",
      "html": "&larr; Auto (resize) &rarr;"
    });

    list.grab(li,"top");

    list.addEvent('change', function() {
      if(this.getSelected().get('value') != "responsive") {
        hashuri.set("R");
        if(Preview.isExport()) {
          Preview.loadPageCall(this.getSelected().get('value'));
          Preview.canvasResize();
        }
        else {
          Preview.Menu.loadMenuPage(this.getSelected().get('value'));
        }
      }
      else {
        hashuri.set("R",1);
        Preview.responsiveAdjust();
        Preview.canvasResize();
      }
    });

    if(document.getElement('.sidebar-toolbar.sitemap')) {
      document.getElement('.sidebar-toolbar.sitemap').grab(container,'top');
    }

  },
  
  createSidebar: function(pOptions) {
    this.Sidebar = new dmsDPPreview_Sidebar();
    
    if(pOptions.show_back_widget) {
      this.Sidebar.addWidget('home', new dmsDPPreview_Sidebar_Back('nav'));
    }


    // miejsce na sitemap
    if(this.mData.pages.length > 0) {
      this.Sidebar.addWidget('sitemap', new dmsDPPreview_Sidebar_Sitemap('nav'));
    }
    
    if(pOptions.show_comments) {
      this.Sidebar.addWidget('comments', new dmsDPPreview_Sidebar_Comments('nav'));
    }

    this.Sidebar.addWidget('interactions', new dmsDPPreview_Sidebar_Interactions('nav'));
    
    this.Sidebar.render();
    this.Sidebar.setActiveTab();
    this.mCanvasEl.setStyle('left', this.mCanvasEl.getStyle('left').toIntZero() + this.Sidebar.mEl.getStyle('width').toIntZero());
    
    // Callback na resizowanie pola podgladu przy otwieraniu i zamykaniu toolbara przy sidebarze
    this.mCanvasResizeRef = function(pE) {
      this.canvasResize.delay(600, this, [pE]);
    }.bind(this);
    
    this.Sidebar.addEvent('toolbarShow', this.canvasResize.bind(this));
    this.Sidebar.addEvent('toolbarHide', this.canvasResize.bind(this));
    
    if(this.mData.pages.length > 0) {
      this.Menu = new dmsDPPreview_Menu(this.Sidebar.getWidget('sitemap').getToolbarEl(), this.mData.pages);
      this.Menu.load(this.mData.pages);
    }
    
    if(pOptions.show_comments) {
      this.Comments = new DPPageComments(this.mData.comments, this.mData.id_page, this.mData.project_hash, this.Sidebar.getWidget('comments').getToolbarEl());
    }
    
    this.canvasResize();
  },
  
  canvasResize: function(pE, pAction, pShowHideOptions) {
    var width = window.getWidth() - this.mCanvasEl.getStyle('left').toIntZero(),
        height = window.getHeight(),
        morph = false;

    // Jesli animowany event, animujemy zmiane
    if(pE && pAction) {
      width = window.getWidth() - this.Sidebar.mEl.getStyle('width').toIntZero();
      morph = true;

      if('show' == pAction) {
        width -= pE.mToolbarWidth;
      }

      if($defined(pShowHideOptions) && false == pShowHideOptions.resize_workbench) {
        morph = false;
      }
    }

    if(width < 600) {
      document.getElementById("DPMainToolbar") && document.getElementById("DPMainToolbar").addClass('narrow');
    }
    else {
      document.getElementById("DPMainToolbar") && document.getElementById("DPMainToolbar").removeClass('narrow');
    }

    var styles = {
      'width': width,
      'height': height
    };

    var wrapper_styles = {
      'width': width,
      'height': height - this.mCanvasEl.getElement('#canvas-wrapper').getStyle('top').toIntZero()
    }

    if(this.mVersions[this.mCurrentVersion] && this.mVersions[this.mCurrentVersion].width) {
      if(this.mCurrentVersion == 0) {
        wrapper_styles.width = "100%";
        morph = false;
      }
      else {
        wrapper_styles.width = this.mVersions[this.mCurrentVersion].width
      }
    }


    if(morph) {
      this.mCanvasEl.morph(styles);
      this.mCanvasEl.getElement('#canvas-wrapper').morph(wrapper_styles);
/*       this.mCanvasEl.getElement('.wrapper').morph(wrapper_styles); */
    }
    else {
      this.mCanvasEl.setStyles(styles);
      this.mCanvasEl.getElement('#canvas-wrapper').setStyles(wrapper_styles);
/*       this.mCanvasEl.getElement('.wrapper').setStyles(wrapper_styles); */
    }


    if(this.mCurrentVersion.toInt() == 0) {
      this.mCanvasEl.getElement('#canvas-wrapper').addClass('default');
    }
    else {
      this.mCanvasEl.getElement('#canvas-wrapper').removeClass('default')
    }
  },
  
  isExport: function() {
    return this.mData.export_mode;
  },
  
  isShotMode: function() {
    return this.mData.is_shot_mode;
  },
  
  isMenuEnabled: function() {
    return this.mData.menu_enabled;
  },
  
  isCollaborationEnabled: function() {
    return this.mData.active_collaboration;
  },
  
  /**
   * JavaScript Pretty Date
   * Copyright (c) 2011 John Resig (ejohn.org)
   * Licensed under the MIT and GPL licenses.
   */
  prettyDate: function(pTime) {
	
    var date = new Date((pTime || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
        
    if ( isNaN(day_diff) || day_diff < 0 )
      return;
			
    return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      day_diff == 1 && "Yesterday" ||
      day_diff < 7 && day_diff + " days ago" ||
      Math.ceil( day_diff / 7 ) + " weeks ago";
  },


  loadPageCall: function(pId) {
    var instant = true;
    var version;
    this.mData.versions.each(function(pVersion, pType) {
      if(pVersion == pId) {
        version = pType;
      }
    });

    if(Preview.Comments) {
      Preview.Comments.fetchComments(pId);
    }


    if(this.mPageBuffer[pId]) {
      this.comet.loadPage(this.mPageBuffer[pId], instant);
    }

    this.fetchPage(pId, version);

    this.mCurrentVersion = version;
    this.mCurrentPageId = pId;
  },


  cachePage: function(pId, pHTML) {
    this.mPageBuffer[pId] = pHTML;
  },


  fetchPage: function(pIdPage, pType) {
    if(!this.isExport()) {
      this.mDejax.newRequest({
        'url': '/ajax/dmsDPPreview/GetPageContent/',
        'eval': true,
        'mode': 'cancel',
        'data': {
          'id_page': pIdPage,
          'variation_type' : pType,
          'id_project': Preview.getData().id_project,
          'project_hash': Preview.getData().project_hash,
          'menu_enabled': Preview.isMenuEnabled(),
          'active_collaboration': Preview.isCollaborationEnabled()
        },
        'onComplete': function(pHTML) {
          this.cachePage(pIdPage,pHTML);
          this.comet.loadPage(pHTML, true)
        }.bind(this)
      });
    }
  },


  preloadPage: function(pVersions) {
    this.mDejax.newRequest({
      'url': '/ajax/dmsDPPreview/GetPageContents/',
      'eval': true,
      'mode': 'queue',
      'data': {
        'variation_data': pVersions,
        'id_project': Preview.getData().id_project,
        'project_hash': Preview.getData().project_hash,
        'menu_enabled': Preview.isMenuEnabled(),
        'active_collaboration': Preview.isCollaborationEnabled()
      },
      'onComplete': function(pData) {
        pData = new Hash(pData);
        pData.forEach(function(pData, pIdPage) {
          this.cachePage(pIdPage,pData);
        }.bind(this));

      }.bind(this)
    });
  },


  responsiveAdjust: function() {
    var width = document.getElementById("canvas").getStyle('width').toInt();
    var version = null;
    var found = false;

    if((document.getElement("#version-select") && document.getElement("#version-select").getSelected().get('value')=='responsive') || (!Preview.isMenuEnabled() && Preview.mData.is_shot_mode == false)) {

      Preview.breaks.breakEach(function(pObj) {
        if(pObj.size >= width) {
          if(Preview.current_page_id != Preview.mData.versions[pObj.version]) {
            found = true;
            Preview.current_page_id = Preview.mData.versions[pObj.version];
            Preview.mCurrentVersion = pObj.version;
            Preview.loadPageCall(Preview.mData.versions[pObj.version]);

            return false;
          }
          else {
            found = true;
            return false;
          }
        }
      });

      if(found == false && Preview.breaks.length) {
        Preview.current_page_id = Preview.mData.versions[Preview.breaks[Preview.breaks.length - 1].version];
        Preview.mCurrentVersion = Preview.breaks[Preview.breaks.length - 1].version
        Preview.loadPageCall(Preview.mData.versions[Preview.breaks[Preview.breaks.length - 1].version]);
      }
    }
  },

  checkForResponsiveOption: function() {
    if(hashuri.get('R') == 1 || !this.isMenuEnabled()) {
      document.getElement('.version-list') && document.getElement('.version-list').getSelected().set('selected',false);
      document.getElement('.version-list') && document.getElement('.version-list').getElement('[value="responsive"]').setAttribute('selected','selected');
      this.responsiveAdjust();
      this.canvasResize();

      return true;
    }
    return false;
  },

  loadPageVersion: function(pVersion) {
    var page_id = Preview.mData.versions[pVersion];
    Preview.loadPageCall(page_id);
    if(document && document.getElement('.version-list')) {
      document.getElement('.version-list').selectedIndex = document.getElement('.version-list').getElement('[value='+Preview.mCurrentPageId+']').index
    }
    this.canvasResize();
    //document.getElement('.version-list').getSelected().set('selected',false);

  },

  getFixed: function() {
    var fixed = document.querySelectorAll('.FixedPos');

    for(var i = 0;i<fixed.length;i++) {
      fixed[i].originalTop = fixed[i].style.top;
      fixed[i].originalLeft = fixed[i].style.left;
    }
    return fixed;
  },

  fixModals: function() {
    var positionOverlay = function() {
      var styles = {
        'left': 0,
        'width': $('canvas-wrapper').scrollWidth,
        'height': $('canvas-wrapper').scrollHeight
      };

      $$('.modal-overlay').setStyles(styles);
    };

    positionOverlay();
    window.addEvent('resize', positionOverlay);

    var modal = $$('.ElGroup > .modal-overlay, .Component > .modal-overlay');
    modal.each(function(pEl) {

      if(pEl.getParents('.Component') || pEl.getParents('.ElGroup')) {
        var parent = pEl.getParent();
        var removed = pEl.dispose();

        try{
          removed.inject(parent, 'before')
        }
        catch(e){}
      }
    })
  }


});

var dmsDPPreview_MainToolbar = new Class({
  
  Extends: DPMainToolbar,
  
  initialize: function() {
    this.mParentEl = document.getElement('#canvas');
    this.mItems = [];
  },
  
  addEl: function(pEl) {

    this.mItems.push(pEl);
    this.render();
  },
  
  getEl: function() {
    return this.mEl;
  }
  
});

;(function PreviewInteractionsScope(global) {
  'use strict';

  var Interactions = {

    ori_styles: {},

    one_times: {},

    active_node_id: 'main1',

    one_times_reverse: {},

    els: {},

    scrollable_el: null,

    onChangeLayer: function(pActiveId, pPrevId) {
      Interactions.active_node_id = 'main' + pActiveId;

      // old references won't be valid anymore
      Interactions.els['main' + pPrevId] = {};
    },

    getSetElRef: function(id) {
      var node_id = Interactions.active_node_id;

      if (typeof Interactions.els[node_id] === 'undefined') {
        Interactions.els[node_id] = {};
      }

      if (typeof Interactions.els[node_id][id] !== 'object') {
        Interactions.els[node_id][id] = document.getElementById(node_id).querySelector('*[id^=el'+id+'_]');

        // exception: tooltip has wrapper el
        if (Interactions.els[node_id][id].classList.contains('ElTooltip')) {
          Interactions.els[node_id][id] = Interactions.els[node_id][id].parentNode;
        }
        // another exception: table has child element
        else if (Interactions.els[node_id][id].classList.contains('ElTableContainer')) {
          Interactions.els[node_id][id] = Interactions.els[node_id][id].querySelector('.ElTable');
        }
      }

      return Interactions.els[node_id][id];
    },

    ifFireOneTimeScroll: function(id, action, offset, reverse) {
      var current_offset = Interactions.scrollable_el.getScroll();
      var prev_offset_property = 'one_times' + (reverse ? '_reverse' : '');
      var prev_offset;
      var return_value = 0;

      // define start offsets
      if (typeof Interactions[prev_offset_property][action] == 'undefined') {
        Interactions[prev_offset_property][action] = {};
      }

      if (typeof Interactions[prev_offset_property][action][id] === 'undefined') {
        Interactions[prev_offset_property][action][id] = {x: 0, y: 0};
      }

      prev_offset = Interactions[prev_offset_property][action][id];

      // if scrolled below boundary offset
      if (current_offset.y >= offset && prev_offset.y < offset) {
        return_value = 1;
      }
      else if (current_offset.y < offset && prev_offset.y >= offset) {
        return_value = -1;
      }

      Interactions[prev_offset_property][action][id] = current_offset;

      if (reverse) {
        return_value *= -1;
      }

      return return_value;
    },

    handleEvent: function(e, processed) {
      var target_node_name = e.target.nodeName.toLowerCase();
      var notProcessedCallback = function(pValue) {
        return false === pValue;
      };

      // don't prevent default when keydown inside form element
      if (e.keyCode && (['input', 'textarea', 'select'].indexOf(target_node_name) > -1 || processed.every(notProcessedCallback))) {
        return;
      }

      // Don't preventDefault() on checkbox or label by click event
      if ('click' === e.type) {
        if ('label' === target_node_name) {
          return;
        }

        if ('input' === target_node_name && 'checkbox' === e.target.getAttribute('type').toLowerCase()) {
          return;
        }
      }

      e.preventDefault();
    }

  };

  global.Interactions = Interactions;

})(window);

;(function InteractionsAnimationsScope(global) {
  'use strict';

  /**
   * @param el
   * @constructor
   */
  var InteractionsAnimations = function(el) {

    // element
    this.el = el;

    // browser prefix
    this.prefix = this.getPrefix();

    // standardized form of animations set on element
    this.animations = {};

    // check for existing animations
    this.parseCurrentAnimations();
  };

  /**
   * Checks and returns browser prefix for css styles
   *
   * @returns {string}
   */
  InteractionsAnimations.prototype.getPrefix = function() {
    var prefix = '';

    for (var css_prefix in InteractionsAnimations.prefixes) {
      if (InteractionsAnimations.prefixes.hasOwnProperty(css_prefix) && typeof window.getComputedStyle(this.el)[InteractionsAnimations.prefixes[css_prefix] + 'Transform'] !== 'undefined') {
        prefix = css_prefix;
        break;
      }
    }

    return prefix;
  };

  /**
   * Returns reference to this.animations[type] table and creates it if it doesn't exist
   *
   * @param type
   * @returns {*}
   */
  InteractionsAnimations.prototype.getDefineType = function(type) {
    if (typeof this.animations[type] === 'undefined') {
      this.animations[type] = {
        'property': [],
        'duration': [],
        'function': []
      };
    }

    return this.animations[type];
  };

  /**
   * Parses element styles to get currently applied animations. Populates this.animations object
   */
  InteractionsAnimations.prototype.parseCurrentAnimations = function() {
    var transitions = this.parseTransitions();
    var property;
    var index;

    // check for existing animations set on element
    for (var type in InteractionsAnimations.definitions) {
      if (InteractionsAnimations.definitions.hasOwnProperty(type)) {

        // search for properties in transition-property
        for (var i in InteractionsAnimations.definitions[type]) {
          if (InteractionsAnimations.definitions[type].hasOwnProperty(i)) {
            property = InteractionsAnimations.definitions[type][i];

            // add prefix to -transform
            if (property.test(/^\-.*$/)) {
              property = '-' + this.prefix + property;
            }

            index = transitions.property.indexOf(property);

            if (index > -1) {
              var animation = this.getDefineType(type);

              animation.property.push(property);
              animation.duration.push(transitions.duration[index]);
              animation['function'].push(transitions['timing-function'][index]);

              transitions.property.splice(index, 1);
              transitions.duration.splice(index, 1);
              transitions['timing-function'].splice(index, 1);
            }
            // if property of given type of animation not found in transitions table, continue with another type
            else {
              break;
            }
          }
        }
      }
    }
  };

  /**
   * Parses css styles of the element and gets applied transitions
   *
   * @returns {{}}
   */
  InteractionsAnimations.prototype.parseTransitions = function() {
    var transitions = {};

    // map transition property string to array
    transitions.property = window.getComputedStyle(this.el)[InteractionsAnimations.prefixes[this.prefix] + 'TransitionProperty'].split(',').map(function(val) {
      return val.trim();
    });

    transitions.duration = window.getComputedStyle(this.el)[InteractionsAnimations.prefixes[this.prefix] + 'TransitionDuration'].split(',').map(function(val) {
      return val.trim();
    });

    transitions['timing-function'] = window.getComputedStyle(this.el)[InteractionsAnimations.prefixes[this.prefix] + 'TransitionTimingFunction'].split(',').map(function(val) {
      return val.trim();
    });

    return transitions;
  };

  /**
   * Applies animation of given type to the element
   *
   * @param type
   * @param timing_function
   * @param duration
   */
  InteractionsAnimations.prototype.addAnimation = function(type, timing_function, duration) {
    var animation = this.getDefineType(type);
    var prefix = this.prefix;

    InteractionsAnimations.definitions[type].forEach(function(property) {

      // add prefix to -transform
      if (property.test(/^\-.*$/)) {
        property = '-' + prefix + property;
      }

      animation.property.push(property);
      animation.duration.push(duration);
      animation['function'].push(timing_function);
    });

    this.apply();
  };

  /**
   * Converts this.animations object to js styles and applies them to the DOM element
   */
  InteractionsAnimations.prototype.apply = function() {
    var transition_property = [];
    var transition_duration = [];
    var transition_function = [];

    var property_cbk = function(property) {
      transition_property.push(property);
    };

    var duration_cbk = function(duration) {
      transition_duration.push(duration);
    };

    var function_cbk = function(func) {
      transition_function.push(func);
    };

    for (var type in this.animations) {
      if (this.animations.hasOwnProperty(type)) {
        this.animations[type].property.forEach(property_cbk);
        this.animations[type].duration.forEach(duration_cbk);
        this.animations[type]['function'].forEach(function_cbk);
      }
    }

    this.el.style[InteractionsAnimations.prefixes[this.prefix] + 'TransitionProperty'] = transition_property.join(', ');
    this.el.style[InteractionsAnimations.prefixes[this.prefix] + 'TransitionDuration'] = transition_duration.join(', ');
    this.el.style[InteractionsAnimations.prefixes[this.prefix] + 'TransitionTimingFunction'] = transition_function.join(', ');
  };

  /**
   * Removes animations of given type from element
   *
   * @param type
   */
  InteractionsAnimations.prototype.remove = function(type) {
    this.parseCurrentAnimations();

    if (typeof this.animations[type] !== 'undefined') {
      delete this.animations[type];
    }

    this.apply();
  };

  /**
   * Removes all animations from element
   */
  InteractionsAnimations.prototype.removeAll = function() {
    this.animations = {};
    this.apply();
  };

  InteractionsAnimations.prefixes = {
    'webkit': 'webkit',
    'moz': 'Moz',
    'ms': 'ms',
    'o': 'o'
  };

  /**
   * Definitions of a properties that are specific for given animation type.
   * First defined property in each animation type should be unique for given animation (should not be present in other animation types)
   *
   * @type {{show: string[], move: string[], resize: string[], scale: string[], rotate: string[], opacity: string[], style: string[], style_navi: string[]}}
   */
  InteractionsAnimations.definitions = {
    'show': ['opacity', 'visibility', 'margin'],
    'move': ['top', 'left'],
    'resize': ['width', 'height'],
    'scale': ['-transform'],
    'rotate': ['-transform'],
    'opacity': ['opacity'],
    'style': ['color', 'background-color', 'border-color'],
    'style_navi': ['background-color', 'border-color']
  };

  InteractionsAnimations.timeouts = {
    'show': {},
    'move': {},
    'resize': {},
    'scale': {},
    'rotate': {},
    'opacity': {},
    'style': {},
    'style_navi': {}
  };

  InteractionsAnimations.timing = {
    'linear': function(t, b, c, d) {
      t/=d;
      return b+c*(t);
    },
    'ease-out': function(t, b, c, d) {
      var ts = (t/=d)*t;
      var tc = ts*t;
      return b+c*(tc*ts + -5*ts*ts + 10*tc + -10*ts + 5*t);
    },
    'ease-in': function(t, b, c, d) {
      var ts = (t/=d)*t;
      var tc = ts*t;
      return b+c*(tc*ts);
    },
    'ease-in-out': function(t, b, c, d) {
      var ts = (t/=d)*t;
      var tc = ts*t;
      return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
    }
  };

  /**
   * Scrolls the element (el) to provided offset (to) in (duration) time using (timing) function
   *
   * @param el
   * @param to
   * @param duration
   * @param timing
   */
  InteractionsAnimations.scroll = function(el, to, duration, timing) {
    var start = el.scrollTop;
    var change = to - start;
    var currentTime = 0;
    var increment = 20;

    /**
     * Animation function, increments processing time and calls itself again for another move
     * if duration isn't reached yet. Don't use it outside InteractionsAnimations.scroll method
     */
    var animateScroll = function(){
      currentTime += increment;
      el.scrollTop = InteractionsAnimations.timing[timing](currentTime, start, change, duration);

      if(currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  };

  /**
   * Moves the element (el) to (to) position from top in (duration) time using (timing) function starting in (start) position
   *
   * @param el
   * @param to
   * @param duration
   * @param timing
   * @param start [optional]
   */
  InteractionsAnimations.positionTop = function(el, to, duration, timing, start) {
    start = start || parseInt(window.getComputedStyle(el).top);

    var change = to - start;
    var currentTime = 0;
    var increment = 5;

    /**
     * Animation function, increments processing time and calls itself again for another move
     * if duration isn't reached yet. Don't use it outside InteractionsAnimations.positionTop method
     */
    var animateTop = function() {
      currentTime += increment;
      el.style.top = InteractionsAnimations.timing[timing](currentTime, start, change, duration) + 'px';

      if(currentTime < duration) {
        setTimeout(animateTop, increment);
      }
    };

    animateTop();
  };

  InteractionsAnimations.getTimeoutTime = function(time) {
    return time > 20 ? time - 10 : 10;
  };

  global.InteractionsAnimations = InteractionsAnimations;
})(window);

