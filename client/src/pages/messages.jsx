import React from "react";
import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/Card";
import { BellIcon } from "@heroicons/react/24/outline";

// Mock data simulating backend notifications for admin and lecturer
const notifications = [
  {
    id: 1,
    role: "admin",
    title: "Assignment Reminder",
    content: "Don’t forget to submit your Data Structures project before the deadline.",
    date: "2025-05-26T23:59:00",
    footer: "Due Today • 11:59 PM",
  },
  {
    id: 2,
    role: "lecturer",
    title: "New Lecture Uploaded",
    content: 'A new lecture on "Algorithms Basics" has been added. Watch it before Friday.',
    date: "2025-05-24T10:00:00",
    footer: "Course: Computer Science 101",
  },
  {
    id: 3,
    role: "admin",
    title: "Group Chat Mention",
    content: 'You were mentioned in the group chat by Jane: “Can you update the slides?”',
    date: "2025-05-25T14:30:00",
    footer: "Group: Research Team A",
  },
  ...Array(9).fill({
    id: 0,
    role: "lecturer",
    title: "Event Reminder",
    content: "Guest lecture on AI & Machine Learning in Room 204. Join early for seating!",
    date: "2025-05-27T10:00:00",
    footer: "Tomorrow • 10:00 AM",
  }).map((item, idx) => ({ ...item, id: 4 + idx })),
];

function formatDate(dateString) {
  const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleString(undefined, options);
}

const Institution = () => {
  const handleShowAll = () => {
    alert("Show all notifications clicked!");
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full ">
        <Sidebar />
      </aside>

      <main className="flex-1 p-4 sm:p-6 pt-10 ml-0 md:ml-64 max-w-full">
        <Card>
          <div className="rounded-2xl border border-gray-300 p-4 sm:p-6 shadow-sm max-w-full">
            {/* Header: Title left, Bell icon right */}
            <div className="mb-4 px-2 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                  Notifications
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                  Check your updates.
                </p>
              </div>
              <button
                aria-label="Notifications"
                className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition"
              >
                <BellIcon className="h-6 sm:h-7 w-6 sm:w-7 text-gray-700" />
              </button>
            </div>

            <div className="mb-2 mx-auto pt-4 sm:pt-6 max-w-full">
              <div className="flex flex-col space-y-4">
                {notifications.map(({ id, title, content, footer, date }) => (
                  <Card
                    key={id}
                    variant="institution"
                    title={title}
                    footer={footer || formatDate(date)}
                    className="flex flex-col sm:flex-row sm:items-center h-auto sm:h-16"
                  >
                    <CardContent className="overflow-hidden flex flex-col sm:flex-row sm:items-center text-left w-full">
                      <span className="break-words text-sm sm:text-base leading-snug">
                        {content}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show All Notifications button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleShowAll}
                  className="text-black-600 hover:text-gray-600 font-semibold text-sm sm:text-base"
                  aria-label="Show all notifications"
                >
                  Show All Notifications
                </button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Institution;
