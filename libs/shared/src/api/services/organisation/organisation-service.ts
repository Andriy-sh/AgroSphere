import { apiClient } from '../../client/axios-client';
import {
  CreateOrganisationRequest,
  CreateOrganisationResponse,
} from './organisation-types';

export class OrganisationService {
  private static readonly BASE_PATH = '/organisations';

  static async create(
    data: CreateOrganisationRequest
  ): Promise<CreateOrganisationResponse> {
    const response = await apiClient.instance.post<CreateOrganisationResponse>(
      this.BASE_PATH,
      {},
      { params: data }
    );
    return response.data;
  }
}
