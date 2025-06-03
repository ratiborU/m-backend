import { YooCheckout } from '@a2seven/yoo-checkout';
import bcrypt from "bcrypt";
import { Order } from '../models/models.js';
import MoiSkladService from './MoiSkladService.js';

const checkout = new YooCheckout({
  shopId: '1055221',
  secretKey: 'test_gekjRStM_JZNuRFEW7zZvpNugurxuKyrFQXJ9uvYqAE'
});

class YouKassaService {
  async createPayment(params) {
    const { value, orderId, personId } = params;
    // console.log(value, orderId, personId);
    // const idempotenceKey = '01347fc4-a1f0-49db-807e-f0d67c2ed5a5';
    const idempotenceKeyNoUse = `orderId: ${orderId}, personId: ${personId} new223`;
    // console.log(idempotenceKeyNoUse);

    const createPayload = {
      amount: {
        value: Number(value).toFixed(2) || '1.00',
        // value: '2.00',
        currency: 'RUB'
      },
      capture: true,
      payment_method_data: {
        type: 'bank_card'
      },
      confirmation: {
        type: 'redirect',
        return_url: 'test'
      },
      metadata: {
        orderId,
        personId
      }
    };
    console.log('\nhola\n');
    try {
      const payment = await checkout.createPayment(createPayload, idempotenceKeyNoUse);
      console.log(payment);
      return payment
    } catch (error) {
      console.log({ error: 'Не удалось провести оплату' });
      return { error: 'Не удалось провести оплату' }
    }
    return
  }

  async notification(params) {
    const { object } = params;
    console.log('\nnotification\n');

    if (object.status == 'succeeded') {
      await Order.update({
        status: 'Подтвержден',
        youKassaCharacteristics: {
          id: object.id
        }
      }, {
        where: { id: object.metadata.orderId }
      });

      await MoiSkladService.updateOrderStatus(object.metadata.orderId, 'Подтвержден');
    }

    // console.log('\nnotification hola\n');
    // console.log(params);
    return
  }
}

export default new YouKassaService;