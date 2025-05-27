export interface Voter {
  id: string;
  serialNumber: number;
  name: string;
  fatherName: string;
  houseNumber: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  partNumber: string;
  photoUrl?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff';
  token?: string;
}