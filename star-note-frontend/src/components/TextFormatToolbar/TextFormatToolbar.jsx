import { FiBold, FiItalic, FiList, FiType, FiEye, FiEyeOff } from "react-icons/fi";
import { isWithinFormatting } from "../../utils/formatText";
import "./TextFormatToolbar.css";
import "./tooltip.css";

/**
 * Text formatting toolbar component for note editor
 * Provides formatting options: bold, italic, numbered list, and bullet points
 */
const TextFormatToolbar = ({ onFormat, previewMode, onTogglePreview, content, cursorPosition }) => {
    const formatHandlers = {
        bold: () => onFormat("bold"),
        italic: () => onFormat("italic"),
        numberedList: () => onFormat("numbered-list"),
        bulletList: () => onFormat("bullet-list"),
    };
    
    // Calculate if we're within any formatted sections
    const isBold = content && cursorPosition !== undefined 
        ? isWithinFormatting(content, cursorPosition, 'bold') 
        : false;
        
    const isItalic = content && cursorPosition !== undefined 
        ? isWithinFormatting(content, cursorPosition, 'italic') 
        : false;
        
    const isNumberedList = content && cursorPosition !== undefined 
        ? isWithinFormatting(content, cursorPosition, 'numbered-list') 
        : false;
        
    const isBulletList = content && cursorPosition !== undefined 
        ? isWithinFormatting(content, cursorPosition, 'bullet-list') 
        : false;
    
    return (
        <div className="format-toolbar">            <button
                className={`format-btn ${previewMode ? "disabled" : ""} ${isBold ? "active" : ""}`}
                onClick={formatHandlers.bold}
                title="Bold"
                aria-label="Format text as bold"
                disabled={previewMode}
            >
                <FiBold className="icon-bold" /> <span className="icon-text">B</span>
            </button>
            <button
                className={`format-btn ${previewMode ? "disabled" : ""} ${isItalic ? "active" : ""}`}
                onClick={formatHandlers.italic}
                title="Italic"
                aria-label="Format text as italic"
                disabled={previewMode}
            >
                <FiItalic className="icon-italic" /> <span className="icon-text">I</span>
            </button>
            <div className="toolbar-separator"></div>
              <div className="tooltip-container">
                <button
                    className={`format-btn ${previewMode ? "disabled" : ""} ${isNumberedList ? "active" : ""}`}
                    onClick={formatHandlers.numberedList}
                    aria-label="Format as numbered list"
                    disabled={previewMode}
                >
                    <FiList className="icon-list" /> <span className="numbered-indicator">1.</span>
                </button>
                <span className="custom-tooltip">Numbered List: Press Enter to continue the list. Press Enter on empty item to exit.</span>
            </div>
            
            <div className="tooltip-container">
                <button
                    className={`format-btn ${previewMode ? "disabled" : ""} ${isBulletList ? "active" : ""}`}
                    onClick={formatHandlers.bulletList}
                    aria-label="Format as bullet list"
                    disabled={previewMode}
                >
                    <FiType className="icon-bullet" /> <span className="bullet-indicator">•</span>
                </button>
                <span className="custom-tooltip">Bullet List: Press Enter to continue the list. Press Enter on empty item to exit.</span>
            </div>
            
            <div className="toolbar-spacer"></div>
            
            <button
                className={`format-btn preview-btn ${previewMode ? "active" : ""}`}
                onClick={onTogglePreview}
                title={previewMode ? "Edit mode" : "Preview mode"}
                aria-label={previewMode ? "Switch to edit mode" : "Switch to preview mode"}
            >
                {previewMode ? <FiEyeOff /> : <FiEye />}
            </button>
        </div>
    );
};

export default TextFormatToolbar;
