import React, { useState } from "react";
import { formatToCamelCase } from "../utils/tagUtils";

type AskModalProps = {
  questions: any[];
  setQuestions: (questions: any[]) => void;
  token: string;
  subMatterTypeId: number | null; // Add subMatterTypeId prop
  onClose: () => void;
};

const AskModal: React.FC<AskModalProps> = ({
  questions,
  setQuestions,
  token,
  subMatterTypeId,
  onClose,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerType, setAnswerType] = useState("text");
  const [defaultAnswer, setDefaultAnswer] = useState("none");

  const addQuestion = async () => {
    if (!fieldName || !questionText || !subMatterTypeId) return;

    const newQuestion = { fieldName, questionText, answerType, defaultAnswer };
    setQuestions([...questions, newQuestion]);
    setFieldName("");
    setQuestionText("");
    setAnswerType("text");

    const tagName = `<<Question.${formatToCamelCase(fieldName)}>>`;
    const raw = JSON.stringify([
      {
        tagName,
        tagType: "formTags",
        label: questionText,
        inputType: answerType,
        defaultValue: "",
        matterTypeId: subMatterTypeId,
      },
    ]);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: raw,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/precedent-tags/create",
        requestOptions
      );
      const result = await response.text();
      console.log("Tag saved:", result);

      // Fetch all tags for the sub-matter type
      const fetchOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const tagsResponse = await fetch(
        `http://localhost:5000/api/precedent-tags/fetchByMatterTypeId/${subMatterTypeId}`,
        fetchOptions
      );
      const tagsResult = await tagsResponse.json();
      if (tagsResult.success) {
        setQuestions(
          tagsResult.data.map((tag: any) => ({
            fieldName: tag.tagName.replace("<<Question.", "").replace(">>", ""),
            questionText: tag.label,
            answerType: tag.inputType,
          }))
        );
      }
    } catch (error) {
      console.error("Error saving tag or fetching tags:", error);
    }

    onClose(); // Close the modal after saving
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4">
        <div className="modal-header">
          <h5 className="modal-title">Add an Ask</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            id="askFieldName"
            className="form-control mb-2"
            placeholder="Field Name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <textarea
            id="askQuestionText"
            className="form-control mb-2"
            placeholder="Enter your question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <select
            id="askAnswerType"
            className="form-select mb-2"
            value={answerType}
            onChange={(e) => setAnswerType(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">True/False</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={addQuestion}>
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskModal;
