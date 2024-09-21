import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTasks } from "@/hooks/query/useFetchTask";
import { useTasksMutation } from "@/hooks/mutation/useTasksMutation";
import toast from "react-hot-toast";
import { usePointsStore } from "@/store/PointsStore";
import useAnimationStore from "@/store/useAnimationStore";
import axios from "axios";
import { DateTime } from "luxon";

interface Props {
  userId: string | null;
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

const TaskList: React.FC<Props> = ({ userId }) => {
  const { data: taskList, isLoading } = useFetchTasks(userId ?? "");
  const TaskMutation = useTasksMutation();
  const { addPoints } = usePointsStore();
  const { setPurchaseCompleteAnimation } = useAnimationStore();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // For opening drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);  // To store selected task
  const [hasJoined, setHasJoined] = useState(false);  // Track if user clicked Join

  // Retrieve 'hasJoined' state from localStorage for the selected task
  useEffect(() => {
    if (selectedTask) {
      const storedHasJoined = localStorage.getItem(`hasJoined-${selectedTask.id}`);
      setHasJoined(storedHasJoined === "true");
    }
  }, [selectedTask]);

  const handleTelegramTask = async (task: Task) => {
    if (!userId) return;
    setButtonLoading(true);

    try {
      const result = await axios.post("/api/telegramJoin", { userId });
      if (result.data.status === "joined") {
        toast.success("Successfully joined Telegram channel!");
        handleCompleteTask(task);
        setIsDrawerOpen(false);  // Close drawer after completion
      } else {
        toast.error("Please join the Telegram channel to complete the task.");
      }
    } catch (error) {
      toast.error("Error with Telegram task.");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!userId) return;

    TaskMutation.mutate(
      { userId, taskId: task.id },
      {
        onSuccess: () => {
          toast.success("Task completed successfully!");
          addPoints(task.points);
          window.localStorage.setItem(
            "points",
            `${parseInt(window.localStorage.getItem("points") || "0") + task.points}`
          );
          setPurchaseCompleteAnimation(true);
        },
      }
    );
  };

  const handleJoinClick = () => {
    if (selectedTask) {
      // Set 'hasJoined' to true in localStorage for the current task
      localStorage.setItem(`hasJoined-${selectedTask.id}`, "true");
      setHasJoined(true);  // Update the local state
    }
  };

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
        TaskMutation.mutate(
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

  return (
    <div>
      {isLoading ? (
        <Skeleton className="w-full h-20" />
      ) : (
        taskList &&
        taskList.length > 0 &&
        taskList.map((task: Task, index) => (
          <div key={index} className="mt-2  flex items-center justify-between w-full">
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

            {/* Conditional rendering for the Redeem button */}
            {task.isUserTask ? (
              <Button className="bg-green-600 text-white font-semibold" disabled>
                Redeem
              </Button>
            ) : (
              <Button
                className="bg-green-600 text-white font-semibold"
                onClick={() => {
                  setSelectedTask(task);  // Store the task clicked
                  setIsDrawerOpen(true);  // Open the drawer for all tasks
                }}
                disabled={buttonLoading}
              >
                Redeem
              </Button>
            )}

            {/* Task drawer for all tasks */}
            <Drawer open={isDrawerOpen}>
              <DrawerContent className="bg-[#14161a] border-none px-2">
                <DrawerHeader className="flex items-center justify-end mt-4">
                  <DrawerTitle></DrawerTitle>
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
                        src={selectedTask.icon}  // Use the selected task's icon
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
                    <Link
                      target="_blank"
                      href={selectedTask.link}  // Use the selected task's link
                      onClick={handleJoinClick}  // Set 'hasJoined' when clicked
                      className="text-white text-xs bg-custom-orange p-3 rounded-xl mt-4 max-w-64 mx-auto my-4"
                    >
                      Join
                    </Link>
                  </div>
                )}

                <DrawerFooter className="p-0">
                  <Button
                    onClick={() => {
                      if (selectedTask?.id === "66bbbd35c6702718c2b84f69") {
                        handleTelegramTask(selectedTask);
                      } else {
                        handleRegularTask(selectedTask!);
                      }
                    }}
                    disabled={!hasJoined || buttonLoading}  // Disable if user hasn't clicked 'Join'
                    className="w-full p-7 my-4 text-white text-lg font-semibold rounded-xl"
                  >
                    {buttonLoading ? <div className="loader"></div> : "Check"}
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

export default TaskList;
