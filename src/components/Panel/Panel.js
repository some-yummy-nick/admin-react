import React from 'react'

export const Panel = () => {
  return <div className="panel">
    <div>
      <a href="/">
        <img src="../img/Block1/Logo.png" alt=""/>
      </a>
    </div>
    <div>
      <button uk-toggle="target: #modal-open"
              className="uk-button uk-button-primary uk-margin-small-right">Открыть
      </button>
      <button uk-toggle="target: #modal-save"
              className="uk-button uk-button-primary uk-margin-small-right">Опубликовать
      </button>
      <button uk-toggle="target: #modal-meta"
              className="uk-button uk-button-primary uk-margin-small-right">Редактировать meta
      </button>
      <button uk-toggle="target: #modal-backup"
              className="uk-button uk-button-default uk-margin-small-right">Восстановить
      </button>
      <button uk-toggle="target: #modal-logout"
              className="uk-button uk-button-danger">Выход
      </button>
    </div>
  </div>

}


export default Panel
