import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


interface CompleteTaskParams {
    userId: string;
    taskId: string;
  }
  
  interface CompleteTaskResponse {
    status: 'success' | 'unknownError' | 'invalidTask' | 'userNotExist';
    message: string;
  }
  
export const useYouTubeMutation =  () => {
  
    const queryClient = useQueryClient();

    return useMutation<CompleteTaskResponse, Error, CompleteTaskParams>(   
      {
        mutationFn: async ({ userId, taskId }) => {
            const response = await axios.post('/api/youtube', { userId, taskId });
            return response.data;
          },
        onSuccess: (data) => {
          if (data.status === 'success') {
            // Optionally refetch relevant queries here
            // For example, refetch user data or task data
            queryClient.invalidateQueries({ queryKey: ["youtube"] });

          }
        },
        onError: (error) => {
          console.error('Error completing task:', error);
        },
      }
    );
  };