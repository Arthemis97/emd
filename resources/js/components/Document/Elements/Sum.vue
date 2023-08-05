<script setup>
const props = defineProps({
  propperties: {
    type: Object,
    required: true
  },
  modelValue: {
	type: Object,
    required: true
  },
  docdata: {
	type: Object,
    required: true
  }
})
const emit = defineEmits();
useEvent.on('sum:data:pass', (e) => {
	if(props.propperties.sums) {
		let total = 0;
		if(props.propperties.sums.includes('-')) {
			const start = parseInt(props.propperties.sums.split('-')[0].substring(1))
			const end = parseInt(props.propperties.sums.split('-')[1].substring(1))
			for (let i = start; i <= end; i++) {
				const currentString = 'S' + i;
				total += e[currentString].value ? parseInt(e[currentString].value) : 0
				if(i == end) {
					// emit('update:modelValue', {
					// 	...props.propperties,
					// 	...{ value: total }
					// });
				}
			}
		} else {

		}
	}  
})


const setData = (e) => {
	emit('update:modelValue', {
		...props.propperties,
		...{ value: e.target.value }
	});
};

</script>
<template>
	<a-form-item :label="propperties.label" class="tw-mb-0">
		<a-textarea disabled autoSize :value="modelValue.value" :placeholder="propperties.label" @input="setData"
			size="small"></a-textarea>
	</a-form-item>
</template>