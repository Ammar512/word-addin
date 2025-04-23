import React from "react";

type AskTagTableProps = {
  askQuestions: any[];
  onInsertTag: (tag: string) => void;
};

const AskTagTable: React.FC<AskTagTableProps> = ({ askQuestions, onInsertTag }) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Question</th>
        </tr>
      </thead>
      <tbody>
        {askQuestions.length > 0 ? (
          askQuestions.map((q, idx) => (
            <tr
              onDoubleClick={() => onInsertTag(`${q.tag.replace("<<", "").replace(">>", "")}`)} // Insert tag in the correct format
              key={idx}
            >
              <td>{q.fieldName}</td>
              <td>{q.questionText}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="text-center">
              No ask tags available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AskTagTable;
