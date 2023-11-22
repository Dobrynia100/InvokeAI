import { colorTokenToCssVar } from 'common/util/colorTokenToCssVar';
import { FIELDS } from 'features/nodes/types/constants';
import { FieldType } from 'features/nodes/types/field';

export const getFieldColor = (fieldType: FieldType | null): string => {
  if (!fieldType) {
    return colorTokenToCssVar('base.500');
  }
  const color = FIELDS[fieldType.name]?.color;

  return color ? colorTokenToCssVar(color) : colorTokenToCssVar('base.500');
};
