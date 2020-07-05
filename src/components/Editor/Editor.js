import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import UIkit from 'uikit'

import '../../helpers/iframeLoader.js'
import domHelper from '../../helpers/dom-helper'
import EditorText from '../../components/EditorText'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import ChooseModal from '../../components/ChooseModal'
import Panel from '../../components/Panel'

let virtualDom = null
export const Editor = () => {
  const [pageList, setPageList] = useState([])
  const [backupsList, setBackupsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('index.html')
  const iframe = useRef(null)

  const init = (e, page) => {
    if (e) e.preventDefault()
    updateIsLoading()
    open(page, updateIsLoaded)
    loadPageList()
    loadBackupsList()
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

  const loadBackupsList = () => {
    axios.get('./backups/backups.json')
      .then(res => setBackupsList(res.data.filter(backup => {
        return backup.page === currentPage
      })))
  }

  const restoreBackupsList = (e, backup) => {
    if (e) e.preventDefault()

    UIkit.modal.confirm('Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные данные будут потеряны!',
      {labels: {ok: 'Восстановить', cancel: 'Отмена'}})
      .then(() => {
        updateIsLoading()
        return axios.post('./api/restoreBackup.php', {page: currentPage, file: backup})
      })
      .then(() => {
        open(currentPage, updateIsLoaded)
      })

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

  useEffect(() => {
    loadBackupsList()
  }, [isLoading, currentPage])

  const modal = true

  let spinner
  isLoading ? spinner = <Spinner active/> : <Spinner/>

  return <>
    <iframe ref={iframe} src="" frameBorder="0"></iframe>
    {spinner}
    <Panel/>
    <ConfirmModal modal={modal} target={'modal-save'} method={save}/>
    <ChooseModal modal={modal} target={'modal-open'} data={pageList} redirect={init}/>
    <ChooseModal modal={modal} target={'modal-backup'} data={backupsList} redirect={restoreBackupsList}/>
  </>
}

export default Editor
