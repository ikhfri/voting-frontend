import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axiosClient from "../axios-client";

const Welcome = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const { data: rate } = useQuery("rate", () =>
        axiosClient.get("/rate").then(({ data }) => data)
    );

    useEffect(() => {
        if (!rate) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const myChartRef = chartRef.current.getContext("2d");

        chartInstance.current = new Chart(myChartRef, {
            type: "pie",
            data: {
                labels: ["Voted", "Haven't Voted"],
                datasets: [
                    {
                        data: [rate.users - rate.not_voted, rate.not_voted],
                        backgroundColor: [
                            "rgb(157, 198, 194)",
                            "rgb(66, 138, 162)",
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            generateLabels: function (chart) {
                                return chart.data.labels.map(function (
                                    label,
                                    i
                                ) {
                                    if (i === 0) {
                                        return {
                                            text:
                                                label +
                                                " - " +
                                                Math.round(
                                                    ((rate.users -
                                                        rate.not_voted) /
                                                        rate.users) *
                                                        100
                                                ) +
                                                "%",
                                            fillStyle:
                                                chart.data.datasets[0]
                                                    .backgroundColor[i],
                                        };
                                    } else {
                                        return {
                                            text:
                                                label +
                                                " - " +
                                                Math.round(
                                                    (rate.not_voted /
                                                        rate.users) *
                                                        100
                                                ) +
                                                "%",
                                            fillStyle:
                                                chart.data.datasets[0]
                                                    .backgroundColor[i],
                                        };
                                    }
                                });
                            },
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (
                                    context.label +
                                    ": " +
                                    Math.round(
                                        (context.raw / rate.users) * 100
                                    ) +
                                    "%"
                                );
                            },
                        },
                    },
                },
            },
        });
    }, [rate]);

    return (
        <>
            <div className="relative z-10 flex flex-col items-center justify-between">
                <h1 className="md:text-4xl text-2xl text-center text-white font-extrabold mt-6">
                       Presentase Anggota Nevtik sudah memberikan suaranya!
                </h1>
                <div className="my-10">
                    <canvas ref={chartRef} />
                </div>
                <h1 className="md:text-4xl text-2xl text-center text-white font-extrabold">
                Let's Elect the Next Leader
                </h1>
                <div className="flex justify-center items-center my-5">
                    <Link
                        to="/vote"
                        className="text-red-600 py-2 px-16 bg-white text-2xl rounded-3xl font-bold"
                    >
                        vote
                    </Link>
                </div>
            </div>
            <img
                src="/images/leftmascot.png"
                alt=""
                width={250}
                className="absolute bottom-0 left-10 lg:inline hidden"
            />
            <img
                src="/images/rightmascot.png"
                alt=""
                width={250}
                className="absolute bottom-0 right-10 lg:inline hidden"
            />
        </>
    );
};

export default Welcome;
