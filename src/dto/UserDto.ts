export default class UserDto {
  email: string;
  id: string;
  confirm: boolean;
  firstname: string;
  lastname: string;
  middlename: string;
  phone: string;

  constructor(entity: any) {
    this.email = entity.email;
    this.id = entity.id;
    this.confirm = entity.confirm;
    this.firstname = entity.firstname;
    this.lastname = entity.lastname;
    this.middlename = entity.middlename;
    this.phone = entity.phone;
  }
}
