require(['jdUser', 'fixable'], function(jdUser) {
    // 登录按钮
    $('#btnLogin').bind('click', function() {
        jdUser.login(function(data) {
            //console.log(data);
        }, true);
    });


    // 固定位置广告
    $('#sideAd').fixable({
        x: 'right',
        y: 'center',
        xValue: 0,
        yValue: 0,
        zIndex: 999
    });

    
});