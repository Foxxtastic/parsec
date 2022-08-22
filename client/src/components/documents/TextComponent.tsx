import { Button, Checkbox, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { createData, getKeywordsInDocument } from "../../helpers/fetchFunctions";
import { CommonWord, KeywordInDocument, Sentence } from "../../types/types";
import { ContextMenu } from "../common/ContextMenu";
import { ResultsComponent } from "./ResultsComponent";
import { WordList } from "./WordList";

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
    const [isModalVisible, setIsModalVisible] = useState(0);
    const [selectedText, setSelectedText] = useState<string | undefined>();
    const [contextKeywords, setContextKeywords] = useState<string[]>([]);

    const showModal = (id: number) => {
        setIsModalVisible(id);
    };

    useEffect(() => {
        document.addEventListener("mouseup", () => setSelectedText(window.getSelection()?.toString().trim()));
        return () => {
            document.removeEventListener("mouseup", () => setSelectedText(window.getSelection()?.toString().trim()));
        }
    }, [])

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

    const addSentenceAsKeyword = async () => {
        setIsloading(true);
        const newKeywords = approvableSentences.filter(_ => _.addAsKeyword).map(x => x.text.toLowerCase().split(','))
        const promises = [];
        for (let i = 0; i < newKeywords.length; i++) {
            promises.push(createData("https://parsec-bps74.ondigitalocean.app/backend/keyword", newKeywords[i].toString()))
        }
        Promise.all(promises).finally(() => setIsloading(false));
    }

    const addTexttoList = (text: string) => {
        const textLowerCase = text.toLowerCase();
        const newList = [...contextKeywords]
        if (!newList.includes(textLowerCase)) {
            newList.push(textLowerCase);
            setContextKeywords(newList);
        }
    }

    const addListToKeywords = async () => {
        if (contextKeywords.length !== 0) {
            setIsloading(true);
            const promises = [];
            for (let i = 0; i < contextKeywords.length; i++) {
                promises.push(createData("https://parsec-bps74.ondigitalocean.app/backend/keyword", contextKeywords[i]))
            }
            Promise.all(promises).finally(() => setIsloading(false));
        }
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
                        onClick={() => addSentenceAsKeyword()}>
                        Hozzáadás kulcskifejezésként
                    </Button>
                    <Button
                        onClick={() => showModal(2)}>
                        Kijelölt szavak
                    </Button>
                    <Button
                        disabled={!keywords || !commonWords}
                        onClick={() => showModal(1)}>
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
            <WordList
                words={contextKeywords}
                setIsModalVisible={setIsModalVisible}
                visible={isModalVisible}
                onConfirm={addListToKeywords}
                onDelete={() => setContextKeywords([])} />
            {<ContextMenu text={selectedText} onClick={addTexttoList} />}
        </>
    )
}