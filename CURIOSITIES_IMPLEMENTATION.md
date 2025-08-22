# Curiosities Category Implementation

## Overview
Successfully added a new "Curiosities & Wonder" category to the SparkCircle question system. This category serves as a wildcard option with 100 playful and thought-provoking questions that blend imagination with wonder.

## Changes Made

### 1. Backend Data (`/backend/data/questions.js`)
- Added 100 new questions under the `curiosities` category
- Questions are split into two types:
  - **Questions 1-50**: Playful & imaginative scenarios (karaoke songs, superpowers, fictional universes)
  - **Questions 51-100**: Wonder & hypothetical situations (historical events, future predictions, philosophical musings)

### 2. Backend Model (`/backend/models/Session.js`)
- Updated `themes` default array to include `'curiosities'`
- Added `'curiosities'` to the `currentPlayerThemeSelection` enum

### 3. Backend Routes (`/backend/routes/sessions.js`)
- Updated default themes array to include `'curiosities'`

### 4. Frontend Components

#### ThemeSelector (`/frontend/src/components/ThemeSelector.js`)
- Added Curiosities theme with:
  - Name: "Curiosities & Wonder"
  - Emoji: 🔮
  - Explanation: "Wildcard questions that spark imagination, playful scenarios, and hypothetical adventures."
  - Special `isWildcard: true` flag
- Added wildcard styling:
  - Golden gradient background (#FEF3C7 to #FDE68A)
  - Amber border (#F59E0B)
  - Darker text color for better contrast

#### QuestionCard (`/frontend/src/components/QuestionCard.js`)
- Added emoji mapping: 🔮
- Added theme name: "Curiosities & Wonder"
- Special styling for the theme pill when displaying Curiosities questions:
  - Same golden gradient background
  - Amber border
  - Bold text weight to emphasize wildcard nature

## Visual Design
The Curiosities category stands out with a warm, golden color scheme that signals its special "wildcard" nature:
- **Primary Color**: Amber/Gold (#F59E0B)
- **Background**: Light yellow gradient (#FEF3C7 to #FDE68A)
- **Text**: Dark brown (#92400E) for contrast

## Sample Questions

### Playful & Imaginative:
- "If you could have dinner with any three people, living or dead, who would they be?"
- "What's your go-to karaoke song that never fails?"
- "If animals could talk, which species would be the rudest?"

### Wonder & Hypothetical:
- "If you could witness any event in history firsthand, what would you choose?"
- "What do you think aliens would find most bizarre about human culture?"
- "If you could add subtitles to real life, what information would you want displayed?"

## Testing
- Verified all 100 questions load correctly
- Confirmed the category appears in all 6 expected categories
- Validated that the Session model accepts the new theme in its enum

## Usage
When users select the Curiosities theme during their turn, they'll receive one of the 100 wildcard questions designed to spark creative conversations and reveal unexpected insights about team members.

## Future Enhancements
Consider adding:
- Question difficulty levels within Curiosities
- Subcategories (e.g., "Time Travel", "Superpowers", "What If")
- User-submitted Curiosities questions
- Special animations for wildcard questions
