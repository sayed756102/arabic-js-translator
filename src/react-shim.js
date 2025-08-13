// React default export shim to ensure React namespace is available
// Avoids cases where libraries expect `import React from 'react'` but default export is missing

// Import from the actual package entry to avoid alias recursion
import * as ReactNS from 'react/index.js';

export default ReactNS;
export * from 'react/index.js';
