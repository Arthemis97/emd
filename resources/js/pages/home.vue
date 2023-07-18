<script setup>
import { useHead } from 'unhead'
import { FileDoneOutlined } from '@ant-design/icons-vue'
import usePatientStore from '../stores/patient'
import Topbar from '../components/Topbar.vue'

useHead({
    title: 'Үйлчлүүлэгч',
})

const patientStore = usePatientStore()
const {getPatients, getPagination} = storeToRefs(patientStore)
const loading = ref(false)

const columns = [{
  title: 'Овог',
  dataIndex: 'last_name',
  width: '20%',
}, {
  title: 'Нэр',
  dataIndex: 'first_name',
  width: '20%',
}, {
  title: 'Регистр',
  dataIndex: 'rd',
}, {
  title: 'Нас',
  dataIndex: 'age',
}, {
  title: 'Хүйс',
  dataIndex: 'gender',
}, {
  title: 'Зураг',
  dataIndex: 'image',
  width: '5%'
}, {
  title: '',
  dataIndex: 'action',
  width: '14%'
}]

const handleTableChange = () => {

}

const showAddDrawer = (row = {}) => {
	useEvent.emit('drawer:patient:open', row)
}

const showImageModal = (id) => {
	useEvent.emit('modal:image:open', id)
}

const deletePatient = (id) => {
	patientStore.deletePatient(id)
}

onMounted(() => {
	patientStore.fetchPatients()
})
</script>
<template>
	<Topbar>
		<template v-slot:left>
			<a-space>
				<span>Үйлчлүүлэгч</span>
				<a-tooltip>
					<template #title>Үйлчлүүлэгч нэмэх</template>
					<a-button @click="showAddDrawer()" type="primary" size="small">Нэмэх</a-button>
				</a-tooltip>
			</a-space>
		</template>
	</Topbar>
	<div class="tw-p-4">
		<a-table size="small" :columns="columns" :row-key="record => record.id" :data-source="getPatients"
			:pagination="getPagination" :loading="loading" @change="handleTableChange">
			<template #bodyCell="{ column, text, record }">
				<template v-if="column.dataIndex === 'image'">
					<a-button size="small" @click="showImageModal(record.id)">
						<template #icon>
							<FileDoneOutlined />
						</template>
						Зураг
					</a-button>
				</template>
				<template v-if="column.dataIndex === 'gender'">
					{{ record.gender ? 'Эр' : 'Эм' }}
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a-button @click="showAddDrawer(record)" size="small">Засварлах</a-button>
						<a-popconfirm title="Үйлчлүүлэгч устгах гэж байна?" ok-text="Тийм" cancel-text="Үгүй"
							@confirm="deletePatient(record.id)">
							<a-button size="small" danger>Устгах</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</a-table>
	</div>
</template>

