import React, {useState, useEffect} from 'react'
let titleDom
let keywordsDom
let descriptionDom

export const EditorMeta = ({modal, target, virtualDom}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')

  const getMeta = dom => {
    titleDom = dom.head.querySelector('title') || dom.head.appendChild(dom.createElement('title'))

    keywordsDom = dom.head.querySelector('meta[name="keywords"]')
    if (!keywordsDom) {
      keywordsDom = dom.head.appendChild(dom.createElement('meta'))
      keywordsDom.setAttribute('name', 'keywords')
      keywordsDom.setAttribute('content', '')
    }

    descriptionDom = dom.head.querySelector('meta[name="description"]')
    if (!descriptionDom) {
      descriptionDom = dom.head.appendChild(dom.createElement('meta'))
      descriptionDom.setAttribute('name', 'description')
      descriptionDom.setAttribute('content', '')
    }

    setTitle(titleDom.innerHTML)
    setKeywords(keywordsDom.getAttribute('content'))
    setDescription(descriptionDom.getAttribute('content'))
  }

  const applyMeta = () => {
    titleDom.innerHTML = title
    keywordsDom.setAttribute('content', keywords)
    descriptionDom.setAttribute('content', description)
  }

  useEffect(() => {
    getMeta(virtualDom)
  }, [virtualDom])

  return <>
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Редактирование meta тегов</h2>
        <form>
          <div className="uk-margin">
            <input className="uk-input" type="text" placeholder="Title" value={title}
                   onChange={e => setTitle(e.target.value)}/>
          </div>
          <div className="uk-margin">
            <textarea className="uk-textarea" rows="5" placeholder="Keywords" value={keywords}
                      onChange={e => setKeywords(e.target.value)}/>
          </div>
          <div className="uk-margin">
            <textarea className="uk-textarea" rows="5" placeholder="Description" value={description}
                      onChange={e => setDescription(e.target.value)}/>
          </div>
        </form>
        <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" type="button">Отменить
          </button>
          <button className="uk-button uk-button-primary uk-modal-close"
                  type="button" onClick={applyMeta}>Применить
          </button>
        </p>
      </div>
    </div>
  </>
}

export default EditorMeta
