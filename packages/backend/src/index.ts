import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Worker, Job, LocationUpdate, ApiResponse, User, GeofenceDefinition, GeofenceEvent, JobSite, Coordinates, TimesheetEntry, ExpenseEntry, DailyTimesheet, Notification } from '@workforce-navigator/shared';
import { blockchainService } from './services/blockchain';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for MVP
const users: User[] = [
  {
    id: '1',
    email: 'manager@company.com',
    role: 'manager',
    organizationId: 'org1',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'worker1@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'worker2@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
  }
];

const workers: Worker[] = [
  {
    id: '2',
    email: 'worker1@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '+91-9876543210',
    employeeId: 'EMP001',
    teamId: 'team1',
    currentStatus: 'available',
    currentLocation: { latitude: 22.7196, longitude: 75.8577 } // Indore - Rajwada
  },
  {
    id: '3',
    email: 'worker2@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '+91-9876543211',
    employeeId: 'EMP002',
    teamId: 'team1',
    currentStatus: 'busy',
    currentLocation: { latitude: 22.7532, longitude: 75.8937 } // Indore - Vijay Nagar
  },
  {
    id: '4',
    email: 'worker3@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
    firstName: 'Amit',
    lastName: 'Patel',
    phone: '+91-9876543212',
    employeeId: 'EMP003',
    teamId: 'team2',
    currentStatus: 'available',
    currentLocation: { latitude: 22.6708, longitude: 75.8718 } // Indore - Palasia
  },
  {
    id: '5',
    email: 'worker4@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
    firstName: 'Sunita',
    lastName: 'Verma',
    phone: '+91-9876543213',
    employeeId: 'EMP004',
    teamId: 'team2',
    currentStatus: 'offline',
    currentLocation: { latitude: 22.7279, longitude: 75.8723 } // Indore - Sapna Sangeeta
  },
  {
    id: '6',
    email: 'worker5@company.com',
    role: 'field_worker',
    organizationId: 'org1',
    createdAt: new Date(),
    firstName: 'Vikash',
    lastName: 'Singh',
    phone: '+91-9876543214',
    employeeId: 'EMP005',
    teamId: 'team1',
    currentStatus: 'available',
    currentLocation: { latitude: 22.6893, longitude: 75.8570 } // Indore - Bhawar Kuan
  }
];

const jobs: Job[] = [
  {
    id: '1',
    title: 'Electrical Maintenance',
    description: 'Check and repair electrical connections',
    location: { latitude: 28.6129, longitude: 77.2295 },
    status: 'pending',
    priority: 'medium',
    estimatedDuration: 120,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Power Line Inspection',
    description: 'Routine inspection of power lines',
    location: { latitude: 28.7041, longitude: 77.1025 },
    status: 'pending',
    priority: 'high',
    estimatedDuration: 180,
    createdAt: new Date()
  }
];

const locationHistory: LocationUpdate[] = [];

// Job sites with geofences for MVP
const jobSites: JobSite[] = [
  {
    id: 'site1',
    name: 'Delhi Power Station',
    address: 'Connaught Place, New Delhi',
    coordinates: { latitude: 28.6129, longitude: 77.2295 },
    geofence: {
      id: 'geo1',
      name: 'Delhi Power Station Geofence',
      center: { latitude: 28.6129, longitude: 77.2295 },
      radius: 100, // 100 meters
      jobSiteId: 'site1'
    },
    organizationId: 'org1'
  },
  {
    id: 'site2',
    name: 'Gurgaon Substation',
    address: 'Sector 29, Gurgaon',
    coordinates: { latitude: 28.7041, longitude: 77.1025 },
    geofence: {
      id: 'geo2',
      name: 'Gurgaon Substation Geofence',
      center: { latitude: 28.7041, longitude: 77.1025 },
      radius: 150, // 150 meters
      jobSiteId: 'site2'
    },
    organizationId: 'org1'
  }
];

const geofenceEvents: GeofenceEvent[] = [];
const activeCheckIns: Map<string, { jobSiteId: string; checkInTime: Date; location: Coordinates }> = new Map();
const timesheetEntries: TimesheetEntry[] = [];
const expenseEntries: ExpenseEntry[] = [];
const notifications: Notification[] = [];

