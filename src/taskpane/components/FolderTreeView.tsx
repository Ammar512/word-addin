import React, { useState, useEffect } from "react";
import { Modal } from "@fluentui/react";

interface Props {
  token: string;
  onFolderSelect: (folderId: number) => void;
  selectedMatterTypeId?: number;
  selectedSubMatterTypeId?: number;
}

interface NewFolderModalState {
  isOpen: boolean;
  parentId: number | null;
  folderName: string;
}

const FolderTreeView: React.FC<Props> = ({ token, onFolderSelect, selectedSubMatterTypeId }) => {
  const [folders, setFolders] = useState<any[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFolderModal, setNewFolderModal] = useState<NewFolderModalState>({
    isOpen: false,
    parentId: null,
    folderName: "",
  });

  useEffect(() => {
    fetchFolders();
  }, [token]);

  // When submatter type changes, find and select the matching folder
  useEffect(() => {
    if (folders.length > 0 && selectedSubMatterTypeId) {
      const folder = findFolderById(folders, selectedSubMatterTypeId);
      if (folder) {
        setSelectedFolder(selectedSubMatterTypeId);
        onFolderSelect(selectedSubMatterTypeId);

        // Expand parent folders
        const parents = findParentFolders(folders, folder.id);
        setExpandedFolders(new Set(parents.map((f) => f.id)));
      }
    }
  }, [selectedSubMatterTypeId, folders]);

  const findParentFolders = (items: any[], targetId: number): any[] => {
    const parents: any[] = [];

    const findParent = (nodes: any[], id: number): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          return true;
        }

        if (node.children) {
          if (findParent(node.children, id)) {
            parents.push(node);
            return true;
          }
        }
      }
      return false;
    };

    findParent(items, targetId);
    return parents;
  };

  const findFolderById = (items: any[], id: number): any | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFolderById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const filterFolderTree = (folder: any): any | null => {
    // If this is the selected submatter type folder, return it
    if (folder.id === selectedSubMatterTypeId) {
      return { ...folder, children: folder.children || [] };
    }

    // If this folder has children, check them
    if (folder.children && folder.children.length > 0) {
      const filteredChildren = folder.children
        .map((child: any) => filterFolderTree(child))
        .filter(Boolean);

      if (filteredChildren.length > 0) {
        return {
          ...folder,
          children: filteredChildren,
        };
      }
    }

    return null;
  };

  const fetchFolders = async () => {
    try {
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/folders/foldersWithFiles",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        // Store the full folder tree
        setFolders(result.data);
        setError(null);
      } else {
        const errorMessage =
          result.message || "Failed to load folders. Invalid data structure received.";
        console.error("API Error:", result);
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred while loading folders";
      console.error("Fetch Error:", error);
      setError(`Error loading folders: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const createNewFolder = async (parentId: number, name: string) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          folderType: "precedent",
          parentId: parentId,
          matterTypeId: selectedSubMatterTypeId,
        }),
      };

      const response = await fetch("http://localhost:5000/api/folders", requestOptions);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Refresh folders after creation
      await fetchFolders();

      // Expand the parent folder
      setExpandedFolders((prev) => new Set([...prev, parentId]));
    } catch (error) {
      console.error("Error creating folder:", error);
      setError("Failed to create new folder");
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderModal.parentId && newFolderModal.folderName.trim()) {
      await createNewFolder(newFolderModal.parentId, newFolderModal.folderName.trim());
      setNewFolderModal({ isOpen: false, parentId: null, folderName: "" });
    }
  };

  const toggleFolder = (e: React.MouseEvent, folderId: number) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
        // Also collapse all child folders
        const folder = findFolderById(folders, folderId);
        if (folder && folder.children) {
          const childIds = getAllChildFolderIds(folder);
          childIds.forEach((id) => next.delete(id));
        }
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const getAllChildFolderIds = (folder: any): number[] => {
    const ids: number[] = [];
    if (folder.children) {
      for (const child of folder.children) {
        ids.push(child.id);
        ids.push(...getAllChildFolderIds(child));
      }
    }
    return ids;
  };

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolder(folderId);
    onFolderSelect(folderId);
  };

  const renderFolder = (folder: any, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder === folder.id;

    return (
      <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          onClick={() => handleFolderSelect(folder.id)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 8px",
            cursor: "pointer",
            backgroundColor: isSelected ? "#e6f3ff" : "transparent",
            borderRadius: "4px",
            transition: "all 0.2s ease",
            marginBottom: "2px",
            border: isSelected ? "1px solid #0078d4" : "1px solid transparent",
            position: "relative",
          }}
          className={`folder-item ${isSelected ? "selected" : ""}`}
        >
          {hasChildren && (
            <div
              onClick={(e) => toggleFolder(e, folder.id)}
              style={{
                marginRight: "8px",
                padding: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
              }}
            >
              <span
                style={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  display: "inline-block",
                  fontSize: "10px",
                }}
              >
                ▶
              </span>
            </div>
          )}
          {!hasChildren && <div style={{ width: "28px" }} />}
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <span style={{ marginRight: "8px" }}>📁</span>
            <span className="folder-name">{folder.name}</span>
          </div>
          <div
            className="create-folder-btn"
            onClick={(e) => {
              e.stopPropagation();
              setNewFolderModal({ isOpen: true, parentId: folder.id, folderName: "" });
            }}
            style={{
              opacity: 0,
              marginLeft: "8px",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
            }}
          >
            ➕
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="folder-children">
            {folder.children.map((child: any) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading folders...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  // Filter the folder tree based on selected submatter type
  const relevantFolders = folders.map((folder) => filterFolderTree(folder)).filter(Boolean);

  return (
    <>
      <div
        className="folder-tree border rounded p-3"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <h6 className="mb-3">Select Destination Folder</h6>
        <style>{`
          .folder-item {
            position: relative;
          }
          .folder-item:hover {
            background-color: #f5f5f5 !important;
          }
          .folder-item:hover .create-folder-btn {
            opacity: 1 !important;
          }
          .folder-item.selected {
            background-color: #e6f3ff !important;
            border: 1px solid #0078d4 !important;
          }
          .folder-item.selected:hover {
            background-color: #d1e9ff !important;
          }
          .folder-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .create-folder-btn {
            transition: opacity 0.2s ease;
          }
          .create-folder-btn:hover {
            background-color: #e0e0e0 !important;
          }
        `}</style>
        {relevantFolders.map((folder) => renderFolder(folder))}
      </div>

      <Modal
        isOpen={newFolderModal.isOpen}
        onDismiss={() => setNewFolderModal({ isOpen: false, parentId: null, folderName: "" })}
        isBlocking={false}
      >
        <div style={{ padding: "20px" }}>
          <h2>Create New Folder</h2>
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              value={newFolderModal.folderName}
              onChange={(e) =>
                setNewFolderModal((prev) => ({ ...prev, folderName: e.target.value }))
              }
              placeholder="Enter folder name"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setNewFolderModal({ isOpen: false, parentId: null, folderName: "" })}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#f0f0f0",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#0078d4",
                  color: "white",
                }}
                disabled={!newFolderModal.folderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FolderTreeView;
