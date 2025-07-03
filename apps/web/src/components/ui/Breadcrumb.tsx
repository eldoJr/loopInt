import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-white font-medium' : 'text-gray-400'}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;