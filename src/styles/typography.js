import { scaleFont } from './mixins';

// FONT FAMILY
export const FONT_FAMILY_LIGHT = 'Poppins-Light';
export const FONT_FAMILY_MEDIUM = 'Poppins-Medium';
export const FONT_FAMILY_THIN = 'Poppins-Thin';
export const FONT_FAMILY_REGULAR = 'Poppins-Regular';
export const FONT_FAMILY_SEMI_BOLD = 'Poppins-SemiBold';
export const FONT_FAMILY_BOLD = 'Poppins-Bold';

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_BOLD = '700';

// FONT SIZE
export const FONT_SIZE_36 = scaleFont(36);
export const FONT_SIZE_30 = scaleFont(30);
export const FONT_SIZE_26 = scaleFont(26);
export const FONT_SIZE_24 = scaleFont(24);
export const FONT_SIZE_20 = scaleFont(20);
export const FONT_SIZE_16 = scaleFont(16);
export const FONT_SIZE_14 = scaleFont(14);
export const FONT_SIZE_12 = scaleFont(12);

// LINE HEIGHT
export const LINE_HEIGHT_24 = scaleFont(24);
export const LINE_HEIGHT_20 = scaleFont(20);
export const LINE_HEIGHT_16 = scaleFont(16);

// FONT STYLE
export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_BOLD,
  fontWeight: FONT_WEIGHT_BOLD,
};

// ICON STYLE
export const ICON_SMALL = 24;
export const ICON_MEDIUM = 36;
export const ICON_LARGE = 48;
  