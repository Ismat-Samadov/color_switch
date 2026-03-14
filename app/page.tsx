import ColorSwitchGame from '@/components/ColorSwitchGame';

/**
 * Root page — the game fills the entire viewport with no scrolling.
 */
export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <ColorSwitchGame />
    </main>
  );
}
