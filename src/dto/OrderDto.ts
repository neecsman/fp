export default class OrderDto {
  vehicle_type_id: number;
  matter: string;
  insurance_amount: string;
  total_weight_kg: number;
  points: [];
  address: string;
  contact_person: Object;
  name: string;
  phone: string;
  taking_amount: string;
  note: string;
  required_start_datetime: Date;
  required_finish_datetime: Date;

  constructor(entity: any) {
    this.vehicle_type_id = entity.vehicle_type_id;
    this.matter = entity.matter;
    this.insurance_amount = entity.insurance_amount;
    this.total_weight_kg = entity.total_weight_kg;
    this.points = entity.points;
    this.address = entity.address;
    this.contact_person = entity.contact_person;
    this.name = entity.name;
    this.phone = entity.phone;
    this.taking_amount = entity.taking_amount;
    this.note = entity.note;
    this.required_start_datetime = entity.required_start_datetime;
    this.required_finish_datetime = entity.required_finish_datetime;
  }
}
