export type PayloadFieldType = 'value' | 'link' | 'ref' | 'tree';

export type PayloadFieldT = {
  type: PayloadFieldType;
  content: string;
};

export const parsePayloadField = (value: string): PayloadFieldT => {
  if (value.startsWith('value://')) {
    return { type: 'value', content: value.substring('value://'.length) };
  }
  if (value.startsWith('link://')) {
    return { type: 'link', content: value.substring('link://'.length) };
  }
  if (value.startsWith('ref://')) {
    return { type: 'ref', content: value.substring('ref://'.length) };
  }
  if (value.startsWith('tree://')) {
    return { type: 'tree', content: value.substring('tree://'.length) };
  }
  // Default to value type if no prefix
  return { type: 'value', content: value };
};
