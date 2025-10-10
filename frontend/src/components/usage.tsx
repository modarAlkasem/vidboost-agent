"use client";

import { Progress } from "./ui/progress";

export const Usage = ({ title }: { title: string }) => {
  const isPending = false;
  const hasUsedAllTokens = false;
  const isFeatureEnabled = true;
  const featureUsage = 3;
  const featureAllocation = 12;

  if (isPending) {
    return <div className="text-gray-200 text-center py-4">Loading...</div>;
  }

  if (hasUsedAllTokens) {
    return (
      <div className="border border-red-200 p-6 shadow-sm rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <div className="px-4 py-2 bg-red-200 rounded-lg">
            <span className="font-medium text-red-700">12</span>
            <span className="font-medium text-red-400">/</span>
            <span className="font-medium text-red-700">
              {featureAllocation}
            </span>
          </div>
        </div>
        <div className="relative">
          <Progress value={100} className="h-3 bg-gray-400 [&>*]:bg-red-600" />
          <p className="text-sm text-red-600 mt-2">
            You have used all available tokens. Please upgrade your plan to
            continure using this feature.
          </p>
        </div>
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return (
      <div className="rounded-xl border border-blue-400 p-6 shadow-sm opacity-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white ">{title}</h2>
          <div className="rounded-lg px-4 py-2 bg-[#3e3e68]">
            <span className="font-medium text-gray-200">
              {" "}
              Upgrade to use this feature
            </span>
          </div>
        </div>
        <div className="relative">
          <Progress value={0} className="h-3 bg-gray-400" />
        </div>
      </div>
    );
  }

  const progress = ((featureUsage || 0) / (featureAllocation || 1)) * 100;

  const getProgressColorBar = (percent: number) => {
    if (percent >= 80) return "[&>*]:bg-red-600";
    if (percent >= 50) return "[&>*]:bg-yellow-500";

    return "[&>*]:bg-green-500";
  };

  const progressColor = getProgressColorBar(progress);

  return (
    <div className="rounded-2xl border-blue-400 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="rounded-lg bg-[#3e3e68] py-2 px-4">
          <span className="font-medium text-gray-400">{featureUsage}</span>
          <span className="font-medium text-gray-600">/</span>
          <span className="font-medium text-gray-400">{featureAllocation}</span>
        </div>
      </div>
      <div className="relative">
        <Progress value={35} className={`h-3 bg-gray-400 ${progressColor}`} />
        {progress == 100 ? (
          <p className="text-sm text-red-600 mt-2">
            {" "}
            You have reached your usage limit.
          </p>
        ) : progress >= 80 ? (
          <p className="text-sm text-yellow-500 mt-2">
            {" "}
            Warning: You are approaching your usage limit
          </p>
        ) : null}
      </div>
    </div>
  );
};
