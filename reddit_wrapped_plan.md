# Reddit Wrapped - Complete Development Plan

## Project Overview
Build a web application that creates a personalized "Reddit Wrapped" experience for users, similar to Spotify Wrapped. Users enter their Reddit username, and the app analyzes their 2025 activity to generate beautiful visualizations and AI-powered insights about their Reddit year.

---

## Technical Architecture

### Tech Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **State Management**: React Context or Zustand
- **API Integration**: Reddit OAuth 2.0 + Reddit JSON API
- **AI Integration**: OpenAI GPT-4 (via ChatGPT models)
- **Deployment**: Vercel or Netlify with serverless functions

### Architecture Pattern
**Full-stack serverless architecture:**
- Frontend: React SPA hosted on Vercel/Netlify
- Backend: Serverless functions (API routes) to handle:
  - Reddit OAuth flow (secure credential management)
  - Reddit API calls (avoid CORS issues)
  - OpenAI API calls (secure API key management)

---

## Reddit API Setup & Authentication

### Step 1: Reddit API Credentials
**Instructions to include in implementation:**

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in:
   - **Name**: "Reddit Wrapped 2025"
   - **App type**: Select "web app"
   - **Description**: "A yearly summary of your Reddit activity"
   - **About URL**: Your app URL (can update later)
   - **Redirect URI**: `http://localhost:3000/callback` (for development) and `https://yourdomain.com/callback` (for production)
4. Save the **Client ID** and **Client Secret**

### Step 2: OAuth 2.0 Flow Implementation
**Authentication flow:**

1. **User clicks "Login with Reddit"**
   - Redirect to: `https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=code&state=RANDOM_STRING&redirect_uri=REDIRECT_URI&duration=temporary&scope=identity history read`

2. **Reddit redirects back with authorization code**
   - Backend serverless function exchanges code for access token
   - Endpoint: `POST https://www.reddit.com/api/v1/access_token`

3. **Store access token temporarily**
   - Token valid for 1 hour
   - Use for subsequent API calls

**Required OAuth Scopes:**
- `identity` - Get username
- `history` - Access post/comment history
- `read` - Read posts and comments
- `mysubreddits` - Access subscribed subreddits

---

## Data Collection Strategy

### Reddit API Endpoints to Use

#### 1. User Overview
```
GET /user/{username}/about.json
```
**Data to extract:**
- Account creation date (cake day)
- Total post karma
- Total comment karma
- Is premium/gold user

#### 2. User Posts
```
GET /user/{username}/submitted.json?limit=100&t=year
```
**Pagination**: Use `after` parameter to get more (up to 1000 total)
**Data to extract:**
- Post title, subreddit, score, timestamp
- Number of comments
- Awards received
- Post type (link, text, image, video)

#### 3. User Comments
```
GET /user/{username}/comments.json?limit=100&t=year
```
**Pagination**: Use `after` parameter
**Data to extract:**
- Comment body, subreddit, score, timestamp
- Parent post context
- Awards received

#### 4. User Trophies/Awards
```
GET /api/v1/user/{username}/trophies
```

### Data Processing Pipeline

**Step 1: Fetch All Data**
- Make paginated requests to get up to 1000 posts and 1000 comments
- Filter by year (2025 only - check `created_utc` timestamp)
- Store in temporary state

**Step 2: Process & Aggregate**
Calculate the following metrics:

1. **Karma Breakdown**
   - Total post karma (sum of all post scores)
   - Total comment karma (sum of all comment scores)
   - Average karma per post/comment
   - Highest scoring post and comment

2. **Subreddit Activity**
   - List all unique subreddits
   - Count posts/comments per subreddit
   - Calculate percentage distribution
   - Identify top 5 most active subreddits

3. **Temporal Patterns**
   - Posts/comments per month
   - Most active day of week
   - Most active hour of day
   - Activity streak (longest consecutive days)

