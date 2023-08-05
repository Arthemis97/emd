<script setup>
import { useDate } from 'vue3-dayjs-plugin/useDate'
import useDocumentStore from '../../stores/document';
import useTemplateStore from '../../stores/template';
import InputElement from './Elements/Input.vue';
import ImageElement from './Elements/Image.vue';
import BoldElement from './Elements/Bold.vue';
import CheckboxElement from './Elements/Checkbox.vue';
import RoundElement from './Elements/Round.vue';
import UnderlineElement from './Elements/Underline.vue';
import SelectElement from './Elements/Select.vue';
import SumElement from './Elements/Sum.vue';

const documentStore = useDocumentStore()
const templateStore = useTemplateStore()
const elements = ref([])
const data = ref({})
const date = useDate()
const document_id = ref(null)
const title = ref("")

const groupElements = computed(() => {
	const cb = elements.value.filter(i => ['Underline','Round','Checkbox','Bold'].includes(i.type))
	const inputs = elements.value.filter(i => ['InputElement','Select', 'Sum'].includes(i.type))
	const images = elements.value.filter(i => ['Image'].includes(i.type))
	return {cb, inputs, images}
})

useEvent.on('documentedit:data:remove', () => {
	elements.value = []
	data.value = {}
	document_id.value = null
	title.value = ""
})

useEvent.on('documentedit:data:pass', async (obj) => {
	title.value = `${obj.template.name} - ${date(obj.createdAt).format('YYYY-MM-DD HH:mm')}`
	elements.value = []
	document_id.value = obj.id
	data.value = JSON.parse(JSON.parse(obj.data))
	const templateResp = await templateStore.getTemplate(obj.template_id)
	const templateData = JSON.parse(templateResp.template)[0]
	useEvent.emit('preview:html:pass', {template: templateData, data: data.value})
	const regex = /{[^{}]*}/g;
	const matches = templateData.match(regex);
	if(matches && matches.length > 0) {
		matches.forEach(match => {
			const matchArr = match.replace(/<\/?[^>]+(>|$)/g, '').slice(1, -1).split('|')
			const elToPush = {
				replace: match,
				type: getType(matchArr[0]),
				label: matchArr[2],
				value: '',
				model: matchArr[1]
			}
			switch (matchArr[0]) {
				case "z":
					elToPush.src = matchArr[3]
					break;
				case "u":
				case "r":
				case "c":
				case "b":
					elToPush.content = matchArr[3]
					break;
				case "s":
					elToPush.options = matchArr[3]
					break;
				case "sum":
					elToPush.sums = matchArr[3]
					break;
				default:
					break;
			}
			if(!data.value[matchArr[1]]) {
				data.value[matchArr[1]] = elToPush
			}
			elements.value.push(elToPush)
		});
	}
})

watch(
    () => data,
    (value, oldValue) => {
		useEvent.emit('preview:data:pass', value.value)
    }, {deep: true}
)


const getType = (t) => {
	switch (t) {
		case 'i':
			return 'InputElement'
		case 'z':
			return 'Image'
		case 'b':
			return 'Bold'
		case 'r':
			return 'Round'
		case 'u':
			return 'Underline'
		case 'c':
			return 'Checkbox'
		case 's':
			return 'Select'
		case 'sum':
			return 'Sum'
		default:
			break;
	}
}

const save = async () => {
	await documentStore.updateDocument({
		id: document_id.value,
		data: data.value && Object.keys(data.value).length > 0 ? JSON.stringify(data.value) : null,
	})
}
</script>
<template>
	<div>
		<a-space class="tw-mb-4">
			<slot name="button"></slot>
			<a-button type="primary" @click="save()">Хадгалах</a-button>
		</a-space>
		<div class="tw-uppercase tw-font-bold">
			{{ title }}
		</div>
		<a-form layout="vertical" v-if="elements.length > 0">
			<perfect-scrollbar style="height: calc(100vh - 200px)">
				<div class="tw-grid tw-grid-cols-3 tw-gap-4">
					<template v-for="(el, el_index) in groupElements.inputs">
						<a-card size="small" class="tw-mb-2">
							<InputElement v-model:modelValue="data[el.model]" v-if="el.type == 'InputElement'"
								:propperties="el" :key="`iel_index${el_index}`" />
							<SelectElement v-model:modelValue="data[el.model]" v-if="el.type == 'Select'" :propperties="el"
								:key="`iel_index${el_index}`" />
							<SumElement v-model:modelValue="data[el.model]" v-if="el.type == 'Sum'" :propperties="el"
								:docdata="data" :key="`iel_index${el_index}`" />
						</a-card>
					</template>
				</div>
				<div class="tw-grid tw-grid-cols-4 tw-gap-4" v-if="groupElements.cb.length > 0">
					<template v-for="(el, el_index) in groupElements.cb">
						<a-card size="small" class="tw-mb-2">
							<BoldElement v-model:modelValue="data[el.model]" v-if="el.type == 'Bold'" :propperties="el"
								:key="`cbel_index${el_index}`" />
							<CheckboxElement v-model:modelValue="data[el.model]" v-if="el.type == 'Checkbox'"
								:propperties="el" :key="`cbel_index${el_index}`" />
							<UnderlineElement v-model:modelValue="data[el.model]" v-if="el.type == 'Underline'"
								:propperties="el" :key="`cbel_index${el_index}`" />
							<RoundElement v-model:modelValue="data[el.model]" v-if="el.type == 'Round'" :propperties="el"
								:key="`cbel_index${el_index}`" />
						</a-card>
					</template>
				</div>
				<template v-for="(el, el_index) in groupElements.images">
					<a-card size="small" class="tw-mb-2">
						<ImageElement v-model:modelValue="data[el.model]" v-if="el.type == 'Image'" :propperties="el"
							:key="`zel_index${el_index}`" />
					</a-card>
				</template>
			</perfect-scrollbar>
		</a-form>
	</div>
</template>