import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Section from "../../components/Section";
import { motion } from "framer-motion";
import Card, { CardContent } from "../../components/card"

// Define image URLs with fallbacks (fresh Unsplash URLs as of June 10, 2025)
const images = {
  lecture: {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Lecture+Hall"
  },
  assignment: {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Assignment"
  },
  study: {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Study"
  },
  classes: {
    src: "https://images.unsplash.com/photo-1509062520-3a8c4b3e9b23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Classes"
  },
  dates: {
    src: "https://images.unsplash.com/photo-1519227357091-8ec0e4059d2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Calendar"
  },
  event: {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Event"
  },
  export: {
    src: "https://images.unsplash.com/photo-1551288049-b1f3a99a90c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Export"
  },
  sync: {
    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Sync"
  },
  reminder: {
    src: "https://images.unsplash.com/photo-1506784365847-bbadad4e01be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    fallback: "https://via.placeholder.com/800x400?text=Reminder"
  }
};

const CalendarPage = () => {
  const today = new Date();
  const [selected, setSelected] = useState(today.getDate());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const totalDays = getDaysInMonth(year, month);

  // Generate a dynamic date strip with up to 7 valid dates centered around the selected date
  const centeredDates = () => {
    const days = [];
    let startOffset = -3;
    let endOffset = 3;

    if (selected <= 3) {
      startOffset = -(selected - 1);
      endOffset = 6 - startOffset;
    } else if (selected >= totalDays - 3) {
      endOffset = totalDays - selected;
      startOffset = -(6 - endOffset);
    }

    for (let offset = startOffset; offset <= endOffset; offset++) {
      const d = selected + offset;
      if (d >= 1 && d <= totalDays) {
        days.push(d);
      }
    }
    return days;
  };

  const dateStrip = centeredDates();

  // Handle month navigation
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelected(1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelected(1);
  };

  // Handle image load errors with console logging
  const handleImageError = (e, fallbackSrc, title) => {
    console.error(`Failed to load image for ${title}: ${e.target.src}`);
    e.target.src = fallbackSrc;
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="fixed top-0 left-0 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="md:ml-64 flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto mt-6">
          <Card className="p-10 space-y-12">
            <Section>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="text-gray-600 hover:text-black transition"
                >
                  ← Prev
                </button>
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">
                    {new Date(year, month).toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Plan your time, view tasks & track course events easily
                  </p>
                </div>
                <button
                  onClick={nextMonth}
                  className="text-gray-600 hover:text-black transition"
                >
                  Next →
                </button>
              </div>

              <div className="flex justify-center gap-4 mb-10">
                {dateStrip.map((d, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelected(d)}
                    className={`cursor-pointer w-16 h-16 rounded-full flex flex-col items-center justify-center border text-sm shadow
                      ${
                        d === selected
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }
                      transition duration-300`}
                  >
                    <div className="text-xs font-medium">
                      {new Date(year, month, d).toLocaleDateString("default", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="text-lg font-bold">{d}</div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section title="Calendar Summary">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  ["Tasks Today", "3"],
                  ["Events This Week", "7"],
                  ["Upcoming Deadlines", "5"],
                  ["Meetings Scheduled", "2"],
                ].map(([label, value], i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition text-center"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      {label}
                    </h4>
                    <p className="text-2xl font-bold text-black">{value}</p>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section title="Upcoming Events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  variant="institution"
                  title="Lecture: Computer Science"
                  footer="Room 302, Main Building"
                  image={images.lecture.src}
                  onError={(e) => handleImageError(e, images.lecture.fallback, "Lecture: Computer Science")}
                >
                  <CardContent>
                    <div className="text-center space-y-1">
                      <p className="font-medium">10:00 AM - 12:00 PM</p>
                      <p className="text-gray-700">Data Structures and Algorithms Project Submission</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Assignment Due"
                  footer="Due by 11:59 PM"
                  image={images.assignment.src}
                  onError={(e) => handleImageError(e, images.assignment.fallback, "Assignment Due")}
                >
                  <CardContent>
                    <div className="text-center">
                      <p className="font-medium">Data Structures and Algorithms</p>
                      <p className="text-gray-700">Project Submission</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Group Study Session"
                  footer="Library Study Room 5"
                  image={images.study.src}
                  onError={(e) => handleImageError(e, images.study.fallback, "Group Study Session")}
                >
                  <CardContent>
                    <div className="text-center space-y-1">
                      <p className="font-medium">02:00 PM - 04:00 PM</p>
                      <p className="text-gray-700">Focused review on DSA concepts</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section title="Schedule Overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  variant="institution"
                  title="Today's Classes"
                  image={images.classes.src}
                  onError={(e) => handleImageError(e, images.classes.fallback, "Today's Classes")}
                >
                  <CardContent>
                    <ul className="space-y-2 text-center text-gray-700">
                      <li className="font-medium">10:00 AM - Computer Science</li>
                      <li className="font-medium">02:00 PM - Mathematics</li>
                      <li className="font-medium">04:00 PM - Research Methods</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Important Dates"
                  image={images.dates.src}
                  onError={(e) => handleImageError(e, images.dates.fallback, "Important Dates")}
                >
                  <CardContent>
                    <ul className="space-y-2 text-center text-gray-700">
                      <li className="font-medium">Midterm Exams: June 15–20</li>
                      <li className="font-medium">Project Submission: June 25</li>
                      <li className="font-medium">Final Exams: July 10–20</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </Section>

            <Section title="Calendar Tools">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  variant="institution"
                  title="Add New Event"
                  image={images.event.src}
                  onError={(e) => handleImageError(e, images.event.fallback, "Add New Event")}
                >
                  <CardContent>
                    <p className="text-center text-gray-700">Schedule personal study sessions or reminders</p>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Export Schedule"
                  image={images.export.src}
                  onError={(e) => handleImageError(e, images.export.fallback, "Export Schedule")}
                >
                  <CardContent>
                    <p className="text-center text-gray-700">Download your calendar in iCal format</p>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Sync with LMS"
                  image={images.sync.src}
                  onError={(e) => handleImageError(e, images.sync.fallback, "Sync with LMS")}
                >
                  <CardContent>
                    <p className="text-center text-gray-700">Connect with your course deadlines</p>
                  </CardContent>
                </Card>

                <Card
                  variant="institution"
                  title="Set Reminders"
                  image={images.reminder.src}
                  onError={(e) => handleImageError(e, images.reminder.fallback, "Set Reminders")}
                >
                  <CardContent>
                    <p className="text-center text-gray-700">Get notifications for important events</p>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;