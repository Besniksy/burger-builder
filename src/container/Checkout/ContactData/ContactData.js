import React, { Component } from 'react';
import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index'


class ContactData extends Component {

    state = {

        orderForm: {
            
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postal code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true

            }

        },
        
        formIsValid: false
    }


    orderHandler = (event) => {
        event.preventDefault()
        const formData = {}

        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value

        }

        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            formOrder: formData,
            userId: this.props.userId


        }

        this.props.onOrderBurger(order, this.props.token)


    }

    onChangeHandler = (event, formIdentifier) => {
        const updatedForm = {...this.state.orderForm}
        const updatedFormElement = {...updatedForm[formIdentifier]}
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.onValidation(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true
        updatedForm[formIdentifier] = updatedFormElement
        let formIsValid = true;

        for(let formIdentifier in updatedForm){
            formIsValid = updatedForm[formIdentifier].valid && formIsValid
        }
        this.setState({orderForm: updatedForm, formIsValid: formIsValid})

        this.setState({orderForm: updatedForm, formIsValid: formIsValid})
    }

    onValidation(value, rules){
        let isValid = true;

        if(rules.required){
            isValid = value.trim() !== "" && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid

        
    }

    render(){

        const formElementsArray = []

        for(let key in this.state.orderForm){
            formElementsArray.push(
                {
                    id: key,
                    config: this.state.orderForm[key]
                }
            )
        }
        
        
        
        let form =( <form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement=>(
                <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event)=>this.onChangeHandler(event, formElement.id)}
                invalid={!formElement.config.valid}
                isRequired={formElement.config.validation}
                touched={formElement.config.touched}/>
            )
                
            )}           
            
            <Button disabled={!this.state.formIsValid} btnType="Success" >ORDER</Button>
        </form>)

        if (this.props.loading){
            form = <Spinner />
        }



        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data!</h4>
                {form}
                
                

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));