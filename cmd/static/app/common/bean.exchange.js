seajs.use([
    'dialogEx',
    'jqueryShare',
    'clipboard',
], function(dialog, share, clipboard) {
    
    // 福利类型名称
    var TYPE_NAME = ['兑换', '兑换', '领取', '兑换'];
    // 系统错误
    var TEXT_SYS_ERROR = '抱歉，系统异常，请稍后再试。';
    // jsonp提交目的域名
    var jsonpDomain = 'http://vip.jd.com';

    /**
     * 京豆交易处理
     */
    var BeanExchange = {
        // 各种警告提示对话框
        alert: function(strMsg) {
            $('body').dialogEx({
                title: "提示",
                source: '<h3 class="font-warn">'+ strMsg + '</h3>',
                btnCancel: false,
                onSubmit: function() {
                    this.close();
                },
                onCancel: function() {
                    this.close();
                }
            });
        },
        // 兑换方法
        // id: 兑换项目ID
        // termType: 兑换类型(1、3为兑换, 2为等级领取)
        exchange: function(id, termType, title, payPwd, telNum, email, callback) {
            var _this = this;

            $.ajax({
                url: jsonpDomain + '/fuli/detail/jsonpExchange.html',
                data: {
                    actId: id,
                    password: payPwd,
                    phone: telNum,
                    email: email
                },
                dataType: "jsonp",
                type: "POST",
                success: function(data) {
                    callback && callback(null, data);
                },
                fail: function() {
                    callback && calback(TEXT_SYS_ERROR);
                }
            });
        },
        // 直接领取
        exchangeDirect: function(id, termType, title) {
            var _this = this;
            _this.exchange(id, termType, title, '', '', '', function(err, data) {
                if(err) {
                    _this.alert(err);
                    return;
                }
                if (data.flag == false) {
                    _this.alert(data.message);
                    return;
                }
                _this.exchangeDone(id, title, termType, data.message);
            });
        },
        // 用户点击后判断下一步操作
        checkEnable: function(id, callback) {
            var _this = this;
            $.ajax({
                url: jsonpDomain + '/fuli/detail/jsonpValid.html',
                data: {
                    actId: id
                },
                dataType: 'jsonp',
                type: 'POST',
                success: function (data) {
                    if (data.flag == true) {
                        callback && callback();
                    } else {
                        _this.alert(data.message);
                    }
                },
                fail: function () {
                    _this.alert(TEXT_SYS_ERROR);
                }
            });
        },
        // 输入支付密码对话框
        dialogPayPwd: function(id, title, termType, beanCount, exchangeNum) {
            var _this = this;

            $('body').dialogEx({
                width:420,
                title: '确认兑换',
                source: '<p class="ft14">您正在兑换 ' + title + '</p>\
                        <p>本次兑换将从您的京豆账户扣除<span class="font-error"><em style="font-size:30px">' + (isNaN(beanCount) ? 0 : beanCount) + '</em>个京豆</span></p>\
                        <p>请输入支付密码<input type="password" name="password" class="txt"><a href="http://safe.jd.com/findPwd/index.action" target="_blank">忘记密码？</a></p>\
                        <p class="info text-left">温馨提示：' + (exchangeNum ? '每个ID限领' + exchangeNum + '张。' : '') + '本活动为概率性事件，不能保证所有客户成功兑换优惠券</p>\
                        <p class="font-error help-info"></p>',
                onReady: function() {
                    var dialog = this.dialog,
                        input = dialog.find('input[name=password]'),
                        help = dialog.find('.help-info');

                        input.bind('focus', function() {
                            help.html('');
                        });
                },
                onSubmit: function() {
                    var dialog = this.dialog,
                        pwdVal = dialog.find('input[name=password]').val(),
                        help = dialog.find('.help-info'),
                        btn = dialog.find('.btn-ok');

                    if(btn.hasClass('btn-status-2')) return;

                    if(pwdVal === '') {
                        help.html('支付密码不能为空！');
                        return;
                    }
                    btn.removeClass('btn-status-1').addClass('btn-status-2').html('正在兑换……');
                    // 提交信息
                    _this.exchange(id, 0, title, pwdVal, '', '', function(err, data) {
                        if(err) {
                            window.closeDialogEx();
                            _this.alert(err);
                            return;
                        }
                        if(data.flag == false) {
                            btn.removeClass('btn-status-2').addClass('btn-status-1').html('立即兑换');
                            help.html(data.message);
                            return;
                        }
                        _this.exchangeDone(id, title, termType, data.message);
                    });
                },
                onCancel: function() {
                    this.close();
                }
            });
        },
        dialogUInfo: function(id, title, termType, iBeanCount, bTelNum, bEmail, exchangeNum) {
            var _this = this,
                regMobile = /^0?(13|15|17|18|14)[0-9]{9}$/,
                regEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                strTemp = '';

            if(bTelNum) {
                strTemp += '<p>　　手机号：<input type="text" name="telNum" class="txt"></p>';
            }
            if(bEmail) {
                strTemp += '<p>　　　邮箱：<input type="text" name="email" class="txt"></p>';
            }
            if(iBeanCount > 0) {
                strTemp += '<h3>本次兑换将从你的京豆账户中扣除<span class="font-warn">' + iBeanCount + '个京豆</span></h3>';
                strTemp += '<p>　支付密码：<input type="password" name="password" class="txt"></p>';
            }

            $('body').dialogEx({
                width:420,
                title: '确认' + TYPE_NAME[termType],
                source: '<div class="text-left">' +
                    '<h3>请填写以下信息：</h3>' + strTemp +
                    '<p class="info">注：提交信息后，优惠码将在活动结束后1-7个工作日发放到您的联系方式里，你也可以在“<a href="/fuli/mylist/0-1.html" target="_blank">我的领取记录”</a>查询优惠劵信息</p>' +
                    '<p class="info">温馨提示：' + (exchangeNum ? '每个ID限领' + exchangeNum + '张。' : '') + '本活动为概率性事件，不能保证所有客户成功兑换优惠券</p>'+
                    '<p class="font-error help-info"></p></div>',
                onReady: function() {
                    var dialog = this.dialog,
                        input = dialog.find('input[name=telNum], input[name=email], input[name=password]'),
                        help = dialog.find('.help-info');

                    input.bind('focus', function() {
                        help.html('');
                    });
                },
                onSubmit: function() {
                    var dialog = this.dialog,
                        telNumVal = dialog.find('input[name=telNum]').val(),
                        emailVal = dialog.find('input[name=email]').val(),
                        pwdVal = dialog.find('input[name=password]').val(),
                        help = dialog.find('.help-info'),
                        btn = dialog.find('.btn-ok');

                    if(btn.hasClass('btn-status-2')) return;

                    if(bTelNum && !regMobile.test(telNumVal)) {
                        help.html('请输入正确的手机号码！');
                        return;
                    }
                    if(bEmail && !regEmail.test(emailVal)) {
                        help.html('请输入正确的邮箱地址！');
                        return;
                    }
                    if(iBeanCount > 0 && pwdVal == '') {
                        help.html('请输入支付密码！');
                        return;
                    }
                    help.html('');
                    btn.removeClass('btn-status-1').addClass('btn-status-2').html('正在' + TYPE_NAME[termType] + '……');
                    // 提交信息
                    _this.exchange(id, 2, title, pwdVal, telNumVal, emailVal, function(err, data) {
                        if(err) {
                            window.closeDialogEx();
                            _this.alert(err);
                            return;
                        }
                        if(data.flag == false) {
                            btn.removeClass('btn-status-2').addClass('btn-status-1').html('立即' + TYPE_NAME[termType]);
                            help.html(data.message);
                            return;
                        }
                        _this.exchangeDone(id, title, termType, data.message);
                    });
                },
                onCancel: function() {
                    this.close();
                }
            });
        },
        exchangeDone: function(id, title, termType, exchangeCode) {
            var type = TYPE_NAME[termType];
            window.closeDialogEx();
            var tpl = '<div><p>恭喜您 ' + title + ' ' + type + '成功！</p>';
            tpl += '<p>请进入“<a href="/fuli/mylist/0-1.html" target="_blank">我的' + type + '记录</a>”查看' + type + '信息。</p>';
            if(exchangeCode) {
                tpl += '<p>兑换码：' + exchangeCode + ' <a href="javascript:void(0)" data-clipboard-text="' + exchangeCode + '" class="btnCopy">复制</a></p>';
            }
            tpl += '<p class="info">温馨提示：领取后请尽快查看使用说明 <a href="/fuli/detail/' + id + '.html" target="_blank">立即查看</a></p></div>';
            $('body').dialogEx({
                submitText: '完成',
                cancelText: '分享',
                title: type + '成功',
                source: tpl,
                onReady: function() {
                    var oBtn = $(this.dialog).find('.btnCopy');
                    ZeroClipboard.config({ moviePath: cdnUrl + "/js/lib/zeroclipboard-1.3.5/ZeroClipboard.swf" });
                    var client = new ZeroClipboard(oBtn);
                    client.on("load", function(client) {
                        client.on("complete", function(client, args) {
                            oBtn.html('复制成功！');
                        });
                    });
                    
                    client.on('wrongflash noflash', function() {
                        oBtn.hide();
                    });

                    $.share.config({
                        content: '我抢到了 ' + title + '。 京东会员跨界专享福利，先到先得，快来领取吧！',
                        url: window.location.href,
                        pic: "http://misc.360buyimg.com/lib/img/e/logo-201305.png"
                    });
                    $.share({
                        elem: this.dialog.find('.btn-cancel'),
                        type: 'pop'
                    });
                },
                onSubmit: function() {
                    this.close();
                },
                onCancel: function() {
                    this.close();
                }
            });
        }
    };

    return BeanExchange;
});