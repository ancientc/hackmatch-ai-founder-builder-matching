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
Here screens are listed with possible connections
Process starts with a user creating a community like "BUDAPEST AI HACKATON"
Users can get to the intro screen by scanning a QR code or getting the link
##INTRO 
First screen that user sees after scannin QR code
        basically showing the plan
        "enter your details, find the right person"
with an OK button the user skips to CREATE-PROFILE screeen

##EDIT-PROFILE
* 🪪 name
* 🪪 title
* 🪑 where exactly you are
* ❤️ your interests
* 🛠️ your skills
* 🚀 what you're building (optional)
* 🤲 what you can help with (optional)
button SUBMIT checks input, if everything is all right jump to APP-MAIN-MENU

##APP-MAIN-MENU

**🤝 Collaborate** COLLABORATE-RESULTS
**🧠 Get Help** GET-HELP-REQUEST-LIST  /   **See questions/request** BROWSE-HELP-REQUESTS-LIST
**🧪 Test My Product** TEST-MY-PRODUCT-LIST /  **Test the product of others** TEST-PRODUCTS-OF-OTHERS-LIST 
** Edit own profile** EDIT-PROFILE /  ** Browse other profiles ** BROWSE-PROFILES

##COLLABORATE-RESULTS

Based on your interests and skills these are the people that can be interesting for you:
results with estimated percentages

##GET-HELP-REQUEST-LIST

-list of my help requests
Button back
Button create new (GET-HELP-REQUEST-EDIT)

##GET-HELP-REQUEST-EDIT
Text field three lines: What do you need help with?
Button submit (to results)
-list of comments from others

##GET-HELP-RESULTS
These people may be able to help
-results with percentages
Button back (APP-MAIN-MENU), button reformulate request (to GET-HELP-REQUEST with same questions)

##BROWSE-HELP-REQUESTS-LIST
-list of help requests
Button back (APP-MAIN-MENU)

##BROWSE-HELP-REQUESTS-DETAILS
help request fields (read only)
my comment (changeable)
-list of comments from others
Button back 

##TEST-MY-PRODUCT-LIST
-list of my products
BUTTON CREATE NEW PRODUCT

##TEST-MY-PRODUCT-DETAILS (used for new product and change product)
Text field one line 200 chars: name
Text field five lines max 3000 chars: description
test field max 300 chars: link to your product

##TEST-PRODUCTS-OF-OTHERS-LIST 
-list of all products with owner and details showing (if clicked on go to 

##TEST-PRODUCTS-OF-OTHERS-DETAILS
read only fields:
Text field one line 200 chars: name
Text field five lines max 3000 chars: description
test field max 300 chars: link to your product
my feedback:
Text field my feedback 3000 chars (changeable)
list of other feedback (ready only)

##BROWSE-PROFILES-LIST
-list of profiles in the community

##BROWSE-PROFILES-DETAILS
-read only fields from EDIT-PROFILE
-list of help requests
-list of test my products

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

building:
  🚀 AI startup idea validation tool

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
