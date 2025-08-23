export const AuthExamples = {
  // Login examples
  loginExamples: {
    admin: {
      summary: 'Admin login',
      description: 'Login with default admin credentials',
      value: {
        email: 'admin@example.com',
        password: 'admin123',
      },
    },
    user: {
      summary: 'Regular user login',
      description: 'Login with regular user credentials',
      value: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
  },

  // Register examples
  registerExamples: {
    example: {
      summary: 'New user registration',
      description: 'Register a new user with basic information',
      value: {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  },
};

export const AuthResponses = {
  // Login response
  loginResponse: {
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'admin@example.com' },
            firstName: { type: 'string', example: 'Admin' },
            lastName: { type: 'string', example: 'User' },
            role: { type: 'string', example: 'admin' },
            permissions: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },

  // Register response
  registerResponse: {
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            email: { type: 'string', example: 'newuser@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', example: 'user' },
            permissions: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },

  // Profile response
  profileResponse: {
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'admin@example.com' },
        firstName: { type: 'string', example: 'Admin' },
        lastName: { type: 'string', example: 'User' },
        role: { type: 'string', example: 'admin' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'create_articles',
            'read_articles',
            'update_articles',
            'delete_articles',
            'manage_users',
          ],
        },
        isActive: { type: 'boolean', example: true },
      },
    },
  },

  // Logout response
  logoutResponse: {
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  },
};
