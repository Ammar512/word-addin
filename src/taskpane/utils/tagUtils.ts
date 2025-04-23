export let matterData = {
  matterId: 3,
  customMatterId: "testing2025030002",
  title: "TESTING CRIMINAL CASE with custom form field - Agency - Criminal",
  description: "TESTING CRIMINAL CASE with custom form field - Agency - Criminal",
  companyId: 1,
  createdAt: 1743128592,
  updatedAt: 1743135011,
  status: "open",
  openingDate: 1737166248,
  closingDate: null,
  state: {
    id: 7,
    name: "Victoria",
  },
  company: {
    id: 1,
    name: "sample Company 1",
  },
  matterType: {
    id: 56,
    name: "agencylitigation",
    label: "Agency Litigation",
  },
  referralType: null,
  createdBy: {
    id: 2,
    username: "companyAdmin2",
    firstName: "companyAdmin2",
    lastName: "",
  },
  updatedBy: {
    id: 2,
    username: "companyAdmin2",
    firstName: "companyAdmin2",
    lastName: "",
  },
  assignedUser: {
    id: 2,
    username: "companyAdmin2",
    firstName: "companyAdmin2",
    lastName: "",
  },
  assistant: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
  },
  introducer: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
  },
  referrer: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
  },
  participants: [
    {
      matterParticipantId: 3,
      participantRoleId: 29,
      contactRelation: "Client",
      isPrimary: 1,
      participantType: "standard",
      ContactDetails: {
        id: 1,
        name: "Witness for sample",
        email: "john.doe@example.com",
        phone: 1122334455,
      },
      role: {
        id: 29,
        roleName: "Solicitor",
      },
      childRoles: [],
      formData: null,
    },
    {
      matterParticipantId: 3,
      participantRoleId: 29,
      contactRelation: "Client",
      isPrimary: 1,
      participantType: "standard",
      ContactDetails: {
        id: 1,
        name: "Witness for sample",
        email: "john.doe@example.com",
        phone: 1122334455,
      },
      role: {
        id: 29,
        roleName: "Barrister",
      },
      childRoles: [],
      formData: null,
    },
    {
      matterParticipantId: 4,
      participantRoleId: 78,
      contactRelation: "neutral",
      isPrimary: 0,
      participantType: "custom",
      contactInfo: {
        id: null,
        name: null,
        email: null,
        phone: null,
      },
      role: {
        id: 78,
        roleName: "Debt Details",
      },
      childRoles: [],
      formData: {
        Case: { Number: 6672 },
        debtDetails: {
          debts: [
            {
              amount: 20000,
              description: "Personal Loan from Bank A",
              dateIncurred: "2022-06-15",
            },
            {
              amount: 15000,
              description: "Credit Card Debt",
              dateIncurred: "2023-01-10",
            },
            {
              amount: 15000,
              description: "Car Loan",
              dateIncurred: "2021-09-25",
            },
          ],
          paymentRecord: [
            {
              description: "Payment towards Personal Loan",
              paymentDate: "2024-01-05",
              paymentAmount: 5000,
            },
            {
              description: "Credit Card Minimum Payment",
              paymentDate: "2024-02-10",
              paymentAmount: 2000,
            },
            {
              description: "Car Loan Installment",
              paymentDate: "2024-02-15",
              paymentAmount: 3000,
            },
          ],
          totalDebtAmount: 50000,
        },
      },
    },
  ],
};

