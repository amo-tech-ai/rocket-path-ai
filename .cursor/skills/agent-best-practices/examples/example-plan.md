# Example Agent Plan

**Generated:** 2025-01-27  
**Task:** Add user profile editing feature  
**Agent:** Claude Code

---

## Overview

Implement user profile editing functionality allowing users to update their display name, bio, profile picture, and location. The feature should integrate with existing authentication and validation systems.

## Analysis

### Current State

- User profiles stored in `users` table with basic fields
- Authentication system uses Supabase Auth
- Form components follow patterns in `src/components/forms/`
- Validation utilities in `src/utils/validation.ts`
- Image upload handled via Supabase Storage

### Requirements

1. **Database Schema**
   - Add `display_name`, `bio`, `location` fields to `users` table
   - Profile picture stored in Supabase Storage
   - Migration script for schema changes

2. **Backend API**
   - PUT endpoint for profile updates
   - Image upload endpoint
   - Validation middleware
   - RLS policies for profile editing

3. **Frontend Components**
   - Profile edit form component
   - Image upload component with preview
   - Validation feedback
   - Success/error notifications

4. **Testing**
   - Unit tests for validation
   - Integration tests for API
   - Component tests for UI
   - E2E test for complete flow

## Implementation Plan

### Phase 1: Database Schema (30 min)

**Tasks:**
1. Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_add_profile_fields.sql`
2. Add columns to `users` table:
   - `display_name TEXT`
   - `bio TEXT`
   - `location TEXT`
   - `profile_picture_url TEXT`
3. Update TypeScript types in `src/integrations/supabase/types.ts`
4. Add RLS policies:
   - Users can update own profile
   - Users can read all profiles (public)
5. Test migration locally

**Files to modify:**
- `supabase/migrations/` (new file)
- `src/integrations/supabase/types.ts`

### Phase 2: Backend API (45 min)

**Tasks:**
1. Create profile service: `src/services/profileService.ts`
   - `updateProfile(userId, data)` method
   - Validation logic
   - Database update
2. Create API route: `src/pages/api/profile/index.ts`
   - PUT handler
   - Authentication check
   - Validation
   - Error handling
3. Create image upload route: `src/pages/api/profile/upload.ts`
   - Handle multipart form data
   - Upload to Supabase Storage
   - Return image URL
4. Add error types and messages

**Files to create:**
- `src/services/profileService.ts`
- `src/pages/api/profile/index.ts`
- `src/pages/api/profile/upload.ts`

**Files to modify:**
- `src/types/api.ts` (add profile types)

### Phase 3: Frontend Components (60 min)

**Tasks:**
1. Create profile edit form: `src/components/profile/ProfileEditForm.tsx`
   - Form fields for all profile data
   - Validation feedback
   - Submit handler
2. Create image upload component: `src/components/profile/ProfileImageUpload.tsx`
   - File input
   - Image preview
   - Upload progress
   - Error handling
3. Create profile page: `src/pages/app/Profile.tsx`
   - Load current profile
   - Display edit form
   - Handle updates
4. Add routing in `src/App.tsx`

**Files to create:**
- `src/components/profile/ProfileEditForm.tsx`
- `src/components/profile/ProfileImageUpload.tsx`
- `src/pages/app/Profile.tsx`

**Files to modify:**
- `src/App.tsx` (add route)

### Phase 4: Validation (30 min)

**Tasks:**
1. Add validation rules to `src/utils/validation.ts`:
   - Display name: 2-50 characters
   - Bio: max 500 characters
   - Location: max 100 characters
2. Add validation to form component
3. Add server-side validation to API

**Files to modify:**
- `src/utils/validation.ts`
- `src/components/profile/ProfileEditForm.tsx`
- `src/services/profileService.ts`

### Phase 5: Testing (45 min)

**Tasks:**
1. Unit tests:
   - `src/services/__tests__/profileService.test.ts`
   - `src/utils/__tests__/validation.test.ts`
2. Component tests:
   - `src/components/profile/__tests__/ProfileEditForm.test.tsx`
3. Integration tests:
   - `src/pages/api/__tests__/profile.test.ts`
4. E2E test:
   - Complete profile update flow

**Files to create:**
- Test files as listed above

### Phase 6: Error Handling & UX (30 min)

**Tasks:**
1. Add loading states
2. Add success notifications
3. Add error messages
4. Add optimistic updates
5. Handle network errors gracefully

**Files to modify:**
- All component files
- API route files

## Dependencies

### External
- Supabase Auth (authentication)
- Supabase Storage (image uploads)
- React Hook Form (form management)
- React Query (data fetching)

### Internal
- `src/utils/validation.ts` (validation utilities)
- `src/integrations/supabase/client.ts` (database client)
- `src/components/forms/` (form patterns)
- `src/components/ui/` (UI components)

## Risks & Mitigations

### Risk 1: Image Upload Size
- **Risk:** Large images slow uploads
- **Mitigation:** Add client-side compression, max size validation

### Risk 2: Concurrent Edits
- **Risk:** Multiple tabs editing simultaneously
- **Mitigation:** Use optimistic updates, last-write-wins

### Risk 3: Validation Bypass
- **Risk:** Client-side validation can be bypassed
- **Mitigation:** Always validate on server-side

## Success Criteria

- [ ] Users can update display name, bio, location
- [ ] Users can upload profile picture
- [ ] All validations work (client and server)
- [ ] Error handling works for all failure modes
- [ ] Tests pass (unit, integration, E2E)
- [ ] UI follows existing design patterns
- [ ] Performance acceptable (<2s for updates)

## Estimated Time

**Total:** ~4 hours
- Database: 30 min
- Backend: 45 min
- Frontend: 60 min
- Validation: 30 min
- Testing: 45 min
- Polish: 30 min

## Next Steps

1. Review this plan
2. Start with Phase 1 (Database Schema)
3. Test each phase before moving to next
4. Update plan if issues discovered

---

**Plan Status:** Ready for implementation  
**Approved by:** [Reviewer name]  
**Date:** 2025-01-27
