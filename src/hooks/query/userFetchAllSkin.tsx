import { FetchAllSkin } from "@/services/apis/axiosFucntions";
import { useQuery } from "@tanstack/react-query";


const useFetchAllSkin = (id: string) => {
  return useQuery({
    queryKey: ["all-skins"],
    queryFn: () => FetchAllSkin(id),
  });
};

export default useFetchAllSkin;
