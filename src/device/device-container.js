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
import DeviceForm from "./components/device-form";

import * as API_DEVICES from "./api/device-api"
import DeviceTable from "./components/device-table";
import NavigationBar from "../navigation-bar";
import { withRouter } from "react-router-dom";


const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

class DeviceContainer extends React.Component {

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
        return API_DEVICES.getRole((result, status, err) => {

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
                            <Button color="primary" onClick={this.toggleForm}>Add Device </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleForm}>Update Device </Button>
                        </Col>
                        <Col sm={{size: '0', offset: 1}}>
                            <Button color="primary" onClick={this.toggleForm}>Delete Device </Button>
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

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#e5c9c9'}} toggle={this.toggleForm}> Add Device: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#e5c9c9'}}>
                        <DeviceForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        )

    }
}


export default withRouter(DeviceContainer);
