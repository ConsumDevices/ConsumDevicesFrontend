import React from 'react';
import validate from "./validators/device-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class DeviceFormUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'Update the name',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                description: {
                    value: '',
                    placeholder: 'Update the description',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Update the address',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                maxHourlyConsumption: {
                    value: '',
                    placeholder: 'Update the consumption',
                    valid: false,
                    touched: false,
                    validationRules: {
                        maxHourlyConsumptionValidator: true,
                        isRequired: true
                    }
                },
                username: {
                    value: '',
                    placeholder: 'Update the username',
                    valid: false,
                    touched: false,
                    //validationRules: {
                        //minLength: 2,
                    //}
                },
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };


    updateDevice(device) {
        return API_DEVICES.updateDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }


    //cand dai submit dai register la persoana
    handleSubmit() {
        let device = {
            name: this.state.formControls.name.value,
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            maxHourlyConsumption: this.state.formControls.maxHourlyConsumption.value,
            username: this.state.formControls.username.value,
        };

        console.log(device);
        this.updateDevice(device);
    }

    //si aici render, cu componente noi
    render() {
        return (
            <div style={{backgroundColor: '#e5c9c9'}}>
                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div className={"error-message row"}> * Name must have a valid format </div>}
                </FormGroup>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                    <div className={"error-message"}> * Description must have a valid format</div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                    {this.state.formControls.address.touched && !this.state.formControls.address.valid &&
                    <div className={"error-message row"}> * Address must have a valid format </div>}
                </FormGroup>

                <FormGroup id='maxHourlyConsumption'>
                    <Label for='maxHourlyConsumptionField'> maxHourlyConsumption: </Label>
                    <Input name='maxHourlyConsumption' id='maxHourlyConsumptionField' placeholder={this.state.formControls.maxHourlyConsumption.placeholder}
                           min={0} max={10000} type="number" step="0.1"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.maxHourlyConsumption.value}
                           touched={this.state.formControls.maxHourlyConsumption.touched? 1 : 0}
                           valid={this.state.formControls.maxHourlyConsumption.valid}
                           required
                    />
                </FormGroup>
                {this.state.formControls.maxHourlyConsumption.touched && !this.state.formControls.maxHourlyConsumption.valid &&
                <div className={"error-message row"}> * MaxHourlyConsumption must have a valid format </div>}

                <FormGroup id='username'>
                    <Label for='usernameField'> username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.username.value}
                           touched={this.state.formControls.username.touched? 1 : 0}
                           valid={this.state.formControls.username.valid}
                    />
                </FormGroup>

                    <Row>
                        <Col sm={{size: '4', offset: 5}}>
                            <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                        </Col>
                    </Row>

                {
                    //acolade pentru cod
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default DeviceFormUpdate;
