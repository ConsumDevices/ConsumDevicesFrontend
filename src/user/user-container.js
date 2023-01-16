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
import UserFormInsert from "./components/user-form-insert";
import UserFormUpdate from "./components/user-form-update";
import UserFormDelete from "./components/user-form-delete";

import * as API_USERS from "./api/user-api"
import UserTable from "./components/user-table";
import NavigationBar from "../navigation-bar";
import { withRouter } from "react-router-dom";
import CookieUser from "../cookieUser";
import SockJsClient from "react-stomp";
import {HOST} from "../commons/hosts";
import * as API_CLIENT from "../client/api/client-api";

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

const SOCKET_URL_CHAT = HOST.backend_api + '/chatAdmin';
const SOCKET_URL_TYPING = HOST.backend_api + '/typingClient';
const SOCKET_URL_READ = HOST.backend_api + '/readClient';

class UserContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleFormInsert = this.toggleFormInsert.bind(this);
        this.toggleFormUpdate = this.toggleFormUpdate.bind(this);
        this.toggleFormDelete = this.toggleFormDelete.bind(this);
        this.reloadInsert = this.reloadInsert.bind(this);
        this.reloadUpdate = this.reloadUpdate.bind(this);
        this.reloadDelete = this.reloadDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendMessageRead = this.sendMessageRead.bind(this);

        this.state = {
            selectedInsert: false,
            selectedUpdate: false,
            selectedDelete: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            adminMessage: '',
            clientID: '',
            messageReceived: '',
            chatDisplayed: [],
            clientName: '',
            messageTyping: '',
            messageRead: '',
        };

        this.cookieRef = React.createRef();
        this.divRef = React.createRef();
    }

    scrollToBottom = () => {
        this.divRef.current.scroll({ top: this.divRef.current.scrollHeight + this.state.messageReceived.length, behavior: 'smooth' });
    };

    onConnection = () => {
        console.log("Connected with Websocket!");
    }

    printMessage(message)
    {
        this.setState(({
            chatDisplayed: this.state.chatDisplayed.concat(<Input style={{backgroundColor: '#169db0', width:'50%',resize:'none'}}
                                                                  type="textarea"
                                                                  value={this.state.clientName + ":\n" + message}
                                                                  disabled
                                                                  cols='30'
                                                                  rows={message.length/53+2}
            />)
        }));
    }

    onReceivedMessageFromClientRead = (msg) => {

        //console.log("Intra aici");
        if(msg.clientID === this.state.clientID)
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

    onReceivedMessageFromClientTyping = (msg) => {

        console.log("Intra aici");
        if(msg.clientID === this.state.clientID)
        {
            if(msg.messageTyping === 'typing')
            {
                //console.log("Intra aici Typing")
                this.setState({
                    messageTyping: this.state.clientName + " is typing ...",
                });
            }
            else
            {
                //console.log("Intra aici")
                this.setState({
                    messageTyping: '',
                });
            }
        }

    }

    onReceivedMessageFromClient = (msg) => {

        //console.log("Intra aici");
        if(msg.adminID === this.cookieRef.current.props.cookies.get("id"))
        {
            this.setState({
                messageReceived: msg.message,
                clientName: msg.name,
                clientID:msg.clientID,
                messageTyping: '',
                messageRead: '',
            });
            this.printMessage(this.state.messageReceived);
            this.scrollToBottom();
        }
    }

    sendMessage(messageDTO)
    {
        if(this.state.clientID !== '')
        {
            this.setState(({
                //messageTextArea: this.state.messageTextArea + " " + messageDTO.message,
                adminMessage: '',
                chatDisplayed: this.state.chatDisplayed.concat(<Input style={{backgroundColor: '#5a7277', width:'50%', marginLeft:'50%',resize:'none', color:'#ffffff'}}
                                                                      type="textarea"
                                                                      value={"ADMIN:\n" + messageDTO.message}
                                                                      disabled
                                                                      cols='30'
                                                                      rows={messageDTO.message.length/53+2}
                />),
                messageRead: '',
            }));
            console.log(messageDTO);
            return API_USERS.messageFromAdmin(messageDTO, (result, status, error) => {
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
            console.log("Nu este client");
            this.setState(({
                //messageTextArea: this.state.messageTextArea + " " + messageDTO.message,
                adminMessage: '',
            }));
        }
    }

    handleChange = event => {

        //const name = event.target.name;
        const value = event.target.value;

        this.setState({
            adminMessage: value,
        });

        if(this.state.clientID !== '')
        {
            if(value !== '')
            {
                let messageTypingDTO = {
                    messageTyping:'typing',
                    clientID: this.state.clientID,
                };

                return API_USERS.adminTyping(messageTypingDTO, (result, status, error) => {
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
                    clientID: this.state.clientID,
                };

                return API_USERS.adminTyping(messageTypingDTO, (result, status, error) => {
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
        if(this.state.adminMessage === '')
        {
            console.log("Empty message");
        }
        else
        {
            let messageDTO = {
                message:this.state.adminMessage,
                clientID: this.state.clientID,
                adminID: this.cookieRef.current.props.cookies.get("id"),
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

            if(stringLast.includes(this.state.clientName))
            {
                if(this.state.clientID !== '')
                {
                    let messageReadDTO = {
                        messageRead:'read',
                        clientID: this.state.clientID,
                    };

                    return API_USERS.adminRead(messageReadDTO, (result, status, error) => {
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
    }


    componentDidMount() {
        this.fetchRole();
        this.fetchUsers();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    fetchUsers() {
        return API_USERS.getUsers((result, status, err) => {

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


    fetchRole() {
        // return API_USERS.getRole((result, status, err) => {
        //
        //     console.log(result);
        //     if (result !== null && status === 200) {
        //         //daca nu avem admin, redirectionam la home
        //         if(result === "neLogat")
        //         {
        //             let newPath = '/'
        //             this.props.history.push(newPath);
        //         }
        //         else if(result === 'admin' || result === 'Admin')
        //         {
        //             //let newPath = '/user'
        //             //this.props.history.push(newPath);
        //         }
        //         else if(result === 'client' || result === 'Client')
        //         {
        //             let newPath = '/client'
        //             this.props.history.push(newPath);
        //         }
        //     } else {
        //         this.setState(({
        //             errorStatus: status,
        //             error: err
        //         }));
        //     }
        // });

        //this.cookieRef.current.state.role;
        //return (result) => {
        //console.log(result);
        let result = this.cookieRef.current.props.cookies.get("role");
        if (result !== null) {
            //daca nu avem admin, redirectionam la home
            if(result === "neLogat")
            {
                let newPath = '/'
                this.props.history.push(newPath);
            }
            else if(result === 'admin' || result === 'Admin')
            {
                //let newPath = '/user'
                //this.props.history.push(newPath);
            }
            else if(result === 'client' || result === 'Client')
            {
                let newPath = '/client'
                this.props.history.push(newPath);
            }
        }
        //};
    }

    toggleFormInsert() {
        this.setState({selectedInsert: !this.state.selectedInsert});
    }

    toggleFormUpdate() {
        this.setState({selectedUpdate: !this.state.selectedUpdate});
    }

    toggleFormDelete() {
        this.setState({selectedDelete: !this.state.selectedDelete});
    }


    reloadInsert() {
        this.setState({
            isLoaded: false
        });
        this.toggleFormInsert();
        this.fetchRole();
        this.fetchUsers();
    }

    reloadUpdate() {
        this.setState({
            isLoaded: false
        });
        this.toggleFormUpdate();
        this.fetchRole();
        this.fetchUsers();
    }

    reloadDelete() {
        this.setState({
            isLoaded: false
        });
        this.toggleFormDelete();
        this.fetchRole();
        this.fetchUsers();
    }

    render() {
        return (
            <div style={styleDiv}>
                <NavigationBar />
                <CardHeader style={styleHeader}>
                    <strong> User Management </strong>
                </CardHeader>

                <SockJsClient
                    url={SOCKET_URL_CHAT}
                    topics={['/messageToAdmin/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaClient => this.onReceivedMessageFromClient(msgDeLaClient)}
                    debug={false}
                />

                <SockJsClient
                    url={SOCKET_URL_TYPING}
                    topics={['/typingFromClient/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaClientTyping => this.onReceivedMessageFromClientTyping(msgDeLaClientTyping)}
                    debug={false}
                />

                <SockJsClient
                    url={SOCKET_URL_READ}
                    topics={['/readFromClient/message']}
                    onConnect={this.onConnection}
                    onDisconnect={console.log("Disconnected chat!")}
                    onMessage={msgDeLaClientRead => this.onReceivedMessageFromClientRead(msgDeLaClientRead)}
                    debug={false}
                />

                <Card>
                    <br/>
                    <Row style={{marginLeft: "0.3%"}}>
                        <Col sm={{size: '0', offset: 2}}>
                            <Button color="primary" onClick={this.toggleFormInsert}>Add User </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleFormUpdate}>Update User </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleFormDelete}>Delete User </Button>
                        </Col>
                        <Row style={{marginLeft: "15.2%"}}>
                            <Col sm={{size: '10', offset: 11}}>
                                <Button color="primary" onClick={()=>{this.props.history.push('/')}}>Logout</Button>
                            </Col>
                        </Row>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            {this.state.isLoaded && <UserTable tableData = {this.state.tableData}/>}
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
                    <p style={{textAlign:'center'}}>{this.state.messageRead}</p>
                    <p style={{textAlign:'center'}}>{this.state.messageTyping}</p>
                    <Row style={{paddingTop:'1%'}}>
                        <Col sm={{size: '7', offset: 2}}>
                            <Input name='adminMessage' id='adminMessageField'
                                   placeholder="Type your message"
                                   onChange={this.handleChange}
                                   onClick={this.sendMessageRead}
                                   value={this.state.adminMessage}
                            />
                        </Col>
                        <Col sm={{size: '3', offset: 0}}>
                            <Button style={{width:'27%'}} type={"submit"} onClick={this.handleSubmit}> Send </Button>
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selectedInsert} toggle={this.toggleFormInsert}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormInsert}> Add User: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <UserFormInsert reloadHandler={this.reloadInsert}/>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedUpdate} toggle={this.toggleFormUpdate}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormUpdate}> Update User: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <UserFormUpdate reloadHandler={this.reloadUpdate}/>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedDelete} toggle={this.toggleFormDelete}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormDelete}> Delete User: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <UserFormDelete reloadHandler={this.reloadDelete}/>
                    </ModalBody>
                </Modal>

                <CookieUser ref={this.cookieRef} />
            </div>
        )

    }
}


export default withRouter(UserContainer);
