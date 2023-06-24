import React, { useState } from "react"
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap"
import { v4 as uuid4 } from "uuid"

interface Props {
    save: Function
    close: Function
    voteStarted: boolean
    votingPeriod: string
}

const AdminDashboard: React.FC<Props> = ({ save, close, voteStarted, votingPeriod }) => {
    const [formFields, setFormFields] = useState([{ index: uuid4(), name: "", image: "" }])
    const [duration, setDuration] = useState(0)
    const [title, setTitle] = useState("")

    const sessionEnded = () => {
        let now = Date.now();
        let end = new Date(votingPeriod)
        return now > end.getTime()
    }

    const handleFormChange = (name: string, value: string, index: number) => {
        const updatedFormFields = formFields.map((field, i) => {
            if (i === index) {
                return { ...field, [name]: value };
            }
            return field;
        });
        setFormFields(updatedFormFields);
    };

    const convertToSeconds = (hrs: number) => {
        return hrs * 3600;
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let seconds = convertToSeconds(duration);
        await save(formFields, seconds, title);

        const resetForm = e.target as HTMLFormElement;
        resetForm.reset();
        setFormFields([{ index: uuid4(), name: "", image: "" }])
    };

    const addFields = () => {
        let object = { index: uuid4(), name: "", image: "" };
        setFormFields([...formFields, object]);
    };

    const removeFields = (index: number) => {
        if (formFields.length === 1) return;
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    };

    return (
        <>
            <div className="main-box" style={{ fontSize: "5em !important" }}>
                <div style={{ textAlign: "center" }}>
                    <h3>ADMIN DASHBOARD</h3>
                </div>
                <Form onSubmit={submit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                onChange={(e) => { setTitle(e.target.value) }}
                                placeholder="Enter Session Title"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Vote Duration</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>0</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    onChange={(e) => { setDuration(Number(e.target.value)) }}
                                    placeholder="Enter duration in hours"
                                />
                                <InputGroup.Text>hrs</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Form.Label>Candidates</Form.Label>
                    {formFields.map((form, index) => {
                        return (
                            <Row className="mb-3" key={index}>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={(e) => {
                                            let name = e.target.name;
                                            let value = e.target.value;
                                            handleFormChange(name, value, index)
                                        }}
                                        placeholder={`Enter Name`}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Control
                                        type="text"
                                        name="image"
                                        value={form.image}
                                        onChange={(e) => {
                                            let name = e.target.name;
                                            let value = e.target.value;
                                            handleFormChange(name, value, index)
                                        }}
                                        placeholder={`Enter image url`}
                                    />
                                </Form.Group>
                                <Button
                                    variant="danger"
                                    onClick={() => removeFields(index)}
                                    style={{ width: "10%", padding: "2px" }}
                                >
                                    x
                                </Button>
                            </Row>
                        );
                    })}

                    <div style={{ textAlign: "center", padding: "10px" }}>
                        <Button
                            variant="dark"
                            onClick={addFields}
                            style={{ width: "40%" }}
                            disabled={voteStarted}
                        >
                            Add Candidate
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                            variant="primary"
                            type="submit"
                            style={{ width: "40%" }}
                            disabled={voteStarted}
                        >
                            Start Session
                        </Button>
                    </div>

                </Form>

                <div style={{ textAlign: "center" }}>
                    <Button
                        variant="danger"
                        onClick={() => close()}
                        disabled={!sessionEnded()}
                        style={{ width: "80%" }}
                    >
                        End Session
                    </Button>
                    &nbsp; &nbsp;

                </div>

            </div>
        </>
    )
}

export default AdminDashboard;