<script setup lang="ts">
import CodeMirror, { type Props } from '../codemirror/CodeMirror.vue'
import { computed } from 'vue'
import type { EditorEmits, EditorProps } from './types'

defineOptions({
  editorType: 'codemirror',
})

const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()

const onChange = (code: string) => {
  emit('change', code)
}

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

const activeMode = computed(() => {
  const { mode: forcedMode, filename } = props
  const mode = modes[forcedMode || filename.split('.').pop()!]
  return filename.lastIndexOf('.') !== -1 && mode ? mode : modes.js
})
</script>

<template>
  <CodeMirror @change="onChange" :value="value" :mode="activeMode" />
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
