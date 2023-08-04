<script setup>
const props = defineProps({
  propperties: {
    type: Object,
    required: true
  },
  modelValue: {
	type: Object,
    required: true
  }
})
const emit = defineEmits();
const setData = (e) => {
	emit('update:modelValue', {
		...props.propperties,
		...{ value: e.target.value }
	});
};

const mouseenter = () => {
	return;
	const element = document.getElementById(props.propperties.model);
	if (element) {
		element.style.backgroundColor = 'yellow';
	}
}

const mouseleave = () => {
	return;
	const element = document.getElementById(props.propperties.model);
	if (element) {
		element.style.backgroundColor = 'inherit'; 
	}
}
</script>
<template>
	<a-form-item :label="propperties.label" class="tw-mb-0" @mouseenter="mouseenter" @mouseleave="mouseleave">
		<a-textarea autoSize :value="modelValue.value" :placeholder="propperties.label" @input="setData"
			size="small"></a-textarea>
	</a-form-item>
</template>