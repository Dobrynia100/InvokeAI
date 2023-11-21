import { logger } from 'app/logging/logger';
import { Workflow, zWorkflow } from 'features/nodes/types/types';
import { LIST_TAG, api } from '..';
import { paths } from '../schema';

export const workflowsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWorkflow: build.query<Workflow | undefined, string>({
      query: (workflow_id) => `workflows/i/${workflow_id}`,
      providesTags: (result, error, workflow_id) => [
        { type: 'Workflow', id: workflow_id },
      ],
      transformResponse: (
        response: paths['/api/v1/workflows/i/{workflow_id}']['get']['responses']['200']['content']['application/json']
      ) => {
        if (response) {
          const result = zWorkflow.safeParse(response.workflow);
          if (result.success) {
            return result.data;
          } else {
            logger('images').warn('Problem parsing workflow');
          }
        }
        return;
      },
    }),
    createWorkflow: build.mutation<Workflow, Workflow>({
      query: (workflow) => ({
        url: 'workflows',
        method: 'POST',
        body: workflow,
      }),
      invalidatesTags: [{ type: 'Workflow', id: LIST_TAG }],
    }),
    listWorkflows: build.query<
      paths['/api/v1/workflows/']['get']['responses']['200']['content']['application/json'],
      NonNullable<paths['/api/v1/workflows/']['get']['parameters']['query']>
    >({
      query: (params) => ({
        url: 'workflows/',
        params,
      }),
      providesTags: (result, error, params) => [
        { type: 'Workflow', id: LIST_TAG },
        { type: 'Workflow', id: params?.page },
      ],
    }),
  }),
});

export const { useGetWorkflowQuery, useListWorkflowsQuery } = workflowsApi;
