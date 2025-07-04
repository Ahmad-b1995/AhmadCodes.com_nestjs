# Authentication System

This NestJS application includes a comprehensive authentication and authorization system with JWT tokens, role-based access control, and permission-based access control.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Users can have different roles (admin, editor, user)
- **Permission-Based Access Control**: Fine-grained permissions for specific actions
- **Default Admin User**: Automatically created on application startup
- **Password Hashing**: Secure password storage using bcrypt
- **User Management**: Complete CRUD operations for user management

## User Roles

- **ADMIN**: Full access to all system features
- **EDITOR**: Can manage articles and some user operations
- **USER**: Basic user with limited permissions

## Permissions

- `create_articles`: Create new articles
- `read_articles`: Read articles
- `update_articles`: Update existing articles
- `delete_articles`: Delete articles
- `manage_users`: Manage user accounts
- `manage_roles`: Manage user roles and permissions

## Default Admin User

The system automatically creates a default admin user on startup:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin
- **Permissions**: All permissions

**⚠️ Important**: Change the default admin password in production!

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email and password
- `POST /auth/register` - Register a new user
- `GET /auth/profile` - Get current user profile (requires authentication)
- `POST /auth/logout` - Logout (client-side token removal)

### User Management (Admin/Editor only)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
- `GET /users/profile` - Get own profile
- `PATCH /users/profile` - Update own profile
- `POST /users/change-password` - Change password

## Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Register New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","firstName":"John","lastName":"Doe","password":"password123"}'
```

### Create User with Specific Role (Admin only)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{"email":"editor@example.com","firstName":"Editor","lastName":"User","password":"editor123","role":"editor","permissions":["create_articles","read_articles","update_articles"]}'
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Stateless authentication with 24-hour expiration
- **Role Guards**: Protect endpoints based on user roles
- **Permission Guards**: Fine-grained access control
- **User Status**: Users can be activated/deactivated

## Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Database Schema

The system creates a `users` table with the following structure:
- `id`: Primary key
- `email`: Unique email address
- `firstName`: User's first name
- `lastName`: User's last name
- `password`: Hashed password
- `role`: User role (admin, editor, user)
- `permissions`: Array of permissions
- `isActive`: Boolean flag for user status
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `lastLoginAt`: Last login timestamp

## Testing

The authentication system has been tested with:
- ✅ Default admin user creation
- ✅ User login and JWT token generation
- ✅ User registration
- ✅ Role-based access control
- ✅ Permission-based access control
- ✅ Protected endpoint access
- ✅ User profile management
- ✅ User CRUD operations

## Development

To test the authentication system:

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Login with default admin:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

3. Use the returned JWT token to access protected endpoints.

## Production Considerations

1. **Change Default Admin Password**: Update the default admin credentials
2. **Secure JWT Secret**: Use a strong, random JWT secret
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Consider shorter token expiration times
5. **Rate Limiting**: Implement rate limiting for authentication endpoints
6. **Password Policies**: Enforce strong password requirements 