import React from "react";
import Sidebar from "../../components/Sidebar";
import Card, { CardContent } from "../../components/card";
import {
  Download,
  UploadCloud,
  CalendarCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { assignment } from "../../data/updateAssignmentn";

const Activity = () => {
  const now = new Date();

  const getStatus = (assignment) => {
    if (assignment.dueDate) return "Provisional";
    if (assignment.completed) return "Completed";
    return assignment.dueDate < now ? "Overdue" : "Upcoming";
  };

  const statusStyles = {
    Completed: "bg-green-100 text-green-800",
    Upcoming: "bg-blue-100 text-blue-800",
    Overdue: "bg-red-100 text-red-800",
    Provisional: "bg-gray-100 text-gray-800",
  };

  const dotColors = {
    Completed: "bg-green-600",
    Upcoming: "bg-blue-600",
    Overdue: "bg-red-600",
    Provisional: "bg-gray-500",
  };

  const statusIcon = {
    Completed: <CalendarCheck className="w-4 h-4 mr-1" />,
    Upcoming: <Clock className="w-4 h-4 mr-1" />,
    Overdue: <AlertCircle className="w-4 h-4 mr-1" />,
    Provisional: <Clock className="w-4 h-4 mr-1" />,
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <Card>
          <div className="mb-1 px-10 mt-6">
            <h2 className="text-2xl font-semibold text-gray-900">Timeline</h2>
            <p className="text-sm text-gray-600">
              Keep track of your assignment deadlines and submissions.
            </p>
          </div>
          <CardContent>
            <div className="relative pl-10 space-y-10 min-h-full">
              <div className="absolute left-2.5 -top-6 text-black mt-8">
                <Clock className="w-6 h-6 stroke-black fill-white bg-white rounded-full p-1" />
              </div>
              <div className="absolute left-5 py-12 inset-y-0 w-0.5 bg-gray-300 z-0" />

              {assignment.map((assignment) => {
                const status = getStatus(assignment);
                return (
                  <div
                    key={assignment.id}
                    className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 ml-4"
                  >
                    <div className="absolute -left-6 top-4 w-6 h-6 rounded-full ring-4 ring-white flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full ${dotColors[status]}`}
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {assignment.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {assignment.description || "No description available"}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end text-sm">
                        {assignment.dueDate && (
                          <p className="text-gray-500">
                            Due: {assignment.dueDate.toLocaleDateString()}{" "}
                            {assignment.dueDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                        <span
                          className={`mt-1 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
                        >
                          {statusIcon[status]} {status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-gray-500 text-sm">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <UploadCloud className="w-4 h-4" />
                        Submit
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-600">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Activity;