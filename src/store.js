import { writable } from 'svelte/store';

export const movies = writable([]);
export const token = writable('');
export const is_auth = writable(false);
export const user = writable({});
export const popup_open = writable(false);
export const error = writable();
export const is_online = writable(true);
export const is_displayed = writable(false);
