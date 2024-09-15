export type UnProcessableEntityErrorDetail = {
  type: string;
  loc: string[];
  msg: string;
}[];

export type ErrorPayload = {
  detail: string | UnProcessableEntityErrorDetail;
};
