import React, { useState } from "react";

const LessonsTab = ({ lessons }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [videoError, setVideoError] = useState("");
  const [selectedLessonTitle, setSelectedLessonTitle] = useState("");

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    try {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:.*)?$/;
      const match = url.match(youtubeRegex);
      if (!match || !match[1]) {
        throw new Error("Invalid YouTube URL");
      }
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch (error) {
      console.error("Error converting YouTube URL:", error.message, url);
      return null;
    }
  };

  // Function to handle opening the lecture video in a modal
  const handleViewLectureVideo = (videoUrl, lessonTitle) => {
    setVideoError("");
    setSelectedLessonTitle(lessonTitle);
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    if (embedUrl) {
      setSelectedVideo(embedUrl);
      setIsModalOpen(true);
    } else {
      setVideoError("Invalid or unsupported YouTube video URL.");
    }
  };

  // Function to handle downloading the document
  const handleDownloadDocument = (docUrl) => {
    window.open(docUrl, "_blank");
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo("");
    setSelectedLessonTitle("");
    setVideoError("");
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        Course Material
      </h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {lesson.duration} hours
                </p>
              </div>
              <div className="flex space-x-2 items-center">
                {lesson.doc && (
                  <button
                    onClick={() => handleDownloadDocument(lesson.doc)}
                    className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Download Document"
                  >
                    Document
                  </button>
                )}
                {lesson.lectureLink && (
                  <button
                    onClick={() =>
                      handleViewLectureVideo(lesson.lectureLink, lesson.title)
                    }
                    className="px-3 py-1 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Lecture Video
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Video Playback */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedLessonTitle || "Lecture Video"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {videoError ? (
              <div className="text-red-600 text-center">
                {videoError} Please check the video URL or try again later.
              </div>
            ) : (
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={selectedVideo}
                  title="Lecture Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() =>
                    setVideoError(
                      "Failed to load video. Please check the URL or try again later."
                    )
                  }
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsTab;