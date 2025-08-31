// Shared types and interfaces for WorkForce Navigator

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  role: 'manager' | 'field_worker' | 'admin';
  organizationId: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Worker extends User {
  firstName: string;
  lastName: string;
  phone: string;
  employeeId: string;
  teamId: string;
  currentStatus: 'available' | 'busy' | 'offline';
  currentLocation?: Coordinates;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: Coordinates;
  assignedWorkerId?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  createdAt: Date;
  scheduledFor?: Date;
}

export interface GeofenceDefinition {
  id: string;
  name: string;
  center: Coordinates;
  radius: number;
  jobSiteId: string;
}

export interface LocationUpdate {
  workerId: string;
  coordinates: Coordinates;
  timestamp: Date;
  accuracy: number;
}

export interface TimesheetEntry {
  id: string;
  workerId: string;
  jobSiteId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  checkInLocation: Coordinates;
  checkOutLocation?: Coordinates;
  totalHours?: number;
  status: 'active' | 'completed' | 'flagged';
}

export interface GeofenceEvent {
  type: 'enter' | 'exit';
  geofenceId: string;
  workerId: string;
  timestamp: Date;
  location: Coordinates;
}

export interface JobSite {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  geofence: GeofenceDefinition;
  organizationId: string;
}

export interface ExpenseEntry {
  id: string;
  workerId: string;
  date: Date;
  type: 'mileage' | 'meal' | 'accommodation' | 'other';
  amount: number;
  description: string;
  distance?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DailyTimesheet {
  workerId: string;
  date: string; // YYYY-MM-DD format
  entries: TimesheetEntry[];
  totalHours: number;
  totalDistance: number;
  totalExpenses: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job_assignment' | 'check_in' | 'check_out' | 'job_completion' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
