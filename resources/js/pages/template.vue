<script setup>
import Topbar from '../components/Topbar.vue';
import useTemplateStore from '../stores/template'
import { useHead } from 'unhead'
useHead({
    title: 'Загвар',
})
const templateStore = useTemplateStore()
const {getTemplates} = storeToRefs(templateStore)
const loading = ref(false)
const showAddDrawer = (row = {}) => {
	useEvent.emit('modal:template:open', row)
}
const columns = [
{
  title: '№',
  dataIndex: 'id',
  width: '5%',
},{
  title: 'Нэр',
  dataIndex: 'name',
},{
  title: 'Багц',
  dataIndex: 'package',
}, {
  title: '',
  dataIndex: 'action',
  width: '14%'
}];

const deleteTemplate = async (id) => {
    await templateStore.deleteTemplate(id)
}

onMounted(async () => {
    await templateStore.fetchTemplates()
})
</script>
<template>
    <Topbar>
        <template v-slot:left>
            <a-space>
                <span>Маягт</span>
                <a-tooltip>
                    <template #title>Маягт нэмэх</template>
                    <a-button @click="showAddDrawer" type="primary" size="small">Нэмэх</a-button>
                </a-tooltip>
            </a-space>
        </template>
    </Topbar>
    <div class="tw-p-4">
        <a-table size="small" :columns="columns" :row-key="record => record.id" :data-source="getTemplates"
            :pagination="false" :loading="loading">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'package'">
                    <template v-if="record.package && record.package.length > 0">
                        <a-tag v-for="(pkg, pkg_index) in record.package" :key="pkg_index">
                            {{ pkg.name }}
                        </a-tag>
                    </template>
                    <template v-else>
                        Багц сонгоогүй
                    </template>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-space>
                        <a-button @click="showAddDrawer(record)" size="small">Засварлах</a-button>
                        <a-popconfirm title="Маягт устгах гэж байна?" ok-text="Тийм" cancel-text="Үгүй"
                            @confirm="deleteTemplate(record.id)">
                            <a-button size="small" danger>Устгах</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>
