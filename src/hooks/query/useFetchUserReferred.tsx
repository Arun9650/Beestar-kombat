import { fetchReferrals } from "@/services/apis/axiosFucntions";
import { useQuery } from "@tanstack/react-query";


const useFetchUserReferred = (id: string) => {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: () => fetchReferrals(id),
  });
};

export default useFetchUserReferred;
