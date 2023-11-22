export const HANDLE_TOOLTIP_OPEN_DELAY = 500;
export const COLOR_TOKEN_VALUE = 500;
export const NODE_WIDTH = 320;
export const NODE_MIN_WIDTH = 320;
export const DRAG_HANDLE_CLASSNAME = 'node-drag-handle';

export const IMAGE_FIELDS = ['ImageField', 'ImageCollection'];
export const FOOTER_FIELDS = IMAGE_FIELDS;

export const KIND_MAP = {
  input: 'inputs' as const,
  output: 'outputs' as const,
};

export const MODEL_TYPES = [
  'IPAdapterModelField',
  'ControlNetModelField',
  'LoRAModelField',
  'MainModelField',
  'ONNXModelField',
  'SDXLMainModelField',
  'SDXLRefinerModelField',
  'VaeModelField',
  'UNetField',
  'VaeField',
  'ClipField',
  'T2IAdapterModelField',
  'IPAdapterModelField',
];

export const FIELD_COLORS: Record<string, string> = {
  BoardField: 'purple.500',
  BooleanField: 'green.500',
  ClipField: 'green.500',
  ColorField: 'pink.300',
  ConditioningField: 'cyan.500',
  ControlField: 'teal.500',
  ControlNetModelField: 'teal.500',
  EnumField: 'blue.500',
  FloatField: 'orange.500',
  ImageField: 'purple.500',
  IntegerField: 'red.500',
  IPAdapterField: 'teal.500',
  IPAdapterModelField: 'teal.500',
  LatentsField: 'pink.500',
  LoRAModelField: 'teal.500',
  MainModelField: 'teal.500',
  ONNXModelField: 'teal.500',
  SDXLMainModelField: 'teal.500',
  SDXLRefinerModelField: 'teal.500',
  StringField: 'yellow.500',
  T2IAdapterField: 'teal.500',
  T2IAdapterModelField: 'teal.500',
  UNetField: 'red.500',
  VaeField: 'blue.500',
  VaeModelField: 'teal.500',
};
