import { TaskToShow } from '@/actions/tasks.actions';
import { useQuery } from '@tanstack/react-query';



export const useFetchTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => TaskToShow(userId),
  
    enabled: !!userId, // Only run the query if userId is provided

});
};
