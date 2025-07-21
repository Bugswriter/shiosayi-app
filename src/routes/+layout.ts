import '../app.css';
import { initializeApp } from '$lib/services/init';

export const prerender = true;
export const ssr = false;

export async function load() {
  try {
    await initializeApp();
    return { startupError: null };
  } catch (e: any) {
    console.error("Fatal startup error in +layout.ts:", e);
    return { startupError: e.message };
  }
}