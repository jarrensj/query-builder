// The handle fields' placeholder is "@handle", so people often type the @. Search operators need the bare handle.
const cleanHandle = (handle: string) => handle.trim().replace(/^@/, '');

export default cleanHandle;
