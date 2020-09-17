import './modal.scss';
import React, { Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';

export const ModalComponent = (
    label,
    list,
    onHandleCancel,
    onHandleOk,
    onHandleTextInput
) => {
    return (
        <Fragment>
            <div className='blur-background'></div>
            <div className='modal_container'>
                <label>{label}</label>
                {
                    !isEmpty(list) ? list.map(({
                        id,
                        isSelected = false,
                        text,
                        handleOnClick
                    }) => {
                        return (
                            <div key={id} className='block' onClick={handleOnClick}>
                                <input className='block_radio' type='radio' checked={isSelected} />
                                <span className='block_text'>{text}</span>
                            </div>
                        )
                    })
                    : <input className='input-box' type='text' onChange={(eve) => onHandleTextInput(eve)} />
                }
                <span className='seperator'></span>
                <div className='button-wrapper'>
                    <div className='cancel-button' onClick={onHandleCancel}>CANCEL</div>
                    <div className='ok-button' onClick={onHandleOk}>OK</div>
                </div>
            </div>
        </Fragment>
    )

}