require(['jqueryShare'], function() {
    // 初始化分享组件
    $.share.config({
        content: '我抢到了 ' + $('.hd-title').html() + '。 京东会员跨界专享福利，先到先得，快来领取吧！',
        url: window.location.href,
        pic: "http://misc.360buyimg.com/lib/img/e/logo-201305.png"
    });
    $.share({
        elem: $('.btn-share'),
        type: 'tip'
    });
});