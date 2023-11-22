import { isArray, isNumber, startCase } from 'lodash-es';
import { OpenAPIV3_1 } from 'openapi-types';
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
  OpenAPIV3_1SchemaOrRef,
  isArraySchemaObject,
  isNonArraySchemaObject,
  isRefObject,
  isSchemaObject,
} from '../types/openapi';

export type BaseFieldProperties = 'name' | 'title' | 'description';

export type FieldInputTemplateBuilder<T extends FieldInputTemplate> = (arg: {
  schemaObject: InvocationFieldSchema;
  baseField: Omit<T, 'type'>;
  isCollection: boolean;
  isPolymorphic: boolean;
}) => T;

/**
 * Transforms an invocation output ref object to field type.
 * @param ref The ref string to transform
 * @returns The field type.
 *
 * @example
 * refObjectToFieldType({ "$ref": "#/components/schemas/ImageField" }) --> 'ImageField'
 */
export const refObjectToSchemaName = (refObject: OpenAPIV3_1.ReferenceObject) =>
  refObject.$ref.split('/').slice(-1)[0];

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
    type: { name: 'VAEModelField', isCollection, isPolymorphic },
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

const OPENAPI_TYPE_MAP: Record<string, string> = {
  integer: 'IntegerField',
  number: 'FloatField',
  string: 'StringField',
  boolean: 'BooleanField',
};

export const getFieldType = (
  schemaObject: OpenAPIV3_1SchemaOrRef
): FieldType | undefined => {
  if (isSchemaObject(schemaObject)) {
    if (!schemaObject.type) {
      // if schemaObject has no type, then it should have one of allOf, anyOf, oneOf

      if (schemaObject.allOf) {
        const allOf = schemaObject.allOf;
        if (allOf && allOf[0] && isRefObject(allOf[0])) {
          // This is a single ref type
          const name = refObjectToSchemaName(allOf[0]);

          if (!name) {
            // something has gone terribly awry
            return;
          }
          return {
            name,
            isCollection: false,
            isPolymorphic: false,
          };
        }
      } else if (schemaObject.anyOf) {
        // ignore null types
        const anyOf = schemaObject.anyOf.filter((i) => {
          if (isSchemaObject(i)) {
            if (i.type === 'null') {
              return false;
            }
          }
          return true;
        });
        if (anyOf.length === 1) {
          // This is a single ref type
          if (isRefObject(anyOf[0])) {
            const name = refObjectToSchemaName(anyOf[0]);
            if (!name) {
              return;
            }

            return {
              name,
              isCollection: false,
              isPolymorphic: false,
            };
          } else if (isSchemaObject(anyOf[0])) {
            return getFieldType(anyOf[0]);
          }
        }
        /**
         * Handle Polymorphic inputs, eg string | string[]. In OpenAPI, this is:
         * - an `anyOf` with two items
         * - one is an `ArraySchemaObject` with a single `SchemaObject or ReferenceObject` of type T in its `items`
         * - the other is a `SchemaObject` or `ReferenceObject` of type T
         *
         * Any other cases we ignore.
         */

        let firstType: string | undefined;
        let secondType: string | undefined;

        if (isArraySchemaObject(anyOf[0])) {
          // first is array, second is not
          const first = anyOf[0].items;
          const second = anyOf[1];
          if (isRefObject(first) && isRefObject(second)) {
            firstType = refObjectToSchemaName(first);
            secondType = refObjectToSchemaName(second);
          } else if (
            isNonArraySchemaObject(first) &&
            isNonArraySchemaObject(second)
          ) {
            firstType = first.type;
            secondType = second.type;
          }
        } else if (isArraySchemaObject(anyOf[1])) {
          // first is not array, second is
          const first = anyOf[0];
          const second = anyOf[1].items;
          if (isRefObject(first) && isRefObject(second)) {
            firstType = refObjectToSchemaName(first);
            secondType = refObjectToSchemaName(second);
          } else if (
            isNonArraySchemaObject(first) &&
            isNonArraySchemaObject(second)
          ) {
            firstType = first.type;
            secondType = second.type;
          }
        }
        if (firstType && firstType === secondType) {
          // Polymorphic field type
          return { name: firstType, isCollection: false, isPolymorphic: true };
        }
      }
    } else if (schemaObject.enum) {
      return { name: 'EnumField', isCollection: false, isPolymorphic: false };
    } else if (schemaObject.type) {
      if (schemaObject.type === 'array') {
        // We need to get the type of the items
        if (isSchemaObject(schemaObject.items)) {
          const itemType = schemaObject.items.type;
          if (!itemType || isArray(itemType)) {
            return;
          }
          // This is an OpenAPI primitive - 'null', 'object', 'array', 'integer', 'number', 'string', 'boolean'
          const name = OPENAPI_TYPE_MAP[itemType];
          if (!name) {
            // it's 'null', 'object', or 'array' - skip
            return;
          }
          return {
            name,
            isCollection: true,
            isPolymorphic: false,
          };
        }

        // This is a ref object, extract the type name
        const name = refObjectToSchemaName(schemaObject.items);
        if (!name) {
          // something has gone terribly awry
          return;
        }
        return {
          name,
          isCollection: true,
          isPolymorphic: false,
        };
      } else if (!isArray(schemaObject.type)) {
        // This is an OpenAPI primitive - 'null', 'object', 'array', 'integer', 'number', 'string', 'boolean'
        const name = OPENAPI_TYPE_MAP[schemaObject.type];
        if (!name) {
          // it's 'null', 'object', or 'array' - skip
          return;
        }
        return {
          name,
          isCollection: false,
          isPolymorphic: false,
        };
      }
    }
  } else if (isRefObject(schemaObject)) {
    const name = refObjectToSchemaName(schemaObject);
    if (!name) {
      return;
    }
    return {
      name,
      isCollection: false,
      isPolymorphic: false,
    };
  }
  return;
};

const TEMPLATE_BUILDER_MAP: {
  [key in string]: FieldInputTemplateBuilder<any>;
} = {
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
  Scheduler: buildSchedulerFieldInputTemplate,
  SDXLMainModelField: buildSDXLMainModelFieldInputTemplate,
  SDXLRefinerModelField: buildRefinerModelFieldInputTemplate,
  StringField: buildStringFieldInputTemplate,
  T2IAdapterModelField: buildT2IAdapterModelFieldInputTemplate,
  VAEModelField: buildVAEModelFieldInputTemplate,
};

/**
 * Builds an input field from an invocation schema property.
 * @param fieldSchema The schema object
 * @returns An input field
 */
export const buildInputFieldTemplate = (
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

  const builder = TEMPLATE_BUILDER_MAP[fieldType.name];

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
