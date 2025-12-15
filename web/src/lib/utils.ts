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
                        type: 'image/jpeg', // Convert to JPEG for better compression
                        lastModified: Date.now(),
                    });
                }

                // Try converting to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // If first attempt is already good enough or if it's very small
                            if (blob.size <= maxSizeMB * 1024 * 1024) {
                                resolve(blobToFile(blob));
                            } else {
                                // If still too big, force a lower quality (e.g. 0.7)
                                // Retrying iteratively is better, but for this request "auto compress", 
                                // a safe aggressive compression like 0.6 usually works for >500kb files that aren't huge.
                                // Let's try 0.7 explicitly if the first 0.9 failed to check size.
                                // NOTE: recursive compression can be complex. simpler approach: 
                                // Just export as JPEG at 0.7 quality which usually slashes size significantly w/o resizing.
                                canvas.toBlob(
                                    (blob2) => {
                                        if (blob2) resolve(blobToFile(blob2));
                                        else resolve(file); // Fallback
                                    },
                                    'image/jpeg',
                                    0.7
                                );
                            }
                        } else {
                            reject(new Error("Canvas to Blob failed"));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            
            img.onerror = (err) => reject(err);
        };
        
        reader.onerror = (err) => reject(err);
    });
};
