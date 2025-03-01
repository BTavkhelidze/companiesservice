// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is missing');
    this.stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' }); // Updated to a valid version
  }

  async createCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ email });
  }

  async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
    });
  }

  async createEmbeddedCheckoutSession(
    customerId: string,
    priceId: string,
    returnUrl: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      ui_mode: 'embedded',
      return_url: returnUrl,
      payment_method_collection: 'always',
    });
    return { clientSecret: session.client_secret };
  }

  async handleWebhookEvent(
    event: Stripe.Event,
  ): Promise<{ customerId: string; subscriptionId: string; priceId: string }> {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      return { customerId, subscriptionId, priceId };
    }
    throw new Error('Unhandled event type');
  }

  async updateSubscription(subscriptionId: string, newPriceId: string) {
    try {
      // Retrieve the subscription to get the subscription item ID
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      // Update the subscription with the new price
      const updatedSubscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id, // Use the first subscription item ID
              price: newPriceId, // New price ID
            },
          ],
        },
      );

      return { success: true, subscription: updatedSubscription };
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }
}
