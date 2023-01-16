import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col, Input,
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
import * as API_HOME from "../home/api/home-api";
import validate from "../user/components/validators/user-validators";
import * as API_USERS from "../user/api/user-api";

//const SOCKET_URL = 'http://localhost:8080/ws-message';
const SOCKET_URL = HOST.backend_api + '/ws-message';

const SOCKET_URL_CHAT = HOST.backend_api + '/chatClient';
const SOCKET_URL_TYPING = HOST.backend_api + '/typingAdmin';
const SOCKET_URL_READ = HOST.backend_api + '/readAdmin';

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};
const styleSocket = {textAlign: 'center'};

class ClientContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleFormChart = this.toggleFormChart.bind(this);
        this.reloadChart = this.reloadChart.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendMessageRead = this.sendMessageRead.bind(this);


        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            nameUser : 'nelogat',
            messageWebSocket: 'no issue',
            clientMessage: '',
            messageReceived: '',
            messageTextArea: '',
            chatDisplayed: [],
            messageTyping: '',
            messageRead: '',

        };

        this.cookieRef = React.createRef();
        this.divRef = React.createRef();
    }

    scrollToBottom = () => {
        this.divRef.current.scroll({ top: this.divRef.current.scrollHeight + this.state.messageReceived.length, behavior: 'smooth' });
    };

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

    printMessage(message)
    {
        this.setState(({
            chatDisplayed: this.state.chatDisplayed.concat(<Input style={{backgroundColor: '#169db0', width:'50%',resize:'none'}}
                                                                  type="textarea"
                                                                  value={"ADMIN:\n" + message}
                                                                  disabled
                                                                  cols='30'
                                                                  rows={message.length/53+2}
            />)
        }));

    }

    onReceivedMessageFromAdminRead = (msg) => {

        //console.log("Intra aici");
        if(msg.clientID === this.cookieRef.current.props.cookies.get("id"))
        {
            if(msg.messageRead === 'read')
            {
                //console.log("Intra aici Typing")
                this.setState({
                    messageRead: "Message was read",
                });
            }
        }

    }

    onReceivedMessageFromAdminTyping = (msg) => {

        if(msg.clientID === this.cookieRef.current.props.cookies.get("id"))
        {
            if(msg.messageTyping === 'typing')
            {
                console.log("Intra aici Typing")
                this.setState({
                    messageTyping: "Admin is typing ...",
                });
            }
            else
            {
                console.log("Intra aici")
                this.setState({
                    messageTyping: '',
                });
            }
        }

    }

    onReceivedMessageFromAdmin = (msg) => {

        if(msg.clientID === this.cookieRef.current.props.cookies.get("id"))
        {
            this.setState({
                messageReceived: msg.message,
            });

            this.printMessage(this.state.messageReceived);
            this.setState({
                messageTyping: '',
                messageRead: '',
            });

            this.scrollToBottom();
        }
    }

    sendMessage(messageDTO)
    {
        this.setState(({
            //messageTextArea: this.state.messageTextArea + " " + messageDTO.message,
            clientMessage: '',
            chatDisplayed: this.state.chatDisplayed.concat(<Input style={{backgroundColor: '#5a7277', width:'50%', marginLeft:'50%',resize:'none', color:'#ffffff'}}
                                                                  type="textarea"
                                                                  value={this.cookieRef.current.props.cookies.get("name") + ":\n" + messageDTO.message}
                                                                  disabled
                                                                  cols='30'
                                                                  rows={messageDTO.message.length/53+2}
            />),
            messageRead: '',
        }));
        console.log(messageDTO);

        return API_CLIENT.messageFromClient(messageDTO, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully sent message! " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }

        });
    }

    handleChange = event => {

        //const name = event.target.name;
        const value = event.target.value;

        this.setState({
            clientMessage: value,
        });

        if(this.state.clientID !== '')
        {
            if(value !== '')
            {
                let messageTypingDTO = {
                    messageTyping:'typing',
                    clientID: this.cookieRef.current.props.cookies.get("id"),
                };

                return API_CLIENT.clientTyping(messageTypingDTO, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {
                        console.log("Successfully sent message! " + result);
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: error
                        }));
                    }

                });
            }
            else
            {
                console.log("Intra aici notyping");
                let messageTypingDTO = {
                    messageTyping:'notyping',
                    clientID: this.cookieRef.current.props.cookies.get("id"),
                };

                return API_CLIENT.clientTyping(messageTypingDTO, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {
                        console.log("Successfully sent message! " + result);
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: error
                        }));
                    }

                });
            }
        }

    };


    handleSubmit()
    {
        if(this.state.clientMessage === '')
        {
            console.log("Empty message");
        }
        else
        {
            let messageDTO = {
                message:this.state.clientMessage,
                clientID: this.cookieRef.current.props.cookies.get("id"),
                adminID: 'e50762ef-1719-471e-8315-b0576da2af6f',
                name: this.cookieRef.current.props.cookies.get("name"),
            };

            console.log("Mesaj " + messageDTO.message);
            console.log("ID " + messageDTO.clientID);
            this.sendMessage(messageDTO);

            this.scrollToBottom();
        }
    }

    sendMessageRead(){

        if(this.state.chatDisplayed.length>0)
        {
            let lastInput = this.state.chatDisplayed[this.state.chatDisplayed.length-1];
            let stringLast = lastInput.props.value;
            console.log(stringLast);
            //console.log("Intra aici nou");

            if(stringLast.includes('ADMIN'))
            {
                let messageReadDTO = {
                    messageRead:'read',
                    clientID: this.cookieRef.current.props.cookies.get("id"),
                };

                return API_CLIENT.clientRead(messageReadDTO, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {
                        console.log("Successfully sent message! " + result);
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: error
                        }));
                    }

                });
            }
        }

    }

    componentDidMount() {
        //this.fetchId();
        this.fetchDevicesClient(this.cookieRef.current.props.cookies.get("id"));
        this.fetchRole();
        this.fetchUserName();
    }

    componentDidUpdate() {
        this.scrollToBottom();
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

                <SockJsClient
                    url={SOCKET_URL_CHAT}
                    topics={['/messageToClient/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaAdmin => this.onReceivedMessageFromAdmin(msgDeLaAdmin)}
                    debug={false}
                />

                <SockJsClient
                    url={SOCKET_URL_TYPING}
                    topics={['/typingFromAdmin/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaAdminTyping => this.onReceivedMessageFromAdminTyping(msgDeLaAdminTyping)}
                    debug={false}
                />

                <SockJsClient
                    url={SOCKET_URL_READ}
                    topics={['/readFromAdmin/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaAdminRead => this.onReceivedMessageFromAdminRead(msgDeLaAdminRead)}
                    debug={false}
                />

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


                <Card style={{paddingBottom:'2%'}}>
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

                <Card style={{paddingTop:'2%', paddingBottom:'2%'}}>
                    <Row>
                        {/*<Col sm={{size: '8', offset: 2}}>*/}
                        {/*    <Input type="textarea" id='messages received' rows = '10'  readOnly={true}*/}
                        {/*           value={this.state.messageTextArea}*/}
                        {/*    />*/}
                        {/*</Col>*/}
                        <Col sm={{size: '8', offset: 2}}>
                            <div ref={this.divRef} style={{overflowY:"scroll", minHeight:"30vh", maxHeight:"30vh"}}>
                                {this.state.chatDisplayed}
                            </div>
                        </Col>
                    </Row>
                    <p style={{textAlign:'center'}}>{this.state.messageTyping}</p>
                    <p style={{textAlign:'center'}}>{this.state.messageRead}</p>
                    <Row style={{paddingTop:'1%'}}>
                        <Col sm={{size: '7', offset: 2}}>
                            <Input name='clientMessage' id='clientMessageField'
                                   placeholder="Type your message"
                                   onChange={this.handleChange}
                                   onClick={this.sendMessageRead}
                                   value={this.state.clientMessage}
                            />
                        </Col>
                        <Col sm={{size: '3', offset: 0}}>
                            <Button style={{width:'27%'}} type={"submit"} onClick={this.handleSubmit}> Send </Button>
                        </Col>
                    </Row>
                </Card>


                <CookieUser ref={this.cookieRef} />
            </div>
        )

    }
}


export default withRouter(ClientContainer);
