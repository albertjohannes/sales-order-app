declare module "*.json" {
  const value: any;
  export default value;
}

export interface Village {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  villages: Village[];
}

export interface Regency {
  code: string;
  name: string;
  districts: District[];
}

export interface Province {
  code: string;
  name: string;
  regencies: Regency[];
}

export interface IndonesianRegions {
  meta: {
    updated_at: string;
    source: string;
  };
  provinces: Province[];
} 