import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import '../../helpers/iframeLoader.js'
import domHelper from '../../helpers/dom-helper'
import EditorText from '../../components/EditorText'

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
      .then(() => injectStyles())
  }

  const save = () => {
    const newDom = virtualDom.cloneNode(virtualDom)
    domHelper.unWrapTextNodes(newDom)
    const html = domHelper.serializeDomToString(newDom)
    axios.post('./api/savePage.php', {pageName: currentPage, html})
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
