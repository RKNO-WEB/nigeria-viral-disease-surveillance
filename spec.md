# RKNO WEB

## Current State
Articles are displayed in FeaturedArticleCard, LatestIssuesSection, ArticleDetailModal (HomePage.tsx), and SearchPage cards. PDF download is already publicly accessible with no login gate.

## Requested Changes (Diff)

### Add
- Open Access badge next to every article title in all article display locations.

### Modify
- No logic changes needed; access is already open.

### Remove
- Nothing

## Implementation Plan
1. Create reusable OpenAccessBadge component (small green badge, unlock icon, "Open Access" text).
2. Insert badge adjacent to article titles in FeaturedArticleCard, latest issues list, ArticleDetailModal, and SearchPage article cards.
