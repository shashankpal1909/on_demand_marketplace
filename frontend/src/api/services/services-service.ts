import apiClient from "@/api/client";

import type { CreateServiceDTO } from "@/lib/dtos";

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
}

const servicesService = new ServicesService();

export default servicesService;
