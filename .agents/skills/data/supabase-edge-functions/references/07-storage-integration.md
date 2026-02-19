# Edge Functions Storage Integration Best Practices

**Document:** 07-storage-integration.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Supabase Storage](https://supabase.com/docs/guides/functions/storage-caching)

---

## Overview

Edge Functions can upload, download, and manage files in Supabase Storage. This guide covers file operations, cache-first patterns, and CDN integration.

---

## Basic File Operations

### ✅ CORRECT: Upload Files

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // ✅ CORRECT: Use service role key for storage operations
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Required for server-side uploads
  )

  // Generate content (e.g., AI-generated image)
  const imageData = await generateImage()

  // Upload to storage
  const { data, error } = await supabaseAdmin.storage
    .from('images')  // Bucket name
    .upload(`generated/${filename}.png`, imageData.body!, {
      contentType: 'image/png',
      cacheControl: '3600',  // Cache for 1 hour
      upsert: false,  // Don't overwrite existing
    })

  if (error) {
    console.error('Upload error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ path: data.path }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### ✅ CORRECT: Download Files

```typescript
const { data, error } = await supabaseAdmin.storage
  .from('images')
  .download('generated/image.png')

if (error) {
  throw error
}

// data is a Blob
const arrayBuffer = await data.arrayBuffer()
const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
```

---

## Cache-First Pattern

### ✅ CORRECT: Check Storage Before Generating

```typescript
const STORAGE_URL = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/images`

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const username = url.searchParams.get('username')

  try {
    // ✅ CORRECT: Try to get existing file first
    const storageResponse = await fetch(`${STORAGE_URL}/avatars/${username}.png`)

    if (storageResponse.ok) {
      // File exists, return it directly (fast!)
      return storageResponse
    }

    // File doesn't exist, generate it
    const generatedImage = await generateAvatar(username)

    // Upload to storage for future requests
    const { error } = await supabaseAdmin.storage
      .from('images')
      .upload(`avatars/${username}.png`, generatedImage.body!, {
        contentType: 'image/png',
        cacheControl: '86400',  // Cache for 24 hours
      })

    if (error) {
      console.error('Upload failed:', error)
      // Still return generated image even if upload fails
    }

    return generatedImage

  } catch (error) {
    return new Response('Error processing request', { status: 500 })
  }
})
```

**Benefits:**
- ✅ Faster responses (served from CDN)
- ✅ Reduced compute costs
- ✅ Better user experience

---

## File Metadata

### ✅ CORRECT: Store Metadata in Database

```typescript
// Upload file
const { data: fileData, error: uploadError } = await supabaseAdmin.storage
  .from('documents')
  .upload(`decks/${deckId}/slide-${slideId}.png`, imageBlob, {
    contentType: 'image/png',
    cacheControl: '3600',
  })

if (uploadError) throw uploadError

// Store metadata in database
await supabaseAdmin.from('file_uploads').insert({
  user_id: user.id,
  org_id: profile.org_id,
  file_path: fileData.path,
  file_name: `slide-${slideId}.png`,
  file_type: 'image/png',
  file_size: imageBlob.size,
  bucket_name: 'documents',
  uploaded_at: new Date().toISOString(),
})
```

---

## Best Practices Summary

### ✅ DO

1. **Use service role key** - For server-side storage operations
2. **Set cache control** - Appropriate TTL for content type
3. **Use cache-first pattern** - Check storage before generating
4. **Store metadata** - In database for queries
5. **Handle upload errors** - Graceful fallback
6. **Use appropriate buckets** - Organize by content type
7. **Set content type** - Correct MIME type
8. **Use upsert carefully** - Prevent accidental overwrites

### ❌ DON'T

1. **Don't use anon key** - For server-side uploads
2. **Don't skip error handling** - Uploads can fail
3. **Don't ignore cache control** - Set appropriate TTL
4. **Don't store large files** - Use external storage if >100MB
5. **Don't expose service role key** - Security risk

---

## References

- **Official Docs:** [Supabase Storage](https://supabase.com/docs/guides/functions/storage-caching)
- **Next:** [08-background-tasks.md](./08-background-tasks.md)

---

**Last Updated:** February 2026
