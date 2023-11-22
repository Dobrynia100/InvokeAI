import { isArray } from 'lodash-es';
import { OpenAPIV3_1 } from 'openapi-types';
import { FieldType } from '../types/field';
import {
  OpenAPIV3_1SchemaOrRef,
  isArraySchemaObject,
  isNonArraySchemaObject,
  isRefObject,
  isSchemaObject,
} from '../types/openapi';

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
          return {
            name: OPENAPI_TYPE_MAP[firstType] ?? firstType,
            isCollection: false,
            isPolymorphic: true,
          };
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
