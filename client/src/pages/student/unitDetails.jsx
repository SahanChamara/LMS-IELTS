import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CourseHeader from '../../components/course/CourseHeaders';
import CourseTabs from '../../components/course/CourseTabs';
import OverviewTab from '../../components/course/tabs/OverviewTabs';
import LessonsTab from '../../components/course/tabs/LessonsTabs';
import AssessmentsTab from '../../components/course/tabs/AssessmentsTabs';
import ExamsTab from '../../components/course/tabs/ExamsTab';
import MaterialsTab from '../../components/course/tabs/MaterialsTab';
import DiscussionsTab from '../../components/course/tabs/DiscussionsTab';
import AssignmentsTab from '../../components/course/tabs/AssignmentsTab';
import OnlineSessionTab from '../../components/course/tabs/OnlineSessionTabs';
import { getUnitById } from '../../service/unitsService';
import { createLog } from '../../service/logService';
import StudentDiscussionsTab from '../../components/course/tabs/StudentDiscussionTab';
import InstructorDiscussionsTab from '../../components/course/tabs/InstructorDisccussionTab';

const UnitDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const setLessons = (newLessons) => {
    setUnitData((prev) => ({
      ...prev,
      lessons: newLessons,
    }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not submitted';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        setLoading(true);
        const response = await getUnitById(id);
        const unit = response.data;

        if (!unit) {
          throw new Error('Unit not found');
        }

        const generateUnitData = () => {
          const course = unit.course || {
            id: 'unknown',
            title: 'Unknown Course',
            description: 'No description available',
          };

          return {
            id: unit._id,
            title: unit.title,
            description: unit.description,
            course: {
              id: course._id,
              title: course.title,
              description: course.description,
            },
            lessons: unit.lessons || [],
            assessments: unit.assessments || [],
            exams: unit.exams || [],
            studyMaterials: unit.studyMaterials || [],
            discussions: unit.discussions || [],
            assignments: [],
            onlineSessions: [],
            subUnits: unit.subUnits || [],
            image: unit.image || '',
            credits: unit.credits || '',
            instructor: unit.instructor ? unit.instructor.name : 'No Instructor',
            instructorDetails: unit.instructor || null,
            timePeriod: unit.timePeriod || 0,
            unitCode: unit.unitCode || 'N/A',
            order: unit.order || 0,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
          };
        };

        const data = generateUnitData();
        setUnitData(data);
        setAssignments(data.assignments);

        const userId = localStorage.getItem('userId') || 'anonymous';
        await createLog(userId, id);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching unit or creating log:', err.message, err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading unit data...
      </div>
    );
  }

  if (error || !unitData) {
    return (
      <div className="flex items-center justify-center h-screen">
        {error || 'Unit data not found'}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <CourseHeader course={unitData} />
        <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">         
          {activeTab === 'overview' && <OverviewTab course={unitData} />}
          {activeTab === 'Materials' && (
            <LessonsTab lessons={unitData.lessons} setLessons={setLessons} />
          )}
          {activeTab === 'Quizes' && <AssessmentsTab assessments={unitData.assessments} unitId={unitData.id} />}
          {activeTab === 'discussions' && <StudentDiscussionsTab unitId={unitData.id} />}
          {activeTab === 'assignments' && (
            <AssignmentsTab
              assignments={assignments}
              setAssignments={setAssignments}
              submissionStatus={{}} // Adjust as needed
              formatDateTime={formatDateTime}
            />
          )}
          {activeTab === 'online-session' && (
            <OnlineSessionTab unitId={unitData.id} />
          )}
        </div>
      </main>
    </div>
  );
};

export default UnitDetails;