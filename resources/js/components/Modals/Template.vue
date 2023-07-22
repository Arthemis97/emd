<script setup>
import usePackageStore from '../../stores/package';
import useTemplateStore from "../../stores/template"
import VueDocumentEditor from 'vue-document-editor'
const templateStore = useTemplateStore()
const packageStore = usePackageStore()
const { getPackages } = storeToRefs(packageStore)
const visible = ref(false)
const template = ref({
	content: '',
	name: '',
	package: []
})
const page_format_mm = ref([210, 297])
const page_margins = ref("10mm 15mm")
const display = ref("vertical")
useEvent.on('modal:template:open', async (tmp) => {
	if(tmp.id) {
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
	if(template.value.id){
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
</script>
<template>
	<a-modal v-model:open="visible" width="215mm" @ok="save">
		<div class="tw-py-4">
			<a-form layout="vertical">
				<a-form-item label="Маягтын нэр">
					<a-input v-model:value="template.name" placeholder="Маягтын нэр"></a-input>
				</a-form-item>
				<a-form-item label="Маягтын багц">
					<a-select v-model:value="template.package" mode="multiple" placeholder="Сонгох"
						:options="getPackages.map((i) => ({ label: i.name, value: i.id }))" />
				</a-form-item>
			</a-form>
			<div class="tw-text-xs tw-flex tw-justify-center">
				<vue-document-editor v-model:content="template.content" :zoom="1" :page_format_mm="page_format_mm"
					:page_margins="page_margins" :display="display" />
			</div>
		</div>
	</a-modal>
</template>

