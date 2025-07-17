import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the most recent order (which represents the latest checkout)
    const recentOrders = await supabaseHelpers.getRecentOrders(1);
    
    if (!recentOrders || recentOrders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recent checkouts found',
        latestCheckout: null
      });
    }

    const latestOrder = recentOrders[0];
    
    // Format the response with checkout details
    const latestCheckout = {
      id: latestOrder.id,
      user: {
        id: latestOrder.user.id,
        name: latestOrder.user.name,
        email: latestOrder.user.email
      },
      total: latestOrder.total,
      status: latestOrder.status,
      itemCount: latestOrder.items.length,
      items: latestOrder.items.map(item => ({
        name: item.pokemon.name,
        quantity: item.quantity,
        price: item.price
      })),
      checkedOutAt: latestOrder.created_at,
      timeAgo: getTimeAgo(new Date(latestOrder.created_at))
    };

    return NextResponse.json({
      success: true,
      latestCheckout
    });

  } catch (error) {
    console.error('Error fetching latest checkout:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch latest checkout', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
}
