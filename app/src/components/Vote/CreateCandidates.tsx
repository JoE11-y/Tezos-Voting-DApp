import React, { useState } from "react"
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap"
import { TezosToolkit, MichelCodecParser } from "@taquito/taquito";


interface Props {
    save: Function
}

const CreateCandidates: React.FC<Props> = ({ save }) => {
    const [formFields, setFormFields] = useState([{ index: 0, name: "", image: "" }])
    const [duration, setDuration] = useState(0)

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

    const submit = async (e: any) => {
        e.preventDefault();
        let seconds = convertToSeconds(duration);
        console.log(formFields);

        // const coder = new MichelCodecParser()

        await save(formFields, seconds)
    };

    const addFields = () => {
        let object = { index: formFields.length, name: "", image: "" };
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
            <div className="main-box" style={{ border: "5px" }}>
                <div style={{ textAlign: "center" }}>
                    <h3>Adding Candidates</h3>
                </div>
                <Form onSubmit={submit}>
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

                    {formFields.map((form, index) => {
                        return (
                            <Row className="mb-3" key={index}>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Candidate Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={(e) => {
                                            let name = e.target.name;
                                            let value = e.target.value;
                                            handleFormChange(name, value, index)
                                        }}
                                        placeholder={`Enter name of candidate ${index}`}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="image"
                                        value={form.image}
                                        onChange={(e) => {
                                            let name = e.target.name;
                                            let value = e.target.value;
                                            handleFormChange(name, value, index)
                                        }}
                                        placeholder={`Enter url for candidate ${index}`}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Button
                                        variant="dark"
                                        onClick={() => removeFields(index)}
                                        style={{ marginTop: "14%" }}
                                    >
                                        Remove Candidate
                                    </Button>
                                </Form.Group>
                            </Row>
                        );
                    })}
                </Form>
                <div style={{ textAlign: "center" }}>
                    <Button
                        variant="dark"
                        onClick={addFields}
                        style={{ width: "30%" }}
                    >
                        Add Candidate
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={(e) => { submit(e) }}
                        style={{ width: "30%" }}
                    >
                        Start Session
                    </Button>
                </div>

            </div>
        </>
    )
}

export default CreateCandidates;