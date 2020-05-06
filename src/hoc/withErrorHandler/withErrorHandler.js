import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary'

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state= {
            error: null
        }
        componentWillMount() {
            axios.interceptors.request.use(req=>{
                this.setState({error: null})
                return req;
            })
            axios.interceptors.response.use(res=>res, error => {
                this.setState({error: error})
            })
        }

        errorConfirmedHandler = () => {
            this.setState({error: null})
        }
        render() {
            return (
                <Auxiliary>
                    <Modal 
                        show={this.state.error}
                        removeModal={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxiliary>
            )
                
            
        }
    }
}

export default withErrorHandler;