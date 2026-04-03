import { z } from 'zod';

export const convertDataToSnakeCase = <T extends z.ZodTypeAny>(
  schema: T,
  data: any
): any => {
  if (schema instanceof z.ZodObject) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    const newData: any = {};
    for (const [key, value] of Object.entries(schema.shape)) {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      if (key in data) {
        newData[snakeCaseKey] = convertDataToSnakeCase(
          value as z.ZodTypeAny,
          data[key]
        );
      }
    }
    return newData;
  }

  if (schema instanceof z.ZodArray) {
    if (!Array.isArray(data)) {
      return data;
    }
    return data.map((item) => convertDataToSnakeCase(schema.element, item));
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return data === undefined || data === null
      ? data
      : convertDataToSnakeCase(schema.unwrap(), data);
  }

  if (schema instanceof z.ZodLazy) {
    // Resolve the lazy schema and recurse
    return convertDataToSnakeCase(schema.schema, data);
  }

  // For primitive types, no transformation needed
  return data;
};
