/**
 * @fileoverview jquery.pmcmenu.js
 * @brief jQuery plugin to create a context menu using the bootstrap styles 
 * @date 20120703
 * @version 0.1
 * @requires jQuery
 *
 * PMCMenu is free plugin; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * PMCMenu is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 */

;(function($){
 
var // currently active contextMenu trigger
    $currentTrigger = null,
    // is contextMenu initialized with at least one menu?
    initialized = false,
    // window handle
    $win = $(window),
    // number of registered menus
    counter = 0,
    // mapping selector to namespace
    namespaces = {},
    // mapping namespace to options
    menus = {},
    // custom command type handlers
    types = {},
    /** Default settings for the PMCMenu
    * @namespace Default settings for the PMCMenu widget
    */	
    defaults = {
        /** 
        * Selector
        * @type jquery Object 
        * @default null
        */
        selector: null,
        /** 
        * Where to append the menu to
        * @type jquery Object 
        * @default null
        */
        appendTo: null,
        /**
        * Method to trigger context menu ["right", "left", "hover"]
        * @type String 
        * @default right
        */
        trigger: "right",
        /**
        * hide menu when mouse leaves trigger / menu elements
        * @type Boolean 
        * @default false
        */
        autoHide: false,
        /**
        * Milleseconds to wait before showing a hover-triggered context menu
        * @type Integer 
        * @default 200
        */
        delay: 200,
        // determine position to show menu at
        determinePosition: function($menu) {
            // position to the lower middle of the trigger element
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "center top",
                    at: "center bottom",
                    of: this,
                    offset: "0 5",
                    collision: "fit"
                }).css('display', 'none');
            } else {
                // determine contextMenu position
                var offset = this.offset();
                offset.top += this.outerHeight();
                offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                $menu.css(offset);
            }
        },
        // position menu
        position: function(opt, x, y) {
            var $this = this,
                offset;
            // determine contextMenu position
            if (!x && !y) {
                opt.determinePosition.call(this, opt.$menu);
                return;
            } else if (x === "maintain" && y === "maintain") {
                // x and y must not be changed (after re-show on command click)
                offset = opt.$menu.position();
            } else {
                // x and y are given (by mouse event)
                var triggerIsFixed = opt.$trigger.parents().andSelf()
                    .filter(function() {
                        return $(this).css('position') == "fixed";
                    }).length;

                if (triggerIsFixed) {
                    y -= $win.scrollTop();
                    x -= $win.scrollLeft();
                }
                offset = {top: y, left: x};
            }
            
            // correct offset if viewport demands it
            var bottom = $win.scrollTop() + $win.height(),
                right = $win.scrollLeft() + $win.width(),
                height = opt.$menu.height(),
                width = opt.$menu.width();
            
            if (offset.top + height > bottom) {
                offset.top -= height;
            }
            
            if (offset.left + width > right) {
                offset.left -= width;
            }
            
            opt.$menu.css(offset);
        },
        // position the sub-menu
        positionSubmenu: function($menu) {
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "left top",
                    at: "right top",
                    of: this,
                    collision: "fit"
                }).css('display', '');
            } else {
                // determine contextMenu position
                var offset = this.offset();
                offset.top += 0;
                offset.left += this.outerWidth();
                $menu.css(offset);
            }
        },
        /**
        * Offset to add to zIndex
        * @type Integer 
        * @default 1000
        */
        zIndex: 1000,
        /**
        * Show hide animation settings
        * @type Array 
        * @default 
        */
        animation: {
            duration: 50,
            show: 'slideDown',
            hide: 'slideUp'
        },
        // events
        events: {
            show: $.noop,
            hide: $.noop
        },
        /**
        * Default callback
        * @type function 
        * @default null
        */
        callback: null,
        /**
        * List of contextMenu items
        * @type Array 
        * @default empty
        */
        items: {}
    },
    // mouse position for hover activation
    hoveract = {
        timer: null,
        pageX: null,
        pageY: null
    },
    // determine zIndex
    zindex = function($t) {
        var zin = 0,
            $tt = $t;

        while (true) {
            zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
            $tt = $tt.parent();
            if (!$tt || !$tt.length || "html body".indexOf($tt.prop('nodeName').toLowerCase()) > -1 ) {
                break;
            }
        }
        
        return zin;
    },
    // event handlers
    handle = {
        // abort anything
        abortevent: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
        },
        
        /** 
        *  contextmenu method of PMCMenu show disptacher
        *  @name PMCMenu#contextmenu 
        *  @function 
        */ 
        contextmenu: function(e) {
            var $this = $(this);
            
            // disable actual cmenu
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // abort native-triggered events unless we're triggering on right click
            if (e.data.trigger != 'right' && e.originalEvent) {
                return;
            }
            
            if (!$this.hasClass('cmenu-disabled')) {
                // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                // e.data.$menu.trigger(evt);
                
                $currentTrigger = $this;
                if (e.data.build) {
                    var built = e.data.build($currentTrigger, e);
                    // abort if build() returned false
                    if (built === false) {
                        return;
                    }
                    
                    // dynamically build menu on invocation
                    e.data = $.extend(true, {}, defaults, e.data, built || {});

                    // abort if there are no items to display
                    if (!e.data.items || $.isEmptyObject(e.data.items)) {
                        // Note: jQuery captures and ignores errors from event handlers
                        if (window.console) {
                            (console.error || console.log)("No items specified to show in PMCMenu");
                        }
                        
                        throw new Error('No Items sepcified');
                    }
                    
                    // backreference for custom command type creation
                    e.data.$trigger = $currentTrigger;
                    
                    op.create(e.data);
                }
                // show menu
                op.show.call($this, e.data, e.pageX, e.pageY);
            }
        },
        // contextMenu left-click trigger
        click: function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).trigger(jQuery.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
        },
        // PMCMenu right-click trigger
        mousedown: function(e) {
            // register mouse down
            var $this = $(this);
            
            // hide any previous menus
            if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                $currentTrigger.data('PMCMenu').$menu.trigger('contextmenu:hide');
            }
            
            // activate on right click
            if (e.button == 2) {
                $currentTrigger = $this.data('PMCMenuActive', true);
            }
        },
        // contextMenu right-click trigger
        mouseup: function(e) {
            // show menu
            var $this = $(this);
            if ($this.data('PMCMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('cmenu-disabled')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $currentTrigger = $this;
                $this.trigger(jQuery.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
            }
            
            $this.removeData('PMCMenuActive');
        },
        // contextMenu hover trigger
        mouseenter: function(e) {
            var $this = $(this),
                $related = $(e.relatedTarget),
                $document = $(document);
            
            // abort if we're coming from a menu
            if ($related.is('.cmenu-list') || $related.closest('.cmenu-list').length) {
                return;
            }
            
            // abort if a menu is shown
            if ($currentTrigger && $currentTrigger.length) {
                return;
            }
            
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
            hoveract.data = e.data;
            $document.on('mousemove.PMCMenuShow', handle.mousemove);
            hoveract.timer = setTimeout(function() {
                hoveract.timer = null;
                $document.off('mousemove.PMCMenuShow');
                $currentTrigger = $this;
                $this.trigger(jQuery.Event("contextmenu", { data: hoveract.data, pageX: hoveract.pageX, pageY: hoveract.pageY }));
            }, e.data.delay );
        },
        // contextMenu hover trigger
        mousemove: function(e) {
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
        },
        // contextMenu hover trigger
        mouseleave: function(e) {
            // abort if we're leaving for a menu
            var $related = $(e.relatedTarget);
            if ($related.is('.cmenu-list') || $related.closest('.cmenu-list').length) {
                return;
            }
            
            try {
                clearTimeout(hoveract.timer);
            } catch(e) {}
            
            hoveract.timer = null;
        },
        
        // click on layer to hide contextMenu
        layerClick: function(e) {
            var $this = $(this),
                root = $this.data('PMCMenuRoot'),
                x = e.pageX,
                y = e.pageY,
                target, 
                offset,
                selectors;
                
            e.preventDefault();
            e.stopImmediatePropagation();
            
            if ((root.trigger == 'left' && e.button === 0) || (root.trigger == 'right' && e.button == 2)) {
                if (document.elementFromPoint) {
                    root.$layer.hide();
                    target = document.elementFromPoint(x, y);
                    root.$layer.show();

                    selectors = [];
                    for (var s in namespaces) {
                        selectors.push(s);
                    }

                    target = $(target).closest(selectors.join(', '));

                    if (target.length) {
                        if (target.is(root.$trigger[0])) {
                            root.position.call(root.$trigger, root, x, y);
                            return;
                        }
                    }
                } else {
                    offset = root.$trigger.offset();
                
                    // while this looks kinda awful, it's the best way to avoid
                    // unnecessarily calculating any positions
                    offset.top += $(window).scrollTop();
                    if (offset.top <= e.pageY) {
                        offset.left += $(window).scrollLeft();
                        if (offset.left <= e.pageX) {
                            offset.bottom = offset.top + root.$trigger.outerHeight();
                            if (offset.bottom >= e.pageY) {
                                offset.right = offset.left + root.$trigger.outerWidth();
                                if (offset.right >= e.pageX) {
                                    // reposition
                                    root.position.call(root.$trigger, root, x, y);
                                    return;
                                }
                            }
                        }
                    }
                }
            } 
            
            // remove only after mouseup has completed
            $this.on('mouseup', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                root.$menu.trigger('contextmenu:hide');
                if (target && target.length) {
                    setTimeout(function() {
                        target.PMCMenu({x: x, y: y});
                    }, 50);
                }
            });
        },
        // key handled :hover
        keyStop: function(e, opt) {
            if (!opt.isInput) {
                e.preventDefault();
            }
            
            e.stopPropagation();
        },
        key: function(e) {
            var opt = $currentTrigger.data('PMCMenu') || {},
                $children = opt.$menu.children(),
                $round;

            switch (e.keyCode) {
                case 9:
                case 38: // up
                    handle.keyStop(e, opt);
                    // if keyCode is [38 (up)] or [9 (tab) with shift]
                    if (opt.isInput) {
                        if (e.keyCode == 9 && e.shiftKey) {
                            e.preventDefault();
                            //opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            //opt.$menu.trigger('prevcommand');
                            return;
                        } else if (e.keyCode == 38 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else if (e.keyCode != 9 || e.shiftKey) {
                        opt.$menu.trigger('prevcommand');
                        return;
                    }
                    break;
                case 9: // tab
                case 40: // down
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (e.keyCode == 9) {
                            e.preventDefault();
                            //opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            //opt.$menu.trigger('nextcommand');
                            return;
                        } else if (e.keyCode == 40 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else {
                        opt.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 37: // left
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                
                    if (!opt.$selected.parent().hasClass('cmenu-root')) {
                        var $parent = opt.$selected.parent().parent();
                        opt.$selected.trigger('contextmenu:blur');
                        opt.$selected = $parent;
                        return;
                    }
                    break;
                    
                case 39: // right
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                    
                    var itemdata = opt.$selected.data('PMCMenu') || {};
                    if (itemdata.$menu && opt.$selected.hasClass('cmenu-submenu')) {
                        opt.$selected = null;
                        itemdata.$selected = null;
                        itemdata.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 35: // end
                case 36: // home
                    if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                        return;
                    } else {
                        (opt.$selected && opt.$selected.parent() || opt.$menu)
                            .children(':not(.disabled, .not-selectable)')[e.keyCode == 36 ? 'first' : 'last']()
                            .trigger('contextmenu:focus');
                        e.preventDefault();
                        return;
                    }
                    break;
                    
                case 13: // enter
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (opt.$selected && !opt.$selected.is('textarea, select')) {
                            e.preventDefault();
                            return;
                        }
                        break;
                    }
                    //opt.$selected && opt.$selected.trigger('mouseup');
                    return;
                    
                case 32: // space
                case 33: // page up
                case 34: // page down
                    // prevent browser from scrolling down while menu is visible
                    handle.keyStop(e, opt);
                    return;
                    
                case 27: // esc
                    handle.keyStop(e, opt);
                    opt.$menu.trigger('contextmenu:hide');
                    return;
                    
                default: // 0-9, a-z
                    var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                    if (opt.accesskeys[k]) {
                        // according to the specs accesskeys must be invoked immediately
                        //opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu
                        //    ? 'contextmenu:focus'
                        //    : 'mouseup'
                        //);
                        return;
                    }
                    break;
            }
            // pass event to selected item, 
            // stop propagation to avoid endless recursion
            e.stopPropagation();
            //opt.$selected && opt.$selected.trigger(e);
        },

        // select previous possible command in menu
        prevItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('PMCMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('PMCMenu') || {};
                opt.$selected = $s;
            }
            
            var $children = opt.$menu.children(),
                $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                $round = $prev;
            
            // skip disabled
            while ($prev.hasClass('disabled') || $prev.hasClass('not-selectable')) {
                if ($prev.prev().length) {
                    $prev = $prev.prev();
                } else {
                    $prev = $children.last();
                }
                if ($prev.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($prev.get(0), e);
            
            // focus input
            var $input = $prev.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        // select next possible command in menu
        nextItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('PMCMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('PMCMenu') || {};
                opt.$selected = $s;
            }

            var $children = opt.$menu.children(),
                $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                $round = $next;

            // skip disabled
            while ($next.hasClass('disabled') || $next.hasClass('not-selectable')) {
                if ($next.next().length) {
                    $next = $next.next();
                } else {
                    $next = $children.first();
                }
                if ($next.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($next.get(0), e);
            
            // focus input
            var $input = $next.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        
        // flag that we're inside an input so the key handler can act accordingly
        focusInput: function(e) {
            var $this = $(this).closest('.cmenu-item'),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;

            root.$selected = opt.$selected = $this;
            root.isInput = opt.isInput = true;
        },
        // flag that we're inside an input so the key handler can act accordingly
        blurInput: function(e) {
            var $this = $(this).closest('.cmenu-item'),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;

            root.isInput = opt.isInput = false;
        },
        
        // :hover on menu
        menuMouseenter: function(e) {
            var root = $(this).data().PMCMenuRoot;
            root.hovering = true;
        },
        // :hover on menu
        menuMouseleave: function(e) {
            var root = $(this).data().PMCMenuRoot;
            if (root.$layer && root.$layer.is(e.relatedTarget)) {
                root.hovering = false;
            }
        },
        
        // :hover done manually so key handling is possible
        itemMouseenter: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;
            
            root.hovering = true;

            // abort if we're re-entering
            if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            // make sure only one item is selected
            (opt.$menu ? opt : root).$menu
                .children('.hover').trigger('contextmenu:blur');

            if ($this.hasClass('disabled') || $this.hasClass('not-selectable')) {
                opt.$selected = null;
                return;
            }
            
            $this.trigger('contextmenu:focus');
        },
        // :hover done manually so key handling is possible
        itemMouseleave: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;

            if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                var temp= root.$selected && root.$selected.trigger('contextmenu:blur');
                e.preventDefault();
                e.stopImmediatePropagation();
                root.$selected = opt.$selected = opt.$node;
                return;
            }
            
            $this.trigger('contextmenu:blur');
        },
        // contextMenu item click
        itemClick: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot,
                key = data.PMCMenuKey,
                callback;
            // abort if the key is unknown or disabled or is a menu
            if (!opt.items[key] || $this.hasClass('disabled') || $this.hasClass('cmenu-submenu')) {
                return;
            }

            e.preventDefault();
            e.stopImmediatePropagation();

            if ($.isFunction(root.callbacks[key])) {
                // item-specific callback
                callback = root.callbacks[key];
            } else if ($.isFunction(root.callback)) {
                // default callback
                callback = root.callback;                
            } else {
                // no callback, no action
                return;
            }

            // hide menu if callback doesn't stop that
            if (callback.call(root.$trigger, key, root) !== false) {
                root.$menu.trigger('contextmenu:hide');
            } else {
                op.update.call(root.$trigger, root);
            }
        },
        // ignore click events on input elements
        inputClick: function(e) {
            e.stopImmediatePropagation();
        },
        
        // hide <menu>
        hideMenu: function(e) {
            var root = $(this).data('PMCMenuRoot');
            op.hide.call(root.$trigger, root);
        },
        // focus <command>
        focusItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;

            $this.addClass('hover')
                .siblings('.hover').trigger('contextmenu:blur');
            
            // remember selected
            opt.$selected = root.$selected = $this;
            
            // position sub-menu - do after show so dumb $.ui.position can keep up
            if (opt.$node) {
                root.positionSubmenu.call(opt.$node, opt.$menu);
            }
        },
        // blur <command>
        blurItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.PMCMenu,
                root = data.PMCMenuRoot;
            
            $this.removeClass('hover');
            opt.$selected = null;
        }
    },
    // operations
    op = {
        show: function(opt, x, y) {
            var $this = $(this),
                offset,
                css = {};

            // hide any open menus
            $('#cmenu-layer').trigger('mousedown');

            // backreference for callbacks
            opt.$trigger = $this;

            // show event
            if (opt.events.show.call($this, opt) === false) {
                $currentTrigger = null;
                return;
            }

            // create or update context menu
            op.update.call($this, opt);
            
            // position menu
            opt.position.call($this, opt, x, y);

            // make sure we're in front
            if (opt.zIndex) {
                css.zIndex = zindex($this) + opt.zIndex;
            }
            
            // add layer
            op.layer.call(opt.$menu, opt, css.zIndex);
            
            // adjust sub-menu zIndexes
            opt.$menu.find('ul').css('zIndex', css.zIndex + 1);
            
            // position and show context menu
            opt.$menu.css( css )[opt.animation.show](opt.animation.duration);
            // make options available
            $this.data('PMCMenu', opt);
            // register key handler
            $(document).off('keydown.PMCMenu').on('keydown.PMCMenu', handle.key);
            // register autoHide handler
            if (opt.autoHide) {
                // trigger element coordinates
                var pos = $this.position();
                pos.right = pos.left + $this.outerWidth();
                pos.bottom = pos.top + this.outerHeight();
                // mouse position handler
                $(document).on('mousemove.PMCMenuAutoHide', function(e) {
                    if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                        // if mouse in menu...
                        opt.$menu.trigger('contextmenu:hide');
                    }
                });
            }
        },
        hide: function(opt) {
            var $this = $(this);
            if (!opt) {
                opt = $this.data('PMCMenu') || {};
            }
            
            // hide event
            if (opt.events && opt.events.hide.call($this, opt) === false) {
                return;
            }
            
            if (opt.$layer) {
                // keep layer for a bit so the contextmenu event can be aborted properly by opera
                setTimeout((function($layer){ return function(){
                        $layer.remove();
                    };
                })(opt.$layer), 10);
                
                try {
                    delete opt.$layer;
                } catch(e) {
                    opt.$layer = null;
                }
            }
            
            // remove handle
            $currentTrigger = null;
            // remove selected
            opt.$menu.find('.hover').trigger('contextmenu:blur');
            opt.$selected = null;
            // unregister key and mouse handlers
            $(document).off('.PMCMenuAutoHide').off('keydown.PMCMenu');
            // hide menu
            tmp=opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration);
            
            // tear down dynamically built menu
            if (opt.build) {
                opt.$menu.remove();
                $.each(opt, function(key, value) {
                    switch (key) {
                        case 'ns':
                        case 'selector':
                        case 'build':
                        case 'trigger':
                            return true;

                        default:
                            opt[key] = undefined;
                            try {
                                delete opt[key];
                            } catch (e) {}
                            return true;
                   }
                });
            }
        },
        create: function(opt, root) {
            if (root === undefined) {
                root = opt;
            }
            // create PMCMenu
            opt.$menu = $('<ul id="'+opt.ns+'" class="cmenu-list ' + (opt.className || "") +'"></ul>').data({
                'PMCMenu': opt,
                'PMCMenuRoot': root
            });
            
            $.each(['callbacks', 'commands', 'inputs'], function(i,k){
                opt[k] = {};
                if (!root[k]) {
                    root[k] = {};
                }
            });
            
            temp = root.accesskeys || (root.accesskeys = {});
            
            // create contextMenu items
            $.each(opt.items, function(key, item){
                var $t = $('<li class="cmenu-item ' + (item.className || "") +'"></li>'),
                    $label = null,
                    $input = null;
                
                // add icons
                if (item.icon) {
                  $('<i class="'+item.icon+'"></i>').appendTo($t);
                }
                item.$node = $t.data({
                    'PMCMenu': opt,
                    'PMCMenuRoot': root,
                    'PMCMenuKey': key
                });
                if (item.type && item.type == "separator") {
                    $t.addClass('cmenu-separator not-selectable');
                } else if (item.type && types[item.type]) {
                    // run custom type handler
                    types[item.type].call($t, item, opt, root);
                    // register commands
                    $.each([opt, root], function(i,k){
                        k.commands[key] = item;
                        if ($.isFunction(item.callback)) {
                            k.callbacks[key] = item.callback;
                        }
                    });
                } else {
                    // add label for input
                    if (item.type) {
                        $label = $('<label></label>').appendTo($t);
                        $('<span></span>').html(' ' + (item._name || item.name)).appendTo($label);
                        $t.addClass('cmenu-input');
                        opt.hasTypes = true;
                        $.each([opt, root], function(i,k){
                            k.commands[key] = item;
                            k.inputs[key] = item;
                        });
                    } else if (item.items) {
                        item.type = 'sub';
                    }
                
                    switch (item.type) {
//                        case 'text':
//                            $input = $('<input type="text" value="1" name="cmenu-input-'+ key +'" value="">')
//                                .val(item.value || "").appendTo($label);
//                            break;
//                    
//                        case 'textarea':
//                            $input = $('<textarea name="cmenu-input-'+ key +'"></textarea>')
//                                .val(item.value || "").appendTo($label);
//
//                            if (item.height) {
//                                $input.height(item.height);
//                            }
//                            break;

                        case 'checkbox':
                            $input = $('<input type="checkbox" value="1" name="cmenu-input-'+ key +'" value="">')
                                .val(item.value || "").prop("checked", !!item.selected).prependTo($label);
                            break;

//                        case 'radio':
//                            $input = $('<input type="radio" value="1" name="cmenu-input-'+ item.radio +'" value="">')
//                                .val(item.value || "").prop("checked", !!item.selected).prependTo($label);
//                            break;
//                    
//                        case 'select':
//                            $input = $('<select name="cmenu-input-'+ key +'">').appendTo($label);
//                            if (item.options) {
//                                $.each(item.options, function(value, text) {
//                                    $('<option></option>').val(value).text(text).appendTo($input);
//                                });
//                                $input.val(item.selected);
//                            }
//                            break;
                        
                        case 'sub':
                            $('<span></span>').html(' ' + (item._name || item.name)).appendTo($t);
                            item.appendTo = item.$node;
                            op.create(item, root);
                            $t.data('PMCMenu', item).addClass('cmenu-submenu');
                            item.callback = null;
                            break;
                            
                        default:
                            $.each([opt, root], function(i,k){
                                k.commands[key] = item;
                                if ($.isFunction(item.callback)) {
                                    k.callbacks[key] = item.callback;
                                }
                            });
                            
                            $('<span></span>').html(' ' + (item._name || item.name || "")).appendTo($t);
                            break;
                    }
                    
                }
                
                // cache contained elements
                item.$input = $input;
                item.$label = $label;

                // attach item to menu
                $t.appendTo(opt.$menu);
                
                // Disable text selection
                if (!opt.hasTypes) {
                    if($.browser.msie) {
                        $t.on('selectstart.disableTextSelect', handle.abortevent);
                    } else if(!$.browser.mozilla) {
                        $t.on('mousedown.disableTextSelect', handle.abortevent);
                    }
                }
            });
            // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
            if (!opt.$node) {
                opt.$menu.css('display', 'none').addClass('cmenu-root');
            }
            opt.$menu.appendTo(opt.appendTo || document.body);
        },
        update: function(opt, root) {
            var $this = this;
            if (root === undefined) {
                root = opt;
                // determine widths of submenus, as CSS won't grow them automatically
                // position:absolute > position:absolute; min-width:100; max-width:200; results in width: 100;
                // kinda sucks hard...
                opt.$menu.find('ul').andSelf().css({position: 'static', display: 'block'}).each(function(){
                    var $this = $(this);
                    $this.width($this.css('position', 'absolute').width())
                        .css('position', 'static');
                }).css({position: '', display: ''});
            }
            // re-check disabled for each item
            opt.$menu.children().each(function(){
                var $item = $(this),
                    key = $item.data('PMCMenuKey'),
                    item = opt.items[key],
                    disabled = ($.isFunction(item.disabled) && item.disabled.call($this, key, root)) || item.disabled === true;

                // dis- / enable item
                $item[disabled ? 'addClass' : 'removeClass']('disabled');
                
                if (item.type) {
                    // dis- / enable input elements
                    $item.find('input, select, textarea').prop('disabled', disabled);
                    
                    // update input states
                    switch (item.type) {
//                        case 'text':
//                        case 'textarea':
//                            item.$input.val(item.value || "");
//                            break;
                            
                        case 'checkbox':
                        case 'radio':
                            item.$input.val(item.value || "").prop('checked', !!item.selected);
                            break;
//                            
//                        case 'select':
//                            item.$input.val(item.selected || "");
//                            break;
                    }
                }
                
                if (item.$menu) {
                    // update sub-menu
                    op.update.call($this, item, root);
                }
            });
        },
        layer: function(opt, zIndex) {
            // add transparent layer for click area
            // filter and background for Internet Explorer, Issue #23
            return opt.$layer = $('<div id="cmenu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                .css({height: $win.height(), width: $win.width(), display: 'block'})
                .data('PMCMenuRoot', opt)
                .insertBefore(this)
                .on('contextmenu', handle.abortevent)
                .on('mousedown', handle.layerClick);
        }
    };

