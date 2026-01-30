export type CheckoutFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardName: string;
  nfcLink: string;
  cardMessage: string;
  support: string;
  logoUrl: string;
  logoScale: string;
  logoColor: string;
  supportColor: string;
  textColor: string;
  secondaryText: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutFormState, string>>;

export type CheckoutTouched = Partial<Record<keyof CheckoutFormState, boolean>>;
