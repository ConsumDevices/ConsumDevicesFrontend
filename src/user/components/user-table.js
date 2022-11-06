import React from "react";
import Table from "../../commons/tables/table";

//header + accessor
const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Age',
        accessor: 'age',
    },
    {
        Header: 'Address',
        accessor: 'address'
    },
    {
        Header: 'Email',
        accessor: 'email'
    }
];

//filter dupa nume
const filters = [
    {
        accessor: 'name',
    },
    {
        accessor: 'address',
    }
];

class UserTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    //render e un tabel
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

export default UserTable;