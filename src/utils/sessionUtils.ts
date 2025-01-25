export function generateSessionCode(): string {
  const words = ['COFFEE', 'PIZZA', 'PASTA', 'SUSHI', 'TACO'];
  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${number}`;
}