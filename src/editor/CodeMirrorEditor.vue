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
  emit(
    'change',
    `<template><div id="vue-cont-wrapper-classses" class="${props.containerClasses}">${code}</div></template>`
  )
}

function updateEditorCode(code: string) {
  return code
    .replace(/<div[^>]*>/, '')
    .replace(/<\/div>(?!.*<\/div>)/, '')
    .replace(/<template>([\s\S]*)<\/template>/, '$1')
    .trim()
}

const displayedHtml = ref('')

watch(
  () => props.value,
  (code: string) => {
    displayedHtml.value = updateEditorCode(code)
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
  const formatted = updateEditorCode(props.value)
  formatHtml(formatted)
})

const activeMode = computed(() => {
  const { mode: forcedMode, filename } = props
  const mode = modes[forcedMode || filename.split('.').pop()!]
  return filename.lastIndexOf('.') !== -1 && mode ? mode : modes.js
})
</script>

<template>
  <div style="margin: 10px">
    <button type="button" class="format-btn" @click="() => formatHtml()">
      Format
    </button>
  </div>
  <CodeMirror @change="onChange" :value="displayedHtml" :mode="activeMode" />
</template>

<style>
.format-btn {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 300;
  color: white;
  background-color: rgba(100, 100, 100, 0.4) !important;
}
.format-btn:hover {
  background-color: rgba(100, 100, 100, 0.7) !important;
}
</style>
