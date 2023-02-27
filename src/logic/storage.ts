import { useLocalStorage } from '@vueuse/core'

export const storageDemo = useLocalStorage('webext-demo', 'Storage Demo', {
  listenToStorageChanges: true,
})

export const liuLiToken = useLocalStorage('liuli-token', '', {
  listenToStorageChanges: true,
})

export const liuLiKey = useLocalStorage('liuli-key', '', {
  listenToStorageChanges: true,
})
