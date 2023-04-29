import dayjs from 'dayjs';
import { env } from '../../environment/client.mjs'
import type {ApiResponse, AcceptInviteType as AcceptInviteResponse, CreatePlanResponse, CreatePreferenceResponse, InviteUserType as InviteUserResponse, PackageResponse } from '../apiTypes.js';
import { sendAuthenticatedRequestWithBody } from './genericApi';


// Create Plan
export async function createOrUpdatePlan(name: string, planId = ""): Promise<ApiResponse<CreatePlanResponse>> {
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans${planId ? `/${planId}` : ''}`;
  const body = { name }

  return await sendAuthenticatedRequestWithBody(url, body, planId ? 'PUT' : 'POST')
}

export async function deletePlan(planId: string): Promise<ApiResponse<CreatePlanResponse>> { 
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/${planId}`;
  return await sendAuthenticatedRequestWithBody(url, {}, 'DELETE')
}


// Create/Modify preferences
// Type guard for CreatePreferenceResponse
function isCreatePreferenceResponse(obj: any): obj is CreatePreferenceResponse {
  return obj && 'start_date' in obj && 'end_date' in obj && 'start_city' in obj && 'taste_dict' in obj;
}
export async function createPreferences(
  body: CreatePreferenceResponse | {},
  userId: number,
  planId: number,
  method = 'PUT'
): Promise<ApiResponse<CreatePreferenceResponse>> {
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/preferences/${userId}/${planId}`;
  if (!isCreatePreferenceResponse(body)) {
    return await sendAuthenticatedRequestWithBody(url, {}, method)
  }

  const toSendBody = {
    start_date: dayjs(body.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(body.end_date).format("YYYY-MM-DD"),
    start_city: body.start_city,
    taste_dict: body.taste_dict
  }

  return await sendAuthenticatedRequestWithBody(url, toSendBody, method)
}

// Invite User to plan
export async function inviteUser(
  planId: string
): Promise<ApiResponse<InviteUserResponse>> {
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plan/${planId}/invite`;
  return await sendAuthenticatedRequestWithBody(url, {}, 'POST')
}


// Validate Invite Code
export async function validateInvite(
  code: string,
): Promise<ApiResponse<AcceptInviteResponse>> {
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plan/invite-user/${code}`;
  return await sendAuthenticatedRequestWithBody(url, '', 'POST')
}

// Generate Packages
export async function generatePackages(
  planId: string
): Promise<ApiResponse<PackageResponse>> {
  const url = `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/${planId}/packages/generate`;
  return await sendAuthenticatedRequestWithBody(url, '', 'POST')
}

