export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

type Response<T = unknown> = Cypress.Response<T>;

/**
 * Thin client for the public Restful-Booker API, built on cy.request. Every
 * method returns a Cypress chainable, so specs chain .then() and .its() rather
 * than awaiting. failOnStatusCode is off so specs can assert on 4xx responses.
 */
export class BookingClient {
  private readonly baseUrl: string = Cypress.expose('apiUrl');
  private readonly headers = { Accept: 'application/json' };

  private call<T>(method: string, path: string, options: Partial<Cypress.RequestOptions> = {}) {
    return cy.request<T>({
      method,
      url: `${this.baseUrl}${path}`,
      failOnStatusCode: false,
      ...options,
      headers: { ...this.headers, ...options.headers },
    });
  }

  ping(): Cypress.Chainable<Response> {
    return this.call('GET', '/ping');
  }

  authToken(): Cypress.Chainable<string> {
    // Restful-Booker documents these as its public demo admin credentials.
    return this.call<{ token?: string }>('POST', '/auth', {
      body: { username: 'admin', password: 'password123' },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.token, 'auth should return a token').to.be.a('string').and.not.be.empty;
      return res.body.token as string;
    });
  }

  create(booking: Booking): Cypress.Chainable<CreatedBooking> {
    return this.call<CreatedBooking>('POST', '/booking', { body: booking }).then((res) => {
      expect(res.status).to.eq(200);
      return res.body;
    });
  }

  get(id: number): Cypress.Chainable<Response<Booking>> {
    return this.call<Booking>('GET', `/booking/${id}`);
  }

  list(params?: Record<string, string>): Cypress.Chainable<Response<{ bookingid: number }[]>> {
    return this.call<{ bookingid: number }[]>('GET', '/booking', { qs: params });
  }

  update(id: number, booking: Booking, token: string): Cypress.Chainable<Response<Booking>> {
    return this.call<Booking>('PUT', `/booking/${id}`, {
      body: booking,
      headers: { Cookie: `token=${token}` },
    });
  }

  delete(id: number, token?: string): Cypress.Chainable<Response> {
    return this.call('DELETE', `/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
}

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = Date.now().toString(36);
  return {
    firstname: 'Showcase',
    lastname: `Tester-${suffix}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
