import React, { useState } from "react";

export default function TabbedContents({
  title = "Dashboard",
  tabComponents,
  active = 1,
}) {
  const [activeTab, setActiveTab] = useState(active);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="container mx-auto mt-12">
      <p className="my-10 capitalize font-bold">{title}</p>

      <div className="flex justify-between">
        <div className="flex space-x-4">
          {tabComponents[0].status === "active" && (
            <button
              className={`px-2 py-1.5 text-sm rounded-sm ${
                activeTab === tabComponents[0].id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTabClick(tabComponents[0].id)}
            >
              {tabComponents[0].title}
            </button>
          )}

          {tabComponents[1].status === "active" && (
            <button
              className={`px-2 py-1.5 text-sm rounded-sm ${
                activeTab === tabComponents[1].id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTabClick(tabComponents[1].id)}
            >
              {tabComponents[1].title}
            </button>
          )}
        </div>
        <div className="flex space-x-4">
          <div className="float-right">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                {tabComponents[2].status === "active" && (
                  <button
                    className={`px-2 py-1.5 text-sm rounded-sm ${
                      activeTab === tabComponents[2].id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleTabClick(tabComponents[2].id)}
                  >
                    {tabComponents[2].title}
                  </button>
                )}

                {tabComponents[3].status === "active" && (
                  <button
                    className={`px-2 py-1.5 text-sm rounded-sm ${
                      activeTab === tabComponents[3].id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleTabClick(tabComponents[3].id)}
                  >
                    {tabComponents[3].title}
                  </button>
                )}
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
      {/* Content for each tab */}

      {tabComponents.map((tab) => {
        return (
          <div className="mt-5" key={tab.id}>
            {activeTab === tab.id && tab.component}
          </div>
        );
      })}
    </div>
  );
}
