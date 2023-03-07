import { useLocalStorage } from '@vueuse/core'

export const liuLiAdminUrl = useLocalStorage('liuli-admin-url', '', {
  listenToStorageChanges: true,
})

export const liuLiToken = useLocalStorage('liuli-token', '', {
  listenToStorageChanges: true,
})

export const liuLiDefaultTags = useLocalStorage('liuli-default-tags', '', {
  listenToStorageChanges: true,
})
