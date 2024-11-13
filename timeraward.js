// Function to initialize the timer and retrieve saved state for the specific logged-in user
async function initializeTimer() {
    const username = sessionStorage.getItem('currentUser');
    if (!username) return;
  
    try {
      const userRef = ref(db, `users/${username}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
  
      const today = new Date().toDateString();
      const lastClaimDate = userData.lastClaim ? new Date(userData.lastClaim).toDateString() : null;
  
      // Reset the timer and claimed flag if it's a new day for this specific user
      if (lastClaimDate !== today) {
        timeRemaining = 60 * 60; // Reset to 60 minutes
        await resetClaimedStatus(username);
        saveTimerState(username); // Save reset timer state specifically for this user
      }
  
      // Retrieve saved timer state for this user if available
      if (userData.timerState && !userData.claimedToday) {
        const savedState = userData.timerState;
        const now = Date.now();
        const elapsedTime = Math.floor((now - savedState.startTime) / 1000);
  
        timeRemaining = savedState.duration;
        const actualRemaining = Math.max(0, timeRemaining - elapsedTime);
  
        // Start timer or award point if timer reached zero for this user
        if (actualRemaining > 0) {
          timeRemaining = actualRemaining;
          timerStartTime = now - (elapsedTime * 1000);
          startTimer();
        } else {
          await awardPoint(username); // Award point if eligible
        }
      } else {
        startUserTimer(username);
      }
    } catch (error) {
      console.error('Failed to initialize timer:', error);
    }
  }
  
  // Reset the claimed status and timer state for a specific user on a new day
  async function resetClaimedStatus(username) {
    const userRef = ref(db, `users/${username}`);
    try {
      await update(userRef, {
        claimedToday: false, // Reset daily claim status
        timerState: { duration: 60 * 60, startTime: Date.now() }, // Reset timer to 60 minutes
      });
    } catch (error) {
      console.error('Failed to reset claimed status:', error);
    }
  }
  
  // Save the current timer state specifically for the logged-in user
  async function saveTimerState(username) {
    const userRef = ref(db, `users/${username}/timerState`);
    try {
      await update(userRef, {
        duration: timeRemaining,
        startTime: timerStartTime,
      });
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }
  
  // Start the timer from 60 minutes if the user has no saved state
  async function startUserTimer(username) {
    timeRemaining = 60 * 60; // Set timer to 60 minutes
    timerStartTime = Date.now();
    startTimer();
  
    try {
      const userRef = ref(db, `users/${username}/timerState`);
      await update(userRef, {
        duration: timeRemaining,
        startTime: timerStartTime,
      });
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }
  
  // Start timer function that updates timer state at regular intervals
  function startTimer() {
    clearInterval(timerInterval);
    displayTimer(timeRemaining);
  
    timerInterval = setInterval(async () => {
      const elapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
      const remaining = Math.max(0, timeRemaining - elapsedSeconds);
  
      displayTimer(remaining);
      const username = sessionStorage.getItem('currentUser');
      if (username) saveTimerState(username);
  
      if (remaining <= 0) {
        clearInterval(timerInterval);
        await awardPoint(username);
      }
    }, 1000);
  }
  
  // Award point specifically for the user if they complete the timer
  async function awardPoint(username) {
    if (!username) return;
  
    try {
      const userRef = ref(db, `users/${username}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
  
      const today = new Date().toISOString();
      const lastClaimDate = userData.lastClaim ? new Date(userData.lastClaim).toDateString() : null;
  
      // Award point only if the timer is complete and it's a new day for this user
      if (lastClaimDate !== new Date().toDateString()) {
        const newPoints = (userData.points || 0) + 1;
        
        await update(userRef, {
          points: newPoints,
          lastClaim: today,
          claimedToday: true, // Mark today's claim
        });
  
        alert('Congratulations! You have claimed your daily point.');
      }
    } catch (error) {
      console.error('Failed to award point:', error);
    }
  }
  