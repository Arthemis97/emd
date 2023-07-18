<script setup>
import useUserStore from '../stores/user'
import useAuthStore from '../stores/auth';
import Topbar from '../components/Topbar.vue'
import { useHead } from 'unhead'
const userStore = useUserStore()
const authStore = useAuthStore()
const { getUsers } = storeToRefs(userStore)
const { getUser } = storeToRefs(authStore)
const loading = ref(false)
useHead({
    title: 'Ажилчид',
})
const columns = [{
  title: 'Нэр',
  dataIndex: 'name',
  width: '20%',
}, {
  title: 'Утас',
  dataIndex: 'phone',
  width: '20%',
}, {
  title: 'Эрх',
  dataIndex: 'type',
}, {
  title: '',
  dataIndex: 'action',
  width: '14%'
}];

const handleTableChange = () => {

}

const selfDelete = (id) => {
	return getUser.value.id === id
}

const showAddDrawer = (row = {}) => {
	useEvent.emit('drawer:user:open', row)
}

const deleteUser = (id) => {
	userStore.deleteUser(id)
}

onMounted(() => {
	userStore.fetchUsers()
})
</script>
<template>
	<Topbar>
		<template v-slot:left>
			<a-space>
				<span>Ажилчид</span>
				<a-tooltip>
					<template #title>Ажилтан нэмэх</template>
					<a-button @click="showAddDrawer" type="primary" size="small">Нэмэх</a-button>
				</a-tooltip>
			</a-space>
		</template>
	</Topbar>
	<div class="tw-p-4">
		<a-table size="small" :columns="columns" :row-key="record => record.id" :data-source="getUsers" :pagination="false"
			:loading="loading" @change="handleTableChange">
			<template #bodyCell="{ column, text, record }">
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a-button @click="showAddDrawer(record)" size="small">Засварлах</a-button>
						<a-popconfirm title="Ажилтан устгах гэж байна?" ok-text="Тийм" cancel-text="Үгүй"
							@confirm="deleteUser(record.id)" :disabled="selfDelete(record.id)">
							<a-button size="small" danger :disabled="selfDelete(record.id)">Устгах</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</a-table>
	</div>
</template>