export const PREDEFINED_TAG_MAPPINGS = {
  firmDetails: [
    {
      tagName: "firmName",
      mappedTable: "firm_details",
      mappedColumn: "firmName",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "firmType",
      mappedTable: "firm_details",
      mappedColumn: "firmType",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "acn",
      mappedTable: "firm_details",
      mappedColumn: "acn",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "abn",
      mappedTable: "firm_details",
      mappedColumn: "abn",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "phone",
      mappedTable: "firm_details",
      mappedColumn: "phone",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "fax",
      mappedTable: "firm_details",
      mappedColumn: "fax",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "email",
      mappedTable: "firm_details",
      mappedColumn: "email",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "address",
      mappedTable: "firm_details",
      mappedColumn: "address",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "createdAt",
      mappedTable: "firm_details",
      mappedColumn: "createdAt",
      mappedCondition: "companyId = {companyId}",
    },
    {
      tagName: "updatedAt",
      mappedTable: "firm_details",
      mappedColumn: "updatedAt",
      mappedCondition: "companyId = {companyId}",
    },
  ],
  matterInfo: [
    {
      tagName: "matterNumber",
      mappedTable: "matters",
      mappedColumn: "id",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "matterReference",
      mappedTable: "matters",
      mappedColumn: "title",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "matterType",
      mappedTable: "matter_types",
      mappedColumn: "name",
      mappedCondition:
        "companyId = {companyId} AND id = (SELECT matterTypeId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "matterStatus",
      mappedTable: "matters",
      mappedColumn: "status",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "stateShort",
      mappedTable: "country_states",
      mappedColumn: "stateCode",
      mappedCondition:
        "id = (SELECT stateId FROM matters WHERE companyId = {companyId} AND id = {matterId})",
    },
    {
      tagName: "stateFull",
      mappedTable: "country_states",
      mappedColumn: "stateName",
      mappedCondition:
        "id = (SELECT stateId FROM matters WHERE companyId = {companyId} AND id = {matterId})",
    },
    {
      tagName: "openedDate",
      mappedTable: "matters",
      mappedColumn: "openingDate",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "closedDate",
      mappedTable: "matters",
      mappedColumn: "closingDate",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "documentCreationDate",
      mappedTable: "matters",
      mappedColumn: "createdAt",
      mappedCondition: "companyId = {companyId} AND id = {matterId}",
    },
    {
      tagName: "supervisorFullName",
      mappedTable: "users",
      mappedColumn: "username",
      mappedCondition:
        "companyId = {companyId} AND id = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "supervisorPhone",
      mappedTable: "user_profiles",
      mappedColumn: "phoneNumber",
      mappedCondition:
        "companyId = {companyId} AND userId = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "supervisorEmail",
      mappedTable: "users",
      mappedColumn: "email",
      mappedCondition:
        "companyId = {companyId} AND id = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "personResponsibleFullName",
      mappedTable: "users",
      mappedColumn: "username",
      mappedCondition:
        "companyId = {companyId} AND id = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "personResponsiblePhone",
      mappedTable: "user_profiles",
      mappedColumn: "phoneNumber",
      mappedCondition:
        "companyId = {companyId} AND userId = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
    {
      tagName: "billingHourlyRate",
      mappedTable: "activity_rates",
      mappedColumn: "rate",
      mappedCondition:
        "companyId = {companyId} AND staffId = (SELECT assignedUserId FROM matters WHERE id = {matterId})",
    },
  ],
};

export const COMMON_CONTACT_TAGS = [
  "name", // org
  "givenName",
  "middleName",
  "lastName",
  "email",
  "mobile",
  "homePhone",
  "workPhone",
  "phone",
  "fax",
  "website",
  "addresses.line1",
  "addresses.line2",
  "addresses.city",
  "addresses.state",
  "addresses.postcode",
  "addresses.country",
  "bankDetails.accountName",
  "bankDetails.bsb",
  "bankDetails.accountNumber",
  "passportDetails.number",
  "passportDetails.countryOfIssue",
  "identificationNumbers.driverLicenseNumber",
  "citizenshipDetails.nationality",
];

export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+(.)/g, (_match, char) => char.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, (_match, char) => char.toUpperCase());
}

export const formatToCamelCase = (str: string) =>
  str
    .replace(/[^a-zA-Z0-9]/g, " ") // Replace special characters with spaces
    .split(" ")
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