// Hardcoded passwords for MVP (in production, these would be hashed)
const userCredentials: Record<string, string> = {
  'manager@company.com': 'manager123',
  'worker1@company.com': 'worker123',
  'worker2@company.com': 'worker123'
};

// Notification helper function
const createNotification = (
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any
): Notification => {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
    data
  };
  notifications.push(notification);
  return notification;
};

// Utility functions for geofencing
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const checkGeofenceEvents = (workerId: string, location: Coordinates): GeofenceEvent[] => {
  const events: GeofenceEvent[] = [];
  const currentTime = new Date();
  
  for (const jobSite of jobSites) {
    const distance = calculateDistance(
      location.latitude, location.longitude,
      jobSite.geofence.center.latitude, jobSite.geofence.center.longitude
    );
    
    const isInside = distance <= jobSite.geofence.radius;
    const wasInside = activeCheckIns.has(`${workerId}-${jobSite.id}`);
    
    if (isInside && !wasInside) {
      // Worker entered geofence - auto check-in
      const event: GeofenceEvent = {
        type: 'enter',
        geofenceId: jobSite.geofence.id,
        workerId,
        timestamp: currentTime,
        location
      };
      events.push(event);
      
      // Store active check-in
      activeCheckIns.set(`${workerId}-${jobSite.id}`, {
        jobSiteId: jobSite.id,
        checkInTime: currentTime,
        location
      });
      
      // Create timesheet entry
      const timesheetEntry: TimesheetEntry = {
        id: `ts_${Date.now()}_${workerId}`,
        workerId,
        jobSiteId: jobSite.id,
        checkInTime: currentTime,
        checkInLocation: location,
        status: 'active'
      };
      timesheetEntries.push(timesheetEntry);
      
    } else if (!isInside && wasInside) {
      // Worker exited geofence - auto check-out
      const event: GeofenceEvent = {
        type: 'exit',
        geofenceId: jobSite.geofence.id,
        workerId,
        timestamp: currentTime,
        location
      };
      events.push(event);
      
      // Update timesheet entry with check-out
      const activeEntry = timesheetEntries.find(
        entry => entry.workerId === workerId && 
                entry.jobSiteId === jobSite.id && 
                entry.status === 'active'
      );
      
      if (activeEntry) {
        activeEntry.checkOutTime = currentTime;
        activeEntry.checkOutLocation = location;
        activeEntry.totalHours = (currentTime.getTime() - activeEntry.checkInTime.getTime()) / (1000 * 60 * 60);
        activeEntry.status = 'completed';
        
        // Calculate distance traveled for expense calculation
        const distance = calculateDistance(
          activeEntry.checkInLocation.latitude,
          activeEntry.checkInLocation.longitude,
          location.latitude,
          location.longitude
        );
        
        // Create expense entry for mileage (assuming $0.50 per km)
        if (distance > 100) { // Only create expense if distance > 100m
          const expenseEntry: ExpenseEntry = {
            id: `exp_${Date.now()}_${workerId}`,
            workerId,
            date: currentTime,
            type: 'mileage',
            amount: Math.round((distance / 1000) * 0.50 * 100) / 100, // $0.50 per km, rounded to 2 decimals
            description: `Travel between job sites - ${(distance / 1000).toFixed(2)} km`,
            distance: distance,
            status: 'pending'
          };
          expenseEntries.push(expenseEntry);
        }
      }
      
      // Remove active check-in
      activeCheckIns.delete(`${workerId}-${jobSite.id}`);
    }
  }
  
  return events;
};

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'AUTH_001', message: 'Access token required' } });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, error: { code: 'AUTH_001', message: 'Invalid token' } });
    }
    req.user = user;
    next();
  });
};

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { code: 'AUTH_001', message: 'Email and password required' }
    });
  }

  const user = users.find(u => u.email === email);
  const validPassword = userCredentials[email] === password;

  if (!user || !validPassword) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_001', message: 'Invalid credentials' }
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    }
  });
});

// Worker endpoints
app.get('/api/workers', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: workers
  });
});

app.get('/api/workers/:id', authenticateToken, (req, res) => {
  const worker = workers.find(w => w.id === req.params.id);
  
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  res.json({
    success: true,
    data: worker
  });
});

app.put('/api/workers/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const worker = workers.find(w => w.id === req.params.id);
  
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  worker.currentStatus = status;
  
  res.json({
    success: true,
    data: worker
  });
});

