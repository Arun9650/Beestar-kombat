import { fetchAllCards } from '@/services/apis/axiosFucntions';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFetchAllCards = (userId: string) => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: () => fetchAllCards(userId),  
    enabled: !!userId 
 } );
};
