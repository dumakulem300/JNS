// clickHandler.js

// Retrieve the click count from localStorage or initialize it if not set
let usernameClickCount = localStorage.getItem('usernameClickCount') ? parseInt(localStorage.getItem('usernameClickCount')) : 0;

document.getElementById('loginUsername').addEventListener('click', () => {
  usernameClickCount++;
  localStorage.setItem('usernameClickCount', usernameClickCount); // Update localStorage

  if (usernameClickCount % 2 === 1) {
    // Odd numbered clicks - immediate reload
    location.reload();
  } else {
    // Even numbered clicks - delayed reload
    setTimeout(() => {
      location.reload();
    }, 15000); // 10-second delay
  }
});

<script src="reload.js"></script>
