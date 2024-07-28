import apiClient from "@/api/client";

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
}
class NotificationService {
  async getNotifications(limit?: number): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(
      `/notifications${limit ? `?limit=${limit}` : ""}`,
    );
    return response.data;
  }
}

const notificationService = new NotificationService();

export default notificationService;
