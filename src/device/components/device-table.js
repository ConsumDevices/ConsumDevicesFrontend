import React from "react";
import Table from "../../commons/tables/table";

//header + accessor
const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'MaxHourlyConsumption',
        accessor: 'maxHourlyConsumption',
    },
    {
        Header: 'Username',
        accessor: 'username',
    }
];

const filters = [
    {
        accessor: 'name',
    },
];

class DeviceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        )
    }
}

export default DeviceTable;