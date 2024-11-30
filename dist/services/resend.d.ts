import { Logger, NotificationTypes } from "@medusajs/types";
import { AbstractNotificationProviderService } from "@medusajs/utils";
import { Resend } from "resend";
type InjectedDependencies = {
    logger: Logger;
};
interface ResendServiceConfig {
    apiKey: string;
    from: string;
}
export interface ResendNotificationServiceOptions {
    api_key: string;
    from: string;
}
export declare class ResendNotificationService extends AbstractNotificationProviderService {
    static identifier: string;
    protected config_: ResendServiceConfig;
    protected logger_: Logger;
    protected resend: Resend;
    constructor({ logger }: InjectedDependencies, options: ResendNotificationServiceOptions);
    send(notification: NotificationTypes.ProviderSendNotificationDTO): Promise<NotificationTypes.ProviderSendNotificationResultsDTO>;
}
export {};
//# sourceMappingURL=resend.d.ts.map