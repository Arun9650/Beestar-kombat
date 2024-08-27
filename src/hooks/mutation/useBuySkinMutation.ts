import { BuySkin } from "@/services/apis/axiosFucntions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export const useBuySkinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skinId,
      localBalance,
      chatId,
    }: {
      skinId: string;
      localBalance: number;
      chatId: string;
    }) => {
      return BuySkin(skinId, localBalance, chatId);
    },

    onMutate: async () => {
      toast.loading("Processing your purchase...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Skin set successfully!");
    },
    onError: () => {
      toast.dismiss();
      console.error("Error purchasing skin:");
      toast.error("Failed to purchase skin. Please try again.");
    },
    onSettled: () => {
      toast.dismiss();
      queryClient.invalidateQueries({ queryKey: ["all-skins"] });
    },
  });
};