4. **Content Analysis**
   - Most used words (word cloud data)
   - Average post/comment length
   - Post type distribution (text/link/image/video)
   - Most discussed topics

5. **Engagement Metrics**
   - Total awards received
   - Total comments on user's posts
   - Engagement rate (comments/upvotes ratio)
   - Viral posts (posts with >1000 upvotes)

6. **Milestones**
   - Account age in 2025
   - Total karma milestones reached
   - Subreddit milestones (first post in new subreddit)

---

## AI Summary Generation

### OpenAI Integration

**API Endpoint**: Use GPT-4 or GPT-3.5-turbo via serverless function

**Prompt Structure:**
```
You are analyzing a Reddit user's activity for their 2025 "Reddit Wrapped" summary. Based on the data provided, create a personalized, engaging summary.

User Data:
- Username: {username}
- Account age: {account_age}
- Total karma: {total_karma}
- Top subreddits: {top_subreddits}
- Most active time: {most_active_time}
- Top posts: {top_posts_summary}
- Activity patterns: {activity_patterns}

Generate a summary covering:
1. Personality Analysis: What does their activity say about their interests and personality? (2-3 sentences)
2. Year Highlights: What were their biggest moments? (3-4 bullet points)
3. Writing Style: How do they communicate on Reddit? (1-2 sentences)
4. Predictions for 2026: What might they explore next year? (2-3 sentences)
5. Subreddit Recommendations: Suggest 3-5 subreddits they might enjoy based on their activity (with brief explanations)

Keep the tone fun, engaging, and slightly playful like Spotify Wrapped.
```

**Implementation Notes:**
- Make API call from serverless function (keep API key secure)
- Parse response and structure for display
- Handle errors gracefully (fallback to basic summary if AI fails)

---

## UI/UX Design - Spotify Wrapped Style

### Visual Design System

**Color Palette** (Reddit-inspired):
- Primary: `#FF4500` (Reddit Orange)
- Secondary: `#0079D3` (Reddit Blue)
- Background: `#1A1A1B` (Dark mode primary)
- Cards: `#272729` (Dark mode secondary)
- Text: `#D7DADC` (Light gray)
- Accents: `#46D160` (Success green), `#EA0027` (Alert red)

**Typography:**
- Headers: Bold, large (32-48px)
- Stats: Extra bold, huge (64-96px)
- Body: Regular, readable (16-18px)
- Font: Inter or Reddit's IBMPlex Sans

### Page Flow (Card-based Story)

**Card Sequence:**

1. **Welcome Card**
   - "Your 2025 Reddit Wrapped is ready!"
   - Username display
   - "Tap to continue" button

2. **Account Overview Card**
   - "You've been on Reddit for {X} years"
   - Account creation date
   - Cake day animation

3. **Karma Summary Card**
   - Big number: Total karma earned in 2025
   - Breakdown: Post vs Comment karma (visual split)
   - "You're in the top X% of active users"

4. **Top Subreddits Card**
   - "Your top 5 communities"
   - List with percentage bars
   - Community icons if available

5. **Activity Patterns Card**
   - "You were most active on {day} at {time}"
   - Visual graph showing activity by hour/day
   - "Night owl" or "Early bird" badge

6. **Top Content Card**
   - "Your most legendary post"
   - Post title + upvotes
   - Screenshot-style visual

7. **Engagement Card**
   - "Your posts sparked {X} discussions"
   - Total comments received
   - Awards received count

8. **Word Cloud Card**
   - "You talked a lot about..."
   - Visual word cloud of most used words
   - Top 10 words list

9. **Milestones Card**
   - "Achievements unlocked"
   - List of milestones with icons
   - Gamification elements

10. **AI Personality Summary Card**
    - "Here's what we learned about you"
    - AI-generated personality analysis
    - Fun, engaging tone

11. **Predictions Card**
    - "What 2026 holds for you"
    - AI predictions
    - Recommended subreddits

