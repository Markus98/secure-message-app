import axios from 'axios';
const baseURL = 'http://localhost:3001/api/';

//we probably never want to do this in frontend, but here for debug
const get_messages = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

export default {get_messages};