/**
* jQuery 'fn' definition to anchor JsDoc comments.
*  
* 
* @see http://jquery.com/
* @name fn
* @class jQuery Library
* @memberOf jQuery
*/

/**
* A jQuery Wrapper Function to append ContextMenu to a DOM object.
* 
* @class PMCMenu
* @param {string} operations to contextmenu.
* @return {jQuery} chainable jQuery class
* @memberOf jQuery.fn
*/
$.fn.PMCMenu = function(operation) {
    if (operation === undefined) {
        this.first().trigger('contextmenu');
    } else if (operation.x && operation.y) {
        this.first().trigger(jQuery.Event("contextmenu", {pageX: operation.x, pageY: operation.y}));
    } else if (operation === "hide") {
        var $menu = this.data('PMCMenu').$menu;
        tmp =$menu && $menu.trigger('contextmenu:hide');
    } else if (operation) {
        this.removeClass('cmenu-disabled');
    } else if (!operation) {
        this.addClass('cmenu-disabled');
    }
    
    return this;
};

/**
* jQuery definition to anchor JsDoc comments.
*  
* @see http://jquery.com/
* @name jQuery
* @class jQuery Library
*/

/**
* jQuery Utility Function to create a ContextMenu .
* 
* @namespace PMCMenu
* @function
* @param {string} operation.
* @param {object} options.
* @return {object} ContextMenu.
* @memberOf jQuery
*/
$.PMCMenu = function(operation, options) {
    if (typeof operation != 'string') {
        options = operation;
        operation = 'create';
    }
    
    if (typeof options == 'string') {
        options = {selector: options};
    } else if (options === undefined) {
        options = {};
    }
    
    // merge with default options
    var o = $.extend(true, {}, defaults, options || {}),
        $body = $(document);
    
    switch (operation) {
        case 'create':
            // no selector no joy
            if (!o.selector) {
//                throw new Error('No selector specified');
                console.log('No selector specified');
                return;
            }
            // make sure internal classes are not bound to
            if (o.selector.match(/.cmenu-(list|item|input)($|\s)/)) {
                throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
            }
            if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
//                throw new Error('No Items sepcified');
                console.log('No Items sepcified');
                return;
            }
            counter ++;
            o.ns = '.PMCMenu' + counter;
            namespaces[o.selector] = o.ns;
            menus[o.ns] = o;
            
            if (!initialized) {
                // make sure item click is registered first
                $body
                    .on({
                        'contextmenu:hide.PMCMenu': handle.hideMenu,
                        'prevcommand.PMCMenu': handle.prevItem,
                        'nextcommand.PMCMenu': handle.nextItem,
                        'contextmenu.PMCMenu': handle.abortevent,
                        'mouseenter.PMCMenu': handle.menuMouseenter,
                        'mouseleave.PMCMenu': handle.menuMouseleave
                    }, '.cmenu-list')
                    .on('mouseup.PMCMenu', '.cmenu-input', handle.inputClick)
                    .on({
                        'mouseup.PMCMenu': handle.itemClick,
                        'contextmenu:focus.PMCMenu': handle.focusItem,
                        'contextmenu:blur.PMCMenu': handle.blurItem,
                        'contextmenu.PMCMenu': handle.abortevent,
                        'mouseenter.PMCMenu': handle.itemMouseenter,
                        'mouseleave.PMCMenu': handle.itemMouseleave
                    }, '.cmenu-item');

                initialized = true;
            }
            
            // engage native contextmenu event
            $body
                .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);
            
            switch (o.trigger) {
                case 'hover':
                        $body
                            .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);                    
                    break;
                    
                case 'left':
                        $body.on('click' + o.ns, o.selector, o, handle.click);
                    break;
                /*
                default:
                    // http://www.quirksmode.org/dom/events/contextmenu.html
                    $body
                        .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                        .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                    break;
                */
            }
            
            // create menu
            if (!o.build) {
                op.create(o);
            }
            break;
        
        case 'destroy':
            if (!o.selector) {
                $body.off('.PMCMenu .PMCMenuAutoHide');
                $.each(namespaces, function(key, value) {
                    $body.off(value);
                });
                
                namespaces = {};
                menus = {};
                counter = 0;
                initialized = false;
                
                $('#cmenu-layer, .cmenu-list').remove();
            } else if (namespaces[o.selector]) {
                try {
                    if (menus[namespaces[o.selector]].$menu) {
                        menus[namespaces[o.selector]].$menu.remove();
                    }
                    
                    delete menus[namespaces[o.selector]];
                } catch(e) {
                    menus[namespaces[o.selector]] = null;
                }
                
                $body.off(namespaces[o.selector]);
            }
            break;
            
        default:
            throw new Error('Unknown operation "' + operation + '"');
    }
    
    return this;
};

