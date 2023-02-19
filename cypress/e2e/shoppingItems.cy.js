describe("Shopping Items", () => {
  beforeEach(() => {
    cy.visit("https://shop.demoqa.com");
  });

  it("searches the item and adds it to cart", () => {
    // click on search bar
    cy.get(".noo-search").click();

    // enter search term
    cy.get(".form-control").type("dress{enter}");

    // assert search result contains expected number of items
    cy.get(".woocommerce-result-count").should("contain", "16");

    // filter by color
    cy.get(".pull-right > :nth-child(2) > .noo-woo-filter").select(1);
    // assert no items were found
    cy.get(".woocommerce-info").should(
      "have.text",
      "No products were found matching your selection."
    );

    // clear filter
    cy.go("back");

    // click on one of the items in the search result and add to cart
    cy.get(".post-1441 > .noo-product-inner > h3 > a").click();
    cy.get("#pa_color").select(1);
    cy.get("#pa_size").select(2);
    cy.get(".single_add_to_cart_button").click();
    cy.get(".woocommerce-message").should(
      "contain",
      " has been added to your cart."
    );
  });

  describe("User not logged in", () => {
    it("adds item to cart and purchases it", () => {
      const productPrice = 18.0;
      // select item to purchase
      cy.get(".post-1485 > .noo-product-inner > h3 > a").click();
      cy.get("#pa_color").select(1);
      cy.get("#pa_size").select(2);
      // add one more (same) item to cart
      cy.get(".icon_plus").click();

      // assert quantity has been increased correctly
      cy.get('[title="Qty"]').should("have.value", 2);

      // add item to cart
      cy.get(".single_add_to_cart_button").click();

      // assert confirm message is shown
      cy.get(".woocommerce-message").should(
        "contain",
        " have been added to your cart."
      );
      // assert cart contains total two items
      cy.get(".cart-name-and-total").should("contain", "2");

      // go to cart
      cy.get(".cart-name-and-total").click();
      cy.get(".product-price > .woocommerce-Price-amount > bdi").should(
        "contain",
        productPrice.toFixed(2)
      );

      // asser total price in cart is correct
      cy.get(".product-subtotal > .woocommerce-Price-amount > bdi").should(
        "contain",
        (productPrice * 2).toFixed(2)
      );

      // increase quantity in cart
      cy.get(".qty-increase").click();
      cy.get('[name="update_cart"]').click();

      // assert total price per product is correct
      cy.get(".product-subtotal > .woocommerce-Price-amount > bdi")
        .invoke("text")
        .as("productSubtotal");
      cy.get("@productSubtotal").then((subtotal) => {
        cy.get(".order-total > td")
          .invoke("text")
          .as("text")
          .should("contain", subtotal);
      });

      // proceed to checkout
      cy.get(".wc-proceed-to-checkout > .checkout-button").click();
      // assert total order price is correct
      cy.get('tr[class="order-total"] bdi:nth-child(1)').should(
        "contain",
        (productPrice * 3).toFixed(2)
      );

      // enter billing info
      cy.get("#billing_first_name").type("Amir");
      cy.get("#billing_last_name").type("Bala");
      cy.get("#select2-billing_country-container").type("Bos");
      cy.get("#select2-billing_country-results").each(($el, index, $list) => {
        if ($el.text() === "Bosnia and Herzegovina") {
          cy.wrap($el).click();
        }
      });
      cy.get("#billing_address_1").type("Oaza 5");
      cy.get("#billing_postcode").type("71000");
      cy.get("#billing_city").type("Sarajevo");
      cy.get("#billing_phone").type("38761000000");
      cy.get("#billing_email").type("amir@gmail.com");

      //if user wants to create account enable the next 3 lines
      /*cy.get('#createaccount').click()
      cy.get('#account_username').type('AmirBaa')
      cy.get('#account_password').type('Amir123!!!') */

      cy.get("#terms").check().should("be.checked");
      cy.get("#place_order").click();
      // wait for order to be received
      cy.url().should("include", "order-received");
      // assert correct content of thank you message
      cy.get(".woocommerce-thankyou-order-received").should(
        "contain",
        "Thank you. Your order has been received"
      );
    });
  });

  describe("User is logged in", () => {
    beforeEach(() => {
      cy.visit("https://shop.demoqa.com/my-account");
    });

    it("logs in to existing account and purchases item", () => {
      const userEmail = "Amir+10@gmail.com";
      // login
      cy.get("#username").type(userEmail);
      cy.get("#password").type("amir1234!!");
      cy.get("#rememberme").check();
      cy.get(":nth-child(3) > .woocommerce-button").click();

      // assert user has been logged in
      cy.get(".woocommerce-MyAccount-content > :nth-child(2)").should(
        "contain",
        "Hello Amir"
      );
      cy.get(".custom-logo-link > .custom-logo").click();

      // purchase an item
      cy.get(".post-1497 > .noo-product-inner > h3 > a").click();
      cy.get("#pa_color").select(1);
      cy.get("#pa_size").select(3);
      cy.get(".icon_plus").click();
      cy.get('[title="Qty"]').should("have.value", 2);
      cy.get(".single_add_to_cart_button").click();
      cy.get(".woocommerce-message").should(
        "contain",
        " have been added to your cart."
      );
      cy.get(".cart-name-and-total").click();
      cy.get(".wc-proceed-to-checkout > .checkout-button").click();
      cy.get("#billing_first_name").clear().type("Amir");
      cy.get("#billing_last_name").clear().type("Bala");
      cy.get("#select2-billing_country-container").type("Bos");
      cy.get("#select2-billing_country-results").each(($el, index, $list) => {
        if ($el.text() === "Bosnia and Herzegovina") {
          cy.wrap($el).click();
        }
      });
      cy.get("#billing_address_1").clear().type("Oaza 5");
      cy.get("#billing_postcode").clear().type("71000");
      cy.get("#billing_city").clear().type("Sarajevo");
      cy.get("#billing_phone").clear().type("38761000000");

      // assert terms have been accepted
      cy.get("#terms").check().should("be.checked");
      // assert billing email is same as user email
      cy.get("#billing_email").should("have.value", userEmail);
      cy.get("#place_order").click();
      // wait for order to be received
      cy.url().should("include", "order-received");
      // assert correct content of thank you message
      cy.get(".woocommerce-thankyou-order-received").should(
        "contain",
        "Thank you. Your order has been received"
      );
    });
  });
});
