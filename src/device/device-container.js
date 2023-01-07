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
import DeviceFormInsert from "./components/device-form-insert";
import DeviceFormUpdate from "./components/device-form-update";
import DeviceFormDelete from "./components/device-form-delete";

import * as API_DEVICES from "./api/device-api"
import DeviceTable from "./components/device-table";
import NavigationBar from "../navigation-bar";
import { withRouter } from "react-router-dom";

import CookieUser from "../cookieUser";


const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

class DeviceContainer extends React.Component {

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

        this.cookieRef = React.createRef();
    }

    componentDidMount() {
        this.fetchRole();
        this.fetchDevices();
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {

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
        // return API_DEVICES.getRole((result, status, err) => {
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
        //return (result) => {
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
        this.fetchDevices();
    }

    reloadUpdate() {
        this.setState({
            isLoaded: false
        });
        this.toggleFormUpdate();
        this.fetchRole();
        this.fetchDevices();
    }

    reloadDelete() {
        this.setState({
            isLoaded: false
        });
        this.toggleFormDelete();
        this.fetchRole();
        this.fetchDevices();
    }

    render() {
        return (
            <div style={styleDiv}>
                <NavigationBar />
                <CardHeader style={styleHeader}>
                    <strong> Device Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row style={{marginLeft: "0.3%"}}>
                        <Col sm={{size: '0', offset: 2}}>
                            <Button color="primary" onClick={this.toggleFormInsert}>Add Device </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleFormUpdate}>Update Device </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleFormDelete}>Delete Device </Button>
                        </Col>
                        <Row style={{marginLeft: "12.2%"}}>
                            <Col sm={{size: '10', offset: 11}}>
                                <Button color="primary" onClick={()=>{this.props.history.push('/')}}>Logout</Button>
                            </Col>
                        </Row>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 2}}>
                            {this.state.isLoaded && <DeviceTable tableData = {this.state.tableData}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                                            errorStatus={this.state.errorStatus}
                                                            error={this.state.error}
                                                        />   }
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selectedInsert} toggle={this.toggleFormInsert}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormInsert}> Add Device: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <DeviceFormInsert reloadHandler={this.reloadInsert}/>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedUpdate} toggle={this.toggleFormUpdate}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormUpdate}> Update Device: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <DeviceFormUpdate reloadHandler={this.reloadUpdate}/>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedDelete} toggle={this.toggleFormDelete}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleFormDelete}> Delete Device: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <DeviceFormDelete reloadHandler={this.reloadDelete}/>
                    </ModalBody>
                </Modal>
                <CookieUser ref={this.cookieRef} />
            </div>
        )

    }
}


export default withRouter(DeviceContainer);
