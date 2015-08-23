require(['jqueryPin'], function(pin) {
    var isIE6 = /MSIE 6/i.test(navigator.userAgent);
    !isIE6 && $('.category').pin({
        containerSelector: '.main'
    });
});