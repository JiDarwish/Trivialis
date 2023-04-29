export type Error = {
  detail: string;
}
export const makeError = (detail: string): Error => ({
  detail
})

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PreferencesResponse = {
    name: string;
    start_date: string;
    end_date: string;
    start_city: string;
    taste_array: PreferenceType[];
    user_id: number;
    plan_id: number;
}

export type MeRespose = {
  email: string;
  is_active: boolean,
  is_superuser: boolean,
  id: number 
  first_name: string;
  last_name: string;
}


// Create Plan
export type CreatePlanResponse = {
  id: number;
  name: string;
};

export type PreferenceType = {
  [key: string]: {
    "value": number;
    "importance": number;
  };
}

export type CreatePreferenceResponse = {
  start_date: Date;
  end_date: Date;
  start_city: string;
  taste_dict: PreferenceType;
}

export type InviteUserType = {
  id: number;
  planId: number;
  code: string;
  expires_at: Date;
}

export type AcceptInviteType = { 
  user_id: number;
  plan_id: number;
}


export type PlanResponseType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}


export type Transport = { 
  end_location: string; 
  end_time: string; 
  transport_type: string; 
  transport_mode: string; 
  name: string; 
  package_id: number; 
  created_at: string; 
  price: number; 
  start_location: string; 
  start_time: string; 
  link: string; 
  id: number; 
  updated_at: string; 
} 

export type PackageResponse = {
  id: number; 
  name: string; 
  total_price: number;
  transports: Transport[];
}
