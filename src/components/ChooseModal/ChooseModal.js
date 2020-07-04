import React from 'react'

export const ChooseModal = ({modal, target, data, redirect}) =>
  <div id={target} uk-modal={modal.toString()}>
    <div className="uk-modal-dialog uk-modal-body">
      <h2 className="uk-modal-title">Открыть</h2>
      <ul className="uk-list uk-list-divider">
        {data.map(page =>
          <li key={`page-${page}`}>
            <a className="uk-link-muted uk-modal-close" href={page} onClick={e => redirect(e, page)}>
              {page}
            </a>
          </li>
        )}
      </ul>
      <p className="uk-text-right">
        <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" type="button">Отменить
        </button>
      </p>
    </div>
  </div>


export default ChooseModal
