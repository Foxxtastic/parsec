import { Button, Checkbox, Modal, Popconfirm } from 'antd';
import { useState } from 'react';

const CheckboxGroup = Checkbox.Group;

type WordListProps = {
    words: string[],
    visible: number,
    setIsModalVisible: (condition: number) => void
    onConfirm: (values: string[]) => void
    onDelete: () => void
}

export function WordList({ words, visible, setIsModalVisible, onConfirm, onDelete }: WordListProps) {

    const [addableWords, setAddableWords] = useState<string[]>([]);

    const handleOk = () => {
        setIsModalVisible(0);
        onConfirm(addableWords);
    }

    const handleCancel = () => {
        setIsModalVisible(0);
    }

    const handleDelete = () => {
        onDelete();
    }

    function onChange(checkedValues: any) {
        setAddableWords(checkedValues);
    }

    return (
        <div>
            <Modal
                title="Kijelöléssel megjelölt szavak:"
                visible={visible === 2}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>Mégse</Button>,
                    <Popconfirm
                        title="Kijelölt szavak kulcsszóként feltöltése?"
                        onConfirm={handleOk}
                        okText="Igen"
                        cancelText="Nem">
                        <Button type='primary' key="ok">Küld</Button>,
                    </Popconfirm>,
                    <Popconfirm
                        title="Biztosan törli ezeket az elemeket?"
                        onConfirm={handleDelete}
                        okText="Igen"
                        cancelText="Nem">
                        <Button key="delete">Töröl</Button>
                    </Popconfirm>
                ]}>
                <CheckboxGroup options={words} onChange={onChange} defaultValue={words} />
            </Modal>
        </div >
    )
}