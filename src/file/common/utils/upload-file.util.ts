import axios from 'axios';
import { AudienceType, FileType } from 'shared';
import { presignFile } from '../services/index.service';

export async function uploadFile(
  audienceType: AudienceType,
  url: string,
  type: FileType,
) {
  const blob = await fetch(url).then((r) => r.blob());

  const { file, presignedUrl } = await presignFile({
    audienceType,
    fileType: type,
  });

  await axios.put(presignedUrl, blob);

  return file;
}

export async function uploadFileBuffer(
  fileType: FileType,
  audienceType: AudienceType,
  data: Buffer | Blob,
) {
  const { file, presignedUrl } = await presignFile({ audienceType, fileType });

  await axios.put(presignedUrl, data);

  return file;
}
