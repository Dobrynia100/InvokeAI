import { FieldType } from 'features/nodes/types/field';
import { isEqual } from 'lodash-es';

/**
 * Validates that the source and target types are compatible for a connection.
 * @param sourceType The type of the source field.
 * @param targetType The type of the target field.
 * @returns True if the connection is valid, false otherwise.
 */
export const validateSourceAndTargetTypes = (
  sourceType: FieldType,
  targetType: FieldType
) => {
  // TODO: There's a bug with Collect -> Iterate nodes:
  // https://github.com/invoke-ai/InvokeAI/issues/3956
  // Once this is resolved, we can remove this check.
  // Note that 'Collection' here is a field type, not node type.
  if (sourceType.name === 'Collection' && targetType.name === 'Collection') {
    return false;
  }

  if (isEqual(sourceType, targetType)) {
    return true;
  }

  /**
   * Connection types must be the same for a connection, with exceptions:
   * - CollectionItem can connect to any non-Collection
   * - Non-Collections can connect to CollectionItem
   * - Anything (non-Collections, Collections, Polymorphics) can connect to Polymorphics of the same base type
   * - Generic Collection can connect to any other Collection or Polymorphic
   * - Any Collection can connect to a Generic Collection
   */

  const isCollectionItemToNonCollection =
    sourceType.name === 'CollectionItem' && !targetType.isCollection;

  const isNonCollectionToCollectionItem =
    targetType.name === 'CollectionItem' &&
    !sourceType.isCollection &&
    !sourceType.isPolymorphic;

  const isAnythingToPolymorphicOfSameBaseType =
    targetType.isPolymorphic && sourceType.name === targetType.name;

  const isGenericCollectionToAnyCollectionOrPolymorphic =
    sourceType.name === 'Collection' &&
    (targetType.isCollection || targetType.isPolymorphic);

  const isCollectionToGenericCollection =
    targetType.name === 'Collection' && sourceType.isCollection;

  const areBothTypesSingle =
    !sourceType.isCollection &&
    !sourceType.isPolymorphic &&
    !targetType.isCollection &&
    !targetType.isPolymorphic;

  const isIntToFloat =
    areBothTypesSingle &&
    sourceType.name === 'IntegerField' &&
    targetType.name === 'FloatField';

  const isIntOrFloatToString =
    areBothTypesSingle &&
    (sourceType.name === 'IntegerField' || sourceType.name === 'FloatField') &&
    targetType.name === 'StringField';

  const isTargetAnyType = targetType.name === 'Any';

  // One of these must be true for the connection to be valid
  return (
    isCollectionItemToNonCollection ||
    isNonCollectionToCollectionItem ||
    isAnythingToPolymorphicOfSameBaseType ||
    isGenericCollectionToAnyCollectionOrPolymorphic ||
    isCollectionToGenericCollection ||
    isIntToFloat ||
    isIntOrFloatToString ||
    isTargetAnyType
  );
};
