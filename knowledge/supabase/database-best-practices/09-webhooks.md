# Database Webhooks Best Practices

**Document:** 09-webhooks.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)

---

## Overview

Database webhooks allow you to send HTTP requests to external services when database events occur. This enables event-driven architectures, third-party integrations, and real-time notifications.

---

## Webhook Configuration

### Basic Webhook Setup

**Via Supabase Dashboard:**
1. Navigate to Database → Webhooks
2. Click "Create Webhook"
3. Configure:
   - **Table:** Select table to monitor
   - **Events:** INSERT, UPDATE, DELETE
   - **HTTP Method:** POST (recommended)
   - **URL:** Endpoint to receive webhook
   - **Headers:** Optional custom headers
   - **Secret:** Optional webhook secret for verification

**Via SQL (if supported):**
```sql
-- Note: Webhooks are typically configured via Dashboard
-- This is a conceptual example
create webhook notify_on_task_creation
  on insert to public.tasks
  http post to 'https://api.example.com/webhooks/task-created'
  with headers ('Authorization' => 'Bearer token');
```

---

## Webhook Payload Structure

### Standard Payload Format

```json
{
  "type": "INSERT",  // or "UPDATE", "DELETE"
  "table": "tasks",
  "schema": "public",
  "record": {
    "id": "uuid-here",
    "title": "Task title",
    "status": "pending",
    "created_at": "2025-01-27T12:00:00Z"
  },
  "old_record": null,  // Only for UPDATE/DELETE
  "errors": []
}
```

### UPDATE Event Payload

```json
{
  "type": "UPDATE",
  "table": "tasks",
  "schema": "public",
  "record": {
    "id": "uuid-here",
    "title": "Updated title",
    "status": "completed"
  },
  "old_record": {
    "id": "uuid-here",
    "title": "Original title",
    "status": "pending"
  },
  "errors": []
}
```

---

## Best Practices

### 1. Webhook Security

**Always Verify Webhook Signatures:**

```typescript
// ✅ CORRECT - Verify webhook signature
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In webhook handler
const signature = req.headers['x-webhook-signature'];
if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

**Key Points:**
- Use webhook secret from Supabase Dashboard
- Verify signature on every request
- Use constant-time comparison to prevent timing attacks

### 2. Idempotency

**Handle Duplicate Webhooks:**

```typescript
// ✅ CORRECT - Idempotent webhook handler
async function handleTaskWebhook(payload: WebhookPayload) {
  const taskId = payload.record.id;
  const eventId = `${taskId}-${payload.type}-${payload.record.updated_at}`;
  
  // Check if already processed
  const processed = await checkEventProcessed(eventId);
  if (processed) {
    return { status: 'already_processed' };
  }
  
  // Process webhook
  await processTaskEvent(payload);
  
  // Mark as processed
  await markEventProcessed(eventId);
  
  return { status: 'processed' };
}
```

**Key Points:**
- Use unique event IDs (table_id + type + timestamp)
- Check for duplicates before processing
- Store processed events to prevent reprocessing

### 3. Error Handling

**Retry Logic:**

```typescript
// ✅ CORRECT - Retry with exponential backoff
async function sendWebhookWithRetry(
  url: string,
  payload: object,
  maxRetries = 3
): Promise<void> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return;  // Success
      }
      
      // Retry on 5xx errors
      if (response.status >= 500 && attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000);  // Exponential backoff
        continue;
      }
      
      throw new Error(`Webhook failed: ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;  // Final attempt failed
      }
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

### 4. Webhook Filtering

**Filter Events in Webhook Handler:**

```typescript
// ✅ CORRECT - Filter relevant events
async function handleTaskWebhook(payload: WebhookPayload) {
  // Only process status changes
  if (payload.type === 'UPDATE') {
    const oldStatus = payload.old_record?.status;
    const newStatus = payload.record.status;
    
    if (oldStatus === newStatus) {
      return { status: 'ignored', reason: 'No status change' };
    }
  }
  
  // Only process completed tasks
  if (payload.record.status !== 'completed') {
    return { status: 'ignored', reason: 'Not completed' };
  }
  
  // Process webhook
  await processTaskCompletion(payload.record);
  
  return { status: 'processed' };
}
```

---

## Common Patterns

### Pattern 1: External API Integration

**Use Case:** Sync data to external service

```typescript
// ✅ CORRECT - Sync to external API
async function syncTaskToExternalAPI(payload: WebhookPayload) {
  if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
    await fetch('https://api.external.com/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: payload.record.id,
        title: payload.record.title,
        status: payload.record.status
      })
    });
  } else if (payload.type === 'DELETE') {
    await fetch(`https://api.external.com/tasks/${payload.old_record.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${EXTERNAL_API_KEY}`
      }
    });
  }
}
```

### Pattern 2: Notification Service

**Use Case:** Send notifications on events

```typescript
// ✅ CORRECT - Send notification
async function notifyOnTaskChange(payload: WebhookPayload) {
  if (payload.type === 'UPDATE' && payload.record.status === 'completed') {
    await sendNotification({
      userId: payload.record.user_id,
      type: 'task_completed',
      data: {
        taskId: payload.record.id,
        title: payload.record.title
      }
    });
  }
}
```

### Pattern 3: Audit Logging

**Use Case:** Log all changes to external system

```typescript
// ✅ CORRECT - External audit log
async function logToExternalAudit(payload: WebhookPayload) {
  await fetch('https://audit.example.com/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: payload.type,
      table: payload.table,
      recordId: payload.record.id,
      timestamp: new Date().toISOString(),
      data: payload.record
    })
  });
}
```

---

## Webhook vs Database Triggers

### When to Use Webhooks

**✅ Use Webhooks For:**
- External API integrations
- Third-party service notifications
- Event-driven microservices
- Real-time notifications to external systems

### When to Use Triggers

**✅ Use Triggers For:**
- Database-level validation
- Automatic data transformations
- Internal audit logging
- Cascading updates within database

### Hybrid Approach

**Use Both:**
```sql
-- Trigger for database logic
create trigger handle_task_update
  before update on public.tasks
  for each row
  execute function public.validate_task();

