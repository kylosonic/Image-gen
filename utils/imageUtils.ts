
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string, dataUrl: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const mimeType = dataUrl.split(';')[0].split(':')[1];
            const base64 = dataUrl.split(',')[1];
            resolve({ base64, mimeType, dataUrl });
        };
        reader.onerror = (error) => reject(error);
    });
};