// Job endpoints
app.get('/api/jobs', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: jobs
  });
});

app.post('/api/jobs', authenticateToken, (req, res) => {
  const { title, description, location, priority, estimatedDuration, scheduledFor } = req.body;
  
  const newJob: Job = {
    id: (jobs.length + 1).toString(),
    title,
    description,
    location,
    status: 'pending',
    priority: priority || 'medium',
    estimatedDuration: estimatedDuration || 60,
    createdAt: new Date(),
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
  };

  jobs.push(newJob);
  
  res.status(201).json({
    success: true,
    data: newJob
  });
});

// Get optimal workers for a job based on proximity and availability
app.get('/api/jobs/:id/optimal-workers', authenticateToken, (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { code: 'JOB_001', message: 'Job not found' }
    });
  }

  const maxDistance = parseFloat(req.query.maxDistance as string) || 50000; // 50km default
  const limit = parseInt(req.query.limit as string) || 3; // Top 3 workers by default

  const optimalWorkers = workers
    .filter(w => w.currentLocation && w.currentStatus === 'available')
    .map(w => ({
      ...w,
      distance: calculateDistance(
        job.location.latitude, job.location.longitude,
        w.currentLocation!.latitude, w.currentLocation!.longitude
      ),
      estimatedTravelTime: Math.round(calculateDistance(
        job.location.latitude, job.location.longitude,
        w.currentLocation!.latitude, w.currentLocation!.longitude
      ) / 1000 * 2) // Rough estimate: 2 minutes per km
    }))
    .filter(w => w.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  res.json({
    success: true,
    data: {
      jobId: job.id,
      jobLocation: job.location,
      optimalWorkers,
      totalAvailable: optimalWorkers.length
    }
  });
});

app.put('/api/jobs/:id/assign', authenticateToken, async (req, res) => {
  const { workerId } = req.body;
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { code: 'JOB_001', message: 'Job not found' }
    });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  // Check if worker is available
  if (worker.currentStatus !== 'available') {
    return res.status(400).json({
      success: false,
      error: { code: 'JOB_002', message: 'Worker is not available for assignment' }
    });
  }

  // Check if job is already assigned
  if (job.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: { code: 'JOB_003', message: 'Job is already assigned or completed' }
    });
  }

  job.assignedWorkerId = workerId;
  job.status = 'assigned';
  worker.currentStatus = 'busy';
  
  // Create notification for worker
  const notification = createNotification(
    workerId,
    'job_assignment',
    'New Job Assignment',
    `You have been assigned to: ${job.title}`,
    { jobId: job.id, jobTitle: job.title, location: job.location }
  );
  
  // Log job assignment to blockchain
  try {
    const blockchainResult = await blockchainService.logJobAssignment(workerId, job.id);
    console.log('Job assignment logged to blockchain:', blockchainResult);
    
    res.json({
      success: true,
      data: {
        job,
        worker: {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          currentLocation: worker.currentLocation
        },
        blockchainHash: blockchainResult.transactionHash,
        assignedAt: new Date(),
        notification
      }
    });
  } catch (error) {
    console.error('Failed to log job assignment to blockchain:', error);
    res.status(500).json({
      success: false,
      error: { code: 'BLOCKCHAIN_001', message: 'Failed to log job assignment to blockchain' }
    });
  }
});

