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
import UserForm from "./components/user-form";

import * as API_USERS from "./api/user-api"
import UserTable from "./components/user-table";
import NavigationBar from "../navigation-bar";
import { withRouter } from "react-router-dom";

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

class UserContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            selected: false,
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

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }


    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
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
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            <Button color="primary" onClick={this.toggleForm}>Add User </Button>
                        </Col>
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

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleForm}> Add User: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <UserForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        )

    }
}


export default withRouter(UserContainer);
