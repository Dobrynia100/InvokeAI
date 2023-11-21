import { WorkflowCategory } from 'features/nodes/types/types';
import { memo, useState } from 'react';
import { useListWorkflowsQuery } from 'services/api/endpoints/workflows';
import WorkflowLibraryContent from './WorkflowLibraryContent';

const PER_PAGE = 10;

const WorkflowLibraryWrapper = () => {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<WorkflowCategory>('image');
  const { data } = useListWorkflowsQuery({
    page,
    per_page: PER_PAGE,
    category,
  });

  if (!data) {
    return null;
  }

  return (
    <WorkflowLibraryContent
      data={data}
      page={page}
      setPage={setPage}
      category={category}
      setCategory={setCategory}
    />
  );
};

export default memo(WorkflowLibraryWrapper);
