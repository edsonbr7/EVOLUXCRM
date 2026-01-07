
export interface ServiceRecord {
  id: string;
  serviceName: string;
  clientName: string;
  clientPhone: string;
  value: number;
  createdAt: string;
}

export interface BusinessStats {
  totalEarned: number;
  serviceCount: number;
  averageValue: number;
}
