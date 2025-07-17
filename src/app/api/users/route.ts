import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
const { id, email, name, role } = await request.json();

    if (!id || !email || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or get user
    const user = await supabaseHelpers.createOrGetUser({
      id,
      email,
      name,
      role,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating/finding user:', error);
    return NextResponse.json({ error: 'Failed to create/find user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await supabaseHelpers.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
