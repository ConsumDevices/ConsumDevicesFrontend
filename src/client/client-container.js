import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import ClientChartForm from "./components/client-chart-form";

import * as API_CLIENT from "./api/client-api"
import ClientTable from "./components/client-table";
import { withRouter } from "react-router-dom";
import UserFormDelete from "../user/components/user-form-delete";
import {HOST} from '../commons/hosts';

import SockJsClient from 'react-stomp';
import CookieUser from "../cookieUser";

//const SOCKET_URL = 'http://localhost:8080/ws-message';
const SOCKET_URL = HOST.backend_api + '/ws-message';

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};
const styleSocket = {textAlign: 'center'};

class ClientContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleFormChart = this.toggleFormChart.bind(this);
        this.reloadChart = this.reloadChart.bind(this);
        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            nameUser : 'nelogat',
            messageWebSocket: 'no issue',
        };

        this.cookieRef = React.createRef();
    }

    changeMessage(message){
        this.setState({
            messageWebSocket: message
        });
    }

    onConnection = () => {
        console.log("Connected with Websocket!");
    }

    onReceivedMessage = (msg) => {
        this.changeMessage("Valoarea " + msg.value + " din data " + msg.date + " pentru device-ul:" + msg.deviceId + " este prea mare");
    }

    componentDidMount() {
        //this.fetchId();
        this.fetchDevicesClient(this.cookieRef.current.props.cookies.get("id"));
        this.fetchRole();
        this.fetchUserName();
    }

    fetchDevicesClient(userid) {
        //this.fetchId();
        //console.log("Params aici: " + this.params);
        if(userid !== "")
        {
            return API_CLIENT.getDevicesClient(userid,(result, status, err) => {

                if (result !== null && status === 200) {
                    this.setState({
                        tableData: result,
                        isLoaded: true
                    });
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err
                    }));
                }
            });
        }
    }



    fetchRole() {
        // return API_CLIENT.getRole((result, status, err) => {
        //
        //     if (result !== null && status === 200) {
        //         if(result === "neLogat")
        //         {
        //             let newPath = '/'
        //             this.props.history.push(newPath);
        //         }
        //         else if(result === 'admin' || result === 'Admin')
        //         {
        //             let newPath = '/user'
        //             this.props.history.push(newPath);
        //         }
        //         else if(result === 'client' || result === 'Client')
        //         {
        //             //let newPath = '/device'
        //             //this.props.history.push(newPath);
        //         }
        //     } else {
        //         this.setState(({
        //             errorStatus: status,
        //             error: err
        //         }));
        //     }
        // });
        let result = this.cookieRef.current.props.cookies.get("role");
        if (result !== null) {
            if (result === "neLogat") {
                let newPath = '/'
                this.props.history.push(newPath);
            } else if (result === 'admin' || result === 'Admin') {
                let newPath = '/user'
                this.props.history.push(newPath);
            } else if (result === 'client' || result === 'Client') {
                //let newPath = '/device'
                //this.props.history.push(newPath);
            }
        }
    }

    /*
    fetchId() {
        return API_CLIENT.getId((result, status, err) => {

            if (result !== null && status === 200) {
                this.params.id = result;
                console.log("params: " + this.params.id);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }
    */
    fetchUserName() {
        // return API_CLIENT.getUserName((result, status, err) => {
        //
        //     if (result !== null && status === 200) {
        //         this.setState({
        //             nameUser: result
        //         });
        //     }
        //     else {
        //         this.setState(({
        //             errorStatus: status,
        //             error: err
        //         }));
        //     }
        // });
        //console.log("Intra aici");
        //console.log(this.cookieRef.current.state.name);
        //return (result=this.cookieRef.current.state.name) => {
        //    //console.log(result);
            //console.log(this.cookieRef.current.state.name);
        //    if (result !== null) {
        //        this.setState({
        //            nameUser: result
        //        });
        //    }
        //};
        let result = this.cookieRef.current.props.cookies.get("name")
        if (result !== null) {
            this.setState({
                nameUser: result
            });
        }
    }

    toggleFormChart() {
        this.setState({selectedChart: !this.state.selectedChart});
    }


    /*
    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchRole();
        this.fetchUserName();
        this.fetchDevicesClient();
    }
     */
    reloadChart() {
        this.setState({
            isLoaded: false
        });
        //this.toggleFormChart();
        this.fetchRole();
        this.fetchUserName();
        this.fetchDevicesClient(this.cookieRef.current.cookies.get("id"));
    }

    render() {
        return (
            <div style={styleDiv}>
                <CardHeader style={styleHeader}>
                    <strong> Hello, {this.state.nameUser}. These are your devices </strong>
                </CardHeader>

                <div>
                    <SockJsClient
                        url={SOCKET_URL}
                        topics={['/wsnotification/message']}
                        onConnect={this.onConnection}
                        onDisconnect={console.log("Disconnected!")}
                        onMessage={msg => this.onReceivedMessage(msg)}
                        debug={false}
                    />
                    <CardHeader style={styleSocket}>
                        <strong> {this.state.messageWebSocket} </strong>
                    </CardHeader>
                </div>


                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '10', offset: 11}}>
                            <Button color="primary" onClick={()=>{this.props.history.push('/')}}>Logout</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Col sm={{size: '0', offset: 2}}>
                        <Button color="primary" onClick={this.toggleFormChart}>Open Form Chart </Button>
                    </Col>
                    <Modal isOpen={this.state.selectedChart} toggle={this.toggleFormChart}
                           className={this.props.className} size="lg">
                        <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormChart}> Chart: </ModalHeader>
                        <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                            <ClientChartForm />
                        </ModalBody>
                    </Modal>
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            {this.state.isLoaded && <ClientTable tableData = {this.state.tableData}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                </Card>
                <CookieUser ref={this.cookieRef} />
            </div>
        )

    }
}


export default withRouter(ClientContainer);
