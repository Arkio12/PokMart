import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Delete the order
    const deletedOrder = await supabaseHelpers.deleteOrder(id);
    
    return NextResponse.json({
      success: true,
      message: `Order ${id} has been deleted successfully`,
      deletedOrder
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get specific order
    const order = await supabaseHelpers.getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
