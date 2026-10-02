export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentMethod: string;
  amount: number;
  message: string;
}

class PaymentService {
  /**
   * Abstracted payment gateway handler.
   * Can be configured with real credentials (e.g. Razorpay, Stripe, PineLabs)
   * in production via environment variables.
   */
  public async processPayment(
    amount: number,
    method: 'upi' | 'card' | 'cod' | 'netbanking'
  ): Promise<PaymentResult> {
    // Simulate gateway roundtrip
    await new Promise((res) => setTimeout(res, 900));

    if (method === 'cod') {
      return {
        success: true,
        transactionId: 'COD-' + Date.now().toString().slice(-6),
        paymentMethod: 'Cash on Delivery/Counter',
        amount,
        message: 'Order confirmed for Pay-on-Delivery.',
      };
    }

    const txId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      success: true,
      transactionId: txId,
      paymentMethod: method.toUpperCase(),
      amount,
      message: 'Payment authorized and verified successfully.',
    };
  }
}

export const paymentService = new PaymentService();