export function generateTagMappings(matterData: any, askQuestions: any[]) {
  const tagMappings: Record<string, string> = {};

  // Map company/firm details
  if (matterData?.company) {
    PREDEFINED_TAG_MAPPINGS.firmDetails.forEach((item) => {
      tagMappings[`Firm.${toPascalCase(item.mappedColumn)}`] = `company.${item.mappedColumn}`;
    });
  }

  // Map all matter information
  if (matterData) {
    // Standard matter fields
    tagMappings["Matter.Id"] = "id";
    tagMappings["Matter.CustomId"] = "customMatterId";
    tagMappings["Matter.Title"] = "title";
    tagMappings["Matter.Description"] = "description";
    tagMappings["Matter.Status"] = "status";
    tagMappings["Matter.OpeningDate"] = "openingDate";
    tagMappings["Matter.ClosingDate"] = "closingDate";
    tagMappings["Matter.CreatedAt"] = "createdAt";
    tagMappings["Matter.UpdatedAt"] = "updatedAt";

    // State information
    if (matterData.state) {
      tagMappings["Matter.StateId"] = "state.id";
      tagMappings["Matter.StateName"] = "state.name";
    }

    // Matter type information
    if (matterData.matterType) {
      tagMappings["Matter.TypeId"] = "matterType.id";
      tagMappings["Matter.TypeName"] = "matterType.name";
      tagMappings["Matter.TypeLabel"] = "matterType.label";
    }

    // Pre-defined matter info mappings
    PREDEFINED_TAG_MAPPINGS.matterInfo.forEach((item) => {
      tagMappings[`Matter.${toPascalCase(item.tagName)}`] = item.mappedColumn;
    });

    // User information
    if (matterData.createdBy) {
      tagMappings["Matter.CreatedBy.Id"] = "createdBy.id";
      tagMappings["Matter.CreatedBy.Username"] = "createdBy.username";
      tagMappings["Matter.CreatedBy.FirstName"] = "createdBy.firstName";
      tagMappings["Matter.CreatedBy.LastName"] = "createdBy.lastName";
    }

    if (matterData.assignedUser) {
      tagMappings["Matter.AssignedUser.Id"] = "assignedUser.id";
      tagMappings["Matter.AssignedUser.Username"] = "assignedUser.username";
      tagMappings["Matter.AssignedUser.FirstName"] = "assignedUser.firstName";
      tagMappings["Matter.AssignedUser.LastName"] = "assignedUser.lastName";
    }
  }

  // Map participant roles and their details
  if (matterData?.participants) {
    matterData.participants.forEach((participant: any) => {
      if (participant.role) {
        const roleKey = toPascalCase(participant.role.roleName);
        // Base role information
        tagMappings[`${roleKey}.Id`] = `participants.${roleKey}.matterParticipantId`;
        tagMappings[`${roleKey}.RoleId`] = `participants.${roleKey}.participantRoleId`;
        tagMappings[`${roleKey}.Relation`] = `participants.${roleKey}.contactRelation`;
        tagMappings[`${roleKey}.IsPrimary`] = `participants.${roleKey}.isPrimary`;
        tagMappings[`${roleKey}.Type`] = `participants.${roleKey}.participantType`;

        // Contact details
        if (participant.ContactDetails || participant.contactInfo) {
          const contactInfo = participant.ContactDetails || participant.contactInfo;
          COMMON_CONTACT_TAGS.forEach((field) => {
            const label = field.split(".")[0];
            tagMappings[`${roleKey}.${toPascalCase(label)}`] =
              `participants.${roleKey}.contactInfo.${field}`;
          });
        }
      }
    });
  }

  // Map ask questions
  askQuestions.forEach((q) => {
    tagMappings[`Ask.${toPascalCase(q.fieldName)}`] = `askQuestions.${q.fieldName}`;
  });

  return tagMappings;
}

