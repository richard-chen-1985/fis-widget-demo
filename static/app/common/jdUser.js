define([], function() {
    var jdUser = {
        login: function(callback, refresh){
            if(typeof callback != 'function') {
                throw new Error('Self-defined login argments should be a function!');
            }
            $.extend(jdModelCallCenter, {
                user_login: function(callback, refresh) {
                    $.login({
                        modal: true,
                        complete: function(c){
                            if(c && c.IsAuthenticated){
                                refresh ? location.reload() : callback(c);
                            }
                        }
                    });
                }
            });

            $.extend(jdModelCallCenter.settings, {
                fn: function() {
                    jdModelCallCenter.user_login(callback, refresh);
                }
            });
            jdModelCallCenter.settings.fn();
        }
    };

    return jdUser;
});