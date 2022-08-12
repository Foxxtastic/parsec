import { Button, Checkbox, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { createData, getKeywordsInDocument } from "../../helpers/fetchFunctions";
import { CommonWord, KeywordInDocument, Sentence } from "../../types/types";
import { ResultsComponent } from "./ResultsComponent";

type TextComponentProps = {
    name: string,
    sentences: string[],
    onClose: () => void
}

export function TextComponent({ name, sentences, onClose }: TextComponentProps) {
    const { Title } = Typography;
    const [isloading, setIsloading] = useState(false);
    const [approvableSentences, setApprovableSentences] = useState<Sentence[]>([]);
    const [keywords, setKeywords] = useState<KeywordInDocument[]>([]);
    const [commonWords, setCommonWords] = useState<CommonWord | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    useEffect(() => {
        setApprovableSentences(sentences.map(_ => ({
            approved: true,
            text: _,
            addAsKeyword: false
        })))
    }, [sentences])

    const toogleSentenceAproval = (index: any, type: boolean) => {
        const newSentences = [...approvableSentences];
        if (type === false) {
            newSentences[index].approved = !newSentences[index].approved;
        } else {
            newSentences[index].addAsKeyword = !newSentences[index].addAsKeyword;
        }
        setApprovableSentences(newSentences);
    }

    const findKeywordsInApprovedSentences = () => {
        //a mondatokat itt frontenden rakom egy stringbe, a backend egy string-gel gyorsabb, mint tömbbel.
        setIsloading(true)
        const textFromSentences = approvableSentences.filter(_ => _.approved).map(x => x.text).join(' ');
        getKeywordsInDocument(textFromSentences)
            .then(res => {
                setKeywords(res.keywords)
                setCommonWords(res.common_words)
            })
            .finally(() => {
                setIsloading(false);
            });
    }

    const addAsKeyword = async () => {
        setIsloading(true);
        const newKeywords = approvableSentences.filter(_ => _.addAsKeyword).map(x => x.text.toLowerCase().split(','))
        const promises = []
        for (let i = 0; i < newKeywords.length; i++) {
            promises.push(createData("https://parsec-bps74.ondigitalocean.app/backend/backend/keyword", newKeywords[i].toString()))
        }
        Promise.all(promises).finally(() => setIsloading(false))
    }

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', margin: '0.5em' }}>{name}</Title>
            {isloading ?
                <Spin /> :
                <>
                    <div className="text-content">
                        {approvableSentences.map((_, idx) =>
                            <div key={idx}>
                                <Checkbox
                                    className="checkbox-fir"
                                    checked={_.approved}
                                    onChange={() => toogleSentenceAproval(idx, false)}
                                />
                                <Checkbox
                                    className="checkbox-sec"
                                    checked={_.addAsKeyword}
                                    onChange={() => toogleSentenceAproval(idx, true)}
                                />
                                {_.text}
                            </div>)}
                    </div>
                    <Button
                        className={"button-fir"}
                        onClick={() => findKeywordsInApprovedSentences()}>
                        Kulcsszavak keresése
                    </Button>
                    <Button
                        className="button-sec"
                        onClick={() => addAsKeyword()}>
                        Hozzáadás kulcskifejezésként
                    </Button>
                    <Button
                        disabled={!keywords || !commonWords}
                        onClick={() => showModal()}>
                        Eredmény megtekintése
                    </Button>
                    <Button
                        className="right-button"
                        onClick={() => onClose()}>
                        Bezárás
                    </Button>
                </>}
            <ResultsComponent
                keywords={keywords}
                commonWords={commonWords}
                visible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />
        </>
    )
}