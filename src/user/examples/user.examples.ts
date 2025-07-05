export const UserExamples = {
  // Create user examples
  createUserExamples: {
    admin: {
      summary: 'Create admin user',
      description: 'Create a new admin user',
      value: {
        email: 'newadmin@example.com',
        password: 'securepassword123',
        firstName: 'New',
        lastName: 'Admin',
        role: 'admin'
      }
    },
    editor: {
      summary: 'Create editor user',
      description: 'Create a new editor user',
      value: {
        email: 'editor@example.com',
        password: 'securepassword123',
        firstName: 'Content',
        lastName: 'Editor',
        role: 'editor'
      }
    }
  },

  // Update profile examples
  updateProfileExamples: {
    example: {
      summary: 'Update profile',
      description: 'Update user profile with new name',
      value: {
        firstName: 'Updated',
        lastName: 'Name'
      }
    }
  },

  // Update user examples
  updateUserExamples: {
    example: {
      summary: 'Update user',
      description: 'Update user information',
      value: {
        firstName: 'Updated',
        lastName: 'User',
        role: 'editor',
        isActive: true
      }
    }
  },

  // Change password examples
  changePasswordExamples: {
    example: {
      summary: 'Change password',
      description: 'Change user password with current password verification',
      value: {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123'
      }
    }
  }
};

export const UserResponses = {
  // Create user response
  createUserResponse: {
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 3 },
        email: { type: 'string', example: 'newadmin@example.com' },
        firstName: { type: 'string', example: 'New' },
        lastName: { type: 'string', example: 'Admin' },
        role: { type: 'string', example: 'admin' },
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Get all users response
  getAllUsersResponse: {
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          email: { type: 'string', example: 'admin@example.com' },
          firstName: { type: 'string', example: 'Admin' },
          lastName: { type: 'string', example: 'User' },
          role: { type: 'string', example: 'admin' },
          permissions: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },

  // Get user profile response
  getUserProfileResponse: {
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
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Get user by ID response
  getUserByIdResponse: {
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'admin@example.com' },
        firstName: { type: 'string', example: 'Admin' },
        lastName: { type: 'string', example: 'User' },
        role: { type: 'string', example: 'admin' },
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Update profile response
  updateProfileResponse: {
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'admin@example.com' },
        firstName: { type: 'string', example: 'Updated' },
        lastName: { type: 'string', example: 'Name' },
        role: { type: 'string', example: 'admin' },
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Update user response
  updateUserResponse: {
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'admin@example.com' },
        firstName: { type: 'string', example: 'Updated' },
        lastName: { type: 'string', example: 'User' },
        role: { type: 'string', example: 'editor' },
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },

  // Change password response
  changePasswordResponse: {
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password changed successfully' }
      }
    }
  },

  // Profile update body schema
  updateProfileBodySchema: {
    description: 'Profile update data (limited fields)',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Updated' },
        lastName: { type: 'string', example: 'Name' }
      }
    }
  }
}; 