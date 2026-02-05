# PostHog post-wizard report

The wizard has completed a deep integration of your DevEvent Next.js application with PostHog analytics. The integration includes client-side event tracking using `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a reverse proxy configuration to improve tracking reliability, and automatic exception capture for error tracking.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization
- `.env` - Environment variables for PostHog API key and host

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/components/ExploreBtn.tsx` - Added `explore_events_clicked` event tracking
- `app/components/EventCard.tsx` - Added `event_card_clicked` event tracking
- `app/components/NavBar.tsx` - Added `nav_link_clicked` event tracking

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicked the Explore Events button on the homepage to browse available events | `app/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details | `app/components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the navbar | `app/components/NavBar.tsx` |

## Event Properties

### explore_events_clicked
- `button_location`: Location of the button on the page

### event_card_clicked
- `event_title`: Title of the clicked event
- `event_slug`: URL slug of the event
- `event_location`: Location of the event
- `event_date`: Date of the event

### nav_link_clicked
- `link_name`: Name of the clicked navigation link
- `link_location`: Location of the link (navbar)

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/123125/dashboard/512498) - Main analytics dashboard

### Insights
- [User Engagement Overview](https://eu.posthog.com/project/123125/insights/3ME3QVCx) - Overview of all key user engagement events over time
- [Event Card Engagement](https://eu.posthog.com/project/123125/insights/jQwcUaPS) - Tracks how users interact with event cards by event title
- [Navigation Patterns](https://eu.posthog.com/project/123125/insights/wwIedxsb) - Tracks navigation link clicks to understand user flow
- [Explore to Event Funnel](https://eu.posthog.com/project/123125/insights/CMs9v3Sa) - Conversion funnel from Explore Events to Event Card clicks
- [Daily Unique Visitors](https://eu.posthog.com/project/123125/insights/QLrvYXeu) - Tracks unique daily visitors based on pageview events

## Getting Started

1. Run your development server: `npm run dev`
2. Visit your application and interact with it to generate events
3. View your analytics at [PostHog Dashboard](https://eu.posthog.com/project/123125/dashboard/512498)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
