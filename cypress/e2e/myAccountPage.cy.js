const randomString = Math.random().toString(36).substring(2, 7);
const username = `Amir_${randomString}`;
const email = `Amir+${randomString}@gmail.com`;

describe("My Account Page", () => {
  beforeEach(() => {
    cy.visit("https://shop.demoqa.com/my-account");
  });

  it("registers user", () => {
    // fill out form
    cy.get("#reg_username").type(username);
    cy.get("#reg_email").type(email);
    cy.get("#reg_password").type("amir1234!!");

    // submit form
    cy.get(".woocommerce-Button").click();

    cy.get(".woocommerce-MyAccount-content > :nth-child(2)").should(
      "contain",
      `Hello ${username}`
    );
  });

  it("logs user in to existing account", () => {
    // type username
    cy.get("#username").type(username);
    // or type email
    // cy.get('#username').type(email)

    // type password and check remember me
    cy.get("#password").type("amir1234!!");
    cy.get("#rememberme").check();

    // submit form
    cy.get(":nth-child(3) > .woocommerce-button").click();

    cy.get(".woocommerce-MyAccount-content > :nth-child(2)").should(
      "contain",
      `Hello ${username}`
    );
  });
});
