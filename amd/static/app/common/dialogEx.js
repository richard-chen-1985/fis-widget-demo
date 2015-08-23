(function($, window) {
    var template = {
        dialog: '<div class="ui-dialog-ex"></div>',
        title: '<div class="dialog-title">{{title}}</div>',
        content: '<div class="dialog-cont">{{source}}</div>',
        buttonWrap: '<div class="dialog-btn"></div>',
        buttonSubmit: '<span class="btn-status btn-status-1 btn-ok"></span>',
        buttonCancel: '<span class="btn-status btn-status-cancel btn-cancel"></span>',
        mask: '<div class="ui-mask-ex" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;opacity:0.15;filter:alpha(opacity=15);"></div>'
    };
    var defaultSettings = {
        title: null,
        source: '',
        modal: true,
        hasBtn: true,
        btnSubmit: true,
        btnCancel: true,
        autoOpen: true,
        submitText: '确认',
        cancelText: '取消',
        onSubmit: null,
        onCancel: null,
        onReady: null,
        onClose: null,
        width: null,
        height: null,
        fixed: true
    };
    var isIE6 = /MSIE 6/i.test(navigator.userAgent);

    /**
     * DialogEx 对话框类
     */
    var DialogEx = function(opts) {
        this.opts = $.extend({}, defaultSettings, opts);
        // 缓存对话框主体模板
        this.dialog = $(template.dialog);
        this.mask = $(template.mask);

        this.init();
    };
    DialogEx.prototype.init = function() {
        // 加入title
        if(this.opts.title) {
            this.dialog.append(template.title.replace('{{title}}', this.opts.title));
        }
        // 加入对话框内容
        if(this.opts.source) {
            this.dialog.append(template.content.replace('{{source}}', this.opts.source));
        }
        // 加入按钮
        if(this.opts.hasBtn) {
            this.dialog.append(template.buttonWrap);
            if(this.opts.btnSubmit) {
                this.dialog.find('.dialog-btn').append(template.buttonSubmit);
            }
            if(this.opts.btnCancel) {
                this.dialog.find('.dialog-btn').append(template.buttonCancel);
            }
            this.dialog.find('.btn-ok').html(this.opts.submitText);
            this.dialog.find('.btn-cancel').html(this.opts.cancelText);
        }
        this.bindEvents();
        this.opts.autoOpen && this.open();
    };
    DialogEx.prototype.bindEvents = function() {
        var _this = this,
            dialog = this.dialog;

        dialog
            .delegate('.btn-ok', 'click', function() {
                _this.opts.onSubmit && _this.opts.onSubmit.call(_this);
            })
            .delegate('.btn-cancel', 'click', function() {
                _this.opts.onCancel && _this.opts.onCancel.call(_this);
            });

        $(window)
            .bind('resize', function() {
                _this.opts.modal && _this.setStyleMask();
            });
    };
    DialogEx.prototype.open = function() {
        this.dialog.css({ 'width': this.opts.width, 'height': this.opts.height }).appendTo($(document.body));
        this.setStyleDialog();
        if(this.opts.modal) {
            this.dialog.before(this.mask);
            this.setStyleMask();
        }
        this.opts.onReady && this.opts.onReady.call(this);
    };
    DialogEx.prototype.close = function() {
        this.dialog.remove();
        this.mask.remove();
        this.opts.onClose && this.opts.onClose.call(this);
    };
    DialogEx.prototype.setStyleDialog = function() {
        var dialog = this.dialog,
            t0 = document.documentElement.scrollTop || document.body.scrollTop,
            h0 = document.documentElement.clientHeight,
            w1 = dialog.outerWidth(),
            h1 = dialog.outerHeight();

        dialog.css({
            'left': '50%',
            'margin-left': -w1 / 2
        });
        if(this.opts.fixed) {
            dialog.css({
                'position': isIE6 ? 'absolute' : 'fixed',
                'top': '50%',
                'margin-top': isIE6 ? 0 : -h1 / 2
            });
            if(isIE6) {
                dialog
                    .get(0)
                    .style
                    .setExpression('top', 'documentElement.scrollTop+(documentElement.clientHeight-this.clientHeight)/2');
            }
        } else {
            dialog.css({
                'position': 'absolute',
                'top': t0 + (h0 - h1) / 2
            });
        }
    };
    DialogEx.prototype.setStyleMask = function() {
        var w = Math.max($(document.body).outerWidth(), $(window).width()),
            h = $(document.body).outerHeight(),
            mask = this.mask;
        mask.css({ 'width': w, 'height': h });
    };

    // 扩展jq对象
    $.fn.dialogEx = function(opts) {
        return new DialogEx(opts);
    };

    window.closeDialogEx = function() {
        $('.ui-dialog-ex, .ui-mask-ex').remove();
    };

})(jQuery, window);