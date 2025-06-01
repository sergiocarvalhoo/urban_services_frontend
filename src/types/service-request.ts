export enum ServiceType {
  LAMP_REPLACEMENT = "LAMP_REPLACEMENT",
  ROAD_REPAIR = "ROAD_REPAIR",
  GARBAGE_COLLECTION = "GARBAGE_COLLECTION",
  STREET_CLEANING = "STREET_CLEANING",
  TREE_TRIMMING = "TREE_TRIMMING",
  PARK_MAINTENANCE = "PARK_MAINTENANCE",
}

export enum RequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface ServiceRequest {
  id: number;
  type: ServiceType;
  address: string;
  description: string;
  requesterName: string;
  document: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}
