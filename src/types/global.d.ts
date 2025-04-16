import { WebApp } from '@twa-dev/sdk';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
} 