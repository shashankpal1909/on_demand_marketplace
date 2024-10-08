import apiClient from "@/api/client";

import type { CreateServiceDTO, UpdateServiceDTO } from "@/lib/dtos";
import { Service } from "@/lib/types/services";

class ServicesService {
  async createService(dto: CreateServiceDTO) {
    const formData = new FormData();
    formData.append("name", dto.name);
    formData.append("category", dto.category);
    formData.append("description", dto.description);
    formData.append("pricing_type", dto.pricingType);
    formData.append("pricing", dto.pricing.toString());
    formData.append("location", dto.location);

    dto.tags.forEach((tag) => {
      formData.append(`tags`, tag);
    });

    if (dto.media) {
      for (const file of dto.media) {
        formData.append("media", file);
      }
    }

    const response = await apiClient.post(`/services`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async updateService(dto: UpdateServiceDTO) {
    const formData = new FormData();
    formData.append("name", dto.name);
    formData.append("category", dto.category);
    formData.append("description", dto.description);
    formData.append("pricing_type", dto.pricingType);
    formData.append("pricing", dto.pricing.toString());
    formData.append("location", dto.location);

    dto.tags.forEach((tag) => {
      formData.append(`tags`, tag);
    });

    if (dto.media) {
      for (const file of dto.media) {
        formData.append("media", file);
      }
    }

    const response = await apiClient.put(
      `/services/${dto.serviceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async getService(serviceId: string) {
    const response = await apiClient.get<Service>(`/services/${serviceId}`);
    return response.data;
  }

  async getAllServices() {
    const response = await apiClient.get(`/services`);
    return response.data;
  }

  async deleteService(serviceId: string) {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  }
}

const servicesService = new ServicesService();

export default servicesService;
