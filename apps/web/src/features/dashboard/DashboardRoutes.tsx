import { Suspense } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  LazyProjects,
  LazyTasks,
  LazyCalendar,
  LazyTeam,
  LazyAnalytics,
  LazyClients,
} from '../../components/performance/LazyComponents';
import NewProject from '../projects/NewProject';
import EditProject from '../projects/EditProject';
import AddTask from '../tasks/AddTask';
import EditTask from '../tasks/EditTask';
import NewClient from '../clients/NewClient';
import TeamMember from '../auth/TeamMember';
import { GenerateReport } from '../ai/GenerateReport';
import PersonalData from '../profile/PersonalData';
import AccountSettings from '../profile/AccountSettings';
import HelpCenter from '../support/HelpCenter';
import NewFeature from '../support/NewFeature';
import ReportBug from '../support/ReportBug';
import NewAccount from '../auth/NewAccount';
import InviteUser from '../auth/InviteUser';
import TaxInvoice from '../finance/TaxInvoice';
import Invoices from '../finance/Invoices';
import NewIssue from '../support/NewIssue';
import NewCompany from '../clients/NewCompany';
import NewContact from '../clients/NewContact';
import JobAd from '../hr/JobAd';
import NewBill from '../finance/NewBill';
import NewCandidate from '../hr/NewCandidate';
import NewCoworker from '../team/NewCoworker';
import EditCoworker from '../team/EditCoworker';
import Documents from '../documents/Documents';
import NewDocument from '../documents/NewDocument';
import NewExpense from '../finance/NewExpense';
import NewOffer from '../clients/NewOffer';
import NewProduct from '../clients/NewProduct';
import HRProject from '../hr/HRProject';
import UndocumentedRevenue from '../finance/UndocumentedRevenue';
import Historic from '../support/History';
import Reports from '../reports/Reports';
import NewReport from '../reports/NewReport';
import EditReport from '../reports/EditReport';
import ViewReport from '../reports/ViewReport';
import Profile from '../profile/Profile';
import General from '../settings/General';
import Notifications from '../settings/Notifications';
import System from '../settings/System';
import Products from '../settings/Products';
import WorkItems from '../settings/WorkItems';
import Apps from '../settings/Apps';
import UserManagement from '../settings/UserManagement';
import Billing from '../settings/Billing';

interface DashboardRoutesProps {
  currentView: string;
  navigateToSection: (section: string) => void;
  setCurrentView: (view: string) => void;
}

