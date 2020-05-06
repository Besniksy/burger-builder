import React from 'react';
import Auxiliary from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button'


const orderSummary = (props) =>{

 
    const orderedIngredients = Object.keys(props.orderedIngredients)
    .map(igKey=>{return <li key={igKey}>
            <span 
                style={{textTransform: 'capitalize'}}>{igKey}
            </span>: {props.orderedIngredients[igKey]}
        </li>})

    return (
    <Auxiliary>
        <h3>Your order</h3>
        <p>A delicious burger following these ingredients: </p>
        <ul>
        {orderedIngredients}
        </ul>
        <p><strong>Total price: {props.price.toFixed(2)} $</strong></p>
        <p>Continue to checkout?</p>
        <Button btnType={'Danger'} clicked={props.cancelOrder}>CANCEL</Button>
        <Button btnType={'Success'} clicked={props.continue}>CONTINUE</Button>

    </Auxiliary>

    )
}
    
export default orderSummary;