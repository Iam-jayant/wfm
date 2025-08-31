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
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
//# sourceMappingURL=index.d.ts.map