import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomLayout from './layout/Layout';
import BaseRouter from './routes';

class App extends Component {

    // componentDidMount() {            
    //     this.props.onTryAutoSignup();
    // }

    render() {
        return (
            <div className="App">
                <Router> 
                    <CustomLayout>
                        <BaseRouter />
                    </CustomLayout>
                </Router>
            </div>
        );
    }    
}
    
export default App;
