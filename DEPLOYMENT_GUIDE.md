# EventBuka Deployment Guide

## Prerequisites

### 1. Supabase Project Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Note your project URL and anon key
3. Enable email authentication in Authentication settings
4. Disable email confirmation for development (optional)

### 2. Environment Configuration
Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Integration (Optional)
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=EventBuka
```

## Database Setup

### 1. Run Migration Scripts

Execute the migration scripts in your Supabase SQL Editor in this order:

1. **Main Schema Migration**:
   ```sql
   -- Copy and paste the content from:
   -- supabase/migrations/create_comprehensive_auth_system.sql
   ```

2. **Seed Test Data** (after creating test users):
   ```sql
   -- Copy and paste the content from:
   -- supabase/migrations/seed_test_data.sql
   ```

### 2. Create Test Users

Since users must be created through Supabase Auth, you'll need to create test users manually or through the application:

#### Method 1: Through Supabase Dashboard
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Create users with these details:

**Admin User**:
- Email: `admin@eventbuka.com`
- Password: `EventBuka@2024`
- User Metadata: `{"full_name": "System Administrator", "role": "admin"}`

**Organizer User**:
- Email: `organizer@eventbuka.com`
- Password: `EventBuka@2024`
- User Metadata: `{"full_name": "Event Organizer", "role": "organizer"}`

**Vendor User**:
- Email: `vendor@eventbuka.com`
- Password: `EventBuka@2024`
- User Metadata: `{"full_name": "Event Vendor", "role": "vendor"}`

**Sponsor User**:
- Email: `sponsor@eventbuka.com`
- Password: `EventBuka@2024`
- User Metadata: `{"full_name": "Event Sponsor", "role": "sponsor"}`

**Partner User**:
- Email: `partner@eventbuka.com`
- Password: `EventBuka@2024`
- User Metadata: `{"full_name": "Business Partner", "role": "partner"}`

#### Method 2: Through Application Registration
1. Start the application
2. Use the registration form to create users with different roles
3. Each user will be automatically assigned their selected role

### 3. Verify Database Setup

After running migrations and creating users, verify:

1. **Tables Created**: Check that all tables exist in your Supabase database
2. **RLS Policies**: Verify Row Level Security policies are active
3. **Triggers**: Confirm the `handle_new_user` trigger is working
4. **Test Data**: Run the seed script to populate sample data

## Application Deployment

### 1. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 3. Deploy to Netlify

1. **Connect Repository**:
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**:
   Add all environment variables from your `.env` file to Netlify's environment settings

3. **Deploy Settings**:
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 4. Deploy to Vercel

1. **Connect Repository**:
   - Import your project to Vercel
   - Set framework preset to "Vite"

2. **Environment Variables**:
   Add all environment variables in Vercel dashboard

3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Edge Functions Setup

### 1. Create Edge Functions Directory

```bash
mkdir -p supabase/functions
```

### 2. Example Edge Function

Create `supabase/functions/hello/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const data = {
      message: 'Hello from EventBuka Edge Function!',
      timestamp: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      },
    )
  }
})
```

### 3. Deploy Edge Functions

Edge functions are automatically deployed when you push to your Supabase project.

## Testing the Deployment

### 1. Authentication Testing

Test each user role:

```bash
# Test login for each role
curl -X POST 'your-supabase-url/auth/v1/token?grant_type=password' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@eventbuka.com",
    "password": "EventBuka@2024"
  }'
```

### 2. Database Testing

Verify RLS policies:

```sql
-- Test as different users
SELECT * FROM public.events; -- Should respect RLS
SELECT * FROM public.users WHERE id = auth.uid(); -- Should work
```

### 3. Frontend Testing

1. **Registration Flow**: Test user registration with different roles
2. **Login Flow**: Verify login redirects to appropriate dashboards
3. **Role Permissions**: Confirm users can only access permitted features
4. **Responsive Design**: Test on mobile, tablet, and desktop
5. **Error Handling**: Test with invalid credentials and network issues

## Monitoring and Maintenance

### 1. Database Monitoring

Monitor these metrics in Supabase:
- Connection count
- Query performance
- Error rates
- Storage usage

### 2. Application Monitoring

Set up monitoring for:
- Page load times
- Error tracking
- User engagement
- Conversion rates

### 3. Security Monitoring

Regular security checks:
- Review RLS policies
- Monitor failed login attempts
- Check for SQL injection attempts
- Audit user permissions

## Troubleshooting

### Common Issues

1. **"Database error loading user after sign-up"**:
   - Check if `handle_new_user` trigger exists
   - Verify RLS policies on users table
   - Ensure user metadata includes role

2. **"Invalid login credentials"**:
   - Verify user exists in auth.users
   - Check if email confirmation is required
   - Confirm password meets requirements

3. **Permission denied errors**:
   - Review RLS policies
   - Check user role assignments
   - Verify function permissions

4. **Edge function errors**:
   - Check function logs in Supabase
   - Verify CORS headers
   - Confirm environment variables

### Debug Commands

```bash
# Check database connection
npm run test:db

# Verify environment variables
echo $VITE_SUPABASE_URL

# Test API endpoints
curl -X GET 'your-app-url/api/health'
```

## Performance Optimization

### 1. Database Optimization

- Add indexes for frequently queried columns
- Optimize RLS policies for performance
- Use connection pooling for high traffic
- Implement caching strategies

### 2. Frontend Optimization

- Implement lazy loading for routes
- Optimize images and assets
- Use code splitting
- Enable compression

### 3. CDN Configuration

- Configure CDN for static assets
- Set appropriate cache headers
- Optimize for global distribution

## Security Checklist

- [ ] RLS policies implemented for all tables
- [ ] Environment variables secured
- [ ] HTTPS enabled in production
- [ ] Input validation implemented
- [ ] SQL injection protection active
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive data
- [ ] User sessions properly managed
- [ ] Audit logging enabled

## Backup and Recovery

### 1. Database Backups

Supabase automatically backs up your database, but you can also:
- Export database schema regularly
- Backup critical data separately
- Test restore procedures

### 2. Application Backups

- Keep deployment configurations in version control
- Document environment variables
- Maintain deployment scripts

This deployment guide ensures a secure, scalable, and maintainable EventBuka platform ready for production use.