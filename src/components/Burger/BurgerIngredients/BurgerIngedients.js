import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './BurgerIngredients.css';

class BurgerIngredients extends Component {
    render() {

        let ingredient = null;

        switch (this.props.type) {
            case ('bread-bottom'):
                ingredient = <div className={classes.BreadBottom}></div>;
                break;
            case ('bread-top'):
                ingredient = (
                    <div className={classes.BreadTop}>
                        <div className={classes.Seeds1}></div>
                        <div className={classes.Seeds2}></div>
                    </div>
                );
                break;
            case ('meat'):
                ingredient = <div className={classes.Meat}></div>;
                break;
            case ('cheese'):
                ingredient = <div className={classes.Cheese}></div>;
                break;
            case ('salad'):
                ingredient = <div className={classes.Salad}></div>;
                break;
            case ('sauce'):
                ingredient = <div className={classes.Sauce}></div>;
                break;
            default:
                ingredient = null;

        }
        return ingredient;
    }
};
BurgerIngredients.propTypes = {
    type:propTypes.string.isRequired
};

export default BurgerIngredients;