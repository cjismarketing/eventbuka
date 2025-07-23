# EventBuka Role Permissions Matrix

## Overview
This document defines the comprehensive permissions matrix for the EventBuka platform, outlining what each user role can access and modify within the system.

## User Roles

### 1. Admin
**Description**: Platform administrators with full system access
**Permissions**:
- **Users**: Create, Read, Update, Delete (all users)
- **Events**: Create, Read, Update, Delete (all events)
- **Venues**: Create, Read, Update, Delete (all venues)
- **Bookings**: Create, Read, Update, Delete (all bookings)
- **Transactions**: Create, Read, Update, Delete (all transactions)
- **Analytics**: Read (platform-wide analytics)
- **Categories**: Create, Read, Update, Delete
- **System Settings**: Full access
- **User Verification**: Approve/reject user accounts
- **Content Moderation**: Approve/reject events, nominees

### 2. Organizer
**Description**: Event organizers who create and manage events
**Permissions**:
- **Own Events**: Create, Read, Update, Delete
- **Own Event Tickets**: Create, Read, Update, Delete
- **Own Event Bookings**: Read only
- **Own Event Analytics**: Read only
- **Venues**: Read only (for booking)
- **Categories**: Read only
- **Nominations**: Create, Read, Update (for own award events)
- **Nominees**: Approve/reject (for own award events)
- **Sponsorships**: Read, Accept/reject requests
- **Partnerships**: Read, Accept/reject requests

### 3. Vendor
**Description**: Service vendors (same permissions as organizers)
**Permissions**: 
- Same as Organizer role
- **Services**: Create, Read, Update own service offerings
- **Partnership Requests**: Create, Read, Update

### 4. Sponsor
**Description**: Companies and individuals who sponsor events
**Permissions**:
- **Events**: Read only (browse events to sponsor)
- **Own Sponsorships**: Create, Read, Update
- **Sponsored Events Analytics**: Read only (limited to sponsored events)
- **Sponsorship Requests**: Create, Read, Update
- **Profile**: Create, Read, Update own sponsor profile
- **Budget Management**: Manage sponsorship budgets

### 5. Partner
**Description**: Business partners offering services to event organizers
**Permissions**:
- **Events**: Read only (browse events for partnership opportunities)
- **Own Services**: Create, Read, Update, Delete
- **Partnership Requests**: Create, Read, Update
- **Own Profile**: Create, Read, Update
- **Portfolio**: Create, Read, Update, Delete own portfolio items
- **Service Bookings**: Read own bookings

## Resource-Specific Permissions

### Events
| Role | Create | Read | Update | Delete | Notes |
|------|--------|------|--------|--------|-------|
| Admin | ✅ | ✅ (All) | ✅ (All) | ✅ (All) | Full access |
| Organizer | ✅ | ✅ (Own + Published) | ✅ (Own) | ✅ (Own) | Can only manage own events |
| Vendor | ✅ | ✅ (Own + Published) | ✅ (Own) | ✅ (Own) | Same as organizer |
| Sponsor | ❌ | ✅ (Published) | ❌ | ❌ | Read-only access |
| Partner | ❌ | ✅ (Published) | ❌ | ❌ | Read-only access |

### Users
| Role | Create | Read | Update | Delete | Notes |
|------|--------|------|--------|--------|-------|
| Admin | ✅ | ✅ (All) | ✅ (All) | ✅ (All) | Full user management |
| Organizer | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own profile only |
| Vendor | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own profile only |
| Sponsor | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own profile only |
| Partner | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own profile only |

### Bookings
| Role | Create | Read | Update | Delete | Notes |
|------|--------|------|--------|--------|-------|
| Admin | ✅ | ✅ (All) | ✅ (All) | ✅ (All) | Full booking management |
| Organizer | ❌ | ✅ (Own Events) | ✅ (Own Events) | ❌ | View bookings for own events |
| Vendor | ❌ | ✅ (Own Events) | ✅ (Own Events) | ❌ | View bookings for own events |
| Sponsor | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own bookings only |
| Partner | ❌ | ✅ (Own) | ✅ (Own) | ❌ | Own bookings only |

### Venues
| Role | Create | Read | Update | Delete | Notes |
|------|--------|------|--------|--------|-------|
| Admin | ✅ | ✅ | ✅ | ✅ | Full venue management |
| Organizer | ❌ | ✅ | ❌ | ❌ | Browse venues for events |
| Vendor | ❌ | ✅ | ❌ | ❌ | Browse venues for events |
| Sponsor | ❌ | ✅ | ❌ | ❌ | View venue information |
| Partner | ❌ | ✅ | ❌ | ❌ | View venue information |

### Analytics
| Role | Platform | Own Events | Sponsored Events | Partner Services |
|------|----------|------------|------------------|------------------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Organizer | ❌ | ✅ | ❌ | ❌ |
| Vendor | ❌ | ✅ | ❌ | ✅ |
| Sponsor | ❌ | ❌ | ✅ | ❌ |
| Partner | ❌ | ❌ | ❌ | ✅ |

## Role-Based Dashboard Access

### Admin Dashboard
- User management interface
- Platform-wide analytics
- Content moderation tools
- System configuration
- Financial reports
- Security monitoring

### Organizer/Vendor Dashboard
- Event creation and management
- Ticket sales tracking
- Booking management
- Event analytics
- Revenue reports
- Venue booking interface

### Sponsor Dashboard
- Event discovery and filtering
- Sponsorship management
- ROI tracking
- Brand exposure analytics
- Sponsorship history

### Partner Dashboard
- Service management
- Partnership requests
- Booking management
- Performance analytics
- Portfolio management

## Security Implementation

### Row Level Security (RLS) Policies
Each table implements RLS policies that enforce these permissions at the database level:

1. **Users can only access their own data** (except admins)
2. **Event organizers can only manage their own events**
3. **Public data is accessible to all authenticated users**
4. **Sensitive data requires appropriate role permissions**

### API Endpoint Protection
- All API endpoints validate user roles before processing requests
- Middleware checks permissions based on the action and resource
- Failed permission checks return 403 Forbidden responses

### Frontend Route Protection
- Dashboard routes redirect based on user role
- UI elements are conditionally rendered based on permissions
- Unauthorized actions are disabled in the interface

## Permission Checking Function

```typescript
export const checkPermission = (
  userRole: string, 
  action: string, 
  resource: string
): boolean => {
  // Implementation in src/lib/supabase.ts
  // Returns true if user has permission, false otherwise
}
```

## Usage Examples

```typescript
// Check if user can create events
if (checkPermission(user.role, 'create', 'events')) {
  // Show create event button
}

// Check if user can view analytics
if (checkPermission(user.role, 'read', 'analytics')) {
  // Show analytics dashboard
}

// Check if user can manage all users
if (checkPermission(user.role, 'update', 'users')) {
  // Show user management interface
}
```

## Role Upgrade Process

### Becoming an Organizer/Vendor
1. User selects role during registration
2. Account is created with selected role
3. Role-specific onboarding flow begins
4. Admin verification may be required for certain roles

### Role Changes
- Only admins can change user roles
- Role changes require admin approval
- User permissions are immediately updated
- Dashboard access is redirected appropriately

## Audit Trail

All permission-sensitive actions are logged including:
- User role changes
- Permission grants/revokes
- Failed permission attempts
- Administrative actions

This ensures accountability and helps with security monitoring.