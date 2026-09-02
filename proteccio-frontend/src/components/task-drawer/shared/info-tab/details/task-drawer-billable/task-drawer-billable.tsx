import { SocketEvents } from '@/shared/socket-events';
import { useSocket } from '@/socket/socketContext';
import { ITaskViewModel } from '@/types/tasks/task.types';
import logger from '@/utils/errorLogger';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Switch } from '@/shared/antd-imports';

interface TaskDrawerBillableProps {
  task?: ITaskViewModel | null;
}

const TaskDrawerBillable = ({ task = null }: TaskDrawerBillableProps) => {
  const { socket, connected } = useSocket();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const projectId = useAppSelector(state => state.projectReducer.projectId);

  // Read billable status directly from Redux to ensure real-time updates
  const billableFromRedux = useAppSelector(
    state => state.taskDrawerReducer?.taskFormViewModel?.task?.billable
  );

  // Use local state to track the billable value for immediate UI feedback
  const [localBillable, setLocalBillable] = useState<boolean>(false);

  // Sync local state with Redux or prop value
  useEffect(() => {
    const billableValue = billableFromRedux !== undefined ? billableFromRedux : task?.billable;
    if (billableValue !== undefined) {
      setLocalBillable(billableValue);
    }
  }, [billableFromRedux, task?.billable]);

  const handleBillableChange = (checked: boolean) => {

    if (!connected) return;

    // Optimistically update local state for immediate UI feedback
    setLocalBillable(checked);

    try {
      socket?.emit(SocketEvents.TASK_BILLABLE_CHANGE.toString(), {
        task_id: task?.id,
        billable: checked,
      });
    } catch (error) {
      logger.error('Error updating billable status', error);
      // Revert on error
      setLocalBillable(!checked);
    }
  };


  return (
    <Flex gap={8} align="center">
      <Switch checked={localBillable} onChange={handleBillableChange} />
      <Button
        size="small"
        type="default"
        onClick={() => {
          if (projectId) {
            navigate(`/proteccio/projects/${projectId}?tab=finance`);
          }
        }}
      >
        {t('seeSpends', { defaultValue: t('seeSpends') })}
      </Button>
    </Flex>
  );
};

export default TaskDrawerBillable;
