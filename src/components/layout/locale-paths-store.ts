type LocaleHref = {
  pathname: string;
  params?: Record<string, string>;
};

type LocaleHrefs = Partial<Record<string, LocaleHref>>;

let currentHrefs: LocaleHrefs | null = null;
let ownerId = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function setLocalePathOverrides(
  id: number,
  hrefs: LocaleHrefs | null
) {
  if (hrefs !== null) {
    ownerId = id;
    currentHrefs = hrefs;
  } else if (id === ownerId) {
    currentHrefs = null;
  } else {
    return;
  }
  notify();
}

export function getLocalePathOverrides(): LocaleHrefs | null {
  return currentHrefs;
}

export function subscribeLocalePathOverrides(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
