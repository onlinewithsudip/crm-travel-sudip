
export enum LeadStatus {
  UNQUALIFIED = 'Unqualified',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL_SENT = 'Proposal Sent',
  DECISION_PENDING = 'Decision Pending',
  BOOKED = 'Booked',
  LOST = 'Lost'
}

export enum LeadSource {
  FACEBOOK = 'Facebook',
  WEBSITE = 'Website',
  GOOGLE = 'Google',
  SEO = 'SEO',
  MANUAL = 'Manual',
  THIRD_PARTY = 'Third Party'
}

export enum UserRole {
  SALES = 'Sales',
  RESERVATION = 'Reservation',
  OPERATION = 'Operation',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin'
}

export enum RoutingStrategy {
  ROUND_ROBIN = 'Round Robin',
  BROADCAST = 'Broadcast',
  MANUAL = 'Manual'
}

export interface AgencySettings {
  routingStrategy: RoutingStrategy;
  lastAssignedAgentIndex: number;
}

export interface FollowUp {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'WhatsApp';
  dateTime: string;
  note: string;
  isCompleted: boolean;
  isUrgent: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  hierarchyLevel: number; // 1 (Junior) to 5 (Director)
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  destination: string;
  budget: string;
  assignedAgent: string;
  assignedDepartment: UserRole;
  createdAt: string;
  notes: string;
  travelDates?: string;
  followUps?: FollowUp[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface PrebuiltItinerary {
  id: string;
  title: string;
  destination: string;
  description: string;
  durationDays: number;
  days: ItineraryDay[];
  totalCost: number;
  thumbnail?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  type: 'SUV' | 'Sedan' | 'Bus' | 'Mini-Bus';
  plateNumber: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  currentDriver?: string;
}
