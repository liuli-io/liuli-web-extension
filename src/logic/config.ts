import { liuLiConfigIsCompeted } from './storage'
import { checkApi } from './api'

export const isConfigCompeted = async() => {
  const res = await checkApi.checkStatus({})
  if (res !== undefined && res.status === 200) liuLiConfigIsCompeted.value = true
  else liuLiConfigIsCompeted.value = false
}
