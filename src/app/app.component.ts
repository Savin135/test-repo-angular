import { Component, OnInit } from '@angular/core';
// import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }

  stripe = Stripe('pk_test_51HO0KCESOl6tMOVp9lRJRna9R7lU408bAnZCxpEvMqnDBmGcu0lZTEpo0i2VMXRvDkzZfMhSzA5288DqmXCKwCTD00w71tQarJ');

  // The items the customer wants to buy
  purchase = {
    items: [{ id: "xl-tshirt" }]
  }
  elements: any
  style: any
  card: any
  form: any

  ngOnInit() {
    // Disable the button until we have Stripe set up on the page
    document.querySelector("button").disabled = true;
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.purchase)
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        this.elements = this.stripe.elements()
        this.style = {
          base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d"
            }
          },
          invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }

        this.card = this.elements.create("card", { style: this.style });
        // Stripe injects an iframe into the DOM
        this.card.mount("#card-element");
        this.card.on("change", (event) => {
          // Disable the Pay button if there are no card details in the Element
          document.querySelector("button").disabled = event.empty;
          document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
        });
        this.form = document.getElementById("payment-form");
        this.form.addEventListener("submit", (event) => {
          event.preventDefault();
          // Complete payment when the submit button is clicked
          this.payWithCard(this.stripe, this.card, data.clientSecret);
        });
      })
  }

  // Calls stripe.confirmCardPayment
  // If the card requires authentication Stripe shows a pop-up modal to
  // prompt the user to enter authentication details without leaving your page.
  payWithCard = (stripe, card, clientSecret) => {
    this.loading(true);
    this.stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer
          this.showError(result.error.message);
        } else {
          // The payment succeeded!
          this.orderComplete(result.paymentIntent.id);
        }
      })
  }
  /* ------- UI helpers ------- */
  // Shows a success message when the payment is complete
  orderComplete = (paymentIntentId) => {
    this.loading(false);
    document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + paymentIntentId
      );
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;
  }

  // Show the customer the error from Stripe if their card fails to charge
  showError = (errorMsgText) => {
    this.loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function () {
      errorMsg.textContent = "";
    }, 4000);
  }

  // Show a spinner on payment submission
  loading = (isLoading) => {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }
}
