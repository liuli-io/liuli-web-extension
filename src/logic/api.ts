import { computed } from 'vue'
import { liuLiToken, liuLiAdminUrl, liuLiConfigIsCompeted } from './storage'
const baseURL = computed(() => `${liuLiAdminUrl.value}${liuLiAdminUrl.value[liuLiAdminUrl.value.length - 1] === '/' ? '' : '/'}api`)

export const checkApi = {
  // 检查接口状态
  checkStatus: async(data: {}) => {
    try {
      const res = await fetch(
        `${baseURL.value}/bm/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'L-X-Token': liuLiToken.value,
          },
          body: JSON.stringify(data),
        },
      )
      return res.json()
    }
    catch (error) {
      liuLiConfigIsCompeted.value = false
    }
  },
}

interface IUpdateBookmarkParams {
  url: string
  tags: string[]
  title: string
  des: string
}

interface IGetTagParams {
  tag: string
}

interface IGetBookmarkFromUrlParams {
  url: string
}

export const bmApi = {
  // 更新浏览器书签内容(没有则创建)
  updateBookmark: async(data: IUpdateBookmarkParams) => {
    const res = await fetch(
      `${baseURL.value}/bm/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'L-X-Token': liuLiToken.value,
        },
        body: JSON.stringify(data),
      },
    )
    return res.json()
  },

  // 通过 url 查询书签
  getBookmarkFromUrl: async(data: IGetBookmarkFromUrlParams) => {
    const res = await fetch(
      `${baseURL.value}/bm/search_url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'L-X-Token': liuLiToken.value,
        },
        body: JSON.stringify(data),
      },
    )
    return res.json()
  },

  // 根据字符串模糊搜索tags
  getTagList: async(data: IGetTagParams) => {
    const res = await fetch(
      `${baseURL.value}/bm/get_tag_list`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'L-X-Token': liuLiToken.value,
        },
        body: JSON.stringify(data),
      },
    )
    return res.json()
  },

}
