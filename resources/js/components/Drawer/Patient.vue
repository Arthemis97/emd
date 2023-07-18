<script setup>
import usePatientStore from '../../stores/patient';
const patientStore = usePatientStore()
const open = ref(false)
const title = ref("Үйлчлүүлэгч нэмэх")
const patient = ref({
	rd: '',
	last_name: '',
	first_name: '',
	gender: '',
	dob: '',
	age: '',
})
const rdValidated = ref(true)
useEvent.on('drawer:patient:open', (e) => {
	if(e.id){
		patient.value = e
		title.value = 'Үйлчлүүлэгч засварлах'
	} else {
		title.value = 'Үйлчлүүлэгч нэмэх'
	}
	open.value = true
})

const save = async () => {
	if(patient.value.id) {
		await patientStore.updatePatient(patient.value)
		open.value = false
		reset()
	} else {
		await patientStore.registerPatient(patient.value)
		open.value = false
		reset()
	}
}

const afterOpenChange = (e) => {
	if(!e) {
		reset();
	}
}
const getAge = (rd) => {
	let dateOfBirth = ""
	const dobarr = [rd.substr(2, 2), rd.substr(4, 2), rd.substr(6, 2)]
	if(dobarr[1] > 12) {
		dateOfBirth = `20${dobarr[0]}-${parseInt(dobarr[1])-20}-${dobarr[2]}`
	} else {
		dateOfBirth = `19${dobarr[0]}-${parseInt(dobarr[1])}-${dobarr[2]}`
	}
	var today = new Date();
	var dob = new Date(dateOfBirth);
	let age = today.getFullYear() - dob.getFullYear();
	if (
		today.getMonth() < dob.getMonth() ||
		(today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
	) {
		age--;
	}
	patient.value.age = age
}
const getGender = (rd) => {
	console.log(rd.substr(8, 1) % 2)
	patient.value.gender = rd.substr(8, 1) % 2 ? 1 : 0
}
const getDOB = (rd) => {
	let dateOfBirth = ""
	const dobarr = [rd.substr(2, 2), rd.substr(4, 2), rd.substr(6, 2)]
	if(dobarr[1] > 12) {
		dateOfBirth = `20${dobarr[0]}-${parseInt(dobarr[1])-20}-${dobarr[2]}`
	} else {
		dateOfBirth = `19${dobarr[0]}-${parseInt(dobarr[1])}-${dobarr[2]}`
	}
	patient.value.dob = dateOfBirth
}

const handleRd = async (e) => {
	patient.value = {
		rd: e.target.value
	}
	if(e.target.value.match(/^[а-яА-ЯёЁөӨүҮ]{2}[0-9]{8}$/g)) {
		rdValidated.value = true
		const found = await patientStore.findPatient(e.target.value)
		if(found) {
			patient.value = found
		} else {
			getAge(e.target.value)
			getGender(e.target.value)
			getDOB(e.target.value)
		}
	} else {
		rdValidated.value = false
	}
}

const reset = () => {
	patient.value = {
		rd: '',
		last_name: '',
		first_name: '',
		gender: '',
		dob: '',
		age: '',
	}
}
</script>
<template>
	<a-drawer v-model:open="open" :title="title" :destroyOnClose="true" @afterOpenChange="afterOpenChange"
		placement="right">
		<a-form layout="vertical">
			<a-form-item label="Регистр">
				<a-input v-model:value="patient.rd" :status="rdValidated ? '' : 'error'" @input="handleRd"></a-input>
			</a-form-item>
			<a-form-item label="Овог">
				<a-input v-model:value="patient.last_name"></a-input>
			</a-form-item>
			<a-form-item label="Нэр">
				<a-input v-model:value="patient.first_name"></a-input>
			</a-form-item>
			<a-form-item label="Төрсөн огноо">
				<a-input v-model:value="patient.dob" :disabled="true"></a-input>
			</a-form-item>
			<a-form-item label="Хүйс">
				<a-select v-model:value="patient.gender" :disabled="true">
					<a-select-option :value="1">Эр</a-select-option>
					<a-select-option :value="0">Эм</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="Нас">
				<a-input v-model:value="patient.age" :disabled="true"></a-input>
			</a-form-item>
		</a-form>
		<a-button @click="save" class="tw-w-full" type="primary">Хадгалах</a-button>
	</a-drawer>
</template>

