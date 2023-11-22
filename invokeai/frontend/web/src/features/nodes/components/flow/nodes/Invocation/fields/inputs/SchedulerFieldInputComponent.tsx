import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import IAIMantineSearchableSelect from 'common/components/IAIMantineSearchableSelect';
import { fieldSchedulerValueChanged } from 'features/nodes/store/nodesSlice';
import {
  SchedulerFieldInputTemplate,
  SchedulerFieldInputInstance,
  FieldComponentProps,
} from 'features/nodes/types/field';
import {
  SCHEDULER_LABEL_MAP,
  SchedulerParam,
} from 'features/parameters/types/parameterSchemas';
import { map } from 'lodash-es';
import { memo, useCallback } from 'react';

const selector = createSelector(
  [stateSelector],
  ({ ui }) => {
    const { favoriteSchedulers: enabledSchedulers } = ui;

    const data = map(SCHEDULER_LABEL_MAP, (label, name) => ({
      value: name,
      label: label,
      group: enabledSchedulers.includes(name as SchedulerParam)
        ? 'Favorites'
        : undefined,
    })).sort((a, b) => a.label.localeCompare(b.label));

    return {
      data,
    };
  },
  defaultSelectorOptions
);

const SchedulerFieldInputComponent = (
  props: FieldComponentProps<
    SchedulerFieldInputInstance,
    SchedulerFieldInputTemplate
  >
) => {
  const { nodeId, field } = props;
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selector);

  const handleChange = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }
      dispatch(
        fieldSchedulerValueChanged({
          nodeId,
          fieldName: field.name,
          value: value as SchedulerParam,
        })
      );
    },
    [dispatch, field.name, nodeId]
  );

  return (
    <IAIMantineSearchableSelect
      className="nowheel nodrag"
      value={field.value}
      data={data}
      onChange={handleChange}
    />
  );
};

export default memo(SchedulerFieldInputComponent);
