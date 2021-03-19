import axios from 'axios';
const baseURL = 'http://localhost:3001/api/';

const get_messages = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

export default {get_messages};