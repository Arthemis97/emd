import { createHead } from "@vueuse/head"
import Antd from 'ant-design-vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import 'ant-design-vue/dist/reset.css';

import { registerLayouts } from './layouts/register';
import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(createPinia())
app.use(CKEditor)
app.use(router)
app.use(Antd)
registerLayouts(app)
app.mount('#app')
