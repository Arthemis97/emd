<script setup>
import { UpOutlined, DownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
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
const images = ref([])
const selectedTemplate = ref(null)
useEvent.on('drawer:document:open', (register) => {
	rd.value = register
	onSearch()
})

useEvent.on('dropdown:hide', () => {
	addVisible.value = false
})

useEvent.on('document:images:received', (imgs) => {
	images.value = imgs
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
		patient_id: patient.value.id,
		patient: patient.value
	})
}

const handleEditChange = (e) => {
	const tmp = getPatientDocuments.value.find(i => i.id == e)
	useEvent.emit('documentedit:data:pass', tmp)
	addVisible.value = false
}

const tabChange = () => {
	addVisible.value = false
	toPrint.value = []
	selectedTemplate.value = null
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

const selectAll = () => {
	toPrint.value = getPatientDocuments.value.map(i => i.id)
}

const showViewModal = () => {
	const template_ids = getPatientDocuments.value
	.filter((i) => toPrint.value.includes(i.id))
	.map((i) => i.id);
	useEvent.emit('modal:view:open', {ids: template_ids, images: images.value, patient: patient.value})
}

const showImages = () => {
	useEvent.emit('modal:image:adding', {patientId: patient.value.id, isAdding: true})
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

const deleteImage = (index) => {
	images.value.splice(index, 1)
}

const deleteDocument = async (id) => {
	await documentStore.deleteDocument(id)
}

const changeOrder = (index, dir) => {
	if(dir) {
		if (index > 0) {
			const temp = getPatientDocuments.value[index];
			getPatientDocuments.value[index] = getPatientDocuments.value[index - 1];
			getPatientDocuments.value[index - 1] = temp;
		}
	} else {
		if (index < getPatientDocuments.value.length - 1) {
			const temp = getPatientDocuments.value[index];
			getPatientDocuments.value[index] = getPatientDocuments.value[index + 1];
			getPatientDocuments.value[index + 1] = temp;
		}
	}
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
		<template #extra>
			<a-dropdown :trigger="['click']">
				<a-button type="primary" size="small">Загвар</a-button>
				<template #overlay>
					<div class="tw-bg-gray-200 tw-shadow-xl tw-border tw-w-96">
						<Blank />
					</div>
				</template>
			</a-dropdown>
		</template>
		<a-row :gutter="16">
			<a-col :span="12">
				<a-card size="small">
					<HTMLPreviewer />
					<!-- <Blank /> -->
				</a-card>
			</a-col>
			<a-col :span="12">
				<a-affix :offset-top="56">
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
													class="tw-flex tw-space-y-2 tw-flex-col tw-bg-white tw-shadow tw-w-[600px] tw-p-4">
													<div>
														<a-input placeholder="Хайх" v-model:value="filterString" />
													</div>
													<div class="tw-flex-1">
														<perfect-scrollbar class="tw-h-[300px]">
															<a-list size="small" bordered :data-source="filterOption">
																<template #renderItem="{ item, index }">
																	<a-list-item>
																		<div class="tw-flex tw-w-full tw-justify-between">
																			<div class="tw-flex tw-flex-1 tw-space-x-1">
																				<a-checkbox
																					:checked="isPrintChecked(item.id)"
																					class="tw-mr-2"
																					@change="handlePrintCheckbox($event, item.id)" />
																				<div>
																					<a-button size="small"
																						@click="changeOrder(index, true)">
																						<template #icon>
																							<UpOutlined />
																						</template>
																					</a-button>
																					<a-button size="small"
																						@click="changeOrder(index, false)">
																						<template #icon>
																							<DownOutlined />
																						</template>
																					</a-button>
																				</div>
																				<div><b>{{ item.template ?
																					item.template.name :
																					''
																				}}</b> -
																					{{
																						$date(item.created_at).format(`YYYY-MM-DD
																					HH:mm`) }}</div>
																			</div>
																			<a-space>
																				<a-button type="primary" size="small"
																					@click="handleEditChange(item.id)">
																					<template #icon>
																						<EditOutlined />
																					</template>
																				</a-button>
																				<a-popconfirm class="tw-z-[10000]"
																					title="Устгах уу?" ok-text="Тийм"
																					cancel-text="Үгүй"
																					@confirm="deleteDocument(item.id)">
																					<a-button danger size="small">
																						<template #icon>
																							<DeleteOutlined />
																						</template>
																					</a-button>
																				</a-popconfirm>
																			</a-space>
																		</div>
																	</a-list-item>
																</template>
															</a-list>
														</perfect-scrollbar>
													</div>
													<div class="tw-shadow tw-grid tw-grid-cols-4 tw-gap-2 tw-p-2">
														<div v-for="(img, img_index) in images" :key="img_index"
															class="tw-relative tw-group tw-border">
															<div
																class="tw-absolute tw-w-full tw-h-full tw-bg-black tw-hidden tw-bg-opacity-50 group-hover:tw-flex tw-items-center tw-justify-center">
																<div class="tw-flex tw-flex-col tw-space-y-2">
																	<a-button size="small" danger
																		@click="deleteImage(img_index)">Хасах</a-button>
																</div>
															</div>
															<img :src="img" class="tw-w-full tw-h-20 tw-object-cover" />
														</div>
													</div>
													<a-space>
														<a-button type="primary" @click="selectAll()">Бүгдийг
															сонгох</a-button>
														<a-button type="primary" @click="showViewModal">Хэвлэх</a-button>
														<a-button type="primary" @click="showImages">Зураг
															хавсаргах</a-button>
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
										<a-select v-model:value="selectedTemplate" @change="handleTemplateChange"
											placeholder="Боломжит маягтууд" class="tw-w-40">
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
				</a-affix>
			</a-col>
		</a-row>
	</a-drawer>
</template>