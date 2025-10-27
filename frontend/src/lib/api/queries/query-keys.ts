// Query key factory
export const queryKeys = {
  polls: {
    all: ['polls'] as const,
    detail: (id: string) => ['polls', id] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
}

