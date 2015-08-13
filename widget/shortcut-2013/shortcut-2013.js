$(function() {
    // 通用菜单栏
    $('#vip-header .nav-items').bind('mouseenter', function() {
        $(this).addClass('hover');
    }).bind('mouseleave', function() {
        $(this).removeClass('hover');
    });
});
