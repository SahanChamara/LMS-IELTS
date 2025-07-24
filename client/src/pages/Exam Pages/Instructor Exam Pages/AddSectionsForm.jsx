import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Edit3, Trash2, Clock } from 'lucide-react';
import Lecsidebar from '../../lecturepages/Lecsidebar';

const AddSectionsForm = ({ 
  exam, 
  onBack, 
  onComplete, 
  onEditQuestions 
}) => {
  const [sections, setSections] = useState(exam.sectionsData || []);
  const [editingSection, setEditingSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    duration: 20,
    instructions: '',
    questions: [],
    audioFile: null, // New field for audio file
  });

  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement('div');
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const handleAddSection = () => {
    if (!newSection.title.trim()) {
      showToast('Validation Error', 'Section title is required.', 'destructive');
      return;
    }

    const section = {
      ...newSection,
      id: `section_${Date.now()}`,
      questions: [],
    };

    setSections([...sections, section]);
    setNewSection({
      title: '',
      description: '',
      duration: 20,
      instructions: '',
      questions: [],
      audioFile: null,
    });

    showToast('Section Added', 'New section has been added successfully.');
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
  };

  const handleUpdateSection = () => {
    if (!editingSection) return;

    setSections(sections.map((s) => (s.id === editingSection.id ? editingSection : s)));
    setEditingSection(null);

    showToast('Section Updated', 'Section has been updated successfully.');
  };

  const handleDeleteSection = (sectionId) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    showToast('Section Deleted', 'Section has been removed.');
  };

  const handleComplete = async () => {
    if (sections.length === 0) {
      showToast('Validation Error', 'Please add at least one section.', 'destructive');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const totalQuestions = sections.reduce(
        (total, section) => total + (section.questions?.length || 0),
        0
      );

      const updatedExam = {
        ...exam,
        sections: sections.length,
        sectionsData: sections,
        questions: totalQuestions,
      };

      onComplete(updatedExam);
    } catch (error) {
      showToast('Error', 'Failed to save sections. Please try again.', 'destructive');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalDuration = () => {
    return sections.reduce((total, section) => total + section.duration, 0);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        showToast('Invalid File', 'Please upload an audio file (e.g., .mp3, .wav).', 'destructive');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File Too Large', 'Audio file must be less than 10MB.', 'destructive');
        return;
      }
      setNewSection({ ...newSection, audioFile: file });
      showToast('File Uploaded', 'Audio file has been uploaded successfully.', 'success');
    }
  };

  // Handle file change for editing section
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        showToast('Invalid File', 'Please upload an audio file (e.g., .mp3, .wav).', 'destructive');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('File Too Large', 'Audio file must be less than 10MB.', 'destructive');
        return;
      }
      setEditingSection({ ...editingSection, audioFile: file });
      showToast('File Uploaded', 'Audio file has been uploaded successfully.', 'success');
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Basic Info
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Sections</h1>
              <p className="text-gray-600">Step 2 of 4: Add sections to your exam</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span className="text-blue-600 font-medium">Basic Info</span>
              <span className="text-blue-600 font-medium">Add Sections</span>
              <span>Add Questions</span>
              <span>Review & Publish</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-2/4 transition-all duration-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Section */}
            <div>
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Section</h2>
                  <p className="text-gray-600 text-sm mt-1">Create a new section for your exam</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div>
                    <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">
                      Section Title *
                    </label>
                    <input
                      id="section-title"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      placeholder="e.g., Reading Passage 1"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="section-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="section-description"
                      value={newSection.description}
                      onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                      placeholder="Brief description of this section"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="section-duration" className="block text-sm font-medium text-gray-700">
                      Duration (minutes) *
                    </label>
                    <input
                      id="section-duration"
                      type="number"
                      value={newSection.duration}
                      onChange={(e) => setNewSection({ ...newSection, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="section-instructions" className="block text-sm font-medium text-gray-700">
                      Instructions
                    </label>
                    <textarea
                      id="section-instructions"
                      value={newSection.instructions}
                      onChange={(e) => setNewSection({ ...newSection, instructions: e.target.value })}
                      placeholder="Specific instructions for this section"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  {exam.type === 'Listening' && (
                    <div>
                      <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700">
                        Upload Audio File
                      </label>
                      <input
                        id="audio-file"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                      />
                      {newSection.audioFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected file: {newSection.audioFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleAddSection}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Sections */}
            <div>
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="flex items-center justify-between text-xl font-semibold text-gray-900">
                    <span>Sections ({sections.length})</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Total: {getTotalDuration()} min</span>
                    </div>
                  </h2>
                </div>
                <div className="p-6 pt-0">
                  {sections.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No sections added yet. Add your first section to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section, index) => (
                        <div key={section.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Section {index + 1}: {section.title}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 text-gray-700">
                                {section.questions?.length || 0} questions
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 text-gray-700">
                                {section.duration} min
                              </span>
                            </div>
                          </div>

                          {section.description && (
                            <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                          )}
                          {section.audioFile && (
                            <p className="text-sm text-gray-600 mb-2">
                              Audio: {section.audioFile.name || 'Uploaded Audio'}
                            </p>
                          )}

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditSection(section)}
                              className="px-2 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </button>

                            {onEditQuestions && (
                              <button
                                onClick={() => onEditQuestions(section)}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                Add Questions
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-between mt-8">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={isLoading || sections.length === 0}
              className={`px-4 py-2 flex items-center gap-2 ${
                isLoading || sections.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } rounded-lg transition-colors`}
            >
              {isLoading ? 'Saving...' : 'Continue to Questions'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Edit Section Modal */}
          {editingSection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full max-w-2xl rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Section</h2>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section Title *</label>
                    <input
                      value={editingSection.title}
                      onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingSection.description}
                      onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (minutes) *</label>
                    <input
                      type="number"
                      value={editingSection.duration}
                      onChange={(e) => setEditingSection({ ...editingSection, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                      value={editingSection.instructions}
                      onChange={(e) => setEditingSection({ ...editingSection, instructions: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                    />
                  </div>

                  {exam.type === 'Listening' && (
                    <div>
                      <label htmlFor="edit-audio-file" className="block text-sm font-medium text-gray-700">
                        Upload Audio File
                      </label>
                      <input
                        id="edit-audio-file"
                        type="file"
                        accept="audio/*"
                        onChange={handleEditFileChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                      />
                      {editingSection.audioFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected file: {editingSection.audioFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingSection(null)}
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateSection}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Update Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddSectionsForm;