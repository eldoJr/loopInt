import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../../test/utils'
import { DashboardRoutes } from '../DashboardRoutes'

// Mock React Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: any) => children,
  }
})

// Mock the lazy components
vi.mock('../../../components/performance/LazyComponents', () => ({
  LazyProjects: () => <div data-testid="projects-component">Projects Component</div>,
  LazyTasks: () => <div data-testid="tasks-component">Tasks Component</div>,
  LazyCalendar: () => <div data-testid="calendar-component">Calendar Component</div>,
  LazyTeam: () => <div data-testid="team-component">Team Component</div>,
  LazyAnalytics: () => <div data-testid="analytics-component">Analytics Component</div>,
  LazyClients: () => <div data-testid="clients-component">Clients Component</div>,
}))

// Mock other components
vi.mock('../../reports/Reports', () => ({
  default: () => <div data-testid="reports-component">Reports Component</div>
}))

describe('DashboardRoutes', () => {
  const mockProps = {
    navigateToSection: vi.fn(),
    setCurrentView: vi.fn(),
  }

  it('renders Projects component for Projects view', () => {
    render(
      <DashboardRoutes 
        currentView="Projects" 
        {...mockProps}
      />
    )
    expect(screen.getByTestId('projects-component')).toBeInTheDocument()
  })

  it('renders Tasks component for Tasks view', () => {
    render(
      <DashboardRoutes 
        currentView="Tasks" 
        {...mockProps}
      />
    )
    expect(screen.getByTestId('tasks-component')).toBeInTheDocument()
  })

  it('renders Reports component for Reports view', () => {
    render(
      <DashboardRoutes 
        currentView="Reports" 
        {...mockProps}
      />
    )
    expect(screen.getByTestId('reports-component')).toBeInTheDocument()
  })

  it('returns null for unknown view', () => {
    const { container } = render(
      <DashboardRoutes 
        currentView="UnknownView" 
        {...mockProps}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})