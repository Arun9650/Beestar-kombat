import { completeTask } from "@/actions/tasks.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


  
export const useTasksMutation =  () => {
  
    const queryClient = useQueryClient();

    return useMutation(   
      {
        mutationFn: async ({ userId, taskId } : { userId: string; taskId: string;}) => await  axios.post('/api/completeTask', { userId, taskId }),

        onSuccess: (data) => {
          if (data.status === 200) {
            // Optionally refetch relevant queries here
            // For example, refetch user data or task data
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

          }
        },
        onError: (error:any) => {
          console.error('Error completing task:', error.response.data.status);
          toast.error(`${error.response.data.status}`);
        },
      }
    );
  };