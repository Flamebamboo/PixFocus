# PixFocus

[Testflight link](https://testflight.apple.com/join/CCvp6EAS)
[Youtube demo](https://youtu.be/MSg5Y0IhBLo)

Timeblock/Pomodoro timer unlike any other in the consumer market. The style is heavily leaned towards pixel art with neo-brutalism theme, making it a gamified experience but not distracting enough for your focus sessions. This app would compete with other amazing well known focus apps such as StudyBunny, Forest and FocusPomo. However, PixFocus stands out by being entirely free & ad free while offering premium features that are typically locked behind paywalls in similar apps. One of the gamified elements in the app is users are able to unlock appealing pixel art visual timers by earning coins, these coins are earned through focus sessions, making users more motivate to complete their task and use the timer that PixFocus offers. Statistic, users are able to analyse their sessions through the stats screen with complex data queries in the backend, users are able to sort their stats by day/week/month/year and see their results with a pie chart. The settings for both timeblock and pomodoro also contains full customisation, for timeblock users are able to choose the duration from 5 - 120 minutes, and pomodoro has full customisation such as cycles, short rest duration, focus duration & long rest duration.

## Core Features

- **Pomodoro**:
- **Timeblock**:
- **Statistic**:
- **ItemShops**:

## Incoming Features

TO-DO for FEB - MAR

- [x] Theme system for item shops
- [ ] Dynamic Island with SwiftUI
- [ ] Leaderboard System
- [ ] Referral System

##Known Bugs/Improvments

- [x] Exceeded the selected duration if the user returns from background state ~ make sure to handle logic in cases where Date.now() is not applicable. Make sure that we cap the amount to selected duration every session to prevent this issue too

- Seperation of concern, maybe we can add additional attributes to distinguish between pomodoro sessions and regular focus timer

- Onboarding themes

## Take a peak

![Onboarding](/Mockups/mockup1.png)
![Onboarding](/Mockups/mockup2.png)
