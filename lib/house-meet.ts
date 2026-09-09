export type HouseMeetInfo = {
  name: string;
  address: string;
};

/** Street addresses for confirmed meet-ups. Fill in when provided. */
/** Email-only. Do not surface these addresses on the public website. */
export const HOUSE_MEET: Record<string, HouseMeetInfo> = {
  village: {
    name: "South Fulton",
    address: "3790 Village Dr SW, Atlanta, GA 30331",
  },
  thorton: {
    name: "Atlanta",
    address: "1656 Thornton Pl SW, Atlanta, GA 30315",
  },
};

const ADDRESS_FALLBACK =
  "Your house manager will confirm the street address when you arrive. Call (404) 731-2371 if you need it sooner.";

export function houseMeetInfo(houseId?: string | null): HouseMeetInfo {
  const house = houseId ? HOUSE_MEET[houseId] : undefined;
  return {
    name: house?.name || "New Creation Living",
    address: house?.address?.trim() || ADDRESS_FALLBACK,
  };
}
