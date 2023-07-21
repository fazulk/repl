<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Monaco from '../monaco/Monaco.vue'
import type { EditorEmits, EditorProps } from './types'
import { html } from 'js-beautify'

const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()

defineOptions({
  editorType: 'monaco',
})

function removeTemplateTags(code: string) {
  return code.replace(/<template>/g, '').replaceAll(/<\/template>/g, '')
}

const displayedHtml = ref('')

watch(
  () => props.value,
  (code: string) => {
    const a = removeTemplateTags(code)
    console.log('a:', a)
    displayedHtml.value = a
  },
  { immediate: true }
)

// function formatHtml() {
//   const formatted = html(preCode.value, { indent_size: 2 })
//   console.log('formatted:', formatted)
//   // emit('change', `<template>${html(preCode.value, {indent_size: 2 })}</template>`)
// }

const onChange = (code: string) => {
  // emit('change', `<template>${code}</template>`)
}
</script>

<template>
  <!-- <button @click="formatHtml">Format HTML</button> -->
  <Monaco
    @change="onChange"
    :filename="filename"
    :value="displayedHtml"
    :readonly="readonly"
    :mode="mode"
  />
</template>
