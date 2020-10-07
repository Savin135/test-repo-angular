import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-app';
  // stripe = Stripe('pk_test_51HO0KCESOl6tMOVp9lRJRna9R7lU408bAnZCxpEvMqnDBmGcu0lZTEpo0i2VMXRvDkzZfMhSzA5288DqmXCKwCTD00w71tQarJ');
  paymentAmount = 10.00;
  isGettingCheckout = false;

  connectedAcc: any = 'acct_1HZFstKG6Elb1SM1'
  customerId: any = 'cus_I9C8TvbCTsCoe8'
  productId: any = 'prod_I9RzmDL3aRVxvL'
  priceId: any = 'price_1HZ95zESOl6tMOVptL6NufbB'


  constructor(private http: HttpClient) { }

  async payAmount() {
    // Replace with your own publishable key:    https://dashboard.stripe.com/test/apikeys
    const PUBLISHABLE_KEY = 'pk_test_51HO0KCESOl6tMOVp9lRJRna9R7lU408bAnZCxpEvMqnDBmGcu0lZTEpo0i2VMXRvDkzZfMhSzA5288DqmXCKwCTD00w71tQarJ';

    // Replace with the domain you want your users to be redirected back to after payment
    const DOMAIN = window.location.hostname;

    // Replace with a SKU for your own product (created either in the Stripe Dashboard or with the API)
    const SUBSCRIPTION_BASIC_PLAN_ID = 'plan_1234';

    // try {
    const stripe = await loadStripe(PUBLISHABLE_KEY);

    const body = {
      connectedAcc: this.connectedAcc,
      customerId: this.customerId,
      productId: this.productId,
      priceId: this.priceId
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    this.http.post<any>('http://localhost:3001/create-checkout-session', body, { headers })
      .subscribe(session => {
        console.log('session ' + session);
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
  }



  //   stripe.redirectToCheckout({
  //     items: [{plan: SUBSCRIPTION_BASIC_PLAN_ID, quantity: 1}],
  //     successUrl:
  //       'https://' +
  //       DOMAIN +
  //       '/success.html?session_id={CHECKOUT_SESSION_ID}',
  //     cancelUrl: 'https://' + DOMAIN + '/canceled.html'
  //   })
  //     .then(this.handleResult);
  // } catch (error) {
  //   console.error('checkout() try catch error', error);
  // }

  // }

  // *** To Do #3 of 3: Add this
  // handleResult(result) {
  //   console.log('handleResult()', result);
  // }



  // ngOnInit(){
  //   //this.isGettingCheckout = true;

  //   // this.stripe = loadStripe('pk_test_51HO0KCESOl6tMOVp9lRJRna9R7lU408bAnZCxpEvMqnDBmGcu0lZTEpo0i2VMXRvDkzZfMhSzA5288DqmXCKwCTD00w71tQarJ'); 
  //   const body = {
  //     product: '',
  //     token:''
  //   }

  //   console.log(this.stripe);

  //   const headers = {
  //     'Content-Type': 'application/json'
  //   }
  //   this.http.post<any>('http://localhost:3000/create-checkout-session', body, { headers })
  //   .subscribe(session => {
  //     return this.stripe.redirectToCheckout({ sessionId: session.id });
  //       })
  // }

}
