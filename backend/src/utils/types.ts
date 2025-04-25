export type registerRequest = {
    name : string,
    phone : string,
    email: string,
    address : string,
    password : string
    role : string,
    restaurant_address : string
}

export interface IAdmin {
    name: string;
    email: string;
    password: string;
  
  }
  export interface IUser {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
  }
  