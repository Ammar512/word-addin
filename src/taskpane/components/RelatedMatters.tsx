import React, { useState, useEffect } from "react";
import { 
  Modal, 
  IIconProps,
  PrimaryButton,
  DefaultButton,
  Stack,
  Text,
  IconButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType
} from "@fluentui/react";

type Matter = {
  id: number;
  customMatterId: string;
  title: string;
  identifier: string;
};

type RelatedMattersProps = {
  token: string;
  selectedSubMatterTypeId: number | null;
  onMatterSelect: (matter: Matter) => void;
  show: boolean;
  onClose: () => void;
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const RelatedMatters: React.FC<RelatedMattersProps> = ({
  token,
  selectedSubMatterTypeId,
  onMatterSelect,
  show,
  onClose,
}) => {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSubMatterTypeId || !token || !show) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/matters/all?matterTypeIds=${selectedSubMatterTypeId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success && result.data) {
          setMatters(result.data);
        } else {
          setError("Failed to load related matters");
        }
      })
      .catch((error) => {
        console.error("Error fetching matters:", error);
        setError("An error occurred while loading related matters");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, selectedSubMatterTypeId, show]);

  const modalStyles = {
    main: {
      minWidth: '600px',
      maxWidth: '800px',
    },
  };

  return (
    <Modal
      isOpen={show}
      onDismiss={onClose}
      isBlocking={false}
      styles={modalStyles}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Text variant="xLarge">Related Matters</Text>
          <IconButton
            iconProps={cancelIcon}
            ariaLabel="Close popup"
            onClick={onClose}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spinner size={SpinnerSize.large} label="Loading related matters..." />
          </div>
        )}

        {error && (
          <MessageBar messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>
        )}

        {!loading && !error && matters.length > 0 && (
          <Stack tokens={{ childrenGap: 8 }}>
            {matters.map((matter) => (
              <DefaultButton
                key={matter.id}
                text={`${matter.title} (${matter.customMatterId})`}
                onClick={() => {
                  onMatterSelect(matter);
                  onClose();
                }}
                styles={{
                  root: {
                    width: '100%',
                    textAlign: 'left',
                    height: 'auto',
                    padding: '12px'
                  }
                }}
              />
            ))}
          </Stack>
        )}

        {!loading && !error && matters.length === 0 && (
          <MessageBar messageBarType={MessageBarType.info}>
            No related matters found
          </MessageBar>
        )}

        <Stack horizontal tokens={{ childrenGap: 8 }} style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          <PrimaryButton text="Close" onClick={onClose} />
        </Stack>
      </div>
    </Modal>
  );
};

export default RelatedMatters;