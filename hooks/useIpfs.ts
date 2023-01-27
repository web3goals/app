import { Web3Storage } from "web3.storage";
import axios from "axios";

/**
 * Hook for work with IPFS.
 */
export default function useIpfs() {
  const ipfsUriPrefix = "ipfs://";
  const web3Storage = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY || "",
    endpoint: new URL("https://api.web3.storage"),
  });

  let uploadFileToIpfs = async function (file: any) {
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const uri = `${ipfsUriPrefix}${cid}`;
    return { cid, uri };
  };

  let uploadJsonToIpfs = async function (json: object) {
    const file = new File([JSON.stringify(json)], "", {
      type: "text/plain",
    });
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const uri = `${ipfsUriPrefix}${cid}`;
    return { cid, uri };
  };

  let loadJsonFromIpfs = async function (uri: string) {
    const response = await axios.get(ipfsUriToHttpUri(uri));
    if (response.data.errors) {
      throw new Error(
        `Fail to loading json from IPFS: ${response.data.errors}`
      );
    }
    return response.data;
  };

  let ipfsUriToHttpUri = function (ipfsUri: string): string {
    if (!ipfsUri || !ipfsUri.startsWith(ipfsUriPrefix)) {
      throw new Error(`Fail to converting IPFS URI to HTTP URI: ${ipfsUri}`);
    }
    return ipfsUri.replace("ipfs://", "https://w3s.link/ipfs/");
  };

  return {
    uploadFileToIpfs,
    uploadJsonToIpfs,
    loadJsonFromIpfs,
    ipfsUriToHttpUri,
  };
}
