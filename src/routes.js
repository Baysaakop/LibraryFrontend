import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './layout/Home';
import Login from './user/Login';
import Signup from './user/Signup';
import Profile from './user/Profile';
import Logout from './user/Logout';
import Staff from './layout/Staff';
import BookList from './book/BookList';
import Admin from './layout/Admin';
import Help from './layout/Help';

function BaseRouter () {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/help" component={Help} />
            {/* Item urls */}            
            <Route exact path="/books" component={BookList} />
            {/* User urls */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/profile" component={Profile} />            
            {/* User pages */}
            <Route exact path="/staff" component={Staff} />
            <Route exact path="/admin" component={Admin} />
        </Switch>
    )    
}
export default BaseRouter;