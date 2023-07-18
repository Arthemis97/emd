<script>
import UserDrawer from '../components/Drawer/User.vue';
import PatientDrawer from '../components/Drawer/Patient.vue';
import ImageModal from '../components/Modals/Image.vue';
import BlankModal from '../components/Modals/Blank.vue';
import Blank from '../components/Blank.vue'
export default {
	name: 'AdminLayout',
	components: {
		UserDrawer,
		PatientDrawer,
		ImageModal,
		Blank,
		BlankModal
	}
}
</script>
<template>
	<div class="tw-h-screen tw-flex">
		<div class="tw-w-80 tw-bg-blue-500">
			<Blank />
		</div>
		<div class="tw-flex-1 tw-bg-slate-100 tw-overflow-auto">
			<slot></slot>
		</div>
	</div>
	<UserDrawer />
	<PatientDrawer />
	<ImageModal />
	<BlankModal />
</template>

