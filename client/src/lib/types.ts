export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: string;
}

export interface InsertTemplate {
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: string;
}

export type ElementType = 'text' | 'image' | 'box' | 'button' | 'menu' | 'gallery' | 'video' | 'table' | 'form';

export interface ElementData {
  id: string;
  type: ElementType;
  content: string;
  src?: string;
  alt?: string;
  href?: string;
  style?: Record<string, string | number>;
}

export interface TextElementStyles {
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: string;
}

export interface ImageElementStyles {
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

export interface ButtonElementStyles {
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  border?: string;
  padding?: string;
}
