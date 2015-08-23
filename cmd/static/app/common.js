seajs.use([
    'http://misc.360buyimg.com/jdf/1.0.0/unit/globalInit/1.0.0/globalInit',
    'jdUser',
    'beanExchange'
], function(globalInit, jdUser, beanExchange) {
    $(function(){
        /**
         * 按钮属性：
         *   itid: 项目的id
         *   ittype: 福利类型(1：优惠码, 2：收集信息)
         *   termType: 兑换类型（1：京豆兑换，2：等级设置，3：包括1和2）
         *   ittitle: 项目的标题
         *   itbeancount: 需要京豆数，没有则为0
         *   ittelnum: 填写信息是否包含手机号
         *   itemail: 填写信息是否包含email
         */
        $('span.btn-status-1').bind('click', function() {
            var self = this;
            jdUser.login(function() {
                triggerExchange(self);
            });
        });

        function triggerExchange(oBtn) {
            var id = $(oBtn).attr('itid'),
                type = parseInt($(oBtn).attr('ittype')),
                termType = parseInt($(oBtn).attr('ittermtype')),
                title = $(oBtn).attr('ittitle'),
                beanCount = parseInt($(oBtn).attr('itbeancount')),
                telNum = $(oBtn).attr('ittelnum') === '1',
                email = $(oBtn).attr('itemail') === '1',
                exchangeNum = $(oBtn).attr('itexchangenum');

            beanExchange.checkEnable(id, function() {
                // 收集信息直接领取
                if (type === 2) {
                    beanExchange.dialogUInfo(id, title, termType, beanCount, telNum, email, exchangeNum);
                } else if (type === 1) {
                    // 京豆兑换或者京豆兑换与等级设置，要求输入验证码
                    if (termType === 1 || termType === 3) {
                        beanExchange.dialogPayPwd(id, title, termType, beanCount, exchangeNum);
                    } else if (termType === 2) {
                        // 等级设置直接兑换
                        beanExchange.exchangeDirect(id, termType, title);
                    }
                }
            });
        }
	});
});