// Reassign job to a different worker
app.put('/api/jobs/:id/reassign', authenticateToken, async (req, res) => {
  const { workerId } = req.body;
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { code: 'JOB_001', message: 'Job not found' }
    });
  }

  const newWorker = workers.find(w => w.id === workerId);
  if (!newWorker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  // Check if new worker is available
  if (newWorker.currentStatus !== 'available') {
    return res.status(400).json({
      success: false,
      error: { code: 'JOB_002', message: 'Worker is not available for assignment' }
    });
  }

  // Free up the previously assigned worker
  if (job.assignedWorkerId) {
    const previousWorker = workers.find(w => w.id === job.assignedWorkerId);
    if (previousWorker) {
      previousWorker.currentStatus = 'available';
    }
  }

  job.assignedWorkerId = workerId;
  job.status = 'assigned';
  newWorker.currentStatus = 'busy';
  
  // Log job reassignment to blockchain
  try {
    const blockchainResult = await blockchainService.logJobAssignment(workerId, job.id);
    console.log('Job reassignment logged to blockchain:', blockchainResult);
    
    res.json({
      success: true,
      data: {
        job,
        newWorker: {
          id: newWorker.id,
          firstName: newWorker.firstName,
          lastName: newWorker.lastName,
          currentLocation: newWorker.currentLocation
        },
        blockchainHash: blockchainResult.transactionHash,
        reassignedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to log job reassignment to blockchain:', error);
    res.status(500).json({
      success: false,
      error: { code: 'BLOCKCHAIN_001', message: 'Failed to log job reassignment to blockchain' }
    });
  }
});

app.put('/api/jobs/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: { code: 'JOB_001', message: 'Job not found' }
    });
  }

  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    'pending': ['assigned'],
    'assigned': ['in_progress', 'pending'], // Can go back to pending if unassigned
    'in_progress': ['completed'],
    'completed': [] // Final state
  };

  if (!validTransitions[job.status]?.includes(status)) {
    return res.status(400).json({
      success: false,
      error: { 
        code: 'JOB_004', 
        message: `Invalid status transition from ${job.status} to ${status}` 
      }
    });
  }

  const previousStatus = job.status;
  job.status = status;
  
  // Handle worker status updates based on job status changes
  if (job.assignedWorkerId) {
    const worker = workers.find(w => w.id === job.assignedWorkerId);
    if (worker) {
      switch (status) {
        case 'in_progress':
          worker.currentStatus = 'busy';
          break;
        case 'completed':
          worker.currentStatus = 'available';
          break;
        case 'pending':
          // Job was unassigned
          worker.currentStatus = 'available';
          job.assignedWorkerId = undefined;
          break;
      }
    }
  }
  
  // Log significant status changes to blockchain
  try {
    let blockchainResult;
    
    if (status === 'completed' && job.assignedWorkerId) {
      const worker = workers.find(w => w.id === job.assignedWorkerId);
      blockchainResult = await blockchainService.logJobCompletion(
        job.assignedWorkerId, 
        job.id, 
        worker?.currentLocation
      );
      console.log('Job completion logged to blockchain:', blockchainResult);
    } else if (status === 'in_progress') {
      // Log job start
      blockchainResult = await blockchainService.logJobAssignment(job.assignedWorkerId!, job.id);
      console.log('Job start logged to blockchain:', blockchainResult);
    }
    
    res.json({
      success: true,
      data: {
        job,
        previousStatus,
        blockchainHash: blockchainResult?.transactionHash,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to log job status change to blockchain:', error);
    // Continue with the operation even if blockchain logging fails
    res.json({
      success: true,
      data: {
        job,
        previousStatus,
        updatedAt: new Date(),
        blockchainError: 'Failed to log to blockchain'
      }
    });
  }
});

// Get jobs by status
app.get('/api/jobs/status/:status', authenticateToken, (req, res) => {
  const { status } = req.params;
  const filteredJobs = jobs.filter(j => j.status === status);
  
  // Enrich jobs with worker information if assigned
  const enrichedJobs = filteredJobs.map(job => {
    if (job.assignedWorkerId) {
      const worker = workers.find(w => w.id === job.assignedWorkerId);
      return {
        ...job,
        assignedWorker: worker ? {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          currentLocation: worker.currentLocation,
          currentStatus: worker.currentStatus
        } : null
      };
    }
    return job;
  });
  
  res.json({
    success: true,
    data: enrichedJobs
  });
});

// Get jobs assigned to a specific worker
app.get('/api/workers/:workerId/jobs', authenticateToken, (req, res) => {
  const { workerId } = req.params;
  const { status } = req.query;
  
  let workerJobs = jobs.filter(j => j.assignedWorkerId === workerId);
  
  if (status) {
    workerJobs = workerJobs.filter(j => j.status === status);
  }
  
  res.json({
    success: true,
    data: workerJobs
  });
});

// Location endpoints
app.post('/api/locations', authenticateToken, async (req, res) => {
  const { workerId, coordinates, accuracy } = req.body;
  
  if (!workerId || !coordinates) {
    return res.status(400).json({
      success: false,
      error: { code: 'LOCATION_001', message: 'Worker ID and coordinates required' }
    });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  const locationUpdate: LocationUpdate = {
    workerId,
    coordinates,
    timestamp: new Date(),
    accuracy: accuracy || 10
  };

  locationHistory.push(locationUpdate);
  
  // Update worker's current location
  worker.currentLocation = coordinates;
  
  // Check for geofence events and handle automatic check-in/out
  const events = checkGeofenceEvents(workerId, coordinates);
  const responseData: any = {
    locationUpdate,
    geofenceEvents: events
  };
  
  // Process geofence events
  for (const event of events) {
    geofenceEvents.push(event);
    
    try {
      if (event.type === 'enter') {
        // Auto check-in
        const jobSite = jobSites.find(js => js.geofence.id === event.geofenceId);
        if (jobSite) {
          const blockchainResult = await blockchainService.logCheckIn(workerId, coordinates, jobSite.id);
          console.log(`Auto check-in for worker ${workerId} at ${jobSite.name}:`, blockchainResult);
          
          // Update worker status
          worker.currentStatus = 'busy';
          
          responseData.autoCheckIn = {
            jobSiteId: jobSite.id,
            jobSiteName: jobSite.name,
            timestamp: event.timestamp,
            blockchainHash: blockchainResult.transactionHash
          };
          
          // Create check-in notification
          createNotification(
            workerId,
            'check_in',
            'Auto Check-In',
            `You have been automatically checked in at ${jobSite.name}`,
            { jobSiteId: jobSite.id, jobSiteName: jobSite.name, location: coordinates }
          );
        }
      } else if (event.type === 'exit') {
        // Auto check-out
        const jobSite = jobSites.find(js => js.geofence.id === event.geofenceId);
        if (jobSite) {
          const blockchainResult = await blockchainService.logCheckOut(workerId, coordinates, jobSite.id);
          console.log(`Auto check-out for worker ${workerId} from ${jobSite.name}:`, blockchainResult);
          
          // Update worker status
          worker.currentStatus = 'available';
          
          responseData.autoCheckOut = {
            jobSiteId: jobSite.id,
            jobSiteName: jobSite.name,
            timestamp: event.timestamp,
            blockchainHash: blockchainResult.transactionHash
          };
          
          // Create check-out notification
          createNotification(
            workerId,
            'check_out',
            'Auto Check-Out',
            `You have been automatically checked out from ${jobSite.name}`,
            { jobSiteId: jobSite.id, jobSiteName: jobSite.name, location: coordinates }
          );
        }
      }
    } catch (error) {
      console.error(`Failed to log ${event.type} event to blockchain:`, error);
      // Continue processing even if blockchain logging fails
    }
  }
  
  res.json({
    success: true,
    data: responseData
  });
});

app.get('/api/locations/:workerId', authenticateToken, (req, res) => {
  const workerLocations = locationHistory.filter(l => l.workerId === req.params.workerId);
  
  res.json({
    success: true,
    data: workerLocations
  });
});

// Job sites and geofence endpoints
app.get('/api/jobsites', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: jobSites
  });
});

