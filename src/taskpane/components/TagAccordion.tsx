import React from "react";
import { getValueFromPath } from "../utils/tagUtils";

type TagAccordionProps = {
  tagMappings: Record<string, string>;
  onInsertTag: (tag: string) => void;
  matterData?: any;
  firmData?: any;
  showValues?: boolean;
};

const TagAccordion: React.FC<TagAccordionProps> = ({ 
  tagMappings, 
  onInsertTag, 
  matterData,
  firmData,
  showValues = false 
}) => {
  const groupedTags: Record<string, Array<{tag: string, value: string}>> = {};
  
  Object.entries(tagMappings).forEach(([tag, _path]) => {
    const group = tag.split(".")[0]; // Firm, Matter, etc.
    if (!groupedTags[group]) groupedTags[group] = [];
    
    let value = '';
    if (tag.startsWith('Firm.') && firmData) {
      // For firm data, first check firmDetails, then the root object
      const path = tag.replace('Firm.', '').toLowerCase();
      value = getValueFromPath(firmData?.firmDetails, path) || getValueFromPath(firmData, path) || '';
    } else if (tag.startsWith('Matter.') && matterData) {
      // For matter data, try direct access first
      const directPath = tag.replace('Matter.', '').toLowerCase();
      value = getValueFromPath(matterData, directPath);
      
      // If direct access fails, try nested properties
      if (!value && matterData) {
        if (directPath.includes('state')) {
          value = getValueFromPath(matterData.state, directPath.replace('state', '')) || '';
        } else if (directPath.includes('type')) {
          value = getValueFromPath(matterData.matterType, directPath.replace('type', '')) || '';
        } else if (directPath.includes('assigneduser')) {
          value = getValueFromPath(matterData.assignedUser, directPath.replace('assigneduser', '')) || '';
        }
      }
    }
    
    // Format dates if the value is a timestamp
    if (typeof value === 'number' && String(value).length === 10) {
      const date = new Date(value * 1000);
      if (!isNaN(date.getTime())) {
        value = date.toLocaleDateString();
      }
    }

    groupedTags[group].push({ tag, value: String(value) });
  });

  return (
    <div className="accordion" id="tagsAccordion">
      {Object.entries(groupedTags).map(([group, tags], idx) => (
        <div className="accordion-item" key={idx}>
          <h2 className="accordion-header" id={`heading-${group}-${idx}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${group}-${idx}`}
              aria-expanded="false"
              aria-controls={`collapse-${group}-${idx}`}
            >
              {group}
            </button>
          </h2>
          <div
            id={`collapse-${group}-${idx}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading-${group}-${idx}`}
            data-bs-parent="#tagsAccordion"
          >
            <div className="accordion-body">
              <ul className="list-group">
                {tags.map(({ tag, value }, i) => (
                  <li
                    key={i}
                    className="list-group-item clickable-tag"
                    onDoubleClick={() => onInsertTag(tag)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{tag}</span>
                      {showValues && value && (
                        <small className="text-muted">
                          {value.length > 30 ? value.substring(0, 30) + '...' : value}
                        </small>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagAccordion;
