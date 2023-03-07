<template>
  <main class="h-screen min-h-md flex flex-col justify-center items-center px-4 py-10  text-gray-700 dark:text-gray-200">
    <carbon-settings class="icon-btn mx-2 text-2xl" />
    <p class="my-2 opacity-50">
      {{ $t('options.desc') }}
    </p>
    <div class="w-full flex flex-col items-center my-8 gap-5">
      <input
        v-model="formData.adminUrl"
        :placeholder="$t('options.adminUrl')"
        :aria-label="$t('options.adminUrl')"
        type="text"
        autocomplete="false"
        class="inp dark:bg-black"
      />
      <input
        v-model="formData.token"
        :placeholder="$t('options.token')"
        :aria-label="$t('options.token')"
        type="text"
        autocomplete="false"
        class="inp dark:bg-black"
      />
      <input
        v-model="formData.defaultTags"
        :placeholder="$t('options.default_tag')"
        :aria-label="$t('options.default_tag')"
        type="text"
        autocomplete="false"
        class="inp dark:bg-black"
      />
      <div>
        <button class="btn" @click="commitFormData">
          {{ $t('common.btn-confirm') }}
        </button>
        <eos-icons-bubble-loading v-if="showLoadIcon" class="float-right mx-2 text-xl"></eos-icons-bubble-loading>
      </div>
    </div>
    <Footer />
    <div class="mt-4">
      <pixelarticons-zap class="align-middle" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { liuLiAdminUrl, liuLiDefaultTags, liuLiToken } from '~/logic/storage'
const showLoadIcon = ref(false)
const formData = reactive({
  adminUrl: liuLiAdminUrl.value,
  token: liuLiToken.value,
  defaultTags: liuLiDefaultTags.value,
})
const commitFormData = () => {
  showLoadIcon.value = true
  liuLiAdminUrl.value = formData.adminUrl
  liuLiDefaultTags.value = formData.defaultTags
  liuLiToken.value = formData.token
  setTimeout(() => {
    showLoadIcon.value = false
  }, 1000)
}
</script>
