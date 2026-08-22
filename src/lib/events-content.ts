/** Mall & beach surprise gift inclusions — from J Surprise Events price list */

export const MALL_BEACH_GIFTS = [
  "Flowers",
  "Flower Bouquet",
  "Cake (Half kg)",
  "Banner Sheet (13×30)",
  "Thumb Impression Photo Frame",
  "Best Husband / Brother / Son / Father Certificate Frame",
  "Frame (12×18)",
  "Snapbook",
  "Wishes Frame",
  "Customized Pillows",
  "Customized Chocolate",
  "Customized Mugs / Magic Mugs",
] as const;

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  standard: "Standard Surprise Packages",
  exclusive: "Exclusive Surprise Packages",
  decoration: "Event Decoration",
};

export const BOOKING_NOTES = [
  "Prices are starting rates and may vary based on location, customization, and add-ons.",
  "Transportation charges apply based on distance.",
  "Advance booking is required.",
  "100% satisfaction & best memories guaranteed.",
] as const;
