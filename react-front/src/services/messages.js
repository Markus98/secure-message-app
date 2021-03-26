import axios from 'axios';
const baseURL = 'http://localhost:3001/api/';

const create_message = async (msg, password, lifetime, readLimit) => {
    let jsonObj = {message: msg};
    if(password) {
        jsonObj.password = password;
    }
    if(lifetime)
    {
        jsonObj.lifetime = lifetime;
    }
    if(readLimit)
    {
        jsonObj.readLimit = readLimit;
    }
    try {
        const response = await axios.post(baseURL, jsonObj);
        console.log(response);

    } catch (error) {
        const status = error.response.status;
        if(status === 400) {
            console.log('No message provided in the request');
        } else {
            console.log(error);
        }
        return null;
    }
}

const get_message = async (msgURL, password) => {
    try {
        const response = await axios.get(`${baseURL}/{msgURL}`, {password: password});
        console.log(response);
        response.data.exist = true;
        return response.data;
    } catch (error) {
        const status = error.response.status;
        if(status === 404) {
            console.log(`No message exist with URL: ${msgURL}`);
            return {exist: false};
        } else if(status === 401) {
            console.log(`Message with URL: ${msgURL} is password protected`);
            return {exist: true};
        } else if(status === 403) {
            console.log('Invalid password');
            return {exist: true};
        } else {
            console.log(error);
            return null;
        }
    }
}

const delete_message = async (msgURL, password) => {
    // TODO
    console.log("delete_message has not been implemted");
    return null;
}

const messages = {
    create_message,
    get_message,
    delete_message
}
export default messages;