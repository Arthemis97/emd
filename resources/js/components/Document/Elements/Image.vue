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
const imageUrl = ref('');
const isDrawing = ref(false);
const canvas = ref(null);
const context = ref(null);
const emit = defineEmits();

const setData = (base64) => {
	emit('update:modelValue', {
		...props.propperties,
		...{ src: base64 }
	});
};

onMounted(() => {
  context.value = canvas.value.getContext('2d'); 
  loadImageFromURL(isBase64Image(props.modelValue.src) ? props.modelValue.src : getImageUrl(props.modelValue.src));
});

const loadImageFromURL = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    imageUrl.value = `data:image/jpeg;base64,${base64}`;
    const image = new Image();
    image.src = imageUrl.value;
    image.onload = () => {
      canvas.value.width = image.width;
      canvas.value.height = image.height;
      drawImageOnCanvas();
    };
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

const drawImageOnCanvas = () => {
  const img = new Image();
  img.src = imageUrl.value;
  img.onload = () => {
    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
  };
}

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const startDrawing = (event) => {
  isDrawing.value = true;
  const { offsetX, offsetY } = event;
  context.value.beginPath();
  context.value.moveTo(offsetX, offsetY);
}

const draw = (event) => {
  if (!isDrawing.value) return;
  const { offsetX, offsetY } = event;
  context.value.lineTo(offsetX, offsetY);
  context.value.stroke();
}

const endDrawing = ()  =>{
  isDrawing.value = false;
  setData(canvas.value.toDataURL('image/jpeg'))
}

const getImageUrl = (img) => {
    return getImage(`${img}.png`)
} 

</script>
<template>
  <a-form-item :label="propperties.label" class="tw-mb-0">
    <canvas class="tw-border-solid tw-border tw-border-gray-400" ref="canvas" @mousedown="startDrawing" @mousemove="draw"
      @mouseup="endDrawing"></canvas>
  </a-form-item>
</template>