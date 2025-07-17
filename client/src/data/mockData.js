export const mockUsers = [
  { id: '1', name: 'John Doe', role: 'student' },
  { id: '2', name: 'Dr. Smith', role: 'instructor' },
  { id: '3', name: 'Admin User', role: 'admin' },
  { id: '4', name: 'Jane Student', role: 'student' },
];

export const mockPosts = [
  {
    id: '1',
    textContent: 'Here are my notes from today\'s lecture on React hooks. Hope this helps!',
    attachments: [
      {
        id: '1',
        name: 'React Hooks Notes.pdf',
        type: 'application/pdf',
        size: 2048000,
        url: '#'
      }
    ],
    visibility: 'public',
    status: 'approved',
    userId: '2',
    userName: 'Dr. Smith',
    userRole: 'instructor',
    createdAt: new Date('2024-01-15T10:30:00'),
    reactions: [
      { id: '1', type: 'like', userId: '1', userName: 'John Doe' },
      { id: '2', type: 'love', userId: '4', userName: 'Jane Student' },
      { id: '3', type: 'insightful', userId: '3', userName: 'Admin User' }
    ],
    comments: [
      {
        id: '1',
        content: 'Thank you for sharing! This is really helpful.',
        userId: '1',
        userName: 'John Doe',
        userRole: 'student',
        createdAt: new Date('2024-01-15T11:00:00')
      }
    ]
  },
  {
    id: '2',
    textContent: 'My summary of the database design principles we covered.',
    attachments: [
      {
        id: '2',
        name: 'Database Design Summary.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1024000,
        url: '#'
      }
    ],
    visibility: 'public',
    status: 'pending',
    userId: '1',
    userName: 'John Doe',
    userRole: 'student',
    createdAt: new Date('2024-01-16T09:15:00'),
    reactions: [],
    comments: []
  },
  {
    id: '3',
    textContent: 'Quick reference guide for JavaScript array methods.',
    attachments: [
      {
        id: '3',
        name: 'JS Array Methods.png',
        type: 'image/png',
        size: 512000,
        url: '#'
      }
    ],
    visibility: 'public',
    status: 'approved',
    userId: '4',
    userName: 'Jane Student',
    userRole: 'student',
    createdAt: new Date('2024-01-14T14:20:00'),
    reactions: [
      { id: '4', type: 'like', userId: '1', userName: 'John Doe' },
      { id: '5', type: 'celebrate', userId: '2', userName: 'Dr. Smith' }
    ],
    comments: []
  }
];

export const currentUser = mockUsers[0]; // Default to student view