export async function getExpertMaplist() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exmaps`);
  if (response.status !== 200) return [];
  return await response.json();
}
