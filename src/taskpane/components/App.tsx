// src/taskpane/components/App.tsx
import React, { useState } from "react";
import Login from "./Login";
import MatterSelection from "./MatterSelection";
import MainApp from "./MainApp";
import Toast from "./Toast";
import { matterData as matterConst } from "../utils/tagUtils";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

const App = () => {
  const [screen, setScreen] = useState<"login" | "matter" | "app">("login");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const [selectedMatterTypeName, setSelectedMatterTypeName] = useState("");
  const [selectedSubMatterTypeName, setSelectedSubMatterTypeName] = useState("");
  const [selectedSubMatterTypeId, setSelectedSubMatterTypeId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const resetToMatterSelection = () => {
    setScreen("matter");
    setSelectedRoles([]);
    setSelectedMatterTypeName("");
    setSelectedSubMatterTypeName("");
    setSelectedSubMatterTypeId(null);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  return (
    <div className="app-container">
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {screen === "login" && (
        <Login
          onLogin={(token) => {
            setAuthToken(token);
            setScreen("matter");
            showToast("Successfully logged in", "success");
          }}
        />
      )}
      {screen === "matter" && (
        <MatterSelection
          token={authToken}
          onMatterSelected={(_data, roles, matterType, subMatterType, subMatterId) => {
            setSelectedRoles(roles);
            setSelectedMatterTypeName(matterType);
            setSelectedSubMatterTypeName(subMatterType);
            setSelectedSubMatterTypeId(subMatterId);
            setScreen("app");
          }}
          showToast={showToast}
          onSuccess={resetToMatterSelection}
        />
      )}
      {screen === "app" && (
        <MainApp
          token={authToken}
          selectedRoles={selectedRoles}
          selectedMatterTypeName={selectedMatterTypeName}
          selectedSubMatterTypeName={selectedSubMatterTypeName}
          selectedSubMatterTypeId={selectedSubMatterTypeId}
          goBack={resetToMatterSelection}
          showToast={showToast}
          onUploadSuccess={resetToMatterSelection}
        />
      )}
    </div>
  );
};

export default App;
