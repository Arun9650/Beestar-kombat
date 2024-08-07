import GameLevelProgress from "@/components/game/GameLevelProgress";
import TapGlobe from "@/components/game/Globe";
import Header from "@/components/Header";
import CurrentPoints from "@/components/tasks/CurrentPoints";
import TaskList from "@/components/tasks/TaskList";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

const TasksPage = async () => {
  return (
    <section className="flex items-center justify-center mb-16 bg-[#1d2025]  flex-col overflow-auto ">
      {/* <CurrentPoints /> */}
      <Header />

      <TaskList />
      <CurrentPoints />
      <TapGlobe />

      <div className="flex flex-col w-fit ml-4  gap-y-4">
        <GameLevelProgress />
      </div>
    </section>
  );
};

export default TasksPage;
