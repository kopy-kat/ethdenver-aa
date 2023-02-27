export function formatAddress(address: string) {
  return (
    address.toLowerCase().slice(0, 4) + "..." + address.toLowerCase().slice(-4)
  );
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<any> {
  const res = await fetch(input, init)
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return res;
}
