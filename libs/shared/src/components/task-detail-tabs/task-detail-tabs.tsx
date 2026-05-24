import { cn } from '../../utils/cn';
import { Badge } from '../badge/badge';

interface TaskDetailTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabItems: TabItem[];
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export const TaskDetailTabs: React.FC<TaskDetailTabsProps> = ({
  activeTab,
  onTabChange,
  tabItems,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex w-full bg-basic-white rounded-lg overflow-hidden">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            className={`
              flex-1
              min-w-0
              text-center                          
              py-1 mx-1 my-1 text-sm font-medium rounded-md
              ${
                activeTab === tab.id
                  ? 'bg-white text-basic-black   text-lg font-medium'
                  : 'text-gray-500 hover:text-basic-black text-lg font-medium'
              }
              transition-colors duration-150
            `}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="flex items-center justify-center gap-1 min-w-0 w-full">
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant="ghost" size="sm" className="flex-shrink-0">
                  {tab.count}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
