# Core Prompt 16 — Wizard AI Integration

**Purpose:** Define enhanced wizard with ProfileExtractor AI integration for automatic startup profile extraction  
**Focus:** Wizard Step 1 AI extraction, user approval workflow, structured data capture  
**Status:** Phase 2 MVP

---

## Integration Purpose

**AI-Powered Profile Extraction**

The wizard integrates ProfileExtractor agent to automatically extract startup information from website URLs. This accelerates wizard completion by pre-filling company data, reducing manual entry, and ensuring accurate information capture.

---

## Wizard Enhancement Overview

### Wizard Step 1 Enhancement

**AI Feature:** ProfileExtractor agent  
**Model:** gemini-3-flash-preview  
**Gemini Features:** Structured Output, URL Context  
**Edge Function:** ai-helper → wizard_extract_startup

**Purpose:** Extract structured startup data from website URL to pre-fill wizard form

**Integration Point:** Wizard Step 1 - Profile & Business Information

---

## AI Extraction Workflow

### User-Initiated Extraction

**Trigger:** User enters website URL and clicks "Extract with AI"

**Steps:**
1. User navigates to Wizard Step 1
2. User enters company website URL in input field
3. User clicks "Extract with AI" button
4. System validates URL format
5. System shows loading state in right panel
6. System calls ProfileExtractor agent with URL
7. Agent uses URL Context tool to analyze website
8. Agent extracts structured startup data
9. Extracted data displayed in right panel for review
10. User reviews extracted information
11. User approves or rejects suggestions
12. Approved data pre-fills wizard form fields
13. User can edit any pre-filled fields
14. User continues to Step 2

**Data Flow:**
- Frontend → URL Input → Validation
- Frontend → Edge Function → ai-helper (wizard_extract_startup)
- Edge Function → Gemini API → URL Context + Structured Output
- Gemini API → Edge Function → Structured JSON Response
- Edge Function → Frontend → Extracted Data Display
- User → Approval → Form Pre-fill

### Extraction Response Structure

**Extracted Data Fields:**
- Company name
- Company description (50-200 words)
- Industry classification
- Key features and products
- Stage assessment
- Confidence scores per field

**Display Format:**
- Clean, readable extraction results
- Field-by-field display
- Confidence indicators
- Clear approval actions
- Edit capability before approval

---

## Right Panel Integration

### Extraction Display Panel

**Location:** Right panel during extraction

**Display Sections:**
- Loading state during extraction
- Extracted data review
- Confidence indicators
- Approval actions
- Manual entry option

**Loading State:**
- "Analyzing website..." message
- Loading spinner or progress indicator
- Expected time (<5 seconds)
- Cancel option available

**Extracted Data Display:**
- Company name (extracted)
- Description preview (first few sentences)
- Industry classification
- Key features list
- Stage assessment
- Confidence scores shown

**Approval Actions:**
- "Apply to Form" button (all fields)
- Individual field approval (selective)
- "Edit Before Applying" option
- "Reject" or "Try Again" option

---

## User Approval Workflow

### Approval Process

**Step 1: Review Extracted Data**
- User reviews extracted information in right panel
- User checks accuracy of each field
- User notices confidence scores
- User decides what to approve

**Step 2: Apply to Form**
- User clicks "Apply to Form" button
- All extracted fields pre-fill wizard form
- User sees data populated in form fields
- User can edit any field

**Step 3: Selective Approval**
- User can approve individual fields
- User clicks approve on specific fields
- Only approved fields pre-fill form
- User manually enters remaining fields

**Step 4: Edit and Continue**
- User edits any pre-filled fields as needed
- User adds missing information manually
- User verifies all form data
- User clicks "Continue" to Step 2

### Manual Override

**Fallback Option:**
- User can skip AI extraction
- User can enter all data manually
- User can use extraction as reference only
- Manual entry always available

**Hybrid Approach:**
- User approves some fields
- User edits approved fields
- User manually enters other fields
- Best of both approaches

---

## Error Handling

### Extraction Failures

**Common Failures:**
- Invalid URL format
- Inaccessible website
- Website timeout
- Extraction timeout
- API errors

**Error Handling:**
- Clear error messages to user
- Manual entry fallback
- Retry option available
- Helpful error explanations

**Graceful Degradation:**
- Never block wizard completion
- Always allow manual entry
- Clear recovery path
- User-friendly error states

---

## Form Field Mapping

### Extracted Data to Form Fields

**Company Information:**
- Company name → Name field
- Description → Description field
- Industry → Industry dropdown
- Key features → Features field
- Stage → Stage dropdown

**Data Pre-fill:**
- All fields populated automatically
- Dropdowns set to extracted values
- Text fields filled with extracted text
- User can modify any field

**Validation:**
- Pre-filled data validated like manual entry
- User edits trigger validation
- Required fields checked
- Format validation applied

---

## Best Practices

### User Experience

**Transparency:**
- Clear explanation of AI extraction
- Show what will be extracted
- Display confidence scores
- Explain data sources

**Control:**
- User always in control
- Easy to approve or reject
- Simple to edit
- Manual entry always available

**Speed:**
- Fast extraction (<5 seconds)
- Immediate feedback
- Quick approval process
- Efficient form pre-fill

### Data Quality

**Accuracy:**
- ProfileExtractor optimized for accuracy
- Confidence scores help users decide
- User review ensures quality
- Manual correction available

**Completeness:**
- Extract all relevant fields
- Fill as many fields as possible
- Highlight missing information
- Guide user to complete

---

## Summary

The wizard AI integration accelerates profile completion by automatically extracting startup information from website URLs. ProfileExtractor analyzes websites using URL Context and returns structured data that users can review and approve. The right panel displays extraction results for easy review, and users maintain full control over data accuracy through approval and editing workflows.

**Key Elements:**
- URL-based automatic extraction
- ProfileExtractor agent integration
- Right panel extraction display
- User approval workflow
- Form field pre-filling
- Manual override capability
- Error handling and fallbacks
- Fast extraction (<5 seconds)
