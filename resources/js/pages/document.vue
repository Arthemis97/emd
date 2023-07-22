<script setup>
import useDocumentStore from '../stores/document';
import usePatientStore from '../stores/patient';
import Topbar from '../components/Topbar.vue'
const documentStore = useDocumentStore()
const { getPatientDocuments } = storeToRefs(documentStore)
const patientStore = usePatientStore()
const rd = ref("")
const patient = ref({})
const templates = ref([])
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const onSearch = async () => {
	const resp = await patientStore.findPatient(rd.value)
	const docresp = await documentStore.fetchDocumentsByPatient(resp.id)
	patient.value = resp
	templates.value = resp.package ? resp.package.template : []
}

const handleTemplateChange = () => {
	
}

onMounted(() => {
	rd.value = props.id
	onSearch();
})
</script>
<template>
	<Topbar>
		<template v-slot:left>
			<a-space>
				<span>Маягт</span>
			</a-space>
		</template>
	</Topbar>
	<div class="tw-p-4">
		<div class="tw-flex tw-gap-4 tw-items-center tw-mb-4 tw-text-xs">
			<a-input-search v-model:value="rd" placeholder="Регистрийн дугаар" class="tw-w-52" @search="onSearch" />
			<a-select class="tw-w-40" placeholder="Маягт">
				<a-select-option :value="tmp.id" v-for="(tmp, tmp_index) in templates" :key="tmp_index"
					@change="handleTemplateChange">
					{{ tmp.name }}
				</a-select-option>
			</a-select>
			<div v-if="Object.keys(patient).length > 0">
				<a-space>
					<span>{{ patient.last_name }} {{ patient.first_name }}</span>
				</a-space>
				<a-divider type="vertical" />
				<span> Нас: {{ patient.age }} </span>
			</div>
		</div>
		<div class="tw-bg-white tw-shadow">
			<a-row>
				<a-col :span="6">
					<div class="tw-py-1 tw-px-2 tw-bg-gray-50">
						<a-list item-layout="horizontal" :data-source="getPatientDocuments">
							<template #renderItem="{ item }">
								<a-list-item>
									<a-list-item-meta description="2023-01-01 21:00">
										<template #title>
											Ant Design, a design language for
										</template>
									</a-list-item-meta>
								</a-list-item>
							</template>
						</a-list>
					</div>
				</a-col>
				<a-col :span="18">
					<div class="tw-py-1 tw-px-2">

					</div>
				</a-col>
			</a-row>
		</div>
	</div>
</template>