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

const styleDiv = {overflow: 'hidden'};
const styleHeader = {textAlign: 'center', backgroundColor: '#e5c9c9'};

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
        };
    }

    componentDidMount() {
        //this.fetchId();
        this.fetchDevicesClient();
        this.fetchRole();
        this.fetchUserName();
    }

    fetchDevicesClient() {
        //this.fetchId();
        //console.log("Params aici: " + this.params);
        return API_CLIENT.getDevicesClient((result, status, err) => {

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
        return API_CLIENT.getRole((result, status, err) => {

            if (result !== null && status === 200) {
                if(result === "neLogat")
                {
                    let newPath = '/'
                    this.props.history.push(newPath);
                }
                else if(result === 'admin' || result === 'Admin')
                {
                    let newPath = '/user'
                    this.props.history.push(newPath);
                }
                else if(result === 'client' || result === 'Client')
                {
                    //let newPath = '/device'
                    //this.props.history.push(newPath);
                }
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
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
        return API_CLIENT.getUserName((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    nameUser: result
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
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
        this.toggleFormChart();
        this.fetchRole();
        this.fetchUserName();
        this.fetchDevicesClient();
    }

    render() {
        return (
            <div style={styleDiv}>
                <CardHeader style={styleHeader}>
                    <strong> Hello, {this.state.nameUser}. This are your devices </strong>
                </CardHeader>
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
                            <ClientChartForm reloadHandler={this.reloadChart}/>
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

            </div>
        )

    }
}


export default withRouter(ClientContainer);
