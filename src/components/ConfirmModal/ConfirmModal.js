import React from 'react'

export const ConfirmModal = ({modal, target, method, text}) =>
  <div id={target} uk-modal={modal.toString()}>
    <div className="uk-modal-dialog uk-modal-body">
      <h2 className="uk-modal-title">{text.title}</h2>
      <p>{text.desc}</p>
      <p className="uk-text-right">
        <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" type="button">Отменить
        </button>
        <button className="uk-button uk-button-primary uk-modal-close" onClick={() => method()}
                type="button">{text.btn}
        </button>
      </p>
    </div>
  </div>


export default ConfirmModal
