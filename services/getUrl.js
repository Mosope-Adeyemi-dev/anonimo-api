const currentEnv = process.env.NODE_ENV

const getUrl = () => process.env.NODE_ENV === 'local' ? 'http://localhost:4000/' : 'http://production';

module.exports = {
    getUrl
}