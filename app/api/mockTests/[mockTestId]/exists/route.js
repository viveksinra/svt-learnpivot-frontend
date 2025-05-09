import { NextResponse } from 'next/server';

// Mock data for demonstration purposes
// In a real application, this would be checked in a database
const existingMockTests = [
  'mock1', // Assuming mock1 already exists
  'mock3'  // Assuming mock3 already exists
];

export async function GET(request, { params }) {
  try {
    const { mockTestId } = params;
    
    // Check if the mock test exists
    // In a real application, you would query your database here
    const exists = existingMockTests.includes(mockTestId);
    
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error('Error checking mock test existence:', error);
    return NextResponse.json(
      { error: 'Failed to check mock test existence' },
      { status: 500 }
    );
  }
} 