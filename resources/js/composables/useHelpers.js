const pdfurl = import.meta.env.VITE_PDF_URL;
const apiurl = import.meta.env.VITE_API_URL;
export const removeNullProperties = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj[key] !== null) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

export const pdfUrl = () => {
    return pdfurl;
};

export const apiUrl = () => {
    return apiurl;
};

export const imageUrlToBase64 = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting image to Base64:", error);
        throw error;
    }
};
export const getImage = (image) => `${apiurl}/docimages/${image}`;
export const getPicture = (image) => `${apiurl}${image}`;
export const isBase64Image = (str) => {
    return str ? str.startsWith("data:image/") : str;
    // if (!str.startsWith("data:image/")) {
    //     return false;
    // }
    // const base64Part = str.split(",")[1];
    // try {
    //     const decoded = atob(base64Part);
    //     const isBinary = decoded
    //         .split("")
    //         .some((char) => char.charCodeAt(0) > 127);
    //     return !isBinary;
    // } catch (error) {
    //     return false;
    // }
};
