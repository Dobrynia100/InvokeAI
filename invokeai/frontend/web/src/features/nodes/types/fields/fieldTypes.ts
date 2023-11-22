import { z } from 'zod';

export const zFieldTypeName = z.enum([
  'AnyField',
  'BoardField',
  'BooleanField',
  'ClipField',
  'CollectionField', // Generic collection - from Collect node
  'CollectionItemField', // Generic collection item - from Collect node
  'ColorField',
  'ConditioningField',
  'ControlField',
  'ControlNetModelField',
  'DenoiseMaskField',
  'EnumField',
  'FloatField',
  'ImageField',
  'TntegerField',
  'IPAdapterField',
  'IPAdapterModelField',
  'LatentsField',
  'LoRAModelField',
  'MainModelField',
  'MetadataField',
  'MetadataItemField',
  'ONNXModelField',
  'SchedulerField',
  'SDXLMainModelField',
  'SDXLRefinerModelField',
  'StringField',
  'T2IAdapterField',
  'T2IAdapterModelField',
  'UNetField',
  'VaeField',
  'VaeModelField',
]);

export const zBaseFieldType = z.object({
  isPolymorphic: z.boolean(),
  isCollection: z.boolean(),
});

export const zFieldType = zBaseFieldType.extend({
  name: z.string().min(1),
});

export type FieldType = z.infer<typeof zFieldType>;

export const zReservedFieldTypeName = z.enum([
  'Workflow',
  'IsIntermediate', // this is technically a reserved field type, though it is also the name of a field
  'Metadata',
]);

export const zReservedFieldType = zBaseFieldType.extend({
  name: zReservedFieldTypeName,
});

export type ReservedFieldType = z.infer<typeof zReservedFieldType>;

export const isFieldType = (value: unknown): value is FieldType =>
  zFieldType.safeParse(value).success;

export const isReservedFieldType = (value: unknown): value is FieldType =>
  zReservedFieldType.safeParse(value).success;

export const isAnyFieldType = (
  value: unknown
): value is FieldType | ReservedFieldType =>
  isFieldType(value) || isReservedFieldType(value);

const TYPES_WITH_UI_COMPONENTS: FieldType[] = [
  { name: 'StringField', isCollection: false, isPolymorphic: false },
  { name: 'StringField', isCollection: false, isPolymorphic: true },
  { name: 'BooleanField', isCollection: false, isPolymorphic: false },
  { name: 'BooleanField', isCollection: false, isPolymorphic: true },
  { name: 'FloatField', isCollection: false, isPolymorphic: false },
  { name: 'FloatField', isCollection: false, isPolymorphic: true },
  { name: 'IntegerField', isCollection: false, isPolymorphic: false },
  { name: 'IntegerField', isCollection: false, isPolymorphic: true },
  { name: 'ImageField', isCollection: false, isPolymorphic: false },
  { name: 'ImageField', isCollection: false, isPolymorphic: true },
  { name: 'MainModelField', isCollection: false, isPolymorphic: false },
  { name: 'MainModelField', isCollection: false, isPolymorphic: false },
  { name: 'SDXLRefinerModelField', isCollection: false, isPolymorphic: false },
  { name: 'VaeModelField', isCollection: false, isPolymorphic: false },
  { name: 'LoRAModelField', isCollection: false, isPolymorphic: false },
  { name: 'ControlNetModelField', isCollection: false, isPolymorphic: false },
  { name: 'ColorField', isCollection: false, isPolymorphic: false },
  { name: 'SDXLMainModelField', isCollection: false, isPolymorphic: false },
  { name: 'Scheduler', isCollection: false, isPolymorphic: false },
  { name: 'IPAdapterModelField', isCollection: false, isPolymorphic: false },
  { name: 'BoardField', isCollection: false, isPolymorphic: false },
  { name: 'T2IAdapterModelField', isCollection: false, isPolymorphic: false },
];
