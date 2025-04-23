import React, { useState } from "react";
import { Stack, TextField, PrimaryButton, Text, Spinner, SpinnerSize } from "@fluentui/react";
import TagAccordion from "./TagAccordion";

interface ContainerEditorProps {
  token: string;
  tagMappings: Record<string, string>;
  onInsertTag: (tag: string) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onSuccess: () => void;
}

const ContainerEditor: React.FC<ContainerEditorProps> = ({
  token,
  tagMappings,
  onInsertTag,
  showToast,
  onSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description) {
      showToast("Please enter a description for the container", "error");
      return;
    }

    setSaving(true);

    try {
      // Get the document content
      const documentContent = await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");
        await context.sync();
        return body.text;
      });

      // Convert the document content to a Blob
      const blob = new Blob([documentContent], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const file = new File([blob], "container.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("isGlobal", isGlobal.toString());

      const response = await fetch("http://localhost:5000/api/containers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showToast("Container saved successfully", "success");
        setDescription("");
        onSuccess();
      } else {
        showToast(result.message || "Failed to save container", "error");
      }
    } catch (error) {
      console.error("Error saving container:", error);
      showToast("An error occurred while saving the container", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filter only firm-related tags
  const firmTagMappings = Object.entries(tagMappings)
    .filter(([key]) => key.startsWith("Firm."))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <Text variant="xLarge">Create Container</Text>
      <Text>
        Use this section to create a container document. Only firm-related tags are available for
        containers.
      </Text>

      <TextField
        label="Container Description"
        value={description}
        onChange={(_, newValue) => setDescription(newValue || "")}
        required
      />

      <div className="tag-section">
        <Text variant="large">Available Tags</Text>
        <TagAccordion tagMappings={firmTagMappings} onInsertTag={onInsertTag} showValues={true} />
      </div>

      <Stack horizontal tokens={{ childrenGap: 8 }} horizontalAlign="end">
        <PrimaryButton
          text={saving ? "Saving..." : "Save Container"}
          onClick={handleSave}
          disabled={saving || !description}
        />
      </Stack>

      {saving && (
        <Stack horizontalAlign="center">
          <Spinner size={SpinnerSize.large} label="Saving container..." />
        </Stack>
      )}
    </Stack>
  );
};

export default ContainerEditor;
