import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux'

class Logout extends Component {

    componentDidMount(){
        this.props.logout()
    }

    render(){
        return <Redirect to="/" />
    }
}



const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.authLogout())
    }
}

export default connect(null, mapDispatchToProps)(Logout)