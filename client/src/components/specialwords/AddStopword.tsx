import { Button, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createData } from "../../helpers/fetchFunctions";

const { Title } = Typography;

export function AddStopword() {

    const navigate = useNavigate();
    const [stopword, setStopword] = useState<string>('');

    const addStopWord = () => {
        createData("https://
parsec - bps74.ondigitalocean.appbackend / stopword", stopword)
            .then(res => console.log(res))
            .finally(() => navigate(-1))
    }

    return (
        <div className="content">
            <Title level={2} > Töltelékszó hozzáadása</Title>
            <Input
                value={stopword}
                style={{ width: "300px" }}
                onChange={(e) => setStopword(e.target.value.toString())} />
            <Button
                style={{ marginLeft: "20px" }}
                onClick={addStopWord}>
                OK
            </Button>
            <Button
                style={{ marginLeft: "20px" }}
                onClick={() => navigate(-1)}>
                Mégsem
            </Button>
        </div>
    )
}