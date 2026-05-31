import type { PostLemoBody, PostLemoResponse } from './schemas';

export function getLemo(): void {
  // intentionally empty — GET /lemo returns 200 with no body
}

export function postLemo(body: PostLemoBody): PostLemoResponse {
  return { received: true, name: body.name, value: body.value };
}
