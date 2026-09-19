# 🚀 HackMatch

**AI-powered founder & builder matching for hackathons, meetups, and startup communities.**

> **✨ Meet the right person. Right now.**

HackMatch helps people discover the most relevant person in the room based on what they are **building**, what they **know**, what they **need**, and what they are **interested in**.

Instead of scrolling through attendee lists or relying on random conversations, HackMatch uses AI to recommend the people you should meet — and explains **why you should meet them**.

---

## 🎯 The Problem

There are 50+ interesting people at this hackathon.

The problem isn't a lack of useful people.

The problem is discovering the **right person before the event ends**.

Someone nearby might:

* 🛠️ have exactly the skill your project is missing
* 💡 be working on a similar problem
* 🧠 know how to solve the issue blocking you
* 🧪 be the perfect early user for your product
* 🤝 be looking for someone with exactly your skills

But without the right discovery mechanism, you may never meet.

---

## ⚡ The Solution

HackMatch uses AI to understand:

* 🚀 what you're building
* 🛠️ what you're good at
* ❤️ what you're interested in
* 🧩 what you need help with
* 👥 what kind of people you want to meet

It then matches you with the most relevant people in the community.

### Instead of:

> ❓ "Who should I talk to?"

HackMatch answers:

> 🎯 **"Talk to Alex. He's building an AI developer tool, needs frontend help, and has experience with LLM agents — exactly the area you're currently exploring."**

---

# 🧭 Three Ways to Use HackMatch

## 🤝 Collaborate

**Find complementary builders.**

Discover developers, designers, founders, researchers, marketers, and creators whose skills complement yours.

Examples:

* 💻 Backend developer looking for a frontend developer
* 🎨 AI engineer looking for a UX designer
* 🚀 Founder looking for a technical co-founder
* 🧑‍💻 Designer looking for someone building an interesting product

---

## 🧠 Get Help

**Find someone who knows what you're stuck on.**

Describe your problem and HackMatch finds people nearby who may be able to help.

Examples:

* 🔌 "I need help deploying an MCP server."
* ☁️ "Does anyone know Cloudflare D1?"
* 🔐 "I'm stuck with authentication in Next.js."
* 🤖 "Who here understands AI agents?"
* 💰 "I need feedback on my startup pricing."

Instead of searching Google or asking an entire chat group, find a relevant human **in the room**.

---

## 🧪 Test My Product

**Find relevant users, testers, and reviewers.**

Tell HackMatch what you're building and who it is for.

The system finds people who are likely to be useful early users.

Examples:

* 🧑‍💻 Find developers to test a developer tool
* 🚀 Find founders to review a startup product
* 🎨 Find designers to critique a UI
* 🤖 Find AI users to test an AI feature
* 🎯 Find potential customers for a prototype

---

# 🧬 One Matching Engine, Multiple Use Cases

The three modes use the same underlying system:

```text
👥 People
   ↓
🛠️ Skills
❤️ Interests
🚀 Projects
🧩 Needs
📚 Experience
   ↓
🤖 AI Matching Engine
   ↓
🎯 Relevant People
   ↓
💡 Why You Should Meet
```

This creates several clear use cases from one simple matching architecture.

---

# ⚙️ How It Works

## 1. 📱 Scan

Scan the HackMatch QR code at the event.

## 2. 👤 Create Your Profile

Tell HackMatch:

* 🪪 who you are
* 🪑 where exactly you are
* ❤️ your interests
* 🛠️ your skills
* 🚀 what you're building (optional)
* 🤲 what you can help with (optional)

## 3. 🧭 Choose Your Goal

Select:

**🤝 Collaborate**

**🧠 Get Help**   /   **See questions/request**

**🧪 Test My Product**  /  **Test the product of others**

## 4. 🤖 Get relevant Matches

HackMatch identifies people with:

* ❤️ shared interests
* 🧩 complementary skills
* 📚 relevant experience
* 🚀 compatible projects
* 🎯 matching needs

## 5. 💡 See Why You Match

Every recommendation includes an explanation.

For example:

> 🎯 **92% Match — Meet Anna**
>
> Anna works with React and UI design and is interested in AI productivity tools.
> You're building an AI tool and currently looking for frontend feedback.
>
> 🤝 **Why meet:** She can review your UI, while you can help her with AI agent architecture.

## 6. 👋 Meet in Real Life

Find the person.
Walk over.
Start a conversation.

---
# Exact screen plan

Screens are listed with their connections. Every screen has a **Back** button unless stated otherwise, and every editor has **Submit** and **Cancel**.

The process starts with an organizer creating a community like "BUDAPEST AI HACKATON".
Participants reach the intro screen by scanning the community QR code or opening its link.

## CREATE-COMMUNITY (organizer)

* 🏷️ community name (1 line, max 100 chars)
* 📝 short description (max 500 chars)
* 📅 date / location (optional, max 200 chars)

