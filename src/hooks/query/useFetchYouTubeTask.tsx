import { fetchYouTubeTask } from '@/services/apis/axiosFucntions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Task = {
  id: string;
  name: string;
  points: number;
  category: string;
  icon: string;
  link: string;
  isUserTask: boolean;
};

interface FetchTasksResponse {
  status: 'success' | 'error';
  tasks: Task[];
}

export const useFetchYoutubeTasks = (userId: string) => {
  return useQuery<FetchTasksResponse, Error>({
    queryKey: ['youtube'],
    queryFn: async () => fetchYouTubeTask(userId),
  
    enabled: !!userId, // Only run the query if userId is provided

});
};
