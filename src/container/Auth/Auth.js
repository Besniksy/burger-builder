import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom'


class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your e-mail'
                },
                value: '',
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }

        },
        isSignup: true

    }

    componentDidMount(){
        if(!this.props.burgerBuilding && this.props.authRedirectPath !== null){
            this.props.onSetAuthRedirectionPath()
        }
    }


     onChangeHandler = (event, formIdentifier) => {
        const updatedForm = {...this.state.controls}
        const updatedFormElement = {...updatedForm[formIdentifier]}
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.onValidation(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true
        updatedForm[formIdentifier] = updatedFormElement
        let formIsValid = true;

        for(let formIdentifier in updatedForm){
            formIsValid = updatedForm[formIdentifier].valid && formIsValid
        }
        this.setState({controls: updatedForm})

        this.setState({controls: updatedForm})
    }

    onValidation(value, rules){
        let isValid = true;

        if(rules.required){
            isValid = value.trim() !== "" && isValid;
        }

        if(rules.email) {
            isValid = value.includes("@" && ".");
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        return isValid

        
    }

    

    switchSignInHandler = () => {
        this.setState(prevState => ({
            isSignup: !prevState.isSignup
          }));
    }

    submitHandler = (event) => {
        event.preventDefault()
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
    }
    render() {

        const formElementsArray = []

        for(let key in this.state.controls){
            formElementsArray.push(
                {
                    id: key,
                    config: this.state.controls[key]
                }
            )
        }

        let form = (<form on Submit={this.orderHandler}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    changed={(event) => this.onChangeHandler(event, formElement.id)}
                    invalid={!formElement.config.valid}
                    isRequired={formElement.config.validation}
                    touched={formElement.config.touched} />
            )
            )}
        </form>)

        if(this.props.loading){
            form = <Spinner/>
        }
        
        let errorMessage = null
        if(this.props.error) {
            errorMessage = this.props.error
        }

        let authRedirect = null

        if (this.props.isAuth) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }
        return (
            <div className={classes.Auth} >
                {authRedirect}
                {errorMessage}
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType="Success" >SUBMIT</Button>
                </form>
                    <Button btnType="Danger" clicked={this.switchSignInHandler} >SWITCH TO {(this.state.isSignup) ? "SIGNIN" : "SIGNUP"}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token != null,
        authRedirectPath: state.auth.authRedirectPath,
        burgerBuilding: state.burgerBuilder.building
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectionPath: () => dispatch(actions.setAuthRedirectionPath('/')),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);