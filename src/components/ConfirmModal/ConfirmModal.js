import React from 'react'
import UIkit from 'uikit'

export const ConfirmModal = ({modal, target, method}) =>
  <div id={target} uk-modal={modal.toString()}>
    <div className="uk-modal-dialog uk-modal-body">
      <h2 className="uk-modal-title">Сохранение</h2>
      <p>Вы действительно хотите сохранить изменения?</p>
      <p className="uk-text-right">
        <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" type="button">Отменить
        </button>
        <button className="uk-button uk-button-primary uk-modal-close" onClick={() => method(() => {
          UIkit.notification({message: 'Успешно сохранено', status: 'success'})
        }, () => {
          UIkit.notification({message: 'Ошибка сохранения', status: 'danger'})
        })}
                type="button">Опубликовать
        </button>
      </p>
    </div>
  </div>


export default ConfirmModal
