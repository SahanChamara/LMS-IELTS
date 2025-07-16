import React from 'react';

const AttachmentDisplay = ({ attachments }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (type) => {
    return type.startsWith('image/');
  };

  const isPDF = (type) => {
    return type === 'application/pdf';
  };

  if (attachments.length === 0) return null;

  return (
    <div className="mb-4">
      {
        attachments.map((attachment) => (
          <div key={attachment.id} className="mb-3">
            {isImage(attachment.type) ? (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
                  onClick={() => window.open(attachment.url, '_blank')}
                />
                <div className="p-2 bg-gray-50 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                </div>
              </div>
            ) : isPDF(attachment.type) ? (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{attachment.name}</p>
                    <p className="text-sm text-gray-500">PDF • {formatFileSize(attachment.size)}</p>
                  </div>
                </div>
                <button
                  className="flex items-center px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium">{attachment.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(attachment.size)})
                </span>
                <button
                  className="flex items-center px-2 py-1 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
};

export default AttachmentDisplay;