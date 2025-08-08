import {
  MonitorSpeaker,
  Cog,
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';
import type { Department, DepartmentContent, DepartmentName } from './types';

export const departments: Department[] = [
  { name: 'IT', icon: MonitorSpeaker, color: 'blue' },
  { name: 'Operations', icon: Cog, color: 'gray' },
  { name: 'Marketing', icon: TrendingUp, color: 'green' },
  { name: 'Sales', icon: DollarSign, color: 'yellow' },
  { name: 'Finance', icon: CreditCard, color: 'blue' },
  { name: 'Customer Experience', icon: Users, color: 'pink' },
  { name: 'People', icon: Users, color: 'purple' },
];

export const departmentContent: Record<DepartmentName, DepartmentContent> = {
  IT: {
    title: 'IT Infrastructure',
    description:
      'Streamline your technology stack with automated deployments, infrastructure monitoring, and seamless integrations that keep your systems running smoothly.',
    buttonText: 'Optimize IT',
    image: '/IT.webp',
    features: [
      { icon: Zap, text: 'Automated deployment' },
      { icon: CheckCircle, text: 'System monitoring' },
      { icon: Target, text: 'Infrastructure scaling' },
    ],
    stats: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Deploy time', value: '2 min' },
    ],
  },
  Operations: {
    title: 'Operations Excellence',
    description:
      'Optimize workflows, reduce bottlenecks, and improve efficiency across all operational processes with intelligent automation and real-time insights.',
    buttonText: 'Streamline Ops',
    image: '/Operations_.webp',
    features: [
      { icon: Cog, text: 'Process automation' },
      { icon: BarChart3, text: 'Performance metrics' },
      { icon: Target, text: 'Quality control' },
    ],
    stats: [
      { label: 'Efficiency gain', value: '45%' },
      { label: 'Cost reduction', value: '30%' },
    ],
  },
  Marketing: {
    title: 'Marketing Automation',
    description:
      'Drive growth with data-driven marketing campaigns, automated lead nurturing, and comprehensive analytics that turn prospects into customers.',
    buttonText: 'Boost Marketing',
    image: '/Marketing_.webp',
    features: [
      { icon: TrendingUp, text: 'Campaign automation' },
      { icon: Target, text: 'Lead scoring' },
      { icon: BarChart3, text: 'ROI tracking' },
    ],
    stats: [
      { label: 'Lead conversion', value: '3.2x' },
      { label: 'Campaign ROI', value: '250%' },
    ],
  },
  Sales: {
    title: 'Sales Acceleration',
    description:
      'Close deals faster with intelligent pipeline management, automated follow-ups, and predictive analytics that identify your best opportunities.',
    buttonText: 'Accelerate Sales',
    image: '/sales-automation.webp',
    features: [
      { icon: DollarSign, text: 'Pipeline management' },
      { icon: Target, text: 'Lead prioritization' },
      { icon: BarChart3, text: 'Sales forecasting' },
    ],
    stats: [
      { label: 'Deal velocity', value: '40%' },
      { label: 'Close rate', value: '28%' },
    ],
  },
  Finance: {
    title: 'Financial Intelligence',
    description:
      'Gain complete financial visibility with automated reporting, expense tracking, and predictive budgeting that keeps your business profitable.',
    buttonText: 'Optimize Finance',
    image: '/Finance___1_.webp',
    features: [
      { icon: CreditCard, text: 'Expense automation' },
      { icon: BarChart3, text: 'Financial reporting' },
      { icon: Target, text: 'Budget forecasting' },
    ],
    stats: [
      { label: 'Processing time', value: '85%' },
      { label: 'Accuracy', value: '99.8%' },
    ],
  },
  'Customer Experience': {
    title: 'Customer Experience',
    description:
      'Deliver a smoother CX than you ever imagined by automating onboarding, records management, SLAs, support management and more.',
    buttonText: 'Automate CX',
    image: '/Customer_Support.webp',
    features: [
      { icon: Users, text: 'Customer onboarding' },
      { icon: CheckCircle, text: 'SLA management' },
      { icon: Target, text: 'Support automation' },
    ],
    stats: [
      { label: 'Customer satisfaction', value: '94%' },
      { label: 'Response time', value: '2.3 min' },
    ],
  },
  People: {
    title: 'People Operations',
    description:
      'Empower your workforce with streamlined HR processes, automated onboarding, and comprehensive employee lifecycle management.',
    buttonText: 'Empower People',
    image: '/People.webp',
    features: [
      { icon: Users, text: 'Employee onboarding' },
      { icon: BarChart3, text: 'Performance tracking' },
      { icon: Target, text: 'Skills development' },
    ],
    stats: [
      { label: 'Employee satisfaction', value: '91%' },
      { label: 'Onboarding time', value: '50%' },
    ],
  },
};