Button CREATE → COMMUNITY-ADMIN

## COMMUNITY-ADMIN (organizer)

* community name and description (read only)
* 🔗 join link
* 📱 join QR code (generated from the join link)
* 👥 participant count

Button copy link, Button EDIT-PROFILE (organizer joins as a participant too)

## ENTRY (no UI)

Opening the join link resolves the entry point:

* profile already exists for this community on this device → **APP-MAIN-MENU**
* otherwise → **INTRO**

## INTRO

First screen a user sees after scanning the QR code.
Shows the community name and the plan: *"Enter your details, find the right person."*

Button OK → EDIT-PROFILE

## EDIT-PROFILE

* 👤 name (1 line, max 100 chars, required)
* 🪪 title (1 line, max 100 chars, required)
* 🪑 where exactly you are (1 line, max 200 chars, required)
* ❤️ your interests (max 500 chars, required)
* 🛠️ your skills (max 500 chars, required)
* 📚 your experience (max 1000 chars, optional)
* 🚀 what you're building (max 1000 chars, optional)
* 🤲 what you can help with (max 500 chars, optional)
* 🧩 what you need help with (max 500 chars, optional)
* 👥 who you are looking for (max 500 chars, optional)

Button SUBMIT checks input; if everything is all right → APP-MAIN-MENU.
Button CANCEL → APP-MAIN-MENU (only when a profile already exists).

## APP-MAIN-MENU

* **🤝 Collaborate** → COLLABORATE-RESULTS
* **🧠 Get Help** → GET-HELP-REQUEST-LIST   /   **👀 See questions/requests** → BROWSE-HELP-REQUESTS-LIST
* **🧪 Test My Product** → TEST-MY-PRODUCT-LIST   /   **🔬 Test the products of others** → TEST-PRODUCTS-OF-OTHERS-LIST
* **✏️ Edit own profile** → EDIT-PROFILE   /   **👥 Browse other profiles** → BROWSE-PROFILES-LIST

## COLLABORATE-RESULTS

"Based on your interests and skills these are the people that can be interesting for you."

* list of people with estimated match percentage, sorted descending
* click an item → MATCH-DETAILS
* empty state: "No matches yet — more people are still joining."

Button back (APP-MAIN-MENU)

## MATCH-DETAILS

Shared by COLLABORATE-RESULTS and GET-HELP-RESULTS.

* 👤 name, 🪪 title, 🪑 location
* 🔥 match percentage
* 💡 why you should meet (explanation)
* 🧩 complementary skills (you ←→ them)
* 💬 conversation starter

Button view full profile → BROWSE-PROFILES-DETAILS, Button back

## GET-HELP-REQUEST-LIST

* list of my help requests
* click an item → GET-HELP-REQUEST-EDIT (edit existing, with its comments)
* Button create new → GET-HELP-REQUEST-EDIT (empty)
* Button delete on each item

Button back (APP-MAIN-MENU)

## GET-HELP-REQUEST-EDIT

Used for both new and existing requests.

* text field, three lines, max 1000 chars: "What do you need help with?"
* list of comments from others (only shown for an existing request; read only)

Button SUBMIT → GET-HELP-RESULTS, Button CANCEL → GET-HELP-REQUEST-LIST

## GET-HELP-RESULTS

"These people may be able to help."

* list of people with match percentage
* click an item → MATCH-DETAILS
* empty state: "Nobody matched yet — try reformulating your request."

Button back (APP-MAIN-MENU), Button reformulate request → GET-HELP-REQUEST-EDIT (same request, prefilled)

## BROWSE-HELP-REQUESTS-LIST

* list of all help requests in the community with their author
* click an item → BROWSE-HELP-REQUESTS-DETAILS

Button back (APP-MAIN-MENU)

## BROWSE-HELP-REQUESTS-DETAILS

* help request fields (read only) + author (click → BROWSE-PROFILES-DETAILS)
* my comment (max 1000 chars, changeable) + Button SUBMIT comment
* list of comments from others (read only)

Button back (BROWSE-HELP-REQUESTS-LIST)

## TEST-MY-PRODUCT-LIST

* list of my products with their feedback count
* click an item → TEST-MY-PRODUCT-DETAILS (edit existing)
* Button CREATE NEW PRODUCT → TEST-MY-PRODUCT-DETAILS (empty)
* Button delete on each item

Button back (APP-MAIN-MENU)

## TEST-MY-PRODUCT-DETAILS (used for new product and change product)

* text field one line, max 200 chars: name
* text field five lines, max 3000 chars: description
* text field, max 300 chars: link to your product
* list of feedback received from others (read only, only for an existing product)

Button SUBMIT → TEST-MY-PRODUCT-LIST, Button CANCEL → TEST-MY-PRODUCT-LIST

## TEST-PRODUCTS-OF-OTHERS-LIST

* list of all products of other people, with owner and short description
* click an item → TEST-PRODUCTS-OF-OTHERS-DETAILS

