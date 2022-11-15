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
import UserFormInsert from "./components/user-form-insert";
import UserFormUpdate from "./components/user-form-update";
import UserFormDelete from "./components/user-form-delete";

import * as API_USERS from "./api/user-api"
import UserTable from "./components/user-table";
import NavigationBar from "../navigation-bar";
import { withRouter } from "react-router-dom";

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

class UserContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleFormInsert = this.toggleFormInsert.bind(this);
        this.toggleFormUpdate = this.toggleFormUpdate.bind(this);
        this.toggleFormDelete = this.toggleFormDelete.bind(this);
        this.reloadInsert = this.reloadInsert.bind(this);
        this.reloadUpdate = this.reloadUpdate.bind(this);
        this.reloadDelete = this.reloadDelete.bind(this);
        this.state = {
            selectedInsert: false,
            selectedUpdate: false,
            selectedDelete: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null
        };
    }

    componentDidMount() {
        this.fetchRole();
        this.fetchUsers();
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
        return API_USERS.getRole((result, status, err) => {

            console.log(result);
            if (result !== null && status === 200) {
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
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
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

            </div>
        )

    }
}


export default withRouter(UserContainer);
