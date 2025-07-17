import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, CheckCircle, X, Bell , ExternalLink } from "lucide-react";

const AssignmentsTab = ({ unit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reflection, setReflection] = useState("");
  const [images, setImages] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [receivedAssignments, setReceivedAssignments] = useState([]);
  const fileInputRef = useRef(null);

  // Retrieve tableId from navigation state or unit prop
  const tableId = location.state?.tableId || unit?.tableId || unit?.id || "";

  // Simulate submission (no real API)
  const handleSubmit = async () => {
    if (!reflection.trim() && images.length === 0) {
      setToast({
        message: "Please add a reflection or upload an image",
        type: "error",
        visible: true,
      });
      return;
    }

    const submission = {
      id: Date.now(),
      tableId,
      reflection,
      images: images.map((img) => img.name),
      timestamp: new Date().toISOString(),
    };

    // Add to received assignments
    setReceivedAssignments((prev) => [submission, ...prev]);
    setToast({
      message: "Assignment update submitted successfully",
      type: "success",
      visible: true,
    });
    setReflection("");
    setImages([]);
    console.log("Submitted:", submission);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    if (validImages.length !== files.length) {
      setToast({
        message: "Only image files are allowed",
        type: "error",
        visible: true,
      });
    }
    setImages((prev) => [...prev, ...validImages]);
    fileInputRef.current.value = ""; // Reset input
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Analyze image (simulated)
  const analyzeImage = (image) => {
    // Simulate image analysis
    console.log("Analyzing image:", image.name);
    setToast({
      message: "Image analyzed (simulated): Text or content detected",
      type: "success",
      visible: true,
    });
    return { text: "Sample text from image", confidence: 0.95 };
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Assignments for {unit?.title || "Unit"} {tableId && `(Table ID: ${tableId})`}
        </h1>
        <button
          onClick={() => navigate(`/unit/lecture/${tableId || unit?.id || "default"}`, { state: { tableId } })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-semibold"
          aria-label="Back to Lectures"
        >
          Back to Lectures
        </button>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-green-100 text-green-800 flex items-center justify-between max-w-md"
        >
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={closeToast}
            className="ml-4 text-green-600 hover:text-green-800 focus:outline-none"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-6">
        <div>
          <label htmlFor="reflection" className="block text-lg font-semibold text-neutral-900 mb-2">
            Your Assignment Reflection
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Add your thoughts, progress, or updates about the assignment..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base resize-vertical"
            aria-label="Enter your assignment reflection"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-neutral-900 mb-2">Upload Assignment Files</label>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Upload assignment file"
            >
              <Upload size={16} className="mr-2" /> Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={12} />
                    </button>
                    <button
                      onClick={() => analyzeImage(image)}
                      className="absolute bottom-1 left-1 bg-green-600 text-white rounded-full p-1 hover:bg-green-700 focus:outline-none"
                      aria-label={`Analyze image ${index + 1}`}
                    >
                      <CheckCircle size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            disabled={!reflection.trim() && images.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-from-blue-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Submit assignment update"
          >
            Submit Update
          </button>
        </div>
      </div>

      {/* Received Assignments Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell size={24} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-neutral-900">Received Assignments</h2>
          </div>
         <button
  onClick={() =>
    navigate(`/assignments/receive`, {
      state: { assignments: receivedAssignments },
    })
  }
  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-semibold"
  aria-label="View Assignment Responses"
>
  View Responses
  <ExternalLink className="w-4 h-4" />
</button>
          
        </div>
        {receivedAssignments.length === 0 ? (
          <p className="text-neutral-600">No assignments submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {receivedAssignments.map((assignment) => (
              <div key={assignment.id} className="border-b border-gray-200 pb-4">
                <p className="text-sm text-neutral-600">
                  Submitted on: {new Date(assignment.timestamp).toLocaleString()}
                </p>
                {assignment.reflection && (
                  <p className="text-neutral-900 mt-2">{assignment.reflection}</p>
                )}
                {assignment.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {assignment.images.map((imageName, index) => (
                      <div key={index} className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-neutral-600">{imageName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTab;