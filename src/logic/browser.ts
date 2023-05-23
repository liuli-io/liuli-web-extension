import { browser } from 'webextension-polyfill-ts'

export function getBrowser() {
  return typeof browser !== 'undefined' ? browser : chrome
}

export const getCurrentTabInfo = async() => {
  const tabs = await getBrowser().tabs.query({ active: true, currentWindow: true })
  const tab = tabs && tabs[0]
  return {
    url: tab ? tab.url : '',
    title: tab ? tab.title : '',
  }
}

export const openOptionsPage = () => {
  chrome.runtime.openOptionsPage()
  window.close()
}
