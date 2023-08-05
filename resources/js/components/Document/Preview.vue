<script setup>
const htmldata = ref("");
useEvent.on("preview:data:pass", async (data) => {
    if (data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmldata.value, "text/html");
        Object.keys(data).map(async (i) => {
            const element = doc.getElementById(data[i].model);
            if (element) {
                switch (data[i].type) {
                    case "InputElement":
                        element.textContent = data[i].value;
                        break;
                    case "Image":
                        break;
                    case "Bold":
                        if (data[i].value) {
                            element.style = "font-weight: bold !important;";
                        } else {
                            element.style = "font-weight: normal !important;";
                        }
                        break;
                    case "Round":
                        if (data[i].value) {
                            element.style =
                                "border: 1px solid #000; border-radius: 50%";
                        } else {
                            element.style = "border: none !important;";
                        }
                        break;
                    case "Underline":
                        if (data[i].value) {
                            element.style = "";
                        } else {
                            element.style = "text-decoration: none !important;";
                        }
                        htmldata.value = htmldata.value.replace(
                            data[i].replace,
                            data[i].value
                                ? `<u>${data[i].content}</u>`
                                : data[i].content
                        );
                        break;
                    case "Checkbox":
                        if (data[i].value) {
                            element.textContent = "✓";
                            element.style =
                                "border: 1px solid #000; padding: 0 4px;";
                        } else {
                            element.textContent = "";
                            element.style =
                                "border: 1px solid #000; padding: 0 8px;";
                        }
                        break;
                    case "Select":
                        element.textContent = data[i].value;
                        break;
                    case "Sum":
                        element.textContent = data[i].value;                      
                        break;
                    default:
                        break;
                }
            }
        });
		htmldata.value = new XMLSerializer().serializeToString(doc);
    }
});
useEvent.on('preview:html:remove', () => {
	htmldata.value = ""
})
useEvent.on("preview:html:pass", async (obj) => {
    if (obj.data) {
    	htmldata.value = obj.template;
        await Promise.all(
            Object.keys(obj.data).map(async (i) => {
                switch (obj.data[i].type) {
                    case "InputElement":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            `<span id="${obj.data[i].model}">${obj.data[i].value}</span>`
                        );
                        break;
                    case "Image":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            `<img id="${obj.data[i].model}" src="${
                                isBase64Image(obj.data[i].src)
                                    ? obj.data[i].src
                                    : getImage(`${obj.data[i].src}.png`)
                            }" />`
                        );
                        break;
                    case "Bold":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            obj.data[i].value
                                ? `<b id="${obj.data[i].model}">${obj.data[i].content}</b>`
                                : obj.data[i].content
                        );
                        break;
                    case "Round":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            obj.data[i].value
                                ? `<span id="${obj.data[i].model}" style="border: 1px solid #000; border-radius: 50%">${obj.data[i].content}</span>`
                                : obj.data[i].content
                        );
                        break;
                    case "Underline":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            obj.data[i].value
                                ? `<u id="${obj.data[i].model}">${obj.data[i].content}</u>`
                                : obj.data[i].content
                        );
                        break;
                    case "Checkbox":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            obj.data[i].value
                                ? `<span id="${obj.data[i].model}" style="border: 1px solid #000; padding: 0 4px;">✓</span>`
                                : ``
                        );
                        break;
                    case "Select":
                        htmldata.value = htmldata.value.replace(
                            obj.data[i].replace,
                            `<span id="${obj.data[i].model}">${obj.data[i].value}</span>`
                        );
                        break;
                    default:
                        break;
                }
            })
        );
    } else {
    	htmldata.value = obj.template[0];
        const regex = /{[^{}]*}/g;
        const matches = htmldata.value.match(regex);
        if (matches && matches.length > 0) {
            matches.forEach((match) => {
                const matchArr = match
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .slice(1, -1)
                    .split("|");
                switch (matchArr[0]) {
                    case "i":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<span id="${matchArr[1]}"></span>`
                        );
                        break;
                    case "z":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<img id="${matchArr[1]}" src="${
                                isBase64Image(matchArr[3])
                                    ? matchArr[3]
                                    : getImage(`${matchArr[3]}.png`)
                            }" />`
                        );
                        break;
                    case "u":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<u id="${matchArr[1]}">${matchArr[3]}</u>`
                        );
                        break;
                    case "r":
						htmldata.value = htmldata.value.replace(
							match,
							`<span id="${matchArr[1]}">${matchArr[3]}</span>`
						);
                        break;
                    case "b":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<b id="${matchArr[1]}">${matchArr[3]}</b>`
                        );
                        break;
                    case "c":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<span id="${matchArr[1]}" style="border: 1px solid #000; padding: 0 4px;"></span>`
                        );
                        break;
                    case "s":
						htmldata.value = htmldata.value.replace(
                            match,
                            `<span id="${matchArr[1]}">${matchArr[3]}</span>`
                        );
                        break;
                    default:
                        break;
                }
            });
        }
    }
});
</script>
<template>
    <div v-html="htmldata"></div>
</template>