/**
* jQuery Method Function to set Inputs Values to ContextMenu .
* 
* @namespace PMCMenu.setInputValues
* @function
* @param {string} opt.
* @param {array} data.
* @memberOf PMCMenu
*/
$.PMCMenu.setInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
//            case 'textarea':
//                item.value = data[key] || "";
//                break;

            case 'checkbox':
                item.selected = data[key] ? true : false;
                break;
                
//            case 'radio':
//                item.selected = (data[item.radio] || "") == item.value ? true : false;
//                break;
            
//            case 'select':
//                item.selected = data[key] || "";
//                break;
        }
    });
};

/**
* jQuery Method Function to get Inputs Values to ContextMenu .
* 
* @namespace PMCMenu.getInputValues
* @function
* @param {string} opt.
* @param {array} data.
* @return value
* @memberOf PMCMenu
*/
$.PMCMenu.getInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
            case 'textarea':
            case 'select':
                data[key] = item.$input.val();
                break;

            case 'checkbox':
                data[key] = item.$input.prop('checked');
                break;
                
            case 'radio':
                if (item.$input.prop('checked')) {
                    data[item.radio] = item.value;
                }
                break;
        }
    });
    
    return data;
};

// find <label for="xyz">
function inputLabel(node) {
    return (node.id && $('label[for="'+ node.id +'"]').val()) || node.name;
}

// make defaults accessible
$.PMCMenu.defaults = defaults;
$.PMCMenu.types = types;

})(jQuery);