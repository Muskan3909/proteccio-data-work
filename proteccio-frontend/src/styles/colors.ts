// colors.ts
// Aligned with the Proteccio design system for consistency
export const colors = {
  white: '#fff',
  darkGray: '#0B1221', // Proteccio --bg
  darkContainer: '#131B27', // Proteccio --panel
  lightGray: '#707070',
  deepLightGray: '#d1d0d3',
  lightBeige: '#fde8b5',
  skyBlue: '#4C7EFF', // Proteccio --admin
  midBlue: '#b9cef1',
  paleBlue: '#e6f7ff',
  vibrantOrange: '#f56a00',
  limeGreen: '#2ED573', // Proteccio --cyan (primary/success accent)
  lightGreen: '#c2e4d0',
  yellow: '#F0A93F', // Proteccio --amber
  darkYellow: '#d4b106', // Darker yellow for better light theme visibility
  orange: '#ff7a45', // Added standard orange
  red: '#F1555C', // Proteccio --red
  transparent: 'transparent',
  // Proteccio-specific tokens
  panel2: '#1A2432',
  line: '#26313F',
  textDim: '#93A1AF',
  cyan: '#2ED573',
  cyanDim: 'rgba(46,213,115,0.14)',
  amberDim: 'rgba(240,169,63,0.14)',
  redDim: 'rgba(241,85,92,0.14)',
  violet: '#17A863',
  admin: '#4C7EFF',
  adminDim: 'rgba(76,126,255,0.14)',
};

export const applyCssVariables = () => {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};