12. **Share Card**
    - "Share your Reddit Wrapped"
    - Download as image button
    - "Try another username" button

### Animation Strategy

**Use Framer Motion for:**
- Card transitions (slide in from right)
- Number count-ups (karma, posts, etc.)
- Progress bars (smooth fill animations)
- Fade-ins for text content
- Confetti for milestones
- Hover effects on interactive elements

**Timing:**
- Each card auto-advances after 3-4 seconds OR user taps/clicks
- Animations should be snappy (0.3-0.5s duration)
- Stagger child elements (0.1s delay between items)

---

## Implementation Phases

### Phase 1: Foundation (Core Structure)
**Files to create:**
- `/pages/index.tsx` - Landing page with username input
- `/pages/callback.tsx` - OAuth callback handler
- `/pages/wrapped/[username].tsx` - Main wrapped experience
- `/api/reddit/auth.ts` - OAuth initiation
- `/api/reddit/token.ts` - Token exchange
- `/api/reddit/user-data.ts` - Fetch user data
- `/components/Card.tsx` - Reusable card component
- `/lib/reddit.ts` - Reddit API helper functions
- `/lib/types.ts` - TypeScript interfaces

**Goals:**
- Set up React project with TypeScript
- Implement Reddit OAuth flow
- Create basic API routes
- Build landing page with username input

### Phase 2: Data Collection & Processing
**Files to create:**
- `/lib/data-processor.ts` - Process raw Reddit data
- `/lib/metrics-calculator.ts` - Calculate all metrics
- `/api/reddit/fetch-all.ts` - Paginated data fetching
- `/hooks/useRedditData.ts` - Custom hook for data fetching

**Goals:**
- Implement all Reddit API calls with pagination
- Process and aggregate data into structured format
- Calculate all metrics (karma, subreddits, patterns, etc.)
- Handle rate limiting gracefully

### Phase 3: Visualizations & Cards
**Files to create:**
- `/components/cards/WelcomeCard.tsx`
- `/components/cards/AccountCard.tsx`
- `/components/cards/KarmaCard.tsx`
- `/components/cards/SubredditsCard.tsx`
- `/components/cards/ActivityCard.tsx`
- `/components/cards/TopContentCard.tsx`
- `/components/cards/EngagementCard.tsx`
- `/components/cards/WordCloudCard.tsx`
- `/components/cards/MilestonesCard.tsx`
- `/components/CardNavigator.tsx` - Handle card progression
- `/components/charts/ActivityGraph.tsx`
- `/components/charts/SubredditBars.tsx`
- `/components/charts/WordCloud.tsx`

**Goals:**
- Build all card components with Spotify Wrapped aesthetic
- Implement animations with Framer Motion
- Create data visualizations (charts, graphs)
- Add navigation between cards (tap/click to advance)

### Phase 4: AI Integration
**Files to create:**
- `/api/ai/generate-summary.ts` - OpenAI API call
- `/lib/prompt-builder.ts` - Construct AI prompts
- `/components/cards/AIPersonalityCard.tsx`
- `/components/cards/PredictionsCard.tsx`

**Goals:**
- Integrate OpenAI API
- Generate personalized summaries
- Display AI insights in engaging cards
- Handle AI errors gracefully

### Phase 5: Sharing & Polish
**Files to create:**
- `/components/cards/ShareCard.tsx`
- `/lib/image-generator.ts` - Generate shareable images
- `/components/ShareButtons.tsx`
- `/lib/analytics.ts` - Track usage (optional)

**Goals:**
- Implement share functionality
- Generate downloadable images
- Add social media sharing
- Polish animations and transitions
- Optimize performance
- Add loading states and error handling

---

## Technical Implementation Details

### Environment Variables
```
# .env.local
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_REDIRECT_URI=http://localhost:3000/callback
OPENAI_API_KEY=your_openai_key
```