app.post('/api/jobsites', authenticateToken, (req, res) => {
  const { name, address, coordinates, geofenceRadius } = req.body;
  
  if (!name || !address || !coordinates) {
    return res.status(400).json({
      success: false,
      error: { code: 'JOBSITE_001', message: 'Name, address, and coordinates required' }
    });
  }

  const newJobSite: JobSite = {
    id: `site${jobSites.length + 1}`,
    name,
    address,
    coordinates,
    geofence: {
      id: `geo${jobSites.length + 1}`,
      name: `${name} Geofence`,
      center: coordinates,
      radius: geofenceRadius || 100,
      jobSiteId: `site${jobSites.length + 1}`
    },
    organizationId: 'org1'
  };

  jobSites.push(newJobSite);
  
  res.status(201).json({
    success: true,
    data: newJobSite
  });
});

app.get('/api/geofence-events/:workerId', authenticateToken, (req, res) => {
  const workerEvents = geofenceEvents.filter(e => e.workerId === req.params.workerId);
  
  res.json({
    success: true,
    data: workerEvents
  });
});

app.get('/api/workers/:workerId/checkin-status', authenticateToken, (req, res) => {
  const workerId = req.params.workerId;
  const activeCheckInEntries = Array.from(activeCheckIns.entries())
    .filter(([key]) => key.startsWith(`${workerId}-`))
    .map(([key, value]) => ({
      jobSiteId: value.jobSiteId,
      checkInTime: value.checkInTime,
      location: value.location,
      jobSiteName: jobSites.find(js => js.id === value.jobSiteId)?.name
    }));
  
  res.json({
    success: true,
    data: {
      workerId,
      activeCheckIns: activeCheckInEntries,
      isCheckedIn: activeCheckInEntries.length > 0
    }
  });
});

