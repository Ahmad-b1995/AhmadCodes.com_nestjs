# Authentication System Documentation

## Overview

This NestJS application implements a comprehensive authentication and authorization system with the following features:

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Different user roles (admin, editor, user)
- **Permission-Based Access Control**: Fine-grained permissions for specific actions
- **Configurable Default Admin User**: Admin credentials loaded from environment variables
- **Password Hashing**: Secure password storage using bcrypt
- **User Management**: Complete CRUD operations for user management
- **CORS Support**: Configurable Cross-Origin Resource Sharing

## User Roles and Permissions

### Roles
- **ADMIN**: Full system access with all permissions
- **EDITOR**: Can manage articles and some user operations
- **USER**: Basic user with limited permissions

### Permissions
- `CREATE_ARTICLE`, `READ_ARTICLE`, `UPDATE_ARTICLE`, `DELETE_ARTICLE`
- `CREATE_USER`, `READ_USER`, `UPDATE_USER`, `DELETE_USER`
- `MANAGE_ROLES`, `MANAGE_PERMISSIONS`

## Environment Configuration

### Required Environment Variables

```env
# Application Configuration
APP_PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Default Admin User Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:8080
CORS_CREDENTIALS=true
```

## CORS Configuration

The application supports flexible CORS configuration through environment variables:

### CORS Options

- **`CORS_ORIGIN`**: Allowed origins for cross-origin requests
  - Use `*` to allow all origins (not recommended for production)
  - Use comma-separated URLs for specific origins: `http://localhost:3000,https://yourdomain.com`
  - Leave empty to allow all origins by default

- **`CORS_CREDENTIALS`**: Whether to include credentials in CORS requests
  - Set to `true` to allow cookies and authorization headers
  - Set to `false` to disable credentials

### CORS Features

- **Configurable Origins**: Support for multiple specific origins or wildcard
- **Credentials Support**: Enable/disable credential inclusion
- **Standard Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Security Headers**: Proper handling of Authorization and Content-Type headers
- **Preflight Caching**: 24-hour cache for preflight requests

### Example Configurations

#### Development (Allow local development servers)
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:8080,http://127.0.0.1:3000
CORS_CREDENTIALS=true
```

#### Production (Specific domains only)
```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
CORS_CREDENTIALS=true
```

#### Open API (Allow all origins - not recommended for production)
```env
CORS_ORIGIN=*
CORS_CREDENTIALS=false
```

## Default Admin User

The system automatically creates a default admin user on startup using environment variables:

- **Email**: `ADMIN_EMAIL` (default: admin@example.com)
- **Password**: `ADMIN_PASSWORD` (default: admin123)
- **First Name**: `ADMIN_FIRST_NAME` (default: Admin)
- **Last Name**: `ADMIN_LAST_NAME` (default: User)

⚠️ **Important**: Change these values in your `.env` file, especially in production environments.

## API Endpoints

### Authentication

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Get Profile
```bash
GET /auth/profile
Authorization: Bearer <jwt_token>
```

#### Logout
```bash
POST /auth/logout
Authorization: Bearer <jwt_token>
```

### User Management (Admin/Editor only)

#### Get All Users
```bash
GET /users
Authorization: Bearer <jwt_token>
```

#### Get User by ID
```bash
GET /users/:id
Authorization: Bearer <jwt_token>
```

#### Create User
```bash
POST /users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER"
}
```

#### Update User
```bash
PUT /users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "role": "EDITOR"
}
```

#### Delete User
```bash
DELETE /users/:id
Authorization: Bearer <jwt_token>
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Configurable expiration time (default: 24 hours)
- **Role Guards**: Protect endpoints based on user roles
- **Permission Guards**: Fine-grained access control
- **User Status**: Users can be activated/deactivated
- **Environment-based Configuration**: Sensitive data stored in environment variables

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'USER',
  permissions TEXT[] DEFAULT '{}',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Login Test
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Test Role-Based Access
```bash
# This should fail with 403 for non-admin users
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <non_admin_token>"
```

## Production Considerations

1. **Environment Variables**: Ensure all sensitive data is properly configured in environment variables
2. **JWT Secret**: Use a strong, randomly generated JWT secret
3. **Default Admin**: Change default admin credentials immediately after deployment
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider implementing rate limiting for authentication endpoints
6. **Database Security**: Use proper database security measures
7. **Logging**: Implement proper logging for security events

## Error Handling

The system handles various error scenarios:
- Invalid credentials (401 Unauthorized)
- Insufficient permissions (403 Forbidden)
- User not found (404 Not Found)
- Duplicate email registration (409 Conflict)
- Inactive user accounts (401 Unauthorized)

## Development Setup

1. Copy `.env.example` to `.env`
2. Configure your database and JWT settings
3. Set your desired admin credentials
4. Run the application
5. The default admin user will be created automatically

The authentication system is now fully configurable and production-ready! 