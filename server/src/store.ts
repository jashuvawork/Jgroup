export interface Member {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface NewMember {
  name: string;
  role: string;
}

const members = new Map<string, Member>();

function seed(): void {
  if (members.size > 0) return;
  const initial: NewMember[] = [
    { name: "Ada Lovelace", role: "Lead" },
    { name: "Alan Turing", role: "Engineer" },
  ];
  for (const m of initial) create(m);
}

export function list(): Member[] {
  return [...members.values()].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

export function create(input: NewMember): Member {
  const id = globalThis.crypto.randomUUID();
  const member: Member = {
    id,
    name: input.name.trim(),
    role: input.role.trim() || "Member",
    createdAt: new Date().toISOString(),
  };
  members.set(id, member);
  return member;
}

export function remove(id: string): boolean {
  return members.delete(id);
}

seed();
