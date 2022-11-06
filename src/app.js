import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import UserContainer from './user/user-container'
import DeviceContainer from './device/device-container'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';

class App extends React.Component {


    render() {

        //aici facem routarea, pentru fiecare pagina o sa punem o ruta
        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />

                        <Route
                            exact
                            path='/user'
                            render={() => <UserContainer/>}
                        />

                        <Route
                            exact
                            path='/device'
                            render={() => <DeviceContainer/>}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
