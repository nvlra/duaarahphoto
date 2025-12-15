import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compressImage = async (file: File, maxSizeMB: number = 0.5): Promise<File> => {
    // If file is smaller than maxSize, return it as is
    if (file.size <= maxSizeMB * 1024 * 1024) return file;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                
                // Maintain resolution (width/height)
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                
                // Start with high quality
                const quality = 0.9;
                
                // Helper to convert blob to file
                const blobToFile = (blob: Blob): File => {
                    return new File([blob], file.name, {
                        type: file.type, // Preserve original type (e.g. image/png for transparency)
                        lastModified: Date.now(),
                    });
                }

                // Try converting to blob
                // Use original file type for export to preserve transparency if PNG
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // If first attempt is already good enough or if it's very small
                            if (blob.size <= maxSizeMB * 1024 * 1024) {
                                resolve(blobToFile(blob));
                            } else {
                                // If still too big, try slightly lower quality
                                canvas.toBlob(
                                    (blob2) => {
                                        if (blob2) resolve(blobToFile(blob2));
                                        else resolve(file); // Fallback
                                    },
                                    file.type,
                                    0.8 // Slightly lower quality but keep format
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
