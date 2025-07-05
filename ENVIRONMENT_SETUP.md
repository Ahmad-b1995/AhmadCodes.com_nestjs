# Environment Configuration Guide

This project uses environment-specific configuration files to manage different deployment environments securely and efficiently.

## 📁 Environment Files

- **`.env`** - Active environment configuration (used by the application)
- **`.env.development`** - Development environment settings
- **`.env.production`** - Production environment settings  
- **`.env.example`** - Template with all available environment variables

## 🔄 Switching Environments

### Development Environment
```bash
# Copy development settings to active .env
cp .env.development .env

# Or use npm scripts (if configured)
npm run env:dev
```

### Production Environment
```bash
# Copy production settings to active .env
cp .env.production .env

# Or use npm scripts (if configured)
npm run env:prod
```

## 🔧 Environment Differences

### Development (.env.development)
- **Database**: Development database with relaxed security
- **CORS**: Allows local development servers and bolt.new
- **JWT Secret**: Simple secret for testing
- **Admin Credentials**: Default test credentials
- **SSL**: Disabled for local development
- **Logging**: Debug level with detailed logs
- **Debug Mode**: Enabled

### Production (.env.production)
- **Database**: Production database with SSL enabled
- **CORS**: Restricted to specific production domains
- **JWT Secret**: Strong, secure secret (must be changed)
- **Admin Credentials**: Secure credentials (must be changed)
- **SSL**: Enabled for secure connections
- **Logging**: Error level only
- **Debug Mode**: Disabled
- **Enhanced Security**: Rate limiting, session timeouts

## 🛡️ Security Considerations

### Development
- ✅ Quick setup for local development
- ✅ Allows testing from various local ports
- ⚠️ Uses simple passwords (not for production)
- ⚠️ Debug mode enabled (exposes more information)

### Production
- 🔒 **CRITICAL**: Change all default passwords
- 🔒 **CRITICAL**: Use strong JWT secret (32+ characters)
- 🔒 **CRITICAL**: Update database credentials
- 🔒 **CRITICAL**: Set correct CORS origins
- 🔒 SSL enabled for all database connections
- 🔒 Minimal logging to prevent information leakage
- 🔒 Rate limiting and security headers enabled

## 📋 Production Checklist

Before deploying to production:

### 1. Database Configuration
```bash
# Update these in .env.production
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
POSTGRES_DB=your_production_db_name
POSTGRES_USER=your_production_db_user
POSTGRES_PASSWORD=your_secure_production_password
DATABASE_SSL=true
```

### 2. JWT Security
```bash
# Generate a strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env.production
```

### 3. Admin Credentials
```bash
# Update admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
```

### 4. CORS Configuration
```bash
# Set your production domains
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

### 5. Security Settings
```bash
# Review and configure security settings
RATE_LIMIT_WINDOW=900000    # 15 minutes
RATE_LIMIT_MAX=100          # 100 requests per window
SESSION_TIMEOUT=3600000     # 1 hour
```

## 🔨 NPM Scripts (Optional)

Add these to your `package.json` for easier environment management:

```json
{
  "scripts": {
    "env:dev": "cp .env.development .env && echo 'Switched to development environment'",
    "env:prod": "cp .env.production .env && echo 'Switched to production environment'",
    "env:check": "echo 'Current environment:' && grep NODE_ENV .env",
    "start:dev": "npm run env:dev && npm run start:dev",
    "start:prod": "npm run env:prod && npm run build && npm run start:prod"
  }
}
```

## 🚀 Deployment Workflow

### Development Deployment
1. Ensure `.env.development` is configured
2. Run `cp .env.development .env`
3. Start the application: `npm run start:dev`

### Production Deployment
1. **NEVER** deploy with `.env.development`
2. Configure `.env.production` with secure values
3. Run `cp .env.production .env`
4. Build the application: `npm run build`
5. Start in production mode: `npm run start:prod`

## 🔍 Environment Validation

The application logs environment configuration on startup:

```bash
=== ENVIRONMENT VARIABLES ===
NODE_ENV: production
APP_PORT: 3000
DATABASE_HOST: your-production-db-host
# ... other variables
==============================

=== CORS CONFIGURATION ===
Origins: ['https://yourdomain.com', 'https://www.yourdomain.com']
Credentials: true
==========================
```

## 🚨 Common Issues

### Issue: Application won't start
- **Solution**: Check that `.env` file exists and has correct format
- **Check**: Verify database credentials are correct

### Issue: CORS errors in browser
- **Solution**: Ensure your frontend domain is in `CORS_ORIGIN`
- **Check**: Verify `CORS_CREDENTIALS` setting matches your frontend needs

### Issue: JWT authentication fails
- **Solution**: Ensure `JWT_SECRET` is set and consistent
- **Check**: Verify the secret hasn't changed between restarts

### Issue: Database connection fails
- **Solution**: Check database credentials and network connectivity
- **Check**: Verify `DATABASE_SSL` setting matches your database configuration

## 📝 Best Practices

1. **Never commit** `.env` files to version control
2. **Always use** environment-specific files
3. **Validate** environment variables on application startup
4. **Use strong secrets** in production
5. **Regularly rotate** JWT secrets and passwords
6. **Monitor** application logs for configuration issues
7. **Test** environment switches before deployment

## 🔗 Related Files

- `src/main.ts` - Application bootstrap and environment logging
- `src/config/typeorm.config.ts` - Database configuration
- `src/auth/strategies/jwt.strategy.ts` - JWT configuration
- `AUTHENTICATION.md` - Authentication system documentation

---

**Remember**: Environment configuration is critical for security. Always review and test your production configuration before deployment! 