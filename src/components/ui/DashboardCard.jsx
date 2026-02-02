import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users } from 'lucide-react'; // Shadcn usually uses Lucide icons

const StatCard = ({ title, value, icon: Icon, gradient, linkTo }) => {
  return (
    <Link to={linkTo} className="block no-underline transition-transform hover:scale-[1.02]">
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg h-35 flex flex-col justify-between ${gradient}`}>
        {/* Background Wave Effect (Simplified SVG) */}
        <div className="absolute bottom-0 left-0 w-full opacity-30">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-20 w-full">
            <path d="M0.00,49.98 C149.99,150.00 349.89,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#fff' }}></path>
          </svg>
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
            <Icon size={24} className="text-white" />
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-bold tracking-tight">${value}</h3>
            <p className="text-sm font-medium opacity-90">{title}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const DashboardCards = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '13,169',
      icon: Package,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      linkTo: '/products'
    },
    {
      title: 'View Orders',
      value: '12,069',
      icon: ShoppingCart,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      linkTo: '/orders'
    },
    {
      title: 'View Customers',
      value: '12,069',
      icon: Users,
      gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      linkTo: '/customers'
    }
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