
import { getLeaderboard } from '@/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export const useLeaderboard = (league: string, page: number, limit: number = 100, points:number) => {
  console.log(points)
  return useQuery({
    queryKey: ['leaderboard', league, page, points],
    queryFn: async () => {
      const response = await getLeaderboard({ league, page, limit, points });
      return response;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
  });
};
