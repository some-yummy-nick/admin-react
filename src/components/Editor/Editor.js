import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import UIkit from 'uikit'

import '../../helpers/iframeLoader.js'
import domHelper from '../../helpers/dom-helper'
import EditorText from '../../components/EditorText'
import Spinner from '../../components/Spinner'

let virtualDom = null
export const Editor = () => {
  const [pageList, setPageList] = useState([])
  const [pageName, setPageName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('index.html')
  const iframe = useRef(null)

  const init = page => {
    open(page, updateIsLoaded)
    loadPageList()
  }

  const open = (page, cb) => {
    setCurrentPage(page)
    axios.get(`../${page}?rnd=${Math.random()}`)
      .then(res => domHelper.parseStringToDom(res.data))
      .then(domHelper.wrapTextNodes)
      .then(dom => {
        virtualDom = dom
        return dom
      })
      .then(domHelper.serializeDomToString)
      .then(html => axios.post('./api/saveTempPage.php', {html}))
      .then(() => iframe.current.load('../temp.html'))
      .then(() => enableEditing())
      .then(() => injectStyles())
      .then(cb)
  }

  const save = (onSuccess, onError) => {
    updateIsLoading()
    const newDom = virtualDom.cloneNode(virtualDom)
    domHelper.unWrapTextNodes(newDom)
    const html = domHelper.serializeDomToString(newDom)
    axios.post('./api/savePage.php', {pageName: currentPage, html})
      .then(onSuccess)
      .catch(onError)
      .finally(updateIsLoaded)
  }

  const enableEditing = () => {
    iframe.current.contentDocument.body.querySelectorAll('text-editor')
      .forEach(element => {
        const id = element.getAttribute('nodeId')
        const virtualElement = virtualDom.body.querySelector(`[nodeId="${id}"]`)
        new EditorText(element, virtualElement)
      })
  }

  const injectStyles = () => {
    const style = iframe.current.contentDocument.createElement('style')
    style.innerHTML = `
    text-editor:hover{
       outline:3px solid orange;
       outline-offset:8px
    }
    text-editor:focus{
       outline:3px solid red;
       outline-offset:8px
    }
    `
    iframe.current.contentDocument.head.appendChild(style)
  }

  const loadPageList = () => {
    axios.get('./api')
      .then(res => setPageList(res.data))
  }

  const createNewPage = () => {
    axios.post('./api/createNewPage.php', {name: pageName})
      .then(() => {
        loadPageList()
        setPageName('')
      })
      .catch(() => alert('Страница уже существует!'))
  }

  const deletePage = page => {
    axios.post('./api/deletePage.php', {name: page})
      .then(() => {
        loadPageList()
      })
      .catch(() => alert('Страницы не существует!'))
  }

  const updateIsLoading = () => {
    setIsLoading(true)
  }

  const updateIsLoaded = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    init(currentPage)
  }, [])

  const modal = true

  let spinner
  isLoading ? spinner = <Spinner active/> : <Spinner/>

  return <>
    <iframe ref={iframe} src={currentPage} frameBorder="0"></iframe>

    {spinner}

    <div className="panel">
      <button uk-toggle="target: #modal-save"
              className="uk-button uk-button-primary">Опубликовать
      </button>
    </div>

    <div id="modal-save" uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Сохранение</h2>
        <p>Вы действительно хотите сохранить изменения?</p>
        <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
          <button className="uk-button uk-button-primary uk-modal-close" onClick={() => save(() => {
            UIkit.notification({message: 'Успешно сохранено', status: 'success'})
          }, () => {
            UIkit.notification({message: 'Ошибка сохранения', status: 'danger'})
          })}
                  type="button">Опубликовать
          </button>
        </p>
      </div>
    </div>
    {/*<input value={pageName} onChange={e => setPageName(e.target.value)} type="text"/>*/}
    {/*<button onClick={createNewPage}>Создать страницу</button>*/}
    {/*<div className="pages">*/}
    {/*{pageList.map((page, index) =>*/}
    {/*<div key={`page-${index}`}>*/}
    {/*{page}*/}
    {/*<button onClick={() => deletePage(page)}>(x)</button>*/}
    {/*</div>*/}
    {/*)}*/}
    {/*</div>*/}
  </>
}

export default Editor
