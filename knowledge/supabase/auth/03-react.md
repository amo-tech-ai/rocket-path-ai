Use Supabase Auth with React

Learn how to use Supabase Auth with React.js.

1
Create a new Supabase project
Launch a new project in the Supabase Dashboard.

Your new database has a table for storing your users. You can see that this table is currently empty by running some SQL in the SQL Editor.

SQL_EDITOR
select * from auth.users;
2
Create a React app
Create a React app using a Vite template.

Terminal
npm create vite@latest my-app -- --template react
3
Install the Supabase client library
Navigate to the React app and install the Supabase libraries.

Terminal
cd my-app && npm install @supabase/supabase-js
4
Declare Supabase Environment Variables
Rename .env.example to .env.local and populate with your Supabase connection variables:

Project URL
startupai / startupai
https://yvyesmiczbjqwbqtlidy.supabase.co

Publishable key
startupai / startupai
sb_publishable_nj2ZkB9knrGTewzIZJmuZw_ZNwsSSvV

Anon key
startupai / startupai
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4

.env.local
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_... or anon key
You can also get the Project URL and key from the project's Connect dialog.

Changes to API keys
Supabase is changing the way keys work to improve project security and developer experience. You can read the full announcement, but in the transition period, you can use both the current anon and service_role keys and the new publishable key with the form sb_publishable_xxx which will replace the older keys.

In most cases, you can get the correct key from the Project's Connect dialog, but if you want a specific key, you can find all keys in the API Keys section of a Project's Settings page:

For legacy keys, copy the anon key for client-side operations and the service_role key for server-side operations from the Legacy API Keys tab.
For new keys, open the API Keys tab, if you don't have a publishable key already, click Create new API Keys, and copy the value from the Publishable key section.
Read the API keys docs for a full explanation of all key types and their uses.

5
Set up your login component
Explore drop-in UI components for your Supabase app.
UI components built on shadcn/ui that connect to Supabase via a single command.

Explore Components
In App.jsx, create a Supabase client using your Project URL and key.

You can configure the Auth component to display whenever there is no session inside supabase.auth.getSession()

src/App.jsx
import "./index.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
export default function App() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [session, setSession] = useState(null);
    // Check URL params on initial render
    const params = new URLSearchParams(window.location.search);
    const hasTokenHash = params.get("token_hash");
    const [verifying, setVerifying] = useState(!!hasTokenHash);
    const [authError, setAuthError] = useState(null);
    const [authSuccess, setAuthSuccess] = useState(false);
    useEffect(() => {
        // Check if we have token_hash in URL (magic link callback)
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get("token_hash");
        const type = params.get("type");
        if (token_hash) {
            // Verify the OTP token
            supabase.auth.verifyOtp({
                token_hash,
                type: type || "email",
            }).then(({ error }) => {
                if (error) {
                    setAuthError(error.message);
                } else {
                    setAuthSuccess(true);
                    // Clear URL params
                    window.history.replaceState({}, document.title, "/");
                }
                setVerifying(false);
            });
        }
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });
        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert("Check your email for the login link!");
        }
        setLoading(false);
    };
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };
    // Show verification state
    if (verifying) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>Confirming your magic link...</p>
                <p>Loading...</p>
            </div>
        );
    }
    // Show auth error
    if (authError) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>✗ Authentication failed</p>
                <p>{authError}</p>
                <button
                    onClick={() => {
                        setAuthError(null);
                        window.history.replaceState({}, document.title, "/");
                    }}
                >
                    Return to login
                </button>
            </div>
        );
    }
    // Show auth success (briefly before session loads)
    if (authSuccess && !session) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>✓ Authentication successful!</p>
                <p>Loading your account...</p>
            </div>
        );
    }
    // If user is logged in, show welcome screen
    if (session) {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>You are logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        );
    }
    // Show login form
    return (
        <div>
            <h1>Supabase + React</h1>
            <p>Sign in via magic link with your email below</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button disabled={loading}>
                    {loading ? <span>Loading</span> : <span>Send magic link</span>}
                </button>
            </form>
        </div>
    );
}
6
Customize email template
Before proceeding, change the email template to support support a server-side authentication flow that sends a token hash:

Go to the Auth templates page in your dashboard.
Select the Confirm sign up template.
Change {{ .ConfirmationURL }} to {{ .SiteURL }}?token_hash={{ .TokenHash }}&type=email.
Change your Site URL to https://localhost:5173
7
Start the app
Start the app, go to http://localhost:5173 in a browser, and open the browser console and you should be able to register and log in.

Terminal
npm run dev
