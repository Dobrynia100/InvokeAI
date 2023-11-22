import {
  zMainOrOnnxModel,
  zScheduler,
} from 'features/parameters/types/parameterSchemas';
import { z } from 'zod';
import { zImageField } from '../types';
import {
  zBoardField,
  zColorField,
  zControlNetModelField,
  zFieldInput,
  zFieldUIComponent,
  zIPAdapterModelField,
  zLoRAModelField,
  zVAEModelField,
} from './common';
import {
  zBooleanOptional,
  zFloatOptional,
  zIntOptional,
  zString,
} from './util';

/**
 * zod schemas & inferred types for input field values.
 *
 * These schemas and types are only required for field types that have UI components and allow the user to directly provide values.
 * This includes primitive values (numbers, strings, booleans), models, scheduler, etc.
 *
 * If a field type does not have a UI component, then it does not need to be included here, because we never store its value.
 *
 * Note that most/all polymorphics will use the same schema as their non-polymorphic counterpart for value.
 *
 * Fields require:
 * - z<TypeName>FieldType - zod schema for the field type
 * - z<TypeName>FieldValue - zod schema for the field value
 * - z<TypeName>FieldInputTemplate - zod schema for the field's input template
 * - z<TypeName>FieldOutputTemplate - zod schema for the field's output template
 * - z<TypeName>FieldInputInstance - zod schema for the field's input instance
 * - z<TypeName>FieldOutputInstance - zod schema for the field's output instance
 *
 * These then must be added to the unions at the bottom of this file.
 */

/** */

// #region Instance and template base schemas

export const zFieldInstanceBase = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});
export const zFieldInputInstanceBase = zFieldInstanceBase.extend({
  fieldKind: z.literal('input'),
});
export const zFieldOutputInstanceBase = zFieldInstanceBase.extend({
  fieldKind: z.literal('output'),
});
export type FieldInstanceBase = z.infer<typeof zFieldInstanceBase>;
export type FieldInputInstanceBase = z.infer<typeof zFieldInputInstanceBase>;
export type FieldOutputInstanceBase = z.infer<typeof zFieldOutputInstanceBase>;

export const zFieldTemplateBase = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullish(),
  required: z.boolean(),
  ui_hidden: z.boolean(),
  ui_type: z.string().nullish(),
  ui_order: z.number().int().nullish(),
});
export const zFieldInputTemplateBase = zFieldTemplateBase.extend({
  fieldKind: z.literal('input'),
  input: zFieldInput,
  ui_component: zFieldUIComponent,
  ui_choice_labels: z.record(z.string()).nullish(),
});
export const zFieldOutputTemplateBase = zFieldTemplateBase.extend({
  fieldKind: z.literal('output'),
});
export type FieldTemplateBase = z.infer<typeof zFieldTemplateBase>;
export type FieldTemplateInputBase = z.infer<typeof zFieldInputTemplateBase>;
export type FieldTemplateOutputBase = z.infer<typeof zFieldOutputTemplateBase>;

// #endregion Instance and template base schemas

// #region Integers

