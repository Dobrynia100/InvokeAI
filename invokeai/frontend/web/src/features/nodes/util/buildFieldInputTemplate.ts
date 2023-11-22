import { get, isNumber, startCase } from 'lodash-es';
import {
  BoardFieldInputTemplate,
  BooleanFieldInputTemplate,
  ColorFieldInputTemplate,
  ControlNetModelFieldInputTemplate,
  EnumFieldInputTemplate,
  FieldInputTemplate,
  FieldType,
  FloatFieldInputTemplate,
  IPAdapterModelFieldInputTemplate,
  ImageFieldInputTemplate,
  IntegerFieldInputTemplate,
  LoRAModelFieldInputTemplate,
  MainModelFieldInputTemplate,
  OtherFieldInputTemplate,
  SDXLMainModelFieldInputTemplate,
  SDXLRefinerModelFieldInputTemplate,
  SchedulerFieldInputTemplate,
  StringFieldInputTemplate,
  T2IAdapterModelFieldInputTemplate,
  VAEModelFieldInputTemplate,
} from '../types/field';
import {
  InvocationFieldSchema,
  InvocationSchemaObject,
} from '../types/openapi';

export type FieldInputTemplateBuilder<T extends FieldInputTemplate> = (arg: {
  schemaObject: InvocationFieldSchema;
  baseField: Omit<T, 'type'>;
  isCollection: boolean;
  isPolymorphic: boolean;
}) => T;

const buildIntegerFieldInputTemplate: FieldInputTemplateBuilder<
  IntegerFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: IntegerFieldInputTemplate = {
    ...baseField,
    type: { name: 'IntegerField', isCollection, isPolymorphic },
    default: schemaObject.default ?? 0,
  };

  if (schemaObject.multipleOf !== undefined) {
    template.multipleOf = schemaObject.multipleOf;
  }

  if (schemaObject.maximum !== undefined) {
    template.maximum = schemaObject.maximum;
  }

  if (
    schemaObject.exclusiveMaximum !== undefined &&
    isNumber(schemaObject.exclusiveMaximum)
  ) {
    template.exclusiveMaximum = schemaObject.exclusiveMaximum;
  }

  if (schemaObject.minimum !== undefined) {
    template.minimum = schemaObject.minimum;
  }

  if (
    schemaObject.exclusiveMinimum !== undefined &&
    isNumber(schemaObject.exclusiveMinimum)
  ) {
    template.exclusiveMinimum = schemaObject.exclusiveMinimum;
  }

  return template;
};

const buildFloatFieldInputTemplate: FieldInputTemplateBuilder<
  FloatFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: FloatFieldInputTemplate = {
    ...baseField,
    type: { name: 'FloatField', isCollection, isPolymorphic },
    default: schemaObject.default ?? 0,
  };

  if (schemaObject.multipleOf !== undefined) {
    template.multipleOf = schemaObject.multipleOf;
  }

  if (schemaObject.maximum !== undefined) {
    template.maximum = schemaObject.maximum;
  }

  if (
    schemaObject.exclusiveMaximum !== undefined &&
    isNumber(schemaObject.exclusiveMaximum)
  ) {
    template.exclusiveMaximum = schemaObject.exclusiveMaximum;
  }

  if (schemaObject.minimum !== undefined) {
    template.minimum = schemaObject.minimum;
  }

  if (
    schemaObject.exclusiveMinimum !== undefined &&
    isNumber(schemaObject.exclusiveMinimum)
  ) {
    template.exclusiveMinimum = schemaObject.exclusiveMinimum;
  }

  return template;
};

const buildStringFieldInputTemplate: FieldInputTemplateBuilder<
  StringFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: StringFieldInputTemplate = {
    ...baseField,
    type: { name: 'StringField', isCollection, isPolymorphic },
    default: schemaObject.default ?? '',
  };

  if (schemaObject.minLength !== undefined) {
    template.minLength = schemaObject.minLength;
  }

  if (schemaObject.maxLength !== undefined) {
    template.maxLength = schemaObject.maxLength;
  }

  return template;
};

const buildBooleanFieldInputTemplate: FieldInputTemplateBuilder<
  BooleanFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: BooleanFieldInputTemplate = {
    ...baseField,
    type: { name: 'BooleanField', isCollection, isPolymorphic },
    default: schemaObject.default ?? false,
  };

  return template;
};

