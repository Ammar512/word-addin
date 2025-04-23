import React, { useEffect, useState } from "react";
import { Pivot, PivotItem, Stack, Text } from "@fluentui/react";
import ContainerEditor from "./ContainerEditor";
import { generateCotainierTagMappings, generateTagMappings } from "../utils/tagUtils";

interface MatterSelectionProps {
  token: string;
  onMatterSelected: (
    data: any,
    roles: any[],
    matterType: string,
    subMatterType: string,
    subMatterId: number
  ) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onSuccess: () => void;
}

const MatterSelection: React.FC<MatterSelectionProps> = ({
  token,
  onMatterSelected,
  showToast,
  onSuccess,
}) => {
  const [matterTypes, setMatterTypes] = useState<any[]>([]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState("");
  const [selectedSubIndex, setSelectedSubIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState("matterType");
  const [tagMappings, setTagMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/matters/statesMatterTypes/VIC", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length) {
          setMatterTypes(data.data[0].matterTypes);
        }
      });
  }, [token]);

  useEffect(() => {
    // Generate tag mappings only for container-related tags (firm details)
    const mappings = generateCotainierTagMappings();

    setTagMappings(mappings);
  }, []);

  const handleMatterTypeChange = (e: any) => {
    setSelectedTypeIndex(e.target.value);
    setSelectedSubIndex("");
  };

  const handleSubMatterChange = (e: any) => {
    setSelectedSubIndex(e.target.value);
    const [typeIndex, subIndex] = e.target.value.split("-").map(Number);
    const matterType = matterTypes[typeIndex];
    const subMatter = matterType.subMatterTypes[subIndex];
    onMatterSelected(
      matterType,
      subMatter.roles || [],
      matterType.matterType,
      subMatter.subMatterType,
      subMatter.subMatterId
    );
  };

  const handleInsertTag = async (tag: string) => {
    if (typeof Office !== "undefined" && Office.context) {
      try {
        await Word.run(async (context) => {
          const body = context.document.body;
          body.insertText(`<<${tag}>>`, Word.InsertLocation.end);
          await context.sync();
        });
        showToast("Tag inserted successfully", "success");
      } catch (error) {
        console.error("Error inserting tag:", error);
        showToast("Failed to insert tag", "error");
      }
    }
  };

  const renderMatterTypeSelection = () => (
    <Stack tokens={{ childrenGap: 16 }}>
      <Text variant="xLarge" block>
        Select Matter Type
      </Text>

      <div className="mb-3">
        <label htmlFor="matterTypeSelect" className="form-label">
          Matter Type
        </label>
        <select
          id="matterTypeSelect"
          className="form-select"
          value={selectedTypeIndex}
          onChange={handleMatterTypeChange}
        >
          <option value="">Select Matter Type</option>
          {matterTypes.map((type, idx) => (
            <option key={idx} value={idx}>
              {type.matterType}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="subMatterTypeSelect" className="form-label">
          Sub-Matter Type
        </label>
        <select
          id="subMatterTypeSelect"
          className="form-select"
          value={selectedSubIndex}
          onChange={handleSubMatterChange}
          disabled={!selectedTypeIndex}
        >
          <option value="">Select Sub-Matter</option>
          {selectedTypeIndex &&
            matterTypes[selectedTypeIndex]?.subMatterTypes.map((sub, idx) => (
              <option key={idx} value={`${selectedTypeIndex}-${idx}`}>
                {sub.subMatterType}
              </option>
            ))}
        </select>
      </div>
    </Stack>
  );

  return (
    <div className="container shadow-sm p-4 bg-white rounded">
      <Pivot
        selectedKey={selectedTab}
        onLinkClick={(item?: PivotItem) => {
          if (item) {
            setSelectedTab(item.props.itemKey || "matterType");
          }
        }}
      >
        <PivotItem headerText="Matter Type" itemKey="matterType">
          {renderMatterTypeSelection()}
        </PivotItem>
        <PivotItem headerText="Container" itemKey="container">
          <ContainerEditor
            token={token}
            tagMappings={tagMappings}
            onInsertTag={handleInsertTag}
            showToast={showToast}
            onSuccess={onSuccess}
          />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default MatterSelection;
