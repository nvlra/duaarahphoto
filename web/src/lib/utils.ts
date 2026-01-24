import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compressImage = async (file: File, maxSizeMB: number = 0.5): Promise<File> => {
    if (file.size <= maxSizeMB * 1024 * 1024) return file;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                
                const quality = 0.9;
                
                const blobToFile = (blob: Blob): File => {
                    return new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    });
                }

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            if (blob.size <= maxSizeMB * 1024 * 1024) {
                                resolve(blobToFile(blob));
                            } else {
                                canvas.toBlob(
                                    (blob2) => {
                                        if (blob2) resolve(blobToFile(blob2));
                                        else resolve(file);
                                    },
                                    file.type,
                                    0.8
                                );
                            }
                        } else {
                            reject(new Error("Canvas to Blob failed"));
                        }
                    },
                    file.type,
                    quality
                );
            };
            
            img.onerror = (err) => reject(err);
        };
        
        reader.onerror = (err) => reject(err);
    });
};
