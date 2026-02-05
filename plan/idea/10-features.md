How We Build Features
Ash Maurya
 
After launching your Minimum Viable Product (MVP), it’s quite likely that customer uptake won’t be immediate. In fact it should be expected:

Your MVP is the minimum feature set that lets you start learning about customers.

When you first launch a product, lots of things can and do go wrong. But when that happens, a typical reaction is to want to build more stuff — especially when it comes disguised as a customer feature request.

While listening to customers is key, you have to know how.

Blindly pushing features is almost never the answer. Features have costs that go beyond building costs such as ongoing maintenance, documentation, added complexity, etc. Because unused features are really a form of waste, it’s important to only keep those features that have a positive impact on your key metrics. Otherwise, left unchecked, it’s very easy to undo all the painstaking effort you put into reducing the scope of your MVP in the first place.

Even though all this makes logical sense, managing features in practice is still quite hard. I wrote a post on a similar topic a year ago titled: “3 Rules for Building Features” which represented some early thoughts on how to do this.

In this post, I’m going to build on that foundation and outline what our current process looks like.

Visualizing the Feature Lifecycle
Features versus bug fixes
The first step is distinguishing between features and bug-fixes. By feature, I really mean a Minimal Marketable Feature (MMF).

MMF was first defined in the book “Software by Numbers”: as the smallest portion of work that provides value to customers. A MVP is made up of one or more MMFs.

A good test for a MMF is to ask yourself if you’d announce it to your customers in a blog post or newsletter. If it’s too tiny to mention, then it’s not a MMF.

Features as their own iterations
Next, we build and track features independent of release or traditional iteration boundaries.

Time-boxed iterations are used in a typical Agile Software Development process to define release boundaries, but the problem starts when features over-run this boundary which is fairly common — especially when you additionally want to track the longer term effects of features. Having implemented 2 week release cycles for a number of years and then switched to Continuous Deployment, I find it unnecessary to take on the added overhead of tracking features this way.

Instead we track every feature as it’s own iteration. Rather than focus on velocity and planning games, we track end-to-end cycle time on features. We use Continuous Deployment to incrementally build and deploy features and a single Kanban board to visualize the feature lifecycle which I’ll describe next.

Meet our Kanban board
For those unfamiliar with Kanban, it is a scheduling system that was designed by Taiichi Ohno, father of the Toyota Production System, and is a way for visualizing the flow of work. It has more recently been adapted for software.

A Kanban board is to feature tracking what a Conversion Dashboard is to metrics tracking. Both let you focus on the Macro.

We extend the basic Kanban board by adding a number of sub-states shown below:

LEGEND
1: We clearly state the current macro metric we want to achieve at the top which helps prioritize what we work on.
2: We add an explicit state for validated learning.
3: We constrain the number of features we work on based on the number of developers. This prevents us from taking on new features without first validating that the features we just pushed were good.
4 and 5: The top row is for stuff currently being worked while the bottom row is for work that is ready to moved to the next stage. This will become clearer in a moment.
6: The stages marked in green are places where we solicit customer feedback.

The basic idea is that features start on the left-hand side of the board and move through stages of product and customer development before they are considered “Done”. In a Lean Startup, a feature is only done after it’s impact on customers has been measured.

Processing Feature Requests
I mentioned that we treat features differently from bug fixes. Here’s a “Getting Things Done” (GTD) style workflow for how we process new work requests that come in either internally or via customers:

Bug fixes either get fixed and deployed immediately or they go on our task board. All features requests end up on our Kanban board where they are then processed using a 4-stage iteration process that I’ll walk through next:

1. Understand Problem
The first stage begins with a weekly prioritization of backlog items waiting to be worked based on the macro metric we’re currently trying to improve. So for instance, if we have serious problems with our sign-up flow, all other downstream requests take a backseat to that.

We pick the highest priority feature in the list and the first thing we do is setup a few customer interviews to understand the underlying problem behind the feature request. Not what the customer wants, but why they want it. Every feature starts with a “NO” and needs value justification to be deemed “worth building” before we commit to building it.

After these interviews, the feature is either killed or moved to the next stage.

2. Define Solution
Once we understand the problem, we then take a stab at defining the solution starting with just the screens which we demo to these same customers. This usually results in a few design iterations that help define the solution we need to build.

3. Validate Qualitatively
Once we know what to build, we then start building the rest of the feature using a continuous deployment process. Continuous Deployment combined with a feature flipper system allows us to push these features to production but keep them hidden from customers until we are ready. When the feature is code complete, we do a partial rollout to select customers and validate the feature qualitatively with them. If we surface any major issues, we go back to address them.

4. Verify Quantitatively
Once the feature passes qualitative validation, we then roll it out to everyone and start gathering quantitative metrics. Because quantitative metrics can take time to collect, we start work immediately on the next high priority feature from the backlog. Splitting the validated learning stage into 2 phases (first qualitative, then quantitative) allows us to achieve the proper balance between speed and learning.

