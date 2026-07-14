export async function getFileToBase64(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  if (file.file === undefined) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } else {
    try {
      let response;
      if (fileName.endsWith(".svg")) {
        response = await fetch(file.file);
        const svgContent = await response.text();
        const dataUrl = "data:image/svg+xml;base64," + btoa(svgContent);
        return dataUrl;
      } else {
        response = await fetch(file.file);
        const blob = await response.blob();
        const newFile = new File([blob], file.name, { type: blob.type });
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(newFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
