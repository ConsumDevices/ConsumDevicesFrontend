import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    clientUser: '/user',
    clientDevice: '/device'
};

function getDevices(callback) {
    let request = new Request(HOST.backend_api + endpoint.clientDevice, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getDevices
};
