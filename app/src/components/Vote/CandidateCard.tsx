import React from "react";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";

export interface candidateData {
    index: string,
    name: string,
    image: string,
    votes: string
}

interface Props {
    candidate: candidateData,
    vote: Function,
    voteStarted: boolean,
    votingPeriod: string,
}

const Candidate: React.FC<Props> = ({ candidate, vote, voteStarted, votingPeriod }) => {
    const trigger = () => {
        vote(Number(candidate.index));
    };
    const canVote = () => voteStarted
    return (
        <Col key={candidate.index}>
            <Card className=" h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        {/* <span className="font-monospace text-secondary">{isAdopted() ? pet.owner : ""}</span> */}
                        <Badge bg="secondary" className="ms-auto">
                            {candidate.votes}
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className=" ratio ratio-4x3">
                    <img src={candidate.image} alt={candidate.name} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title>{candidate.name}</Card.Title>
                    <Button
                        variant="outline-dark"
                        onClick={trigger}
                        className="w-100 py-3"
                        disabled={!canVote()}
                    >
                        {canVote() ? "Vote" : `Voting Closed`}
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Candidate;