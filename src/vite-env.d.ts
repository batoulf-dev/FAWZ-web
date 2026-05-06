/// <reference types="vite/client" />

import type { JSX as ReactJSX } from 'react';
import 'react';
import 'react-dom';

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}
