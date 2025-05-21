/**
 * Formats text with basic Markdown-like syntax
 * Supports bold, italic, numbered lists, and bullet points
 * 
 * @param {string} text - Text to format
 * @returns {string} HTML formatted text
 */
export const formatText = (text) => {
  if (!text) return '';
  
  // Format bold text: **text** -> <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Format italic text: *text* -> <em>text</em> (avoiding already bolded text)
  formattedText = formattedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  
  // Format numbered lists: lines starting with "1. ", "2. ", etc.
  const numberedListPattern = /^(\d+)\.\s(.*)$/gm;
  if (numberedListPattern.test(formattedText)) {
    // Replace each line with list items
    let inList = false;
    formattedText = formattedText.split('\n').map(line => {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        if (!inList) {
          inList = true;
          return `<ol>\n  <li>${match[2]}</li>`;
        }
        return `  <li>${match[2]}</li>`;
      } else if (inList) {
        inList = false;
        return `</ol>\n${line}`;
      }
      return line;
    }).join('\n');
    
    // Close the list if it's still open at the end
    if (inList) {
      formattedText += '\n</ol>';
    }
  }
  
  // Format bullet lists: lines starting with "- " or "* "
  const bulletListPattern = /^[-*]\s(.*)$/gm;
  if (bulletListPattern.test(formattedText)) {
    // Replace each line with list items
    let inList = false;
    formattedText = formattedText.split('\n').map(line => {
      const match = line.match(/^[-*]\s(.*)$/);
      if (match) {
        if (!inList) {
          inList = true;
          return `<ul>\n  <li>${match[1]}</li>`;
        }
        return `  <li>${match[1]}</li>`;
      } else if (inList) {
        inList = false;
        return `</ul>\n${line}`;
      }
      return line;
    }).join('\n');
    
    // Close the list if it's still open at the end
    if (inList) {
      formattedText += '\n</ul>';
    }
  }
  
  // Convert newlines to <br> tags except inside lists
  formattedText = formattedText
    .replace(/\n(?!<\/[ou]l>|<[ou]l>|\s*<li>)/g, '<br>');
  
  return formattedText;
};

/**
 * Strip formatting from text for truncation purposes
 * 
 * @param {string} text - Formatted text
 * @returns {string} Plain text without formatting markers
 */
export const stripFormatting = (text) => {
  if (!text) return '';
  
  // Remove markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
    .replace(/^\d+\.\s/gm, '')       // Remove numbered list markers
    .replace(/^[-*]\s/gm, '');       // Remove bullet list markers
};

/**
 * Checks if the cursor is currently within a formatted section
 * 
 * @param {string} text - Full text content
 * @param {number} cursorPos - Current cursor position
 * @param {string} formatType - Type of formatting to check for
 * @returns {boolean} - Whether cursor is within a formatted section
 */
export const isWithinFormatting = (text, cursorPos, formatType) => {
  if (!text || cursorPos === undefined || cursorPos === null) return false;
  
  // Determine the markers based on format type
  let startMarker, endMarker;
  let isInList = false;
  
  switch(formatType) {
    case 'bold':
      startMarker = '**';
      endMarker = '**';
      break;
    case 'italic':
      startMarker = '*';
      endMarker = '*';
      break;
    case 'numbered-list':
      // For lists we check if we're on a line that starts with a number and period
      isInList = true;
      break;
    case 'bullet-list':
      // For lists we check if we're on a line that starts with a bullet
      isInList = true;
      break;
    default:
      return false;
  }
  
  if (isInList) {
    // Find the start of the current line
    const lineStart = text.lastIndexOf('\n', cursorPos - 1) + 1;
    const lineEnd = text.indexOf('\n', cursorPos);
    const currentLine = text.substring(
      lineStart, 
      lineEnd > -1 ? lineEnd : text.length
    );
    
    if (formatType === 'numbered-list') {
      return /^\d+\.\s/.test(currentLine);
    } else if (formatType === 'bullet-list') {
      return /^[-*]\s/.test(currentLine);
    }
    
    return false;
  }
  
  // For inline formatting like bold and italic
  // Look backward for the start marker
  let beforeCursor = text.substring(0, cursorPos);
  let afterCursor = text.substring(cursorPos);
  
  const lastStartMarker = beforeCursor.lastIndexOf(startMarker);
  if (lastStartMarker === -1) return false;
  
  // Check if there's an end marker after the last start marker before the cursor
  const endMarkerBeforeCursor = beforeCursor.indexOf(endMarker, lastStartMarker + startMarker.length);
  if (endMarkerBeforeCursor !== -1 && endMarkerBeforeCursor < cursorPos) return false;
  
  // Look forward for the end marker
  const nextEndMarker = afterCursor.indexOf(endMarker);
  if (nextEndMarker === -1) return false;
  
  // Make sure there's not another start marker before the next end marker
  const startMarkerAfterCursor = afterCursor.indexOf(startMarker);
  if (startMarkerAfterCursor !== -1 && startMarkerAfterCursor < nextEndMarker) return false;
  
  return true;
};
