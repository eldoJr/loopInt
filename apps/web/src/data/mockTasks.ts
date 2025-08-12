export const mockTasks = [
  {
    id: '1',
    project_id: '1',
    assigned_to: 'user-1',
    title: 'Design user authentication flow',
    description: '<p>Create wireframes and mockups for the user authentication system including login, registration, and password reset flows.</p><p><strong>Requirements:</strong></p><ul><li>Mobile-first responsive design</li><li>Social login integration</li><li>Two-factor authentication support</li><li>Accessibility compliance</li></ul>',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-01-25',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-22T14:30:00Z'
  },
  {
    id: '2',
    project_id: '1',
    assigned_to: 'user-1',
    title: 'Implement payment gateway integration',
    description: '<p>Integrate Stripe payment processing for the e-commerce platform with support for multiple payment methods.</p><p><strong>Technical Tasks:</strong></p><ul><li>Set up Stripe API integration</li><li>Implement webhook handlers</li><li>Add payment form validation</li><li>Create transaction logging</li></ul><blockquote><p>Priority: Complete before checkout flow testing</p></blockquote>',
    status: 'todo',
    priority: 'high',
    due_date: '2024-01-28',
    created_at: '2024-01-21T10:15:00Z',
    updated_at: '2024-01-21T10:15:00Z'
  },
  {
    id: '3',
    project_id: '2',
    assigned_to: 'user-1',
    title: 'Train AI model with customer data',
    description: '<p>Prepare and train the natural language processing model using historical customer support conversations.</p><p><strong>Data Processing Steps:</strong></p><ul><li>Clean and anonymize customer data</li><li>Create training datasets</li><li>Fine-tune the model parameters</li><li>Validate model accuracy</li></ul>',
    status: 'todo',
    priority: 'medium',
    due_date: '2024-02-05',
    created_at: '2024-01-22T11:00:00Z',
    updated_at: '2024-01-22T11:00:00Z'
  },
  {
    id: '4',
    project_id: '2',
    assigned_to: 'user-1',
    title: 'Set up chatbot API endpoints',
    description: '<p>Create REST API endpoints for the chatbot service with proper authentication and rate limiting.</p><p><strong>API Endpoints:</strong></p><ul><li>POST /api/chat/message</li><li>GET /api/chat/history</li><li>POST /api/chat/feedback</li><li>GET /api/chat/analytics</li></ul>',
    status: 'done',
    priority: 'medium',
    due_date: '2024-01-30',
    created_at: '2024-01-18T08:30:00Z',
    updated_at: '2024-01-24T16:45:00Z'
  },
  {
    id: '5',
    project_id: '3',
    assigned_to: 'user-1',
    title: 'Create dashboard wireframes',
    description: '<p>Design comprehensive wireframes for the marketing analytics dashboard with focus on data visualization and user experience.</p><p><strong>Dashboard Sections:</strong></p><ul><li>Campaign overview</li><li>Performance metrics</li><li>ROI calculations</li><li>Custom reports</li></ul>',
    status: 'done',
    priority: 'low',
    due_date: '2024-01-15',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-16T17:20:00Z'
  },
  {
    id: '6',
    project_id: '1',
    assigned_to: 'user-1',
    title: 'Optimize database queries',
    description: '<p>Review and optimize slow database queries to improve application performance.</p><p><strong>Focus Areas:</strong></p><ul><li>Product search queries</li><li>User session management</li><li>Order processing</li><li>Inventory updates</li></ul>',
    status: 'todo',
    priority: 'medium',
    due_date: '2024-01-26',
    created_at: '2024-01-23T13:15:00Z',
    updated_at: '2024-01-23T13:15:00Z'
  }
];