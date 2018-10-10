
let axios = require('axios');
const baseURL = 'https://enigmatic-hamlet-4927.herokuapp.com/posse';
class HttpRequest {
    static getRequest(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + url, {params: params}).then( (response) => resolve(response)).catch((err) => reject(err));
        });
    }
    static postRequest(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(baseURL + url, params).then( (response) => resolve(response)).catch((err) => reject(err));
        });
    }
}
module.exports = HttpRequest;