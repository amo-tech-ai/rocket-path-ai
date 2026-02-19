---
description: Test an authenticated route or API endpoint
---

# Test Route

Test an authenticated route or API endpoint.

## Route to Test

$ARGUMENTS - The route path (e.g., "/api/events", "/dashboard")

## Testing Steps

### For API Routes (Supabase Edge Functions)

1. **Check function exists**
   ```bash
   ls supabase/functions/
   ```

2. **Test locally** (if Supabase running)
   ```bash
   curl -X POST http://localhost:54321/functions/v1/[function-name] \
     -H "Authorization: Bearer [anon-key]" \
     -H "Content-Type: application/json" \
     -d '{"key": "value"}'
   ```

3. **Check for errors**
   - CORS handling present?
   - Auth validation working?
   - Error responses proper format?

### For Frontend Routes

1. **Check route exists in App.tsx**
2. **Check component renders without errors**
3. **Test with dev server**
   ```bash
   npm run dev
   ```
4. **Check browser console for errors**

### For Protected Routes

1. **Test unauthenticated access** (should redirect)
2. **Test authenticated access** (should render)
3. **Test with different user roles** (if applicable)

## Output

Report:
- Route status (working/broken)
- Any errors found
- Missing functionality
- Suggestions for improvement
