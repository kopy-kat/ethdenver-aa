export function formatAddress(address: string) {
    return (
      address.toLowerCase().slice(0, 4) + "..." + address.toLowerCase().slice(-4)
    );
  }