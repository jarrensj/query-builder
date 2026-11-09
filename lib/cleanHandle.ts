// Handles copied from X often keep their leading @. Search operators need the bare handle.
const cleanHandle = (handle: string) => handle.trim().replace(/^@/, '');

export default cleanHandle;
