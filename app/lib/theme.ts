export const colors = {
  ink: '#17231F', muted: '#758078', paper: '#F5F3ED', white: '#FFFFFF',
  forest: '#254A3D', lime: '#D8E477', clay: '#C87853', line: '#E5E4DC',
  pale: '#E9E8DE', gold: '#D1A65E',
};

export const money = (value: number) => `₦${Number(value || 0).toLocaleString('en-NG')}`;