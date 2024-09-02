import { completeTask } from "@/actions/tasks.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";


  
export const useTasksMutation =  () => {
  
    const queryClient = useQueryClient();

    return useMutation(   
      {
        mutationFn: async ({ userId, taskId } : { userId: string; taskId: string;}) => completeTask({ userId, taskId }),
        onSuccess: (data) => {
          if (data === 'success') {
            // Optionally refetch relevant queries here
            // For example, refetch user data or task data
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

          }
        },
        onError: (error) => {
          console.error('Error completing task:', error);
        },
      }
    );
  };