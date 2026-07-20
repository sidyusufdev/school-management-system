import React from 'react'

// Statistics card component used in dashboards to display key metrics
interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
}

export default function StatCard({
  label,
  value,
  icon,
  bgColor = 'bg-blue-50',
  textColor = 'text-blue-600',
}: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </div>
  )
}
