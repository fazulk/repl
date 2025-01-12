import { type FunctionalComponent } from 'vue'

export type PreviewMode = 'js' | 'css' | 'ssr'

export interface EditorProps {
  containerClasses?: string
  value: string
  filename: string
  readonly?: boolean
  mode?: PreviewMode
}

export interface EditorEmits {
  (e: 'change', code: string): void
  (e: 'format'): void
}

export type EditorComponentType = FunctionalComponent<
  EditorProps,
  { change: (code: string) => void }
> & {
  editorType: 'monaco' | 'codemirror'
}

declare const EditorComponent: EditorComponentType

export default EditorComponent
