import { NextResponse } from 'next/server';

// In a real application, this would be your database
// For this demo, we'll just track the mock tests in memory
const existingMockTests = [
  'mock1', // Assuming mock1 already exists
  'mock3'  // Assuming mock3 already exists
];

export async function POST(request) {
  try {
    const data = await request.json();
    const { mockTestId, maxScores } = data;
    
    // Validate input
    if (!mockTestId) {
      return NextResponse.json(
        { error: 'Missing mock test ID' },
        { status: 400 }
      );
    }
    
    // Check if mock test already exists
    if (existingMockTests.includes(mockTestId)) {
      return NextResponse.json(
        { error: 'Mock test already exists' },
        { status: 409 }
      );
    }
    
    // In a real application, you would save this data to your database
    console.log('Creating new mock test:', mockTestId);
    console.log('Max scores:', maxScores);
    
    // Add to existing mock tests
    existingMockTests.push(mockTestId);
    
    // Simulate successful creation
    return NextResponse.json(
      { message: 'Mock test created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating mock test:', error);
    return NextResponse.json(
      { error: 'Failed to create mock test' },
      { status: 500 }
    );
  }
} 