function getUrlParam() {
    var path = location.pathname,
        reg = new RegExp('(\\d+)-(\\d+)\\.html$');

    if(reg.test(path)) {
        return reg.exec(path);
    }
    return ['', '1', '0'];
}
function setUrlParam(pageType) {
    var path = location.pathname,
        reg = new RegExp('(\\d+)(-\\d+\\.html)$');
    location.pathname = path.replace(reg, pageType + '$2')
}
$('#select-time-space').bind('change', function() {
    setUrlParam(this.value);
});

$('.table .popup span').each(function() {
    detailPopUp(this);
});
function detailPopUp(elem) {
    var tpl = $($(elem).parent().find('.tplPopUp').html());
    var offset = $(elem).offset();
    var w = $(elem).width();
    var h = $(elem).height();
    var timer = null;

    tpl.css({
        'position': 'absolute',
        'top': offset.top + h,
        'left': offset.left + w / 2
    }).appendTo($('body'));

    $(elem).hover(function() {
        clearTimeout(timer);
        tpl.show();
    },function() {
        timer = setTimeout(function() {
            tpl.hide();
        }, 100);
    });
    tpl.hover(function() {
        clearTimeout(timer);
    }, function() {
        timer = setTimeout(function() {
            tpl.hide();
        }, 100);
    });
}