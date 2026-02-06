import { NotificationType } from "@api/generated/prisma/enums";
import { prisma } from "@api/lib/prisma/client";

export class AdminNotificationService {
  public async notifyError(message: string, details?: any) {
    console.error(`[AdminNotification] ERROR: ${message}`, details);
    await this.createNotification(NotificationType.ERROR, message, details);
  }

  public async notifyInfo(message: string, details?: any) {
    console.log(`[AdminNotification] INFO: ${message}`);
    await this.createNotification(NotificationType.INFO, message, details);
  }

  public async notifyWarning(message: string, details?: any) {
    console.warn(`[AdminNotification] WARNING: ${message}`);
    await this.createNotification(NotificationType.WARNING, message, details);
  }

  private async createNotification(
    type: NotificationType,
    message: string,
    details?: any
  ) {
    try {
      await prisma.adminNotification.create({
        data: {
          type,
          message,
          details: details ? JSON.parse(JSON.stringify(details)) : undefined,
        },
      });
    } catch (error) {
      console.error("Failed to create admin notification:", error);
    }
  }
}

export const adminNotificationService = new AdminNotificationService();
