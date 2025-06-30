import React, { useState } from 'react';
import { Clock, BookOpen, Users, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExamIntro from '@/components/ExamIntro';

/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {number} duration
 * @property {number} questions
 * @property {'Beginner' | 'Intermediate' | 'Advanced'} difficulty
 * @property {'Reading' | 'Writing' | 'Listening' | 'Speaking'} type
 * @property {string} description
 * @property {boolean} available
 */

const ExamDashboard = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  const exams = [
    {
      id: '1',
      title: 'IELTS Academic Reading Test 1',
      duration: 60,
      questions: 40,
      difficulty: 'Intermediate',
      type: 'Reading',
      description: 'Complete academic reading test with 3 passages and 40 questions',
      available: true
    },
    {
      id: '2',
      title: 'IELTS Academic Writing Test 1',
      duration: 60,
      questions: 2,
      difficulty: 'Advanced',
      type: 'Writing',
      description: 'Task 1: Academic graph description, Task 2: Essay writing',
      available: true
    },
    {
      id: '3',
      title: 'IELTS Listening Test 1',
      duration: 40,
      questions: 40,
      difficulty: 'Intermediate',
      type: 'Listening',
      description: '4 sections with various listening scenarios and question types',
      available: true
    },
    {
      id: '4',
      title: 'IELTS Speaking Mock Test',
      duration: 15,
      questions: 3,
      difficulty: 'Advanced',
      type: 'Speaking',
      description: 'Complete speaking test with 3 parts: Introduction, Individual task, Discussion',
      available: true
    },
    {
      id: '5',
      title: 'IELTS Academic Reading Test 2',
      duration: 60,
      questions: 40,
      difficulty: 'Advanced',
      type: 'Reading',
      description: 'Advanced academic reading test with complex passages',
      available: true
    },
    {
      id: '6',
      title: 'IELTS Listening Test 2',
      duration: 40,
      questions: 40,
      difficulty: 'Advanced',
      type: 'Listening',
      description: 'Advanced listening test with academic and social contexts',
      available: true
    }
  ];

  const handleAttemptNow = (exam) => {
    setSelectedExam(exam);
    setShowIntro(true);
  };

  const availableExams = exams.filter(exam => exam.available);

  if (showIntro && selectedExam) {
    return <ExamIntro exam={selectedExam} onBack={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">IELTS Exam Center</h1>
          <p className="text-lg text-gray-600">Practice with authentic IELTS exam papers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{availableExams.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableExams.reduce((total, exam) => total + exam.questions, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(availableExams.reduce((total, exam) => total + exam.duration, 0) / 60)}h
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        {availableExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.map((exam) => (
              <Card key={exam.id} className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.type === 'Reading' ? 'bg-blue-100 text-blue-800' :
                      exam.type === 'Writing' ? 'bg-green-100 text-green-800' :
                      exam.type === 'Listening' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {exam.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      exam.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      exam.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{exam.title}</CardTitle>
                  <CardDescription className="text-gray-600">{exam.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exam.duration} minutes
                      </span>
                      <span>{exam.questions} questions</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleAttemptNow(exam)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Attempt Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Available</h3>
              <p className="text-gray-600 text-center">
                There are currently no IELTS exams available. Please check back later or contact your instructor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamDashboard;
