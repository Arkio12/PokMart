import { supabaseHelpers } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all orders with details
    const orders = await supabaseHelpers.getAllOrders();
    const pokemon = await supabaseHelpers.getAllPokemon();
    
    // Calculate basic stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Calculate users count (unique users from orders)
    const uniqueUsers = new Set(orders.map(order => order.user_id));
    const totalUsers = uniqueUsers.size;
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate conversion rate (mock data - in real app you'd track visitors)
    const conversionRate = 3.2;
    
    // Get top selling Pokemon
    const pokemonSales: { [key: string]: { count: number, revenue: number, pokemon: any } } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const pokemonId = item.pokemon_id;
        if (!pokemonSales[pokemonId]) {
          pokemonSales[pokemonId] = {
            count: 0,
            revenue: 0,
            pokemon: item.pokemon
          };
        }
        pokemonSales[pokemonId].count += item.quantity;
        pokemonSales[pokemonId].revenue += item.price * item.quantity;
      });
    });
    
    const topSellingPokemon = Object.values(pokemonSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => ({
        id: item.pokemon.id,
        name: item.pokemon.name,
        sales: item.count,
        revenue: item.revenue,
        image: item.pokemon.image
      }));
    
    // Calculate revenue by month (last 12 months)
    const monthlyRevenue: { [key: string]: { revenue: number, orders: number } } = {};
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substr(0, 7); // YYYY-MM format
      monthlyRevenue[monthKey] = { revenue: 0, orders: 0 };
    }
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const monthKey = orderDate.toISOString().substr(0, 7);
      if (monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey].revenue += order.total;
        monthlyRevenue[monthKey].orders += 1;
      }
    });
    
    const revenueByMonth = Object.entries(monthlyRevenue).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      revenue: data.revenue,
      orders: data.orders
    }));
    
    // Calculate Pokemon type distribution
    const typeCount: { [key: string]: number } = {};
    pokemon.forEach(p => {
      if (p.types && Array.isArray(p.types)) {
        p.types.forEach((typeObj: any) => {
          const type = typeObj.type;
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
      }
    });
    
    const typeDistribution = Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        percentage: pokemon.length > 0 ? (count / pokemon.length) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    
    // Calculate price range distribution
    const priceRanges = [
      { range: '$0-$99', min: 0, max: 99 },
      { range: '$100-$199', min: 100, max: 199 },
      { range: '$200-$299', min: 200, max: 299 },
      { range: '$300-$399', min: 300, max: 399 },
      { range: '$400+', min: 400, max: Infinity }
    ];
    
    const priceRangeData = priceRanges.map(range => {
      const count = pokemon.filter(p => p.price >= range.min && p.price <= range.max).length;
      return {
        range: range.range,
        count,
        percentage: pokemon.length > 0 ? (count / pokemon.length) * 100 : 0
      };
    });
    
    // Calculate recent trends (last 7 days vs previous 7 days)
    const now7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const now14DaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const last7DaysOrders = orders.filter(order => new Date(order.created_at) >= now7DaysAgo);
    const previous7DaysOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= now14DaysAgo && orderDate < now7DaysAgo;
    });
    
    const last7DaysRevenue = last7DaysOrders.reduce((sum, order) => sum + order.total, 0);
    const previous7DaysRevenue = previous7DaysOrders.reduce((sum, order) => sum + order.total, 0);
    
    const weeklyGrowth = previous7DaysRevenue > 0 
      ? ((last7DaysRevenue - previous7DaysRevenue) / previous7DaysRevenue) * 100 
      : 0;
    
    // Calculate order status distribution
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    // Get recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order.id,
      customerName: order.user?.name || 'Unknown User',
      total: order.total,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString(),
      timeAgo: getTimeAgo(new Date(order.created_at))
    }));
    
    // Calculate inventory status
    const inventoryStatus = {
      inStock: pokemon.filter(p => p.inStock).length,
      outOfStock: pokemon.filter(p => !p.inStock).length,
      featured: pokemon.filter(p => p.featured).length,
      total: pokemon.length
    };
    
    const analyticsData = {
      totalRevenue,
      totalOrders,
      totalUsers,
      avgOrderValue,
      conversionRate,
      topSellingPokemon,
      revenueByMonth,
      typeDistribution,
      priceRangeData,
      salesTrends: {
        dailyGrowth: 2.4, // Mock data - would calculate from actual daily data
        weeklyGrowth,
        monthlyGrowth: 15.3 // Mock data - would calculate from actual monthly data
      },
      ordersByStatus,
      recentOrders,
      inventoryStatus,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}
