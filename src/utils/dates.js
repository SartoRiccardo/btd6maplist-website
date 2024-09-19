export function fromNow(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const relative = now - timestamp;

  const seconds = relative % 60;
  const minutes = Math.floor(relative / 60);
  if (minutes === 0) return `${seconds} seconds ago`;
  const hours = Math.floor(relative / (60 * 60));
  if (hours === 0) return `${minutes} minutes ago`;
  const days = Math.floor(relative / (60 * 60 * 24));
  if (days === 0) return `${hours} hours ago`;
  return `${days} days ago`;
}
