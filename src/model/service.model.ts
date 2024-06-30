export class ServiceResponses {
    serviceName: string;
    duration: number;
}

export class CreateServiceRequest {
    serviceName: string;
    duration: number;
}

export class UpdateServiceRequest {
    serviceName?: string;
    duration?: number;
}