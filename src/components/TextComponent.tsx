import { Checkbox, Typography } from "antd";
import { useEffect, useState } from "react"

type Line = {
    text: string,
    active: boolean
}

type TextComponentProps = {
    name: string,
    content: string | null
}

const getTextLines = (text: string): Line[] => {
    return text.split(/\r?\n/).map(_ => ({
        text: _,
        active: false
    })
    );
}

export function TextComponent({ name, content }: TextComponentProps) {
    const [lines, setLines] = useState<Line[]>([]);
    const { Title } = Typography;

    useEffect(() => {
        content && setLines(getTextLines(content))
    }, [content]);

    const toggleActiveLine = (index: number) => {
        setLines(lines.map((_, idx) => idx !== index ? _ :
            ({ text: _.text, active: !_.active })
        ));
    }

    return (
        <>
            <Title level={2} style={{ textAlign: 'center', margin: '0.5em' }}>{name}</Title>
            {lines.length !== 0 &&
                <div className="text_content">
                    {lines.map((_, idx) =>
                        <div key={idx} className="text_line">
                            {_.text !== '' && <Checkbox
                                onChange={() => toggleActiveLine(idx)}>
                            </Checkbox>}
                            {_.text}
                        </div>
                    )}
                </div>}
        </>
    )
}