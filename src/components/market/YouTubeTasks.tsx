import React, { useState, useEffect } from "react";
import { useYouTubeMutation } from "@/hooks/mutation/useYouTube";
import { useFetchYoutubeTasks } from "@/hooks/query/useFetchYouTubeTask";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import { usePointsStore } from "@/store/PointsStore";
import useAnimationStore from "@/store/useAnimationStore";

interface Props {
  userId: string;
}
type Task = {
  id: string;
  name: string;
  points: number;
  category: string;
  icon: string;
  link: string;
  isUserTask: boolean;
};

const YouTubeTasks: React.FC<Props> = ({ userId }) => {
  const { data: YoutubeTask, isLoading } = useFetchYoutubeTasks(userId);
  const YouTubeMutation = useYouTubeMutation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Store the selected task
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer open state
  const [hasJoined, setHasJoined] = useState(false); // Track whether user has clicked Join
  const [buttonLoading, setButtonLoading] = useState(false);

  const { addPoints } = usePointsStore();
    const { setPurchaseCompleteAnimation } = useAnimationStore();

  // Retrieve 'hasJoined' state from localStorage when task is selected
  useEffect(() => {
    if (selectedTask) {
      const storedHasJoined = localStorage.getItem(`hasJoined-${selectedTask.id}`);
      setHasJoined(storedHasJoined === "true");
    }
  }, [selectedTask]);

  const handleRegularTask = async (task: Task) => {
    if (!userId) return;
    setButtonLoading(true);

    try {
      const taskCompletedAt = DateTime.now().toISO();  // Get current timestamp
      const taskCompleted = window.localStorage.getItem(`taskCompletedAt-${task.id}`);
      if (taskCompleted) {
        canClaimReward(task, userId);
      } else {
        window.localStorage.setItem(`taskCompletedAt-${task.id}`, taskCompletedAt);
        toast.success("Task completed! You can claim your reward after 1 hour.");
      }
    } catch (error) {
      toast.error("Error completing task.");
    } finally {
      setButtonLoading(false);
    }
  };

  const canClaimReward = (task: Task, userId: string): boolean => {
    const taskCompletedAt = window.localStorage.getItem(`taskCompletedAt-${task.id}`);
    if (taskCompletedAt) {
      const taskCompletedTime = DateTime.fromISO(taskCompletedAt);
      const currentTime = DateTime.now();
      const timeElapsed = currentTime.diff(taskCompletedTime, "hours").hours;

      if (timeElapsed >= 1) {
        YouTubeMutation.mutate(
          { userId, taskId: task.id },
          {
            onSuccess: () => {
              toast.success("Reward claimed!");
              addPoints(task.points);
              window.localStorage.setItem(
                "points",
                `${parseInt(window.localStorage.getItem("points") || "0") + task.points}`
              );
              setPurchaseCompleteAnimation(true);
            },
          }
        );
      } else {
        const remainingTime = Math.ceil(60 - currentTime.diff(taskCompletedTime, "minutes").minutes); // Minutes remaining
        toast.error(`You can claim the reward in ${remainingTime} minutes.`);
      }
    } else {
      toast.error("No task completion time found.");
    }
    return false;
  };

  const handleJoinClick = () => {
    if (selectedTask) {
      localStorage.setItem(`hasJoined-${selectedTask.id}`, "true");
      setHasJoined(true); // Update state when user clicks Join
    }
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton className="w-full h-20" />
      ) : (
        YoutubeTask?.tasks.map((task) => (
          <div key={task.id} className="flex  items-center justify-between w-full gap-2">
           <div className="flex items-center">
              <Image
                src={task.icon}
                alt="Task Icon"
                className="mr-4 border-2 border-white border-opacity-10 bg-white bg-opacity-10 p-2.5 rounded-xl"
                width={50}
                height={50}
              />
              <Link href={task.link} target="_blank">
                <div className="flex flex-col justify-between py-1">
                  <p className="text-[#B7B5B5] text-[0.5rem] text-start">5000 Points</p>
                  <p className="font-normal text-start text-sm">{task.name}</p>
                  <p className="text-yellow-400 text-[0.5rem] flex items-center justify-start gap-1">
                    Get reward
                  </p>
                </div>
              </Link>
            </div>

            <Button
              onClick={() => {
                setSelectedTask(task); // Set selected task
                setIsDrawerOpen(true); // Open drawer
              }}
            >
              Redeem
            </Button>

            {/* Drawer for task */}
            <Drawer open={isDrawerOpen}>
              <DrawerContent className="bg-[#14161a] border-none px-2">
                <DrawerHeader className="flex items-center justify-end mt-4">
                  <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="z-[100] absolute p-3 px-5 text-white bg-[#1C1F23] rounded-full"
                  >
                    x
                  </div>
                </DrawerHeader>

                {selectedTask && (
                  <div className="text-center h-full flex flex-col">
                    <div>
                      <Image
                        src={selectedTask.icon}
                        alt={selectedTask.name}
                        className="mx-auto w-12 h-12 mb-4"
                        width={40}
                        height={40}
                      />
                      <div className="flex justify-between items-center">
                        <span className="mx-auto text-white text-xl font-semibold">
                          {selectedTask.name}
                        </span>
                      </div>
                    </div>

                    {/* "Join" button */}
                    <Link
                      target="_blank"
                      href={selectedTask.link}
                      onClick={handleJoinClick} // Set 'hasJoined' when clicked
                      className="text-white text-xs bg-custom-orange p-3 rounded-xl mt-4 max-w-64 mx-auto my-4"
                    >
                      Join
                    </Link>
                  </div>
                )}

                {/* "Check" button */}
                <DrawerFooter className="p-0">
                  <Button
                    onClick={() => {
                        handleRegularTask(selectedTask!);
                    }}
                    disabled={!hasJoined} // Disable until user has clicked 'Join'
                    className="w-full p-7 my-4 text-white text-lg font-semibold rounded-xl"
                  >
                    Check
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        ))
      )}
    </div>
  );
};

export default YouTubeTasks;
