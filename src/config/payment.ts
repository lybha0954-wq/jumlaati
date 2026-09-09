export const paymentConfig = {
  currency: "IQD",
  methods: ["cash_on_delivery", "bank_transfer", "card"] as const,
  commissionRate: 0.05, // 5%
};
