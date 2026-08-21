export interface Member {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function fetchMembers(): Promise<Member[]> {
  return parse<Member[]>(await fetch("/api/members"));
}

export async function addMember(input: {
  name: string;
  role: string;
}): Promise<Member> {
  const res = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parse<Member>(res);
}

export async function deleteMember(id: string): Promise<void> {
  const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to remove member (${res.status})`);
  }
}
