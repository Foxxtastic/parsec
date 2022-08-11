import { Button, Form, Input, Popconfirm, Spin, Table, Typography } from "antd";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { deleteData, getAllData, updateData } from "../../helpers/fetchFunctions"

type Stopword = {
    id: number,
    stop_word: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputtype: 'text';
    record: Stopword;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputtype,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export function StopwordsPage() {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [stopwords, setStopwords] = useState<Stopword[] | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        getAllStopwords();
    }, []);

    const getAllStopwords = () => {
        setIsloading(true)
        getAllData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/stopword")
            .then(res => setStopwords(res))
            .finally(() => setIsloading(false))
    }

    const isEditing = (record: Stopword) => record.id === editingId;

    const edit = (record: Stopword) => {
        form.setFieldsValue({ ...record });
        setEditingId(record.id);
    };

    const cancel = () => {
        setEditingId(null);
    };

    const save = async (key: number) => {
        try {
            setIsloading(true);
            const newStopword = (await form.validateFields()) as Stopword;
            updateData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/stopword", key, newStopword.stop_word)
                .then((res) => console.log(res))
                .finally(() => {
                    setIsloading(true);
                    setEditingId(null);
                    getAllStopwords();
                })
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            editable: false
        },
        {
            title: 'Töltelékszó',
            dataIndex: 'stop_word',
            key: 'stop_word',
            editable: true
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: any, record: Stopword) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Mentés
                        </Typography.Link>
                        <Popconfirm title="Biztosan nem?" onConfirm={cancel} className="cancel">
                            Mégsem
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingId !== null} onClick={() => edit(record)}>
                        Szerkeszt
                    </Typography.Link>
                );
            },
        },
        {
            title: '',
            key: 'delete',
            dataIndex: 'delete',
            width: '10%',
            render: (_text: any, record: Stopword) => (
                <button onClick={() => deleteData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/stopword", record.id)
                    .then((res) => console.log(res))
                    .finally(() => {
                        setIsloading(true);
                        getAllStopwords();
                    })}>
                    {"Törlés"}
                </button >
            ),
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Stopword) => ({
                record,
                inputtype: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="content">
            {stopwords && !isloading &&
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={stopwords}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        rowKey="id"
                        pagination={false}
                    />
                </Form>}
            <Button style={{ float: 'right' }} onClick={() => navigate('./add')}>Új</Button>
            {isloading && <Spin />}
        </div>
    )
}