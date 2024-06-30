export class BranchResponses {
    name: string;
    locationName?: string;
    openTime?: string;
    closeTime?: string;
}

export class CreateBranchRequest {
    name: string;
    locationName: string;
    openTime: string;
    closeTime: string;
}