
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
  markupPercentage: number;
  maxDiscount: number;
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

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  description?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  category: string;
  starRating: number;
  image: string;
  pricePerNight: number;
}

export interface VehicleOption {
  id: string;
  type: '4 Seater' | '6 Seater' | '8 Seater';
  rate: number;
}

export interface Quotation {
  id: string;
  leadId: string;
  packageCode: string;
  date: string;
  title: string;
  duration: string;
  startDate: string;
  endDate: string;
  adults: number;
  kids: number;
  travelDate: string;
  travelers: string;
  totalCost: number;
  taxAmount: number;
  discount: number;
  itinerary: ItineraryDay[];
  hotels: HotelOption[];
  vehicle: VehicleOption;
  vehicleInfo: string;
  inclusions: string[];
  exclusions: string[];
  bookingPolicy: string;
  cancellationPolicy: string;
  terms: string;
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
