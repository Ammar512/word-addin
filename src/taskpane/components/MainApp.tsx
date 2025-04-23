import React, { useState, useEffect } from "react";
import TagAccordion from "./TagAccordion";
import UploadSection from "./UploadSection";
import AskModal from "./AskModal";
import RelatedMatters from "./RelatedMatters";
import {
  generateDefaultTagMappings,
  generateTagMappings,
  mapMatterDataToTags,
  getFirmData,
  replaceTagsWithData,
  revertDataToTags,
} from "../utils/tagUtils";
import AskTagTable from "./AskTagTable";

interface MainAppProps {
  token: string;
  selectedRoles: any[];
  selectedMatterTypeName: string;
  selectedSubMatterTypeName: string;
  selectedSubMatterTypeId: number;
  goBack: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  onUploadSuccess: () => void;
}

const MainApp: React.FC<MainAppProps> = ({
  token,
  selectedRoles,
  selectedMatterTypeName,
  selectedSubMatterTypeName,
  selectedSubMatterTypeId,
  goBack,
  showToast,
  onUploadSuccess,
}) => {
  const [activeScreen, setActiveScreen] = useState<"tags" | "upload">("tags");
  const [activeTab, setActiveTab] = useState<"field" | "ask" | "ifthen">("field");
  const [tagMappings, setTagMappings] = useState<Record<string, string>>({});
  const [askQuestions, setAskQuestions] = useState<any[]>([]);
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showRelatedMatters, setShowRelatedMatters] = useState(false);
  const [selectedMatterData, setSelectedMatterData] = useState<any>(null);
  const [firmData, setFirmData] = useState<any>(null);
  const [isTagsVisible, setIsTagsVisible] = useState(true);

  useEffect(() => {
    if (typeof Office !== "undefined" && Office.onReady) {
      Office.onReady(() => {
        setIsOfficeReady(true);
      });
    } else {
      console.error(
        "Office.js is not loaded. Ensure the add-in is running in the Office environment."
      );
    }
  }, []);

  useEffect(() => {
    // Keep existing tag generation for the UI
    const mappings = generateDefaultTagMappings(selectedRoles, askQuestions);
    console.log(JSON.stringify(mappings));
    setTagMappings(mappings);
  }, []);

  useEffect(() => {
    if (activeTab === "ask" && selectedSubMatterTypeId) {
      const fetchTags = async () => {
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          const response = await fetch(
            `http://localhost:5000/api/precedent-tags/fetchByMatterTypeId/${selectedSubMatterTypeId}`,
            requestOptions
          );
          const result = await response.json();

          if (result.success) {
            setAskQuestions(
              result.data.map((tag: any) => ({
                fieldName: tag.tagName.replace("<<Question.", "").replace(">>", ""),
                questionText: tag.label,
                answerType: tag.inputType,
                tag: tag.tagName,
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      fetchTags();
    }
  }, [activeTab, selectedSubMatterTypeId, token]);

  useEffect(() => {
    if (token && selectedMatterData?.company?.identifier) {
      // Use the actual company ID from matter data
      const companyId = selectedMatterData.company.identifier;
      console.log("Fetching company data for ID:", companyId);

      const fetchCompanyData = async () => {
        try {
          const data = await getFirmData(token, companyId);
          if (data) {
            console.log("Company data received:", data);
            setFirmData(data);
            showToast("Company data loaded successfully", "success");
          } else {
            showToast("Failed to load company data", "error");
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
          showToast("Error loading company data", "error");
        }
      };

      fetchCompanyData();
    }
  }, [token, selectedMatterData]);

  // Log when matter data changes
  useEffect(() => {
    if (selectedMatterData) {
      console.log("Matter data updated:", selectedMatterData);
    }
  }, [selectedMatterData]);

  const insertTag = (tag: string) => {
    if (isOfficeReady) {
      Word.run(async (context) => {
        const body = context.document.body;
        body.insertText(`<<${tag}>>`, Word.InsertLocation.end);
        await context.sync();
        showToast("Tag inserted successfully", "success");
      }).catch((error) => {
        console.error("Error inserting tag:", error);
        showToast("Error inserting tag", "error");
      });
    } else {
      showToast("Office API is not ready. Please try again.", "error");
    }
  };

  const handleAddAskTag = () => {
    setShowAskModal(true);
  };

  const handleCloseAskModal = () => {
    setShowAskModal(false);
  };

  const handleSaveTags = () => {
    setActiveScreen("upload");
  };

  const handleMatterSelect = async (matter: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/matters/${matter.identifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setSelectedMatterData(result.data);
        console.log("Selected matter data:", selectedMatterData);
      } else {
        console.error("Failed to fetch matter details");
      }
    } catch (error) {
      console.error("Error fetching matter details:", error);
    }
  };

  const handleToggleTags = async () => {
    if (!isOfficeReady) {
      showToast("Office API is not ready", "error");
      return;
    }

    try {
      await Word.run(async (context) => {
        if (isTagsVisible) {
          await replaceTagsWithData(context, selectedMatterData, firmData);
        } else {
          await revertDataToTags(context, selectedMatterData, firmData);
        }
        setIsTagsVisible(!isTagsVisible);
        showToast(isTagsVisible ? "Tags replaced with data" : "Data reverted to tags", "success");
      });
    } catch (error) {
      console.error("Error toggling tags:", error);
      showToast("Error toggling tags", "error");
    }
  };

  const renderTagScreen = () => (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" onClick={() => setShowRelatedMatters(true)}>
          Select Related Matter
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleToggleTags}
          disabled={!isOfficeReady || !selectedMatterData || !firmData}
        >
          {isTagsVisible ? "Replace Tags with Data" : "Show Tags"}
        </button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "field" ? "active" : ""}`}
            onClick={() => setActiveTab("field")}
          >
            Field
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ask" ? "active" : ""}`}
            onClick={() => setActiveTab("ask")}
          >
            Ask
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ifthen" ? "active" : ""}`}
            onClick={() => setActiveTab("ifthen")}
          >
            If / Then / Else
          </button>
        </li>
      </ul>

      {activeTab === "field" && (
        <div className="mt-3">
          <TagAccordion
            tagMappings={tagMappings}
            onInsertTag={insertTag}
            matterData={selectedMatterData}
            firmData={firmData}
            showValues={!isTagsVisible}
          />
        </div>
      )}

      {activeTab === "ask" && (
        <div className="mt-3">
          <button className="btn btn-primary mb-3" onClick={handleAddAskTag}>
            Add Ask Tag
          </button>
          <AskTagTable onInsertTag={insertTag} askQuestions={askQuestions} />
          {showAskModal && (
            <AskModal
              questions={askQuestions}
              setQuestions={setAskQuestions}
              token={token}
              subMatterTypeId={selectedSubMatterTypeId}
              onClose={handleCloseAskModal}
            />
          )}
        </div>
      )}

      {activeTab === "ifthen" && (
        <div className="mt-3">
          <p>
            <strong>If / Then / Else logic builder coming soon…</strong>
          </p>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-end">
        <button className="btn btn-primary" onClick={handleSaveTags}>
          Save and Continue
        </button>
      </div>
    </>
  );

  return (
    <div className="container shadow-sm p-4 bg-white rounded">
      <button className="btn btn-link mb-3" onClick={goBack}>
        ← Back to Matter Type
      </button>

      <p>
        <strong>Matter:</strong> {selectedMatterData?.title}
      </p>

      <div className="mb-3">
        <h5 className="text-primary fw-bold">{selectedMatterTypeName}</h5>
        <p className="text-secondary">{selectedSubMatterTypeName}</p>
      </div>

      {activeScreen === "tags" && renderTagScreen()}

      {activeScreen === "upload" && (
        <div className="mt-4">
          <button className="btn btn-link mb-3" onClick={() => setActiveScreen("tags")}>
            ← Back to Tags
          </button>
          <UploadSection
            token={token}
            subMatterId={selectedSubMatterTypeId}
            matterTypeId={selectedMatterData?.matterType?.id}
            showToast={showToast}
            onUploadSuccess={onUploadSuccess}
          />
        </div>
      )}

      {showRelatedMatters && (
        <RelatedMatters
          token={token}
          selectedSubMatterTypeId={selectedSubMatterTypeId}
          onMatterSelect={handleMatterSelect}
          show={showRelatedMatters}
          onClose={() => setShowRelatedMatters(false)}
        />
      )}
    </div>
  );
};

export default MainApp;
