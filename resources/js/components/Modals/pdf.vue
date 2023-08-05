<script setup>
import { PDFDocument } from "pdf-lib";
import draggable from "vuedraggable";
import PDFThumbnailGenerator from 'pdf-thumbnails-generator';

const pdfFile = ref(null);
const thumbnails = ref([]);
const downloadUrl = ref(null);
const downloadFilename = ref("reordered_document.pdf");
const open = ref(false);

useEvent.on("modal:pdf:open", (data) => {
    open.value = true;
});

const handleFileChange = (event) => {
    pdfFile.value = event.target.files[0];
    thumbnails.value = [];
    generateThumbnails();
};

const generateThumbnails = async () => {
    if (!pdfFile.value) return;

    try {
        const pdfDoc = await PDFDocument.load(
            await pdfFile.value.arrayBuffer()
        );
		const thumbs = await PDFThumbnailGenerator(pdfDoc, 200);
        console.log(thumbs);
		// thumbnails.value = thumbs.map((thumb) => thumb.src);
    } catch (error) {
        console.error("Error while loading PDF:", error);
    }
};

const onDragEnd = (event) => {
    thumbnails.value.splice(
        event.newIndex,
        0,
        thumbnails.value.splice(event.oldIndex, 1)[0]
    );
};

const reorderPDF = async () => {
    if (!pdfFile.value) return;

	try {
		const pdfDoc = await PDFDocument.load(await pdfFile.value.arrayBuffer());

		const newPages = thumbnails.value.map(async (thumbnailSrc) => {
		const blob = await fetch(thumbnailSrc).then((response) => response.blob());
		return await pdfDoc.embedPNG(blob);
		});

		pdfDoc.removePages();
		newPages.forEach((page) => pdfDoc.addPage(page));

		const reorderedPdfBytes = await pdfDoc.save();
		const blob = new Blob([reorderedPdfBytes], { type: 'application/pdf' });
		downloadUrl.value = URL.createObjectURL(blob);
		downloadLink.value.click();
	} catch (error) {
		console.error('Error while reordering PDF:', error);
	}
};
</script>
<template>
	<a-modal v-model:open="open">
		<input type="file" @change="handleFileChange" />
		<div class="thumbnails">
			<draggable v-model="thumbnails" :options="{ group: 'pdf-thumbnails' }" @end="onDragEnd" item-key="id">
				<template #item="{ element }">
					<div class="thumbnail">
						<img :src="element" alt="Thumbnail" />
					</div>
				</template>
			</draggable>
		</div>
		<button @click="reorderPDF">Reorder Pages</button>
	</a-modal>
</template>

<style>
.thumbnails {
	display: flex;
	flex-wrap: wrap;
}

.thumbnail {
	margin: 5px;
	cursor: grab;
}

.thumbnail img {
	max-width: 100px;
	/* Adjust the thumbnail size as per your preference */
}
</style>
