import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify"
import CreateCandidates from "./CreateCandidates"
import Candidate from "./CandidateCard"
import Loader from "../Loader"
import { Row } from "react-bootstrap"
import { candidateData } from "./CandidateCard"
import { TezosToolkit, WalletContract, MichelsonMap } from "@taquito/taquito";


interface UpdateContractProps {
    contract: WalletContract | any;
    setUserBalance: Dispatch<SetStateAction<any>>;
    Tezos: TezosToolkit;
    userAddress: string;
    setStorage: Dispatch<SetStateAction<any>>;
    storage: any;
}


const VotingPlatform = ({ contract, setUserBalance, Tezos, userAddress, setStorage, storage }: UpdateContractProps) => {
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<candidateData[]>([])

    const getKeys = useCallback((candidate: MichelsonMap<number, candidateData>) => {
        if (candidate) {
            const foreachPairs: candidateData[] = [];
            candidate.forEach((val: candidateData, key: number) => {
                val.index = val.index.toString()
                val.votes = val.votes.toString()
                foreachPairs.push(val);
            });
            setCandidates(foreachPairs)
        }
    }, [])

    // start vote session
    const startVoteSession = async (data: any, voteDuration: number) => {
        setLoading(true)
        try {
            const op = await contract.methods.init(data, voteDuration).send();
            await op.confirmation();
            const newStorage: any = await contract.storage();
            if (newStorage) setStorage(newStorage);
            setUserBalance(await Tezos.tz.getBalance(userAddress));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    //  function to initiate transaction
    const vote = async (id: number) => {
        setLoading(true);
        try {
            const op = await contract.methods.vote(id).send({ "mutez": true, "amount": 500000 })
            await op.confirmation();
            const newStorage: any = await contract.storage();
            if (newStorage) setStorage(newStorage);
            setUserBalance(await Tezos.tz.getBalance(userAddress));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (storage.candidates) {
            const candidate: MichelsonMap<number, candidateData> = storage ? storage.candidates : null
            getKeys(candidate)
        }
    }, [storage, getKeys])

    return (
        <>
            <>
                <div className="text-start container">

                    <div
                        id="votingNotice"
                        className="mb-4"
                        style={{ marginTop: "1em" }}
                    >
                        <span>
                            <i className="bi bi-bell-fill"></i> Voting Fee is 0.5tz
                        </span>
                    </div>
                </div>
                {
                    storage.admin === userAddress && <div className="d-flex justify-content-between align-items-center mb-4">
                        <CreateCandidates save={startVoteSession} />
                    </div>
                }
                <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                    {candidates.map((_candidate: candidateData, index) => (
                        <Candidate
                            key={index}
                            candidate={_candidate}
                            vote={vote}
                            voteStarted={storage.vote_started}
                            votingPeriod={storage.voting_end_time}
                        />
                    ))}
                </Row>
            </>
        </>
    )
}

export default VotingPlatform
