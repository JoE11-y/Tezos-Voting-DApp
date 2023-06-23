import React, { useState } from "react"
import { Button, Form, FloatingLabel } from "react-bootstrap"

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

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(convertToSeconds(duration))
        console.log(formFields);
    };

    const addFields = () => {
        let object = { index: formFields.length, name: "", image: "" };
        setFormFields([...formFields, object]);
    };

    const removeFields = (index: number) => {
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    };

    return (
        <>
            <Form onSubmit={submit}>
                <FloatingLabel
                    controlId="inputDuration"
                    label="Enter duration in hours"
                    className="mb-3"
                >
                    <Form.Control
                        type="number"
                        name="duration"
                        onChange={(e) => { setDuration(Number(e.target.value)) }}
                        placeholder="Enter duration in hours"
                    />
                </FloatingLabel>
                {formFields.map((form, index) => {
                    return (
                        <FloatingLabel
                            controlId="inputName"
                            label={`Candidate${index}`}
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="candidate"
                                value={form.name}
                                onChange={(e) => {
                                    let name = e.target.name;
                                    let value = e.target.value
                                    handleFormChange(name, value, index)
                                }}
                                placeholder="Enter name of candidate"
                            />
                            <Form.Control
                                type="text"
                                name="candidate"
                                value={form.image}
                                onChange={(e) => {
                                    let name = e.target.name;
                                    let value = e.target.value
                                    handleFormChange(name, value, index)
                                }}
                                placeholder="Enter candidate image url"
                            />
                            <Button
                                variant="dark"
                                onClick={() => removeFields(index)}
                            >
                                Remove Candidate
                            </Button>
                        </FloatingLabel>
                    );
                })}
            </Form>
            <Button
                variant="dark"
                onClick={addFields}
            >
                Add Candidate
            </Button>
            <Button
                variant="dark"
                onClick={() => submit}
            >
                Submit
            </Button>
        </>
    )
}

export default CreateCandidates;
