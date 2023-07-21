<script setup lang="ts">
import CodeMirror, { type Props } from '../codemirror/CodeMirror.vue'
import { computed, onMounted, ref, watch } from 'vue'
import type { EditorEmits, EditorProps } from './types'
import { html } from 'js-beautify'

defineOptions({
  editorType: 'codemirror',
})

const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()

const onChange = (code: string) => {
  emit('change', `<template>${code}</template>`)
}

function removeTemplateTags(code: string) {
  // code = code.trim()
  // code = `<div class="p">code</div>`
  return code.replace(/<template>/g, '').replaceAll(/<\/template>/g, '')
}

const displayedHtml = ref('')

watch(
  () => props.value,
  (code: string) => {
    displayedHtml.value = removeTemplateTags(code)
  }
)

const modes: Record<string, Props['mode']> = {
  css: 'css',
  html: 'htmlmixed',
  js: {
    name: 'javascript',
  },
  json: {
    name: 'javascript',
    json: true,
  },
  ts: {
    name: 'javascript',
    typescript: true,
  },
  vue: 'htmlmixed',
}

function formatHtml(value?: string) {
  const formatted = html(value || displayedHtml.value, { indent_size: 2 })
  onChange(formatted)
}

onMounted(() => {
  const formatted = removeTemplateTags(props.value)
  formatHtml(formatted)
})

const activeMode = computed(() => {
  const { mode: forcedMode, filename } = props
  const mode = modes[forcedMode || filename.split('.').pop()!]
  return filename.lastIndexOf('.') !== -1 && mode ? mode : modes.js
})
</script>

<template>
  <button @click="() => formatHtml()">Format</button>
  <CodeMirror @change="onChange" :value="displayedHtml" :mode="activeMode" />
</template>
