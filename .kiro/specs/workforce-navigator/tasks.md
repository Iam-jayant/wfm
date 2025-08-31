# Implementation Plan - 1 Hour MVP

- [x] 1. Set up basic project structure (10 minutes)
  - Create Node.js backend with Express and React frontend
  - Initialize package.json files with essential dependencies (express, cors, ethers, react, axios)
  - Set up basic folder structure: backend/, frontend/, and shared types
  - _Requirements: Foundation for all features_

- [x] 2. Create minimal backend API (15 minutes)
- [x] 2.1 Set up Express server with basic routes
  - Create Express app with CORS and JSON middleware
  - Add basic authentication endpoint (hardcoded users for MVP)
  - Create worker, job, and location API endpoints with in-memory storage
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2.2 Add simple blockchain logging
  - Create basic Ethereum transaction logging using Ethers.js
  - Store event hashes for check-in/out and job assignments
  - Use simple wallet for demo purposes (testnet)
  - _Requirements: 8.1, 8.2_

- [x] 3. Build core location and job features (15 minutes)
- [x] 3.1 Implement location tracking
  - Create location update endpoint that stores coordinates in memory
  - Add simple geofence check using distance calculation
  - Implement automatic check-in/out based on proximity to job sites
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 3.2 Create job assignment system
  - Add job creation and assignment endpoints
  - Implement nearest worker calculation using coordinates
  - Create job status updates (pending, assigned, completed)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Build React frontend dashboard (15 minutes)
- [x] 4.1 Create basic React app with routing
  - Set up React with basic components for login, dashboard, and workers
  - Add simple authentication state management using localStorage
  - Create responsive layout with navigation menu
  - _Requirements: 1.1, 3.1_

- [x] 4.2 Add map integration and worker tracking
  - Integrate basic map library (Leaflet with OpenStreetMap)
  - Display worker locations as markers on map
  - Add real-time updates using polling every 5 seconds
  - Show job assignments and status on map with different colored markers
  - _Requirements: 1.1, 1.2, 1.3, 3.4_

- [x] 5. Implement timesheet and notifications (5 minutes)
- [x] 5.1 Add basic timesheet generation
  - Create simple timesheet calculation from check-in/out times
  - Display daily hours worked per worker in a table
  - Add basic expense calculation based on distance traveled
  - _Requirements: 5.1, 5.2, 7.1_

- [x] 5.2 Add simple notifications
  - Create basic notification system using browser alerts
  - Send notifications for job assignments and check-in/out events
  - Display notification history in dashboard sidebar
  - _Requirements: 6.1, 6.2_
