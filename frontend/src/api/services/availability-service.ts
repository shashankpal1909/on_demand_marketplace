import apiClient from "@/api/client";

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Availability {
  day: Day;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

class AvailabilityService {
  async getReoccurringAvailability() {
    const response = await apiClient.get(`/availability`);
    return response.data;
  }

  async saveReoccurringAvailability(availabilities: Availability[]) {
    const response = await apiClient.post(`/availability`, { availabilities });
    return response.data;
  }
}

const availabilityService = new AvailabilityService();

export default availabilityService;