-- Webhook for external notification
-- Configured via Dashboard to call external API
```

---

## Performance Considerations

### 1. Async Processing

**Don't Block Database Operations:**

```typescript
// ❌ BAD - Blocks database operation
async function handleWebhook(payload: WebhookPayload) {
  await slowExternalAPICall(payload);  // ❌ Blocks
  return { status: 'ok' };
}

// ✅ GOOD - Non-blocking
async function handleWebhook(payload: WebhookPayload) {
  // Queue for async processing
  await queueWebhookJob(payload);  // ✅ Returns immediately
  return { status: 'queued' };
}
```

### 2. Batch Processing

**Group Multiple Events:**

```typescript
// ✅ CORRECT - Batch webhook events
const eventQueue: WebhookPayload[] = [];

async function queueWebhook(payload: WebhookPayload) {
  eventQueue.push(payload);
  
  // Process batch every 5 seconds or 100 events
  if (eventQueue.length >= 100) {
    await processBatch(eventQueue.splice(0, 100));
  }
}

async function processBatch(events: WebhookPayload[]) {
  await fetch('https://api.example.com/webhooks/batch', {
    method: 'POST',
    body: JSON.stringify({ events })
  });
}
```

---

## Testing Webhooks

### Local Testing

```typescript
// ✅ CORRECT - Test webhook locally
async function testWebhook() {
  const testPayload: WebhookPayload = {
    type: 'INSERT',
    table: 'tasks',
    schema: 'public',
    record: {
      id: 'test-uuid',
      title: 'Test Task',
      status: 'pending'
    },
    old_record: null,
    errors: []
  };
  
  const response = await handleWebhook(testPayload);
  console.assert(response.status === 'processed');
}
```

---

## Project-Specific Webhooks

### Recommended Webhooks

**For StartupAI Platform:**

1. **Task Completion Webhook**
   - Table: `tasks`
   - Events: UPDATE (status = 'completed')
   - Use: Notify external systems, update analytics

2. **Deal Status Change Webhook**
   - Table: `deals`
   - Events: UPDATE (stage changes)
   - Use: CRM sync, notification systems

3. **AI Run Completion Webhook**
   - Table: `ai_runs`
   - Events: UPDATE (status = 'completed')
   - Use: Cost tracking, analytics, notifications

---

## Quick Reference

### Webhook Configuration Checklist

- [ ] Webhook URL is HTTPS
- [ ] Webhook secret configured
- [ ] Signature verification implemented
- [ ] Idempotency handling in place
- [ ] Error handling and retries configured
- [ ] Webhook handler is non-blocking
- [ ] Events filtered appropriately
- [ ] Webhook tested locally

---

## References

- **Official Docs:** [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- **Edge Functions:** [`../best-practices/08-background-tasks.md`](../best-practices/08-background-tasks.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
