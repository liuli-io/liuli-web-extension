<template>
  <main class="h-screen min-h-md flex flex-col justify-center items-center px-4 py-10  text-gray-700 dark:text-gray-200">
    <img src="/assets/logo.png" class="w-12 mx-2 text-2xl" />
    <div class="w-full flex flex-col items-center my-8 gap-5">
      <div class="w-full flex flex-col justify-center items-center ">
        <input v-model="formData.adminUrl" :placeholder="$t('options.adminUrl')" :aria-label="$t('options.adminUrl')"
          type="text" autocomplete="false" class="inp dark:bg-black" />
      </div>

      <div class="w-full flex flex-col justify-center items-center ">
        <input v-model="formData.token" :placeholder="$t('options.token')" :aria-label="$t('options.token')" type="text"
          autocomplete="false" class="inp dark:bg-black" />
      </div>

      <el-select v-model="formData.defaultTags" multiple filterable="true" allow-create collapse-tags-tooltip
        collapse-tags clearable :reserve-keyword="false" :popper-append-to-body="false"
        :placeholder="$t('options.default_tag')" @keyup.enter="onElSelectEnter($event)">
        <el-option v-for=" item in tagOptions " :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <button class="btn" @click="commitFormData">
      {{ $t('common.btn-confirm') }}
      <eos-icons-bubble-loading v-if="showLoadIcon" class=" align-text-bottom text-[12px]"></eos-icons-bubble-loading>
      <ion-checkmark-sharp v-if="showResultIcon && resultIconType"
        class="align-text-bottom text-[11px]"></ion-checkmark-sharp>
      <ion-close v-if="showResultIcon && !resultIconType" class="align-text-bottom text-[11px]"></ion-close>
    </button>
    <Footer :is-popup="false" />
    <div class="mt-4">
      <pixelarticons-zap class="align-middle" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import { reactive } from 'vue'
import { bmApi } from '~/logic/api'
import { isConfigCompeted } from '~/logic/config'
import { liuLiAdminUrl, liuLiConfigIsCompeted, liuLiDefaultTags, liuLiToken } from '~/logic/storage'

let res

const showLoadIcon = ref(false)
const showResultIcon = ref(false)
const resultIconType = ref(true)

const formData = reactive({
  adminUrl: liuLiAdminUrl.value,
  token: liuLiToken.value,
  defaultTags: JSON.parse(JSON.stringify(liuLiDefaultTags.value)),
})
const tagOptions = ref([] as string[])

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
    formData.defaultTags.value.push(inputValue)
    tagOptions.value.push(inputValue)
  }
}

const commitFormData = async () => {
  if (!formData.adminUrl.trim() || !formData.token.trim()) return alert('请填写信息后再点击提交')
  liuLiAdminUrl.value = formData.adminUrl
  liuLiDefaultTags.value = formData.defaultTags
  liuLiToken.value = formData.token
  showLoadIcon.value = true
  showResultIcon.value = false
  await isConfigCompeted()
  setTimeout(() => {
    showLoadIcon.value = false
    showResultIcon.value = true

    if (liuLiConfigIsCompeted.value) {
      resultIconType.value = true
      setTimeout(() => { showResultIcon.value = false }, 1000)
    }

    else {
      resultIconType.value = false
      setTimeout(() => { showResultIcon.value = false }, 1000)
    }
  }, 400)
}

onMounted(async () => {
  res = await bmApi.getTagList({ tag: '' })
  tagOptions.value = res.status === 200 ? res.data.map((i: any) => i.tag) : []
})
</script>
