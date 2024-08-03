import GameLevelProgress from "@/components/game/GameLevelProgress";
import TapGlobe from "@/components/game/Globe";
import Header from "@/components/Header";
import CurrentPoints from "@/components/tasks/CurrentPoints";
import TaskList from "@/components/tasks/TaskList";
import React from "react";

const TasksPage = async () => {
  return (
    <section className="flex items-center justify-center flex-col overflow-auto ">
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
