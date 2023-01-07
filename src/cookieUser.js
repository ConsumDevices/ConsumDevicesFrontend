import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

class CookieUser extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.cookies.get("id") || "",
            email: this.props.cookies.get("email") || "",
            password: this.props.cookies.get("password") || "",
            name: this.props.cookies.get("name") || "",
            age: this.props.cookies.get("age") || "",
            role: this.props.cookies.get("role") || "neLogat",
            address: this.props.cookies.get("address") || "",

        };
    }

    handleCookie = (result) => {
        const { cookies } = this.props;
        cookies.set("id", result.id, { path: "/" ,});
        cookies.set("email", result.email, { path: "/" });
        cookies.set("password", result.password, { path: "/" });
        cookies.set("name", result.name, { path: "/" });
        cookies.set("age", result.age, { path: "/" });
        cookies.set("role", result.role, { path: "/" });
        cookies.set("address", result.address, { path: "/" });
        //this.setState({ user: cookies.get("user") });
        this.setState({ id: cookies.get("id") });
        this.setState({ email: cookies.get("email") });
        this.setState({ password: cookies.get("password") });
        this.setState({ name: cookies.get("name") });
        this.setState({ age: cookies.get("age") });
        this.setState({ role: cookies.get("role") });
        this.setState({ address: cookies.get("address") });
    };

    clearOnLogout(){
        const { cookies } = this.props;
        cookies.set("id", "", { path: "/" });
        cookies.set("email", "", { path: "/" });
        cookies.set("password", "", { path: "/" });
        cookies.set("name", "", { path: "/" });
        cookies.set("age", "", { path: "/" });
        cookies.set("role", "neLogat", { path: "/" });
        cookies.set("address", "", { path: "/" });
        //this.setState({ user: cookies.get("user") });
        this.setState({ id: cookies.get("id") });
        this.setState({ email: cookies.get("email") });
        this.setState({ password: cookies.get("password") });
        this.setState({ name: cookies.get("name") });
        this.setState({ age: cookies.get("age") });
        this.setState({ role: cookies.get("role") });
        this.setState({ address: cookies.get("address") });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default withCookies(CookieUser);