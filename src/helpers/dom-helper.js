export default class domHelper {
  static serializeDomToString(dom) {
    const serializer = new XMLSerializer()
    return serializer.serializeToString(dom)
  }

  static parseStringToDom(str) {
    const parser = new DOMParser()
    return parser.parseFromString(str, 'text/html')
  }

  static wrapTextNodes(dom) {
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

  static unWrapTextNodes(dom) {
    dom.body.querySelectorAll('text-editor').forEach(element => {
      element.parentNode.replaceChild(element.firstChild, element)
    })
  }

  static wrapImages(dom) {
    dom.body.querySelectorAll('img').forEach((img, i) => {
      img.setAttribute('editableImgId', i)
    })
    return dom
  }

  static unWrapImages(dom) {
    dom.body.querySelectorAll('[editableImgId]').forEach(img => img.removeAttribute('editableImgId'))
  }
}
