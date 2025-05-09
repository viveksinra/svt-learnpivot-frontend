import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { mockTestId, maxScores, students } = data;
    
    // Validate input
    if (!mockTestId || !maxScores || !students) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    

    
    // Simulate successful save
    return NextResponse.json(
      { message: 'Scores saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving mock test scores:', error);
    return NextResponse.json(
      { error: 'Failed to save mock test scores' },
      { status: 500 }
    );
  }
} 