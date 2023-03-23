<template>
  <main
    class="w-[300px] px-4 pt-5 pb-4 text-center text-gray-700 dark:text-gray-200"
  >
    <img src="/assets/logo.png" class="w-6 icon-btn mx-2 text-2xl" />
    <p class="my-2 opacity-50">
      {{ $t('popup.desc') }}
    </p>
    <!-- 已配置 -->
    <div v-if="(liuLiAdminUrl&&liuLiDefaultTags.length&&liuLiToken)" class="mb-16">
      <div>
        {{ res }}
      </div>
      <div class="my-4 text-left">
        <span v-for="i in tags" :key="i" class="inline-block px-2 py-1  m-1 rounded-md bg-red-100 text-[#333]">{{ i }}</span>
      </div>
      <Select v-model="tags" :get-position="getPosition"></Select>
      <div class="flex justify-end gap-2 mt-2">
        <button class="btn mt-2" @click="onClearTags">
          清空
        </button>
        <button class="btn mt-2" @click="onSetDefaultTags">
          默认
        </button>
        <button class="btn mt-2" @click="onAddUrl">
          添加
        </button>
      </div>
    </div>
    <!-- 未配置 -->
    <div v-else>
      <p>{{ $t('popup.to_setting') }}</p>
      <button class="btn mt-2" @click="openOptionsPage">
        {{ $t('popup.open_options') }}
      </button>
    </div>

    <Footer />
  </main>
</template>

<script setup lang="ts">
import { liuLiAdminUrl, liuLiDefaultTags, liuLiToken } from '~/logic/storage'
const tags = ref(['爬虫', '前端资讯'] as string[])
const getPosition = () => ['IT互联网', '前端资讯', '后端资讯', ' JavaScript', '爬虫', '面经']
const res = ref('n')
function openOptionsPage() {
  chrome.runtime.openOptionsPage()
}

const onClearTags = () => {
  tags.value = []
}

const onSetDefaultTags = () => {
  tags.value = JSON.parse(JSON.stringify(liuLiDefaultTags.value))
}

const onAddUrl = async() => {
  await chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    res.value = tabs[0].url!
  })
  chrome.runtime.sendMessage({ type: 'API', methods: 'POST', url: 'http://api.txapi.cn/v1/c/love_talk?token=Z1QljZOZiT4NTG', params: {}, headers: {} }, (respond) => {
    if (respond && respond.code === 200)alert('操作失败，请检查您的网络')
  })
}
</script>