export const zIntegerFieldType = z.object({
  name: z.literal('IntegerField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zIntegerFieldValue = z.number().int().optional();
export const zIntegerFieldInputInstance = zFieldInputInstanceBase.extend({
  type: zIntegerFieldType,
  value: zIntegerFieldValue,
});
export const zIntegerFieldOutputInstance = zFieldOutputInstanceBase.extend({
  type: zIntegerFieldType,
});
export const zIntegerFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zIntegerFieldType,
  default: zIntegerFieldValue,
  multipleOf: zBooleanOptional,
  maximum: zIntOptional,
  exclusiveMaximum: zIntOptional,
  minimum: zIntOptional,
  exclusiveMinimum: zIntOptional,
});
export const zIntegerFieldOutputTemplate = zFieldOutputTemplateBase.extend({
  type: zIntegerFieldType,
});
export type IntegerFieldType = z.infer<typeof zIntegerFieldType>;
export type IntegerFieldValue = z.infer<typeof zIntegerFieldValue>;
export type IntegerFieldInputInstance = z.infer<
  typeof zIntegerFieldInputInstance
>;
export type IntegerFieldInputTemplate = z.infer<
  typeof zIntegerFieldInputTemplate
>;

export const zIntegerFieldPolymorphicType = z.object({
  name: z.literal('IntegerField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(true),
});
export const zIntegerFieldPolymorphicValue = zIntegerFieldType;
export const zIntegerFieldPolymorphicInputInstance =
  zFieldInputInstanceBase.extend({
    type: zIntegerFieldPolymorphicType,
    value: zIntegerFieldPolymorphicValue,
  });
export const zIntegerFieldPolymorphicOutputInstance =
  zFieldOutputInstanceBase.extend({
    type: zIntegerFieldPolymorphicType,
  });
export const zIntegerFieldPolymorphicInputTemplate =
  zIntegerFieldInputTemplate.extend({ type: zIntegerFieldPolymorphicType });
export const zIntegerFieldPolymorphicOutputTemplate =
  zIntegerFieldOutputTemplate.extend({ type: zIntegerFieldPolymorphicType });
export type IntegerFieldPolymorphicType = z.infer<
  typeof zIntegerFieldPolymorphicType
>;
export type IntegerFieldPolymorphicValue = z.infer<
  typeof zIntegerFieldPolymorphicValue
>;
export type IntegerFieldPolymorphicInputInstance = z.infer<
  typeof zIntegerFieldPolymorphicInputInstance
>;
export type IntegerFieldPolymorphicOutputInstance = z.infer<
  typeof zIntegerFieldPolymorphicOutputInstance
>;
export type IntegerFieldPolymorphicInputTemplate = z.infer<
  typeof zIntegerFieldPolymorphicInputTemplate
>;
export type IntegerFieldPolymorphicOutputTemplate = z.infer<
  typeof zIntegerFieldPolymorphicOutputTemplate
>;

// #endregion Integer

// #region Float

export const zFloatFieldType = z.object({
  name: z.literal('FloatField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zFloatFieldValue = z.number().optional();
export const zFloatFieldInputInstance = zFieldInputInstanceBase.extend({
  type: zFloatFieldType,
  value: zFloatFieldValue,
});
export const zFloatFieldOutputInstance = zFieldOutputInstanceBase.extend({
  type: zFloatFieldType,
});
export const zFloatFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zFloatFieldType,
  default: zFloatFieldValue,
  multipleOf: zBooleanOptional,
  maximum: zFloatOptional,
  exclusiveMaximum: zFloatOptional,
  minimum: zFloatOptional,
  exclusiveMinimum: zFloatOptional,
});
export const zFloatFieldOutputTemplate = zFieldOutputTemplateBase.extend({
  type: zFloatFieldType,
});
export type FloatFieldType = z.infer<typeof zFloatFieldType>;
export type FloatFieldValue = z.infer<typeof zFloatFieldValue>;
export type FloatFieldInputTemplate = z.infer<typeof zFloatFieldInputTemplate>;

export const zFloatFieldPolymorphicType = zFloatFieldType.extend({
  isPolymorphic: z.literal(true),
});
export const zFloatFieldPolymorphicValue = zFloatFieldValue;
export const zFloatFieldPolymorphicInputTemplate =
  zFloatFieldInputTemplate.extend({
    type: zFloatFieldPolymorphicType,
  });
export type FloatFieldPolymorphicType = z.infer<
  typeof zFloatFieldPolymorphicType
>;
export type FloatFieldPolymorphicValue = z.infer<
  typeof zFloatFieldPolymorphicValue
>;
export type FloatFieldPolymorphicInputTemplate = z.infer<
  typeof zFloatFieldPolymorphicInputTemplate
>;
// #endregion Float

// #region String

export const zStringFieldType = z.object({
  name: z.literal('StringField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zStringFieldValue = z.string().optional();
export const zStringFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zStringFieldType,
  default: zStringFieldValue,
  maxLength: zIntOptional,
  minLength: zIntOptional,
});

export type StringFieldType = z.infer<typeof zStringFieldType>;
export type StringFieldValue = z.infer<typeof zStringFieldValue>;
export type StringFieldInputTemplate = z.infer<
  typeof zStringFieldInputTemplate
>;

export const zStringFieldPolymorphicType = zStringFieldType.extend({
  isPolymorphic: z.literal(true),
});
export const zStringFieldPolymorphicValue = zStringFieldValue;
export const zStringFieldPolymorphicInputTemplate =
  zStringFieldInputTemplate.extend({
    type: zStringFieldPolymorphicType,
  });
export type StringFieldPolymorphicType = z.infer<
  typeof zStringFieldPolymorphicType
>;
export type StringFieldPolymorphicValue = z.infer<
  typeof zStringFieldPolymorphicValue
>;
export type StringFieldPolymorphicInputTemplate = z.infer<
  typeof zStringFieldPolymorphicInputTemplate
>;
// #endregion String

// #region Boolean

export const zBooleanFieldType = z.object({
  name: z.literal('BooleanField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zBooleanFieldValue = z.boolean().optional();
export const zBooleanFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zBooleanFieldType,
  default: zBooleanFieldValue,
});
export type BooleanFieldType = z.infer<typeof zBooleanFieldType>;
export type BooleanFieldValue = z.infer<typeof zBooleanFieldValue>;
export type BooleanFieldInputTemplate = z.infer<
  typeof zBooleanFieldInputTemplate
>;

export const zBooleanFieldPolymorphicType = zBooleanFieldType.extend({
  isPolymorphic: z.literal(true),
});
export const zBooleanFieldPolymorphicValue = zBooleanFieldValue;
export const zBooleanFieldPolymorphicInputTemplate =
  zBooleanFieldInputTemplate.extend({
    type: zBooleanFieldPolymorphicType,
  });
export type BooleanFieldPolymorphicType = z.infer<
  typeof zBooleanFieldPolymorphicType
>;
export type BooleanFieldPolymorphicValue = z.infer<
  typeof zBooleanFieldPolymorphicValue
>;
export type BooleanFieldPolymorphicInputTemplate = z.infer<
  typeof zBooleanFieldPolymorphicInputTemplate
>;

// #endregion Boolean

// #region Enum

const zEnumFieldType = z.object({
  name: z.literal('EnumField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
const zEnumFieldValue = z.string().optional();
export const zEnumFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zEnumFieldType,
  default: zEnumFieldValue,
  options: z.array(zString),
  labels: z.record(z.string()).optional(),
});
export type EnumFieldType = z.infer<typeof zEnumFieldType>;
export type EnumFieldValue = z.infer<typeof zEnumFieldValue>;
export type EnumFieldInputTemplate = z.infer<typeof zEnumFieldInputTemplate>;

// #endregion Enum

// #region Image

export const zImageFieldType = z.object({
  name: z.literal('ImageField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zImageFieldValue = zImageField.optional();
export const zImageFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zImageFieldType,
  default: zImageFieldValue,
});
export type ImageFieldType = z.infer<typeof zImageFieldType>;
export type ImageFieldValue = z.infer<typeof zImageFieldValue>;
export type ImageFieldInputTemplate = z.infer<typeof zImageFieldInputTemplate>;

export const zImageFieldPolymorphicType = zImageFieldType.extend({
  isPolymorphic: z.literal(true),
});
export const zImageFieldPolymorphicValue = zImageFieldValue;
export const zImageFieldPolymorphicInputTemplate =
  zImageFieldInputTemplate.extend({
    type: zImageFieldPolymorphicType,
  });
export type ImageFieldPolymorphicType = z.infer<
  typeof zImageFieldPolymorphicType
>;
export type ImageFieldPolymorphicValue = z.infer<
  typeof zImageFieldPolymorphicValue
>;
export type ImageFieldPolymorphicInputTemplate = z.infer<
  typeof zImageFieldPolymorphicInputTemplate
>;

// #endregion Image

// #region Board

export const zBoardFieldType = z.object({
  name: z.literal('BoardField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zBoardFieldValue = zBoardField.optional();
export const zBoardFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zBoardFieldType,
  default: zBoardFieldValue,
});
export type BoardFieldType = z.infer<typeof zBoardFieldType>;
export type BoardFieldValue = z.infer<typeof zBoardFieldValue>;
export type BoardFieldInputTemplate = z.infer<typeof zBoardFieldInputTemplate>;

// #endregion Board

// #region Color

export const zColorFieldType = z.object({
  name: z.literal('ColorField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zColorFieldValue = zColorField.optional();
export const zColorFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zColorFieldType,
  default: zColorFieldValue,
});
export type ColorFieldType = z.infer<typeof zColorFieldType>;
export type ColorFieldValue = z.infer<typeof zColorFieldValue>;
export type ColorFieldInputTemplate = z.infer<typeof zColorFieldInputTemplate>;

export const zColorFieldPolymorphicType = z.object({
  name: z.literal('ColorField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(true),
});
export const zColorFieldPolymorphicValue = zColorFieldValue;
export const zColorFieldPolymorphicInputTemplate =
  zColorFieldInputTemplate.extend({
    type: zColorFieldPolymorphicType,
  });
export type ColorFieldPolymorphicType = z.infer<
  typeof zColorFieldPolymorphicType
>;
export type ColorFieldPolymorphicValue = z.infer<
  typeof zColorFieldPolymorphicValue
>;
export type ColorFieldPolymorphicInputTemplate = z.infer<
  typeof zColorFieldPolymorphicInputTemplate
>;

// #endregion Color

// #region Main Model

export const zMainModelFieldType = z.object({
  name: z.literal('MainModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zMainModelFieldValue = zMainOrOnnxModel.optional();
export const zMainModelFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zMainModelFieldType,
  default: zMainModelFieldValue,
});
export type MainModelFieldType = z.infer<typeof zMainModelFieldType>;
export type MainModelFieldValue = z.infer<typeof zMainModelFieldValue>;
export type MainModelFieldInputTemplate = z.infer<
  typeof zMainModelFieldInputTemplate
>;

// #endregion Main Model

// #region SDXL Main Model

export const zSDXLMainModelFieldType = z.object({
  name: z.literal('SDXLMainModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zSDXLMainModelFieldValue = zMainModelFieldValue; // TODO: Narrow to SDXL models only.
export const zSDXLMainModelFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zSDXLMainModelFieldType,
  default: zSDXLMainModelFieldValue,
});
export type SDXLMainModelFieldType = z.infer<typeof zSDXLMainModelFieldType>;
export type SDXLMainModelFieldValue = z.infer<typeof zSDXLMainModelFieldValue>;
export type SDXLMainModelFieldInputTemplate = z.infer<
  typeof zSDXLMainModelFieldInputTemplate
>;

// #endregion SDXL Main Model

// #region SDXL Refiner Model

export const zSDXLRefinerModelFieldType = z.object({
  name: z.literal('SDXLRefinerModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zSDXLRefinerModelFieldValue = zMainModelFieldValue; // TODO: Narrow to SDXL Refiner models only.
export const zSDXLRefinerModelFieldInputTemplate =
  zFieldInputTemplateBase.extend({
    type: zSDXLRefinerModelFieldType,
    default: zSDXLRefinerModelFieldValue,
  });
export type SDXLRefinerModelFieldType = z.infer<
  typeof zSDXLRefinerModelFieldType
>;
export type SDXLRefinerModelFieldValue = z.infer<
  typeof zSDXLRefinerModelFieldValue
>;
export type SDXLRefinerModelFieldInputTemplate = z.infer<
  typeof zSDXLRefinerModelFieldInputTemplate
>;

// #endregion SDXL Refiner Model

// #region VAE Model

export const zVAEModelFieldType = z.object({
  name: z.literal('VAEModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zVAEModelFieldValue = zVAEModelField.optional();
export const zVAEModelFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zVAEModelFieldType,
  default: zVAEModelFieldValue,
});
export type VAEModelFieldType = z.infer<typeof zVAEModelFieldType>;
export type VAEModelFieldValue = z.infer<typeof zVAEModelFieldValue>;
export type VAEModelFieldInputTemplate = z.infer<
  typeof zVAEModelFieldInputTemplate
>;

// #endregion VAE Model

// #region LoRA Model

export const zLoRAModelFieldType = z.object({
  name: z.literal('LoRAModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zLoRAModelFieldValue = zLoRAModelField.optional();
export const zLoRAModelFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zLoRAModelFieldType,
  default: zLoRAModelFieldValue,
});
export type LoRAModelFieldType = z.infer<typeof zLoRAModelFieldType>;
export type LoRAModelFieldValue = z.infer<typeof zLoRAModelFieldValue>;
export type LoRAModelFieldInputTemplate = z.infer<
  typeof zLoRAModelFieldInputTemplate
>;

// #endregion LoRA Model

// #region ControlNet Model

export const zControlNetModelFieldType = z.object({
  name: z.literal('ControlNetModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zControlNetModelFieldValue = zControlNetModelField.optional();
export const zControlNetModelFieldInputTemplate =
  zFieldInputTemplateBase.extend({
    type: zControlNetModelFieldType,
    default: zControlNetModelFieldValue,
  });
export type ControlNetModelFieldType = z.infer<
  typeof zControlNetModelFieldType
>;
export type ControlNetModelFieldValue = z.infer<
  typeof zControlNetModelFieldValue
>;
export type ControlNetModelFieldInputTemplate = z.infer<
  typeof zControlNetModelFieldInputTemplate
>;

// #endregion ControlNet Model

// #region IP Adapter Model

export const zIPAdapterModelFieldType = z.object({
  name: z.literal('IPAdapterModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zIPAdapterModelFieldValue = zIPAdapterModelField.optional();
export const zIPAdapterModelFieldInputTemplate = zFieldInputTemplateBase.extend(
  { type: zIPAdapterModelFieldType, default: zIPAdapterModelFieldValue }
);
export type IPAdapterModelFieldType = z.infer<typeof zIPAdapterModelFieldType>;
export type IPAdapterModelFieldValue = z.infer<
  typeof zIPAdapterModelFieldValue
>;
export type IPAdapterModelFieldInputTemplate = z.infer<
  typeof zIPAdapterModelFieldInputTemplate
>;

// #endregion IP Adapter Model

// #region T2I Adapter

const zT2IAdapterModelFieldType = z.object({
  name: z.literal('T2IAdapterModelField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
const zT2IAdapterModelFieldValue = zT2IAdapterModelFieldType.optional();
export const zT2IAdapterModelFieldInputTemplate =
  zFieldInputTemplateBase.extend({
    type: zT2IAdapterModelFieldType,
    default: zT2IAdapterModelFieldValue,
  });
export type T2IAdapterModelFieldType = z.infer<
  typeof zT2IAdapterModelFieldType
>;
export type T2IAdapterModelFieldValue = z.infer<
  typeof zT2IAdapterModelFieldValue
>;
export type T2IAdapterModelFieldInputTemplate = z.infer<
  typeof zT2IAdapterModelFieldInputTemplate
>;

// #endregion T2I Adapter

// #region Scheduler

export const zSchedulerFieldType = z.object({
  name: z.literal('SchedulerField'),
  isCollection: z.literal(false),
  isPolymorphic: z.literal(false),
});
export const zSchedulerFieldValue = zScheduler.optional();
export const zSchedulerFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zSchedulerFieldType,
  default: zSchedulerFieldValue,
});
export type SchedulerFieldType = z.infer<typeof zSchedulerFieldType>;
export type SchedulerFieldValue = z.infer<typeof zSchedulerFieldValue>;
export type SchedulerFieldInputTemplate = z.infer<
  typeof zSchedulerFieldInputTemplate
>;

// #endregion Scheduler

// #region Other fields

/**
 * "Other" fields refers to fields for which we do not have a UI component:
 * - Fields like UNetField where we do not allow direct UI input
 * - Custom fields
 * - Reserved fields like IsIntermediate
 *
 * Technically, this field type's name should be z.string().min(1), but using this widens the type to string
 * in the zFieldType union. Intersecting that with z.record(z.never(), z.never()) tricks TS into showing us
 * autocomplete when contructing fields, suggesting the literal field names but also accepting any string.
 */
export const zOtherFieldType = z.object({
  name: z.intersection(z.string().min(1), z.record(z.never(), z.never())),
  isCollection: z.boolean(),
  isPolymorphic: z.boolean(),
});
export const zOtherFieldValue = z.undefined(); // we do not store anything for other field types
export const zOtherFieldInputTemplate = zFieldInputTemplateBase.extend({
  type: zOtherFieldType,
  default: zOtherFieldValue,
});

export type OtherFieldType = z.infer<typeof zOtherFieldType>;
export type OtherFieldValue = z.infer<typeof zOtherFieldValue>;
export type OtherFieldInputTemplate = z.infer<typeof zOtherFieldInputTemplate>;

// #endregion Other fields

// #region Field type union

export const zFieldType = z.union([
  zIntegerFieldType,
  zIntegerFieldPolymorphicType,
  zFloatFieldType,
  zFloatFieldPolymorphicType,
  zStringFieldType,
  zStringFieldPolymorphicType,
  zBooleanFieldType,
  zBooleanFieldPolymorphicType,
  zEnumFieldType,
  zImageFieldType,
  zImageFieldPolymorphicType,
  zBoardFieldType,
  zMainModelFieldType,
  zSDXLMainModelFieldType,
  zSDXLRefinerModelFieldType,
  zVAEModelFieldType,
  zLoRAModelFieldType,
  zControlNetModelFieldType,
  zIPAdapterModelFieldType,
  zT2IAdapterModelFieldType,
  zColorFieldType,
  zColorFieldPolymorphicType,
  zSchedulerFieldType,
  zOtherFieldType,
]);
export type FieldType = z.infer<typeof zFieldType>;

// #endregion Field type unions

// #region Field value union

export const zFieldValue = z.union([
  zIntegerFieldValue,
  zIntegerFieldPolymorphicValue,
  zFloatFieldValue,
  zFloatFieldPolymorphicValue,
  zStringFieldValue,
  zStringFieldPolymorphicValue,
  zBooleanFieldValue,
  zBooleanFieldPolymorphicValue,
  zEnumFieldValue,
  zImageFieldValue,
  zImageFieldPolymorphicValue,
  zBoardFieldValue,
  zMainModelFieldValue,
  zSDXLMainModelFieldValue,
  zSDXLRefinerModelFieldValue,
  zVAEModelFieldValue,
  zLoRAModelFieldValue,
  zControlNetModelFieldValue,
  zIPAdapterModelFieldValue,
  zT2IAdapterModelFieldValue,
  zColorFieldValue,
  zColorFieldPolymorphicValue,
  zSchedulerFieldValue,
  zOtherFieldValue,
]);
export type FieldValue = z.infer<typeof zFieldValue>;

// #endregion Field value union

// #region Field instance union

// #endregion Field instances union

// #region Field input/output templates

/**
 * All input field templates that have UI Elements
 */
export const zFieldInputTemplate = z.union([
  zIntegerFieldInputTemplate,
  zIntegerFieldPolymorphicInputTemplate,
  zFloatFieldInputTemplate,
  zFloatFieldPolymorphicInputTemplate,
  zStringFieldInputTemplate,
  zStringFieldPolymorphicInputTemplate,
  zBooleanFieldInputTemplate,
  zBooleanFieldPolymorphicInputTemplate,
  zEnumFieldInputTemplate,
  zImageFieldInputTemplate,
  zImageFieldPolymorphicInputTemplate,
  zBoardFieldInputTemplate,
  zMainModelFieldInputTemplate,
  zSDXLMainModelFieldInputTemplate,
  zSDXLRefinerModelFieldInputTemplate,
  zVAEModelFieldInputTemplate,
  zLoRAModelFieldInputTemplate,
  zControlNetModelFieldInputTemplate,
  zIPAdapterModelFieldInputTemplate,
  zT2IAdapterModelFieldInputTemplate,
  zColorFieldInputTemplate,
  zColorFieldPolymorphicInputTemplate,
  zSchedulerFieldInputTemplate,
  zOtherFieldInputTemplate,
]);
export type FieldInputTemplate = z.infer<typeof zFieldInputTemplate>;

export const zFieldOutputTemplate = z.union([]);
export type FieldOutputTemplate = z.infer<typeof zFieldOutputTemplate>;

// #endregion Field input/output templates
