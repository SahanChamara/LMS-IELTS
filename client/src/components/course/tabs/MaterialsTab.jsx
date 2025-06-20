import React, { useState } from "react";

const MaterialsTab = ({ studyMaterials }) => {
  // State for reference links
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [referenceLinks, setReferenceLinks] = useState([
    {
      id: 1,
      title: "Official Documentation",
      url: "https://getstream.io/blog/topic/case-studies-2/",
      uploadedBy: "Professor Smith"
    },
    {
      id: 2,
      title: "Helpful Tutorial",
      url: "https://getstream.io/chat/docs/",
      uploadedBy: "TA Johnson"
    }
  ]);

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    // Validate URL format
    try {
      new URL(newLink.url);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const link = {
      id: Date.now(), // Better ID generation
      title: newLink.title,
      url: newLink.url,
      uploadedBy: "You"
    };

    setReferenceLinks([...referenceLinks, link]);
    setNewLink({ title: "", url: "" });
    setIsLinkModalOpen(false);
  };

  const openLinkInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4">
      {/* Study Materials Section - RESTORED */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Study Materials</h2>
        <div className="space-y-4">
          {studyMaterials.map((material) => (
            <div 
              key={material.id} 
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                  <p className="text-sm text-gray-500">
                    {material.type} • {material.size}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Links Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Reference Links</h2>
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
            Add Reference Link
          </button>
        </div>

        <div className="space-y-4">
          {referenceLinks.map((link) => (
            <div
              key={link.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 
                    className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer"
                    onClick={() => openLinkInNewTab(link.url)}
                  >
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {link.uploadedBy} • <span className="text-indigo-600">{new URL(link.url).hostname}</span>
                  </p>
                </div>
                <button 
                  onClick={() => openLinkInNewTab(link.url)}
                  className="px-3 py-1 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Reference Link</h3>
            <form onSubmit={handleAddLink}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter link title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsTab;