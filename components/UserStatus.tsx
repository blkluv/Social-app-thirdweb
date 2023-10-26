import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useDisconnect,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import Link from "next/link";
import { truncateAddress } from "../utils/truncateAddress";

export default function UserStatus() {
  const address = useAddress();
  const disconnect = useDisconnect();

  const [newStatus, setNewStatus] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
  const { data: myStatus, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getStatus",
    [address]
  );

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <ConnectWallet className="mt-4 bg-green-700" modalSize="compact" />
        <p className="mt-4">please connect you wallet</p>
      </div>
    );
  }
  return (
    <div>
      <header className="flex items-center justify-between">
        <Link className="flex items-center" href={`account/${address}`}>
          <p className="mr-2">{truncateAddress(address)}</p>
        </Link>
        <button
          className="bg-red-700 rounded-md m-2 p-2 text-lg font-bold"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </header>
      {!isMyStatusLoading && myStatus && (
        <div className="mt-4">
          <p>{myStatus}</p>
        </div>
      )}
      <button
        className="mt-4 bg-green-500 rounded-md m-2 p-2 text-lg font-bold"
        onClick={() => setIsStatusModalOpen(true)}
      >
        Update
      </button>
      {isStatusModalOpen && (
        <div className="flex flex-col items-center justify-center">
          <div className="mt-4 ">
            <p className="mb-2 ">New Status</p>
            <button
              className="bg-red-700 rounded-md m-2 p-2 text-lg font-bold"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Close
            </button>
          </div>
          <textarea
            className="mt-4 bg-gray-500 rounded-md p-2 text-black"
            value={newStatus}
            onChange={(e) => {
              setNewStatus(e.target.value);
              setCharacterCount(e.target.value.length);
            }}
            placeholder="Enter your new status"
          />
          <div className="mt-4">
            <p className="mb-2 text-blue-600 font-bold">{characterCount}/400</p>
          </div>
          <div className="mt-4 bg-green-500 rounded-md m-2 p-2 text-lg font-bold">
            <Web3Button
              className="bg-green-500 rounded-md m-2 p-2 text-lg font-bold"
              contractAddress={STATUS_CONTRACT_ADDRESS}
              action={(contract) => contract.call("setStatus", [newStatus])}
              isDisabled={newStatus.length === 0 || newStatus.length > 400}
              onSuccess={() => {
                setIsStatusModalOpen(false);
                setNewStatus("");
                setCharacterCount(0);
              }}
            >
              Update Status
            </Web3Button>
          </div>
        </div>
      )}
    </div>
  );
}
