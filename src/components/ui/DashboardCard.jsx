import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useOrders } from '../../tanstackhooks/useOrders';
import { useProducts } from '../../tanstackhooks/useProducts';
import { useUsers } from '../../tanstackhooks/useUsers';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon, gradient, linkTo, isLoading, trend }) => {
  const isPositiveTrend = trend >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <Link to={linkTo} className="block no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl h-36 flex flex-col justify-between ${gradient} transition-shadow duration-300`}>
        {/* Background Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full opacity-20">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-20 w-full">
            <path 
              d="M0.00,49.98 C149.99,150.00 349.89,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" 
              style={{ stroke: 'none', fill: '#fff' }}
            />
          </svg>
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-16 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-md border border-white/30 shadow-lg">
            <Icon size={24} className="text-white drop-shadow-md" />
          </div>
          
          {trend !== null && !isLoading && (
            <div className={`flex items-center gap-1 backdrop-blur-md px-2.5 py-1 rounded-full border ${
              isPositiveTrend 
                ? 'bg-white/20 border-white/30' 
                : 'bg-red-500/20 border-red-400/30'
            }`}>
              <TrendIcon size={12} className="text-white" />
              <span className="text-xs font-semibold">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col items-end">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 bg-white/30 rounded-md" />
              <Skeleton className="h-4 w-32 bg-white/30 rounded-md" />
            </div>
          ) : (
            <>
              <h3 className="text-4xl font-bold tracking-tight mb-1 drop-shadow-md">
                {value.toLocaleString()}
              </h3>
              <p className="text-sm text-left font-medium opacity-90 drop-shadow-sm">
                {title}
              </p>
            </>
          )}
        </div>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

const DashboardCards = () => {
  // Fetch data from all hooks
  const { orders, isLoading: ordersLoading } = useOrders();
  const { products, isLoading: productsLoading } = useProducts();
  const { customers, isLoading: customersLoading } = useUsers();

  // Calculate totals
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalCustomers = customers?.length || 0;

  // Calculate real trends based on data
  const trends = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Orders trend
    const recentOrders = orders?.filter(order => {
      const orderDate = order.createdAt?.toDate();
      return orderDate >= thirtyDaysAgo;
    }).length || 0;

    const previousOrders = orders?.filter(order => {
      const orderDate = order.createdAt?.toDate();
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    }).length || 0;

    const ordersTrend = previousOrders > 0 
      ? ((recentOrders - previousOrders) / previousOrders) * 100 
      : recentOrders > 0 ? 100 : 0;

    // Products trend
    const recentProducts = products?.filter(product => {
      const productDate = product.createdAt?.toDate();
      return productDate >= thirtyDaysAgo;
    }).length || 0;

    const previousProducts = products?.filter(product => {
      const productDate = product.createdAt?.toDate();
      return productDate >= sixtyDaysAgo && productDate < thirtyDaysAgo;
    }).length || 0;

    const productsTrend = previousProducts > 0
      ? ((recentProducts - previousProducts) / previousProducts) * 100
      : recentProducts > 0 ? 100 : 0;

    // Customers trend
    const recentCustomers = customers?.filter(customer => {
      const customerDate = customer.createdAt?.toDate();
      return customerDate >= thirtyDaysAgo;
    }).length || 0;

    const previousCustomers = customers?.filter(customer => {
      const customerDate = customer.createdAt?.toDate();
      return customerDate >= sixtyDaysAgo && customerDate < thirtyDaysAgo;
    }).length || 0;

    const customersTrend = previousCustomers > 0
      ? ((recentCustomers - previousCustomers) / previousCustomers) * 100
      : recentCustomers > 0 ? 100 : 0;

    return {
      products: productsTrend,
      orders: ordersTrend,
      customers: customersTrend,
    };
  }, [orders, products, customers]);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
      linkTo: '/products',
      isLoading: productsLoading,
      trend: trends.products,
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      gradient: 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500',
      linkTo: '/orders',
      isLoading: ordersLoading,
      trend: trends.orders,
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      gradient: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600',
      linkTo: '/customers',
      isLoading: customersLoading,
      trend: trends.customers,
    },
  ];

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;