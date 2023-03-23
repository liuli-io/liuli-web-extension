/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'

console.info('[vitesse-modernized-chrome-ext] Hello world from content script')

// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-modernized-chrome-ext] Navigate from page "${data.title}"`)
})
chrome.runtime.sendMessage({ type: 'API', methods: 'POST', url: 'http://api.txapi.cn/v1/c/love_talk?token=Z1QljZOZiT4NTG', params: {} }, (respond) => {
  console.log('contentScript DATA:', respond.data)
})
