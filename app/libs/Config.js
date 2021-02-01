const fs = require('fs');
const hjson = require('hjson');

const defalutConfigPath = './config.jsonc';
const defaultConfig = {
    nightMode: {
        enable: false
    }
};

/**
 * 获取配置
 */
function get() {
    return new Promise((resolve, reject) => {
        fs.readFile(defalutConfigPath, 'utf8', (err, data) => {
            if (err) {
                return reject({
                    msg: '读取配置文件失败',
                    err
                });
            } else {
                try {
                    return resolve(hjson.parse(data));
                } catch (err) {
                    return reject({
                        msg: '读取配置文件失败',
                        err
                    });
                }
            }
        });
    });
}

function getSync() {
    try {
        fs.accessSync(defalutConfigPath, fs.constants.F_OK,);
    } catch (err) {
        setSync(defaultConfig);
        return defaultConfig;
    }
    return hjson.parse(fs.readFileSync(defalutConfigPath, 'utf8'));
}

/**
 * 设置配置
 * @param {object} config 配置
 */
function set(config) {
    return new Promise((resolve, reject) => {
        fs.writeFile(defalutConfigPath, JSON.stringify(config), (err) => {
            if (err) {
                return reject({
                    msg: '写入配置文件失败',
                    err
                });
            } else {
                return resolve();
            }
        })
    });
}

function setSync(config) {
    fs.writeFileSync(defalutConfigPath, JSON.stringify(config));
}

module.exports = {
    get,
    getSync,
    set,
    setSync
}