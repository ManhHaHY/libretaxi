import Action from '../../../../action';
import CompositeResponse from '../../../../responses/composite-response';
import TextResponse from '../../../../responses/text-response';
import InterruptPromptResponse from '../../../../responses/interrupt-prompt-response';
import RedirectResponse from '../../../../responses/redirect-response';
import RequestUserInputResponse from '../../../../responses/request-user-input-response';
import CallActionResponse from '../../../../responses/call-action-response';

/**
 * Ask driver to offer discount for new order.
 *
 * @author Roman Pushkin (roman.pushkin@gmail.com)
 * @date 2016-10-27
 * @version 1.1
 * @since 0.1.0
 */
export default class DriverOrderOfferDiscount extends Action {

  /**
   * Constructor.
   */
  constructor(options) {
    super(Object.assign({ type: 'driver-order-offer-discount' }, options));
  }

  /**
   * Interrupt current prompt (if any) and ask for offer discount and details.
   */
  get() {
    return new CompositeResponse()
      .add(new InterruptPromptResponse())
      .add(new TextResponse({ message: this.t('offer_discount') }))
      .add(new RequestUserInputResponse());
  }

  /**
   * Interrupt current prompt (if any), call action to inform passenger, redirect back to
   * driver index action.
   *
   * @param {string} value - driver price, can contain random details
   */
  post(value) {
    const arg = this.user.state.redirectArgs;
    return new CompositeResponse()
      .add(new CallActionResponse({
        userKey: arg.passengerKey,
        route: 'passenger-contact-driver-discount',
        kicker: 'order-submitted',
        arg: {
          distance: arg.distance,
          driverPhone: this.user.state.phone,
          price: value,
        },
      }))
      .add(new TextResponse({ message: '👌 OK!' }))
      .add(new RedirectResponse({ path: 'driver-index' }));
  }
}