### Key Data Structures

**User Data Interface:**
```typescript
interface RedditWrappedData {
  username: string;
  accountCreated: Date;
  year: number;
  
  karma: {
    total: number;
    post: number;
    comment: number;
    averagePerPost: number;
    averagePerComment: number;
  };
  
  topContent: {
    topPost: Post;
    topComment: Comment;
    viralPosts: Post[];
  };
  
  subreddits: {
    name: string;
    postCount: number;
    commentCount: number;
    percentage: number;
  }[];
  
  activity: {
    totalPosts: number;
    totalComments: number;
    postsByMonth: { month: string; count: number }[];
    mostActiveDay: string;
    mostActiveHour: number;
    longestStreak: number;
  };
  
  engagement: {
    totalAwards: number;
    totalCommentsReceived: number;
    engagementRate: number;
  };
  
  content: {
    mostUsedWords: { word: string; count: number }[];
    averagePostLength: number;
    averageCommentLength: number;
    postTypeDistribution: { type: string; count: number }[];
  };
  
  milestones: {
    description: string;
    achieved: boolean;
    date?: Date;
  }[];
  
  aiSummary?: {
    personality: string;
    highlights: string[];
    writingStyle: string;
    predictions: string;
    recommendations: {
      subreddit: string;
      reason: string;
    }[];
  };
}
```

### Reddit API Rate Limiting
**Implementation strategy:**
- Add delays between paginated requests (1 second)
- Implement retry logic with exponential backoff
- Show progress indicator during data fetching
- Cache results temporarily to avoid re-fetching

### Error Handling
**Scenarios to handle:**
1. User not found → Show friendly error message
2. Private profile → Explain data not accessible
3. No 2025 activity → Show "No data for 2025" message
4. API rate limit → Show "Please try again in a minute"
5. OAuth failure → Redirect back to login
6. AI API failure → Show basic summary without AI insights

---

## Future Enhancements (Modular Add-ons)

### Phase 6: Historical Comparison (2024, 2023)
**New features:**
- Year selector dropdown
- Side-by-side comparison view
- Growth metrics (% change year-over-year)
- Trend analysis

**Implementation:**
- Modify data fetching to accept year parameter
- Store multiple years of data
- Create comparison card components
- Add trend visualizations

### Phase 7: Subreddit-Specific Analytics
**New features:**
- Deep dive into specific subreddit activity
- Subreddit karma breakdown
- Most engaged topics within subreddit
- Subreddit community insights

**Implementation:**
- Add subreddit filter to data processor
- Create new route: `/wrapped/[username]/subreddit/[subreddit]`
- Build subreddit-specific card components
- Add navigation from main wrapped to subreddit view

### Phase 8: Shareable Image Generation
**New features:**
- Generate PNG/JPG of key cards
- Instagram story format (1080x1920)
- Twitter card format (1200x600)
- Custom branding/watermark

**Implementation:**
- Use `html-to-image` or `dom-to-image` library
- Create image templates with canvas API
- Add download functionality
- Optimize image quality and size

### Phase 9: User Comparison (vs Friends)
**New features:**
- Compare two Reddit users side-by-side
- Shared subreddits analysis
- Karma comparison
- Activity pattern comparison

**Implementation:**
- Fetch data for multiple users
- Create comparison data structure
- Build comparison card components
- Add "Compare with another user" flow

---

## Testing Strategy

### Manual Testing Checklist
- [ ] OAuth flow works (login and callback)
- [ ] Data fetching handles pagination correctly
- [ ] All metrics calculate accurately
- [ ] Cards display correctly on mobile and desktop
- [ ] Animations are smooth and performant
- [ ] AI summary generates successfully
- [ ] Error states display properly
- [ ] Share functionality works
- [ ] Year filtering works (2025 only)

