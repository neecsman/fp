export default interface IOrder {
  id: number;
  adress_from: string;
  adress_where: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_middlename: string;
  customer_phone: string;
  email: string;
  how_delivery: string;
  name_from: string;
  name_where: string;
  object: string;
  object_price: string;
  payments_adress: string;
  payments_method: string;
  phone_from: string;
  phone_where: string;
  size: string;
  taking_amount: number;
  time_delivery: string;
  total_weight: number;
  note_from: string;
  note_where: string;
  start_time: string;
  end_time: string;
}
