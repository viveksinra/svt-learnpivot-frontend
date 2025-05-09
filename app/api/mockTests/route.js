import { NextResponse } from 'next/server';

// Mock data for demonstration purposes
// In a real application, this would be fetched from a database
const mockTestsData = [
  { id: 'mock1', name: 'CSSE Mock Test 1 (Spring 2023)' },
  { id: 'mock2', name: 'CSSE Mock Test 2 (Summer 2023)' },
  { id: 'mock3', name: 'CSSE Mock Test 3 (Fall 2023)' },
  { id: 'mock4', name: 'CSSE Mock Test 4 (Winter 2024)' },
  { id: 'mock5', name: 'CSSE Mock Test 5 (Spring 2024)' }
];

// GET method to fetch all available mock tests
export async function GET() {
  try {
    // In a real application, you would query your database here
    return NextResponse.json(mockTestsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mock tests' },
      { status: 500 }
    );
  }
} 