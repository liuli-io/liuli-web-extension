<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable space-before-function-paren -->
<template>
  <main class="w-[300px] px-4 pt-5 pb-1 text-center text-gray-700 dark:text-gray-200">
    <!-- 顶部 -->
    <div class="flex justify-between items-center border-b border-light-700">
      <div class="flex justify-start">
        <img src="/assets/logo.png" class="w-4 mx-2 text-2xl" />
        <span class="font-medium">LIULI</span>
      </div>
      <div>
        <a class="icon-btn mx-2 text-[1.3em]" rel="noreferrer" href="https://github.com/howie6879/liuli" target="_blank"
          title="GitHub">
          <carbon-logo-github />
        </a>
        <carbon-settings class="icon-btn mx-2  text-[1.3em]" :title="$t('common.open_options')"
          @click="openOptionsPage" />
      </div>
    </div>
    <!-- 已配置且配置成功 -->
    <div v-if="liuLiConfigIsCompeted" class="mb-2">
      <input v-model="url" :placeholder="$t('popup.url')" :aria-label="$t('popup.url')" type="text" autocomplete="false"
        class="inp dark:bg-black my-4" />

      <el-select v-model="tags" multiple :filterable="true" allow-create clearable collapse-tags-tooltip collapse-tags
        :reserve-keyword="false" :popper-append-to-body="false" :placeholder="$t('popup.tags')"
        @keyup.enter="onElSelectEnter()">
        <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <input v-model="title" :placeholder="$t('popup.title')" :aria-label="$t('popup.title')" type="text"
        autocomplete="false" class="inp dark:bg-black my-4" />

      <textarea v-model="detail" :placeholder="$t('popup.detail')" :aria-label="$t('popup.detail')" autocomplete="false"
        class="inp min-h-[60px] max-h-[120px] leading-6 scroll-box dark:bg-black" />

      <div class="flex justify-end gap-2 mt-2">
        <button class="btn mt-2" @click="onAddUrl">
          {{ btnType === 'add' ? $t('common.btn-add') : $t('common.btn-update') }}
          <eos-icons-bubble-loading v-if="showLoadIcon" class="align-text-bottom text-[12px]"></eos-icons-bubble-loading>
          <ion-checkmark-sharp v-if="showResultIcon && resultIconType"
            class="align-text-bottom text-[11px]"></ion-checkmark-sharp>
          <ion-close v-if="showResultIcon && !resultIconType" class="align-text-bottom text-[11px]"></ion-close>
        </button>
      </div>
    </div>
    <!-- 未配置 -->
    <div v-else class="mt-4 mb-2">
      <p>{{ $t('popup.to_setting') }}</p>
      <button class="btn mt-4" @click="openOptionsPage">
        {{ $t('common.open_options') }}
      </button>
    </div>
    <Footer :is-popup="true"></Footer>
  </main>
</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import { isConfigCompeted } from '~/logic/config'
import { getCurrentTabInfo, openOptionsPage } from '~/logic/browser'
import { liuLiDefaultTags, liuLiConfigIsCompeted } from '~/logic/storage'
import { bmApi } from '~/logic/api'

let res

const btnType = ref('add')
const showLoadIcon = ref(false)
const showResultIcon = ref(false)
const resultIconType = ref(true)
const tabInfo = ref()
const url = ref()
const tags = ref([] as string[])
const tagOptions = ref([] as string[])
const detail = ref('')
const title = ref('')

const onElSelectEnter = () => {
  // 选择的元素 null为没有选择
  const elSelectDropdownItemHover = document.querySelector('.el-select-dropdown__item .hover')
  // 第一个元素 为自己输入的
  const elSelectDropdownItemFirst = document.querySelector('.el-select-dropdown__item')
  // 第一个元素为null说明 自己没有输入 tagOptions也为空 直接返回
  if (elSelectDropdownItemFirst === null) return
  // 去除span标签
  const inputValue = elSelectDropdownItemFirst!.innerHTML.slice(6, -7)
  if (elSelectDropdownItemHover === null && !tagOptions.value.includes(inputValue)) {
    tags.value.push(inputValue)
    tagOptions.value.push(inputValue)
  }
}

const onAddUrl = async () => {
  showLoadIcon.value = true
  res = await bmApi.updateBookmark({ tags: tags.value.length === 0 ? liuLiDefaultTags.value : tags.value, url: url.value, title: title.value, des: detail.value })
  if (res.status === 200) {
    resultIconType.value = true
    // eslint-disable-next-line no-unused-expressions
    setTimeout(() => {
      showLoadIcon.value = false
      showResultIcon.value = true
    }, 400)
    setTimeout(() => { showResultIcon.value = false }, 1200)
  }
  else {
    resultIconType.value = false
    setTimeout(() => {
      showLoadIcon.value = false
      showResultIcon.value = true
    }, 400)
    setTimeout(() => { showResultIcon.value = false }, 1200)
  }
}

watch(() => url.value, async () => {
  res = await bmApi.getBookmarkFromUrl({ url: url.value })
  if (res.status === 200 && res.data.url) {
    btnType.value = 'update'
    tags.value = res.data.tags
    detail.value = res.data.des
    title.value = res.data.title
  }
  else {
    btnType.value = 'add'
    tags.value = JSON.parse(JSON.stringify(liuLiDefaultTags.value))
    detail.value = ''
    title.value = tabInfo.value.title
  }
})

onMounted(async () => {
  await isConfigCompeted()
  // res = await (await fetch('http://api.txapi.cn/v1/c/love_talk?token=Z1QljZOZiT4NTG')).json()
  tabInfo.value = await getCurrentTabInfo()
  url.value = tabInfo.value.url
  res = await bmApi.getTagList({ tag: '' })
  tagOptions.value = res.status === 200 ? res.data.map((i: any) => i.tag) : []
})
</script>

<style scoped></style>
