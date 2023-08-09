<script setup>
import { useHead } from 'unhead'
import { useDate } from 'vue3-dayjs-plugin/useDate'
import { FileDoneOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons-vue'
import usePatientStore from '../stores/patient'
import Topbar from '../components/Topbar.vue'
const router = useRouter()
const date = useDate()
useHead({
    title: 'Үйлчлүүлэгч',
})

const patientStore = usePatientStore()
const {getPatients, getPagination} = storeToRefs(patientStore)
const filters = reactive({
	last_name: '',
	first_name: '',
	rd: ''
})
const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const loading = ref(false)

const columns = [{
	title: 'Овог',
	dataIndex: 'last_name',
	customFilterDropdown: true,
	onFilter: (value, record) => {
		return true;
	},
	onFilterDropdownOpenChange: visible => {
		if (visible) {
		setTimeout(() => {
			searchInput.value.focus();
		}, 100);
	}
  },
  width: '20%',
}, {
  title: 'Нэр',
  dataIndex: 'first_name',
  customFilterDropdown: true,
	onFilter: (value, record) => {
		return true;
	},
	onFilterDropdownOpenChange: visible => {
		if (visible) {
		setTimeout(() => {
			searchInput.value.focus();
		}, 100);
	}
  },
  width: '20%',
}, {
  title: 'Регистр',
  dataIndex: 'rd',
  customFilterDropdown: true,
	onFilter: (value, record) => {
		return true;
	},
	onFilterDropdownOpenChange: visible => {
		if (visible) {
		setTimeout(() => {
			searchInput.value.focus();
		}, 100);
	}
  }
}, {
  title: 'Нас',
  dataIndex: 'age',
}, {
  title: 'Хүйс',
  dataIndex: 'gender',
}, {
  title: 'Багц',
  dataIndex: 'package_id',
}, {
  title: 'Зураг',
  dataIndex: 'image',
  width: '5%'
}, {
	title: 'Огноо',
	dataIndex: 'date',
	width: '8%',
	customFilterDropdown: true,
	onFilter: (value, record) => {
		return true;
	},
	onFilterDropdownOpenChange: visible => {
		if (visible) {
		setTimeout(() => {
			searchInput.value.focus();
		}, 100);
	}
  }
}, {
  title: '',
  dataIndex: 'action',
  width: '14%'
}]

const handleTableChange = async (pagination, filters, sorter) => {
	patientStore.setPagination(pagination)
	await patientStore.fetchPatients(filters)
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


const fetchPatients = async (filters) => {
	await patientStore.fetchPatients(filters)
}


const showDocumentDrawer = (rd) => {
	useEvent.emit('drawer:document:open', rd)
}

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  filters[dataIndex] = selectedKeys[0] || '';
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};

const handleReset = clearFilters => {
  clearFilters({ confirm: true });
  state.searchText = '';
};

onMounted(() => {
	fetchPatients()
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
			<template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
				<div style="padding: 8px">
					<div v-if="column.dataIndex === 'date'" class="tw-mb-2">
						<a-range-picker :value="selectedKeys[0]" ref="searchInput" valueFormat="YYYY-MM-DD"
							:placeholder="['Эхлэх огноо', 'Дуусах огноо']" @change="e => setSelectedKeys(e ? [e] : [])"
							class="tw-w-full" @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
					</div>
					<template v-else>
						<a-input ref="searchInput" :placeholder="`Хайх`" :value="selectedKeys[0]"
							style="width: 188px; margin-bottom: 8px; display: block"
							@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
							@pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
					</template>

					<a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
						@click="handleSearch(selectedKeys, confirm, column.dataIndex)">
						<template #icon>
							<SearchOutlined />
						</template>
						Хайх
					</a-button>
					<a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
						Буцаах
					</a-button>
				</div>
			</template>
			<template #customFilterIcon="{ filtered }">
				<search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
			</template>

			<template #bodyCell="{ column, text, record }">
				<template v-if="column.dataIndex === 'last_name'">
					{{ record.last_name }}
				</template>
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
				<template v-if="column.dataIndex === 'date'">
					{{ date(record.created_at).format('YYYY-MM-DD HH:mm') }}
				</template>
				<template v-if="column.dataIndex === 'package_id'">
					<a-tooltip>
						<template #title
							v-if="record.package && record.package.template && record.package.template.length > 0">
							<div v-for="(tmp, tmp_index) in record.package.template" :key="tmp_index">
								- {{ tmp.name }}
							</div>
						</template>
						<span class="tw-cursor-pointer">
							{{ record.package ? record.package.name : '' }}
						</span>
					</a-tooltip>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a-button @click="showDocumentDrawer(record.rd)" size="small">Маягт</a-button>
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

