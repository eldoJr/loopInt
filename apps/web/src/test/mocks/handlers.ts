import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock API endpoints
  http.get('/api/projects', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        priority: 'high',
        progress: 50,
        color: '#4F46E5',
        is_favorite: false,
        created_by: '1'
      }
    ])
  }),

  http.get('/api/tasks', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Task',
        description: 'A test task',
        status: 'todo',
        priority: 'high',
        assigned_to: '1'
      }
    ])
  }),

  http.post('/api/login', () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    })
  })
]