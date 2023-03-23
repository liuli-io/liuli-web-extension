<template>
  <main class="h-screen min-h-md flex flex-col justify-center items-center px-4 py-10  text-gray-700 dark:text-gray-200">
    <carbon-settings class="icon-btn mx-2 text-2xl" />
    <p class="my-2 opacity-50">
      {{ $t('options.desc') }}
    </p>
    <div class="w-full flex flex-col items-center my-8 gap-5">
      <div class="w-full flex flex-col justify-center items-center ">
        <input
          v-model="formData.adminUrl"
          :placeholder="$t('options.adminUrl')"
          :aria-label="$t('options.adminUrl')"
          type="text"
          autocomplete="false"
          class="inp dark:bg-black"
        />
        <label v-if="showAdminUrlError" class=" text-red-600">
          {{ AdminUrlError }}
        </label>
      </div>

      <div class="w-full flex flex-col justify-center items-center ">
        <input
          v-model="formData.token"
          :placeholder="$t('options.token')"
          :aria-label="$t('options.token')"
          type="text"
          autocomplete="false"
          class="inp dark:bg-black"
        />
        <label v-if="showTokenError" class=" text-red-600">
          {{ AdminTokenError }}
        </label>
      </div>

      <Select v-model="formData.defaultTags" class="w-full max-w-[330px]" :placeholder="$t('options.default_tag')" :get-position="getPosition"></Select>
      <div class="text-left">
        <span v-for="i in formData.defaultTags" :key="i" class="inline-block px-2 py-1  m-1 rounded-md bg-red-100 text-[#333]">{{ i }}</span>
      </div>
    </div>
    <button class="btn" @click="commitFormData">
      {{ $t('common.btn-confirm') }}
      <eos-icons-bubble-loading v-if="showLoadIcon" class=" align-text-bottom text-[12px]"></eos-icons-bubble-loading>
    </button>
    <Footer />
    <div class="mt-4">
      <pixelarticons-zap class="align-middle" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { liuLiAdminUrl, liuLiDefaultTags, liuLiToken } from '~/logic/storage'

const showAdminUrlError = ref(false)

const showTokenError = ref(false)

const AdminUrlError = ref('123')

const AdminTokenError = ref('123')

const showLoadIcon = ref(false)

const formData = reactive({
  adminUrl: liuLiAdminUrl.value,
  token: liuLiToken.value,
  defaultTags: JSON.parse(JSON.stringify(liuLiDefaultTags.value)),
})

const getPosition = () => ['IT互联网', '前端资讯', '后端资讯', ' JavaScript', '爬虫', '面经']

const commitFormData = () => {
  if (!formData.adminUrl.trim() || !formData.token.trim()) return alert('请填写完整信息再点击提交')
  showLoadIcon.value = true
  chrome.runtime.sendMessage({ type: 'API', methods: 'POST', url: 'http://api.txapi.cn/v1/c/love_talk?token=Z1QljZOZiT4NTG', params: {}, headers: {} }, (respond) => {
    if (respond && respond.code === 200) {
      setTimeout(() => {
        showLoadIcon.value = false
        showAdminUrlError.value = true
        showTokenError.value = true
        AdminUrlError.value = '该url不合规范'
        AdminTokenError.value = '该token无效'

        liuLiAdminUrl.value = formData.adminUrl
        liuLiDefaultTags.value = formData.defaultTags
        liuLiToken.value = formData.token
      }, 500)
    }
  })
}
</script>
