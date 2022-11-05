import React from 'react'
import styles from '../styles/project-style.css';

class ErrorPage extends React.Component {

    //returneaza pagina asta in caz ca dam un link la o pagina care nu exista
    render() {
            return <h3 className={styles.errorTitle}>Page not found.</h3>;
    }
}

export default ErrorPage
