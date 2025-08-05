// Import the JSON data
const wilayahData = require('./wilayah-full.min.json');

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

// Use the actual wilayah data with error handling
export const indonesianRegions: IndonesianRegions = wilayahData as IndonesianRegions;

// Validate that the data structure is correct
if (!indonesianRegions.provinces || !Array.isArray(indonesianRegions.provinces)) {
  console.error('Invalid wilayah data structure');
}

// Helper functions to get filtered data
export const getProvinces = () => indonesianRegions.provinces;

export const getRegencies = (provinceCode: string) => {
  const province = indonesianRegions.provinces.find(p => p.code === provinceCode);
  return province ? province.regencies : [];
};

export const getDistricts = (provinceCode: string, regencyCode: string) => {
  const province = indonesianRegions.provinces.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const regency = province.regencies.find(r => r.code === regencyCode);
  return regency ? regency.districts : [];
};

export const getVillages = (provinceCode: string, regencyCode: string, districtCode: string) => {
  const province = indonesianRegions.provinces.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const regency = province.regencies.find(r => r.code === regencyCode);
  if (!regency) return [];
  
  const district = regency.districts.find(d => d.code === districtCode);
  return district ? district.villages : [];
}; 