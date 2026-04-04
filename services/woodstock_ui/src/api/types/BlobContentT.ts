import { initRS } from 'mobx-resource-states';
import { ObjT } from '/src/utils/types';

export type BlobContentT = {
  path: string;
  content: string;
};

export const createBlobContent = (values: ObjT): BlobContentT => {
  return initRS({
    path: values.path ?? '',
    content: values.content ?? '',
  } as BlobContentT);
};
