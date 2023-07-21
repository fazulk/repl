import { computed, createApp, h, ref, watchEffect } from 'vue'
import { Repl, ReplStore } from '../src'
;(window as any).process = { env: {} }

const App = {
  setup() {
    const query = new URLSearchParams(location.search)
    const store = ((window as any).store = new ReplStore({
      serializedState: location.hash.slice(1),
      showOutput: query.has('so'),
      outputMode: query.get('om') || 'preview',
      defaultVueRuntimeURL: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-dev-proxy`,
      defaultVueServerRendererURL: import.meta.env.PROD
        ? undefined
        : `${location.origin}/src/vue-server-renderer-dev-proxy`,
    }))

    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // setTimeout(() => {
    // store.setFiles(
    //   {
    //     'index.html': '<h1>yo</h1>',
    //     'main.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'foo.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'bar.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     'baz.js': 'document.body.innerHTML = "<h1>hello</h1>"'
    //   },
    //   'index.html'
    // )
    // }, 1000);

    // store.setVueVersion('3.2.8')
    const text = ref('bg-blue-400')

    const mainClasses = computed(
      () =>
        'fixed top-0 left-0 w-full h-full min-h-screen z-20 overflow-auto ' +
        text.value
    )
    const containerClasses = computed(
      () => 'flex flex-col items-center justify-center ' + text.value
    )

    const headHTML = `<script src=\"https://cdn.tailwindcss.com\"><\/script>
    <script src=\"https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js\"><\/script>`
    return () =>
      h(
        'div', // parent div
        [
          h(
            'div', // first child div
            [
              h('input', {
                value: text.value, // bind value
                onInput: (event: any) => {
                  text.value = event.target.value // update value on input
                },
                attrs: {
                  type: 'text',
                },
              }),
            ]
          ),
          h('div', {}, [
            h(Repl, {
              style: 'height: 700px;',
              store,
              theme: 'dark',
              containerClasses: containerClasses.value,
              mainClasses: mainClasses.value,
              previewOptions: {
                headHTML,
              },
              // editor: CodeMirrorEditor as any as EditorComponentType,
              // layout: 'vertical',
              // ssr: false,
              sfcOptions: {
                script: {
                  // inlineTemplate: false
                },
              },
              // showCompileOutput: false,
              // showImportMap: false
            }),
          ]),
        ]
      )
  },
}

createApp(App).mount('#app')
