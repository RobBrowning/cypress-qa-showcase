import { BookingClient, buildBooking } from '../../../src/api/BookingClient';

describe('Booking API', () => {
  let bookings: BookingClient;

  beforeEach(() => {
    bookings = new BookingClient();
  });

  it('health check responds', { tags: '@smoke' }, () => {
    // Restful-Booker quirk: /ping answers 201 Created, not 200. Documented, not a bug in our test.
    bookings.ping().its('status').should('eq', 201);
  });

  it('create then read a booking', { tags: '@smoke' }, () => {
    const payload = buildBooking();

    bookings.create(payload).then((created) => {
      expect(created.bookingid).to.be.greaterThan(0);
      expect(created.booking).to.deep.equal(payload);

      bookings.get(created.bookingid).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.equal(payload);
      });
    });
  });

  it('filter by name finds the new booking', { tags: '@regression' }, () => {
    const payload = buildBooking();

    bookings.create(payload).then(({ bookingid }) => {
      bookings.list({ firstname: payload.firstname, lastname: payload.lastname }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.map((b) => b.bookingid)).to.include(bookingid);
      });
    });
  });

  it('update requires auth, and works with a token', { tags: '@regression' }, () => {
    bookings.create(buildBooking()).then(({ bookingid, booking }) => {
      const changed = { ...booking, totalprice: 999, additionalneeds: 'Late checkout' };

      bookings.update(bookingid, changed, 'invalid-token').its('status').should('eq', 403);

      bookings.authToken().then((token) => {
        bookings.update(bookingid, changed, token).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.deep.equal(changed);
        });
      });
    });
  });

  it('delete removes the booking', { tags: '@regression' }, () => {
    bookings.create(buildBooking()).then(({ bookingid }) => {
      bookings.authToken().then((token) => {
        // Restful-Booker quirk: 201, not 204. Documented, not a bug in our test.
        bookings.delete(bookingid, token).its('status').should('eq', 201);
        bookings.get(bookingid).its('status').should('eq', 404);
      });
    });
  });
});
