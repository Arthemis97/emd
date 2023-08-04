<script setup>
import { useDate } from 'vue3-dayjs-plugin/useDate'
import useDocumentStore from '../../stores/document'
import usePatientStore from '../../stores/patient'
import Container from '..//Document/Container.vue'
import Edit from '../Document/EditContainer.vue'
import HTMLPreviewer from '../Document/Preview.vue'
import Blank from '../Blank.vue'
const documentStore = useDocumentStore()
const { getPatientDocuments } = storeToRefs(documentStore)
const patientStore = usePatientStore()
const date = useDate()
const visible = ref(false)
const addVisible = ref(false)
const rd = ref("")
const toPrint = ref([])
const filterString = ref("")
const patient = ref({})
const templates = ref([])

useEvent.on('drawer:document:open', (register) => {
	rd.value = register
	onSearch()
})

useEvent.on('dropdown:hide', () => {
	addVisible.value = false
})

const onSearch = async () => {
	const resp = await patientStore.findPatient(rd.value)
	await documentStore.fetchDocumentsByPatient(resp.id)
	patient.value = resp
	templates.value = resp.package ? resp.package.template : []
	visible.value = true
}

const handleTemplateChange = (e) => {
	const tmp = templates.value.find(i => i.id == e)
	useEvent.emit('preview:html:pass', {template: JSON.parse(tmp.template)})
	useEvent.emit('document:data:pass', {
		template: tmp.template,
		template_id: e,
		patient_id: patient.value.id
	})
}

const handleEditChange = (e) => {
	const tmp = getPatientDocuments.value.find(i => i.id == e)
	useEvent.emit('documentedit:data:pass', tmp)
	addVisible.value = false
}

const tabChange = () => {
	addVisible.value = false
	useEvent.emit('preview:html:remove')
	useEvent.emit('documentedit:data:remove')
	useEvent.emit('document:data:remove')
}

const filterOption = computed(() => {
	const res = getPatientDocuments.value.filter(i => {
		const lbl = `${date(i.created_at).format('YYYY-MM-DD HH:mm')} - ${i.template ? i.template.name : ''}`
		return lbl.toLowerCase().indexOf(filterString.value.toLowerCase()) >= 0
	})
	return res
})

const showViewModal = () => {
	const template_ids = getPatientDocuments.value
	.filter((i) => toPrint.value.includes(i.id))
	.map((i) => i.id);
	useEvent.emit('modal:view:open', template_ids)
}

const handlePrintCheckbox = (e, id) => {
	const index = toPrint.value.findIndex(i => i == id)
	if(e.target.checked) {
		if(index == -1) {
			toPrint.value.push(id)
		}
	} else {
		if(index !== -1) {
			toPrint.value.splice(index, 1)
		}
	}
}

const isPrintChecked = (id) => {
	const index = toPrint.value.findIndex(i => i == id)
	return index !== -1
}

const deleteDocument = async (id) => {
	await documentStore.deleteDocument(id)
}
</script>
<template>
	<a-drawer v-model:open="visible" :destroyOnClose="true" @afterOpenChange="tabChange" width="100%">
		<template #title>
			<div class="tw-flex tw-justify-between">
				<div class="tw-uppercase">
					{{ patient.last_name }} {{ patient.first_name }} - {{ patient.rd }}
				</div>
			</div>
		</template>
		<a-row :gutter="16">
			<a-col :span="10">
				<a-card size="small">
					<HTMLPreviewer />
					<!-- <Blank /> -->
				</a-card>
			</a-col>
			<a-col :span="14">
				<a-card size="small">
					<a-tabs @change="tabChange">
						<a-tab-pane key="1" tab="Засварлах">
							<Edit>
								<template #button>
									<a-dropdown :trigger="['click']" :open="addVisible">
										<a-button type="primary" @click="addVisible = !addVisible">Бүртгэсэн
											маягтууд</a-button>
										<template #overlay>
											<div
												class="tw-flex tw-space-y-2 tw-flex-col tw-bg-white tw-shadow tw-w-[600px] tw-h-[400px] tw-p-4">
												<div>
													<a-input placeholder="Хайх" v-model:value="filterString" />
												</div>
												<div class="tw-flex-1">
													<perfect-scrollbar class="tw-h-[300px]">
														<a-list size="small" bordered :data-source="filterOption">
															<template #renderItem="{ item }">
																<a-list-item>
																	<div class="tw-flex tw-w-full tw-justify-between">
																		<div class="tw-flex-1">
																			<a-checkbox :checked="isPrintChecked(item.id)"
																				class="tw-mr-2"
																				@change="handlePrintCheckbox($event, item.id)" />
																			<b>{{ item.template ? item.template.name : ''
																			}}</b> -
																			{{ $date(item.created_at).format(`YYYY-MM-DD
																			HH:mm`) }}
																		</div>
																		<a-space>
																			<a-button type="primary" size="small"
																				@click="handleEditChange(item.id)">Засварлах</a-button>
																			<a-popconfirm class="tw-z-[10000]"
																				title="Устгах уу?" ok-text="Тийм"
																				cancel-text="Үгүй"
																				@confirm="deleteDocument(item.id)">
																				<a-button danger
																					size="small">Устгах</a-button>
																			</a-popconfirm>
																		</a-space>
																	</div>
																</a-list-item>
															</template>
														</a-list>
													</perfect-scrollbar>
												</div>
												<a-space>
													<a-button type="primary" @click="showViewModal">Хэвлэх</a-button>
													<a-button type="primary"
														@click="addVisible = !addVisible">Хаах</a-button>
												</a-space>
											</div>
										</template>
									</a-dropdown>
								</template>
							</Edit>
						</a-tab-pane>
						<a-tab-pane key="2" tab="Шинээр нэмэх" force-render>
							<Container>
								<template #button>
									<a-select @change="handleTemplateChange" placeholder="Боломжит маягтууд"
										class="tw-w-40">
										<a-select-option :value="tmp.id" v-for="(tmp, tmp_index) in templates"
											:key="tmp_index">
											{{ tmp.name }}
										</a-select-option>
									</a-select>
								</template>
							</Container>
						</a-tab-pane>
					</a-tabs>
				</a-card>

			</a-col>
		</a-row>
	</a-drawer>
</template>