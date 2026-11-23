// Runs as the page is parsed, so the first paint shows the saved handle in the input just before this
// script instead of an empty field. The form's effect then brings React's state in line.
const restoreHandle = `try {
  const handle = localStorage.getItem('twitter-handle');
  if (handle) document.currentScript.previousElementSibling.value = handle;
} catch {}`;

const RestoreHandle = () => <script dangerouslySetInnerHTML={{ __html: restoreHandle }} />;

export default RestoreHandle;
