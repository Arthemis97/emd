<script setup>
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'

import usePackageStore from '../../stores/package';
import useTemplateStore from "../../stores/template"
import VueDocumentEditor from 'vue-document-editor'

const templateStore = useTemplateStore()
const packageStore = usePackageStore()
const {getPackages} = storeToRefs(packageStore)
const visible = ref(false)
const template = ref({
    content: '',
    name: '',
    package: []
})
const page_format_mm = ref([210, 297])
const page_margins = ref("10mm 15mm")
const display = ref("vertical")

const extensions = [html(), oneDark]

const view = shallowRef()
const handleReady = (payload) => {
view.value = payload.view
}

const getCodemirrorStates = () => {
    const state = view.value.state
    const ranges = state.selection.ranges
    const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
    const cursor = ranges[0].anchor
    const length = state.doc.length
    const lines = state.doc.lines
}


useEvent.on('modal:template:open', async (tmp) => {
    if (tmp.id) {
        const resp = await templateStore.getTemplate(tmp.id)
        template.value = {
            id: tmp.id,
            content: resp.template ? JSON.parse(resp.template) : [''],
            name: resp.name,
            package: resp.package ? resp.package.map((i) => i.id) : []
        }
        visible.value = true
    } else {
        template.value = {
            content: [""],
            name: "",
            package: []
        }
        visible.value = true
    }
})

const save = async () => {
    const matchingPackageIds = template.value.package && template.value.package.length > 0 ? getPackages.value.filter(i => template.value.package.map((j) => j).includes(i.id)).map((k) => k.id) : []
    if (template.value.id) {
        await templateStore.updateTemplate({
            id: template.value.id,
            name: template.value.name,
            template: JSON.stringify(template.value.content),
            packages: matchingPackageIds
        })
        visible.value = false
        template.value = {
            content: [""],
            name: "",
            package: []
        }
    } else {
        await templateStore.storeTemplate({
            name: template.value.name,
            template: JSON.stringify(template.value.content),
            packages: matchingPackageIds
        })
        visible.value = false
        template.value = {
            content: [""],
            name: "",
            package: []
        }
    }
}

const handleFileChange = async (e) => {
    const file = e.target.files[0];
  if (!file) {
    alert('Please select a file.');
    return;
  }
  const formData = new FormData();
    formData.append('config', '{"collaboration_features":{"comments":true,"user_id":"e3","comments_styles":"basic","track_changes":true},"default_styles":true}');
    formData.append('file', file);
    const response = await fetch('https://docx-converter.cke-cs.com/v2/convert/docx-html', {
        method: 'POST',
        body: formData
    });
    const resp = await response.json();
    template.value.content = [resp.html]
}

</script>
<template>
    <a-modal v-model:open="visible" width="100%" :centered="true" @ok="save">
        <div class="tw-py-4">
            <a-form layout="vertical">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-form-item label="Маягтын нэр">
                            <a-input v-model:value="template.name" placeholder="Маягтын нэр"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Маягтын багц">
                            <a-select v-model:value="template.package" mode="multiple" placeholder="Сонгох"
                                :options="getPackages.map((i) => ({ label: i.name, value: i.id }))" />
                        </a-form-item>
                    </a-col>
                    <a-col :span=4>
                        <a-form-item label="Word файл оруулах">
                            <a-input type="file" @change="handleFileChange"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-row :gutter="16">
                <a-col :span="12">
                    <div class="tw-text-xs tw-flex tw-justify-center">
                        <!-- <vue-document-editor v-model:content="template.content" :zoom="1" :page_format_mm="page_format_mm"
                            :page_margins="page_margins" :display="display" /> -->
                        <div style="width: 210mm; height: auto; padding: 10mm 15mm; margin: 0 auto; box-sizing: border-box; page-break-inside: avoid; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
                            v-html="template.content[0]" class="tw-bg-white">
                        </div>
                    </div>
                </a-col>
                <a-col :span="12">
                    <codemirror v-model="template.content[0]" placeholder="Code goes here..." :style="{ height: '100%' }"
                        :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                        @ready="handleReady" />
                </a-col>
            </a-row>

        </div>
    </a-modal>
</template>