### Test Users
Test with these types of Reddit accounts:
1. Very active user (lots of data)
2. Inactive user (little/no 2025 data)
3. Moderator (unusual activity patterns)
4. New account (created in 2025)

---

## Deployment Checklist

### Pre-deployment
- [ ] Set up Reddit App with production redirect URI
- [ ] Add all environment variables to hosting platform
- [ ] Test OAuth flow on production domain
- [ ] Optimize bundle size
- [ ] Add meta tags for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure rate limiting on API routes

### Go-live
- [ ] Deploy to Vercel/Netlify
- [ ] Update Reddit App redirect URI to production URL
- [ ] Test full flow on production
- [ ] Monitor error logs
- [ ] Share with initial beta testers

---

## Project Prompt for AI Assistant

**Use this prompt when starting development:**

"I need you to build a 'Reddit Wrapped' web application following this complete specification. 

**Core Requirements:**
- React + TypeScript + Tailwind CSS
- Serverless architecture (Vercel/Netlify)
- Reddit OAuth 2.0 authentication
- Fetch and analyze user's 2025 Reddit activity
- Display insights in Spotify Wrapped-style card interface
- Use OpenAI to generate personalized AI summaries

**Start with Phase 1** (Foundation) and create:
1. Project setup with all necessary dependencies
2. Reddit OAuth flow (login → callback → token exchange)
3. Basic landing page with username input
4. API routes for Reddit authentication

Make sure to:
- Use environment variables for all secrets
- Handle errors gracefully with user-friendly messages
- Add loading states for all async operations
- Follow the data structures defined in the plan
- Use Framer Motion for all animations

Once Phase 1 is complete and tested, we'll move to Phase 2 (Data Collection).

Here's the full technical specification: [attach this document]"

---

## Success Metrics

**MVP Success Criteria:**
- User can log in with Reddit
- App fetches and displays basic 2025 stats (karma, top subreddits)
- At least 5 animated cards display correctly
- AI summary generates successfully
- Works on mobile and desktop

**Full Launch Success:**
- All 12 card types implemented and animated
- AI summary includes personality, highlights, and recommendations
- Share functionality works
- App handles errors gracefully
- Page load time < 3 seconds
- Positive user feedback

---

## Budget Considerations

### Free Tier Limits
- **Reddit API**: Free, 100 requests/min
- **OpenAI API**: Pay-per-use (~$0.002 per summary with GPT-3.5-turbo)
- **Hosting**: Free on Vercel/Netlify (generous free tiers)

### Cost Optimization
- Cache Reddit data temporarily (avoid re-fetching)
- Use GPT-3.5-turbo instead of GPT-4 (10x cheaper)
- Implement request throttling
- Consider offering AI summary as optional premium feature if costs scale

**Estimated cost for 1000 users:** ~$2-5 (mostly OpenAI API calls)

---

## Resources & Documentation

### Essential Links
- Reddit API Docs: https://www.reddit.com/dev/api
- Reddit OAuth Guide: https://github.com/reddit-archive/reddit/wiki/OAuth2
- OpenAI API Docs: https://platform.openai.com/docs
- Framer Motion: https://www.framer.com/motion
- React Docs: https://react.dev

### Helpful Libraries
- `snoowrap` - Reddit API wrapper for Node.js (optional, makes API calls easier)
- `recharts` or `chart.js` - For data visualizations
- `react-wordcloud` - For word cloud visualization
- `html-to-image` - For generating shareable images
- `date-fns` - For date manipulation
- `axios` - For API calls

---

## Final Notes

This plan is designed to be:
- **Comprehensive**: Everything needed to build the full MVP
- **Modular**: Easy to extend with future features
- **Scalable**: Architecture supports growth
- **AI-friendly**: Clear enough for AI coding assistants to implement

Hand this entire document to your AI assistant (Lovable, Codex, ChatGPT) and work through each phase sequentially. Once a phase is complete and tested, move to the next.

Good luck building Reddit Wrapped! 🚀