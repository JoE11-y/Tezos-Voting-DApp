import React, { Dispatch, SetStateAction } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Dropdown, Stack, Spinner } from "react-bootstrap";

interface ButtonProps {
    address: string,
    amount: number,
    wallet: BeaconWallet | null;
    setPublicToken: Dispatch<SetStateAction<string | null>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    setWallet: Dispatch<SetStateAction<any>>;
    setTezos: Dispatch<SetStateAction<TezosToolkit>>;
    setBeaconConnection: Dispatch<SetStateAction<boolean>>;
}

const Wallet: React.FC<ButtonProps> = ({
    address,
    amount,
    wallet,
    setPublicToken,
    setUserAddress,
    setUserBalance,
    setWallet,
    setTezos,
    setBeaconConnection }) => {

    const disconnectWallet = async (): Promise<void> => {
        if (wallet) {
            await wallet.clearActiveAccount();
        }
        setUserAddress("");
        setUserBalance(0);
        setWallet(null);
        const tezosTK = new TezosToolkit("https://ghostnet.ecadinfra.com");
        setTezos(tezosTK);
        setBeaconConnection(false);
        setPublicToken(null);
    };

    if (address) {
        return (
            <>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                        className="d-flex align-items-center border rounded-pill py-1"
                    >
                        {amount ? (
                            <p>
                                <i className="fas fa-piggy-bank"></i>&nbsp;
                                {(amount / 1000000).toLocaleString("en-US")} ꜩ
                            </p>

                        ) : (
                            <Spinner animation="border" size="sm" className="opacity-25" />
                        )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-lg border-0">
                        <Dropdown.Item
                            href={`https://better-call.dev/ghostnet/${address}`}
                            target="_blank"
                        >
                            <Stack direction="horizontal" gap={2}>
                                <i className="bi bi-person-circle fs-4" />
                                <span className="font-monospace">{address}</span>
                            </Stack>
                        </Dropdown.Item>

                        <Dropdown.Divider />
                        <Dropdown.Item
                            as="button"
                            className="d-flex align-items-center"
                            onClick={() => {
                                disconnectWallet();
                            }}
                        >
                            <i className="bi bi-box-arrow-right me-2 fs-4" />
                            Disconnect
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        );
    }

    return null;
};

export default Wallet;
