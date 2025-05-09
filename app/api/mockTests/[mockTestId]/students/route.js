import { NextResponse } from 'next/server';

// Mock data for demonstration purposes
// In a real application, this would be fetched from a database
const studentsByMockTest = {
  'mock1': [
    { id: 'student1', name: 'John Smith', mathScore: 65, englishScore: 58, maxScores: { math: 80, english: 70 } },
    { id: 'student2', name: 'Emma Johnson', mathScore: 72, englishScore: 63, maxScores: { math: 80, english: 70 } },
    { id: 'student3', name: 'Michael Brown', mathScore: 68, englishScore: 61, maxScores: { math: 80, english: 70 } },
  ],
  'mock3': [
    { id: 'student1', name: 'John Smith', mathScore: 70, englishScore: 62, maxScores: { math: 80, english: 70 } },
    { id: 'student4', name: 'Sophia Williams', mathScore: 75, englishScore: 66, maxScores: { math: 80, english: 70 } },
    { id: 'student5', name: 'Oliver Davis', mathScore: 78, englishScore: 65, maxScores: { math: 80, english: 70 } },
  ],
  'mock2': [
    { id: 'student1', name: 'John Smith' },
    { id: 'student2', name: 'Emma Johnson' },
    { id: 'student6', name: 'James Wilson' },
    { id: 'student7', name: 'Charlotte Miller' },
  ],
  'mock4': [
    { id: 'student4', name: 'Sophia Williams' },
    { id: 'student5', name: 'Oliver Davis' },
    { id: 'student8', name: 'Amelia Taylor' },
    { id: 'student9', name: 'Liam Anderson' },
  ],
  'mock5': [
    { id: 'student1', name: 'John Smith' },
    { id: 'student3', name: 'Michael Brown' },
    { id: 'student5', name: 'Oliver Davis' },
    { id: 'student10', name: 'Ava Thomas' },
  ]
};

export async function GET(request, { params }) {
  try {
    const { mockTestId } = params;
    
    // Get students for the specified mock test
    // In a real application, you would query your database here
    const students = studentsByMockTest[mockTestId] || [];
    
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error fetching students for mock test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students for mock test' },
      { status: 500 }
    );
  }
} 