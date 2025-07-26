import { useMemo } from 'react';
import { Task, TaskStatus } from '../../tasks/services/TaskService';

export const useTodayTasks = (tasks: Task[]) => {
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for uncompleted tasks that have no due date or due date <= today
    const incompleteTasks = tasks.filter(task => {
      if (task.status === TaskStatus.COMPLETED) {
        return false;
      }

      // If no due date, include it
      if (!task.dueDate) {
        return true;
      }

      // If due date is today or in the past, include it
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate <= today;
    });

    // Filter for completed tasks where completedAt is today
    // Note: completedAt is set by the backend when status changes to COMPLETED
    const completedTasks = tasks.filter(task => {
      if (task.status !== TaskStatus.COMPLETED) {
        return false;
      }

      // If no completedAt field, the backend hasn't processed it yet
      // We'll include it anyway since the user just marked it as completed
      if (!task.completedAt) {
        return true;
      }

      const completedDate = new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    return {
      incompleteTasks,
      completedTasks,
    };
  }, [tasks]);

  return todayTasks;
};
