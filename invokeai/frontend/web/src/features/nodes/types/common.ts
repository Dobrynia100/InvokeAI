import { z } from 'zod';
import { zBaseModel } from 'features/parameters/types/parameterSchemas';

export const zFieldInput = z.enum(['connection', 'direct', 'any']);
/**
 * Indicates the kind of input(s) this field may have:
 * - "connection": only accepts connections from other nodes
 * - "direct": only accepts direct values, entered by user in the UI
 * - "any": accepts both connections and direct values
 */
export type FieldInput = z.infer<typeof zFieldInput>;

export const zFieldUIComponent = z.enum(['none', 'textarea', 'slider']);
/**
 * Indicates the kind of UI component to use for this field, if different from its default..
 */
export type FieldUIComponent = z.infer<typeof zFieldUIComponent>;

// #region Field value schemas (direct values)

export const zImageField = z.object({
  image_name: z.string().trim().min(1),
});
export type ImageField = z.infer<typeof zImageField>;

export const zBoardField = z.object({
  board_id: z.string().trim().min(1),
});
export type BoardField = z.infer<typeof zBoardField>;

export const zColorField = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
  a: z.number().int().min(0).max(255),
});
export type ColorField = z.infer<typeof zColorField>;

export const zModelIdentifier = z.object({
  model_name: z.string().trim().min(1),
  base_model: zBaseModel,
});

export const zModelType = z.enum([
  'onnx',
  'main',
  'vae',
  'lora',
  'controlnet',
  'embedding',
]);
export type ModelType = z.infer<typeof zModelType>;

export const zSubModelType = z.enum([
  'unet',
  'text_encoder',
  'text_encoder_2',
  'tokenizer',
  'tokenizer_2',
  'vae',
  'vae_decoder',
  'vae_encoder',
  'scheduler',
  'safety_checker',
]);
export type SubModelType = z.infer<typeof zSubModelType>;

export const zVAEModelField = zModelIdentifier;

export const zModelInfo = zModelIdentifier.extend({
  model_type: zModelType,
  submodel: zSubModelType.optional(),
});
export type ModelInfo = z.infer<typeof zModelInfo>;

export const zLoRAModelField = zModelIdentifier;
export type LoRAModelField = z.infer<typeof zLoRAModelField>;

export const zControlNetModelField = zModelIdentifier;
export type ControlNetModelField = z.infer<typeof zControlNetModelField>;

export const zIPAdapterModelField = zModelIdentifier;
export type IPAdapterModelField = z.infer<typeof zIPAdapterModelField>;

export const zT2IAdapterModelField = zModelIdentifier;
export type T2IAdapterModelField = z.infer<typeof zT2IAdapterModelField>;

export const zLoraInfo = zModelInfo.extend({
  weight: z.number().optional(),
});
export type LoraInfo = z.infer<typeof zLoraInfo>;

export const zUNetField = z.object({
  unet: zModelInfo,
  scheduler: zModelInfo,
  loras: z.array(zLoraInfo),
});
export type UNetField = z.infer<typeof zUNetField>;

export const zCLIPField = z.object({
  tokenizer: zModelInfo,
  text_encoder: zModelInfo,
  skipped_layers: z.number(),
  loras: z.array(zLoraInfo),
});
export type CLIPField = z.infer<typeof zCLIPField>;

export const zVAEField = z.object({
  vae: zModelInfo,
});
export type VAEField = z.infer<typeof zVAEField>;

export const zControlField = z.object({
  image: zImageField,
  control_model: zControlNetModelField,
  control_weight: z.union([z.number(), z.array(z.number())]).optional(),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
  control_mode: z
    .enum(['balanced', 'more_prompt', 'more_control', 'unbalanced'])
    .optional(),
  resize_mode: z
    .enum(['just_resize', 'crop_resize', 'fill_resize', 'just_resize_simple'])
    .optional(),
});
export type ControlField = z.infer<typeof zControlField>;

export const zIPAdapterField = z.object({
  image: zImageField,
  ip_adapter_model: zIPAdapterModelField,
  weight: z.number(),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
});
export type IPAdapterField = z.infer<typeof zIPAdapterField>;

export const zT2IAdapterField = z.object({
  image: zImageField,
  t2i_adapter_model: zT2IAdapterModelField,
  weight: z.union([z.number(), z.array(z.number())]).optional(),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
  resize_mode: z
    .enum(['just_resize', 'crop_resize', 'fill_resize', 'just_resize_simple'])
    .optional(),
});
export type T2IAdapterField = z.infer<typeof zT2IAdapterField>;

// #endregion

// #region ProgressImage

export const zProgressImage = z.object({
  dataURL: z.string(),
  width: z.number().int(),
  height: z.number().int(),
});
export type ProgressImage = z.infer<typeof zProgressImage>;

// #endregion
