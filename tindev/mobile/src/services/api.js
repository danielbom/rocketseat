const axios = require('axios');

const api = axios.create({
    // baseUrl: 'http://192.168.1.6:3333' 
    baseUrl: 'http://localhost:3333' // Use adb reverse tcp:3333 tcp:3333
});

export default api;