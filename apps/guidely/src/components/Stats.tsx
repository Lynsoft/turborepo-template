"use client";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { Guide } from "../types";

interface StatsProps {
  guides: Guide[];
}

export function Stats({ guides }: StatsProps) {
  const totalGuides = guides.length;
  const completedGuides = guides.filter(
    (guide) =>
      guide.completedSteps.length === guide.steps.length &&
      guide.steps.length > 0
  ).length;
  const inProgressGuides = guides.filter(
    (guide) =>
      guide.completedSteps.length > 0 &&
      guide.completedSteps.length < guide.steps.length
  ).length;
  const totalSteps = guides.reduce((acc, guide) => acc + guide.steps.length, 0);

  const stats = [
    {
      label: "Guides",
      fullLabel: "Total Guides",
      value: totalGuides,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Completed",
      fullLabel: "Completed",
      value: completedGuides,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      label: "Progress",
      fullLabel: "In Progress",
      value: inProgressGuides,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      label: "Steps",
      fullLabel: "Total Steps",
      value: totalSteps,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-lg border border-gray-700 bg-gray-800/50 p-3 backdrop-blur-sm transition-colors hover:border-gray-600 sm:rounded-xl sm:p-4 lg:p-6"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div
              className={`rounded-lg p-2 sm:p-2.5 lg:p-3 ${stat.bgColor} transition-transform duration-200 group-hover:scale-110`}
            >
              <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-lg text-white leading-tight sm:text-xl lg:text-2xl">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                <span className="sm:hidden">{stat.label}</span>
                <span className="hidden sm:inline">{stat.fullLabel}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
