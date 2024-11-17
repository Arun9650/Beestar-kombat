import { TaskToShow } from '@/actions/tasks.actions';
import { fetchTask } from '@/services/apis/axiosFucntions';
import { useQuery } from '@tanstack/react-query';



export const useFetchTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => fetchTask(userId),
});
};
