import { z } from 'zod';
import { zInvocationNodeData, zNotesNodeData } from './invocation';
import { JsonObject } from 'type-fest';
import { zSemVer } from './semver';
import { keyBy } from 'lodash-es';
import i18n from 'i18n';
import { zFieldIdentifier } from './field';

// #region Workflow misc

export const zXYPosition = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .default({ x: 0, y: 0 });
export type XYPosition = z.infer<typeof zXYPosition>;

export const zDimension = z.number().gt(0).nullish();
export type Dimension = z.infer<typeof zDimension>;

// #endregion

// #region Workflow Nodes

export const zWorkflowInvocationNode = z.object({
  id: z.string().trim().min(1),
  type: z.literal('invocation'),
  data: zInvocationNodeData,
  width: zDimension,
  height: zDimension,
  position: zXYPosition,
});
export const zWorkflowNotesNode = z.object({
  id: z.string().trim().min(1),
  type: z.literal('notes'),
  data: zNotesNodeData,
  width: zDimension,
  height: zDimension,
  position: zXYPosition,
});
export const zWorkflowNode = z.union([
  zWorkflowInvocationNode,
  zWorkflowNotesNode,
]);

export type WorkflowInvocationNode = z.infer<typeof zWorkflowInvocationNode>;
export type WorkflowNotesNode = z.infer<typeof zWorkflowNotesNode>;
export type WorkflowNode = z.infer<typeof zWorkflowNode>;

export const isWorkflowInvocationNode = (
  val: unknown
): val is WorkflowInvocationNode =>
  zWorkflowInvocationNode.safeParse(val).success;

// #endregion

// #region Workflow Edges

export const zWorkflowEdgeBase = z.object({
  id: z.string().trim().min(1),
  source: z.string().trim().min(1),
  target: z.string().trim().min(1),
});
export const zWorkflowEdgeDefault = zWorkflowEdgeBase.extend({
  type: z.literal('default'),
  sourceHandle: z.string().trim().min(1),
  targetHandle: z.string().trim().min(1),
});
export const zWorkflowEdgeCollapsed = zWorkflowEdgeBase.extend({
  type: z.literal('collapsed'),
});
export const zWorkflowEdge = z.union([
  zWorkflowEdgeDefault,
  zWorkflowEdgeCollapsed,
]);

export type WorkflowEdgeDefault = z.infer<typeof zWorkflowEdgeDefault>;
export type WorkflowEdgeCollapsed = z.infer<typeof zWorkflowEdgeCollapsed>;
export type WorkflowEdge = z.infer<typeof zWorkflowEdge>;

// #endregion

export type WorkflowWarning = {
  message: string;
  issues: string[];
  data: JsonObject;
};

const CURRENT_WORKFLOW_VERSION = '1.0.0';

export const zWorkflow = z.object({
  name: z.string().default(''),
  author: z.string().default(''),
  description: z.string().default(''),
  version: z.string().default(''),
  contact: z.string().default(''),
  tags: z.string().default(''),
  notes: z.string().default(''),
  nodes: z.array(zWorkflowNode).default([]),
  edges: z.array(zWorkflowEdge).default([]),
  exposedFields: z.array(zFieldIdentifier).default([]),
  meta: z
    .object({
      version: zSemVer,
    })
    .default({ version: CURRENT_WORKFLOW_VERSION }),
});

export const zValidatedWorkflow = zWorkflow.transform((workflow) => {
  const { nodes, edges } = workflow;
  const warnings: WorkflowWarning[] = [];
  const invocationNodes = nodes.filter(isWorkflowInvocationNode);
  const keyedNodes = keyBy(invocationNodes, 'id');
  edges.forEach((edge, i) => {
    const sourceNode = keyedNodes[edge.source];
    const targetNode = keyedNodes[edge.target];
    const issues: string[] = [];
    if (!sourceNode) {
      issues.push(
        `${i18n.t('nodes.outputNode')} ${edge.source} ${i18n.t(
          'nodes.doesNotExist'
        )}`
      );
    } else if (
      edge.type === 'default' &&
      !(edge.sourceHandle in sourceNode.data.outputs)
    ) {
      issues.push(
        `${i18n.t('nodes.outputField')}"${edge.source}.${
          edge.sourceHandle
        }" ${i18n.t('nodes.doesNotExist')}`
      );
    }
    if (!targetNode) {
      issues.push(
        `${i18n.t('nodes.inputNode')} ${edge.target} ${i18n.t(
          'nodes.doesNotExist'
        )}`
      );
    } else if (
      edge.type === 'default' &&
      !(edge.targetHandle in targetNode.data.inputs)
    ) {
      issues.push(
        `${i18n.t('nodes.inputField')} "${edge.target}.${
          edge.targetHandle
        }" ${i18n.t('nodes.doesNotExist')}`
      );
    }
    if (issues.length) {
      delete edges[i];
      const src = edge.type === 'default' ? edge.sourceHandle : edge.source;
      const tgt = edge.type === 'default' ? edge.targetHandle : edge.target;
      warnings.push({
        message: `${i18n.t('nodes.edge')} "${src} -> ${tgt}" ${i18n.t(
          'nodes.skipped'
        )}`,
        issues,
        data: edge,
      });
    }
  });
  return { workflow, warnings };
});

export type Workflow = z.infer<typeof zWorkflow>;