// Get workers by proximity (simple distance calculation for MVP)
app.get('/api/workers/nearby/:lat/:lng', authenticateToken, (req, res) => {
  const targetLat = parseFloat(req.params.lat);
  const targetLng = parseFloat(req.params.lng);
  const maxDistance = parseFloat(req.query.radius as string) || 10000; // meters (default 10km)

  const nearbyWorkers = workers
    .filter(w => w.currentLocation && w.currentStatus === 'available')
    .map(w => ({
      ...w,
      distance: calculateDistance(
        targetLat, targetLng,
        w.currentLocation!.latitude, w.currentLocation!.longitude
      )
    }))
    .filter(w => w.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    data: nearbyWorkers
  });
});

// Check-in endpoint with blockchain logging
app.post('/api/checkin', authenticateToken, async (req, res) => {
  const { workerId, location, jobId } = req.body;
  
  if (!workerId || !location) {
    return res.status(400).json({
      success: false,
      error: { code: 'CHECKIN_001', message: 'Worker ID and location required' }
    });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  // Update worker location and status
  worker.currentLocation = location;
  worker.currentStatus = 'busy';

  // Log check-in to blockchain
  try {
    const blockchainResult = await blockchainService.logCheckIn(workerId, location, jobId);
    console.log('Check-in logged to blockchain:', blockchainResult);
    
    res.json({
      success: true,
      data: {
        workerId,
        location,
        timestamp: new Date(),
        blockchainHash: blockchainResult.transactionHash
      }
    });
  } catch (error) {
    console.error('Failed to log check-in to blockchain:', error);
    res.status(500).json({
      success: false,
      error: { code: 'BLOCKCHAIN_001', message: 'Failed to log check-in to blockchain' }
    });
  }
});

// Check-out endpoint with blockchain logging
app.post('/api/checkout', authenticateToken, async (req, res) => {
  const { workerId, location, jobId } = req.body;
  
  if (!workerId || !location) {
    return res.status(400).json({
      success: false,
      error: { code: 'CHECKOUT_001', message: 'Worker ID and location required' }
    });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({
      success: false,
      error: { code: 'WORKER_001', message: 'Worker not found' }
    });
  }

  // Update worker location and status
  worker.currentLocation = location;
  worker.currentStatus = 'available';

  // Log check-out to blockchain
  try {
    const blockchainResult = await blockchainService.logCheckOut(workerId, location, jobId);
    console.log('Check-out logged to blockchain:', blockchainResult);
    
    res.json({
      success: true,
      data: {
        workerId,
        location,
        timestamp: new Date(),
        blockchainHash: blockchainResult.transactionHash
      }
    });
  } catch (error) {
    console.error('Failed to log check-out to blockchain:', error);
    res.status(500).json({
      success: false,
      error: { code: 'BLOCKCHAIN_001', message: 'Failed to log check-out to blockchain' }
    });
  }
});

// Timesheet endpoints
app.get('/api/timesheets/:workerId', authenticateToken, (req, res) => {
  const { workerId } = req.params;
  const { date } = req.query;
  
  let workerEntries = timesheetEntries.filter(entry => entry.workerId === workerId);
  
  if (date) {
    const targetDate = new Date(date as string);
    workerEntries = workerEntries.filter(entry => {
      const entryDate = new Date(entry.checkInTime);
      return entryDate.toDateString() === targetDate.toDateString();
    });
  }
  
  res.json({
    success: true,
    data: workerEntries
  });
});

app.get('/api/timesheets/daily/:workerId/:date', authenticateToken, (req, res) => {
  const { workerId, date } = req.params;
  
  const targetDate = new Date(date);
  const entries = timesheetEntries.filter(entry => {
    const entryDate = new Date(entry.checkInTime);
    return entry.workerId === workerId && 
           entryDate.toDateString() === targetDate.toDateString();
  });
  
  const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  
  const dayExpenses = expenseEntries.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expense.workerId === workerId && 
           expenseDate.toDateString() === targetDate.toDateString();
  });
  
  const totalDistance = dayExpenses
    .filter(exp => exp.type === 'mileage')
    .reduce((sum, exp) => sum + (exp.distance || 0), 0);
    
  const totalExpenses = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const dailyTimesheet: DailyTimesheet = {
    workerId,
    date: date,
    entries,
    totalHours: Math.round(totalHours * 100) / 100,
    totalDistance: Math.round(totalDistance / 1000 * 100) / 100, // Convert to km
    totalExpenses: Math.round(totalExpenses * 100) / 100
  };
  
  res.json({
    success: true,
    data: dailyTimesheet
  });
});