Only if the feature demonstrates a positive impact on the macro metric within a reasonable time window, does it stay in the app. Otherwise it is killed and removed.

 Key Principles of Ash Maurya’s Feature Building:
Traction-First (Not Build-First): Shift from building, then selling, to selling before building to validate demand.
Build-Measure-Learn-Iterate: Use the BMLI framework to develop, test, and refine features based on data rather than assumptions.
Feature Flippers & Continuous Deployment: Deploy code to production but keep it hidden, allowing for safe, partial rollouts and quick validation with select customers.
Qualitative Validation First: Before relying on quantitative data, validate features through direct, qualitative feedback to ensure they address specific user needs.
80/20 Rule Revision: Focus 80% of efforts on improving existing features and 20% on new ones to avoid building in a "hiding place" and instead focus on what users truly need.
Learning Velocity: Measure success by learning velocity—experiments run times insights extracted divided by time—rather than just shipping speed. 
In Ash Maurya’s framework, "Why" refers to the underlying customer problem or the value-creating purpose of a feature, rather than the technical implementation or functionality ("What"). Maurya argues that most startups fail because they fall in love with their solution (innovator's bias) and build "what" they think is cool, rather than "why" a user needs it. 
The Importance of "Why" in Feature Building:
Love the Problem, Not Your Solution: Maurya advises focusing on the "Why" (the customer's struggle) to ensure you are creating value. A feature is only "done" when it has a validated impact on a key metric, not just when the code is written.
The Vision-Strategy-Product Pyramid:
Vision (Why): Who you serve and how you help them.
Strategy (How): Your unique value proposition.
Product (What): Features and solutions.
Without the "Why" (Vision/Problem), the Product (What) lacks direction.
Defining "Why" via Jobs-to-be-Done (JTBD): When a user requests a feature, the "Why" is found by understanding the context: Where were they? What were they trying to do?.
"Why" as a Safeguard Against Waste: Unused features are a form of waste. By demanding a "value justification" (understanding the "Why") for every feature, teams avoid building bloated, unused software.
"Why" Prevents the "Build-First" Trap: Founders often use building as a "hiding place" to avoid the scary, hard work of validating that a feature actually solves a problem. 
How to Implement the "Why":
Before writing code, Maurya suggests using "Problem Interviews" to understand the root problem. The goal is to move from "What do you want?" to "Why do you need this?" or "What problem are you trying to solve?

Uncovering the "Right" Minimum Feature Set for Your Minimum Valuable Product (MVP)

How to combine JTBD interviews + Kano model to craft the right UVP for your MVP

Contrary to popular belief, an MVP (Minimum Valuable Product) is not a quick and dirty solution you throw over the fence at customers. It has to deliver value right out of the gate.

This is because customers today have many choices. And, when they see a half-baked product, they don’t turn into beta users. They leave.

Also, because startups are constrained by limited resources (speed, spend, and scope), the right MVP needs to maximize on your product’s unique value proposition while minimizing on features.

In a previous post, I outlined using the Kano model to assemble the right feature cocktail for your MVP. Read that first if you haven’t already.

Key Takeaways

Build your UVP around a single delighter feature (Gamechanger)
Ensure your delighter feature passes a minimum performance metric (Not a showstopper)
Layer on at least one other axis of better (Strengthen Positioning)
Innovate around basic features (Avoid distractions)
The most popular Kano analysis method is feature surveys. The problem with surveys is that they require you to know the right questions to ask, which isn’t typically the case at the earliest stages of a product when you don’t know what you don’t know.

In today’s issue, I’ll show you a better way.

Subscribed

Getting Your Product Hired for the Job
Imagine you’re applying for an actual job at a highly competitive company. Getting precise job requirements would help you prepare and position yourself, but most job descriptions are too vague and high-level.

What if you had the following additional insights:

Attributes shared by candidates previously hired for a similar position (Hiring criteria)
Attributes shared by candidates previously rejected for a similar position (Firing criteria)
Attributes the company wanted but couldn’t find across hired candidates (Tradeoffs)
Each of these criteria maps nicely to the Kano model:

Hiring criteria are performance features.
Firing criteria are must-have (basic) features.
Tradeoffs are delighter features.
You could use these insights to better position yourself for the job.

While this information isn’t easy to come by during actual job interviews, this is precisely what you can uncover before your product’s job interview (pitch) using carefully scripted customer (problem discovery) interviews.

1. Uncover hiring criteria, firing criteria, and tradeoffs
Before pitching your product, I recommend conducting 10-20 interviews with people who have recently used or purchased an existing alternative solution (old way) you’re looking to displace with your solution (your new way).

Your goal is to uncover

Why they picked the chosen existing alternative (Hiring criteria)
What else they considered and didn’t pick (Firing criteria)
What was still missing in the chosen existing alternative (Tradeoffs)
2. Rank hiring criteria, firing criteria, and tradeoffs
Use these insights to build and rank a feature matrix of delighters, performance, and showstopper features:


3. Define the UVP of your MVP
Apply the techniques in this post to assemble the right feature cocktail for your MVP.


