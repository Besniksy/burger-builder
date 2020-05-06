import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'



class BurgerBuilder extends Component {

    state = {
        purchasing: false
    };

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0
    }
    

    purchaseBurger = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true})
        }else {
            this.props.onSetAuthRedirectionPath('/checkout')
            this.props.history.push('/auth')
        }
    }
    
    removeModal = () => {
        this.setState({purchasing: false})
    }

    continueOrderHandler = () => {
        this.props.onPurchaseInit()
        this.props.history.push('/checkout')
    }

    componentDidMount(){
        this.props.onInitIngredients()
     
    }

    
    

    render(){
        const disabledInfo = {...this.props.ings} 
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0
        }


        let orderSummary = null;

        
        let burger = this.props.error ? <p>Ingredients can't be showed</p> : <Spinner/>

        if (this.props.ings) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        isAuth = {this.props.isAuthenticated}
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.prc}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseBurger} />
                </Auxiliary>);

            orderSummary = <OrderSummary
                orderedIngredients={this.props.ings}
                cancelOrder={this.removeModal}
                price={this.props.prc}
                continue={this.continueOrderHandler} />

        }
        
        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} removeModal={this.removeModal}>
                    {orderSummary}
                </Modal>
                    {burger}



            </Auxiliary>

        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        prc: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token != null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectionPath: (path) => dispatch(actions.setAuthRedirectionPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));