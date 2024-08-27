import { setCurrentSkin } from "@/services/apis/axiosFucntions";
import { Skins } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSetCurrentSkin = (id:string, skin: Skins) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => setCurrentSkin(id, skin.image),
    onSuccess: (data) => {
      //handle success
    },
    onError: (error) => {
      // handle error
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-main-skin"] });
    },
  });
};

export default useSetCurrentSkin;
