import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import useAnimationStore from "@/store/useAnimationStore";
import { Button } from "../ui/button";

interface AlertBoxProps {
  showAd: () => void;
}

export default function AlertBox({ showAd }: AlertBoxProps) {
  const { animationAlert, setAnimationAlert } = useAnimationStore();


  return (
    <AlertDialog  open={animationAlert} onOpenChange={setAnimationAlert}>
      <AlertDialogContent className="bg-white/90 max-w-80">
      {/* <div className="balloons">
          <div className="balloon"></div>
          <div className="balloon"></div>
          <div className="balloon"></div>
          <div className="balloon"></div>
          <div className="balloon"></div>
        </div>   */}
        <AlertDialogHeader>
          <AlertDialogTitle>Earn More Points!</AlertDialogTitle>
          <AlertDialogDescription>
            Watch ads to earn more points and enhance your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row  justify-end">
          {/* <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel> */}
          <button className="mr-3 w-fit" onClick={() => setAnimationAlert(false)}>
            Cancel
          </button>
          <Button
          className="border w-fit"
            onClick={() => {
                setAnimationAlert(false);
              showAd();
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}