import { Card } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  cardBg: string;
}

export function StatCard({ title, value, description, icon: Icon, iconBg, cardBg }: StatCardProps) {
  return (
    <Card className={`${cardBg} border-0 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`${iconBg} rounded-2xl p-2.5 shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
}
