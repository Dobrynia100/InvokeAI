import { z } from 'zod';
import { zFieldInputTemplate, zFieldOutputTemplate } from './fields';
import { zSemVer } from './semver';

export const zInvocationTemplate = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string().min(1)),
  inputs: z.record(zFieldInputTemplate),
  outputs: z.record(zFieldOutputTemplate),
  outputType: z.string().min(1),
  withWorkflow: z.boolean(),
  version: zSemVer,
  useCache: z.boolean(),
});
export type InvocationTemplate = z.infer<typeof zInvocationTemplate>;
