// Mock service: no real HTTP calls
let _mockBookings = [
  {
    id: 1,
    sailorId: 101,
    dockingSpotId: 11,
    startDate: '2025-07-01',
    endDate: '2025-07-05',
    paymentMethodId: 2,
    isPaid: false,
    people: 2,
    createdOn: '2025-06-01T10:15:00Z'
  },
  {
    id: 2,
    sailorId: 102,
    dockingSpotId: 12,
    startDate: '2025-07-10',
    endDate: '2025-07-12',
    paymentMethodId: 1,
    isPaid: true,
    people: 4,
    createdOn: '2025-06-03T14:20:00Z'
  },
  {
    id: 3,
    sailorId: 103,
    dockingSpotId: 13,
    startDate: '2025-08-01',
    endDate: '2025-08-04',
    paymentMethodId: 3,
    isPaid: false,
    people: 1,
    createdOn: '2025-06-05T08:45:00Z'
  }
];

export function getBookings() {
  return Promise.resolve([..._mockBookings]);
}

export function updateBooking(id, payload) {
  _mockBookings = _mockBookings.map(b =>
    b.id === id ? { ...b, ...payload } : b
  );
  return Promise.resolve({ message: `Booking ${id} updated.` });
}

export function deleteBooking(id) {
  _mockBookings = _mockBookings.filter(b => b.id !== id);
  return Promise.resolve({ message: `Booking ${id} deleted.` });
}
