/*
 * Fresco - A Beautiful Responsive Lightbox - v1.1.2
 * (c) 2012 Nick Stakenburg
 *
 * http://www.frescojs.com
 *
 * License: http://www.frescojs.com/license
 */;
var Fresco = {
    version: '1.1.2'
};
Fresco.skins = {
    'base': {
        effects: {
            content: {
                show: 0,
                hide: 0,
                sync: true
            },
            loading: {
                show: 0,
                hide: 300,
                delay: 250
            },
            thumbnails: {
                show: 200,
                slide: 0,
                load: 300,
                delay: 250
            },
            window: {
                show: 440,
                hide: 300,
                position: 180
            },
            ui: {
                show: 250,
                hide: 200,
                delay: 3000
            }
        },
        touchEffects: {
            ui: {
                show: 175,
                hide: 175,
                delay: 5000
            }
        },
        fit: 'both',
        keyboard: {
            left: true,
            right: true,
            esc: true
        },
        loop: false,
        onClick: 'previous-next',
        overlay: {
            close: true
        },
        position: false,
        preload: true,
        spacing: {
            both: {
                horizontal: 20,
                vertical: 20
            },
            width: {
                horizontal: 0,
                vertical: 0
            },
            height: {
                horizontal: 0,
                vertical: 0
            },
            none: {
                horizontal: 0,
                vertical: 0
            }
        },
        thumbnails: true,
        ui: 'outside',
        vimeo: {
            autoplay: 1,
            title: 1,
            byline: 1,
            portrait: 0,
            loop: 0
        },
        youtube: {
            autoplay: 1,
            controls: 1,
            enablejsapi: 1,
            hd: 1,
            iv_load_policy: 3,
            loop: 0,
            modestbranding: 1,
            rel: 0
        },
        initialTypeOptions: {
            'image': {},
            'youtube': {
                width: 640,
                height: 360
            },
            'vimeo': {
                width: 640,
                height: 360
            }
        }
    },
    'reset': {},
    'fresco': {},
    'IE6': {}
};
(function ($) {
    (function () {
        function wheel(a) {
            var b;
            if (a.originalEvent.wheelDelta) {
                b = a.originalEvent.wheelDelta / 120
            } else {
                if (a.originalEvent.detail) {
                    b = -a.originalEvent.detail / 3
                }
            }
            if (!b) {
                return
            }
            var c = $.Event("fresco:mousewheel");
            $(a.target).trigger(c, b);
            if (c.isPropagationStopped()) {
                a.stopPropagation()
            }
            if (c.isDefaultPrevented()) {
                a.preventDefault()
            }
        }
        $(document.documentElement).bind("mousewheel DOMMouseScroll", wheel)
    })();
    var q = Array.prototype.slice;
    var _ = {
        isElement: function (a) {
            return a && a.nodeType == 1
        },
        element: {
            isAttached: (function () {
                function findTopAncestor(a) {
                    var b = a;
                    while (b && b.parentNode) {
                        b = b.parentNode
                    }
                    return b
                }
                return function (a) {
                    var b = findTopAncestor(a);
                    return !!(b && b.body)
                }
            })()
        }
    };
    var r = (function (c) {
        function getVersion(a) {
            var b = new RegExp(a + "([\\d.]+)").exec(c);
            return b ? parseFloat(b[1]) : true
        }
        return {
            IE: !! (window.attachEvent && c.indexOf("Opera") === -1) && getVersion("MSIE "),
            Opera: c.indexOf("Opera") > -1 && (( !! window.opera && opera.version && parseFloat(opera.version())) || 7.55),
            WebKit: c.indexOf("AppleWebKit/") > -1 && getVersion("AppleWebKit/"),
            Gecko: c.indexOf("Gecko") > -1 && c.indexOf("KHTML") === -1 && getVersion("rv:"),
            MobileSafari: !! c.match(/Apple.*Mobile.*Safari/),
            Chrome: c.indexOf("Chrome") > -1 && getVersion("Chrome/"),
            Android: c.indexOf("Android") > -1 && getVersion("Android "),
            IEMobile: c.indexOf("IEMobile") > -1 && getVersion("IEMobile/")
        }
    })(navigator.userAgent);

    function px(a) {
        var b = {};
        for (var c in a) {
            b[c] = a[c] + "px"
        }
        return b
    }
    var t = {};
    (function () {
        var c = {};
        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, a) {
            c[a] = function (p) {
                return Math.pow(p, i + 2)
            }
        });
        $.extend(c, {
            Sine: function (p) {
                return 1 - Math.cos(p * Math.PI / 2)
            }
        });
        $.each(c, function (a, b) {
            t["easeIn" + a] = b;
            t["easeOut" + a] = function (p) {
                return 1 - b(1 - p)
            };
            t["easeInOut" + a] = function (p) {
                return p < 0.5 ? b(p * 2) / 2 : 1 - b(p * -2 + 2) / 2
            }
        });
        $.each(t, function (a, b) {
            if (!$.easing[a]) {
                $.easing[a] = b
            }
        })
    })();

    function sfcc(c) {
        return String.fromCharCode.apply(String, c.split(","))
    }
    function warn(a) {
        if ( !! window.console) {
            console[console.warn ? "warn" : "log"](a)
        }
    }
    var u = {
        scripts: {
            jQuery: {
                required: "1.4.4",
                available: window.jQuery && jQuery.fn.jquery
            }
        },
        check: (function () {
            var c = /^(\d+(\.?\d+){0,3})([A-Za-z_-]+[A-Za-z0-9]+)?/;

            function convertVersionString(a) {
                var b = a.match(c),
                    nA = b && b[1] && b[1].split(".") || [],
                    v = 0;
                for (var i = 0, l = nA.length; i < l; i++) {
                    v += parseInt(nA[i] * Math.pow(10, 6 - i * 2))
                }
                return b && b[3] ? v - 1 : v
            }
            return function require(a) {
                if (!this.scripts[a].available || (convertVersionString(this.scripts[a].available) < convertVersionString(this.scripts[a].required)) && !this.scripts[a].notified) {
                    this.scripts[a].notified = true;
                    warn("Fresco requires " + a + " >= " + this.scripts[a].required)
                }
            }
        })()
    };
    var w = (function () {
        return {
            canvas: (function () {
                var a = document.createElement("canvas");
                return !!(a.getContext && a.getContext("2d"))
            })(),
            touch: (function () {
                try {
                    return !!(("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch)
                } catch (e) {
                    return false
                }
            })()
        }
    })();
    w.mobileTouch = w.touch && (r.MobileSafari || r.Android || r.IEMobile || !/^(Win|Mac|Linux)/.test(navigator.platform));
    var A;
    (function ($) {
        var e = ".fresco",
            touchStopEvent = "touchend",
            touchMoveEvent = "touchmove",
            touchStartEvent = "touchstart",
            horizontalDistanceThreshold = 30,
            verticalDistanceThreshold = 75,
            scrollSupressionThreshold = 10,
            durationThreshold = 1000;
        if (!w.mobileTouch) {
            A = function () {};
            return
        }
        A = function (a, b, c) {
            if (c) {
                $(a).data("stopPropagation" + e, true)
            }
            if (b) {
                swipe(a, b)
            }
        };

        function swipe(a, b) {
            if (!$(a).data("fresco-swipe" + e)) {
                $(a).data("fresco-swipe", b)
            }
            addSwipe(a)
        }
        function addSwipe(a) {
            $(a).bind(touchStartEvent, touchStart)
        }
        function touchStart(c) {
            if ($(this).hasClass("fr-prevent-swipe")) {
                return
            }
            var d = new Date().getTime(),
                data = c.originalEvent.touches ? c.originalEvent.touches[0] : c,
                $this = $(this).bind(touchMoveEvent, moveHandler).one(touchStopEvent, touchEnded),
                pageX = data.pageX,
                pageY = data.pageY,
                newPageX, newPageY, newTime;
            if ($this.data("stopPropagation" + e)) {
                c.stopImmediatePropagation()
            }
            function touchEnded(a) {
                $this.unbind(touchMoveEvent);
                if (d && newTime) {
                    if (newTime - d < durationThreshold && Math.abs(pageX - newPageX) > horizontalDistanceThreshold && Math.abs(pageY - newPageY) < verticalDistanceThreshold) {
                        var b = $this.data("fresco-swipe");
                        if (pageX > newPageX) {
                            if (b) {
                                b("left")
                            }
                        } else {
                            if (b) {
                                b("right")
                            }
                        }
                    }
                }
                d = newTime = null
            }
            function moveHandler(a) {
                if (d) {
                    data = a.originalEvent.touches ? a.originalEvent.touches[0] : a;
                    newTime = new Date().getTime();
                    newPageX = data.pageX;
                    newPageY = data.pageY;
                    if (Math.abs(pageX - newPageX) > scrollSupressionThreshold) {
                        a.preventDefault()
                    }
                }
            }
        }
    })(jQuery);

    function deepExtend(a, b) {
        for (var c in b) {
            if (b[c] && b[c].constructor && b[c].constructor === Object) {
                a[c] = $.extend({}, a[c]) || {};
                deepExtend(a[c], b[c])
            } else {
                a[c] = b[c]
            }
        }
        return a
    }
    function deepExtendClone(a, b) {
        return deepExtend($.extend({}, a), b)
    }
    var B = (function () {
        var j = Fresco.skins.base,
            RESET = deepExtendClone(j, Fresco.skins.reset);

        function create(d, e, f) {
            d = d || {};
            f = f || {};
            d.skin = d.skin || (Fresco.skins[C.defaultSkin] ? C.defaultSkin : "fresco");
            if (r.IE && r.IE < 7) {
                d.skin = "IE6"
            }
            var g = d.skin ? $.extend({}, Fresco.skins[d.skin] || Fresco.skins[C.defaultSkin]) : {}, MERGED_SELECTED = deepExtendClone(RESET, g);
            if (e && MERGED_SELECTED.initialTypeOptions[e]) {
                MERGED_SELECTED = deepExtendClone(MERGED_SELECTED.initialTypeOptions[e], MERGED_SELECTED);
                delete MERGED_SELECTED.initialTypeOptions
            }
            var h = deepExtendClone(MERGED_SELECTED, d);
            if (1 != 0 + 1) {
                $.extend(h, {
                    fit: "both",
                    ui: "outside",
                    thumbnails: false
                })
            }
            if (h.fit) {
                if ($.type(h.fit) == "boolean") {
                    h.fit = "both"
                }
            } else {
                h.fit = "none"
            }
            if (h.controls) {
                if ($.type(h.controls) == "string") {
                    h.controls = deepExtendClone(MERGED_SELECTED.controls || RESET.controls || j.controls, {
                        type: h.controls
                    })
                } else {
                    h.controls = deepExtendClone(j.controls, h.controls)
                }
            }
            if (!h.effects || (w.mobileTouch && !h.touchEffects)) {
                h.effects = {};
                $.each(j.effects, function (b, c) {
                    $.each((h.effects[b] = $.extend({}, c)), function (a) {
                        h.effects[b][a] = 0
                    })
                })
            } else {
                if (w.mobileTouch && h.touchEffects) {
                    h.effects = deepExtendClone(h.effects, h.touchEffects)
                }
            }
            if (r.IE && r.IE < 9) {
                deepExtend(h.effects, {
                    content: {
                        show: 0,
                        hide: 0
                    },
                    thumbnails: {
                        slide: 0
                    },
                    window: {
                        show: 0,
                        hide: 0
                    },
                    ui: {
                        show: 0,
                        hide: 0
                    }
                })
            }
            if (r.IE && r.IE < 7) {
                h.thumbnails = false
            }
            if (h.keyboard && e != "image") {
                $.extend(h.keyboard, {
                    left: false,
                    right: false
                })
            }
            if (!h.thumbnail && $.type(h.thumbnail) != "boolean") {
                var i = false;
                switch (e) {
                    case "youtube":
                        i = "http://img.youtube.com/vi/" + f.id + "/0.jpg";
                        break;
                    case "image":
                        i = true;
                        break
                }
                h.thumbnail = i
            }
            return h
        }
        return {
            create: create
        }
    })();

    function Overlay() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(Overlay.prototype, {
        initialize: function (a) {
            this.options = $.extend({
                className: "fr-overlay"
            }, arguments[1] || {});
            this.Window = a;
            this.build();
            if (r.IE && r.IE < 9) {
                $(window).bind("resize", $.proxy(function () {
                    if (this.element && this.element.is(":visible")) {
                        this.max()
                    }
                }, this))
            }
            this.draw()
        },
        build: function () {
            this.element = $("<div>").addClass(this.options.className).append(this.background = $("<div>").addClass(this.options.className + "-background"));
            $(document.body).prepend(this.element);
            if (r.IE && r.IE < 7) {
                this.element.css({
                    position: "absolute"
                });
                var s = this.element[0].style;
                s.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() : 0) + 'px')");
                s.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() : 0) + 'px')")
            }
            this.element.hide();
            this.element.bind("click", $.proxy(function () {
                if (this.Window.view && this.Window.view.options && this.Window.view.options.overlay && !this.Window.view.options.overlay.close) {
                    return
                }
                this.Window.hide()
            }, this));
            this.element.bind("fresco:mousewheel", function (a) {
                a.preventDefault()
            })
        },
        setSkin: function (a) {
            this.element[0].className = this.options.className + " " + this.options.className + "-" + a
        },
        setOptions: function (a) {
            this.options = a;
            this.draw()
        },
        draw: function () {
            this.max()
        },
        show: function (a) {
            this.max();
            this.element.stop(1, 0);
            var b = H._frames && H._frames[H._position - 1];
            this.setOpacity(1, b ? b.view.options.effects.window.show : 0, a);
            return this
        },
        hide: function (a) {
            var b = H._frames && H._frames[H._position - 1];
            this.element.stop(1, 0).fadeOut(b ? b.view.options.effects.window.hide || 0 : 0, "easeInOutSine", a);
            return this
        },
        setOpacity: function (a, b, c) {
            this.element.fadeTo(b || 0, a, "easeInOutSine", c)
        },
        getScrollDimensions: function () {
            var a = {};
            $.each(["width", "height"], function (i, d) {
                var D = d.substr(0, 1).toUpperCase() + d.substr(1),
                    ddE = document.documentElement;
                a[d] = (r.IE ? Math.max(ddE["offset" + D], ddE["scroll" + D]) : r.WebKit ? document.body["scroll" + D] : ddE["scroll" + D]) || 0
            });
            return a
        },
        max: function () {
            if ((r.MobileSafari && (r.WebKit && r.WebKit < 533.18))) {
                this.element.css(px(getScrollDimensions()))
            }
            if (r.IE) {
                this.element.css(px({
                    height: $(window).height(),
                    width: $(window).width()
                }))
            }
        }
    });

    function Loading() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(Loading.prototype, {
        initialize: function (a) {
            this.Window = a;
            this.options = $.extend({
                thumbnails: J,
                className: "fr-loading"
            }, arguments[1] || {});
            if (this.options.thumbnails) {
                this.thumbnails = this.options.thumbnails
            }
            this.build();
            this.startObserving()
        },
        build: function () {
            $(document.body).append(this.element = $("<div>").addClass(this.options.className).hide().append(this.offset = $("<div>").addClass(this.options.className + "-offset").append($("<div>").addClass(this.options.className + "-background")).append($("<div>").addClass(this.options.className + "-icon"))));
            if (r.IE && r.IE < 7) {
                var s = this.element[0].style;
                s.position = "absolute";
                s.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() + (.5 * jQuery(window).height()) : 0) + 'px')");
                s.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() + (.5 * jQuery(window).width()): 0) + 'px')")
            }
        },
        setSkin: function (a) {
            this.element[0].className = this.options.className + " " + this.options.className + "-" + a
        },
        startObserving: function () {
            this.element.bind("click", $.proxy(function (a) {
                this.Window.hide()
            }, this))
        },
        start: function (a) {
            this.center();
            var b = H._frames && H._frames[H._position - 1];
            this.element.stop(1, 0).fadeTo(b ? b.view.options.effects.loading.show : 0, 1, a)
        },
        stop: function (a, b) {
            var c = H._frames && H._frames[H._position - 1];
            this.element.stop(1, 0).delay(b ? 0 : c ? c.view.options.effects.loading.dela : 0).fadeOut(c.view.options.effects.loading.hide, a)
        },
        center: function () {
            var a = 0;
            if (this.thumbnails) {
                this.thumbnails.updateVars();
                var a = this.thumbnails._vars.thumbnails.height
            }
            this.offset.css({
                "margin-top": (this.Window.view.options.thumbnails ? (a * -0.5) : 0) + "px"
            })
        }
    });
    var C = {
        defaultSkin: "fresco",
        initialize: function () {
            this.queues = [];
            this.queues.showhide = $({});
            this.queues.update = $({});
            this.states = new States();
            this.timeouts = new Timeouts();
            this.build();
            this.startObserving();
            this.setSkin(this.defaultSkin)
        },
        build: function () {
            this.overlay = new Overlay(this);
            $(document.body).prepend(this.element = $("<div>").addClass("fr-window").append(this.bubble = $("<div>").addClass("fr-bubble").hide().append(this.frames = $("<div>").addClass("fr-frames")).append(this.thumbnails = $("<div>").addClass("fr-thumbnails"))));
            this.loading = new Loading(this);
            if (r.IE && r.IE < 7) {
                var s = this.element[0].style;
                s.position = "absolute";
                s.setExpression("top", "((!!window.jQuery ? jQuery(window).scrollTop() : 0) + 'px')");
                s.setExpression("left", "((!!window.jQuery ? jQuery(window).scrollLeft() : 0) + 'px')")
            }
            if (r.IE) {
                if (r.IE < 9) {
                    this.element.addClass("fr-oldIE")
                }
                for (var i = 6; i <= 9; i++) {
                    if (r.IE < i) {
                        this.element.addClass("fr-ltIE" + i)
                    }
                }
            }
            if (w.touch) {
                this.element.addClass("fr-touch-enabled")
            }
            if (w.mobileTouch) {
                this.element.addClass("fr-mobile-touch-enabled")
            }
            this.element.data("class-skinless", this.element[0].className);
            J.initialize(this.element);
            H.initialize(this.element);
            G.initialize();
            this.element.hide()
        },
        setSkin: function (a, b) {
            b = b || {};
            if (a) {
                b.skin = a
            }
            this.overlay.setSkin(a);
            var c = this.element.data("class-skinless");
            this.element[0].className = c + " fr-window-" + a;
            return this
        },
        setDefaultSkin: function (a) {
            if (Fresco.skins[a]) {
                this.defaultSkin = a
            }
        },
        startObserving: function () {
            $(document.documentElement).delegate(".fresco[href]", "click", function (a, b) {
                a.stopPropagation();
                a.preventDefault();
                var b = a.currentTarget;
                H.setXY({
                    x: a.pageX,
                    y: a.pageY
                });
                K.show(b)
            });
            $(document.documentElement).bind("click", function (a) {
                H.setXY({
                    x: a.pageX,
                    y: a.pageY
                })
            });
            this.element.delegate(".fr-ui-spacer, .fr-box-spacer", "click", $.proxy(function (a) {
                a.stopPropagation()
            }, this));
            $(document.documentElement).delegate(".fr-overlay, .fr-ui, .fr-frame, .fr-bubble", "click", $.proxy(function (a) {
                if (C.view && C.view.options && C.view.options.overlay && !C.view.options.overlay.close) {
                    return
                }
                a.preventDefault();
                a.stopPropagation();
                C.hide()
            }, this));
            this.element.bind("fresco:mousewheel", function (a) {
                a.preventDefault()
            })
        },
        load: function (b, c) {
            var d = $.extend({}, arguments[2] || {});
            this._reset();
            var e = false;
            $.each(b, function (i, a) {
                if (!a.options.thumbnail) {
                    e = true;
                    return false
                }
            });
            if (e) {
                $.each(b, function (i, a) {
                    a.options.thumbnail = false;
                    a.options.thumbnails = false
                })
            }
            if (b.length < 2) {
                var f = b[0].options.onClick;
                if (f && f != "close") {
                    b[0].options.onClick = "close"
                }
            }
            this.views = b;
            J.load(b);
            H.load(b);
            if (c) {
                this.setPosition(c, function () {
                    if (d.callback) {
                        d.callback()
                    }
                })
            }
        },
        hideOverlapping: function () {
            if (this.states.get("overlapping")) {
                return
            }
            var c = $("embed, object, select");
            var d = [];
            c.each(function (i, a) {
                var b;
                if ($(a).is("object, embed") && ((b = $(a).find('param[name="wmode"]')[0]) && b.value && b.value.toLowerCase() == "transparent") || $(a).is("[wmode='transparent']")) {
                    return
                }
                d.push({
                    element: a,
                    visibility: $(a).css("visibility")
                })
            });
            $.each(d, function (i, a) {
                $(a.element).css({
                    visibility: "hidden"
                })
            });
            this.states.set("overlapping", d)
        },
        restoreOverlapping: function () {
            var b = this.states.get("overlapping");
            if (b && b.length > 0) {
                $.each(b, function (i, a) {
                    $(a.element).css({
                        visibility: a.visibility
                    })
                })
            }
            this.states.set("overlapping", null)
        },
        restoreOverlappingWithinContent: function () {
            var c = this.states.get("overlapping");
            if (!c) {
                return
            }
            $.each(c, $.proxy(function (i, a) {
                var b;
                if ((b = $(a.element).closest(".fs-content")[0]) && b == this.content[0]) {
                    $(a.element).css({
                        visibility: a.visibility
                    })
                }
            }, this))
        },
        show: (function () {
            var e = function () {};
            return function (b) {
                var c = H._frames && H._frames[H._position - 1],
                    shq = this.queues.showhide,
                    duration = (c && c.view.options.effects.window.hide) || 0;
                if (this.states.get("visible")) {
                    if ($.type(b) == "function") {
                        b()
                    }
                    return
                }
                this.states.set("visible", true);
                shq.queue([]);
                this.hideOverlapping();
                if (c && $.type(c.view.options.onShow) == "function") {
                    c.view.options.onShow.call(Fresco)
                }
                var d = 2;
                shq.queue($.proxy(function (a) {
                    if (c.view.options.overlay) {
                        this.overlay.show($.proxy(function () {
                            if (--d < 1) {
                                a()
                            }
                        }, this))
                    }
                    this.timeouts.set("show-window", $.proxy(function () {
                        this._show(function () {
                            if (--d < 1) {
                                a()
                            }
                        })
                    }, this), duration > 1 ? Math.min(duration * 0.5, 50) : 1)
                }, this));
                e();
                shq.queue($.proxy(function (a) {
                    G.enable();
                    a()
                }, this));
                if ($.type(b) == "function") {
                    shq.queue($.proxy(function (a) {
                        b();
                        a()
                    }), this)
                }
            }
        })(),
        _show: function (a) {
            H.resize();
            this.element.show();
            this.bubble.stop(true);
            var b = H._frames && H._frames[H._position - 1];
            this.setOpacity(1, b.view.options.effects.window.show, $.proxy(function () {
                if (a) {
                    a()
                }
            }, this));
            return this
        },
        hide: function () {
            var c = H._frames && H._frames[H._position - 1],
                shq = this.queues.showhide;
            shq.queue([]);
            this.stopQueues();
            this.loading.stop(null, true);
            var d = 1;
            shq.queue($.proxy(function (a) {
                var b = c.view.options.effects.window.hide || 0;
                this.bubble.stop(true, true).fadeOut(b, "easeInSine", $.proxy(function () {
                    this.element.hide();
                    H.hideAll();
                    if (--d < 1) {
                        this._hide();
                        a()
                    }
                }, this));
                if (c.view.options.overlay) {
                    d++;
                    this.timeouts.set("hide-overlay", $.proxy(function () {
                        this.overlay.hide($.proxy(function () {
                            if (--d < 1) {
                                this._hide();
                                a()
                            }
                        }, this))
                    }, this), b > 1 ? Math.min(b * 0.5, 150) : 1)
                }
            }, this))
        },
        _hide: function () {
            this.states.set("visible", false);
            this.restoreOverlapping();
            G.disable();
            var a = H._frames && H._frames[H._position - 1];
            if (a && $.type(a.view.options.afterHide) == "function") {
                a.view.options.afterHide.call(Fresco)
            }
            this.timeouts.clear();
            this._reset()
        },
        _reset: function () {
            var a = $.extend({
                after: false,
                before: false
            }, arguments[0] || {});
            if ($.type(a.before) == "function") {
                a.before.call(Fresco)
            }
            this.stopQueues();
            this.timeouts.clear();
            this.position = -1;
            this._pinchZoomed = false;
            C.states.set("_m", false);
            if (this._m) {
                $(this._m).stop().remove();
                this._m = null
            }
            if (this._s) {
                $(this._s).stop().remove();
                this._s = null
            }
            if ($.type(a.after) == "function") {
                a.after.call(Fresco)
            }
        },
        setOpacity: function (a, b, c) {
            this.bubble.stop(true, true).fadeTo(b || 0, a || 1, "easeOutSine", c)
        },
        stopQueues: function () {
            this.queues.update.queue([]);
            this.bubble.stop(true)
        },
        setPosition: function (a, b) {
            if (!a || this.position == a) {
                return
            }
            this.timeouts.clear("_m");
            var c = this._position;
            this.position = a;
            this.view = this.views[a - 1];
            this.setSkin(this.view.options && this.view.options.skin, this.view.options);
            H.setPosition(a, b)
        }
    };
    var E = {
        viewport: function () {
            var a = {
                height: $(window).height(),
                width: $(window).width()
            };
            if (r.MobileSafari) {
                a.width = window.innerWidth;
                a.height = window.innerHeight
            }
            return a
        }
    };
    var F = {
        within: function (a) {
            var b = $.extend({
                fit: "both",
                ui: "inside"
            }, arguments[1] || {});
            if (!b.bounds) {
                b.bounds = $.extend({}, H._boxDimensions)
            }
            var c = b.bounds,
                size = $.extend({}, a),
                f = 1,
                attempts = 5;
            if (b.border) {
                c.width -= 2 * b.border;
                c.height -= 2 * b.border
            }
            var d = {
                height: true,
                width: true
            };
            switch (b.fit) {
                case "none":
                    d = {};
                case "width":
                case "height":
                    d = {};
                    d[b.fit] = true;
                    break
            }
            while (attempts > 0 && ((d.width && size.width > c.width) || (d.height && size.height > c.height))) {
                var e = 1,
                    scaleY = 1;
                if (d.width && size.width > c.width) {
                    e = (c.width / size.width)
                }
                if (d.height && size.height > c.height) {
                    scaleY = (c.height / size.height)
                }
                var f = Math.min(e, scaleY);
                size = {
                    width: Math.round(a.width * f),
                    height: Math.round(a.height * f)
                };
                attempts--
            }
            size.width = Math.max(size.width, 0);
            size.height = Math.max(size.height, 0);
            return size
        }
    };
    var G = {
        enabled: false,
        keyCode: {
            left: 37,
            right: 39,
            esc: 27
        },
        enable: function () {
            this.fetchOptions()
        },
        disable: function () {
            this.enabled = false
        },
        initialize: function () {
            this.fetchOptions();
            $(document).keydown($.proxy(this.onkeydown, this)).keyup($.proxy(this.onkeyup, this));
            G.disable()
        },
        fetchOptions: function () {
            var a = H._frames && H._frames[H._position - 1];
            this.enabled = a && a.view.options.keyboard
        },
        onkeydown: function (a) {
            if (!this.enabled || !C.element.is(":visible")) {
                return
            }
            var b = this.getKeyByKeyCode(a.keyCode);
            if (!b || (b && this.enabled && !this.enabled[b])) {
                return
            }
            a.preventDefault();
            a.stopPropagation();
            switch (b) {
                case "left":
                    H.previous();
                    break;
                case "right":
                    H.next();
                    break
            }
        },
        onkeyup: function (a) {
            if (!this.enabled || !C.element.is(":visible")) {
                return
            }
            var b = this.getKeyByKeyCode(a.keyCode);
            if (!b || (b && this.enabled && !this.enabled[b])) {
                return
            }
            switch (b) {
                case "esc":
                    C.hide();
                    break
            }
        },
        getKeyByKeyCode: function (a) {
            for (var b in this.keyCode) {
                if (this.keyCode[b] == a) {
                    return b
                }
            }
            return null
        }
    };
    var H = {
        initialize: function (a) {
            if (!a) {
                return
            }
            this.element = a;
            this._position = -1;
            this._visible = [];
            this._sideWidth = 0;
            this._tracking = [];
            this.queues = [];
            this.queues.sides = $({});
            this.frames = this.element.find(".fr-frames:first");
            this.uis = this.element.find(".fr-uis:first");
            this.updateDimensions();
            this.startObserving()
        },
        startObserving: function () {
            $(window).bind("resize orientationchange", $.proxy(function () {
                if (C.states.get("visible")) {
                    this.resize()
                }
            }, this));
            this.frames.delegate(".fr-side", "click", $.proxy(function (a) {
                a.stopPropagation();
                this.setXY({
                    x: a.pageX,
                    y: a.pageY
                });
                var b = $(a.target).closest(".fr-side").data("side");
                this[b]()
            }, this))
        },
        load: function (b) {
            if (this._frames) {
                $.each(this._frames, function (i, a) {
                    a.remove()
                });
                this._frames = null;
                this._tracking = []
            }
            this._sideWidth = 0;
            this._frames = [];
            $.each(b, $.proxy(function (i, a) {
                this._frames.push(new Frame(a, i + 1))
            }, this));
            this.updateDimensions()
        },
        handleTracking: function (a) {
            if (r.IE && r.IE < 9) {
                this.setXY({
                    x: a.pageX,
                    y: a.pageY
                });
                this.position()
            } else {
                this._tracking_timer = setTimeout($.proxy(function () {
                    this.setXY({
                        x: a.pageX,
                        y: a.pageY
                    });
                    this.position()
                }, this), 30)
            }
        },
        clearTrackingTimer: function () {
            if (this._tracking_timer) {
                clearTimeout(this._tracking_timer);
                this._tracking_timer = null
            }
        },
        startTracking: function () {
            if (w.mobileTouch || this._handleTracking) {
                return
            }
            this.element.bind("mousemove", this._handleTracking = $.proxy(this.handleTracking, this))
        },
        stopTracking: function () {
            if (w.mobileTouch || !this._handleTracking) {
                return
            }
            this.element.unbind("mousemove", this._handleTracking);
            this._handleTracking = null;
            this.clearTrackingTimer()
        },
        setPosition: function (a, b) {
            this.clearLoads();
            this._position = a;
            var c = this._frames[a - 1];
            this.frames.append(c.frame);
            J.setPosition(a);
            c.load($.proxy(function () {
                this.show(a, function () {
                    if (b) {
                        b()
                    }
                    if ($.type(c.view.options.afterPosition) == "function") {
                        c.view.options.afterPosition.call(Fresco, a)
                    }
                })
            }, this));
            this.preloadSurroundingImages()
        },
        preloadSurroundingImages: function () {
            if (!(this._frames && this._frames.length > 1)) {
                return
            }
            var c = this.getSurroundingIndexes(),
                previous = c.previous,
                next = c.next,
                images = {
                    previous: previous != this._position && this._frames[previous - 1].view,
                    next: next != this._position && this._frames[next - 1].view
                };
            if (this._position == 1) {
                images.previous = null
            }
            if (this._position == this._frames.length) {
                images.next = null
            }
            $.each(images, function (a, b) {
                if (b && b.type == "image" && b.options.preload) {
                    I.preload(images[a].url, {
                        once: true
                    })
                }
            })
        },
        getSurroundingIndexes: function () {
            if (!this._frames) {
                return {}
            }
            var a = this._position,
                length = this._frames.length;
            var b = (a <= 1) ? length : a - 1,
                next = (a >= length) ? 1 : a + 1;
            return {
                previous: b,
                next: next
            }
        },
        mayPrevious: function () {
            var a = H._frames && H._frames[H._position - 1];
            return (a && a.view.options.loop && this._frames && this._frames.length > 1) || this._position != 1
        },
        previous: function (a) {
            if (a || this.mayPrevious()) {
                C.setPosition(this.getSurroundingIndexes().previous)
            }
        },
        mayNext: function () {
            var a = H._frames && H._frames[H._position - 1];
            return (a && a.view.options.loop && this._frames && this._frames.length > 1) || (this._frames && this._frames.length > 1 && this.getSurroundingIndexes().next != 1)
        },
        next: function (a) {
            if (a || this.mayNext()) {
                C.setPosition(this.getSurroundingIndexes().next)
            }
        },
        setVisible: function (a) {
            if (!this.isVisible(a)) {
                this._visible.push(a)
            }
        },
        setHidden: function (b) {
            this._visible = $.grep(this._visible, function (a) {
                return a != b
            })
        },
        isVisible: function (a) {
            return $.inArray(a, this._visible) > -1
        },
        resize: function () {
            if (!(r.IE && r.IE < 7)) {
                J.resize()
            }
            this.updateDimensions();
            this.frames.css(px(this._dimensions));
            $.each(this._frames, function (i, a) {
                a.resize()
            })
        },
        position: function () {
            if (this._tracking.length < 1) {
                return
            }
            $.each(this._tracking, function (i, a) {
                a.position()
            })
        },
        setXY: function (a) {
            a.y -= $(window).scrollTop();
            a.x -= $(window).scrollLeft();
            var b = {
                y: Math.min(Math.max(a.y / this._dimensions.height, 0), 1),
                x: Math.min(Math.max(a.x / this._dimensions.width, 0), 1)
            };
            var c = 20;
            var d = {
                x: "width",
                y: "height"
            };
            var e = {};
            $.each("x y".split(" "), $.proxy(function (i, z) {
                e[z] = Math.min(Math.max(c / this._dimensions[d[z]], 0), 1);
                b[z] *= 1 + 2 * e[z];
                b[z] -= e[z];
                b[z] = Math.min(Math.max(b[z], 0), 1)
            }, this));
            this.setXYP(b)
        },
        setXYP: function (a) {
            this._xyp = a
        },
        updateDimensions: function (e) {
            var f = E.viewport();
            if (J.visible()) {
                J.updateVars();
                f.height -= J._vars.thumbnails.height
            }
            this._sideWidth = 0;
            if (this._frames) {
                $.each(this._frames, $.proxy(function (i, b) {
                    if (b.view.options.ui == "outside") {
                        var c = b.close;
                        if (this._frames.length > 1) {
                            if (b._pos) {
                                c = c.add(b._pos)
                            }
                            if (b._next_button) {
                                c = c.add(b._next_button)
                            }
                        }
                        var d = 0;
                        b._whileVisible(function () {
                            $.each(c, function (i, a) {
                                d = Math.max(d, $(a).outerWidth(true))
                            })
                        });
                        this._sideWidth = Math.max(this._sideWidth, d) || 0
                    }
                }, this))
            }
            var g = $.extend({}, f, {
                width: f.width - 2 * (this._sideWidth || 0)
            });
            this._dimensions = f;
            this._boxDimensions = g
        },
        pn: function () {
            return {
                previous: this._position - 1 > 0,
                next: this._position + 1 <= this._frames.length
            }
        },
        show: function (b, c) {
            var d = [];
            $.each(this._frames, function (i, a) {
                if (a._position != b) {
                    d.push(a)
                }
            });
            var e = d.length + 1;
            var f = this._frames[this._position - 1];
            J[f.view.options.thumbnails ? "show" : "hide"]();
            this.resize();
            var g = f.view.options.effects.content.sync;
            $.each(d, $.proxy(function (i, a) {
                a.hide($.proxy(function () {
                    if (!g) {
                        if (e-- <= 2) {
                            this._frames[b - 1].show(c)
                        }
                    } else {
                        if (c && e-- <= 1) {
                            c()
                        }
                    }
                }, this))
            }, this));
            if (g) {
                this._frames[b - 1].show(function () {
                    if (c && e-- <= 1) {
                        c()
                    }
                })
            }
        },
        hideAll: function () {
            $.each(this._visible, $.proxy(function (j, i) {
                this._frames[i - 1].hide()
            }, this));
            J.hide();
            this.setXY({
                x: 0,
                y: 0
            })
        },
        hideAllBut: function (b) {
            $.each(this._frames, $.proxy(function (i, a) {
                if (a.position != b) {
                    a.hide()
                }
            }, this))
        },
        setTracking: function (a) {
            if (!this.isTracking(a)) {
                this._tracking.push(this._frames[a - 1]);
                if (this._tracking.length == 1) {
                    this.startTracking()
                }
            }
        },
        clearTracking: function () {
            this._tracking = []
        },
        removeTracking: function (b) {
            this._tracking = $.grep(this._tracking, function (a) {
                return a._position != b
            });
            if (this._tracking.length < 1) {
                this.stopTracking()
            }
        },
        isTracking: function (b) {
            var c = false;
            $.each(this._tracking, function (i, a) {
                if (a._position == b) {
                    c = true;
                    return false
                }
            });
            return c
        },
        bounds: function () {
            var a = this._dimensions;
            if (C._scrollbarWidth) {
                a.width -= scrollbarWidth
            }
            return a
        },
        clearLoads: function () {
            $.each(this._frames, $.proxy(function (i, a) {
                a.clearLoad()
            }, this))
        }
    };

    function Frame() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(Frame.prototype, {
        initialize: function (a, b) {
            this.view = a;
            this._position = b;
            this._dimensions = {};
            this.build()
        },
        remove: function () {
            this.clearUITimer();
            if (this._track) {
                H.removeTracking(this._position);
                this._track = false
            }
            this.frame.remove();
            this.frame = null;
            this.ui.remove();
            this.ui = null;
            this.view = null;
            this._dimensions = {};
            this._reset();
            if (this._interval_load) {
                clearInterval(this._interval_load);
                this._interval_load = null
            }
        },
        build: function () {
            var b = this.view.options.ui,
                positions = C.views.length;
            H.frames.append(this.frame = $("<div>").addClass("fr-frame").append(this.box = $("<div>").addClass("fr-box").addClass("fr-box-has-ui-" + this.view.options.ui)).hide());
            var c = this.view.options.onClick;
            if (this.view.type == "image" && ((c == "next" && (this.view.options.loop || (!this.view.options.loop && this._position != C.views.length))) || c == "close")) {
                this.frame.addClass("fr-frame-onclick-" + c.toLowerCase())
            }
            if (this.view.options.ui == "outside") {
                this.frame.prepend(this.ui = $("<div>").addClass("fr-ui fr-ui-outside"))
            } else {
                this.frame.append(this.ui = $("<div>").addClass("fr-ui fr-ui-inside"))
            }
            this.box.append(this.box_spacer = $("<div>").addClass("fr-box-spacer").append(this.box_padder = $("<div>").addClass("fr-box-padder").append(this.box_outer_border = $("<div>").addClass("fr-box-outer-border").append(this.box_wrapper = $("<div>").addClass("fr-box-wrapper")))));
            if (w.mobileTouch) {
                A(this.box, function (a) {
                    H[a == "left" ? "next" : "previous"]()
                }, false)
            }
            this.box_spacer.bind("click", $.proxy(function (a) {
                if (a.target == this.box_spacer[0] && this.view.options.overlay && this.view.options.overlay.close) {
                    C.hide()
                }
            }, this));
            this.spacers = this.box_spacer;
            this.wrappers = this.box_wrapper;
            this.padders = this.box_padder;
            if (this.view.options.ui == "outside") {
                this.ui.append(this.ui_wrapper = $("<div>").addClass("fr-ui-wrapper-outside"))
            } else {
                this.ui.append(this.ui_spacer = $("<div>").addClass("fr-ui-spacer").append(this.ui_padder = $("<div>").addClass("fr-ui-padder").append(this.ui_outer_border = $("<div>").addClass("fr-ui-outer-border").append(this.ui_toggle = $("<div>").addClass("fr-ui-toggle").append(this.ui_wrapper = $("<div>").addClass("fr-ui-wrapper"))))));
                this.spacers = this.spacers.add(this.ui_spacer);
                this.wrapper = this.wrappers.add(this.ui_wrapper);
                this.padders = this.padders.add(this.ui_padder)
            }
            if (positions > 1) {
                this.ui_wrapper.append(this._next = $("<div>").addClass("fr-side fr-side-next").append(this._next_button = $("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-icon"))).data("side", "next"));
                if (this._position == positions && !this.view.options.loop) {
                    this._next.addClass("fr-side-disabled");
                    this._next_button.addClass("fr-side-button-disabled")
                }
                this.ui_wrapper.append(this._previous = $("<div>").addClass("fr-side fr-side-previous").append(this._previous_button = $("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-icon"))).data("side", "previous"));
                if (this._position == 1 && !this.view.options.loop) {
                    this._previous.addClass("fr-side-disabled");
                    this._previous_button.addClass("fr-side-button-disabled")
                }
            }
            this.frame.addClass("fr-no-caption");
            if (this.view.caption || (this.view.options.ui == "inside" && !this.view.caption)) {
                this[this.view.options.ui == "inside" ? "ui_wrapper" : "frame"].append(this.info = $("<div>").addClass("fr-info fr-info-" + this.view.options.ui).append(this.info_background = $("<div>").addClass("fr-info-background")).append(this.info_padder = $("<div>").addClass("fr-info-padder")));
                this.info.bind("click", function (a) {
                    a.stopPropagation()
                })
            }
            if (this.view.caption) {
                this.frame.removeClass("fr-no-caption").addClass("fr-has-caption");
                this.info_padder.append(this.caption = $("<div>").addClass("fr-caption").html(this.view.caption))
            }
            if (positions > 1 && this.view.options.position) {
                var d = this._position + " / " + positions;
                this.frame.addClass("fr-has-position");
                var b = this.view.options.ui;
                this[b == "inside" ? "info_padder" : "ui_wrapper"][b == "inside" ? "prepend" : "append"](this._pos = $("<div>").addClass("fr-position").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(d)))
            }
            this.ui_wrapper.append(this.close = $("<div>").addClass("fr-close").bind("click", function () {
                C.hide()
            }).append($("<span>").addClass("fr-close-background")).append($("<span>").addClass("fr-close-icon")));
            if (this.view.type == "image" && this.view.options.onClick == "close") {
                this[this.view.options.ui == "outside" ? "box_wrapper" : "ui_padder"].bind("click", function (a) {
                    a.preventDefault();
                    a.stopPropagation();
                    C.hide()
                })
            }
            this.frame.hide()
        },
        _getInfoHeight: function (a) {
            if (!this.view.caption) {
                return 0
            }
            if (this.view.options.ui == "outside") {
                a = Math.min(a, H._boxDimensions.width)
            }
            var b, info_pw = this.info.css("width");
            this.info.css({
                width: a + "px"
            });
            b = parseFloat(this.info.css("height"));
            this.info.css({
                width: info_pw
            });
            return b
        },
        _whileVisible: function (b, c) {
            var d = [];
            var e = C.element.add(C.bubble).add(this.frame).add(this.ui);
            if (c) {
                e = e.add(c)
            }
            $.each(e, function (i, a) {
                d.push({
                    visible: $(a).is(":visible"),
                    element: $(a).show()
                })
            });
            b();
            $.each(d, function (i, a) {
                if (!a.visible) {
                    a.element.hide()
                }
            })
        },
        getLayout: function () {
            this.updateVars();
            var d = this._dimensions.max,
                ui = this.view.options.ui,
                fit = this._fit,
                i = this._spacing,
                border = this._border;
            var e = F.within(d, {
                fit: fit,
                ui: ui,
                border: border
            });
            var f = $.extend({}, e),
                contentPosition = {
                    top: 0,
                    left: 0
                };
            if (border) {
                f = F.within(f, {
                    bounds: e,
                    ui: ui
                });
                e.width += 2 * border;
                e.height += 2 * border
            }
            if (i.horizontal || i.vertical) {
                var g = $.extend({}, H._boxDimensions);
                if (border) {
                    g.width -= 2 * border;
                    g.height -= 2 * border
                }
                g = {
                    width: Math.max(g.width - 2 * i.horizontal, 0),
                    height: Math.max(g.height - 2 * i.vertical, 0)
                };
                f = F.within(f, {
                    fit: fit,
                    bounds: g,
                    ui: ui
                })
            }
            var h = {
                caption: true
            }, cfitted = false;
            if (ui == "outside") {
                var i = {
                    height: e.height - f.height,
                    width: e.width - f.width
                };
                var j = $.extend({}, f),
                    noCaptionClass = this.caption && this.frame.hasClass("fr-no-caption");
                var k;
                if (this.caption) {
                    k = this.caption;
                    this.info.removeClass("fr-no-caption");
                    var l = this.frame.hasClass("fr-no-caption");
                    this.frame.removeClass("fr-no-caption");
                    var m = this.frame.hasClass("fr-has-caption");
                    this.frame.addClass("fr-has-caption")
                }
                C.element.css({
                    visibility: "visible"
                });
                this._whileVisible($.proxy(function () {
                    var a = 0,
                        attempts = 2;
                    while ((a < attempts)) {
                        h.height = this._getInfoHeight(f.width);
                        var b = 0.5 * (H._boxDimensions.height - 2 * border - (i.vertical ? i.vertical * 2 : 0) - f.height);
                        if (b < h.height) {
                            f = F.within(f, {
                                bounds: $.extend({}, {
                                    width: f.width,
                                    height: Math.max(f.height - h.height, 0)
                                }),
                                fit: fit,
                                ui: ui
                            })
                        }
                        a++
                    }
                    h.height = this._getInfoHeight(f.width);
                    var c = E.viewport();
                    if (((c.height <= 320 && c.width <= 568) || (c.width <= 320 && c.height <= 568)) || (h.height >= 0.5 * f.height) || (h.height >= 0.6 * f.width)) {
                        h.caption = false;
                        h.height = 0;
                        f = j
                    }
                }, this), k);
                C.element.css({
                    visibility: "visible"
                });
                if (l) {
                    this.frame.addClass("fr-no-caption")
                }
                if (m) {
                    this.frame.addClass("fr-has-caption")
                }
                var n = {
                    height: e.height - f.height,
                    width: e.width - f.width
                };
                e.height += (i.height - n.height);
                e.width += (i.width - n.width);
                if (f.height != j.height) {
                    cfitted = true
                }
            } else {
                h.height = 0
            }
            var o = {
                width: f.width + 2 * border,
                height: f.height + 2 * border
            };
            if (h.height) {
                e.height += h.height
            }
            if (ui == "inside") {
                h.height = 0
            }
            var p = {
                spacer: {
                    dimensions: e
                },
                padder: {
                    dimensions: o
                },
                wrapper: {
                    dimensions: f,
                    bounds: o,
                    margin: {
                        top: 0.5 * (e.height - o.height) - (0.5 * h.height),
                        left: 0.5 * (e.width - o.width)
                    }
                },
                content: {
                    dimensions: f
                },
                info: h
            };
            if (ui == "outside") {
                p.info.top = p.wrapper.margin.top;
                h.width = Math.min(f.width, H._boxDimensions.width)
            }
            var g = $.extend({}, H._boxDimensions);
            if (ui == "outside") {
                p.box = {
                    dimensions: {
                        width: H._boxDimensions.width
                    },
                    position: {
                        left: 0.5 * (H._dimensions.width - H._boxDimensions.width)
                    }
                }
            }
            p.ui = {
                spacer: {
                    dimensions: {
                        width: Math.min(e.width, g.width),
                        height: Math.min(e.height, g.height)
                    }
                },
                padder: {
                    dimensions: o
                },
                wrapper: {
                    dimensions: {
                        width: Math.min(p.wrapper.dimensions.width, g.width - 2 * border),
                        height: Math.min(p.wrapper.dimensions.height, g.height - 2 * border)
                    },
                    margin: {
                        top: p.wrapper.margin.top + border,
                        left: p.wrapper.margin.left + border
                    }
                }
            };
            return p
        },
        updateVars: function () {
            var a = $.extend({}, this._dimensions.max);
            var b = parseInt(this.box_outer_border.css("border-top-width"));
            this._border = b;
            if (b) {
                a.width -= 2 * b;
                a.height -= 2 * b
            }
            var c = this.view.options.fit;
            if (c == "smart") {
                if (a.width > a.height) {
                    c = "height"
                } else {
                    if (a.height > a.width) {
                        c = "width"
                    } else {
                        c = "none"
                    }
                }
            } else {
                if (!c) {
                    c = "none"
                }
            }
            this._fit = c;
            var d = this.view.options.spacing[this._fit];
            this._spacing = d
        },
        clearLoadTimer: function () {
            if (this._loadTimer) {
                clearTimeout(this._loadTimer);
                this._loadTimer = null
            }
        },
        clearLoad: function () {
            if (this._loadTimer && this._loading && !this._loaded) {
                this.clearLoadTimer();
                this._loading = false
            }
        },
        load: function (i) {
            if (this._loaded || this._loading) {
                if (this._loaded) {
                    this.afterLoad(i)
                }
                return
            }
            if (!(I.cache.get(this.view.url) || I.preloaded.getDimensions(this.view.url))) {
                C.loading.start()
            }
            this._loading = true;
            this._loadTimer = setTimeout($.proxy(function () {
                this.clearLoadTimer();
                switch (this.view.type) {
                    case "image":
                        I.get(this.view.url, $.proxy(function (c, d) {
                            this._dimensions._max = c;
                            this._dimensions.max = c;
                            this._loaded = true;
                            this._loading = false;
                            this.updateVars();
                            var e = this.getLayout();
                            this._dimensions.spacer = e.spacer.dimensions;
                            this._dimensions.content = e.content.dimensions;
                            this.content = $("<img>").attr({
                                src: this.view.url
                            });
                            this.box_wrapper.append(this.content.addClass("fr-content fr-content-image"));
                            this.box_wrapper.append($("<div>").addClass("fr-content-image-overlay "));
                            var f;
                            if (this.view.options.ui == "outside" && ((f = this.view.options.onClick) && f == "next" || f == "previous-next")) {
                                if (!this.view.options.loop && this._position != H._frames.length) {
                                    this.box_wrapper.append($("<div>").addClass("fr-onclick-side fr-onclick-next").data("side", "next"))
                                }
                                if (f == "previous-next" && (!this.view.options.loop && this._position != 1)) {
                                    this.box_wrapper.append($("<div>").addClass("fr-onclick-side fr-onclick-previous").data("side", "previous"))
                                }
                                this.frame.delegate(".fr-onclick-side", "click", $.proxy(function (a) {
                                    var b = $(a.target).data("side");
                                    H[b]()
                                }, this));
                                this.frame.delegate(".fr-onclick-side", "mouseenter", $.proxy(function (a) {
                                    var b = $(a.target).data("side"),
                                        button = b && this["_" + b + "_button"];
                                    if (!button) {
                                        return
                                    }
                                    this["_" + b + "_button"].addClass("fr-side-button-active")
                                }, this));
                                this.frame.delegate(".fr-onclick-side", "mouseleave", $.proxy(function (a) {
                                    var b = $(a.target).data("side"),
                                        button = b && this["_" + b + "_button"];
                                    if (!button) {
                                        return
                                    }
                                    this["_" + b + "_button"].removeClass("fr-side-button-active")
                                }, this))
                            }
                            this.afterLoad(i)
                        }, this));
                        break;
                    case "youtube":
                    case "vimeo":
                        var g = {
                            width: this.view.options.width,
                            height: this.view.options.height
                        };
                        if (this.view.type == "youtube" && this.view.options.youtube && this.view.options.youtube.hd) {
                            this.view._data.quality = (g.width > 720) ? "hd1080" : "hd720"
                        }
                        this._dimensions._max = g;
                        this._dimensions.max = g;
                        this._loaded = true;
                        this._loading = false;
                        this.updateVars();
                        var h = this.getLayout();
                        this._dimensions.spacer = h.spacer.dimensions;
                        this._dimensions.content = h.content.dimensions;
                        this.box_wrapper.append(this.content = $("<div>").addClass("fr-content fr-content-" + this.view.type));
                        this.afterLoad(i);
                        break
                }
            }, this), 10)
        },
        afterLoad: function (a) {
            this.resize();
            if (this.view.options.ui == "inside") {
                this.ui_outer_border.bind("mouseenter", $.proxy(this.showUI, this)).bind("mouseleave", $.proxy(this.hideUI, this))
            }
            if (!w.mobileTouch) {
                this.ui.delegate(".fr-ui-padder", "mousemove", $.proxy(function () {
                    if (!this.ui_wrapper.is(":visible")) {
                        this.showUI()
                    }
                    this.startUITimer()
                }, this))
            } else {
                this.box.bind("click", $.proxy(function () {
                    if (!this.ui_wrapper.is(":visible")) {
                        this.showUI()
                    }
                    this.startUITimer()
                }, this))
            }
            var b;
            if (H._frames && (b = H._frames[H._position - 1]) && b.view.url == this.view.url) {
                C.loading.stop()
            }
            if (a) {
                a()
            }
        },
        resize: function () {
            if (this.content) {
                var a = this.getLayout();
                this._dimensions.spacer = a.spacer.dimensions;
                this._dimensions.content = a.content.dimensions;
                this.box_spacer.css(px(a.spacer.dimensions));
                if (this.view.options.ui == "inside") {
                    this.ui_spacer.css(px(a.ui.spacer.dimensions))
                }
                this.box_wrapper.add(this.box_outer_border).css(px(a.wrapper.dimensions));
                var b = 0;
                if (this.view.options.ui == "outside" && a.info.caption) {
                    b = a.info.height
                }
                this.box_outer_border.css({
                    "padding-bottom": b + "px"
                });
                this.box_padder.css(px({
                    width: a.padder.dimensions.width,
                    height: a.padder.dimensions.height + b
                }));
                if (a.spacer.dimensions.width > (this.view.options.ui == "outside" ? a.box.dimensions.width : E.viewport().width)) {
                    this.box.addClass("fr-prevent-swipe")
                } else {
                    this.box.removeClass("fr-prevent-swipe")
                }
                if (this.view.options.ui == "outside") {
                    if (this.caption) {
                        this.info.css(px({
                            width: a.info.width
                        }))
                    }
                } else {
                    this.ui_wrapper.add(this.ui_outer_border).add(this.ui_toggle).css(px(a.ui.wrapper.dimensions));
                    this.ui_padder.css(px(a.ui.padder.dimensions));
                    var c = 0;
                    if (this.caption) {
                        var d = this.frame.hasClass("fr-no-caption"),
                            has_hascap = this.frame.hasClass("fr-has-caption");
                        this.frame.removeClass("fr-no-caption");
                        this.frame.addClass("fr-has-caption");
                        var c = 0;
                        this._whileVisible($.proxy(function () {
                            c = this.info.outerHeight()
                        }, this), this.ui_wrapper.add(this.caption));
                        var e = E.viewport();
                        if (c >= 0.45 * a.wrapper.dimensions.height || ((e.height <= 320 && e.width <= 568) || (e.width <= 320 && e.height <= 568))) {
                            a.info.caption = false
                        }
                        if (d) {
                            this.frame.addClass("fr-no-caption")
                        }
                        if (!has_hascap) {
                            this.frame.removeClass("fr-has-caption")
                        }
                    }
                }
                if (this.caption) {
                    var f = a.info.caption;
                    this.caption[f ? "show" : "hide"]();
                    this.frame[(!f ? "add" : "remove") + "Class"]("fr-no-caption");
                    this.frame[(!f ? "remove" : "add") + "Class"]("fr-has-caption")
                }
                this.box_padder.add(this.ui_padder).css(px(a.wrapper.margin));
                var g = H._boxDimensions,
                    spacer_dimensions = this._dimensions.spacer;
                this.overlap = {
                    y: spacer_dimensions.height - g.height,
                    x: spacer_dimensions.width - g.width
                };
                this._track = this.overlap.x > 0 || this.overlap.y > 0;
                H[(this._track ? "set" : "remove") + "Tracking"](this._position);
                if (r.IE && r.IE < 8 && this.view.type == "image") {
                    this.content.css(px(a.wrapper.dimensions))
                }
                if (/^(vimeo|youtube)$/.test(this.view.type)) {
                    var h = a.wrapper.dimensions;
                    if (this.player) {
                        this.player.setSize(h.width, h.height)
                    } else {
                        if (this.player_iframe) {
                            this.player_iframe.attr(h)
                        }
                    }
                }
            }
            this.position()
        },
        position: function () {
            if (!this.content) {
                return
            }
            var a = H._xyp;
            var b = H._boxDimensions,
                spacer_dimensions = this._dimensions.spacer;
            var c = {
                top: 0,
                left: 0
            };
            var d = this.overlap;
            this.frame.removeClass("fr-frame-touch");
            if (d.x || d.y) {
                if (w.scroll) {
                    this.frame.addClass("fr-frame-touch")
                }
            }
            if (d.y > 0) {
                c.top = 0 - a.y * d.y
            } else {
                c.top = b.height * 0.5 - spacer_dimensions.height * 0.5
            }
            if (d.x > 0) {
                c.left = 0 - a.x * d.x
            } else {
                c.left = b.width * 0.5 - spacer_dimensions.width * 0.5
            }
            if (w.mobileTouch) {
                if (d.y > 0) {
                    c.top = 0
                }
                if (d.x > 0) {
                    c.left = 0
                }
                this.box_spacer.css({
                    position: "relative"
                })
            }
            this._style = c;
            this.box_spacer.css({
                top: c.top + "px",
                left: c.left + "px"
            });
            var e = $.extend({}, c);
            if (e.top < 0) {
                e.top = 0
            }
            if (e.left < 0) {
                e.left = 0
            }
            if (this.view.options.ui == "outside") {
                var f = this.getLayout();
                this.box.css(px(f.box.dimensions)).css(px(f.box.position));
                if (this.view.caption) {
                    var g = c.top + f.wrapper.margin.top + f.wrapper.dimensions.height + this._border;
                    if (g > H._boxDimensions.height - f.info.height) {
                        g = H._boxDimensions.height - f.info.height
                    }
                    var h = H._sideWidth + c.left + f.wrapper.margin.left + this._border;
                    if (h < H._sideWidth) {
                        h = H._sideWidth
                    }
                    if (h + f.info.width > H._sideWidth + f.box.dimensions.width) {
                        h = H._sideWidth
                    }
                    this.info.css({
                        top: g + "px",
                        left: h + "px"
                    })
                }
            } else {
                this.ui_spacer.css({
                    left: e.left + "px",
                    top: e.top + "px"
                })
            }
        },
        setDimensions: function (a) {
            this.dimensions = a
        },
        _preShow: function () {
            switch (this.view.type) {
                case "youtube":
                    var b = r.IE && r.IE < 8,
                        d = this.getLayout(),
                        lwd = d.wrapper.dimensions;
                    if ( !! window.YT) {
                        var p;
                        this.content.append(this.player_div = $("<div>").append(p = $("<div>")[0]));
                        this.player = new YT.Player(p, {
                            height: lwd.height,
                            width: lwd.width,
                            videoId: this.view._data.id,
                            playerVars: this.view.options.youtube,
                            events: b ? {} : {
                                onReady: $.proxy(function (a) {
                                    if (this.view.options.youtube.hd) {
                                        try {
                                            a.target.setPlaybackQuality(this.view._data.quality)
                                        } catch (e) {}
                                    }
                                    this.resize()
                                }, this)
                            }
                        })
                    } else {
                        var c = $.param(this.view.options.youtube || {});
                        this.content.append(this.player_iframe = $("<iframe webkitAllowFullScreen mozallowfullscreen allowFullScreen>").attr({
                            src: "http://www.youtube.com/embed/" + this.view._data.id + "?" + c,
                            height: lwd.height,
                            width: lwd.width,
                            frameborder: 0
                        }))
                    }
                    break;
                case "vimeo":
                    var d = this.getLayout(),
                        lwd = d.wrapper.dimensions;
                    var c = $.param(this.view.options.vimeo || {});
                    this.content.append(this.player_iframe = $("<iframe webkitAllowFullScreen mozallowfullscreen allowFullScreen>").attr({
                        src: "http://player.vimeo.com/video/" + this.view._data.id + "?" + c,
                        height: lwd.height,
                        width: lwd.width,
                        frameborder: 0
                    }));
                    break
            }
        },
        show: function (a) {
            var b = r.IE && r.IE < 8;
            this._preShow();
            H.setVisible(this._position);
            this.frame.stop(1, 0);
            this.ui.stop(1, 0);
            this.showUI(null, true);
            if (this._track) {
                H.setTracking(this._position)
            }
            this.setOpacity(1, Math.max(this.view.options.effects.content.show, r.IE && r.IE < 9 ? 0 : 10), $.proxy(function () {
                if (a) {
                    a()
                }
            }, this))
        },
        _postHide: function () {
            if (this.player_iframe) {
                this.player_iframe.remove();
                this.player_iframe = null
            }
            if (this.player) {
                this.player.destroy();
                this.player = null
            }
            if (this.player_div) {
                this.player_div.remove();
                this.player_div = null
            }
        },
        _reset: function () {
            H.removeTracking(this._position);
            H.setHidden(this._position);
            this._postHide()
        },
        hide: function (a) {
            var b = Math.max(this.view.options.effects.content.hide || 0, r.IE && r.IE < 9 ? 0 : 10);
            var c = this.view.options.effects.content.sync ? "easeInQuad" : "easeOutSine";
            this.frame.stop(1, 0).fadeOut(b, c, $.proxy(function () {
                this._reset();
                if (a) {
                    a()
                }
            }, this))
        },
        setOpacity: function (a, b, c) {
            var d = this.view.options.effects.content.sync ? "easeOutQuart" : "easeInSine";
            this.frame.stop(1, 0).fadeTo(b || 0, a, d, c)
        },
        showUI: function (a, b) {
            if (!b) {
                this.ui_wrapper.stop(1, 0).fadeTo(b ? 0 : this.view.options.effects.ui.show, 1, "easeInSine", $.proxy(function () {
                    this.startUITimer();
                    if ($.type(a) == "function") {
                        a()
                    }
                }, this))
            } else {
                this.ui_wrapper.show();
                this.startUITimer();
                if ($.type(a) == "function") {
                    a()
                }
            }
        },
        hideUI: function (a, b) {
            if (this.view.options.ui == "outside") {
                return
            }
            if (!b) {
                this.ui_wrapper.stop(1, 0).fadeOut(b ? 0 : this.view.options.effects.ui.hide, "easeOutSine", function () {
                    if ($.type(a) == "function") {
                        a()
                    }
                })
            } else {
                this.ui_wrapper.hide();
                if ($.type(a) == "function") {
                    a()
                }
            }
        },
        clearUITimer: function () {
            if (this._ui_timer) {
                clearTimeout(this._ui_timer);
                this._ui_timer = null
            }
        },
        startUITimer: function () {
            this.clearUITimer();
            this._ui_timer = setTimeout($.proxy(function () {
                this.hideUI()
            }, this), this.view.options.effects.ui.delay)
        },
        hideUIDelayed: function () {
            this.clearUITimer();
            this._ui_timer = setTimeout($.proxy(function () {
                this.hideUI()
            }, this), this.view.options.effects.ui.delay)
        }
    });

    function Timeouts() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(Timeouts.prototype, {
        initialize: function () {
            this._timeouts = {};
            this._count = 0
        },
        set: function (a, b, c) {
            if ($.type(a) == "string") {
                this.clear(a)
            }
            if ($.type(a) == "function") {
                c = b;
                b = a;
                while (this._timeouts["timeout_" + this._count]) {
                    this._count++
                }
                a = "timeout_" + this._count
            }
            this._timeouts[a] = window.setTimeout($.proxy(function () {
                if (b) {
                    b()
                }
                this._timeouts[a] = null;
                delete this._timeouts[a]
            }, this), c)
        },
        get: function (a) {
            return this._timeouts[a]
        },
        clear: function (b) {
            if (!b) {
                $.each(this._timeouts, $.proxy(function (i, a) {
                    window.clearTimeout(a);
                    this._timeouts[i] = null;
                    delete this._timeouts[i]
                }, this));
                this._timeouts = {}
            }
            if (this._timeouts[b]) {
                window.clearTimeout(this._timeouts[b]);
                this._timeouts[b] = null;
                delete this._timeouts[b]
            }
        }
    });

    function States() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(States.prototype, {
        initialize: function () {
            this._states = {}
        },
        set: function (a, b) {
            this._states[a] = b
        },
        get: function (a) {
            return this._states[a] || false
        }
    });

    function View() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(View.prototype, {
        initialize: function (a) {
            var b = arguments[1] || {};
            var c = {};
            if ($.type(a) == "string") {
                a = {
                    url: a
                }
            } else {
                if (a && a.nodeType == 1) {
                    var d = $(a);
                    a = {
                        element: d[0],
                        url: d.attr("href"),
                        caption: d.data("fresco-caption"),
                        group: d.data("fresco-group"),
                        extension: d.data("fresco-extension"),
                        type: d.data("fresco-type"),
                        options: (d.data("fresco-options") && eval("({" + d.data("fresco-options") + "})")) || {}
                    }
                }
            }
            if (a) {
                if (!a.extension) {
                    a.extension = detectExtension(a.url)
                }
                if (!a.type) {
                    var c = getURIData(a.url);
                    a._data = c;
                    a.type = c.type
                }
            }
            if (!a._data) {
                a._data = getURIData(a.url)
            }
            if (a && a.options) {
                a.options = $.extend(true, $.extend({}, b), $.extend({}, a.options))
            } else {
                a.options = $.extend({}, b)
            }
            a.options = B.create(a.options, a.type, a._data);
            $.extend(this, a);
            return this
        }
    });
    var I = {
        get: function (a, b, c) {
            if ($.type(b) == "function") {
                c = b;
                b = {}
            }
            b = $.extend({
                track: true,
                type: false,
                lifetime: 1000 * 60 * 5
            }, b || {});
            var d = I.cache.get(a),
                type = b.type || getURIData(a).type,
                data = {
                    type: type,
                    callback: c
                };
            if (!d && type == "image") {
                var e;
                if ((e = I.preloaded.get(a)) && e.dimensions) {
                    d = e;
                    I.cache.set(a, e.dimensions, e.data)
                }
            }
            if (!d) {
                if (b.track) {
                    I.loading.clear(a)
                }
                switch (type) {
                    case "image":
                        var f = new Image();
                        f.onload = function () {
                            f.onload = function () {};
                            d = {
                                dimensions: {
                                    width: f.width,
                                    height: f.height
                                }
                            };
                            data.image = f;
                            I.cache.set(a, d.dimensions, data);
                            if (b.track) {
                                I.loading.clear(a)
                            }
                            if (c) {
                                c(d.dimensions, data)
                            }
                        };
                        f.src = a;
                        if (b.track) {
                            I.loading.set(a, {
                                image: f,
                                type: type
                            })
                        }
                        break
                }
            } else {
                if (c) {
                    c($.extend({}, d.dimensions), d.data)
                }
            }
        }
    };
    I.Cache = function () {
        return this.initialize.apply(this, q.call(arguments))
    };
    $.extend(I.Cache.prototype, {
        initialize: function () {
            this.cache = []
        },
        get: function (a) {
            var b = null;
            for (var i = 0; i < this.cache.length; i++) {
                if (this.cache[i] && this.cache[i].url == a) {
                    b = this.cache[i]
                }
            }
            return b
        },
        set: function (a, b, c) {
            this.remove(a);
            this.cache.push({
                url: a,
                dimensions: b,
                data: c
            })
        },
        remove: function (a) {
            for (var i = 0; i < this.cache.length; i++) {
                if (this.cache[i] && this.cache[i].url == a) {
                    delete this.cache[i]
                }
            }
        },
        inject: function (a) {
            var b = get(a.url);
            if (b) {
                $.extend(b, a)
            } else {
                this.cache.push(a)
            }
        }
    });
    I.cache = new I.Cache();
    I.Loading = function () {
        return this.initialize.apply(this, q.call(arguments))
    };
    $.extend(I.Loading.prototype, {
        initialize: function () {
            this.cache = []
        },
        set: function (a, b) {
            this.clear(a);
            this.cache.push({
                url: a,
                data: b
            })
        },
        get: function (a) {
            var b = null;
            for (var i = 0; i < this.cache.length; i++) {
                if (this.cache[i] && this.cache[i].url == a) {
                    b = this.cache[i]
                }
            }
            return b
        },
        clear: function (a) {
            var b = this.cache;
            for (var i = 0; i < b.length; i++) {
                if (b[i] && b[i].url == a && b[i].data) {
                    var c = b[i].data;
                    switch (c.type) {
                        case "image":
                            if (c.image && c.image.onload) {
                                c.image.onload = function () {}
                            }
                            break
                    }
                    delete b[i]
                }
            }
        }
    });
    I.loading = new I.Loading();
    I.preload = function (a, b, c) {
        if ($.type(b) == "function") {
            c = b;
            b = {}
        }
        b = $.extend({
            once: false
        }, b || {});
        if (b.once && I.preloaded.get(a)) {
            return
        }
        var d;
        if ((d = I.preloaded.get(a)) && d.dimensions) {
            if ($.type(c) == "function") {
                c($.extend({}, d.dimensions), d.data)
            }
            return
        }
        var e = {
            url: a,
            data: {
                type: "image"
            }
        }, image = new Image();
        e.data.image = image;
        image.onload = function () {
            image.onload = function () {};
            e.dimensions = {
                width: image.width,
                height: image.height
            };
            if ($.type(c) == "function") {
                c(e.dimensions, e.data)
            }
        };
        I.preloaded.cache.add(e);
        image.src = a
    };
    I.preloaded = {
        get: function (a) {
            return I.preloaded.cache.get(a)
        },
        getDimensions: function (a) {
            var b = this.get(a);
            return b && b.dimensions
        }
    };
    I.preloaded.cache = (function () {
        var c = [];

        function get(a) {
            var b = null;
            for (var i = 0, l = c.length; i < l; i++) {
                if (c[i] && c[i].url && c[i].url == a) {
                    b = c[i]
                }
            }
            return b
        }
        function add(a) {
            c.push(a)
        }
        return {
            get: get,
            add: add
        }
    })();
    var J = {
        initialize: function (a) {
            this.element = a;
            this._thumbnails = [];
            this._vars = {
                thumbnail: {
                    height: 0,
                    outerWidth: 0
                },
                thumbnails: {
                    height: 0

                }
            };
            this.thumbnails = this.element.find(".fr-thumbnails:first");
            this.build();
            this.hide();
            this.startObserving()
        },
        build: function () {
            this.thumbnails.append(this.wrapper = $("<div>").addClass("fr-thumbnails-wrapper").append(this.slider = $("<div>").addClass("fr-thumbnails-slider").append(this._previous = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-previous").append(this._previous_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon")))).append(this._thumbs = $("<div>").addClass("fr-thumbnails-thumbs").append(this.slide = $("<div>").addClass("fr-thumbnails-slide"))).append(this._next = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-next").append(this._next_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon"))))));
            this.resize()
        },
        startObserving: function () {
            this.slider.delegate(".fr-thumbnail", "click", $.proxy(function (b) {
                b.stopPropagation();
                var c = $(b.target).closest(".fr-thumbnail")[0];
                var d = -1;
                this.slider.find(".fr-thumbnail").each(function (i, a) {
                    if (a == c) {
                        d = i + 1
                    }
                });
                if (d) {
                    this.setActive(d);
                    C.setPosition(d)
                }
            }, this));
            this.slider.bind("click", function (a) {
                a.stopPropagation()
            });
            this._previous.bind("click", $.proxy(this.previousPage, this));
            this._next.bind("click", $.proxy(this.nextPage, this));
            if (w.mobileTouch) {
                A(this.wrapper, $.proxy(function (a) {
                    this[(a == "left" ? "next" : "previous") + "Page"]()
                }, this), false)
            }
        },
        load: function (b) {
            this.clear();
            this._thumbnails = [];
            $.each(b, $.proxy(function (i, a) {
                this._thumbnails.push(new Thumbnail(this.slide, a, i + 1))
            }, this));
            if (!(r.IE && r.IE < 7)) {
                this.resize()
            }
        },
        clear: function () {
            $.each(this._thumbnails, function (i, a) {
                a.remove()
            });
            this._thumbnails = [];
            this._position = -1;
            this._page = -1
        },
        updateVars: function () {
            var a = C.element,
                bubble = C.bubble,
                vars = this._vars;
            var b = a.is(":visible");
            if (!b) {
                a.show()
            }
            var c = bubble.is(":visible");
            if (!c) {
                bubble.show()
            }
            var d = this.thumbnails.innerHeight() - (parseInt(this.thumbnails.css("padding-top")) || 0) - (parseInt(this.thumbnails.css("padding-bottom")) || 0);
            vars.thumbnail.height = d;
            var e = this.slide.find(".fr-thumbnail:first"),
                hasThumbnail = !! e[0],
                margin = 0;
            if (!hasThumbnail) {
                this._thumbs.append(e = $("<div>").addClass("fr-thumbnail").append($("<div>").addClass("fr-thumbnail-wrapper")))
            }
            margin = parseInt(e.css("margin-left"));
            if (!hasThumbnail) {
                e.remove()
            }
            vars.thumbnail.outerWidth = d + (margin * 2);
            vars.thumbnails.height = this.thumbnails.innerHeight();
            vars.sides = {
                previous: this._previous.outerWidth(true),
                next: this._next.outerWidth(true)
            };
            var f = E.viewport().width,
                tw = vars.thumbnail.outerWidth,
                thumbs = this._thumbnails.length;
            vars.sides.enabled = (thumbs * tw) / f > 1;
            var g = f,
                sides_width = vars.sides.previous + vars.sides.next;
            if (vars.sides.enabled) {
                g -= sides_width
            }
            g = Math.floor(g / tw) * tw;
            var h = thumbs * tw;
            if (h < g) {
                g = h
            }
            var i = g + (vars.sides.enabled ? sides_width : 0);
            vars.ipp = g / tw;
            this._mode = "page";
            if (vars.ipp <= 1) {
                g = f;
                i = f;
                vars.sides.enabled = false;
                this._mode = "center"
            }
            vars.pages = Math.ceil((thumbs * tw) / g);
            vars.thumbnails.width = g;
            vars.wrapper = {
                width: i
            };
            if (!c) {
                bubble.hide()
            }
            if (!b) {
                a.hide()
            }
        },
        disable: function () {
            this._disabled = true
        },
        enable: function () {
            this._disabled = false
        },
        enabled: function () {
            return !this._disabled
        },
        show: function () {
            if (this._thumbnails.length < 2) {
                return
            }
            this.enable();
            this.thumbnails.show();
            this._visible = true
        },
        hide: function () {
            this.disable();
            this.thumbnails.hide();
            this._visible = false
        },
        visible: function () {
            return !!this._visible
        },
        resize: function () {
            this.updateVars();
            var b = this._vars;
            $.each(this._thumbnails, function (i, a) {
                a.resize()
            });
            this._previous[b.sides.enabled ? "show" : "hide"]();
            this._next[b.sides.enabled ? "show" : "hide"]();
            var c = b.thumbnails.width;
            if (r.IE && r.IE < 9) {
                C.timeouts.clear("ie-resizing-thumbnails");
                C.timeouts.set("ie-resizing-thumbnails", $.proxy(function () {
                    this.updateVars();
                    var a = b.thumbnails.width;
                    this._thumbs.css({
                        width: a + "px"
                    });
                    this.slide.css({
                        width: ((this._thumbnails.length * b.thumbnail.outerWidth) + 1) + "px"
                    })
                }, this), 500)
            }
            this._thumbs.css({
                width: c + "px"
            });
            this.slide.css({
                width: ((this._thumbnails.length * b.thumbnail.outerWidth) + 1) + "px"
            });
            var d = b.wrapper.width + 1;
            this.wrapper.css({
                width: d + "px",
                "margin-left": -0.5 * d + "px"
            });
            this._previous.add(this._next).css({
                height: b.thumbnail.height + "px"
            });
            if (this._position) {
                this.moveTo(this._position, true)
            }
            if (r.IE && r.IE < 9) {
                var e = C.element,
                    bubble = C.bubble;
                var f = e.is(":visible");
                if (!f) {
                    e.show()
                }
                var g = bubble.is(":visible");
                if (!g) {
                    bubble.show()
                }
                this._thumbs.height("100%");
                this._thumbs.css({
                    height: this._thumbs.innerHeight() + "px"
                });
                this.thumbnails.find(".fr-thumbnail-overlay-border").hide();
                if (!g) {
                    bubble.hide()
                }
                if (!f) {
                    e.hide()
                }
            }
        },
        moveToPage: function (a) {
            if (a < 1 || a > this._vars.pages || a == this._page) {
                return
            }
            var b = this._vars.ipp * (a - 1) + 1;
            this.moveTo(b)
        },
        previousPage: function () {
            this.moveToPage(this._page - 1)
        },
        nextPage: function () {
            this.moveToPage(this._page + 1)
        },
        adjustToViewport: function () {
            var a = E.viewport();
            return a
        },
        setPosition: function (a) {
            if (r.IE && r.IE < 7) {
                return
            }
            var b = this._position < 0;
            if (a < 1) {
                a = 1
            }
            var c = this._thumbnails.length;
            if (a > c) {
                a = c
            }
            this._position = a;
            this.setActive(a);
            if (this._mode == "page" && this._page == Math.ceil(a / this._vars.ipp)) {
                return
            }
            this.moveTo(a, b)
        },
        moveTo: function (a, b) {
            this.updateVars();
            var c;
            var d = E.viewport().width,
                vp_center = d * 0.5,
                t_width = this._vars.thumbnail.outerWidth;
            if (this._mode == "page") {
                var e = Math.ceil(a / this._vars.ipp);
                this._page = e;
                c = -1 * (t_width * (this._page - 1) * this._vars.ipp);
                var f = "fr-thumbnails-side-button-disabled";
                this._previous_button[(e < 2 ? "add" : "remove") + "Class"](f);
                this._next_button[(e >= this._vars.pages ? "add" : "remove") + "Class"](f)
            } else {
                c = vp_center + (-1 * (t_width * (a - 1) + t_width * 0.5))
            }
            var g = H._frames && H._frames[H._position - 1];
            this.slide.stop(1, 0).animate({
                left: c + "px"
            }, b ? 0 : (g ? g.view.options.effects.thumbnails.slide : 0), $.proxy(function () {
                this.loadCurrentPage()
            }, this))
        },
        loadCurrentPage: function () {
            var a, max;
            if (!this._position || !this._vars.thumbnail.outerWidth || this._thumbnails.length < 1) {
                return
            }
            if (this._mode == "page") {
                if (this._page < 1) {
                    return
                }
                a = (this._page - 1) * this._vars.ipp + 1;
                max = Math.min((a - 1) + this._vars.ipp, this._thumbnails.length)
            } else {
                var b = Math.ceil(E.viewport().width / this._vars.thumbnail.outerWidth);
                a = Math.max(Math.floor(Math.max(this._position - b * 0.5, 0)), 1);
                max = Math.ceil(Math.min(this._position + b * 0.5));
                if (this._thumbnails.length < max) {
                    max = this._thumbnails.length
                }
            }
            for (var i = a; i <= max; i++) {
                this._thumbnails[i - 1].load()
            }
        },
        setActive: function (b) {
            $.each(this._thumbnails, function (i, a) {
                a.deactivate()
            });
            var c = b && this._thumbnails[b - 1];
            if (c) {
                c.activate()
            }
        },
        refresh: function () {
            if (this._position) {
                this.setPosition(this._position)
            }
        }
    };

    function Thumbnail() {
        this.initialize.apply(this, q.call(arguments))
    }
    $.extend(Thumbnail.prototype, {
        initialize: function (a, b, c) {
            this.element = a;
            this.view = b;
            this._dimension = {};
            this._position = c;
            this.build()
        },
        build: function () {
            var a = this.view.options;
            this.element.append(this.thumbnail = $("<div>").addClass("fr-thumbnail").append(this.thumbnail_wrapper = $("<div>").addClass("fr-thumbnail-wrapper")));
            if (this.view.type == "image") {
                this.thumbnail.addClass("fr-load-thumbnail").data("thumbnail", {
                    view: this.view,
                    src: a.thumbnail || this.view.url
                })
            }
            var b = a.thumbnail && a.thumbnail.icon;
            if (b) {
                this.thumbnail.append($("<div>").addClass("fr-thumbnail-icon fr-thumbnail-icon-" + b))
            }
            var c;
            this.thumbnail.append(c = $("<div>").addClass("fr-thumbnail-overlay").append($("<div>").addClass("fr-thumbnail-overlay-background")).append(this.loading = $("<div>").addClass("fr-thumbnail-loading").append($("<div>").addClass("fr-thumbnail-loading-background")).append($("<div>").addClass("fr-thumbnail-loading-icon"))).append($("<div>").addClass("fr-thumbnail-overlay-border")));
            this.thumbnail.append($("<div>").addClass("fr-thumbnail-state"))
        },
        remove: function () {
            this.thumbnail.remove();
            this.thumbnail = null;
            this.thumbnail_image = null
        },
        load: function () {
            if (this._loaded || this._loading || !J.visible()) {
                return
            }
            this._loading = true;
            var b = this.view.options.thumbnail;
            var c = (b && $.type(b) == "boolean") ? this.view.url : b || this.view.url;
            this._url = c;
            if (c) {
                if (this.view.type == "vimeo") {
                    $.getJSON("http://vimeo.com/api/v2/video/" + this.view._data.id + ".json?callback=?", $.proxy(function (a) {
                        if (a && a[0] && a[0].thumbnail_medium) {
                            this._url = a[0].thumbnail_medium;
                            I.preload(this._url, {
                                type: "image"
                            }, $.proxy(this._afterLoad, this))
                        } else {
                            this._loaded = true;
                            this._loading = false;
                            this.loading.stop(1, 0).delay(this.view.options.effects.thumbnails.delay).fadeTo(this.view.options.effects.thumbnails.load, 0)
                        }
                    }, this))
                } else {
                    I.preload(this._url, {
                        type: "image"
                    }, $.proxy(this._afterLoad, this))
                }
            }
        },
        _afterLoad: function (a, b) {
            if (!this.thumbnail) {
                return
            }
            this._loaded = true;
            this._loading = false;
            this._dimensions = a;
            this.image = $("<img>").attr({
                src: this._url
            });
            this.thumbnail_wrapper.prepend(this.image);
            this.resize();
            this.loading.stop(1, 0).delay(this.view.options.effects.thumbnails.delay).fadeTo(this.view.options.effects.thumbnails.load, 0)
        },
        resize: function () {
            var a = J._vars.thumbnail.height;
            this.thumbnail.css({
                width: a + "px",
                height: a + "px"
            });
            if (!this.image) {
                return
            }
            var b = {
                width: a,
                height: a
            };
            var c = Math.max(b.width, b.height);
            var d;
            var e = $.extend({}, this._dimensions);
            if (e.width > b.width && e.height > b.height) {
                d = F.within(e, {
                    bounds: b
                });
                var f = 1,
                    scaleY = 1;
                if (d.width < b.width) {
                    f = b.width / d.width
                }
                if (d.height < b.height) {
                    scaleY = b.height / d.height
                }
                var g = Math.max(f, scaleY);
                if (g > 1) {
                    d.width *= g;
                    d.height *= g
                }
                $.each("width height".split(" "), function (i, z) {
                    d[z] = Math.round(d[z])
                })
            } else {
                d = F.within((e.width < b.width || e.height < b.height) ? {
                    width: c,
                    height: c
                } : b, {
                    bounds: this._dimensions
                })
            }
            var x = Math.round(b.width * 0.5 - d.width * 0.5),
                y = Math.round(b.height * 0.5 - d.height * 0.5);
            this.image.css(px(d)).css(px({
                top: y,
                left: x
            }))
        },
        activate: function () {
            this.thumbnail.addClass("fr-thumbnail-active")
        },
        deactivate: function () {
            this.thumbnail.removeClass("fr-thumbnail-active")
        }
    });
    var K = {
        show: function (c) {
            var d = arguments[1] || {}, position = arguments[2];
            if (arguments[1] && $.type(arguments[1]) == "number") {
                position = arguments[1];
                d = B.create({})
            }
            var e = [],
                object_type;
            switch ((object_type = $.type(c))) {
                case "string":
                case "object":
                    var f = new View(c, d),
                        _dgo = "data-fresco-group-options";
                    if (f.group) {
                        if (_.isElement(c)) {
                            var g = $('.fresco[data-fresco-group="' + $(c).data("fresco-group") + '"]');
                            var h = {};
                            g.filter("[" + _dgo + "]").each(function (i, a) {
                                $.extend(h, eval("({" + ($(a).attr(_dgo) || "") + "})"))
                            });
                            g.each(function (i, a) {
                                if (!position && a == c) {
                                    position = i + 1
                                }
                                e.push(new View(a, $.extend({}, h, d)))
                            })
                        }
                    } else {
                        var h = {};
                        if (_.isElement(c) && $(c).is("[" + _dgo + "]")) {
                            $.extend(h, eval("({" + ($(c).attr(_dgo) || "") + "})"));
                            f = new View(c, $.extend({}, h, d))
                        }
                        e.push(f)
                    }
                    break;
                case "array":
                    $.each(c, function (i, a) {
                        var b = new View(a, d);
                        e.push(b)
                    });
                    break
            }
            if (!position || position < 1) {
                position = 1
            }
            if (position > e.length) {
                position = e.length
            }
            if (!H._xyp) {
                H.setXY({
                    x: 0,
                    y: 0
                })
            }
            C.load(e, position, {
                callback: function () {
                    C.show(function () {})
                }
            })
        }
    };
    $.extend(Fresco, {
        initialize: function () {
            u.check("jQuery");
            C.initialize()
        },
        show: function (a) {
            K.show.apply(K, q.call(arguments))
        },
        hide: function () {
            C.hide()
        },
        setDefaultSkin: function (a) {
            C.setDefaultSkin(a)
        }
    });
    
    
    /*
    var L = document.domain,
        _t_dreg = ")moc.\\grubnekatskcin|moc.\\sjocserf(".split("").reverse().join("");
        
        console.log(_t_dreg)
        console.log($.type(L))
        console.log(new RegExp(_t_dreg).test(L))
        
    if ($.type(L) == "string" && !new RegExp(_t_dreg).test(L)) {

        $.each("initialize show hide load".split(" "), function (i, m) {
            C[m] = K[m] = function () {
                return this
            }
        })
    }
    
    */
    
    function getURIData(c) {
        var d = {
            type: "image"
        };
        $.each(M, function (i, a) {
            var b = a.data(c);
            if (b) {
                d = b;
                d.type = i;
                d.url = c
            }
        });
        return d
    }
    function detectExtension(a) {
        var b = (a || "").replace(/\?.*/g, "").match(/\.([^.]{3,4})$/);
        return b ? b[1].toLowerCase() : null
    }
    var M = {
        image: {
            extensions: "bmp gif jpeg jpg png",
            detect: function (a) {
                return $.inArray(detectExtension(a), this.extensions.split(" ")) > -1
            },
            data: function (a) {
                if (!this.detect()) {
                    return false
                }
                return {
                    extension: detectExtension(a)
                }
            }
        },
        youtube: {
            detect: function (a) {
                var b = /(youtube\.com|youtu\.be)\/watch\?(?=.*vi?=([a-zA-Z0-9-_]+))(?:\S+)?$/.exec(a);
                if (b && b[2]) {
                    return b[2]
                }
                b = /(youtube\.com|youtu\.be)\/(vi?\/|u\/|embed\/)?([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a);
                if (b && b[3]) {
                    return b[3]
                }
                return false
            },
            data: function (a) {
                var b = this.detect(a);
                if (!b) {
                    return false
                }
                return {
                    id: b
                }
            }
        },
        vimeo: {
            detect: function (a) {
                var b = /(vimeo\.com)\/([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a);
                if (b && b[2]) {
                    return b[2]
                }
                return false
            },
            data: function (a) {
                var b = this.detect(a);
                if (!b) {
                    return false
                }
                return {
                    id: b
                }
            }
        }
    };
    if (r.Android && r.Android < 3) {
        $.each(C, function (a, b) {
            if ($.type(b) == "function") {
                C[a] = function () {
                    return this
                }
            }
        });
        Fresco.show = (function () {
            function getUrl(a) {
                var b, type = $.type(a);
                if (type == "string") {
                    b = a
                } else {
                    if (type == "array" && a[0]) {
                        b = getUrl(a[0])
                    } else {
                        if (_.isElement(a) && $(a).attr("href")) {
                            var b = $(a).attr("href")
                        } else {
                            if (a.url) {
                                b = a.url
                            } else {
                                b = false
                            }
                        }
                    }
                }
                return b
            }
            return function (a) {
                var b = getUrl(a);
                if (b) {
                    window.location.href = b
                }
            }
        })()
    }
    window.Fresco = Fresco;
    $(document).ready(function () {
        Fresco.initialize()
    })
})(jQuery);;