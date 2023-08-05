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
export const getImage = (image) => `${apiurl}/docimages/${image}`;
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
