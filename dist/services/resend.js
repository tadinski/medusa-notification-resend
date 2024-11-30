"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendNotificationService = void 0;
const utils_1 = require("@medusajs/utils");
const resend_1 = require("resend");
class ResendNotificationService extends utils_1.AbstractNotificationProviderService {
    constructor({ logger }, options) {
        super();
        this.config_ = {
            apiKey: options.api_key,
            from: options.from,
        };
        this.logger_ = logger;
        this.resend = new resend_1.Resend(this.config_.apiKey);
    }
    async send(notification) {
        if (!notification) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `No notification information provided`);
        }
        if (notification.channel === "sms") {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `SMS notification not supported`);
        }
        const attachments = Array.isArray(notification.attachments)
            ? notification.attachments.map((attachment) => ({
                content: attachment.content, // Base64 encoded string of the file
                filename: attachment.filename,
                content_type: attachment.content_type, // MIME type (e.g., 'application/pdf')
                disposition: attachment.disposition ?? "attachment", // Default to 'attachment'
                id: attachment.id ?? undefined, // Optional: unique identifier for inline attachments
            }))
            : undefined;
        const from = notification.from?.trim() || this.config_.from;
        const text = String(notification.data?.text) || "";
        const subject = String(notification.data?.subject) || "";
        const message = {
            to: notification.to,
            from: from,
            text: text,
            html: notification.template,
            subject,
            attachments: attachments,
        };
        try {
            // Unfortunately we don't get anything useful back in the response
            await this.resend.emails.send(message);
            return {};
        }
        catch (error) {
            const errorCode = error.code;
            const responseError = error.response?.body?.errors?.[0];
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.UNEXPECTED_STATE, `Failed to send resend email: ${errorCode} - ${responseError?.message ?? "unknown error"}`);
        }
    }
}
exports.ResendNotificationService = ResendNotificationService;
ResendNotificationService.identifier = "RESEND_NOTIFICATION_SERVICE"; //added static identifier required in medusa v2 stable
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Jlc2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FHeUI7QUFDekIsbUNBQW9EO0FBZXBELE1BQWEseUJBQTBCLFNBQVEsMkNBQW1DO0lBTWhGLFlBQ0UsRUFBRSxNQUFNLEVBQXdCLEVBQ2hDLE9BQXlDO1FBRXpDLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7U0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FDUixZQUEyRDtRQUUzRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEIsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDOUIsc0NBQXNDLENBQ3ZDLENBQUM7UUFDSixDQUFDO1FBQ0QsSUFBSSxZQUFZLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ25DLE1BQU0sSUFBSSxtQkFBVyxDQUNuQixtQkFBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQzlCLGdDQUFnQyxDQUNqQyxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztZQUN6RCxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLG9DQUFvQztnQkFDakUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO2dCQUM3QixZQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVksRUFBRSxzQ0FBc0M7Z0JBQzdFLFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxJQUFJLFlBQVksRUFBRSwwQkFBMEI7Z0JBQy9FLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJLFNBQVMsRUFBRSxxREFBcUQ7YUFDdEYsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVkLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDNUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25ELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBdUI7WUFDbEMsRUFBRSxFQUFFLFlBQVksQ0FBQyxFQUFFO1lBQ25CLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsWUFBWSxDQUFDLFFBQVE7WUFDM0IsT0FBTztZQUNQLFdBQVcsRUFBRSxXQUFXO1NBQ3pCLENBQUM7UUFFRixJQUFJLENBQUM7WUFDSCxrRUFBa0U7WUFDbEUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDN0IsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUNsQyxnQ0FBZ0MsU0FBUyxNQUN2QyxhQUFhLEVBQUUsT0FBTyxJQUFJLGVBQzVCLEVBQUUsQ0FDSCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7O0FBeEVILDhEQXlFQztBQXhFUSxvQ0FBVSxHQUFHLDZCQUE2QixDQUFDLENBQUMsc0RBQXNEIn0=