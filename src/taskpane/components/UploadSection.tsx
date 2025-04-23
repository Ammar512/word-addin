import React, { useState, useEffect } from "react";
import FolderTreeView from "./FolderTreeView";

interface UploadSectionProps {
  token: string;
  subMatterId: any;
  matterTypeId: number;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onUploadSuccess: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  token,
  subMatterId,
  matterTypeId,
  showToast,
  onUploadSuccess,
}) => {
  const [fileLabel, setFileLabel] = useState("");
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (subMatterId) {
      setSelectedFolderId(subMatterId);
    }
  }, [subMatterId]);

  useEffect(() => {
    if (typeof Office !== "undefined" && Office.onReady) {
      Office.onReady(() => {
        setIsOfficeReady(true);
      });
    } else {
      showToast(
        "Office.js is not loaded. Ensure the add-in is running in the Office environment.",
        "error"
      );
    }
  }, []);

  const handleUpload = async () => {
    if (!isOfficeReady) {
      showToast("Office.js is not ready. Cannot execute upload.", "error");
      return;
    }

    if (!selectedFolderId) {
      showToast("Please select a destination folder", "error");
      return;
    }

    if (!fileLabel.trim()) {
      showToast("Please enter a file label", "error");
      return;
    }

    setUploading(true);

    try {
      await Word.run(async (context) => {
        context.document.save();
        await context.sync();
      });

      Office.context.document.getFileAsync(
        Office.FileType.Compressed,
        { sliceSize: 65536 },
        (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            const file = result.value;
            const slices: ArrayBuffer[] = [];
            let totalBytes = 0;

            let received = 0;
            for (let i = 0; i < file.sliceCount; i++) {
              file.getSliceAsync(i, (sliceResult) => {
                if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                  slices[i] = sliceResult.value.data;
                  totalBytes += sliceResult.value.size;
                  received++;
                  if (received === file.sliceCount) {
                    file.closeAsync();
                    const fullArray = new Uint8Array(totalBytes);
                    let offset = 0;
                    for (const slice of slices) {
                      fullArray.set(new Uint8Array(slice), offset);
                      offset += slice.byteLength;
                    }
                    const blob = new Blob([fullArray], {
                      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });

                    const formData = new FormData();
                    formData.append("fileLabel", fileLabel);
                    formData.append("folderId", selectedFolderId.toString());
                    formData.append("matterTypeId", subMatterId);
                    formData.append("file", blob);
                    formData.append("source", "addon");

                    fetch("http://localhost:5000/api/precedents/addForCompany", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                      body: formData,
                    })
                      .then((res) => res.json())
                      .then((response) => {
                        if (response.message === "Precedent created successfully") {
                          showToast("Document uploaded successfully", "success");
                          setFileLabel("");
                          setSelectedFolderId(null);
                          onUploadSuccess();
                        } else {
                          showToast(response.message || "Upload failed", "error");
                        }
                        setUploading(false);
                      })
                      .catch((err) => {
                        console.error("Upload error:", err);
                        showToast("Failed to upload document. Please try again.", "error");
                        setUploading(false);
                      });
                  }
                }
              });
            }
          }
        }
      );
    } catch (err) {
      console.error("Error during upload:", err);
      showToast("An error occurred during upload. Please try again.", "error");
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h6 className="mb-3">Select Destination Folder:</h6>
        <FolderTreeView
          token={token}
          onFolderSelect={setSelectedFolderId}
          selectedMatterTypeId={matterTypeId}
          selectedSubMatterTypeId={subMatterId}
        />
      </div>

      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="fileLabel" className="form-label">
            File Label:
          </label>
          <input
            id="fileLabel"
            className="form-control"
            value={fileLabel}
            onChange={(e) => setFileLabel(e.target.value)}
            placeholder="Enter a label for your document"
          />
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleUpload}
          disabled={!fileLabel.trim() || !selectedFolderId || uploading}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