export function mapMatterDataToTags(matterData: any) {
  const tagMappings: Record<string, string> = {};

  try {
    // Map matter information
    if (matterData) {
      // Basic matter details based on the provided mapping
      tagMappings["Matter.MatterNumber"] = matterData.customMatterId || "";
      tagMappings["Matter.MatterReference"] = matterData.title || "";
      tagMappings["Matter.MatterStatus"] = matterData.status || "";
      tagMappings["Matter.OpenedDate"] = matterData.openingDate
        ? new Date(matterData.openingDate * 1000).toLocaleDateString()
        : "";
      tagMappings["Matter.ClosedDate"] = matterData.closingDate
        ? new Date(matterData.closingDate * 1000).toLocaleDateString()
        : "";
      tagMappings["Matter.DocumentCreationDate"] = matterData.createdAt
        ? new Date(matterData.createdAt * 1000).toLocaleDateString()
        : "";

      // State information
      if (matterData.state) {
        tagMappings["Matter.StateShort"] = matterData.state.stateCode || "";
        tagMappings["Matter.StateFull"] = matterData.state.stateName || "";
      }

      // Matter type information
      if (matterData.matterType) {
        tagMappings["Matter.MatterType"] = matterData.matterType.name || "";
      }

      // User/Supervisor information
      if (matterData.assignedUser) {
        if (matterData.assignedUser.profile) {
          tagMappings["Matter.SupervisorFullName"] =
            matterData.assignedUser.profile.firstName || "";
          tagMappings["Matter.SupervisorPhone"] = matterData.assignedUser.profile.phoneNumber || "";
          tagMappings["Matter.PersonResponsibleFullName"] =
            matterData.assignedUser.profile.firstName || "";
          tagMappings["Matter.PersonResponsiblePhone"] =
            matterData.assignedUser.profile.phoneNumber || "";
        }
        if (matterData.assignedUser.user) {
          tagMappings["Matter.SupervisorEmail"] = matterData.assignedUser.user.email || "";
        }
      }

      // Map participants and their roles - using exact role names
      if (matterData.participants && Array.isArray(matterData.participants)) {
        matterData.participants.forEach((participant) => {
          if (participant.role && (participant.ContactDetails || participant.contactInfo)) {
            // Use exact role name without modification
            const roleKey = participant.role.roleName;
            const contactInfo = participant.ContactDetails || participant.contactInfo;

            // Map all available contact information
            tagMappings[`${roleKey}.Name`] = contactInfo.name || "";
            tagMappings[`${roleKey}.Email`] = contactInfo.email || "";
            tagMappings[`${roleKey}.Phone`] = contactInfo.phone?.toString() || "";

            // Additional contact details
            if (contactInfo.givenName) tagMappings[`${roleKey}.GivenName`] = contactInfo.givenName;
            if (contactInfo.middleName)
              tagMappings[`${roleKey}.MiddleName`] = contactInfo.middleName;
            if (contactInfo.lastName) tagMappings[`${roleKey}.LastName`] = contactInfo.lastName;
            if (contactInfo.mobile) tagMappings[`${roleKey}.Mobile`] = contactInfo.mobile;
            if (contactInfo.homePhone) tagMappings[`${roleKey}.HomePhone`] = contactInfo.homePhone;
            if (contactInfo.workPhone) tagMappings[`${roleKey}.WorkPhone`] = contactInfo.workPhone;
            if (contactInfo.fax) tagMappings[`${roleKey}.Fax`] = contactInfo.fax;
            if (contactInfo.website) tagMappings[`${roleKey}.Website`] = contactInfo.website;

            // Role-specific information
            tagMappings[`${roleKey}.Id`] = participant.matterParticipantId?.toString() || "";
            tagMappings[`${roleKey}.RoleId`] = participant.participantRoleId?.toString() || "";
            tagMappings[`${roleKey}.Relation`] = participant.contactRelation || "";
            tagMappings[`${roleKey}.IsPrimary`] = participant.isPrimary?.toString() || "";
            tagMappings[`${roleKey}.Type`] = participant.participantType || "";
          }
        });
      }
    }

    console.log("Generated tag mappings:", tagMappings);
    return tagMappings;
  } catch (error) {
    console.error("Error mapping matter data to tags:", error);
    return {};
  }
}

export function generateCotainierTagMappings() {
  const tagMappings: Record<string, string> = {};
  PREDEFINED_TAG_MAPPINGS.firmDetails.forEach((item) => {
    tagMappings[`Firm.${toPascalCase(item.mappedColumn)}`] = `company.${item.mappedColumn}`;
  });

  return tagMappings;
}

export function generateDefaultTagMappings(selectedRoles: any[], askQuestions: any[]) {
  const tagMappings: Record<string, string> = {};
  PREDEFINED_TAG_MAPPINGS.firmDetails.forEach((item) => {
    tagMappings[`Firm.${toPascalCase(item.mappedColumn)}`] = `company.${item.mappedColumn}`;
  });

  PREDEFINED_TAG_MAPPINGS.matterInfo.forEach((item) => {
    tagMappings[`Matter.${toPascalCase(item.tagName)}`] = item.mappedColumn;
  });

  selectedRoles.forEach((role) => {
    const key = toPascalCase(role.roleLabel || "Role");
    COMMON_CONTACT_TAGS.forEach((field) => {
      const label = field.split(".")[0];
      tagMappings[`${key}.${toPascalCase(label)}`] = `participants.${key}.${field}`;
    });
  });

  askQuestions.forEach((q) => {
    tagMappings[`Ask.${toPascalCase(q.fieldName)}`] = `askQuestions.${q.fieldName}`;
  });

  return tagMappings;
}

