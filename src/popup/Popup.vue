<template>
  <main
    class="w-[300px] px-4 py-5 text-center text-gray-700 dark:text-gray-200"
  >
    <img src="/assets/logo.png" class="w-6 icon-btn mx-2 text-2xl" />
    <p class="my-2 opacity-50">
      {{ $t('popup.desc') }}
    </p>
    <!-- 未设置key、Token -->
    <div v-if="liuLiToken && liuLiKey">
      <input type="text" />
    </div>

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
import { liuLiToken, liuLiKey } from '~/logic/storage'

function openOptionsPage() {
  chrome.runtime.openOptionsPage()
}
</script>
