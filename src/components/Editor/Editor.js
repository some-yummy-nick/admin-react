import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import '../../helpers/iframeLoader.js'
import domHelper from "../../helpers/dom-helper"

let virtualDom = null
export const Editor = () => {
  const [pageList, setPageList] = useState([])
  const [pageName, setPageName] = useState('')
  const [currentPage, setCurrentPage] = useState('index.html')
  const iframe = useRef(null)

  const init = page => {
    open(page)
    loadPageList()
  }

  const open = page => {
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
  }

  const save = () => {
    const newDom = virtualDom.cloneNode(virtualDom)
    domHelper.unWrapTextNodes(newDom)
    const html = domHelper.serializeDomToString(newDom)
    axios.post('./api/savePage.php', {pageName:currentPage, html})
  }

  const onTextEdit = element => {
    const id = element.getAttribute('nodeId')
    virtualDom.body.querySelector(`[nodeId="${id}"]`).innerHTML = element.innerHTML
  }

  const enableEditing = () => {
    iframe.current.contentDocument.body.querySelectorAll('text-editor')
      .forEach(element => {
        element.contentEditable = 'true'
        element.addEventListener('input', () => {
          onTextEdit(element)
        })
      })
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

  useEffect(() => {
    init(currentPage)
  }, [])

  return <>
    <button onClick={() => save()}>save</button>
    <iframe ref={iframe} src={currentPage} frameBorder="0"></iframe>
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
