import { v4 } from "uuid";
import { ExtendedFile } from "~/common";
import { dataService, MutationKeys, QueryKeys, defaultOrderQuery } from 'librechat-data-provider';

export class API {
  
  public static uploadImage = async (originalFile: File) => {
    const file_id = v4();
    try {
      let extendedFile: ExtendedFile = {
        file_id,
        file: originalFile,
        type: originalFile.type,
        progress: 0.2,
        size: originalFile.size,
      };
      extendedFile.width = 1024;
      extendedFile.height = 1024;


        const formData = new FormData();
        formData.append('file', extendedFile.file as File);
        formData.append('file_id', extendedFile.file_id);
        if (extendedFile.width) {
          formData.append('width', extendedFile.width?.toString());
        }
        if (extendedFile.height) {
          formData.append('height', extendedFile.height?.toString());
        }

        formData.append('endpoint', 'default');

        const upload = await dataService.uploadImage(formData)
        return upload.filepath
  
    } catch (error) {
      console.log('file handling error', error);
    }
    await new Promise(r => setTimeout(r, 500))
    return '/placeholder-image.jpg'
  }
}

export default API
