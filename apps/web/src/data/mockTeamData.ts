export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  isIndividual: boolean;
  photo?: string;
  skype?: string;
  linkedin?: string;
  joinDate: string;
  lastActive?: string;
  skills?: string[];
  department?: string;
  salary?: number;
  contractType?: 'full-time' | 'part-time' | 'contractor' | 'intern';
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    status: 'active',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    skype: 'sarah.johnson.dev',
    linkedin: 'https://linkedin.com/in/sarah-johnson-dev',
    joinDate: '2023-01-15',
    lastActive: '2024-01-15',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    department: 'Engineering',
    salary: 95000,
    contractType: 'full-time'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@freelance.com',
    phone: '+1 (555) 234-5678',
    position: 'Full Stack Developer',
    company: 'Independent',
    location: 'Austin, TX',
    status: 'active',
    isIndividual: true,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skype: 'michael.chen.dev',
    linkedin: 'https://linkedin.com/in/michael-chen-fullstack',
    joinDate: '2023-03-22',
    lastActive: '2024-01-14',
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    department: 'Engineering',
    salary: 85000,
    contractType: 'contractor'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    position: 'UX/UI Designer',
    company: 'TechCorp Inc.',
    location: 'New York, NY',
    status: 'active',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/emily-rodriguez-ux',
    joinDate: '2023-02-10',
    lastActive: '2024-01-15',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    department: 'Design',
    salary: 78000,
    contractType: 'full-time'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@company.com',
    phone: '+1 (555) 456-7890',
    position: 'DevOps Engineer',
    company: 'TechCorp Inc.',
    location: 'Seattle, WA',
    status: 'inactive',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skype: 'david.thompson.devops',
    linkedin: 'https://linkedin.com/in/david-thompson-devops',
    joinDate: '2022-11-05',
    lastActive: '2023-12-20',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    department: 'Engineering',
    salary: 105000,
    contractType: 'full-time'
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@startup.com',
    phone: '+1 (555) 567-8901',
    position: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Los Angeles, CA',
    status: 'pending',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/lisa-wang-pm',
    joinDate: '2024-01-08',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Roadmapping'],
    department: 'Product',
    salary: 92000,
    contractType: 'full-time'
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Miller',
    email: 'james.miller@freelance.com',
    phone: '+1 (555) 678-9012',
    position: 'Backend Developer',
    company: 'Independent',
    location: 'Denver, CO',
    status: 'active',
    isIndividual: true,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    skype: 'james.miller.backend',
    linkedin: 'https://linkedin.com/in/james-miller-backend',
    joinDate: '2023-06-12',
    lastActive: '2024-01-13',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    department: 'Engineering',
    salary: 88000,
    contractType: 'contractor'
  },
  {
    id: '7',
    firstName: 'Anna',
    lastName: 'Garcia',
    email: 'anna.garcia@company.com',
    phone: '+1 (555) 789-0123',
    position: 'Marketing Specialist',
    company: 'TechCorp Inc.',
    location: 'Miami, FL',
    status: 'active',
    isIndividual: false,
    linkedin: 'https://linkedin.com/in/anna-garcia-marketing',
    joinDate: '2023-04-18',
    lastActive: '2024-01-15',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    department: 'Marketing',
    salary: 65000,
    contractType: 'full-time'
  },
  {
    id: '8',
    firstName: 'Robert',
    lastName: 'Kim',
    email: 'robert.kim@agency.com',
    phone: '+1 (555) 890-1234',
    position: 'QA Engineer',
    company: 'QualityFirst Agency',
    location: 'Portland, OR',
    status: 'active',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    skype: 'robert.kim.qa',
    linkedin: 'https://linkedin.com/in/robert-kim-qa',
    joinDate: '2023-07-25',
    lastActive: '2024-01-14',
    skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress'],
    department: 'Engineering',
    salary: 72000,
    contractType: 'full-time'
  },
  {
    id: '9',
    firstName: 'Sophie',
    lastName: 'Brown',
    email: 'sophie.brown@freelance.com',
    phone: '+1 (555) 901-2345',
    position: 'Graphic Designer',
    company: 'Independent',
    location: 'Chicago, IL',
    status: 'inactive',
    isIndividual: true,
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    linkedin: 'https://linkedin.com/in/sophie-brown-design',
    joinDate: '2023-05-30',
    lastActive: '2023-11-15',
    skills: ['Adobe Creative Suite', 'Branding', 'Print Design', 'Web Design'],
    department: 'Design',
    salary: 58000,
    contractType: 'contractor'
  },
  {
    id: '10',
    firstName: 'Alex',
    lastName: 'Taylor',
    email: 'alex.taylor@company.com',
    phone: '+1 (555) 012-3456',
    position: 'Data Scientist',
    company: 'TechCorp Inc.',
    location: 'Boston, MA',
    status: 'pending',
    isIndividual: false,
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    skype: 'alex.taylor.data',
    linkedin: 'https://linkedin.com/in/alex-taylor-datascience',
    joinDate: '2024-01-10',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    department: 'Data',
    salary: 98000,
    contractType: 'full-time'
  }
];