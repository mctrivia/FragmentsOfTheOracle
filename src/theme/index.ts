export const colors = {
  background: '#1a1410',
  surface: '#2a2018',
  surfaceLight: '#3a3028',
  accent: '#c9a84c',
  accentDim: '#8a7434',
  text: '#e8dcc8',
  textDim: '#9a8e7a',
  success: '#5a9a5a',
  error: '#9a4a4a',
  white: '#ffffff',

  // Room themes
  royal_archive: '#c9a84c',
  prophetic_archive: '#7a9abc',
  exilic_archive: '#8a7abc',
  interpretive_archive: '#6aaa8a',
  messianic_archive: '#bc6a6a',
};

export const fonts = {
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.accent, letterSpacing: 1.5 },
  heading: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, color: colors.text, lineHeight: 24 },
  caption: { fontSize: 13, color: colors.textDim },
  button: { fontSize: 16, fontWeight: '600' as const, color: colors.background },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
