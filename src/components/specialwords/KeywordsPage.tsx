import { Button, Form, Input, Popconfirm, Spin, Table, Typography } from "antd";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { deleteData, getAllData, updateData } from "../../helpers/fetchFunctions"

type Keyword = {
    id: number,
    key_word: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputtype: 'text';
    record: Keyword;
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

export function KeywordsPage() {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [keywords, setKeywords] = useState<Keyword[] | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        getAllKeywords();
    }, []);

    const getAllKeywords = () => {
        setIsloading(true)
        getAllData("http://localhost:5000/keyword")
            .then(res => setKeywords(res))
            .finally(() => setIsloading(false))
    }

    const isEditing = (record: Keyword) => record.id === editingId;

    const edit = (record: Keyword) => {
        form.setFieldsValue({ ...record });
        setEditingId(record.id);
    };

    const cancel = () => {
        setEditingId(null);
    };

    const save = async (key: number) => {
        try {
            setIsloading(true);
            const newKeyword = (await form.validateFields()) as Keyword;
            updateData("http://localhost:5000/keyword", key, newKeyword.key_word)
                .then((res) => console.log(res))
                .finally(() => {
                    setIsloading(true);
                    getAllKeywords();
                    setEditingId(null);
                })
        }
        catch (errInfo) {
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
            title: 'Kulcsszó',
            dataIndex: 'key_word',
            key: 'key_word',
            editable: true
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: any, record: Keyword) => {
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
            render: (_text: any, record: Keyword) => (
                <button onClick={() => deleteData("http://localhost:5000/keyword", record.id)
                    .then((res) => console.log(res))
                    .finally(() => {
                        setIsloading(true);
                        getAllKeywords();
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
            onCell: (record: Keyword) => ({
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
            {keywords && !isloading &&
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={keywords}
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