export const goalContractAbi = [
  {
    inputs: [],
    name: "AlreadyAccepted",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyWatcher",
    type: "error",
  },
  {
    inputs: [],
    name: "ArraysLengthInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "AuthorCannotBeWatcher",
    type: "error",
  },
  {
    inputs: [],
    name: "DeadlineMustBeAtLeast24HoursLater",
    type: "error",
  },
  {
    inputs: [],
    name: "GoalClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "MessageValueMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAchieved",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthor",
    type: "error",
  },
  {
    inputs: [],
    name: "ProfileAddressNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ProfileNotExists",
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
    name: "SendingStakeToWatcherFailed",
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
    inputs: [],
    name: "VerifierAddressNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "WatcherNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "achievedGoals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "failedGoals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "motivatedGoals",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.AccountReputation",
        name: "accountReputation",
        type: "tuple",
      },
    ],
    name: "AccountReputationSet",
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
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
    ],
    name: "AddedVerificationData",
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
            name: "verificationRequirement",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.GoalParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "ParamsSet",
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
    ],
    name: "SentToVerifier",
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
        name: "watcherAccountAddress",
        type: "address",
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
            name: "accountAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isAccepted",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct DataTypes.GoalWatcher",
        name: "watcher",
        type: "tuple",
      },
    ],
    name: "WatcherSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "watcherAddress",
        type: "address",
      },
    ],
    name: "acceptWatcher",
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
        internalType: "string[]",
        name: "verificationDataKeys",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "verificationDataValues",
        type: "string[]",
      },
    ],
    name: "addVerificationDataAndVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    name: "getAccountReputation",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "achievedGoals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "failedGoals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "motivatedGoals",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypes.AccountReputation",
        name: "",
        type: "tuple",
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
    name: "getHubAddress",
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
            name: "verificationRequirement",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.GoalParams",
        name: "",
        type: "tuple",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "key",
        type: "string",
      },
    ],
    name: "getVerificationData",
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
      {
        internalType: "string[]",
        name: "keys",
        type: "string[]",
      },
    ],
    name: "getVerificationDataList",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
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
    name: "getVerificationStatus",
    outputs: [
      {
        internalType: "bool",
        name: "isAchieved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isFailed",
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
    ],
    name: "getWatchers",
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
            name: "accountAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isAccepted",
            type: "bool",
          },
          {
            internalType: "string",
            name: "extraDataURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.GoalWatcher[]",
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
        name: "hubAddress",
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
        name: "verificationRequirement",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "verificationDataKeys",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "verificationDataValues",
        type: "string[]",
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
        internalType: "address",
        name: "hubAddress",
        type: "address",
      },
    ],
    name: "setHubAddress",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "verify",
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
    name: "watch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