Button back (APP-MAIN-MENU)

## TEST-PRODUCTS-OF-OTHERS-DETAILS

Read only fields:

* name, description, link to the product
* owner (click → BROWSE-PROFILES-DETAILS)

Editable:

* 💬 my feedback (max 3000 chars) + Button SUBMIT feedback

* list of other feedback (read only)

Button back (TEST-PRODUCTS-OF-OTHERS-LIST)

## BROWSE-PROFILES-LIST

* list of profiles in the community (name, title, location)
* click an item → BROWSE-PROFILES-DETAILS

Button back (APP-MAIN-MENU)

## BROWSE-PROFILES-DETAILS

* read only fields from EDIT-PROFILE
* list of that person's help requests (click → BROWSE-HELP-REQUESTS-DETAILS)
* list of that person's products (click → TEST-PRODUCTS-OF-OTHERS-DETAILS)

Button back (BROWSE-PROFILES-LIST)

## Common states

Every list and result screen defines a loading state, an empty state and an error state.
Matching runs asynchronously, so result screens show a spinner while matches are computed.

---

# 🎬 The Demo

The demo can happen with **real participants at the event**.

### Demo flow

```text
📱 Scan QR
   ↓
👤 Create profile
   ↓
📝 Describe project + skills + needs
   ↓
🤖 AI analyzes participants
   ↓
🎯 Top matches appear
   ↓
👆 Select a match
   ↓
💡 See why you should meet
   ↓
📍 Find that person in the room
   ↓
🤝 Start building together
```

The strongest possible demo isn't simulated.

It's:

> **🔥 "HackMatch recommended these two people meet. They're both here. Let's introduce them."**

---

# 👤 Example Profile

```yaml
name: Alex
title: 🪪 Full-stack AI engineer
location: 🪑 Table 12, main hall

building:
  🚀 AI startup idea validation tool

experience:
  - 📚 3 years building LLM products
  - 📚 shipped two developer tools

skills:
  - 💻 TypeScript
  - ⚛️ Next.js
  - 🤖 LLM agents
  - 🛠️ product development

interests:
  - 🤖 AI
  - 🚀 startups
  - 🧑‍💻 developer tools
  - 🧠 agentic systems

can_help_with:
  - 🤖 AI architecture
  - ⚛️ Next.js
  - 🛠️ prototyping

needs_help_with:
  - 🎨 UI/UX
  - 📣 marketing
  - 🧪 user testing

looking_for:
  - 🤝 collaborators
  - 🧪 testers
  - 🚀 startup founders
```

---

# 🎯 Example Match

## 👤 Sarah

**🔥 Match: 94%**

### 💡 Why you should meet

Sarah is a product designer interested in AI developer tools and early-stage startups.

You are building an AI product and currently need help with UX and user testing.

### 🧩 Complementary skills

```text
You                         Sarah
────────────────────────────────────────
🤖 AI engineering     ←→    🎨 Product design
⚛️ Next.js            ←→    🔍 UX research
🧠 LLM agents         ←→    🧪 User testing
🛠️ Technical prototype ←→  💬 Product feedback
```

### 💬 Conversation starter

> "You're both interested in AI developer tools. Alex needs UX feedback and Sarah is looking for AI projects to collaborate on."

---

# 🤖 AI Matching

HackMatch can evaluate multiple signals when calculating matches:

```text
❤️ shared interests

+

🧩 complementary skills

+

🎯 current needs

+

🚀 project relevance

+

📚 experience

+

🤝 collaboration goals
```

The goal isn't simply to find people who are similar.
The goal is to find people who are **useful to each other**.

---

# 🌍 Vision

HackMatch starts with hackathons.

But the same matching engine could work for:

* 🚀 startup events
* 💻 developer conferences
* 🎓 universities
* 🏢 coworking spaces
* 🌱 accelerators
* 👥 founder communities
* 🧠 professional communities
* 🏬 internal company networks
* 🌐 online communities

Anywhere there is a group of interesting people, there is a discovery problem.

HackMatch turns:

> 👥 **"There are hundreds of people here."**

into:

> 🎯 **"These are the five people you should meet."**

---

# 💭 Core Idea

Social networks tell you:

> 👥 **Who do you already know?**

Search engines tell you:

> 🔎 **What information exists?**

HackMatch asks:

> 🎯 **Who should you meet right now?**

# Target audience

20-30 year old startup founders, developers, designers, product owners 

# Other information for development

Unicode icons are extensively used for each button and choice and also for field names when appropriate.
This eases visual navigation and makes app more colorful.
Design is refined, uncluttered.
Colors are used and stored in a central location ( button normal, button accent, field name, ... )
A nice color for target audience is used globally as an accent button color.
---

# 🚀 HackMatch

### ✨ Meet the right person. Right now.

**🔎 Discover. 🤖 Match. 🤝 Meet. 🚀 Build.**
