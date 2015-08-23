(function($) {
    var isIE6 = /MSIE 6/.test(navigator.userAgent);
    // 固定位置
    function Fixable(elem, opts) {
        this.elem = $(elem);
        this.opts = $.extend({}, Fixable.DEFAULTS, opts);
        this.reiszeTimer = null;
        this.init();
    }
    Fixable.DEFAULTS = {
        delay: 50,
        x: "left",
        y: "top",
        xValue: 0,
        yValue: 0,
        zIndex: null
    };
    Fixable.prototype = {
        constructor: Fixable,
        init: function() {
            var self = this,
                opts = this.opts;

            this.initCss();
            $(window).bind('resize', function() {
                clearTimeout(self.reiszeTimer);
                self.reiszeTimer = setTimeout(function() {
                    self.initCss();
                }, opts.delay);
            });
        },
        initCss: function() {
            var self = this,
                opts = this.opts,
                elem = this.elem,
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                pageWidth = document.documentElement.clientWidth || document.body.clientWidth,
                pageHeight = document.documentElement.clientHeight || document.body.clientHeight,
                css = {
                    zIndex: opts.zIndex
                };

            switch(opts.x) {
                case 'left':
                    css.left = opts.xValue;
                    break;
                case 'center':
                    css.left = '50%';
                    css.marginLeft = -(elemWidth / 2) + opts.xValue;
                    break;
                case 'right':
                    css.left = pageWidth - elemWidth + opts.xValue;
                    break;
            };
            switch(opts.y) {
                case 'top':
                    if(isIE6) {
                        elem[0].style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop + ' + opts.yValue + ') + "px"');
                    } else {
                        css.top = opts.yValue;
                    }
                    break;
                case 'center':
                    if(isIE6) {
                        elem[0].style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop + ' + (pageHeight / 2) + ') + "px"');
                    } else {
                        css.top = '50%';
                    }
                    css.marginTop = -(elemHeight / 2) + opts.yValue;
                    break;
                case 'bottom':
                    if(isIE6) {
                        elem[0].style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop + ' + (pageHeight - elemHeight) + ') + "px"');
                    } else {
                        css.top = pageHeight - elemHeight + opts.yValue;
                    }
            }
            css.position = isIE6 ? 'absolute' : 'fixed';
            elem.css(css);
        }
    }

    $.fn.fixable = function(opts) {
        $(this).each(function() {
            new Fixable(this, opts);
        });

        return this;
    }

})(jQuery);