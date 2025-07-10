export class CreateTeamMemberDto {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  isIndividual: boolean;
  company?: string;
  source?: string;
  position?: string;
  positionDescription?: string;
  email?: string;
  phoneNumbers: string[];
  skype?: string;
  linkedin?: string;
  additionalLinks: { type: string; url: string }[];
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending';
  createdBy?: string;
}