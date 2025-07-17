import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await supabaseHelpers.getOrderStats();
    
    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order statistics', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
