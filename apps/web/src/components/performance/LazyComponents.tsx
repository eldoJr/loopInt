import { lazy } from 'react';

// Lazy load heavy feature components
export const LazyProjects = lazy(
  () => import('../../features/projects/Projects')
);
export const LazyTasks = lazy(() => import('../../features/tasks/Tasks'));
export const LazyAnalytics = lazy(
  () => import('../../features/analytics/Analytics')
);
export const LazyCalendar = lazy(
  () => import('../../features/calendar/Calendar')
);
export const LazyTeam = lazy(() => import('../../features/team/Team'));
export const LazyClients = lazy(() => import('../../features/clients/Clients'));
export const LazyReports = lazy(() => import('../../features/reports/Reports'));
export const LazyDocuments = lazy(
  () => import('../../features/documents/Documents')
);

// Lazy load settings components
export const LazyGeneral = lazy(
  () => import('../../features/settings/General')
);
export const LazyNotifications = lazy(
  () => import('../../features/settings/Notifications')
);
export const LazySystem = lazy(() => import('../../features/settings/System'));
export const LazyProducts = lazy(
  () => import('../../features/settings/Products')
);
export const LazyWorkItems = lazy(
  () => import('../../features/settings/WorkItems')
);
export const LazyApps = lazy(() => import('../../features/settings/Apps'));
export const LazyUserManagement = lazy(
  () => import('../../features/settings/UserManagement')
);
export const LazyBilling = lazy(
  () => import('../../features/settings/Billing')
);

// Lazy load profile components
export const LazyProfile = lazy(() => import('../../features/profile/Profile'));
export const LazyPersonalData = lazy(
  () => import('../../features/profile/PersonalData')
);
export const LazyAccountSettings = lazy(
  () => import('../../features/profile/AccountSettings')
);

// Lazy load support components
export const LazyHelpCenter = lazy(
  () => import('../../features/support/HelpCenter')
);
export const LazyNewFeature = lazy(
  () => import('../../features/support/NewFeature')
);
export const LazyReportBug = lazy(
  () => import('../../features/support/ReportBug')
);
export const LazyNewIssue = lazy(
  () => import('../../features/support/NewIssue')
);
export const LazyHistoric = lazy(
  () => import('../../features/support/History')
);
