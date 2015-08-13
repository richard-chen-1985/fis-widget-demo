// 静态资源版本号
var VERSION = '1.0.0';
// 合并开关
var PACKED = true;
// cdn域名
var CDN = 'http://static.360buyimg.com/yiye';

fis.hook('module', {
    mode: 'amd',
    forwardDeclaration: true,
    baseUrl: '/static/app',
    paths: {
        dialogEx: 'common/dialogEx',
        jdUser: 'common/jdUser',
        jqueryPin: 'common/jquery.pin',
        jqueryShare: 'common/jquery.share',
        fixable: 'common/jquery.fixable',
        beanExchange: 'common/bean.exchange',
        clipboard: 'common/zeroclipboard-1.3.5/ZeroClipboard'
    }
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        useInlineMap: true
    })
});

// 默认设置
fis
    // 关闭useHash
    .match('**', {
        useHash: false
    })
    // 排除不需要发布文件
    .match('{sass/**,widget/**.tpl,widget/**.json}', {
        release: false
    })
    // 添加velocity模板引擎
    .match('page/**.html', {
        parser: fis.plugin('velocity', {
            encoding: 'utf-8',
            loader: 'require'
        })
    })
    // sass
    .match('{widget,static}/**.scss', {
        parser: fis.plugin('sass'),
        rExt: '.css'
    })
    .match('{widget/**/*,static/app/common/**.js}', {
        isMod: true
    });


// 合并设置
if(PACKED) {
    fis
        .match('static/lib/**', {
            packTo: 'static/lib/lib_pkg.js'
        })
        .match('static/app/{common.js,common/**.js}', {
            packTo: 'static/app/common_pkg.js'
        })
        .match('widget/**.js', {
            packTo: 'static/widget_pkg.js'
        })
        .match('widget/**.{css,scss}', {
            packTo: 'static/widget_pkg.css'
        })
        .match('static/css/**{css,scss}', {
            packTo: 'static/css/common_pkg.css'
        });
}

// 生产环境设置
fis
    .media('prod')
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: ['require', 'define']
        })
    })
    .match('*.{css,scss}', {
        optimizer: fis.plugin('clean-css')
    })
    // .match('*.{css,scss,png,js}', {
    //     useHash: true
    // })
    .match('*', {
        domain: CDN + '/' + VERSION,
        // deploy: fis.plugin('local-deliver', {
        //     to: 'output/' + VERSION
        // })
    });