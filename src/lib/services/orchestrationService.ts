import { retailerService } from "./retailerService";
import { commissionService } from "./commissionService";
import { notificationService } from "./notificationService";
import { deliveryService } from "./deliveryService";
import { logger } from "@/lib/utils/logger";

export const orchestrationService = {
  async createFullOrder(orderData: any) {
    try {
      const order = await retailerService.createOrder(orderData);
      await commissionService.createCommission(order.id, orderData.retailerId, orderData.total);
      await notificationService.notify({
        userId: orderData.wholesalerId,
        type: "order",
        title: "طلب جديد من تاجر تجزئة!",
        message: `طلب بقيمة ${orderData.total.toLocaleString()} د.ع بانتظار معالجتك.`,
      });
      logger.info("Order created successfully", { orderId: order.id });
      return order;
    } catch (error) {
      logger.error("Orchestration failed", error);
      throw new Error("فشل في إتمام عملية الطلب");
    }
  },

  async updateDeliveryStatus(orderId: string, status: "shipped" | "delivered", deliveryId: string) {
    try {
      await deliveryService.updateDeliveryStatus(orderId, status);
    } catch (error) {
      logger.error("Orchestration failed during delivery status update", error);
      throw new Error("فشل في تحديث حالة التوصيل.");
    }
  }
};
