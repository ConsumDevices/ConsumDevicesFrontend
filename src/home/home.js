import React from 'react';

import BackgroundImg from '../commons/images/energyImage.jpeg';

import {Button, Card, Col, Container, Jumbotron, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import HomeForm from "./components/home-form";

import * as API_HOME from "../home/api/home-api";

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
};
const textStyle = {color: 'white', textAlign: 'center'};
const buttonStyle1 = {display: 'inline', margin:'1% 1% 1% 48%', backgroundColor: '#751212'};

class Home extends React.Component {

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

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    componentDidMount() {
        this.fetchRoleLogout();
    }

    fetchRoleLogout() {
        return API_HOME.getRoleLogout((result, status, err) => {

            if (result !== null && status === 200) {
                //daca nu avem admin, redirectionam la home
                if(result === "nelogat")
                {

                }
                else if(result === 'admin' || result === 'Admin')
                {
                    //let newPath = '/user'
                    //this.props.history.push(newPath);
                }
                else if(result === 'client' || result === 'client')
                {

                }
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }



    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        //this.fetchRoleLogout()
        //this.fetchUsers();
    }


    render() {

        return (

            <div>
                <Jumbotron fluid style={backgroundStyle}>
                    <Container fluid>
                        <h1 className="display-3" style={textStyle}>Energy consumption</h1>
                        <p className="lead" style={textStyle}> <b>Test.</b> </p>
                        <hr className="my-2"/>
                        <p  style={textStyle}> <b>Test again </b> </p>
                        <Row>
                            <Button color="primary" style={buttonStyle1} onClick={this.toggleForm}>Login</Button>
                        </Row>
                    </Container>
                </Jumbotron>

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader style={{backgroundColor: '#1a5ec8'}} toggle={this.toggleForm}> Login: </ModalHeader>
                    <ModalBody style={{backgroundColor: '#1a5ec8'}}>
                        <HomeForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        )
    };
}

export default Home

/*
    <h1 className="display-3" style={textStyle}>Integrated Medical Monitoring Platform for Home-care assistance</h1>
<p className="lead" style={textStyle}> <b>Enabling real time monitoring of patients, remote-assisted care services and
    smart intake mechanism for prescribed medication.</b> </p>
<hr className="my-2"/>
<p  style={textStyle}> <b>This assignment represents the first module of the distributed software system "Integrated
    Medical Monitoring Platform for Home-care assistance that represents the final project
    for the Distributed Systems course. </b> </p>
<p className="lead">
    <Button color="primary" onClick={() => window.open('http://coned.utcluj.ro/~salomie/DS_Lic/')}>Learn
        More</Button>
</p>
*/