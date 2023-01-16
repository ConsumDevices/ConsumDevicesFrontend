import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    clientUser: '/user',
    clientDevice: '/device',
    deviceConsumption: '/deviceConsumption',
};

function getDevicesClient(userid, callback) {
    //console.log(params);
    let request = new Request(HOST.backend_api + endpoint.clientDevice + "/clientD/" + userid, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function messageFromClient(clientMessage, callback){
    console.log("Inainte " + clientMessage.message);
    let request = new Request(HOST.backend_api + endpoint.clientUser + "/messageClient" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientMessage)
    });
    console.log("Dupa " + clientMessage.message);
    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


function clientTyping(messageTyping, callback){
    //console.log("Inainte " + messageTyping.messageTyping);
    let request = new Request(HOST.backend_api + endpoint.clientUser + "/messageTypingClient" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageTyping)
    });
    //console.log("Dupa " + adminMessage.message);
    //console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function clientRead(messageRead, callback){
    //console.log("Inainte " + messageTyping.messageTyping);
    let request = new Request(HOST.backend_api + endpoint.clientUser + "/messageReadClient" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageRead)
    });
    //console.log("Dupa " + adminMessage.message);
    //console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

// function getRole(callback) {
//     let request = new Request(HOST.backend_api + endpoint.clientUser + "/role", {
//         method: 'GET',
//     });
//     console.log(request.url);
//     RestApiClient.performRequest(request, callback);
// }

/*
function getId(callback) {
    let request = new Request(HOST.backend_api + endpoint.clientUser + "/id", {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
*/

// function getUserName(callback) {
//     let request = new Request(HOST.backend_api + endpoint.clientUser + "/name", {
//         method: 'GET',
//     });
//     console.log(request.url);
//     RestApiClient.performRequest(request, callback);
// }


function getConsumptions(deviceName, userid, callback){
    let request = new Request(HOST.backend_api + endpoint.deviceConsumption + "/deviceName/" + deviceName + "/" + userid, {
        method: 'GET',
        //body: JSON.stringify(deviceName)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDevicesClient,
    //getRole,
    //getUserName,
    getConsumptions,
    messageFromClient,
    clientTyping,
    clientRead,
};
