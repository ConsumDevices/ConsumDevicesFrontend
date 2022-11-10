import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    home: '/user'
};


function loginUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.home + "/login" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function getRoleLogout(callback) {
    let request = new Request(HOST.backend_api + endpoint.home + "/roleLogout", {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    loginUser,
    getRoleLogout
};
