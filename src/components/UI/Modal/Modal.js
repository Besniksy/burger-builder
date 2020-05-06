import React from 'react';
import classes from './Modal.css';
import Backdrop from '../Backdrop/Backdrop'
import Auxiliary from '../../../hoc/Auxiliary'


const modal = (props) =>(
    <Auxiliary>
        <Backdrop show={props.show} clicked={props.removeModal}/>
        <div className={classes.Modal}
            style={{
                opacity: props.show ? "1" : "0",
                transform: props.show ? "translateY(0)" : "translateY(-100vh)"
            }}>

            {props.children}
        </div>
    </Auxiliary>
)

export default modal;