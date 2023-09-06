/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51NmChqGNvUMmxDCYvu4MXS9EbzcjxA5B3G80hcp3nsHGsJQCE6heuECQHt1wgANCrdWLshmtdN5xjeVP2EN48TTS00SezITBEq'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
