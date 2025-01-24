export const calculateCoins = (duration, isComplete) => {
  const baseRate = 0.5;
  const baseCoins = Math.floor(duration * baseRate);

  if (isComplete) {
    const completionBonus = Math.floor(baseCoins * 0.2);
    const earnings = baseCoins + completionBonus;
    console.log('Earnings:', earnings);
    return earnings;
  } else {
    const penalty = Math.floor(baseCoins * 0.5);
    const earnings = baseCoins - penalty;
    console.log('Earnings penalty:', earnings);
    return earnings;
  }
};

// earning logics plans

//if the user completes the sessions they earn bonus coins else they lose 50% of the base coins

// 1. base rate: 0.5 coins per second (30 coins per minute) => 1800 coins per hour
// 2. completion bonus: 20% of base coins

// if the user fails to complete the session, they lose 50% of the base coins
