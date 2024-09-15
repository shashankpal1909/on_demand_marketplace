export type Tag = {
  service_id: string;
  id: string;
  text: string;
};

export type Media = {
  service_id: string;
  url: string;
  id: string;
};

export type Service = {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  pricing_type: "fixed" | "hourly";
  created_at: string;
  pricing: number;
  provider_id: string;
  updated_at: null;
  media: Media[];
  tags: Tag[];
};
