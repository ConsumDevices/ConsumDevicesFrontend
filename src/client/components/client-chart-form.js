import React from 'react';
import validate from "./validators/client-validators";
import Button from "react-bootstrap/Button";
import * as API_CLIENT from "../api/client-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import DatePicker from 'react-date-picker';
import Chart from 'react-apexcharts';
import CookieUser from "../../cookieUser";


class ClientChartForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        //this.reloadHandler = this.props.reloadHandler;
        this.cookieRef = React.createRef();

        this.state = {

            startDate: new Date(),

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'Name of device',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
            },

            data : {
                options: {
                    chart: {
                        id: 'energy-chart'
                    },
                    xaxis: {
                        //orele
                        categories: []
                    }
                },
                series: [{
                    name: 'Consumption Values',
                    //valorile
                    data: []
                }]
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
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

    handleSubmit() {
        let device = {
            name: this.state.formControls.name.value
        };

        //console.log(device);
        this.getConsumptions(device.name,this.cookieRef.current.state.id);
    }

    onChange(date){
        this.setState({
            startDate: date
        });
    }

    changeChart(newDate){
        this.setState({
            data: newDate
        });
    }

    //componentDidMount() {
    //    this.getConsumptions();
    //}

    getConsumptions(deviceName, userid) {
        return API_CLIENT.getConsumptions(deviceName, userid, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                console.log("Successfully got device data!");
                console.log(result);
                //Device management: (Filter + Order):

                //this.reloadHandler();
                let hours = [];
                let energyData = [];
                result.forEach(energy => {
                    let selectedDate = this.state.startDate.getFullYear() + '-' + (this.state.startDate.getMonth() + 1) + '-' + this.state.startDate.getDate();
                    let energyDate = energy.date.substr(0, 10)
                    console.log("Selected date: " + selectedDate);
                    console.log("Energy date: " + energyDate);
                    console.log("Value: " + energy.value);
                    //preluam doar instantele din data selectata de user.
                    if (energyDate === selectedDate) {
                        hours.push(energy.date);
                        energyData.push(energy.value);
                    }
                });


                const newData = {
                    options: {
                        chart: {
                            id: 'energy-chart'
                        },
                        xaxis: {
                            categories: hours
                        }
                    },
                    series: [{
                        name: 'Consumption Values',
                        data: energyData
                    }]
                }
                console.log("Timestamps1: " + newData.series.data);
                console.log("Energy values1: " + newData.options.xaxis.categories);

                //this.data = newData;
                this.changeChart(newData);
                console.log("Timestamps: " + this.state.data.series.data);
                console.log("Energy values: " + this.state.data.options.xaxis.categories);


                //onChange(newData)
                //this.changeChart(newData);

            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
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

                <Row>
                    <Col sm={{size: '4', offset: 5}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

                <DatePicker value={this.state.startDate} onChange={ this.onChange } format={"yyyy-MM-dd"}/>

                <Row>
                    <Chart options={this.state.data.options} series={this.state.data.series} type="bar" width={500} height={320} />
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
                <CookieUser ref={this.cookieRef} />
            </div>
        ) ;
    }
}

export default ClientChartForm;