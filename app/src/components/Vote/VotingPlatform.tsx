import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify"
import AdminDashboard from "./AdminDashboard"
import Candidate from "./CandidateCard"
import Loader from "../Loader"
import { Col, Row } from "react-bootstrap"
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

    const checkIfUserHasVoted = (): boolean => {
        if (storage.voters) {
            return storage.voters.get(userAddress);
        }
        return false
    }

    // start vote session
    const startVoteSession = async (data: any, voteDuration: number, title: string) => {
        setLoading(true)
        try {
            const op = await contract.methods.start(data, voteDuration, title).send();
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
    const vote = async (id: string) => {
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

    //  function to close
    const getWinner = async () => {
        setLoading(true);
        try {
            const op = await contract.methods.getWinner().send()
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
            <Row className="g-3 mb-5 g-xl-4 g-xxl-5" style={{ padding: "10px" }}>
                {
                    storage.admin === userAddress &&
                    <Col xs={6} md={4} key={0}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <AdminDashboard save={startVoteSession} close={getWinner} voteStarted={storage.vote_started} votingPeriod={storage.voting_end_time} />
                        </div>
                    </Col>
                }
                <Col key={1}>
                    <div style={{ textAlign: "center" }}>
                        <h3>{storage.title ? storage.title.toUpperCase() : ""}</h3>
                    </div>
                    <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                        {candidates.map((_candidate: candidateData, index) => (
                            <Candidate
                                key={index}
                                candidate={_candidate}
                                vote={vote}
                                voteStarted={storage.vote_started}
                                votingPeriod={storage.voting_end_time}
                                hasVoted={checkIfUserHasVoted()}
                            />
                        ))}
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default VotingPlatform
