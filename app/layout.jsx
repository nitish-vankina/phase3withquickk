import './globals.css';

export const metadata = {
  title: 'Dual-Engine Quantitative Terminal',
  description: 'Systematic Allocation Model Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
