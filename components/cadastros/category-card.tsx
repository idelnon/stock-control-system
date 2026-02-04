import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
  iconBg: string;
  cardBg: string;
  onManage: () => void;
  buttonText?: string;
}

export function CategoryCard({
  title,
  description,
  count,
  icon: Icon,
  iconBg,
  cardBg,
  onManage,
  buttonText = "Gerenciar"
}: CategoryCardProps) {
  return (
    <Card className={`${cardBg} border-0 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${iconBg} rounded-2xl p-3 shadow-md`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{count}</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Button 
          onClick={onManage}
          className={`w-full ${iconBg} hover:opacity-90 text-white shadow-md`}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}
