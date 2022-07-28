import { Button, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createData } from "../../helpers/fetchFunctions";

const { Title } = Typography;

export function AddKeyword() {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState<string>('');

    const addKeyword = () => {
        createData("http://localhost:5000/keyword", keyword)
            .then(res => console.log(res))
            .finally(() => navigate(-1))
    }

    return (
        <div className="content">
            <Title level={2} > Kulcsszó hozzáadása</Title>
            <Input
                value={keyword}
                style={{ width: "300px" }}
                onChange={(e) => setKeyword(e.target.value.toString())} />
            <Button
                style={{ marginLeft: "20px" }}
                onClick={addKeyword}>
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