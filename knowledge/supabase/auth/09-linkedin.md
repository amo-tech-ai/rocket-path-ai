Login with LinkedIn

To enable LinkedIn Auth for your project, you need to set up a LinkedIn OAuth application and add the application credentials to your Supabase Dashboard.

Overview#
Setting up LinkedIn logins for your application consists of 3 parts:

Create and configure a LinkedIn Project and App on the LinkedIn Developer Dashboard.
Add your LinkedIn (OIDC) client_id and client_secret to your Supabase Project.
Add the login code to your Supabase JS Client App.
Access your LinkedIn Developer account#
Go to LinkedIn Developer Dashboard.
Log in (if necessary.)
LinkedIn Developer Portal

Find your callback URL#
The next step requires a callback URL, which looks like this: https://<project-ref>.supabase.co/auth/v1/callback

Go to your Supabase Project Dashboard
Click on the Authentication icon in the left sidebar
Click on Sign In / Providers under the Configuration section
Click on LinkedIn from the accordion list to expand and you'll find your Callback URL, you can click Copy to copy it to the clipboard
For testing OAuth locally with the Supabase CLI see the local development docs.

Create a LinkedIn OAuth app#
Go to LinkedIn Developer Dashboard.
Click on Create App at the top right
Enter your LinkedIn Page and App Logo
Save your app
Click Products from the top menu
Look for Sign In with LinkedIn using OpenID Connect and click on Request Access
Click Auth from the top menu
Add your Redirect URL to the Authorized Redirect URLs for your app section
Copy and save your newly-generated Client ID
Copy and save your newly-generated Client Secret
Ensure that the appropriate scopes have been added under OAuth 2.0 Scopes at the bottom of the Auth screen.

Required OAuth 2.0 Scopes

Enter your LinkedIn (OIDC) credentials into your Supabase project#
Go to your Supabase Project Dashboard
In the left sidebar, click the Authentication icon (near the top)
Click on Providers under the Configuration section
Click on LinkedIn (OIDC) from the accordion list to expand and turn LinkedIn (OIDC) Enabled to ON
Enter your LinkedIn (OIDC) Client ID and LinkedIn (OIDC) Client Secret saved in the previous step
Click Save
You can also configure the LinkedIn (OIDC) auth provider using the Management API:

# Get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"
# Configure LinkedIn (OIDC) auth provider
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_linkedin_oidc_enabled": true,
    "external_linkedin_oidc_client_id": "your-linkedin-client-id",
    "external_linkedin_oidc_secret": "your-linkedin-client-secret"
  }'
Add login code to your client app#

JavaScript

Flutter

Kotlin
Make sure you're using the right supabase client in the following code.

If you're not using Server-Side Rendering or cookie-based Auth, you can directly use the createClient from @supabase/supabase-js. If you're using Server-Side Rendering, see the Server-Side Auth guide for instructions on creating your Supabase client.

When your user signs in, call signInWithOAuth() with linkedin_oidc as the provider:

async function signInWithLinkedIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
  })
}
For a PKCE flow, for example in Server-Side Auth, you need an extra step to handle the code exchange. When calling signInWithOAuth, provide a redirectTo URL which points to a callback route. This redirect URL should be added to your redirect allow list.


Client

Server
In the browser, signInWithOAuth automatically redirects to the OAuth provider's authentication endpoint, which then redirects to your endpoint.

await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `http://example.com/auth/callback`,
  },
})
At the callback endpoint, handle the code exchange to save the user session.


Next.js

SvelteKit

Astro

Remix

Express
Create a new file at app/auth/callback/route.ts and populate with the following:

app/auth/callback/route.ts
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

JavaScript

Flutter

Kotlin
When your user signs out, call signOut() to remove them from the browser session and any objects from localStorage:

async function signOut() {
  const { error } = await supabase.auth.signOut()
}
LinkedIn Open ID Connect (OIDC)#
We will be replacing the LinkedIn provider with a new LinkedIn (OIDC) provider to support recent changes to the LinkedIn OAuth APIs. The new provider utilizes the Open ID Connect standard. In view of this change, we have disabled edits on the LinkedIn provider and will be removing it effective 4th January 2024. Developers with LinkedIn OAuth Applications created prior to 1st August 2023 should create a new OAuth application via the steps outlined above and migrate their credentials from the LinkedIn provider to the LinkedIn (OIDC) provider. Alternatively, you can also head to the Products section and add the newly releaseSign In with LinkedIn using OpenID Connect to your existing OAuth application.

Developers using the Supabase CLI to test their LinkedIn OAuth application should also update their config.toml to make use of the new provider:

[auth.external.linkedin_oidc]
enabled = true
client_id = ...
secret = ...
Do reach out to support if you have any concerns around this change.

Resources#