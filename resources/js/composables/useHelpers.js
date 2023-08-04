export const removeNullProperties = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj[key] !== null) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
export const getImage = (image) => "http://localhost:8000/docimages/" + image;
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
