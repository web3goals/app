export const goalContractAbi = [
  {
    inputs: [],
    name: "AuthorCannotEvaluateOwnMessage",
    type: "error",
  },
  {
    inputs: [],
    name: "DeadlineMustBeAtLeast24HoursLater",
    type: "error",
  },
  {
    inputs: [],
    name: "EvaluationIncorrect",
    type: "error",
  },
  {
    inputs: [],
    name: "GoalClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageAlreadyEvaluated",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageValueMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthor",
    type: "error",
  },
  {
    inputs: [],
    name: "ProfileNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ProofsNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "SendingStakeToAuthorFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "SendingStakeToKeeperFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "SendingStakeToMotivatorFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "StakeInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenNotTransferable",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "authorStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadlineTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClosed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAchieved",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "ClosedAsAchieved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "authorStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadlineTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClosed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAchieved",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "ClosedAsFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "messageId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "addedTimestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isMotivating",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isSuperMotivating",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "MessageEvaluated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "messageId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "addedTimestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isMotivating",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isSuperMotivating",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "MessagePosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "motivatorAccountAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "accountAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "motivations",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "superMotivations",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalMotivator",
        name: "motivator",
        type: "tuple",
      },
    ],
    name: "MotivatorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "motivatorAccountAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "accountAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "motivations",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "superMotivations",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalMotivator",
        name: "motivator",
        type: "tuple",
      },
    ],
    name: "MotivatorUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "addedTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalProof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "ProofPosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "authorStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadlineTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClosed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAchieved",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.IndieGoalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "Set",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "close",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "messageId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isMotivating",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isSuperMotivating",
        type: "bool",
      },
    ],
    name: "evaluateMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getImageSVG",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getKeeperAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getMessages",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "addedTimestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isMotivating",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isSuperMotivating",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.IndieGoalMessage[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    name: "getMotivatorReputation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getMotivators",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "accountAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "motivations",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "superMotivations",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.IndieGoalMotivator[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address",
            name: "authorAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "authorStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadlineTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClosed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAchieved",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.IndieGoalParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProfileAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getProofs",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "addedTimestamp",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.IndieGoalProof[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    name: "getReputation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUsageFeePercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "profileAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "keeperAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "usageFeePercent",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "extraDataURI",
        type: "string",
      },
    ],
    name: "postMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "extraDataURI",
        type: "string",
      },
    ],
    name: "postProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadlineTimestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "extraDataURI",
        type: "string",
      },
    ],
    name: "set",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "imageSVG",
        type: "string",
      },
    ],
    name: "setImageSVG",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "keeperAddress",
        type: "address",
      },
    ],
    name: "setKeeperAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "profileAddress",
        type: "address",
      },
    ],
    name: "setProfileAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "usageFeePercent",
        type: "uint256",
      },
    ],
    name: "setUsageFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
