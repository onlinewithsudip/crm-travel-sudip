
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
  hierarchyLevel: number;
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

export interface PrebuiltItinerary {
  id: string;
  title: string;
  destination: string;
  description: string;
  durationDays: number;
  days: any[];
  totalCost: number;
  thumbnail?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  type: string;
  plateNumber: string;
  status: string;
  currentDriver?: string;
}

export interface Webhook {
  id: string;
  name: string;
  source: LeadSource;
  endpointUrl: string;
  secretKey: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface AppContent {
  [key: string]: string;
}
