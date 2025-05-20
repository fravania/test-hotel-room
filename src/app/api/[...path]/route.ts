import { NextRequest, NextResponse } from 'next/server';

// Removed /frontend_api from the base URL since it will be part of the path parameter
const API_BASE_URL = 'https://lotus-hms.vercel.app';
const FETCH_TIMEOUT = 5000; // 5 second timeout

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await the entire params object first
  const params = await context.params;
  const path = params.path.join('/');
  const url = new URL(request.url);
  const targetUrl = `${API_BASE_URL}/${path}${url.search}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Add error handling for non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from ${targetUrl}: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { message: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying GET request to ${targetUrl}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await the entire params object first
  const params = await context.params;
  const path = params.path.join('/');
  const targetUrl = `${API_BASE_URL}/${path}`;
  
  try {
    const body = await request.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Add error handling for non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from ${targetUrl}: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { message: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying POST request to ${targetUrl}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await the entire params object first
  const params = await context.params;
  const path = params.path.join('/');
  const targetUrl = `${API_BASE_URL}/${path}`;
  
  try {
    const body = await request.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(targetUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Add error handling for non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from ${targetUrl}: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { message: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying PATCH request to ${targetUrl}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await the entire params object first
  const params = await context.params;
  const path = params.path.join('/');
  const targetUrl = `${API_BASE_URL}/${path}`;
  
  try {
    const body = await request.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Add error handling for non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from ${targetUrl}: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { message: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying DELETE request to ${targetUrl}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 