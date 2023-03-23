import { sendMessage, onMessage } from 'webext-bridge'

interface IMessageAPI {
  type: 'API'
  method: 'GET'|'POST'
  data: Object
  url: string
  headers: Object
  params: Object
}
interface IMessageInfo {
  type: 'MESSAGE'
  info: string
}
type IMessage =IMessageAPI|IMessageInfo

let previousTabId = 0

const useFetch = async(message: IMessageAPI) => {
  const res = await (await fetch(message.url)).json()
  return res
}

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

// communication example: send previous tab title from background page
// see shim.d.ts for type decleration
chrome.tabs.onActivated.addListener(async({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }
  const tab = await chrome.tabs.get(previousTabId)
  previousTabId = tabId
  if (!tab)
    return

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async() => {
  try {
    const tab = await chrome.tabs.get(previousTabId)
    return {
      title: tab?.id,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

chrome.runtime.onMessage.addListener((message: IMessage, sender, sendResponse) => {
  switch (message.type) {
    case 'API': {
      useFetch(message).then(sendResponse)
      return true
    }
    default: {
      sendResponse(undefined)
      break
    }
  }
})
