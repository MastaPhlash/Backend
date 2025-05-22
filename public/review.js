// review.js - Handles submitting and displaying book reviews

document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('reviewForm');
  const reviewsDiv = document.getElementById('reviews');

  // Helper to fetch and display reviews for a book
  async function loadReviews(isbn) {
    reviewsDiv.innerHTML = 'Loading reviews...';
    const res = await fetch(`/books`);
    const books = await res.json();
    const book = books[isbn];
    if (book && book.reviews) {
      reviewsDiv.innerHTML = '<h3>Reviews:</h3>' +
        Object.entries(book.reviews).map(([user, {review, rating}]) =>
          `<div><b>${user}</b>: ${review} (Rating: ${rating})</div>`
        ).join('');
    } else {
      reviewsDiv.innerHTML = 'No reviews yet.';
    }
  }

  // Handle review form submission
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isbn = document.getElementById('isbn').value;
    const username = document.getElementById('username').value;
    const review = document.getElementById('review').value;
    const rating = parseInt(document.getElementById('rating').value, 10);
    const res = await fetch(`/books/${isbn}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, review, rating })
    });
    const data = await res.json();
    alert(data.message);
    loadReviews(isbn);
  });

  // Optionally, load reviews when ISBN changes
  document.getElementById('isbn').addEventListener('change', (e) => {
    loadReviews(e.target.value);
  });
});