export const DashboardRoutes = ({
  currentView,
  navigateToSection,
  setCurrentView,
}: DashboardRoutesProps) => {
  const backToMain = () => navigateToSection('Dashboard');

  switch (currentView) {
    case 'Projects':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyProjects
            onNavigateBack={backToMain}
            onNavigateToNewProject={() => navigateToSection('New Project')}
            onNavigateToEditProject={projectId =>
              setCurrentView(`Edit Project ${projectId}`)
            }
          />
        </Suspense>
      );
    case 'Tasks':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyTasks
            onNavigateBack={backToMain}
            onNavigateToAddTask={() => navigateToSection('Add Task')}
            onNavigateToEditTask={taskId =>
              setCurrentView(`Edit Task ${taskId}`)
            }
          />
        </Suspense>
      );
    case 'Calendar':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyCalendar onNavigateBack={backToMain} />
        </Suspense>
      );
    case 'Team':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyTeam
            onNavigateBack={backToMain}
            onNavigateToNewCoworker={() => navigateToSection('New Coworker')}
            onNavigateToEditMember={memberId =>
              setCurrentView(`Edit Member ${memberId}`)
            }
          />
        </Suspense>
      );
    case 'Analytics':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyAnalytics onNavigateBack={backToMain} />
        </Suspense>
      );
    case 'Clients':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyClients
            onNavigateBack={backToMain}
            onNavigateToNewCompany={() => navigateToSection('New Company')}
            onNavigateToNewContact={() => navigateToSection('New Contact')}
          />
        </Suspense>
      );
    case 'Reports':
      return (
        <Reports
          onNavigateBack={backToMain}
          onNavigateToNewReport={() => navigateToSection('New Report')}
          onNavigateToEditReport={reportId =>
            setCurrentView(`Edit Report ${reportId}`)
          }
          onNavigateToViewReport={reportId =>
            setCurrentView(`View Report ${reportId}`)
          }
        />
      );
    case 'New Report':
      return (
        <NewReport
          onNavigateBack={backToMain}
          onNavigateToReports={() => navigateToSection('Reports')}
        />
      );
    case 'New Project':
      return (
        <NewProject
          onNavigateBack={backToMain}
          onNavigateToProjects={() => navigateToSection('Projects')}
        />
      );
    case 'Add Task':
      return (
        <AddTask
          onNavigateBack={() => navigateToSection('Tasks')}
          onNavigateToTasks={() => navigateToSection('Tasks')}
        />
      );
    case 'New Client':
      return (
        <NewClient
          onNavigateBack={backToMain}
          onNavigateToClients={() => navigateToSection('Clients')}
        />
      );
    case 'Team Member':
      return (
        <TeamMember
          onNavigateBack={backToMain}
          onNavigateToTeam={() => navigateToSection('Team')}
        />
      );
    case 'Generate Report':
      return <GenerateReport />;
    case 'Personal Data':
      return <PersonalData onNavigateBack={backToMain} />;
    case 'Account Settings':
      return <AccountSettings onNavigateBack={backToMain} />;
    case 'Help Center':
      return <HelpCenter onNavigateBack={backToMain} />;
    case 'New Feature':
      return <NewFeature onNavigateBack={backToMain} />;
    case 'Report Bug':
      return <ReportBug onNavigateBack={backToMain} />;
    case 'New Account':
      return <NewAccount onNavigateBack={backToMain} />;
    case 'Invite User':
      return <InviteUser onNavigateBack={backToMain} />;
    case 'Tax Invoice':
      return (
        <TaxInvoice
          onNavigateBack={backToMain}
          onNavigateToInvoices={() => navigateToSection('Invoices')}
        />
      );
    case 'Invoices':
      return (
        <Invoices
          onNavigateBack={backToMain}
          onCreateInvoice={() => navigateToSection('Tax Invoice')}
          onCreateBill={() => navigateToSection('New Bill')}
          onCreateUndocumentedRevenue={() =>
            navigateToSection('Undocumented Revenue')
          }
        />
      );
    case 'New Issue':
      return <NewIssue onNavigateBack={backToMain} />;
    case 'New Company':
      return (
        <NewCompany
          onNavigateBack={backToMain}
          onNavigateToClients={() => navigateToSection('Clients')}
        />
      );
    case 'New Contact':
      return (
        <NewContact
          onNavigateBack={backToMain}
          onNavigateToNewContact={() => navigateToSection('Clients')}
        />
      );
    case 'Job Ad':
      return <JobAd onNavigateBack={() => navigateToSection('HR Project')} />;
    case 'New Bill':
      return (
        <NewBill
          onNavigateBack={backToMain}
          onNavigateToBills={() => navigateToSection('Invoices')}
        />
      );
    case 'New Candidate':
      return <NewCandidate onNavigateBack={backToMain} />;
    case 'New Coworker':
      return (
        <NewCoworker
          onNavigateBack={backToMain}
          onNavigateToTeam={() => navigateToSection('Team')}
        />
      );
    case 'Documents':
      return (
        <Documents
          onNavigateBack={backToMain}
          onNavigateToNewDocument={() => navigateToSection('New Document')}
        />
      );
    case 'New Document':
      return (
        <NewDocument
          onNavigateBack={backToMain}
          onNavigateToDocuments={() => navigateToSection('Documents')}
        />
      );
    case 'New Expense':
      return <NewExpense onNavigateBack={backToMain} />;
    case 'New Offer':
      return <NewOffer onNavigateBack={backToMain} />;
    case 'New Product':
      return <NewProduct onNavigateBack={backToMain} />;
    case 'HR Project':
      return (
        <HRProject
          onNavigateBack={backToMain}
          onNavigateToJobAd={() => navigateToSection('Job Ad')}
        />
      );
    case 'Undocumented Revenue':
      return (
        <UndocumentedRevenue
          onNavigateBack={backToMain}
          onNavigateToRevenues={() => navigateToSection('Invoices')}
        />
      );
    case 'History':
      return <Historic onNavigateBack={backToMain} />;
    case 'Profile':
      return <Profile onNavigateBack={backToMain} />;
    case 'General':
      return <General onNavigateBack={backToMain} />;
    case 'Notifications':
      return <Notifications onNavigateBack={backToMain} />;
    case 'System':
      return <System onNavigateBack={backToMain} />;
    case 'Products':
      return <Products onNavigateBack={backToMain} />;
    case 'WorkItems':
      return <WorkItems onNavigateBack={backToMain} />;
    case 'Apps':
      return <Apps onNavigateBack={backToMain} />;
    case 'UserManagement':
      return <UserManagement onNavigateBack={backToMain} />;
    case 'Billing':
      return <Billing onNavigateBack={backToMain} />;
    default:
      if (currentView.startsWith('Edit Project ')) {
        const projectId = currentView.replace('Edit Project ', '');
        return (
          <EditProject
            projectId={projectId}
            onNavigateBack={() => navigateToSection('Projects')}
            onNavigateToProjects={() => navigateToSection('Projects')}
          />
        );
      }
      if (currentView.startsWith('Edit Task ')) {
        const taskId = currentView.replace('Edit Task ', '');
        return (
          <EditTask
            taskId={taskId}
            onNavigateBack={() => navigateToSection('Tasks')}
            onNavigateToTasks={() => navigateToSection('Tasks')}
          />
        );
      }
      if (currentView.startsWith('Edit Member ')) {
        const memberId = currentView.replace('Edit Member ', '');
        return (
          <EditCoworker
            memberId={memberId}
            onNavigateBack={() => navigateToSection('Team')}
            onNavigateToTeam={() => navigateToSection('Team')}
          />
        );
      }
      if (currentView.startsWith('Edit Report ')) {
        const reportId = currentView.replace('Edit Report ', '');
        return (
          <EditReport
            reportId={reportId}
            onNavigateBack={() => navigateToSection('Reports')}
            onNavigateToReports={() => navigateToSection('Reports')}
          />
        );
      }
      if (currentView.startsWith('View Report ')) {
        const reportId = currentView.replace('View Report ', '');
        return (
          <ViewReport
            reportId={reportId}
            onNavigateBack={() => navigateToSection('Reports')}
            onNavigateToReports={() => navigateToSection('Reports')}
            onNavigateToEdit={id => setCurrentView(`Edit Report ${id}`)}
          />
        );
      }
      return null;
  }
};
