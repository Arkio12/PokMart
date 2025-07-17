import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const userId = searchParams.get('userId');
    const daysBack = searchParams.get('daysBack');

    // Get orders based on query parameters
    if (userId) {
      // Get orders for specific user
      const orders = await supabaseHelpers.getOrdersByUserId(userId);
      return NextResponse.json({ orders });
    }

    if (status) {
      // Get orders by status
      const orders = await supabaseHelpers.getOrdersByStatus(status);
      return NextResponse.json({ orders });
    }

    if (daysBack) {
      // Get users with recent orders
      const usersWithOrders = await supabaseHelpers.getUsersWithRecentOrders(parseInt(daysBack));
      return NextResponse.json({ usersWithOrders });
    }

    if (limit) {
      // Get recent orders with limit
      const orders = await supabaseHelpers.getRecentOrders(parseInt(limit));
      return NextResponse.json({ orders });
    }

    // Default: get all orders
    const orders = await supabaseHelpers.getAllOrders();
    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const updatedOrder = await supabaseHelpers.updateOrderStatus(orderId, status);
    
    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order ${orderId} updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
