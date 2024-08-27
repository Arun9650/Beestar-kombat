import { FetchUserSkin } from "@/services/apis/axiosFucntions";
import { useQuery } from "@tanstack/react-query";


const useFetchUserSkin = (id: string) => {
  return useQuery({
    queryKey: ["user-main-skin"],
    queryFn: () => FetchUserSkin(id),
  });
};

export default useFetchUserSkin;
