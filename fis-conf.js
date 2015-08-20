// 模块引用
var path = require('path');

// 各种配置及开关
var config = {
    // 静态资源版本号
    VERSION: '1.0.0',
    // 合并开关
    PACKED: true,
    // cdn域名开关，prod环境始终为true
    CDN: false,
    // cdn域名地址
    CDNURL: 'http://static.360buyimg.com/yiye',
    // MD5后缀开关
    USEHASH: false,
    // 模块化配置
    amdMod: {
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
    }
}

// 添加全局忽略
fis.set('project.ignore', fis.get('project.ignore').concat([
    '{_docs,sass)/**',
    'page/**/_*.scss',
    '{page,widget}/**.tpl',
    '{page,widget}/**.json'
]));

// 开启模块化插件
config.amdMod && fis.hook('module', amdMod);

// 静态资源加载插件
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        useInlineMap: true
    })
})

// 合并设置
config.PACKED && fis
    .match('static/lib/**', {
        packTo: 'static/lib/lib_pkg.js'
    })
    .match('static/app/{common.js,common/**.js}', {
        packTo: 'static/app/common_pkg.js'
    })
    .match('static/css/**{css,scss}', {
        packTo: 'static/css/common_pkg.css'
    })
    .match('widget/**.js', {
        packTo: 'widget/widget_pkg.js'
    })
    .match('widget/**.{css,scss}', {
        packTo: 'widget/widget_pkg.css'
    })

// 默认设置
fis
    // 关闭useHash
    .match('*', {
        useHash: false
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
    })
    // CDN
    .match('*', {
        domain: config.CDN ? (config.CDNURL + '/' + config.VERSION) : ''
    })

// 生产测试环境设置
// 和线上有同样MD5，用于调试线上BUG
fis
    .media('debug')
    .match('*.{css,scss,png,js}', {
        useHash: config.USEHASH
    })
    .match('{page,test}/**', {
        release: false
    })
    .match('*', {
        deploy: fis.plugin('local-deliver', {
            to: 'output/debug/' + config.VERSION
        })
    })

// 生产环境设置
// 发布后直接上传CDN服务器
fis
    .media('prod')
    .match('*.{css,scss,png,js}', {
        useHash: config.USEHASH
    })
    .match('{page,test}/**', {
        release: false
    })
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: ['require', 'define']
        })
    })
    .match('*.{css,scss}', {
        optimizer: fis.plugin('clean-css')
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor')
    })
    .match('*', {
        // 发布环境始终开启CDN
        domain: config.CDNURL + '/' + config.VERSION,
        deploy: fis.plugin('local-deliver', {
            to: 'output/prod/' + config.VERSION
        })
    })