export async function getFirmData(token: string, companyId: string | number) {
  console.log("Fetching firm data for company ID:", companyId);
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `http://localhost:5000/api/companies/${companyId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Company API response:", result);

    if (result.message === "Event retrieved successfully") {
      return result.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching firm data:", error);
    throw error;
  }
}

export function getValueFromPath(obj: any, path: string): any {
  if (!obj || !path) return "";

  // Handle nested paths and array access
  const parts = path.split(".");
  let result = obj;

  for (const part of parts) {
    if (result === null || result === undefined) return "";

    // Handle array access if needed
    if (part.includes("[") && part.includes("]")) {
      const arrayName = part.split("[")[0];
      const index = parseInt(part.split("[")[1].split("]")[0]);
      result = result[arrayName]?.[index];
    } else {
      result = result[part];
    }
  }

  // Convert timestamps to dates if needed
  if (typeof result === "number" && String(result).length === 10) {
    // Likely a Unix timestamp
    const date = new Date(result * 1000);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  }

  return result || "";
}

export async function replaceTagsWithData(
  context: Word.RequestContext,
  matterData: any,
  firmData: any
) {
  try {
    const tagMappings: Record<string, string> = {};

    // Handle firm data
    if (firmData?.firmDetails) {
      Object.entries(PREDEFINED_TAG_MAPPINGS.firmDetails).forEach(([_, item]) => {
        const tagName = `Firm.${toPascalCase(item.mappedColumn)}`;
        const value = firmData.firmDetails[item.mappedColumn];
        if (value !== undefined && value !== null) {
          tagMappings[tagName] = value.toString();
        }
      });
    }

    // Handle matter data
    if (matterData) {
      // Basic matter details
      tagMappings["Matter.MatterNumber"] = matterData.customMatterId || "";
      tagMappings["Matter.MatterReference"] = matterData.title || "";
      tagMappings["Matter.MatterStatus"] = matterData.status || "";

      // Handle participants with the actual data structure
      if (matterData.participants && Array.isArray(matterData.participants)) {
        matterData.participants.forEach((participant) => {
          // Check if participant data exists and has the correct structure
          if (participant && participant.participantData) {
            const roleKey = participant.role?.roleName;
            const contactInfo = participant.participantData.contactInfo;

            if (roleKey && contactInfo) {
              // Map the contact info directly using the exact role name
              tagMappings[`${roleKey}.Name`] = contactInfo.name || contactInfo.title || "";
              tagMappings[`${roleKey}.Email`] = contactInfo.email || "";
              tagMappings[`${roleKey}.Phone`] =
                contactInfo.mobile?.toString() || contactInfo.phone?.toString() || "";
              tagMappings[`${roleKey}.Id`] = contactInfo.id?.toString() || "";
            }
          }
        });
      }
    }

    console.log("Final tag mappings:", tagMappings);

    // Get all tags in the document
    const body = context.document.body;
    body.load("text");
    await context.sync();

    const regex = /<<([^>]+)>>/g;
    const text = body.text;
    const matches = [...text.matchAll(regex)];

    // Process tags in reverse order
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const tag = match[1];
      const value = tagMappings[tag] || "";

      console.log(`Replacing tag: ${tag} with value: ${value}`);

      const range = context.document.body.search("<<" + tag + ">>", { matchWildcards: false });
      context.load(range);
      await context.sync();

      if (range.items.length > 0) {
        range.items[0].insertText(value, Word.InsertLocation.replace);
        await context.sync();
      }
    }
  } catch (error) {
    console.error("Error in replaceTagsWithData:", error);
    throw error;
  }
}

export async function revertDataToTags(
  context: Word.RequestContext,
  matterData: any,
  firmData: any
) {
  try {
    // Get the mapped tag values first to know what values to search for
    const tagMappings = mapMatterDataToTags(matterData);

    // Add firm data mappings
    if (firmData?.firmDetails) {
      PREDEFINED_TAG_MAPPINGS.firmDetails.forEach((item) => {
        const tagName = `Firm.${toPascalCase(item.mappedColumn)}`;
        const value = firmData.firmDetails[item.mappedColumn];
        if (value !== undefined && value !== null) {
          tagMappings[tagName] = value.toString();
        }
      });
    }

    const body = context.document.body;
    body.load("text");
    await context.sync();

    // Create an array of replacements sorted by length (longest first to avoid partial matches)
    const replacements = Object.entries(tagMappings)
      .filter(([_, value]) => value && value.length > 0)
      .sort((a, b) => b[1].length - a[1].length); // Sort by value length, longest first

    console.log("Reverting following mappings:", replacements);

    // Process each value-tag pair
    for (const [tag, value] of replacements) {
      // Search for the actual value in the document
      const searchResults = body.search(value, { matchCase: true, matchWildcards: false });
      context.load(searchResults);
      await context.sync();

      // Replace each occurrence of the value with its corresponding tag
      for (let i = 0; i < searchResults.items.length; i++) {
        searchResults.items[i].insertText(`<<${tag}>>`, Word.InsertLocation.replace);
        await context.sync();
      }
    }
  } catch (error) {
    console.error("Error in revertDataToTags:", error);
    throw error;
  }
}
