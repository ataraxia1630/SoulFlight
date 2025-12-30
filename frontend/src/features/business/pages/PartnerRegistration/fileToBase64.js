import imageCompression from "browser-image-compression";

const fileToBase64 = async (file) => {
  // Cấu hình nén
  const options = {
    maxSizeMB: 0.5, // Nén xuống tối đa 500KB
    maxWidthOrHeight: 1280, // Giữ độ phân giải HD
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error("Compression error:", error);
    // Nếu lỗi nén thì dùng file gốc làm fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  }
};
export default fileToBase64;
