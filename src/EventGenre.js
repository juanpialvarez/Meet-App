import React from "react";
import { PieChart, Pie } from "recharts";

const EventGenre = ({ events }) => {
  const getData = () => {
    const genres = ["React", "JavaScript", "Node", "jQuery", "AngularJS"];
    const data = genres.map((genre) => {
      const value = events.filter((event) =>
        event.summary.split(" ").includes(genre)
      ).length;
      return { name: genre, value };
    });
    return data;
  };

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={getData()}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={80}
        fill='#8884d8'
        dataKey='value'
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      ></Pie>
    </PieChart>
  );
};

export default EventGenre;
