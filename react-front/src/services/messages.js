import axios from 'axios';
const baseURL = 'http://localhost:3001/api/';

const get_messages = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

const create_message = async newObject => {
    const response = await axios.post(baseURL, newObject);
    return response.data;
}

const messages = {
    get_messages, 
    create_message
}
export default messages;