app.get('/api/timesheets/summary', authenticateToken, (req, res) => {
  const { startDate, endDate } = req.query;
  
  let filteredEntries = timesheetEntries;
  
  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    filteredEntries = timesheetEntries.filter(entry => {
      const entryDate = new Date(entry.checkInTime);
      return entryDate >= start && entryDate <= end;
    });
  }
  
  // Group by worker and date
  const summary = filteredEntries.reduce((acc, entry) => {
    const dateKey = new Date(entry.checkInTime).toISOString().split('T')[0];
    const key = `${entry.workerId}-${dateKey}`;
    
    if (!acc[key]) {
      const worker = workers.find(w => w.id === entry.workerId);
      acc[key] = {
        workerId: entry.workerId,
        workerName: worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown',
        date: dateKey,
        entries: [],
        totalHours: 0
      };
    }
    
    acc[key].entries.push(entry);
    acc[key].totalHours += entry.totalHours || 0;
    
    return acc;
  }, {} as Record<string, any>);
  
  const summaryArray = Object.values(summary).map((item: any) => ({
    ...item,
    totalHours: Math.round(item.totalHours * 100) / 100
  }));
  
  res.json({
    success: true,
    data: summaryArray
  });
});

// Expense endpoints
app.get('/api/expenses/:workerId', authenticateToken, (req, res) => {
  const { workerId } = req.params;
  const { date, status } = req.query;
  
  let workerExpenses = expenseEntries.filter(expense => expense.workerId === workerId);
  
  if (date) {
    const targetDate = new Date(date as string);
    workerExpenses = workerExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.toDateString() === targetDate.toDateString();
    });
  }
  
  if (status) {
    workerExpenses = workerExpenses.filter(expense => expense.status === status);
  }
  
  res.json({
    success: true,
    data: workerExpenses
  });
});

app.put('/api/expenses/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const expense = expenseEntries.find(exp => exp.id === id);
  
  if (!expense) {
    return res.status(404).json({
      success: false,
      error: { code: 'EXPENSE_001', message: 'Expense not found' }
    });
  }
  
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: { code: 'EXPENSE_002', message: 'Invalid status' }
    });
  }
  
  expense.status = status;
  
  res.json({
    success: true,
    data: expense
  });
});

// Notification endpoints
app.get('/api/notifications/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const { unreadOnly } = req.query;
  
  let userNotifications = notifications.filter(n => n.userId === userId);
  
  if (unreadOnly === 'true') {
    userNotifications = userNotifications.filter(n => !n.read);
  }
  
  // Sort by timestamp, newest first
  userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  res.json({
    success: true,
    data: userNotifications
  });
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOTIFICATION_001', message: 'Notification not found' }
    });
  }
  
  notification.read = true;
  
  res.json({
    success: true,
    data: notification
  });
});

app.put('/api/notifications/:userId/mark-all-read', authenticateToken, (req, res) => {
  const { userId } = req.params;
  
  const userNotifications = notifications.filter(n => n.userId === userId && !n.read);
  
  userNotifications.forEach(n => n.read = true);
  
  res.json({
    success: true,
    data: { markedCount: userNotifications.length }
  });
});

app.get('/api/notifications/:userId/unread-count', authenticateToken, (req, res) => {
  const { userId } = req.params;
  
  const unreadCount = notifications.filter(n => n.userId === userId && !n.read).length;
  
  res.json({
    success: true,
    data: { count: unreadCount }
  });
});

// Blockchain status endpoint
app.get('/api/blockchain/status', authenticateToken, (req, res) => {
  const status = blockchainService.getConnectionStatus();
  res.json({
    success: true,
    data: status
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`WorkForce Navigator Backend running on port ${PORT}`);
});

export default app;
