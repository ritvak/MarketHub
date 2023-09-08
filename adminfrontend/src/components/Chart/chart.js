import React, { useEffect,useRef } from "react";

import { Chart } from "chart.js/auto";
import APIUtils from "../../helpers/APIUtils";
import "./chart.css";


const UserList = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    getAllUsers();
  },);

  const api = (msg) => new APIUtils(msg);

  const getAllUsers = async () => {
    try {
      const response = await api().getAllUsers();
      if (Array.isArray(response.data.userData)) {
        createMonthlyRegistrationChart(response.data.userData);
      } else {
        console.error("Invalid data format. Expected an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const countRegistrationsByMonth = (userData) => {
    const registrations = {};
    for (const user of userData) {
      const month = new Date(user.createdAt).getMonth(); 
      if (registrations.hasOwnProperty(month)) {
        registrations[month]++;
      } else {
        registrations[month] = 1;
      }
    }
    return registrations;
  };

  const createMonthlyRegistrationChart = (userData) => {
    const registrationsByMonth = countRegistrationsByMonth(userData);
    const months = Object.keys(registrationsByMonth);
    const counts = Object.values(registrationsByMonth);
    const totalUsers = userData.length;
    const percentages = counts.map((count) =>
      ((count / totalUsers) * 100).toFixed(2)
    );

    new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: months.map((month) => getMonthName(month)), 
        datasets: [
          {
            label: "User Registrations",
            data: percentages,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Percentage",
            },
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    });
  };

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  // const chartContainerStyle = {
  //   position: 'relative',
  //   width: '100%',
  //   height: '400px', 
  //   margin: '20px 0',
  // };


  // const chartCanvasStyle = {
  //   width: '100%',
  //   height: '100%',
  // };


  return (
    <div>
      <h1 style={{ fontSize: "24px", textAlign: "center", color: "blue" }}>
        User Statistics
      </h1>
      <canvas ref={chartRef}></canvas>
      <ul></ul>
    </div>
  );
};

export default UserList;
