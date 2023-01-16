import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    user: '/user'
};

function messageFromAdmin(adminMessage, callback){
    console.log("Inainte " + adminMessage.message);
    let request = new Request(HOST.backend_api + endpoint.user + "/messageAdmin" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminMessage)
    });
    console.log("Dupa " + adminMessage.message);
    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function adminTyping(messageTyping, callback){
    //console.log("Inainte " + messageTyping.messageTyping);
    let request = new Request(HOST.backend_api + endpoint.user + "/messageTypingAdmin" , {
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

function adminRead(messageRead, callback){
    //console.log("Inainte " + messageTyping.messageTyping);
    let request = new Request(HOST.backend_api + endpoint.user + "/messageReadAdmin" , {
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

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

// function getRole(callback) {
//     let request = new Request(HOST.backend_api + endpoint.user + "/role", {
//         method: 'GET',
//     });
//     console.log(request.url);
//     RestApiClient.performRequest(request, callback);
// }

function getUserById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.user + params.id, {
       method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.user , {
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

function updateUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.user + "/update", {
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

function deleteUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.user + "/delete" , {
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

export {
    getUsers,
    getUserById,
    postUser,
    //getRole,
    updateUser,
    deleteUser,
    messageFromAdmin,
    adminTyping,
    adminRead,
};
