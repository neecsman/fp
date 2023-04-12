export default interface IPaymentRequest {
  client_orderid: number;
  order_desc: string;
  amount: number;
  currency: string;
  address1: string;
  city: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  ipaddress: string;
  control: string;
  server_callback_url: string;
  redirect_success_url?: string;
  redirect_fail_url?: string;
  redirect_url?: string;
}
