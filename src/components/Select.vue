<template>
  <div ref="selectDivRef" v-click class="relative w-full text-gray-700 overflow-visible dark:text-gray-200">
    <input
      v-model="searchText"
      type="text"
      :placeholder="props.placeholder"
      class="inp dark:bg-black"
      @focus="isShowPositionBox=true"
      @keydown.tab.space.enter="onKeyDownSelect()"
    >
    <div v-if="isShowPositionBox" class="absolute w-full max-h-32  mt-3  z-30 overflow-y-scroll rounded-md border-1 bg-scroll bg-white dark:bg-black scroll-box">
      <div v-for="i in currentPosition" :key="i" class="p-2 mx-2 text-left cursor-pointer hover:text-red-200" :class="activePosition.includes(i)?'text-red-300':''" @click="onSelect(i)">
        {{ i }}
      </div>
      <div v-if="!currentPosition.length" class="p-2 mx-2 text-left ">
        暂无
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
interface IProps{
  getPosition: Function
  modelValue: string[]
  placeholder?: string
}
const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])
const selectDivRef = ref(null)

const searchText = ref('')

const isShowPositionBox = ref(false)

const originPosition = reactive(props.getPosition() as string[])

const currentPosition = ref([] as string[])

let activePosition = reactive(props.modelValue as string[])

const onSelect = (selectItem: string) => {
  activePosition.includes(selectItem) ? activePosition.splice(activePosition.indexOf(selectItem), 1) : activePosition.push(selectItem)
  emits('update:modelValue', activePosition)
}

const onKeyDownSelect = () => {
  if (!searchText.value.trim()) return
  if (activePosition.includes(searchText.value.trim())) { activePosition.splice(activePosition.indexOf(searchText.value.trim()), 1) }
  else {
    activePosition.push(searchText.value.trim())
    originPosition.push(searchText.value.trim())
  }
  searchText.value = ''
}

onClickOutside(selectDivRef, () => {
  if (isShowPositionBox.value)
    isShowPositionBox.value = false
})

watch(searchText, () => {
  if (searchText.value.trim()) currentPosition.value = originPosition.filter(i => i.includes(searchText.value.trim()))
  else
    currentPosition.value = originPosition
}, { immediate: true })

watch(() => props.modelValue, () => {
  activePosition = props.modelValue
})
</script>

<style lang="scss" scoped>

</style>
