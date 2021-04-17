module.exports = {
    appId: 'com.english-table.app',
    productName: 'English Table',
    directories: {
        app: '.',
        output: 'build'
    },
    mac: {
        icon: './assets/english-table.png',
        target: 'dmg'
    },
    dmg: {
        title: '${productName}_${version}'
    },
    files: [
        '**/*',
        '!src',
        '!assets'
    ],
    electronDownload: {
        mirror: 'http://npm.taobao.org/mirrors/electron/'
    }
};