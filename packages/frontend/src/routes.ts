
export type WithSearchParams<T extends string> = T | `${T}?${string}`;

export type Route = '/'
  | '/profile'
  | '/coworking'
  | '/home'
  | '/sign-in'

export const route = (route: WithSearchParams<Route>) => route;
