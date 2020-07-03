import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import '../../helpers/iframeLoader.js'

export const Editor = () => {
  const [pageList, setPageList] = useState([])
  const [pageName, setPageName] = useState('')
  const [currentPage, setCurrentPage] = useState('index.html')
  const iframe = useRef(null)
  let virtualDom = null
  const init = page => {
    open(page)
    loadPageList()
  }

  const open = page => {
    setCurrentPage(`../${page}?rnd=${Math.random()}`)
    axios.get(`../${page}`)
      .then(res => parseStringToDom(res.data))
      .then(wrapTextNode)
      .then(dom => {
        virtualDom = dom
        return dom
      })
      .then(serializeDomToString)
      .then(html => axios.post('./api/saveTempPage.php', {html}))
      .then(() => iframe.current.load('../temp.html'))
      .then(() => enableEditing())
  }

  const serializeDomToString = dom => {
    const serializer = new XMLSerializer()
    return serializer.serializeToString(dom)
  }

  const parseStringToDom = str => {
    const parser = new DOMParser()
    return parser.parseFromString(str, 'text/html')
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

  const wrapTextNode = dom => {
    const body = dom.body
    let textNodes = []

    function recursion(element) {
      element.childNodes.forEach(node => {
        if (node.nodeName === '#text' && node.nodeValue.trim().length > 0) {
          textNodes.push(node)
        } else {
          recursion(node)
        }
      })
    }

    recursion(body)
    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement('text-editor')
      node.parentNode.replaceChild(wrapper, node)
      wrapper.appendChild(node)
      wrapper.setAttribute('nodeId', i)
    })
    return dom
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
