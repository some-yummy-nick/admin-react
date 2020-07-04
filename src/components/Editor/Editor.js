import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import '../../helpers/iframeLoader.js'
import domHelper from '../../helpers/dom-helper'
import EditorText from '../../components/EditorText'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import ChooseModal from '../../components/ChooseModal'

let virtualDom = null
export const Editor = () => {
  const [pageList, setPageList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('index.html')
  const iframe = useRef(null)

  const init = (e, page) => {
    if (e) e.preventDefault()
    updateIsLoading()
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
      .then(() => iframe.current.load('../fgrtghghgh5665hfg.html'))
      .then(() => axios.post('./api/deleteTempPage.php'))
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
    axios.get('./api/pageList.php')
      .then(res => setPageList(res.data))
  }

  const updateIsLoading = () => {
    setIsLoading(true)
  }

  const updateIsLoaded = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    init(null, currentPage)
  }, [])

  const modal = true

  let spinner
  isLoading ? spinner = <Spinner active/> : <Spinner/>

  return <>
    <iframe ref={iframe} src={currentPage} frameBorder="0"></iframe>

    {spinner}

    <div className="panel">
      <button uk-toggle="target: #modal-open"
              className="uk-button uk-button-primary uk-margin-small-right">Открыть
      </button>
      <button uk-toggle="target: #modal-save"
              className="uk-button uk-button-primary">Опубликовать
      </button>
    </div>
    <ConfirmModal modal={modal} target={'modal-save'} method={save}/>
    <ChooseModal modal={modal} target={'modal-open'} data={pageList} redirect={init}/>
  </>
}

export default Editor