const buildMainModelFieldInputTemplate: FieldInputTemplateBuilder<
  MainModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: MainModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'MainModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildSDXLMainModelFieldInputTemplate: FieldInputTemplateBuilder<
  SDXLMainModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: SDXLMainModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'SDXLMainModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildRefinerModelFieldInputTemplate: FieldInputTemplateBuilder<
  SDXLRefinerModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: SDXLRefinerModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'SDXLRefinerModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildVAEModelFieldInputTemplate: FieldInputTemplateBuilder<
  VAEModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: VAEModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'VaeModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildLoRAModelFieldInputTemplate: FieldInputTemplateBuilder<
  LoRAModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: LoRAModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'LoRAModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildControlNetModelFieldInputTemplate: FieldInputTemplateBuilder<
  ControlNetModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: ControlNetModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'ControlNetModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildIPAdapterModelFieldInputTemplate: FieldInputTemplateBuilder<
  IPAdapterModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: IPAdapterModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'IPAdapterModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildT2IAdapterModelFieldInputTemplate: FieldInputTemplateBuilder<
  T2IAdapterModelFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: T2IAdapterModelFieldInputTemplate = {
    ...baseField,
    type: { name: 'T2IAdapterModelField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildBoardFieldInputTemplate: FieldInputTemplateBuilder<
  BoardFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: BoardFieldInputTemplate = {
    ...baseField,
    type: { name: 'BoardField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildImageFieldInputTemplate: FieldInputTemplateBuilder<
  ImageFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: ImageFieldInputTemplate = {
    ...baseField,
    type: { name: 'ImageField', isCollection, isPolymorphic },
    default: schemaObject.default ?? undefined,
  };

  return template;
};

const buildEnumFieldInputTemplate: FieldInputTemplateBuilder<
  EnumFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const options = schemaObject.enum ?? [];
  const template: EnumFieldInputTemplate = {
    ...baseField,
    type: { name: 'EnumField', isCollection, isPolymorphic },
    options,
    ui_choice_labels: schemaObject.ui_choice_labels,
    default: schemaObject.default ?? options[0],
  };

  return template;
};

const buildColorFieldInputTemplate: FieldInputTemplateBuilder<
  ColorFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: ColorFieldInputTemplate = {
    ...baseField,
    type: { name: 'ColorField', isCollection, isPolymorphic },
    default: schemaObject.default ?? { r: 127, g: 127, b: 127, a: 255 },
  };

  return template;
};

const buildSchedulerFieldInputTemplate: FieldInputTemplateBuilder<
  SchedulerFieldInputTemplate
> = ({ schemaObject, baseField, isCollection, isPolymorphic }) => {
  const template: SchedulerFieldInputTemplate = {
    ...baseField,
    type: { name: 'SchedulerField', isCollection, isPolymorphic },
    default: schemaObject.default ?? 'euler',
  };

  return template;
};

export const TEMPLATE_BUILDER_MAP = {
  BoardField: buildBoardFieldInputTemplate,
  BooleanField: buildBooleanFieldInputTemplate,
  ColorField: buildColorFieldInputTemplate,
  ControlNetModelField: buildControlNetModelFieldInputTemplate,
  EnumField: buildEnumFieldInputTemplate,
  FloatField: buildFloatFieldInputTemplate,
  ImageField: buildImageFieldInputTemplate,
  IntegerField: buildIntegerFieldInputTemplate,
  IPAdapterModelField: buildIPAdapterModelFieldInputTemplate,
  LoRAModelField: buildLoRAModelFieldInputTemplate,
  MainModelField: buildMainModelFieldInputTemplate,
  SchedulerField: buildSchedulerFieldInputTemplate,
  SDXLMainModelField: buildSDXLMainModelFieldInputTemplate,
  SDXLRefinerModelField: buildRefinerModelFieldInputTemplate,
  StringField: buildStringFieldInputTemplate,
  T2IAdapterModelField: buildT2IAdapterModelFieldInputTemplate,
  VaeModelField: buildVAEModelFieldInputTemplate,
};

export const buildFieldInputTemplate = (
  nodeSchema: InvocationSchemaObject,
  fieldSchema: InvocationFieldSchema,
  name: string,
  fieldType: FieldType
): FieldInputTemplate | undefined => {
  const {
    input,
    ui_hidden,
    ui_component,
    ui_type,
    ui_order,
    ui_choice_labels,
    item_default,
  } = fieldSchema;

  const extra = {
    input:
      fieldType.isCollection || fieldType.isPolymorphic ? 'connection' : input,
    ui_hidden,
    ui_component,
    ui_type,
    required: nodeSchema.required?.includes(name) ?? false,
    ui_order,
    ui_choice_labels,
    item_default,
  };

  const baseField = {
    name,
    title: fieldSchema.title ?? (name ? startCase(name) : ''),
    description: fieldSchema.description ?? '',
    fieldKind: 'input' as const,
    ...extra,
  };

  const builder = get(TEMPLATE_BUILDER_MAP, fieldType.name);

  if (!builder) {
    // This field is not a templated field
    const template: OtherFieldInputTemplate = {
      ...baseField,
      type: fieldType,
      default: undefined,
    };
    return template;
  }

  return builder({
    schemaObject: fieldSchema,
    baseField,
    isCollection: fieldType.isCollection,
    isPolymorphic: fieldType.isPolymorphic,
  });
};
