import { Descriptions, Modal } from "antd";
import { useEffect, useState } from "react";
import { CommonWord, KeywordInDocument } from "../../types/types"

type ResultsComponentProps = {
    keywords: KeywordInDocument[],
    commonWords: CommonWord | undefined,
    visible: number,
    setIsModalVisible: (condition: number) => void
}

export function ResultsComponent({ keywords, commonWords, visible, setIsModalVisible }: ResultsComponentProps) {
    const [keywordsCounted, setKeywordsCounted] = useState<any[]>([]);
    useEffect(() => {
        if (keywords) {
            const result = keywords.reduce((acc: any, _) => {
                const key = _.phrase
                if (!acc.hasOwnProperty(key)) {
                    acc[key] = 0
                }
                acc[key] += 1
                return acc
            }, {});
            setKeywordsCounted(Object.entries(result));
        }
    }, [keywords]);

    const handleOk = () => {
        setIsModalVisible(0);
    };

    const handleCancel = () => {
        setIsModalVisible(0);
    };

    return (
        <div className="results">
            <Modal
                title="Tartalmazott kulcsszavak és gyakori szavak:"
                visible={visible === 1}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Descriptions title="Előfordult kulcsszavak">
                    {keywords && keywordsCounted &&
                        keywordsCounted.map((_, idx) =>
                            <Descriptions.Item key={idx} label={_[0]}>{_[1]}</Descriptions.Item>)}
                </Descriptions>
                {commonWords &&
                    <>
                        <Descriptions title="Legyakoribb szavak">
                            {commonWords.words && commonWords.words.map((_, idx) =>
                                <Descriptions.Item key={idx} label={_.text}>{_.count}</Descriptions.Item>)}
                        </Descriptions>
                        <Descriptions title="Legyakoribb főnevek">
                            {commonWords.nouns && commonWords.nouns.map((_, idx) =>
                                <Descriptions.Item key={idx} label={_.text}>{_.count}</Descriptions.Item>)}
                        </Descriptions>
                        <Descriptions title="Legyakoribb igék">
                            {commonWords.verbs && commonWords.verbs.map((_, idx) =>
                                <Descriptions.Item key={idx} label={_.text}>{_.count}</Descriptions.Item>)}
                        </Descriptions>
                    </>
                }
            </Modal >
        </div >
    )
}